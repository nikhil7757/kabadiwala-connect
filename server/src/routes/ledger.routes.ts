import express from 'express';
import { createLedgerEntrySchema } from '@kabadiwala/shared';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireVerifiedRecycler } from '../middleware/requireVerifiedRecycler.js';
import { AppError } from '../lib/errors.js';
import { LedgerService } from '../services/ledger.service.js';

export const ledgerRouter = express.Router();

/**
 * GET /ledger
 * Collector views own earnings; recycler views payment history
 */
ledgerRouter.get('/ledger', authenticate, async (req, res, next) => {
  try {
    const result = await LedgerService.getLedgerForUser(req.auth!.sub, req.auth!.role);
    res.json({
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /ledger
 * Recycler records payment against a lot
 */
ledgerRouter.post(
  '/ledger',
  authenticate,
  requireRole('RECYCLER'),
  requireVerifiedRecycler,
  async (req, res, next) => {
    try {
      const parsed = createLedgerEntrySchema.safeParse(req.body);
      if (!parsed.success) {
        return next(AppError.validation(parsed.error.errors.map((e) => e.message).join(', ')));
      }

      const entry = await LedgerService.recordPayment(req.auth!.sub, parsed.data);
      res.status(201).json({
        data: entry,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);
