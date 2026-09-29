import { MaterialCode } from './constants.js';

export interface WeightRange {
  minKg: number;
  maxKg: number;
}

export const CATEGORY_WEIGHT_RANGES: Record<MaterialCode, WeightRange> = {
  CABLE: { minKg: 0.1, maxKg: 300.0 },
  PCB: { minKg: 0.05, maxKg: 100.0 },
  BATTERY: { minKg: 0.05, maxKg: 150.0 },
  CRT: { minKg: 3.0, maxKg: 60.0 },
  LCD: { minKg: 0.5, maxKg: 60.0 },
  MOTOR: { minKg: 0.1, maxKg: 200.0 },
  PLASTIC: { minKg: 0.1, maxKg: 500.0 },
  OTHER: { minKg: 0.1, maxKg: 500.0 },
};

export const ANOMALY_THRESHOLDS = {
  minHistoricalSamples: 5,
  zScoreCutoff: 3.0,
  maxWeightVariancePercent: 0.15, // 15% handover weight divergence threshold
} as const;
