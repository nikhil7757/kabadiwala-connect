import express from 'express';
import { syncPayloadSchema } from '@kabadiwala/shared';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';
import { AppError } from '../lib/errors.js';
import { SyncService } from '../services/sync.service.js';

export const syncRouter = express.Router();

/**
 * POST /sync
 * Replays offline actions and returns delta updates per TRD Section 10.7
 */
syncRouter.post('/sync', authenticate, requireRole('COLLECTOR'), async (req, res, next) => {
  try {
    const parsed = syncPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(AppError.validation(parsed.error.errors.map((e) => e.message).join(', ')));
    }

    const syncResponse = await SyncService.processSync(req.auth!.sub, parsed.data);
    res.json({
      data: syncResponse,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});
