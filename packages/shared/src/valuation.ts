import { Unit } from './constants.js';

export interface ValuationInput {
  quantity: number; // weight in kg, or count if unit is PIECE
  unitRate: number; // rate per unit
  fallbackRate?: number; // state or regional fallback rate
  unit?: Unit;
}

export interface ValuationResult {
  estimatedValue: string; // two-decimal string e.g. "360.00"
  effectiveRate: string;
  isFallback: boolean;
  unit: Unit;
}

/**
 * Deterministic valuation calculation per TRD Section 11.1
 * Note: This is an exact mathematical estimate, not ML, and must not be called AI in UI.
 */
export function calculateValuation(input: ValuationInput): ValuationResult {
  const { quantity, unitRate, fallbackRate, unit = 'KG' } = input;

  if (quantity < 0) {
    throw new Error('Quantity cannot be negative');
  }

  let rate = unitRate;
  let isFallback = false;

  if (rate <= 0 && fallbackRate && fallbackRate > 0) {
    rate = fallbackRate;
    isFallback = true;
  }

  const rawVal = Math.round(quantity * rate * 100) / 100;
  const estimatedValue = rawVal.toFixed(2);
  const effectiveRate = rate.toFixed(2);

  return {
    estimatedValue,
    effectiveRate,
    isFallback,
    unit,
  };
}
