import { Router } from 'express';
import { updateCollectorSchema } from '@kabadiwala/shared';
import { prisma } from '../lib/prisma.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/requireRole.js';

export const collectorRouter = Router();

collectorRouter.patch(
  '/collectors/me',
  authenticate,
  requireRole('COLLECTOR'),
  validate({ body: updateCollectorSchema }),
  async (req, res, next) => {
    try {
      const updated = await prisma.collector.update({
        where: { id: req.auth!.sub },
        data: req.body,
        select: {
          id: true,
          phone: true,
          preferredLanguage: true,
          state: true,
          district: true,
          operatingArea: true,
          isSampleData: true,
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
