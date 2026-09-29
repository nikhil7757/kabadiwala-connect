import { Router } from 'express';
import { nowIsoString } from '../lib/time.js';

export const healthRouter = Router();

healthRouter.get('/health', (req, res) => {
  res.json({
    data: {
      status: 'ok',
      time: nowIsoString(),
    },
    error: null,
  });
});
