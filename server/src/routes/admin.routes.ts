import express from 'express';
import {
  createRecyclerByAdminSchema,
  updateRecyclerStatusSchema,
  adminQuerySchema,
} from '@kabadiwala/shared';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../lib/errors.js';
import { AdminService } from '../services/admin.service.js';
import { ExportService } from '../services/export.service.js';

export const adminRouter = express.Router();

/**
 * GET /admin/recyclers
 * List recyclers with authorization details
 */
adminRouter.get('/admin/recyclers', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const query = adminQuerySchema.safeParse(req.query);
    if (!query.success) {
      return next(AppError.validation(query.error.errors.map((e) => e.message).join(', ')));
    }

    const result = await AdminService.listRecyclers(query.data);
    res.json({
      data: result.items,
      error: null,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /admin/recyclers
 * Admin creates a new recycler facility
 */
adminRouter.post('/admin/recyclers', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const parsed = createRecyclerByAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(AppError.validation(parsed.error.errors.map((e) => e.message).join(', ')));
    }

    const created = await AdminService.createRecycler(req.auth!.sub, parsed.data);
    res.status(201).json({
      data: created,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /admin/recyclers/:id
 * Verify, suspend, or set pending status
 */
adminRouter.patch('/admin/recyclers/:id', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const parsed = updateRecyclerStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(AppError.validation(parsed.error.errors.map((e) => e.message).join(', ')));
    }

    const updated = await AdminService.updateRecyclerStatus(req.auth!.sub, id, parsed.data);
    res.json({
      data: updated,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /admin/flags
 * List lots with anomaly flags for governance
 */
adminRouter.get('/admin/flags', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const result = await AdminService.listFlags(page, limit);
    res.json({
      data: result.items,
      error: null,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /admin/stats
 * Aggregate metrics and summary statistics
 */
adminRouter.get('/admin/stats', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const stats = await AdminService.getSystemStats();
    res.json({
      data: stats,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /export/:dataset.csv
 * Stream anonymized CSV export
 */
adminRouter.get('/export/:dataset.csv', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const dataset = req.params.dataset as string;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${dataset}.csv"`);

    await ExportService.streamExport(dataset, res);
  } catch (err) {
    next(err);
  }
});
