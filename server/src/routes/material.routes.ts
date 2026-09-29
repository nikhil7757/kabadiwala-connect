import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '../lib/prisma.js';

export const materialRouter = Router();

materialRouter.get('/materials', async (req, res, next) => {
  try {
    const categories = await prisma.materialCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        subCategories: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            code: true,
            nameEn: true,
            nameHi: true,
            nameMr: true,
            sortOrder: true,
          },
        },
      },
    });

    res.json({
      data: categories,
      error: null,
    });
  } catch (err) {
    try {
      const seedPath = path.resolve(process.cwd(), 'data/seed/categories.json');
      if (fs.existsSync(seedPath)) {
        const items = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
        return res.json({
          data: items.map((c: any, i: number) => ({ id: `cat-${i + 1}`, ...c, isActive: true })),
          error: null,
        });
      }
    } catch {}
    next(err);
  }
});
