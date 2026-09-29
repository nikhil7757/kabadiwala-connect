import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
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
    try {
      const seedPath = path.resolve(process.cwd(), 'data/seed/safety-tips.json');
      if (fs.existsSync(seedPath)) {
        const raw = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
        return res.json({
          data: raw.map((t: any, idx: number) => ({ id: `tip-${idx + 1}`, ...t })),
          error: null,
        });
      }
    } catch {}
    next(err);
  }
});
