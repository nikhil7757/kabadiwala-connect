import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

export const safetyRouter = Router();

safetyRouter.get('/safety', async (req, res, next) => {
  try {
    const tips = await prisma.safetyTip.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    res.json({
      data: tips,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});
