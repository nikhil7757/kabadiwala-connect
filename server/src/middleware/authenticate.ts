import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { AppError } from '../lib/errors.js';
import { Role } from '@kabadiwala/shared';

export interface AuthContext {
  sub: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw AppError.unauthenticated('Missing or invalid Authorization header');
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    throw AppError.unauthenticated('Token not provided');
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as AuthContext;
    req.auth = {
      sub: decoded.sub,
      role: decoded.role,
    };
    next();
  } catch (err: any) {
    throw AppError.unauthenticated('Token expired or invalid');
  }
}
