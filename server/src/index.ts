import { app } from './app.js';
import { config } from './config.js';
import { logger } from './lib/logger.js';
import { prisma } from './lib/prisma.js';

const server = app.listen(config.PORT, () => {
  logger.info(
    {
      port: config.PORT,
      env: config.NODE_ENV,
      apiBase: config.PUBLIC_API_BASE,
      demoMode: config.DEMO_MODE,
    },
    '🚀 Kabadiwala Connect API server started'
  );
});

// Graceful shutdown
async function gracefulShutdown(signal: string) {
  logger.info({ signal }, 'Graceful shutdown initiated');
  server.close(async () => {
    logger.info('HTTP server closed');
    try {
      await prisma.$disconnect();
      logger.info('Prisma connection disconnected');
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'Error during database disconnect');
      process.exit(1);
    }
  });

  // Force exit after 10 seconds if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
