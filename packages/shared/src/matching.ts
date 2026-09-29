import { AuthorizationStatus } from './constants.js';
import {
  DEFAULT_MATCHING_WEIGHTS,
  MATCHING_LIMITS,
  MatchingWeights,
} from './matching.config.js';

export interface RecyclerCandidate {
  id: string;
  name: string;
  lat: number;
  lng: number;
  serviceRadiusKm: number;
  pickupAvailable: boolean;
  authorizationStatus: AuthorizationStatus;
  offeredRate: number; // Offered rate for the requested material category
  rateUpdatedAt: string | Date;
  lotsSelectedCount?: number;
  handoversConfirmedCount?: number;
}

export type RecyclerBadge = 'AUTHORIZED' | 'PICKUP' | 'BEST_RATE' | 'NEAREST';

export interface MatchedRecycler {
  recycler: RecyclerCandidate;
  distanceKm: number;
  offeredRate: number;
  score: number; // 0 to 100, one decimal
  badges: RecyclerBadge[];
  estimatedLotValue?: string;
}

export interface MatchingOptions {
  weights?: MatchingWeights;
  limit?: number;
  lotWeightKg?: number;
}

/**
 * Calculates great-circle distance between two coordinates in kilometers using the Haversine formula
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = MATCHING_LIMITS.earthRadiusKm;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

/**
 * Ranks eligible recyclers using the 5-factor weighted algorithm per TRD Section 11.2 & PRD 12.1
 */
export function matchRecyclers(
  collectorLat: number,
  collectorLng: number,
  candidates: RecyclerCandidate[],
  options: MatchingOptions = {}
): MatchedRecycler[] {
  const weights = options.weights || DEFAULT_MATCHING_WEIGHTS;
  const limit = Math.min(options.limit || MATCHING_LIMITS.defaultLimit, MATCHING_LIMITS.maxLimit);
  const now = Date.now();

  // 1. Eligibility Filter
  // Only VERIFIED recyclers, accepting the material (rate > 0), within service radius
  const eligible = candidates
    .filter((c) => c.authorizationStatus === 'VERIFIED' && c.offeredRate > 0)
    .map((c) => {
      const distanceKm = calculateHaversineDistance(collectorLat, collectorLng, c.lat, c.lng);
      return { candidate: c, distanceKm };
    })
    .filter(({ candidate, distanceKm }) => distanceKm <= candidate.serviceRadiusKm);

  if (eligible.length === 0) {
    return [];
  }

  // 2. Find extremes across eligible candidates for relative scoring
  const maxOfferedRate = Math.max(...eligible.map((e) => e.candidate.offeredRate));
  const minDistanceKm = Math.min(...eligible.map((e) => e.distanceKm));

  // 3. Compute 5-factor scores
  const scoredList: MatchedRecycler[] = eligible.map(({ candidate, distanceKm }) => {
    // Rate Score (0 to 1)
    const rateScore = maxOfferedRate > 0 ? candidate.offeredRate / maxOfferedRate : 1.0;

    // Distance Score (0 to 1): 1 - distance/radius
    const radius = candidate.serviceRadiusKm;
    const distanceScore = radius > 0 ? 1 - Math.min(distanceKm, radius) / radius : 0;

    // Pickup Score (0 or 1)
    const pickupScore = candidate.pickupAvailable ? 1.0 : 0.0;

    // Reliability Score (0 to 1): confirmed / selected, default 0.5 if < 3 lots
    const selected = candidate.lotsSelectedCount || 0;
    const confirmed = candidate.handoversConfirmedCount || 0;
    let reliabilityScore: number = MATCHING_LIMITS.defaultReliability;
    if (selected >= MATCHING_LIMITS.minLotsForReliability) {
      reliabilityScore = Math.min(1.0, confirmed / selected);
    }

    // Freshness Score (0 to 1): 1.0 up to 1 day old, falling linearly to 0 at 14 days
    const rateUpdatedMs = new Date(candidate.rateUpdatedAt).getTime();
    const ageDays = Math.max(0, (now - rateUpdatedMs) / (1000 * 60 * 60 * 24));
    let freshnessScore = 1.0;
    if (ageDays > 1) {
      freshnessScore = Math.max(0, 1 - (ageDays - 1) / (MATCHING_LIMITS.freshnessMaxDays - 1));
    }

    // Composite Score: 0 to 100
    const rawScore =
      weights.rate * rateScore +
      weights.distance * distanceScore +
      weights.pickup * pickupScore +
      weights.reliability * reliabilityScore +
      weights.freshness * freshnessScore;

    const score = Math.round(rawScore * 10) / 10;

    // Badges Assignment
    const badges: RecyclerBadge[] = ['AUTHORIZED'];
    if (candidate.pickupAvailable) {
      badges.push('PICKUP');
    }
    if (candidate.offeredRate >= maxOfferedRate) {
      badges.push('BEST_RATE');
    }
    if (distanceKm <= minDistanceKm) {
      badges.push('NEAREST');
    }

    let estimatedLotValue: string | undefined;
    if (options.lotWeightKg && options.lotWeightKg > 0) {
      estimatedLotValue = (Math.round(options.lotWeightKg * candidate.offeredRate * 100) / 100).toFixed(2);
    }

    return {
      recycler: candidate,
      distanceKm,
      offeredRate: candidate.offeredRate,
      score,
      badges,
      estimatedLotValue,
    };
  });

  // 4. Sort: score descending, tie-break by lower distance
  scoredList.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.distanceKm - b.distanceKm;
  });

  return scoredList.slice(0, limit);
}
