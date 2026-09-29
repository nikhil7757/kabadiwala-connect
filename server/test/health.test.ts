import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Phase 1: Foundation Health & Bootstrap Tests', () => {
  it('GET /api/v1/health returns status ok with ISO timestamp', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.status).toBe('ok');
    expect(typeof res.body.data.time).toBe('string');
    expect(Date.parse(res.body.data.time)).not.toBeNaN();
    expect(res.body.error).toBeNull();
  });

  it('GET /nonexistent returns 404 NOT_FOUND envelope', async () => {
    const res = await request(app).get('/api/v1/unknown-endpoint');

    expect(res.status).toBe(404);
    expect(res.body.data).toBeNull();
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('POST /api/v1/auth/otp/request rejects invalid phone format', async () => {
    const res = await request(app)
      .post('/api/v1/auth/otp/request')
      .send({ phone: '12345' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/auth/login rejects missing credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'bademail' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
