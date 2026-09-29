import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import {
  updateRecyclerProfileSchema,
  updateRecyclerRatesSchema,
} from '@kabadiwala/shared';
import { prisma } from '../lib/prisma.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireVerifiedRecycler } from '../middleware/requireVerifiedRecycler.js';
import { AppError } from '../lib/errors.js';

export const recyclerRouter = Router();

// GET /recyclers/directory
recyclerRouter.get(
  '/recyclers/directory',
  validate({
    query: z.object({
      district: z.string().min(1, 'District is required'),
    }),
  }),
  async (req, res, next) => {
    try {
      const { district } = req.query as { district: string };

      const recyclers = await prisma.recycler.findMany({
        where: {
          district,
          authorizationStatus: 'VERIFIED',
        },
        select: {
          id: true,
          name: true,
          city: true,
          district: true,
          state: true,
          lat: true,
          lng: true,
          serviceRadiusKm: true,
          pickupAvailable: true,
          authorizationNo: true,
          authorizationBody: true,
          authorizationStatus: true,
          updatedAt: true,
          isSampleData: true,
          materials: {
            select: {
              categoryId: true,
              offeredRatePerUnit: true,
              rateUpdatedAt: true,
              category: {
                select: {
                  code: true,
                  nameEn: true,
                  nameHi: true,
                  nameMr: true,
                  unit: true,
                },
              },
            },
          },
        },
      });

      res.json({
        data: recyclers,
        error: null,
      });
    } catch (err) {
      try {
        const seedPath = path.resolve(process.cwd(), 'data/seed/recyclers.json');
        if (fs.existsSync(seedPath)) {
          const raw = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
          const filtered = raw.filter((r: any) => !district || r.district?.toLowerCase() === district.toLowerCase());
          const list = (filtered.length > 0 ? filtered : raw).map((r: any, idx: number) => ({
            id: `rec-${idx + 1}`,
            name: r.name,
            city: r.city,
            district: r.district,
            state: r.state,
            lat: r.lat,
            lng: r.lng,
            serviceRadiusKm: r.serviceRadiusKm,
            pickupAvailable: r.pickupAvailable,
            authorizationNo: r.authorizationNo,
            authorizationBody: r.authorizationBody,
            authorizationStatus: r.authorizationStatus,
            updatedAt: new Date().toISOString(),
            isSampleData: true,
            materials: [
              { categoryId: 'cat-1', offeredRatePerUnit: 180, category: { code: 'CABLE', nameEn: 'Cables', nameHi: 'केबल', nameMr: 'केबल', unit: 'KG' } },
              { categoryId: 'cat-2', offeredRatePerUnit: 320, category: { code: 'PCB', nameEn: 'Circuit boards', nameHi: 'सर्किट बोर्ड', nameMr: 'सर्किट बोर्ड', unit: 'KG' } },
              { categoryId: 'cat-3', offeredRatePerUnit: 70, category: { code: 'BATTERY', nameEn: 'Batteries', nameHi: 'बैटरी', nameMr: 'बॅटरी', unit: 'KG' } }
            ]
          }));
          return res.json({ data: list, error: null });
        }
      } catch {}
      next(err);
    }
  }
);

// GET /recyclers/me
recyclerRouter.get(
  '/recyclers/me',
  authenticate,
  requireRole('RECYCLER'),
  async (req, res, next) => {
    try {
      const recycler = await prisma.recycler.findUnique({
        where: { id: req.auth!.sub },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
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
          isSampleData: true,
          materials: {
            select: {
              categoryId: true,
              offeredRatePerUnit: true,
              rateUpdatedAt: true,
              category: {
                select: {
                  code: true,
                  nameEn: true,
                  unit: true,
                },
              },
            },
          },
        },
      });

      if (!recycler) {
        throw AppError.notFound('Recycler profile not found');
      }

      res.json({
        data: recycler,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /recyclers/me
recyclerRouter.put(
  '/recyclers/me',
  authenticate,
  requireRole('RECYCLER'),
  validate({ body: updateRecyclerProfileSchema }),
  async (req, res, next) => {
    try {
      const updated = await prisma.recycler.update({
        where: { id: req.auth!.sub },
        data: req.body,
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
          lat: true,
          lng: true,
          serviceRadiusKm: true,
          pickupAvailable: true,
          updatedAt: true,
        },
      });

      res.json({
        data: updated,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /recyclers/me/rates
recyclerRouter.put(
  '/recyclers/me/rates',
  authenticate,
  requireRole('RECYCLER'),
  requireVerifiedRecycler,
  validate({ body: updateRecyclerRatesSchema }),
  async (req, res, next) => {
    try {
      const recyclerId = req.auth!.sub;
      const { rates } = req.body;

      const recycler = await prisma.recycler.findUnique({
        where: { id: recyclerId },
        select: { city: true, district: true, state: true },
      });

      if (!recycler) {
        throw AppError.notFound('Recycler not found');
      }

      const now = new Date();

      await prisma.$transaction(async (tx) => {
        for (const item of rates) {
          await tx.recyclerMaterial.upsert({
            where: {
              recyclerId_categoryId: {
                recyclerId,
                categoryId: item.categoryId,
              },
            },
            update: {
              offeredRatePerUnit: new Prisma.Decimal(item.offeredRatePerUnit),
              rateUpdatedAt: now,
            },
            create: {
              recyclerId,
              categoryId: item.categoryId,
              offeredRatePerUnit: new Prisma.Decimal(item.offeredRatePerUnit),
              rateUpdatedAt: now,
            },
          });

          // Write PriceEntry with source RECYCLER
          await tx.priceEntry.create({
            data: {
              categoryId: item.categoryId,
              buyingPrice: new Prisma.Decimal(item.offeredRatePerUnit),
              source: 'RECYCLER',
              city: recycler.city,
              district: recycler.district,
              state: recycler.state,
              recordedAt: now,
              recyclerId,
              isSampleData: false,
            },
          });
        }
      });

      res.json({
        data: { success: true, count: rates.length },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);
