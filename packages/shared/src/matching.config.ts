export interface MatchingWeights {
  rate: number;
  distance: number;
  pickup: number;
  reliability: number;
  freshness: number;
}

export const DEFAULT_MATCHING_WEIGHTS: MatchingWeights = {
  rate: 40,
  distance: 25,
  pickup: 15,
  reliability: 10,
  freshness: 10,
};

export const MATCHING_LIMITS = {
  defaultLimit: 3,
  maxLimit: 5,
  earthRadiusKm: 6371,
  defaultReliability: 0.5,
  minLotsForReliability: 3,
  freshnessMaxDays: 14,
} as const;
