import { describe, it, expect } from 'vitest';
import {
  calculateValuation,
  matchRecyclers,
  RecyclerCandidate,
  checkPriceAnomaly,
  checkWeightPlausibility,
  checkWeightDivergence,
  calculatePriceTrend,
  canonicalJson,
  computeTraceHash,
  verifyTraceChain,
  pureSha256Hex,
  GENESIS_PREV_HASH,
} from '../src/index.js';

describe('Phase 2 Pure Algorithms Test Suite', () => {
  // 1. Valuation
  describe('Valuation (valuation.ts)', () => {
    it('computes exact two-decimal valuation without floating point rounding artifacts', () => {
      const result = calculateValuation({ quantity: 12.5, unitRate: 320 });
      expect(result.estimatedValue).toBe('4000.00');
      expect(result.effectiveRate).toBe('320.00');
      expect(result.isFallback).toBe(false);
    });

    it('falls back to state average when local district rate is zero or missing', () => {
      const result = calculateValuation({ quantity: 10, unitRate: 0, fallbackRate: 180 });
      expect(result.estimatedValue).toBe('1800.00');
      expect(result.effectiveRate).toBe('180.00');
      expect(result.isFallback).toBe(true);
    });

    it('throws error for negative quantity', () => {
      expect(() => calculateValuation({ quantity: -5, unitRate: 100 })).toThrow('negative');
    });
  });

  // 2. Matching
  describe('Recycler Matching (matching.ts)', () => {
    const candidates: RecyclerCandidate[] = [
      {
        id: 'rec-1',
        name: 'Top Rate Buyer',
        lat: 18.535,
        lng: 73.865,
        serviceRadiusKm: 30,
        pickupAvailable: true,
        authorizationStatus: 'VERIFIED',
        offeredRate: 200,
        rateUpdatedAt: new Date().toISOString(),
        lotsSelectedCount: 10,
        handoversConfirmedCount: 9,
      },
      {
        id: 'rec-2',
        name: 'Nearest Buyer',
        lat: 18.521,
        lng: 73.857,
        serviceRadiusKm: 25,
        pickupAvailable: false,
        authorizationStatus: 'VERIFIED',
        offeredRate: 180,
        rateUpdatedAt: new Date().toISOString(),
        lotsSelectedCount: 5,
        handoversConfirmedCount: 5,
      },
      {
        id: 'rec-3-suspended',
        name: 'Suspended Recycler',
        lat: 18.522,
        lng: 73.858,
        serviceRadiusKm: 20,
        pickupAvailable: true,
        authorizationStatus: 'SUSPENDED', // Must be omitted!
        offeredRate: 300,
        rateUpdatedAt: new Date().toISOString(),
      },
      {
        id: 'rec-4-too-far',
        name: 'Outside Radius Buyer',
        lat: 19.997,
        lng: 73.789, // ~170 km away
        serviceRadiusKm: 20,
        pickupAvailable: true,
        authorizationStatus: 'VERIFIED',
        offeredRate: 250,
        rateUpdatedAt: new Date().toISOString(),
      },
    ];

    it('strictly excludes suspended recyclers and candidates outside service radius', () => {
      const collectorLat = 18.5204;
      const collectorLng = 73.8567;
      const matches = matchRecyclers(collectorLat, collectorLng, candidates);

      expect(matches.length).toBe(2);
      expect(matches.map((m) => m.recycler.id)).not.toContain('rec-3-suspended');
      expect(matches.map((m) => m.recycler.id)).not.toContain('rec-4-too-far');
    });

    it('assigns appropriate badges (AUTHORIZED, PICKUP, BEST_RATE, NEAREST)', () => {
      const collectorLat = 18.5204;
      const collectorLng = 73.8567;
      const matches = matchRecyclers(collectorLat, collectorLng, candidates);

      const topRate = matches.find((m) => m.recycler.id === 'rec-1')!;
      expect(topRate.badges).toContain('AUTHORIZED');
      expect(topRate.badges).toContain('BEST_RATE');
      expect(topRate.badges).toContain('PICKUP');

      const nearest = matches.find((m) => m.recycler.id === 'rec-2')!;
      expect(nearest.badges).toContain('AUTHORIZED');
      expect(nearest.badges).toContain('NEAREST');
    });
  });

  // 3. Anomaly Detection
  describe('Anomaly Detection (anomaly.ts)', () => {
    it('skips outlier check when fewer than 5 historical samples exist', () => {
      const res = checkPriceAnomaly(500, [100, 105, 95]);
      expect(res).toBeNull();
    });

    it('skips outlier check when standard deviation is zero', () => {
      const res = checkPriceAnomaly(500, [100, 100, 100, 100, 100]);
      expect(res).toBeNull();
    });

    it('identifies price outlier exceeding 3 standard deviations', () => {
      const normalHistory = [100, 102, 98, 101, 99, 100, 101, 97];
      const outlierRes = checkPriceAnomaly(200, normalHistory);
      expect(outlierRes).not.toBeNull();
      expect(outlierRes?.isOutlier).toBe(true);
      expect(outlierRes?.z).toBeGreaterThan(3);

      const normalRes = checkPriceAnomaly(101, normalHistory);
      expect(normalRes?.isOutlier).toBe(false);
    });

    it('validates physical weight plausibility bounds', () => {
      const validPcb = checkWeightPlausibility('PCB', 5.0);
      expect(validPcb.isImplausible).toBe(false);

      const crazyPcb = checkWeightPlausibility('PCB', 250.0);
      expect(crazyPcb.isImplausible).toBe(true);
      expect(crazyPcb.reason).toContain('WEIGHT_IMPLAUSIBLE');
    });

    it('flags verified weight difference exceeding 15% threshold', () => {
      const minor = checkWeightDivergence(10.0, 10.5); // 5% diff
      expect(minor.isDivergent).toBe(false);

      const major = checkWeightDivergence(10.0, 12.0); // 20% diff
      expect(major.isDivergent).toBe(true);
      expect(major.reason).toBe('WEIGHT_DIFFERENCE');
    });
  });

  // 4. Trend Calculations
  describe('Price Trend (trend.ts)', () => {
    it('returns NONE when fewer than 3 daily samples exist', () => {
      const res = calculatePriceTrend([100, 102]);
      expect(res.trend).toBe('NONE');
    });

    it('detects UP trend when 7-day average exceeds 30-day average by > 3%', () => {
      // 30 days of 100, ending with 7 days of 115
      const series = Array(23).fill(100).concat(Array(7).fill(115));
      const res = calculatePriceTrend(series);
      expect(res.trend).toBe('UP');
      expect(res.changePercent).toBeGreaterThan(3);
    });

    it('detects DOWN trend when 7-day average falls below 30-day average by < -3%', () => {
      const series = Array(23).fill(100).concat(Array(7).fill(85));
      const res = calculatePriceTrend(series);
      expect(res.trend).toBe('DOWN');
      expect(res.changePercent).toBeLessThan(-3);
    });

    it('detects FLAT trend when change is within +/- 3%', () => {
      const series = Array(30).fill(100);
      const res = calculatePriceTrend(series);
      expect(res.trend).toBe('FLAT');
      expect(res.changePercent).toBe(0);
    });
  });

  // 5. Canonical JSON & Trace Hash Chain
  describe('Trace & Hash Chain (trace.ts)', () => {
    it('ensures canonical JSON sorts keys alphabetically at every level without whitespace', () => {
      const objA = { z: 1, a: { b: 2, a: 1 }, m: [3, 2, 1] };
      const objB = { a: { a: 1, b: 2 }, m: [3, 2, 1], z: 1 };

      expect(canonicalJson(objA)).toBe('{"a":{"a":1,"b":2},"m":[3,2,1],"z":1}');
      expect(canonicalJson(objA)).toBe(canonicalJson(objB));
    });

    it('builds tamper-evident SHA-256 hash chain and verifies valid sequences', () => {
      const lotId = '550e8400-e29b-41d4-a716-446655440000';
      const t1 = '2026-09-29T10:00:00.000Z';
      const t2 = '2026-09-29T10:05:00.000Z';

      const h1 = computeTraceHash(
        GENESIS_PREV_HASH,
        lotId,
        1,
        'LOT_CREATED',
        { approxWeightKg: 12.5, category: 'PCB' },
        t1
      );

      const h2 = computeTraceHash(
        h1,
        lotId,
        2,
        'RECYCLER_SELECTED',
        { recyclerId: 'rec-1', pickup: true },
        t2
      );

      const chain = [
        {
          lotId,
          seq: 1,
          eventType: 'LOT_CREATED' as const,
          payload: { approxWeightKg: 12.5, category: 'PCB' },
          prevHash: GENESIS_PREV_HASH,
          hash: h1,
          createdAt: t1,
        },
        {
          lotId,
          seq: 2,
          eventType: 'RECYCLER_SELECTED' as const,
          payload: { recyclerId: 'rec-1', pickup: true },
          prevHash: h1,
          hash: h2,
          createdAt: t2,
        },
      ];

      const verifyRes = verifyTraceChain(chain);
      expect(verifyRes.valid).toBe(true);
      expect(verifyRes.firstMismatchSeq).toBeNull();
    });

    it('detects tampered payload in hash chain and pinpoints the corrupted sequence', () => {
      const lotId = '550e8400-e29b-41d4-a716-446655440000';
      const t1 = '2026-09-29T10:00:00.000Z';

      const h1 = computeTraceHash(
        GENESIS_PREV_HASH,
        lotId,
        1,
        'LOT_CREATED',
        { weightKg: 10 },
        t1
      );

      const tamperedChain = [
        {
          lotId,
          seq: 1,
          eventType: 'LOT_CREATED' as const,
          payload: { weightKg: 999 }, // Tampered value!
          prevHash: GENESIS_PREV_HASH,
          hash: h1,
          createdAt: t1,
        },
      ];

      const verifyRes = verifyTraceChain(tamperedChain);
      expect(verifyRes.valid).toBe(false);
      expect(verifyRes.firstMismatchSeq).toBe(1);
    });
  });
});
