import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { PhotoService } from '../services/photo.service.js';
import { AppError } from '../lib/errors.js';

export const photoRouter = express.Router();

/**
 * GET /uploads/:lotId/:photoId
 * Authenticated streaming of lot photos per TRD Section 13
 */
photoRouter.get('/uploads/:lotId/:photoId', authenticate, async (req, res, next) => {
  try {
    const lotId = req.params.lotId as string;
    const photoId = req.params.photoId as string;
    if (!req.auth) {
      return next(AppError.unauthenticated());
    }

    const filePath = await PhotoService.getPhotoFileForUser(lotId, photoId, {
      sub: req.auth.sub,
      role: req.auth.role,
    });

    res.sendFile(filePath, {
      headers: {
        'Cache-Control': 'private, max-age=86400',
        'Content-Type': 'image/jpeg',
      },
    });
  } catch (err) {
    next(err);
  }
});
