import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { Prisma } from '@prisma/client';
import {
  priceQuerySchema,
  priceBoardQuerySchema,
  createPriceEntrySchema,
  calculatePriceTrend,
} from '@kabadiwala/shared';
import { prisma } from '../lib/prisma.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireVerifiedRecycler } from '../middleware/requireVerifiedRecycler.js';
import { AppError } from '../lib/errors.js';

export const priceRouter = Router();

// GET /prices
priceRouter.get('/prices', validate({ query: priceQuerySchema }), async (req, res, next) => {
  try {
    const { district, city, categoryId, days } = req.query as any;

    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() - (days || 30));

    const where: Prisma.PriceEntryWhereInput = {
      recordedAt: { gte: startDate },
      ...(district ? { district } : {}),
      ...(city ? { city } : {}),
      ...(categoryId ? { categoryId } : {}),
    };

    const prices = await prisma.priceEntry.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: 200,
    });

    res.json({
      data: prices,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

// GET /prices/board
priceRouter.get(
  '/prices/board',
  validate({ query: priceBoardQuerySchema }),
  async (req, res, next) => {
    try {
      const { district } = req.query as { district: string };

      // Load all active categories
      const categories = await prisma.materialCategory.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });

      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setUTCDate(sixtyDaysAgo.getUTCDate() - 60);

      const boardItems = [];

      for (const cat of categories) {
        // Query district history
        let entries = await prisma.priceEntry.findMany({
          where: {
            categoryId: cat.id,
            district,
            recordedAt: { gte: sixtyDaysAgo },
          },
          orderBy: { recordedAt: 'asc' },
        });

        let isFallback = false;

        // Fall back to state average if district has zero entries
        if (entries.length === 0) {
          entries = await prisma.priceEntry.findMany({
            where: {
              categoryId: cat.id,
              state: 'MH',
              recordedAt: { gte: sixtyDaysAgo },
            },
            orderBy: { recordedAt: 'asc' },
          });
          isFallback = true;
        }

        if (entries.length === 0) {
          continue;
        }

        const latest = entries[entries.length - 1];
        const prices = entries.map((e) => Number(e.buyingPrice));
        const trendCalc = calculatePriceTrend(prices);

        boardItems.push({
          categoryId: cat.id,
          categoryCode: cat.code,
          nameEn: cat.nameEn,
          nameHi: cat.nameHi,
          nameMr: cat.nameMr,
          iconKey: cat.iconKey,
          latest: Number(latest.buyingPrice).toFixed(2),
          unit: cat.unit,
          ma7: trendCalc.ma7,
          ma30: trendCalc.ma30,
          trend: trendCalc.trend,
          marketMin: latest.marketMin ? Number(latest.marketMin).toFixed(2) : null,
          marketMax: latest.marketMax ? Number(latest.marketMax).toFixed(2) : null,
          updatedAt: latest.recordedAt.toISOString(),
          isSampleData: latest.isSampleData,
          isFallback,
        });
      }

      res.json({
        data: boardItems,
        error: null,
      });
    } catch (err) {
      try {
        const seedPath = path.resolve(process.cwd(), 'data/seed/categories.json');
        if (fs.existsSync(seedPath)) {
          const raw = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
          const boardItems = raw.map((cat: any, idx: number) => ({
            categoryId: `cat-${idx + 1}`,
            categoryCode: cat.code,
            nameEn: cat.nameEn,
            nameHi: cat.nameHi,
            nameMr: cat.nameMr,
            iconKey: cat.iconKey,
            latest: cat.baseRate,
            unit: cat.unit,
            ma7: cat.baseRate,
            ma30: cat.baseRate,
            trend: 'FLAT',
            marketMin: (parseFloat(cat.baseRate) * 0.9).toFixed(2),
            marketMax: (parseFloat(cat.baseRate) * 1.1).toFixed(2),
            updatedAt: new Date().toISOString(),
            isSampleData: true,
            isFallback: false,
          }));
          return res.json({ data: boardItems, error: null });
        }
      } catch {}
      next(err);
    }
  }
);

// POST /prices (Recycler sets market rate)
priceRouter.post(
  '/prices',
  authenticate,
  requireRole('RECYCLER'),
  requireVerifiedRecycler,
  validate({ body: createPriceEntrySchema }),
  async (req, res, next) => {
    try {
      const recyclerId = req.auth!.sub;
      const { categoryId, subCategoryCode, buyingPrice, unit, marketMin, marketMax } = req.body;

      const recycler = await prisma.recycler.findUnique({
        where: { id: recyclerId },
        select: { city: true, district: true, state: true },
      });

      if (!recycler) {
        throw AppError.notFound('Recycler not found');
      }

      const entry = await prisma.priceEntry.create({
        data: {
          categoryId,
          subCategoryCode,
          buyingPrice: new Prisma.Decimal(buyingPrice),
          unit: unit || 'KG',
          marketMin: marketMin ? new Prisma.Decimal(marketMin) : null,
          marketMax: marketMax ? new Prisma.Decimal(marketMax) : null,
          source: 'RECYCLER',
          city: recycler.city,
          district: recycler.district,
          state: recycler.state,
          recordedAt: new Date(),
          recyclerId,
          isSampleData: false,
        },
      });

      res.status(201).json({
        data: entry,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);
