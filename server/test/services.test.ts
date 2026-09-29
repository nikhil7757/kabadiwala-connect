import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { HandoverService } from '../src/services/handover.service.js';
import { ExportService } from '../src/services/export.service.js';

describe('Phase 4 & 5 Services and Route Unit Tests', () => {
  describe('Handover Reference & Code Derivation (BACKEND.md 6.2)', () => {
    it('generates valid handoverRef with HO prefix and correct format', () => {
      const refCode = 'KC-MH-20260929-0007';
      const handoverRef = HandoverService.generateHandoverRef(refCode);

      expect(handoverRef).toMatch(/^HO-\d{8}-[A-Z0-9]{4}$/);
      expect(handoverRef).toContain('09290007');
    });

    it('derives a consistent 6-digit OTP from the handoverRef', () => {
      const handoverRef = 'HO-09290007-K4Q9';
      const code1 = HandoverService.deriveHandoverCode(handoverRef);
      const code2 = HandoverService.deriveHandoverCode(handoverRef);

      expect(code1).toHaveLength(6);
      expect(code1).toMatch(/^\d{6}$/);
      expect(code1).toBe(code2); // Deterministic
    });
  });

  describe('Export Privacy & Anonymization (BACKEND.md 6.8 & TRD 10.8)', () => {
    it('hashes collector UUID into 12-character SHA-256 hex string', () => {
      const collectorId = 'b0400000-0000-0000-0000-000000000001';
      const hash1 = ExportService.hashCollectorId(collectorId);
      const hash2 = ExportService.hashCollectorId(collectorId);

      expect(hash1).toHaveLength(12);
      expect(hash1).toMatch(/^[0-9a-f]{12}$/);
      expect(hash1).toBe(hash2);
      // Ensure raw UUID is not present
      expect(hash1).not.toContain(collectorId);
    });

    it('rounds GPS coordinates to 2 decimal places (~1.1 km precision)', () => {
      expect(ExportService.roundGps(18.5204303)).toBe('18.52');
      expect(ExportService.roundGps(73.8567437)).toBe('73.86');
      expect(ExportService.roundGps(null)).toBe('');
      expect(ExportService.roundGps(undefined)).toBe('');
    });
  });

  describe('Authentication & Guard Envelopes', () => {
    it('POST /api/v1/lots without token returns 401 UNAUTHENTICATED', async () => {
      const res = await request(app)
        .post('/api/v1/lots')
        .send({ clientId: 'b0000000-0000-0000-0000-000000000001' });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHENTICATED');
    });

    it('POST /api/v1/handover/initiate without token returns 401 UNAUTHENTICATED', async () => {
      const res = await request(app)
        .post('/api/v1/handover/initiate')
        .send({ lotId: 'b0000000-0000-0000-0000-000000000001', weightKg: 10 });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHENTICATED');
    });

    it('GET /api/v1/admin/stats without token returns 401 UNAUTHENTICATED', async () => {
      const res = await request(app).get('/api/v1/admin/stats');

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHENTICATED');
    });
  });
});
