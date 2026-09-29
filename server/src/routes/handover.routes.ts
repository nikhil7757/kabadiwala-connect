import express from 'express';
import { initiateHandoverSchema, confirmHandoverSchema } from '@kabadiwala/shared';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';
import { requireVerifiedRecycler } from '../middleware/requireVerifiedRecycler.js';
import { AppError } from '../lib/errors.js';
import { HandoverService } from '../services/handover.service.js';

export const handoverRouter = express.Router();

/**
 * POST /handover/initiate
 * Collector initiates digital handover
 */
handoverRouter.post(
  '/handover/initiate',
  authenticate,
  requireRole('COLLECTOR'),
  async (req, res, next) => {
    try {
      const parsed = initiateHandoverSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(AppError.validation(parsed.error.errors.map((e) => e.message).join(', ')));
      }

      const result = await HandoverService.initiateHandover(
        parsed.data.lotId,
        req.auth!.sub,
        parsed.data
      );

      res.json({
        data: result,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /handover/confirm
 * Recycler verifies weight and confirms handover
 */
handoverRouter.post(
  '/handover/confirm',
  authenticate,
  requireRole('RECYCLER'),
  requireVerifiedRecycler,
  async (req, res, next) => {
    try {
      const parsed = confirmHandoverSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(AppError.validation(parsed.error.errors.map((e) => e.message).join(', ')));
      }

      const result = await HandoverService.confirmHandover(req.auth!.sub, parsed.data);

      res.json({
        data: result,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
);
