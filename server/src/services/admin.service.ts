import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import {
  CreateRecyclerByAdminDto,
  UpdateRecyclerStatusDto,
  AdminQueryDto,
} from '@kabadiwala/shared';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';

export class AdminService {
  /**
   * Lists recyclers with authorization metadata
   */
  static async listRecyclers(query: AdminQueryDto) {
    const { status, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.authorizationStatus = status;

    const [items, total] = await Promise.all([
      prisma.recycler.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          city: true,
          district: true,
          state: true,
          lat: true,
          lng: true,
          serviceRadiusKm: true,
          pickupAvailable: true,
          authorizationNo: true,
          authorizationBody: true,
          authorizationValidTill: true,
          authorizationStatus: true,
          verifiedAt: true,
          isSampleData: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.recycler.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Admin provisions a new authorized recycler
   */
  static async createRecycler(adminId: string, input: CreateRecyclerByAdminDto) {
    const existing = await prisma.recycler.findUnique({
      where: { email: input.email.toLowerCase().trim() },
    });
    if (existing) {
      throw AppError.conflict('Recycler with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const recycler = await prisma.recycler.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase().trim(),
        passwordHash,
        phone: input.phone || null,
        address: input.address || null,
        city: input.city,
        district: input.district,
        state: input.state,
        lat: input.lat,
        lng: input.lng,
        serviceRadiusKm: input.serviceRadiusKm,
        pickupAvailable: input.pickupAvailable,
        authorizationNo: input.authorizationNo || null,
        authorizationBody: input.authorizationBody || null,
        authorizationValidTill: input.authorizationValidTill || null,
        authorizationStatus: 'PENDING',
      },
      select: {
        id: true,
        name: true,
        email: true,
        authorizationStatus: true,
        city: true,
        district: true,
        createdAt: true,
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        actorRole: 'ADMIN',
        actorId: adminId,
        action: 'RECYCLER_CREATED',
        entity: 'Recycler',
        entityId: recycler.id,
        metadata: { email: recycler.email, name: recycler.name },
      },
    });

    return recycler;
  }

  /**
   * Admin verifies or suspends a recycler
   */
  static async updateRecyclerStatus(
    adminId: string,
    recyclerId: string,
    input: UpdateRecyclerStatusDto
  ) {
    const recycler = await prisma.recycler.findUnique({
      where: { id: recyclerId },
    });
    if (!recycler) throw AppError.notFound('Recycler not found');

    const now = new Date();
    const isVerified = input.authorizationStatus === 'VERIFIED';

    const updated = await prisma.recycler.update({
      where: { id: recyclerId },
      data: {
        authorizationStatus: input.authorizationStatus,
        verifiedAt: isVerified ? now : recycler.verifiedAt,
        verifiedById: isVerified ? adminId : recycler.verifiedById,
      },
      select: {
        id: true,
        name: true,
        email: true,
        authorizationStatus: true,
        verifiedAt: true,
        updatedAt: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorRole: 'ADMIN',
        actorId: adminId,
        action: `RECYCLER_${input.authorizationStatus}`,
        entity: 'Recycler',
        entityId: recycler.id,
        metadata: {
          previousStatus: recycler.authorizationStatus,
          newStatus: input.authorizationStatus,
          reason: input.reason || null,
        },
      },
    });

    return updated;
  }

  /**
   * Lists lots flagged with anomalies
   */
  static async listFlags(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.lot.findMany({
        where: { anomalyFlag: true },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          category: { select: { code: true, nameEn: true } },
          selectedRecycler: { select: { id: true, name: true, city: true } },
          handover: true,
        },
      }),
      prisma.lot.count({ where: { anomalyFlag: true } }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Aggregate statistics for Admin dashboard
   */
  static async getSystemStats() {
    const [lotsByStatusRaw, verifiedRecyclers, totalCollectors, allLotsCount, categories] =
      await Promise.all([
        prisma.lot.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
        prisma.recycler.count({ where: { authorizationStatus: 'VERIFIED' } }),
        prisma.collector.count(),
        prisma.lot.count(),
        prisma.materialCategory.findMany({
          where: { isActive: true },
          select: { id: true, code: true, nameEn: true },
        }),
      ]);

    const lotsByStatus: Record<string, number> = {};
    for (const group of lotsByStatusRaw) {
      lotsByStatus[group.status] = group._count.status;
    }

    // Daily lots for the last 14 days
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setUTCDate(fourteenDaysAgo.getUTCDate() - 14);

    const recentLots = await prisma.lot.findMany({
      where: { createdAt: { gte: fourteenDaysAgo } },
      select: { createdAt: true },
    });

    const lotsPerDayMap: Record<string, number> = {};
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      lotsPerDayMap[dateKey] = 0;
    }

    for (const lot of recentLots) {
      const dateKey = lot.createdAt.toISOString().split('T')[0];
      if (lotsPerDayMap[dateKey] !== undefined) {
        lotsPerDayMap[dateKey]++;
      }
    }

    const lotsPerDay = Object.entries(lotsPerDayMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Average price per category from last 30 days of price entries
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);

    const recentPrices = await prisma.priceEntry.findMany({
      where: { recordedAt: { gte: thirtyDaysAgo } },
      select: { categoryId: true, buyingPrice: true },
    });

    const avgPricePerCategory: Array<{ code: string; nameEn: string; avgPrice: string }> = [];
    for (const cat of categories) {
      const catPrices = recentPrices.filter((p) => p.categoryId === cat.id);
      if (catPrices.length > 0) {
        const sum = catPrices.reduce((acc, cur) => acc.plus(cur.buyingPrice), new Prisma.Decimal(0));
        const avg = sum.dividedBy(catPrices.length);
        avgPricePerCategory.push({
          code: cat.code,
          nameEn: cat.nameEn,
          avgPrice: avg.toFixed(2),
        });
      } else {
        avgPricePerCategory.push({
          code: cat.code,
          nameEn: cat.nameEn,
          avgPrice: '0.00',
        });
      }
    }

    return {
      lotsByStatus,
      lotsPerDay,
      avgPricePerCategory,
      verifiedRecyclers,
      totalCollectors,
      totalLots: allLotsCount,
    };
  }
}
