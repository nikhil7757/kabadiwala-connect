import { Prisma } from '@prisma/client';
import { CreateLedgerEntryDto } from '@kabadiwala/shared';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';
import { TraceService } from './trace.service.js';

export class LedgerService {
  /**
   * Retrieves ledger entries and financial totals per BACKEND.md 6.3
   */
  static async getLedgerForUser(userId: string, role: string) {
    const where: any = {};
    if (role === 'COLLECTOR') {
      where.collectorId = userId;
    } else if (role === 'RECYCLER') {
      where.recyclerId = userId;
    }

    const entries = await prisma.ledgerEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        lot: {
          select: {
            id: true,
            refCode: true,
            status: true,
            finalPrice: true,
            category: { select: { code: true, nameEn: true, nameHi: true, nameMr: true } },
          },
        },
        recycler: { select: { id: true, name: true } },
      },
    });

    // Compute totals
    let earned = new Prisma.Decimal('0.00');
    let pending = new Prisma.Decimal('0.00');

    if (role === 'COLLECTOR') {
      // Earned: sum of amountPaid across all entries
      for (const entry of entries) {
        earned = earned.plus(entry.amountPaid);
      }

      // Pending: find all CONFIRMED lots for this collector and sum uncollected balances
      const confirmedLots = await prisma.lot.findMany({
        where: {
          collectorId: userId,
          status: { in: ['CONFIRMED', 'PAID'] },
        },
        include: {
          ledger: { select: { amountPaid: true } },
        },
      });

      for (const lot of confirmedLots) {
        if (!lot.finalPrice) continue;
        const totalPaidForLot = lot.ledger.reduce(
          (acc, cur) => acc.plus(cur.amountPaid),
          new Prisma.Decimal('0.00')
        );
        const remainingDue = lot.finalPrice.minus(totalPaidForLot);
        if (remainingDue.greaterThan(0)) {
          pending = pending.plus(remainingDue);
        }
      }
    }

    return {
      entries,
      totals: {
        earned: earned.toFixed(2),
        pending: pending.toFixed(2),
      },
    };
  }

  /**
   * Recycler records a payment (cash or UPI)
   */
  static async recordPayment(recyclerId: string, input: CreateLedgerEntryDto) {
    const amountNum = new Prisma.Decimal(input.amountPaid);

    return prisma.$transaction(async (tx) => {
      const lot = await tx.lot.findUnique({
        where: { id: input.lotId },
        include: {
          ledger: true,
        },
      });

      if (!lot) throw AppError.notFound('Lot not found');
      if (lot.selectedRecyclerId !== recyclerId) {
        throw AppError.forbidden('You are not the designated recycler for this lot');
      }

      const allowedStatuses = ['CONFIRMED', 'PAID'];
      if (!allowedStatuses.includes(lot.status)) {
        throw AppError.invalidState(`Cannot record payment for lot in status ${lot.status}. Expected CONFIRMED.`);
      }

      const finalPrice = lot.finalPrice || new Prisma.Decimal('0.00');

      // Calculate paid so far
      const paidSoFar = lot.ledger.reduce(
        (acc, item) => acc.plus(item.amountPaid),
        new Prisma.Decimal('0.00')
      );

      const newTotalPaid = paidSoFar.plus(amountNum);
      const dueAmount = finalPrice.minus(newTotalPaid);

      if (newTotalPaid.greaterThan(finalPrice)) {
        throw AppError.validation('Amount exceeds total outstanding balance for this lot');
      }

      let paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' = 'PARTIAL';
      if (newTotalPaid.isZero()) {
        paymentStatus = 'PENDING';
      } else if (dueAmount.isZero() || dueAmount.lessThanOrEqualTo(0)) {
        paymentStatus = 'PAID';
      }

      const now = new Date();

      // Create ledger entry
      const entry = await tx.ledgerEntry.create({
        data: {
          lotId: lot.id,
          collectorId: lot.collectorId,
          recyclerId,
          amountPaid: amountNum,
          dueAmount: dueAmount.lessThan(0) ? new Prisma.Decimal('0.00') : dueAmount,
          mode: input.mode,
          status: paymentStatus,
          paidAt: now,
        },
      });

      // If fully paid, transition lot to PAID
      if (paymentStatus === 'PAID' && lot.status !== 'PAID') {
        await tx.lot.update({
          where: { id: lot.id },
          data: {
            status: 'PAID',
            paidAt: now,
          },
        });
      }

      // Append trace record
      await TraceService.appendTraceRecord(tx, lot.id, 'PAYMENT_RECORDED', {
        amountPaid: amountNum.toString(),
        dueAmount: entry.dueAmount.toString(),
        mode: input.mode,
        paymentStatus,
        recyclerId,
      });

      return entry;
    });
  }
}
