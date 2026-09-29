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
import { materialRouter } from './routes/material.routes.js';
import { safetyRouter } from './routes/safety.routes.js';
import { priceRouter } from './routes/price.routes.js';
import { recyclerRouter } from './routes/recycler.routes.js';
import { collectorRouter } from './routes/collector.routes.js';
import { lotRouter } from './routes/lot.routes.js';
import { photoRouter } from './routes/photo.routes.js';
import { handoverRouter } from './routes/handover.routes.js';
import { ledgerRouter } from './routes/ledger.routes.js';
import { syncRouter } from './routes/sync.routes.js';
import { adminRouter } from './routes/admin.routes.js';

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

// Authenticated photo streaming endpoint mounted at root /uploads
app.use(photoRouter);

// API v1 router
const apiRouter = express.Router();
apiRouter.use(healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use(materialRouter);
apiRouter.use(safetyRouter);
apiRouter.use(priceRouter);
apiRouter.use(recyclerRouter);
apiRouter.use(collectorRouter);
apiRouter.use(lotRouter);
apiRouter.use(handoverRouter);
apiRouter.use(ledgerRouter);
apiRouter.use(syncRouter);
apiRouter.use(adminRouter);

// Mount under PUBLIC_API_BASE (/api/v1)
app.use(config.PUBLIC_API_BASE, apiRouter);

// 404 handler for undefined routes
app.use((req, res, next) => {
  next(AppError.notFound(`Cannot ${req.method} ${req.path}`));
});

// Central error handler
app.use(errorHandler);
