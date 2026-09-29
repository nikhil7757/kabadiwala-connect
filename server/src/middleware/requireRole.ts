import { Request, Response, NextFunction } from 'express';
import { Role } from '@kabadiwala/shared';
import { AppError } from '../lib/errors.js';

export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      throw AppError.unauthenticated();
    }

    if (!allowedRoles.includes(req.auth.role)) {
      throw AppError.forbidden(`Role '${req.auth.role}' is not authorized to access this resource`);
    }

    next();
  };
}
