import { MaterialCode } from './constants.js';
import {
  ANOMALY_THRESHOLDS,
  CATEGORY_WEIGHT_RANGES,
  WeightRange,
} from './plausibility.config.js';

export interface PriceAnomalyResult {
  isOutlier: boolean;
  z: number;
  mean: number;
  sd: number;
  expectedMin: number;
  expectedMax: number;
  reason?: string;
}

export interface WeightPlausibilityResult {
  isImplausible: boolean;
  minKg: number;
  maxKg: number;
  reason?: string;
}

export interface WeightDivergenceResult {
  isDivergent: boolean;
  diffPercent: number; // e.g. 18.5 for 18.5%
  reason?: string;
}

/**
 * Checks if a transaction unit price is an abnormal outlier using z-score (TRD Section 11.3)
 * Reference set: buyingPrice entries for the same category and city in the prior 30 days.
 * If fewer than 5 samples or standard deviation is 0, skip check (returns null).
 */
export function checkPriceAnomaly(
  unitPrice: number,
  historicalPrices: number[]
): PriceAnomalyResult | null {
  if (historicalPrices.length < ANOMALY_THRESHOLDS.minHistoricalSamples) {
    return null;
  }

  const n = historicalPrices.length;
  const mean = historicalPrices.reduce((sum, p) => sum + p, 0) / n;

  // Sample variance
  const variance =
    historicalPrices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / (n - 1);
  const sd = Math.sqrt(variance);

  if (sd === 0) {
    return null;
  }

  const z = (unitPrice - mean) / sd;
  const roundedZ = Math.round(z * 100) / 100;
  const isOutlier = Math.abs(z) > ANOMALY_THRESHOLDS.zScoreCutoff;

  const expectedMin = Math.round(Math.max(0, mean - ANOMALY_THRESHOLDS.zScoreCutoff * sd) * 100) / 100;
  const expectedMax = Math.round((mean + ANOMALY_THRESHOLDS.zScoreCutoff * sd) * 100) / 100;

  return {
    isOutlier,
    z: roundedZ,
    mean: Math.round(mean * 100) / 100,
    sd: Math.round(sd * 100) / 100,
    expectedMin,
    expectedMax,
    reason: isOutlier
      ? `PRICE_OUTLIER: z=${roundedZ}, expected ${expectedMin} to ${expectedMax}`
      : undefined,
  };
}

/**
 * Validates whether entered weight falls within physical bounds per category
 */
export function checkWeightPlausibility(
  categoryCode: MaterialCode,
  weightKg: number
): WeightPlausibilityResult {
  const range: WeightRange = CATEGORY_WEIGHT_RANGES[categoryCode] || {
    minKg: 0.1,
    maxKg: 500.0,
  };

  const isImplausible = weightKg < range.minKg || weightKg > range.maxKg;

  return {
    isImplausible,
    minKg: range.minKg,
    maxKg: range.maxKg,
    reason: isImplausible
      ? `WEIGHT_IMPLAUSIBLE: ${weightKg}kg outside valid range ${range.minKg}kg - ${range.maxKg}kg`
      : undefined,
  };
}

/**
 * Detects divergence between collector-declared weight and recycler-verified scale weight (TRD Section 10.5)
 */
export function checkWeightDivergence(
  collectorWeightKg: number,
  verifiedWeightKg: number
): WeightDivergenceResult {
  if (collectorWeightKg <= 0) {
    return { isDivergent: true, diffPercent: 100, reason: 'WEIGHT_DIFFERENCE' };
  }

  const diffRatio = Math.abs(verifiedWeightKg - collectorWeightKg) / collectorWeightKg;
  const diffPercent = Math.round(diffRatio * 1000) / 10;
  const isDivergent = diffRatio > ANOMALY_THRESHOLDS.maxWeightVariancePercent;

  return {
    isDivergent,
    diffPercent,
    reason: isDivergent ? 'WEIGHT_DIFFERENCE' : undefined,
  };
}
