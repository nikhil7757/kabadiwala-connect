import { Router } from 'express';
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
