export type PriceTrendDirection = 'UP' | 'DOWN' | 'FLAT' | 'NONE';

export interface PriceTrendResult {
  trend: PriceTrendDirection;
  ma7: string | null;
  ma30: string | null;
  changePercent: number | null; // e.g. +5.2 or -4.1
}

/**
 * Calculates 7-day vs 30-day moving average price trend per TRD Section 11.4
 * Expects chronological sequence of daily prices (latest at the end).
 * Requires minimum 3 daily samples; otherwise returns 'NONE'.
 */
export function calculatePriceTrend(dailyPrices: number[]): PriceTrendResult {
  if (!dailyPrices || dailyPrices.length < 3) {
    return {
      trend: 'NONE',
      ma7: null,
      ma30: null,
      changePercent: null,
    };
  }

  const n = dailyPrices.length;

  // Last 7 days (or all available if fewer)
  const window7Count = Math.min(7, n);
  const window7 = dailyPrices.slice(n - window7Count);
  const ma7Val = window7.reduce((sum, p) => sum + p, 0) / window7Count;

  // Last 30 days (or all available if fewer)
  const window30Count = Math.min(30, n);
  const window30 = dailyPrices.slice(n - window30Count);
  const ma30Val = window30.reduce((sum, p) => sum + p, 0) / window30Count;

  if (ma30Val === 0) {
    return {
      trend: 'FLAT',
      ma7: ma7Val.toFixed(2),
      ma30: ma30Val.toFixed(2),
      changePercent: 0,
    };
  }

  const change = (ma7Val - ma30Val) / ma30Val;
  const changePercent = Math.round(change * 1000) / 10;

  let trend: PriceTrendDirection = 'FLAT';
  if (change > 0.03) {
    trend = 'UP';
  } else if (change < -0.03) {
    trend = 'DOWN';
  }

  return {
    trend,
    ma7: ma7Val.toFixed(2),
    ma30: ma30Val.toFixed(2),
    changePercent,
  };
}
