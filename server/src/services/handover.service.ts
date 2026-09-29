import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';
import { config } from '../config.js';
import { AnomalyService } from './anomaly.service.js';
import { TraceService } from './trace.service.js';

export class HandoverService {
  /**
   * Derives a deterministic 6-digit code from handoverRef via HMAC-SHA256
   * (BACKEND.md 6.2)
   */
  static deriveHandoverCode(handoverRef: string): string {
    const hmac = crypto.createHmac('sha256', config.JWT_SECRET);
    hmac.update(handoverRef);
    const digest = hmac.digest();
    const num = digest.readUInt32BE(0);
    const code = (num % 1_000_000).toString().padStart(6, '0');
    return code;
  }

  /**
   * Generates handoverRef: HO-<last 8 digits of refCode>-<4 uppercase alphanumerics>
   */
  static generateHandoverRef(refCode: string): string {
    const digitsOnly = refCode.replace(/\D/g, '');
    const last8Digits = digitsOnly.slice(-8).padStart(8, '0');
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4);
    return `HO-${last8Digits}-${randomSuffix}`;
  }

  /**
   * Collector initiates handover: generates ref, QR payload, and sets status HANDED_OVER
   */
  static async initiateHandover(
    lotId: string,
    collectorId: string,
    input: { weightKg: number; lat?: number | null; lng?: number | null; handoverAt?: Date }
  ) {
    return prisma.$transaction(async (tx) => {
      const lot = await tx.lot.findUnique({
        where: { id: lotId },
        include: { handover: true },
      });

      if (!lot) throw AppError.notFound('Lot not found');
      if (lot.collectorId !== collectorId) throw AppError.forbidden('Not your lot');
      if (lot.status !== 'ACCEPTED') {
        throw AppError.invalidState(`Cannot initiate handover from status ${lot.status}. Expected ACCEPTED.`);
      }

      // If already initiated, return existing details
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

        return {
          handoverRef: lot.handover.handoverRef,
          otp,
          qrPayload,
          expiresAt: lot.handover.otpExpiresAt,
        };
      }

      // Monotonic reference and 24h expiration for prototype offline handovers
      const handoverRef = HandoverService.generateHandoverRef(lot.refCode);
      const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      const handoverAt = input.handoverAt || new Date();

      const handover = await tx.handover.create({
        data: {
          lotId,
          handoverRef,
          otpExpiresAt,
          weightKg: input.weightKg,
          lat: input.lat || null,
          lng: input.lng || null,
          handoverAt,
        },
      });

      await tx.lot.update({
        where: { id: lotId },
        data: {
          status: 'HANDED_OVER',
          handedOverAt: handoverAt,
        },
      });

      const otp = HandoverService.deriveHandoverCode(handoverRef);
      const qrPayload = Buffer.from(
        JSON.stringify({
          v: 1,
          t: 'KC-HO',
          ref: handoverRef,
          lot: lot.id,
          w: input.weightKg,
        })
      ).toString('base64url');

      await TraceService.appendTraceRecord(tx, lotId, 'HANDOVER_INITIATED', {
        handoverRef,
        declaredWeightKg: input.weightKg,
        handoverAt: handoverAt.toISOString(),
      });

      return {
        handoverRef,
        otp,
        qrPayload,
        expiresAt: otpExpiresAt,
      };
    });
  }

  /**
   * Recycler confirms handover by QR payload or reference + OTP code
   */
  static async confirmHandover(
    recyclerId: string,
    input: {
      handoverRef?: string;
      otp?: string;
      qrPayload?: string;
      weightKgVerified: number;
      method: 'QR' | 'OTP';
    }
  ) {
    let resolvedRef = input.handoverRef;

    // Decode QR payload if provided
    if (input.method === 'QR' && input.qrPayload) {
      try {
        const decodedStr = Buffer.from(input.qrPayload, 'base64url').toString('utf-8');
        const parsed = JSON.parse(decodedStr);
        if (parsed.t !== 'KC-HO' || !parsed.ref) {
          throw new Error('Invalid QR payload tag');
        }
        resolvedRef = parsed.ref;
      } catch (err) {
        throw AppError.validation('Invalid or corrupted QR payload');
      }
    }

    if (!resolvedRef) {
      throw AppError.validation('Missing handover reference or QR payload');
    }

    return prisma.$transaction(async (tx) => {
      const handover = await tx.handover.findUnique({
        where: { handoverRef: resolvedRef },
        include: { lot: true },
      });

      if (!handover) throw AppError.notFound('Handover reference not found');

      // Verify recipient authorization
      if (handover.lot.selectedRecyclerId !== recyclerId) {
        throw AppError.forbidden('You are not the designated recipient recycler for this lot');
      }

      if (handover.lot.status !== 'HANDED_OVER') {
        throw AppError.invalidState(`Cannot confirm handover in lot status ${handover.lot.status}. Expected HANDED_OVER.`);
      }

      // Check attempt lockout
      if (handover.otpAttempts >= 5) {
        throw AppError.rateLimited('Maximum verification attempts exceeded for this handover code');
      }

      // Check expiration
      if (handover.otpExpiresAt < new Date()) {
        throw AppError.otpInvalid('Handover code has expired');
      }

      // If OTP method, verify code with constant-time comparison
      if (input.method === 'OTP') {
        if (!input.otp) throw AppError.validation('Missing 6-digit OTP code');
        const expectedCode = HandoverService.deriveHandoverCode(handover.handoverRef);
        const bufA = Buffer.from(input.otp);
        const bufB = Buffer.from(expectedCode);

        const match = bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
        if (!match) {
          await tx.handover.update({
            where: { id: handover.id },
            data: { otpAttempts: { increment: 1 } },
          });
          throw AppError.otpInvalid('Incorrect 6-digit handover code');
        }
      }

      // Weight divergence check (> 15%)
      const weightDivergence = AnomalyService.evaluateWeightDifference(
        handover.weightKg,
        input.weightKgVerified
      );

      const now = new Date();
      const finalPrice = handover.lot.quotedPrice;

      // Update handover
      const updatedHandover = await tx.handover.update({
        where: { id: handover.id },
        data: {
          recyclerConfirmed: true,
          confirmedAt: now,
          confirmedByRecyclerId: recyclerId,
          weightKgVerified: input.weightKgVerified,
          weightDiffPercent: weightDivergence.diffPercent,
          confirmMethod: input.method,
        },
      });

      // Update lot: status -> CONFIRMED, finalPrice = quotedPrice
      const lotUpdateData: Prisma.LotUpdateInput = {
        status: 'CONFIRMED',
        confirmedAt: now,
        finalPrice,
      };

      const warnings: string[] = [];
      if (weightDivergence.anomalyFlag) {
        lotUpdateData.anomalyFlag = true;
        lotUpdateData.anomalyReason = handover.lot.anomalyReason
          ? `${handover.lot.anomalyReason}; ${weightDivergence.anomalyReason}`
          : weightDivergence.anomalyReason;
        warnings.push('WEIGHT_DIFFERENCE');
      }

      const updatedLot = await tx.lot.update({
        where: { id: handover.lotId },
        data: lotUpdateData,
      });

      // Create initial pending ledger entry (dueAmount = finalPrice)
      await tx.ledgerEntry.create({
        data: {
          lotId: handover.lotId,
          collectorId: handover.lot.collectorId,
          recyclerId,
          amountPaid: new Prisma.Decimal('0.00'),
          dueAmount: finalPrice || new Prisma.Decimal('0.00'),
          mode: 'CASH',
          status: 'PENDING',
        },
      });

      // Append trace record
      await TraceService.appendTraceRecord(tx, handover.lotId, 'HANDOVER_CONFIRMED', {
        handoverRef: handover.handoverRef,
        verifiedWeightKg: input.weightKgVerified,
        weightDiffPercent: weightDivergence.diffPercent,
        confirmedByRecyclerId: recyclerId,
        finalPrice: finalPrice?.toString(),
      });

      return {
        handover: updatedHandover,
        lot: updatedLot,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    });
  }
}
