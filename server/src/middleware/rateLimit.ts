import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import { AppError } from '../lib/errors.js';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.RATE_LIMIT_AUTH_PER_15MIN, // 20 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(AppError.rateLimited('Too many authentication attempts. Please try again later.'));
  },
});
