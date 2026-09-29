import { Prisma, PrismaClient } from '@prisma/client';
import { CreateLotDto, SelectRecyclerDto, QuoteLotDto } from '@kabadiwala/shared';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';
import { config } from '../config.js';
import { TraceService } from './trace.service.js';
import { AnomalyService } from './anomaly.service.js';

export class LotService {
  /**
   * Generates a sequential daily reference code: KC-<STATE>-<YYYYMMDD>-<NNNN> (BACKEND.md 3.4)
   */
  static async generateRefCode(
    tx: Prisma.TransactionClient,
    stateCode = config.DEFAULT_STATE_CODE
  ): Promise<string> {
    const now = new Date();
    const yyyy = now.getUTCFullYear().toString();
    const mm = (now.getUTCMonth() + 1).toString().padStart(2, '0');
    const dd = now.getUTCDate().toString().padStart(2, '0');
    const datePrefix = `KC-${stateCode}-${yyyy}${mm}${dd}-`;

    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

    const todayCount = await tx.lot.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        refCode: {
          startsWith: datePrefix,
        },
      },
    });

    const nextSeq = (todayCount + 1).toString().padStart(4, '0');
    return `${datePrefix}${nextSeq}`;
  }

  /**
   * Creates a new lot with client-generated idempotency key (clientId)
   */
  static async createLot(collectorId: string, input: CreateLotDto) {
    // 1. Idempotency check: if lot with this clientId already exists, return it
    const existing = await prisma.lot.findUnique({
      where: { clientId: input.clientId },
      include: { photos: true, selectedRecycler: true },
    });

    if (existing) {
      return { lot: existing, isExisting: true };
    }

    // 2. Look up collector state for refCode
    const collector = await prisma.collector.findUnique({
      where: { id: collectorId },
      select: { state: true },
    });
    const stateCode = collector?.state || config.DEFAULT_STATE_CODE;

    // 3. Create inside transaction with monotonic refCode and trace event
    const lot = await prisma.$transaction(async (tx) => {
      let refCode = await LotService.generateRefCode(tx, stateCode);

      // Unique conflict retry backstop
      let created;
      try {
        created = await tx.lot.create({
          data: {
            clientId: input.clientId,
            refCode,
            collectorId,
            categoryId: input.categoryId,
            subCategoryCode: input.subCategory || null,
            description: input.description || null,
            condition: input.condition,
            sourceType: input.sourceType || null,
            approxWeightKg: input.approxWeightKg,
            estimatedValue: new Prisma.Decimal(input.estimatedValue),
            aiLabel: input.aiLabel || null,
            aiConfidence: input.aiConfidence || null,
            lat: input.lat || null,
            lng: input.lng || null,
            locationSource: input.lat && input.lng ? 'GPS' : 'DISTRICT',
            collectedAt: input.collectedAt,
            status: 'DRAFT',
          },
        });
      } catch (err: any) {
        if (err.code === 'P2002' && err.meta?.target?.includes('refCode')) {
          // Retry with fresh count on conflict
          refCode = await LotService.generateRefCode(tx, stateCode);
          created = await tx.lot.create({
            data: {
              clientId: input.clientId,
              refCode,
              collectorId,
              categoryId: input.categoryId,
              subCategoryCode: input.subCategory || null,
              description: input.description || null,
              condition: input.condition,
              sourceType: input.sourceType || null,
              approxWeightKg: input.approxWeightKg,
              estimatedValue: new Prisma.Decimal(input.estimatedValue),
              aiLabel: input.aiLabel || null,
              aiConfidence: input.aiConfidence || null,
              lat: input.lat || null,
              lng: input.lng || null,
              locationSource: input.lat && input.lng ? 'GPS' : 'DISTRICT',
              collectedAt: input.collectedAt,
              status: 'DRAFT',
            },
          });
        } else {
          throw err;
        }
      }

      // Append LOT_CREATED event in trace hash chain
      await TraceService.appendTraceRecord(tx, created.id, 'LOT_CREATED', {
        refCode: created.refCode,
        categoryId: created.categoryId,
        approxWeightKg: created.approxWeightKg,
        estimatedValue: created.estimatedValue.toString(),
        collectorId: created.collectorId,
      });

      return created;
    });

    return { lot, isExisting: false };
  }

  /**
   * Collector selects an authorized recycler (DRAFT -> LISTED)
   */
  static async selectRecycler(lotId: string, collectorId: string, input: SelectRecyclerDto) {
    return prisma.$transaction(async (tx) => {
      const lot = await tx.lot.findUnique({ where: { id: lotId } });
      if (!lot) throw AppError.notFound('Lot not found');
      if (lot.collectorId !== collectorId) throw AppError.forbidden('Not your lot');
      if (lot.status !== 'DRAFT') {
        throw AppError.invalidState(`Cannot select buyer from status ${lot.status}. Expected DRAFT.`);
      }

      // Check recycler status: must be VERIFIED
      const recycler = await tx.recycler.findUnique({
        where: { id: input.recyclerId },
        select: { authorizationStatus: true, name: true },
      });
      if (!recycler) throw AppError.notFound('Recycler not found');
      if (recycler.authorizationStatus !== 'VERIFIED') {
        throw AppError.recyclerNotVerified('Selected buyer is not in VERIFIED status');
      }

      const now = new Date();
      const updated = await tx.lot.update({
        where: { id: lotId },
        data: {
          selectedRecyclerId: input.recyclerId,
          pickupRequested: input.pickupRequested,
          selectedAt: now,
          status: 'LISTED',
        },
      });

      await TraceService.appendTraceRecord(tx, lotId, 'RECYCLER_SELECTED', {
        recyclerId: input.recyclerId,
        pickupRequested: input.pickupRequested,
      });

      return updated;
    });
  }

  /**
   * Recycler submits a price quote (LISTED -> QUOTED)
   */
  static async quoteLot(lotId: string, recyclerId: string, input: QuoteLotDto) {
    return prisma.$transaction(async (tx) => {
      const lot = await tx.lot.findUnique({ where: { id: lotId } });
      if (!lot) throw AppError.notFound('Lot not found');
      if (lot.selectedRecyclerId !== recyclerId) {
        throw AppError.forbidden('You are not the selected recycler for this lot');
      }
      if (lot.status !== 'LISTED') {
        throw AppError.invalidState(`Cannot quote lot in status ${lot.status}. Expected LISTED.`);
      }

      const recycler = await tx.recycler.findUnique({
        where: { id: recyclerId },
        select: { city: true, authorizationStatus: true },
      });
      if (!recycler || recycler.authorizationStatus !== 'VERIFIED') {
        throw AppError.forbidden('Recycler is not verified to quote lots');
      }

      const quotedNum = parseFloat(input.quotedPrice);
      const anomalyCheck = await AnomalyService.evaluateLotQuote(
        lot.categoryId,
        recycler.city,
        quotedNum,
        lot.approxWeightKg
      );

      const now = new Date();
      const updated = await tx.lot.update({
        where: { id: lotId },
        data: {
          quotedPrice: new Prisma.Decimal(input.quotedPrice),
          quotedAt: now,
          status: 'QUOTED',
          anomalyFlag: anomalyCheck.anomalyFlag,
          anomalyReason: anomalyCheck.anomalyReason,
          anomalyDetail: anomalyCheck.anomalyDetail || Prisma.DbNull,
        },
      });

      await TraceService.appendTraceRecord(tx, lotId, 'QUOTED', {
        quotedPrice: input.quotedPrice,
        recyclerId,
        anomalyFlag: anomalyCheck.anomalyFlag,
      });

      return updated;
    });
  }

  /**
   * Collector accepts quote (QUOTED -> ACCEPTED)
   */
  static async acceptQuote(lotId: string, collectorId: string) {
    return prisma.$transaction(async (tx) => {
      const lot = await tx.lot.findUnique({ where: { id: lotId } });
      if (!lot) throw AppError.notFound('Lot not found');
      if (lot.collectorId !== collectorId) throw AppError.forbidden('Not your lot');
      if (lot.status !== 'QUOTED') {
        throw AppError.invalidState(`Cannot accept quote from status ${lot.status}. Expected QUOTED.`);
      }

      const now = new Date();
      const updated = await tx.lot.update({
        where: { id: lotId },
        data: {
          acceptedAt: now,
          status: 'ACCEPTED',
        },
      });

      await TraceService.appendTraceRecord(tx, lotId, 'QUOTE_ACCEPTED', {
        quotedPrice: lot.quotedPrice?.toString(),
        acceptedAt: now.toISOString(),
      });

      return updated;
    });
  }

  /**
   * Collector cancels lot (Allowed from DRAFT, LISTED, QUOTED, ACCEPTED)
   */
  static async cancelLot(lotId: string, collectorId: string) {
    return prisma.$transaction(async (tx) => {
      const lot = await tx.lot.findUnique({ where: { id: lotId } });
      if (!lot) throw AppError.notFound('Lot not found');
      if (lot.collectorId !== collectorId) throw AppError.forbidden('Not your lot');

      const allowedStatuses = ['DRAFT', 'LISTED', 'QUOTED', 'ACCEPTED'];
      if (!allowedStatuses.includes(lot.status)) {
        throw AppError.invalidState(`Cannot cancel lot in status ${lot.status}.`);
      }

      const now = new Date();
      const updated = await tx.lot.update({
        where: { id: lotId },
        data: {
          cancelledAt: now,
          status: 'CANCELLED',
        },
      });

      await TraceService.appendTraceRecord(tx, lotId, 'CANCELLED', {
        previousStatus: lot.status,
        cancelledAt: now.toISOString(),
      });

      return updated;
    });
  }
}
