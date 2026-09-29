import { describe, it, expect } from 'vitest';
import en from '../src/i18n/en.json';
import hi from '../src/i18n/hi.json';
import mr from '../src/i18n/mr.json';

describe('i18n Key Coverage Tests (TRD Section 16)', () => {
  it('every English key exists in Hindi and Marathi translations', () => {
    const enKeys = Object.keys(en);
    const hiKeys = Object.keys(hi);
    const mrKeys = Object.keys(mr);

    expect(enKeys.length).toBeGreaterThan(20);

    for (const key of enKeys) {
      expect(hiKeys, `Missing key "${key}" in hi.json`).toContain(key);
      expect(mrKeys, `Missing key "${key}" in mr.json`).toContain(key);
    }
  });

  it('no translation string is empty', () => {
    for (const [key, value] of Object.entries(en)) {
      expect(typeof value).toBe('string');
      expect((value as string).trim().length).toBeGreaterThan(0);
    }
    for (const [key, value] of Object.entries(hi)) {
      expect(typeof value).toBe('string');
      expect((value as string).trim().length).toBeGreaterThan(0);
    }
    for (const [key, value] of Object.entries(mr)) {
      expect(typeof value).toBe('string');
      expect((value as string).trim().length).toBeGreaterThan(0);
    }
  });
});
