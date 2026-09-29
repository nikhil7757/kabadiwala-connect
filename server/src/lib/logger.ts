import { pino } from 'pino';
import { config } from '../config.js';

export const logger = pino({
  level: config.NODE_ENV === 'test' ? 'silent' : 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'authorization',
      'password',
      'passwordHash',
      'phone',
      'otp',
      'token',
      'code',
      '*.password',
      '*.phone',
      '*.otp',
      '*.token',
    ],
    censor: '[REDACTED]',
  },
  transport:
    config.NODE_ENV === 'development'
      ? {
          target: 'pino/file',
        }
      : undefined,
});
