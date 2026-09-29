import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';

/**
 * Re-reads recycler authorizationStatus from the database on every write route
 * so immediate suspension takes effect without token revocation (BACKEND.md 4.4 & 5.2)
 */
export async function requireVerifiedRecycler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.auth || req.auth.role !== 'RECYCLER') {
      throw AppError.forbidden('Only recyclers can access this resource');
    }

    const recycler = await prisma.recycler.findUnique({
      where: { id: req.auth.sub },
      select: { authorizationStatus: true },
    });

    if (!recycler) {
      throw AppError.notFound('Recycler account not found');
    }

    if (recycler.authorizationStatus !== 'VERIFIED') {
      throw AppError.forbidden(
        `Recycler is currently ${recycler.authorizationStatus}. Rate updates and quotes are blocked until verified.`
      );
    }

    next();
  } catch (err) {
    next(err);
  }
}
