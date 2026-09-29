import { Router } from 'express';
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
    next(err);
  }
});
