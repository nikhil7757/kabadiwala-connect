import { Prisma } from '@prisma/client';
import {
  SyncPayloadDto,
  createLotSchema,
  selectRecyclerSchema,
} from '@kabadiwala/shared';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';
import { LotService } from './lot.service.js';
import { HandoverService } from './handover.service.js';

export interface SyncActionResult {
  actionId: string;
  status: 'APPLIED' | 'DUPLICATE' | 'REJECTED';
  error?: { code: string; message: string };
  serverLotId?: string;
  refCode?: string;
}

export class SyncService {
  /**
   * Processes client action outbox in order and computes delta updates
   */
  static async processSync(collectorId: string, input: SyncPayloadDto) {
    const { deviceId, since, actions } = input;
    const sinceDate = since ? new Date(since) : null;

    // 1. Sort actions chronologically by createdAt ascending
    const sortedActions = [...actions].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const results: SyncActionResult[] = [];

    // 2. Replay each action in its own database transaction
    for (const act of sortedActions) {
      // Check for duplicate actionId
      const existingAction = await prisma.syncAction.findUnique({
        where: { actionId: act.actionId },
      });

      if (existingAction) {
        let refCode: string | undefined;
        if (existingAction.serverLotId) {
          const l = await prisma.lot.findUnique({
            where: { id: existingAction.serverLotId },
            select: { refCode: true },
          });
          refCode = l?.refCode;
        }

        results.push({
          actionId: act.actionId,
          status: 'DUPLICATE',
          serverLotId: existingAction.serverLotId || undefined,
          refCode,
        });
        continue;
      }

      try {
        let serverLotId: string | undefined;
        let refCode: string | undefined;

        switch (act.type) {
          case 'LOT_CREATE': {
            const parsed = createLotSchema.parse(act.payload);
            const lotRes = await LotService.createLot(collectorId, parsed);
            serverLotId = lotRes.lot.id;
            refCode = lotRes.lot.refCode;
            break;
          }

          case 'SELECT_RECYCLER': {
            const { lotClientId, recyclerId, pickupRequested } = act.payload;
            if (!lotClientId) throw AppError.validation('Missing lotClientId in SELECT_RECYCLER');
            const lot = await prisma.lot.findUnique({ where: { clientId: lotClientId } });
            if (!lot) throw AppError.notFound(`Lot with clientId ${lotClientId} not found`);

            const parsed = selectRecyclerSchema.parse({ recyclerId, pickupRequested });
            const updated = await LotService.selectRecycler(lot.id, collectorId, parsed);
            serverLotId = updated.id;
            refCode = updated.refCode;
            break;
          }

          case 'ACCEPT_QUOTE': {
            const { lotClientId } = act.payload;
            if (!lotClientId) throw AppError.validation('Missing lotClientId in ACCEPT_QUOTE');
            const lot = await prisma.lot.findUnique({ where: { clientId: lotClientId } });
            if (!lot) throw AppError.notFound(`Lot with clientId ${lotClientId} not found`);

            const updated = await LotService.acceptQuote(lot.id, collectorId);
            serverLotId = updated.id;
            refCode = updated.refCode;
            break;
          }

          case 'CANCEL_LOT': {
            const { lotClientId } = act.payload;
            if (!lotClientId) throw AppError.validation('Missing lotClientId in CANCEL_LOT');
            const lot = await prisma.lot.findUnique({ where: { clientId: lotClientId } });
            if (!lot) throw AppError.notFound(`Lot with clientId ${lotClientId} not found`);

            const updated = await LotService.cancelLot(lot.id, collectorId);
            serverLotId = updated.id;
            refCode = updated.refCode;
            break;
          }

          case 'HANDOVER_INITIATE': {
            const { lotClientId, weightKg, lat, lng, handoverAt } = act.payload;
            if (!lotClientId) throw AppError.validation('Missing lotClientId in HANDOVER_INITIATE');
            const lot = await prisma.lot.findUnique({ where: { clientId: lotClientId } });
            if (!lot) throw AppError.notFound(`Lot with clientId ${lotClientId} not found`);

            await HandoverService.initiateHandover(lot.id, collectorId, {
              weightKg: Number(weightKg),
              lat: lat ? Number(lat) : undefined,
              lng: lng ? Number(lng) : undefined,
              handoverAt: handoverAt ? new Date(handoverAt) : undefined,
            });
            serverLotId = lot.id;
            refCode = lot.refCode;
            break;
          }

          default:
            throw AppError.validation(`Unknown action type: ${act.type}`);
        }

        // Record successful sync action
        await prisma.syncAction.create({
          data: {
            actionId: act.actionId,
            collectorId,
            deviceId,
            type: act.type as any,
            status: 'APPLIED',
            serverLotId: serverLotId || null,
            clientCreatedAt: new Date(act.createdAt),
          },
        });

        results.push({
          actionId: act.actionId,
          status: 'APPLIED',
          serverLotId,
          refCode,
        });
      } catch (err: any) {
        const code = err instanceof AppError ? err.code : 'SYNC_ACTION_ERROR';
        const message = err.message || 'Error processing sync action';

        await prisma.syncAction.create({
          data: {
            actionId: act.actionId,
            collectorId,
            deviceId,
            type: act.type as any,
            status: 'REJECTED',
            errorCode: code,
            errorMessage: message,
            clientCreatedAt: new Date(act.createdAt),
          },
        });

        results.push({
          actionId: act.actionId,
          status: 'REJECTED',
          error: { code, message },
        });
      }
    }

    // 3. Assemble updates delta for client
    const collector = await prisma.collector.findUnique({
      where: { id: collectorId },
      select: { district: true, state: true },
    });

    const [materials, rawPrices, recyclers, lots, ledger, safety] = await Promise.all([
      // Materials
      prisma.materialCategory.findMany({
        where: { isActive: true },
        include: { subCategories: true },
        orderBy: { sortOrder: 'asc' },
      }),

      // Prices: 60-day window or updatedSince
      prisma.priceEntry.findMany({
        where: sinceDate
          ? { createdAt: { gte: sinceDate } }
          : {
              recordedAt: {
                gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
              },
            },
        orderBy: { recordedAt: 'desc' },
        take: 300,
      }),

      // Verified Recyclers with current rates
      prisma.recycler.findMany({
        where: { authorizationStatus: 'VERIFIED' },
        include: {
          materials: true,
        },
      }),

      // Collector's own lots
      prisma.lot.findMany({
        where: {
          collectorId,
          ...(sinceDate ? { updatedAt: { gte: sinceDate } } : {}),
        },
        include: {
          photos: { select: { id: true, sha256: true, purpose: true, sizeBytes: true, takenAt: true } },
          handover: true,
          selectedRecycler: { select: { id: true, name: true, phone: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),

      // Collector's ledger entries
      prisma.ledgerEntry.findMany({
        where: {
          collectorId,
          ...(sinceDate ? { updatedAt: { gte: sinceDate } } : {}),
        },
        orderBy: { createdAt: 'desc' },
      }),

      // Safety tips
      prisma.safetyTip.findMany({
        orderBy: { sortOrder: 'asc' },
      }),
    ]);

    // Enhance lots with handover code if status is HANDED_OVER or later
    const enhancedLots = lots.map((lot) => {
      let handoverInfo = undefined;
      if (lot.handover) {
        const otp = HandoverService.deriveHandoverCode(lot.handover.handoverRef);
        const qrPayload = Buffer.from(
          JSON.stringify({
            v: 1,
            t: 'KC-HO',
            ref: lot.handover.handoverRef,
            lot: lot.id,
            w: lot.handover.weightKg,
          })
        ).toString('base64url');

        handoverInfo = {
          ...lot.handover,
          otp,
          qrPayload,
        };
      }

      return {
        ...lot,
        handover: handoverInfo,
      };
    });

    return {
      results,
      updates: {
        materials,
        prices: rawPrices,
        recyclers,
        lots: enhancedLots,
        ledger,
        safety,
      },
      serverTime: new Date().toISOString(),
    };
  }
}
