import express from 'express';
import multer from 'multer';
import {
  createLotSchema,
  selectRecyclerSchema,
  quoteLotSchema,
  lotQuerySchema,
  matchRecyclers,
  RecyclerCandidate,
} from '@kabadiwala/shared';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import { LotService } from '../services/lot.service.js';
import { PhotoService } from '../services/photo.service.js';
import { TraceService } from '../services/trace.service.js';

export const lotRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB per TRD Section 13
});

/**
 * POST /lots
 * Creates a lot or returns existing on idempotent clientId
 */
lotRouter.post('/lots', authenticate, requireRole('COLLECTOR'), async (req, res, next) => {
  try {
    const parsed = createLotSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(AppError.validation(parsed.error.errors.map((e) => e.message).join(', ')));
    }

    const result = await LotService.createLot(req.auth!.sub, parsed.data);
    res.status(result.isExisting ? 200 : 201).json({
      data: result.lot,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /lots
 * Role-based lot listing with status and pagination filters
 */
lotRouter.get('/lots', authenticate, async (req, res, next) => {
  try {
    const query = lotQuerySchema.safeParse(req.query);
    if (!query.success) {
      return next(AppError.validation(query.error.errors.map((e) => e.message).join(', ')));
    }

    const { status, page, limit, updatedSince } = query.data;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (updatedSince) where.updatedAt = { gte: new Date(updatedSince) };

    const role = req.auth!.role;
    const userId = req.auth!.sub;

    if (role === 'COLLECTOR') {
      where.collectorId = userId;
    } else if (role === 'RECYCLER') {
      // Recycler sees lots where they are selected OR lots that are LISTED/QUOTED
      where.OR = [
        { selectedRecyclerId: userId },
        { status: { in: ['LISTED', 'QUOTED'] } },
      ];
    }
    // ADMIN sees all

    const [items, total] = await Promise.all([
      prisma.lot.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          category: { select: { code: true, nameEn: true, nameHi: true, nameMr: true } },
          photos: { select: { id: true, sha256: true, purpose: true, sizeBytes: true, takenAt: true } },
          selectedRecycler: { select: { id: true, name: true, city: true, phone: true } },
        },
      }),
      prisma.lot.count({ where }),
    ]);

    res.json({
      data: items,
      error: null,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /lots/:id
 * Detailed lot view with trace records and photos
 */
lotRouter.get('/lots/:id', authenticate, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const lot = await prisma.lot.findUnique({
      where: { id },
      include: {
        category: true,
        photos: true,
        selectedRecycler: true,
        trace: { orderBy: { seq: 'asc' } },
        handover: true,
      },
    });

    if (!lot) return next(AppError.notFound('Lot not found'));

    // Access control:
    // Collector must own it
    // Recycler must be selected or lot is LISTED
    // Admin can see all
    const role = req.auth!.role;
    const userId = req.auth!.sub;
    if (role === 'COLLECTOR' && lot.collectorId !== userId) {
      return next(AppError.forbidden('Not your lot'));
    }
    if (role === 'RECYCLER' && lot.selectedRecyclerId !== userId && lot.status !== 'LISTED') {
      return next(AppError.forbidden('Access denied to lot'));
    }

    res.json({
      data: lot,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /lots/:id/photos
 * Uploads a photo for a lot with magic-byte and SHA-256 validation
 */
lotRouter.post(
  '/lots/:id/photos',
  authenticate,
  requireRole('COLLECTOR'),
  upload.single('photo'),
  async (req, res, next) => {
    try {
      const id = req.params.id as string;
      if (!req.file) {
        return next(AppError.validation('Missing photo file'));
      }

      const clientSha256Header = req.headers['x-photo-sha256'];
      const clientSha256 = Array.isArray(clientSha256Header)
        ? clientSha256Header[0]
        : clientSha256Header || (req.body && req.body.sha256);

      if (!clientSha256 || typeof clientSha256 !== 'string') {
        return next(AppError.validation('Missing required SHA-256 header (x-photo-sha256) or body field'));
      }

      const purpose = req.body.purpose === 'HANDOVER' ? 'HANDOVER' : 'COLLECTION';
      const takenAt = req.body.takenAt ? new Date(req.body.takenAt) : new Date();

      const photo = await PhotoService.uploadLotPhoto(
        id,
        req.auth!.sub,
        req.file.buffer,
        clientSha256,
        purpose,
        takenAt
      );

      res.status(201).json({
        data: photo,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /lots/:id/select-recycler
 * Collector selects a verified buyer
 */
lotRouter.post(
  '/lots/:id/select-recycler',
  authenticate,
  requireRole('COLLECTOR'),
  async (req, res, next) => {
    try {
      const id = req.params.id as string;
      const parsed = selectRecyclerSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(AppError.validation(parsed.error.errors.map((e) => e.message).join(', ')));
      }

      const updated = await LotService.selectRecycler(id, req.auth!.sub, parsed.data);
      res.json({
        data: updated,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /lots/:id/quote
 * Recycler submits price quote
 */
lotRouter.post(
  '/lots/:id/quote',
  authenticate,
  requireRole('RECYCLER'),
  async (req, res, next) => {
    try {
      const id = req.params.id as string;
      const parsed = quoteLotSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(AppError.validation(parsed.error.errors.map((e) => e.message).join(', ')));
      }

      const updated = await LotService.quoteLot(id, req.auth!.sub, parsed.data);
      res.json({
        data: updated,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /lots/:id/accept-quote
 * Collector accepts recycler quote
 */
lotRouter.post(
  '/lots/:id/accept-quote',
  authenticate,
  requireRole('COLLECTOR'),
  async (req, res, next) => {
    try {
      const id = req.params.id as string;
      const updated = await LotService.acceptQuote(id, req.auth!.sub);
      res.json({
        data: updated,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /lots/:id/cancel
 * Collector cancels lot
 */
lotRouter.post(
  '/lots/:id/cancel',
  authenticate,
  requireRole('COLLECTOR'),
  async (req, res, next) => {
    try {
      const id = req.params.id as string;
      const updated = await LotService.cancelLot(id, req.auth!.sub);
      res.json({
        data: updated,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /lots/:id/trace
 * Immutable audit trail
 */
lotRouter.get('/lots/:id/trace', authenticate, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const lot = await prisma.lot.findUnique({
      where: { id },
      select: { collectorId: true, selectedRecyclerId: true },
    });
    if (!lot) return next(AppError.notFound('Lot not found'));

    // Collector, recycler, or admin access
    const role = req.auth!.role;
    const userId = req.auth!.sub;
    if (role === 'COLLECTOR' && lot.collectorId !== userId) {
      return next(AppError.forbidden('Not your lot'));
    }
    if (role === 'RECYCLER' && lot.selectedRecyclerId !== userId) {
      return next(AppError.forbidden('Not your lot'));
    }

    const records = await prisma.traceRecord.findMany({
      where: { lotId: id },
      orderBy: { seq: 'asc' },
    });

    res.json({
      data: {
        lotId: id,
        totalBlocks: records.length,
        records,
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /lots/:id/trace/verify
 * Cryptographically verifies SHA-256 hash chain
 */
lotRouter.get('/lots/:id/trace/verify', authenticate, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const verification = await TraceService.verifyLotTrace(prisma, id);
    res.json({
      data: verification,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /recyclers/match
 * 5-factor weighted recycler matching
 */
lotRouter.get('/recyclers/match', authenticate, async (req, res, next) => {
  try {
    const categoryId = req.query.categoryId as string;
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const weightKg = req.query.weightKg ? parseFloat(req.query.weightKg as string) : undefined;

    if (!categoryId || isNaN(lat) || isNaN(lng)) {
      return next(AppError.validation('Missing required query params: categoryId, lat, lng'));
    }

    // Fetch verified recyclers that accept this category
    const recyclers = await prisma.recycler.findMany({
      where: {
        authorizationStatus: 'VERIFIED',
      },
      include: {
        materials: {
          where: { categoryId },
        },
        lots: {
          select: { id: true, status: true },
        },
      },
    });

    // Build candidates
    const candidates: RecyclerCandidate[] = [];
    for (const r of recyclers) {
      const material = r.materials[0];
      if (!material) continue;

      const lotsSelectedCount = r.lots.length;
      const handoversConfirmedCount = r.lots.filter((l: any) => l.status === 'COMPLETED').length;

      candidates.push({
        id: r.id,
        name: r.name,
        lat: Number(r.lat),
        lng: Number(r.lng),
        serviceRadiusKm: Number(r.serviceRadiusKm),
        pickupAvailable: r.pickupAvailable,
        authorizationStatus: r.authorizationStatus as any,
        offeredRate: Number(material.offeredRatePerUnit),
        rateUpdatedAt: material.rateUpdatedAt,
        lotsSelectedCount,
        handoversConfirmedCount,
      });
    }

    const matches = matchRecyclers(lat, lng, candidates, { lotWeightKg: weightKg });
    res.json({
      data: matches,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});
