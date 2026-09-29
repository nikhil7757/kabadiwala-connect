import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  if (err instanceof AppError) {
    if (err.status >= 500) {
      logger.error({ err, path: req.path }, 'Application server error');
    }
    res.status(err.status).json({
      data: null,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  logger.error({ err, path: req.path }, 'Unhandled exception caught');

  res.status(500).json({
    data: null,
    error: {
      code: 'INTERNAL',
      message: 'Internal server error',
    },
  });
}
