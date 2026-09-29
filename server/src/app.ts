import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import { config } from './config.js';
import { logger } from './lib/logger.js';
import { errorHandler } from './middleware/error.js';
import { AppError } from './lib/errors.js';
import { healthRouter } from './routes/health.routes.js';
import { authRouter } from './routes/auth.routes.js';

export const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (config.CORS_ORIGINS.includes('*') || config.CORS_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

// Body parsing with 200kb limit per TRD Section 13
app.use(express.json({ limit: '200kb' }));

// Request logging with sensitive header & body redaction
app.use(
  pinoHttp({
    logger,
    autoLogging: config.NODE_ENV !== 'test',
  })
);

// API v1 router
const apiRouter = express.Router();
apiRouter.use(healthRouter);
apiRouter.use('/auth', authRouter);

// Mount under PUBLIC_API_BASE (/api/v1)
app.use(config.PUBLIC_API_BASE, apiRouter);

// 404 handler for undefined routes
app.use((req, res, next) => {
  next(AppError.notFound(`Cannot ${req.method} ${req.path}`));
});

// Central error handler
app.use(errorHandler);
