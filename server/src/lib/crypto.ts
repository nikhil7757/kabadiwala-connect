import crypto from 'node:crypto';
import { config } from '../config.js';

export function hmacSha256Hex(secret: string, data: string): string {
  return crypto.createHmac('sha256', secret).update(data, 'utf8').digest('hex');
}

export function hmacSha256Buffer(secret: string, data: string): Buffer {
  return crypto.createHmac('sha256', secret).update(data, 'utf8').digest();
}

export function sha256Hex(data: string | Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function timingSafeEqualString(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    // Prevent timing disclosure of string length while still returning false
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Derives a deterministic 6-digit code for a handover reference.
 * uint32 from first 4 bytes of HMAC-SHA256(JWT_SECRET, handoverRef) % 1,000,000
 */
export function deriveHandoverCode(handoverRef: string): string {
  const hmac = hmacSha256Buffer(config.JWT_SECRET, handoverRef);
  const num = hmac.readUInt32BE(0);
  const code = (num % 1_000_000).toString().padStart(6, '0');
  return code;
}

/**
 * Generates an alphanumeric string of given length
 */
export function randomAlphanumeric(length = 4): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous 0, O, 1, I
  let result = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
}
