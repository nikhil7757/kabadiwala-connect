import fs from 'node:fs';
import path from 'node:path';
import { fileTypeFromBuffer } from 'file-type';
import { prisma } from '../lib/prisma.js';
import { config } from '../config.js';
import { AppError } from '../lib/errors.js';
import { sha256Hex } from '../lib/crypto.js';
import { PhotoPurpose } from '@kabadiwala/shared';

export class PhotoService {
  /**
   * Processes, validates, and stores a lot photograph
   */
  static async uploadLotPhoto(
    lotId: string,
    collectorId: string,
    fileBuffer: Buffer,
    clientSha256: string,
    purpose: PhotoPurpose = 'COLLECTION',
    takenAt: Date = new Date()
  ) {
    // 1. Verify ownership of lot
    const lot = await prisma.lot.findUnique({
      where: { id: lotId },
      include: { photos: true },
    });
    if (!lot) throw AppError.notFound('Lot not found');
    if (lot.collectorId !== collectorId) throw AppError.forbidden('Not your lot');

    // 2. Validate max photos constraint (max 4 collection + 1 handover)
    const currentCount = lot.photos.filter((p) => p.purpose === purpose).length;
    const maxAllowed = purpose === 'COLLECTION' ? 4 : 1;
    if (currentCount >= maxAllowed) {
      throw AppError.validation(`Maximum ${maxAllowed} photos allowed for purpose ${purpose}`);
    }

    // 3. File size check
    if (fileBuffer.length > config.UPLOAD_MAX_BYTES) {
      throw AppError.fileTooLarge(`Photo exceeds maximum size of ${config.UPLOAD_MAX_BYTES} bytes`);
    }

    // 4. Magic-byte verification (must be image/jpeg)
    const fileType = await fileTypeFromBuffer(fileBuffer);
    if (!fileType || fileType.mime !== 'image/jpeg') {
      throw AppError.unsupportedMedia('Only image/jpeg format is accepted');
    }

    // 5. SHA-256 verification
    const computedSha = sha256Hex(fileBuffer);
    if (computedSha.toLowerCase() !== clientSha256.toLowerCase()) {
      throw AppError.validation('Photo SHA-256 checksum mismatch');
    }

    // 6. Check for duplicate upload
    const existing = await prisma.lotPhoto.findUnique({
      where: {
        lotId_sha256: {
          lotId,
          sha256: computedSha,
        },
      },
    });
    if (existing) {
      return existing;
    }

    // 7. Write to disk UPLOAD_DIR/<lotId>/<photoId>.jpg
    const targetDir = path.resolve(config.UPLOAD_DIR, lotId);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const photoRecord = await prisma.lotPhoto.create({
      data: {
        lotId,
        sha256: computedSha,
        sizeBytes: fileBuffer.length,
        purpose,
        takenAt,
        path: '', // populated below with final path
      },
    });

    const filePath = path.join(targetDir, `${photoRecord.id}.jpg`);
    fs.writeFileSync(filePath, fileBuffer);

    // Update relative path in record
    const updated = await prisma.lotPhoto.update({
      where: { id: photoRecord.id },
      data: { path: `${lotId}/${photoRecord.id}.jpg` },
    });

    return updated;
  }

  /**
   * Retrieves photo path while enforcing authenticated access rules (TRD Section 13)
   */
  static async getPhotoFileForUser(lotId: string, photoId: string, auth: { sub: string; role: string }) {
    const photo = await prisma.lotPhoto.findFirst({
      where: { id: photoId, lotId },
      include: { lot: true },
    });

    if (!photo) {
      throw AppError.notFound('Photo not found');
    }

    // Access control:
    // Collector must own lot
    // Recycler must be selected on lot (or lot is DRAFT/LISTED within discovery scope)
    // Admin can view any
    if (auth.role === 'COLLECTOR' && photo.lot.collectorId !== auth.sub) {
      throw AppError.forbidden('Access denied to lot photo');
    }
    if (auth.role === 'RECYCLER' && photo.lot.selectedRecyclerId !== auth.sub) {
      throw AppError.forbidden('Access denied to lot photo');
    }

    const fullPath = path.resolve(config.UPLOAD_DIR, photo.path);
    if (!fs.existsSync(fullPath)) {
      throw AppError.notFound('Photo file missing on disk');
    }

    return fullPath;
  }
}
