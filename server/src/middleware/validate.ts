import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../lib/errors.js';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validate(schemas: ValidationSchemas) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        next(AppError.validation('Request validation failed', details));
      } else {
        next(err);
      }
    }
  };
}
