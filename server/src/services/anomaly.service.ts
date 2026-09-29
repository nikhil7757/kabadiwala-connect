import { Prisma } from '@prisma/client';
import {
  checkPriceAnomaly,
  checkWeightPlausibility,
  checkWeightDivergence,
  MaterialCode,
} from '@kabadiwala/shared';
import { prisma } from '../lib/prisma.js';

export class AnomalyService {
  /**
   * Evaluates price and weight plausibility for lot quotes and handovers
   */
  static async evaluateLotQuote(
    categoryId: string,
    city: string,
    quotedPrice: number,
    approxWeightKg: number
  ): Promise<{
    anomalyFlag: boolean;
    anomalyReason: string | null;
    anomalyDetail: any;
  }> {
    const reasons: string[] = [];
    let anomalyDetail: any = null;

    // 1. Price Anomaly Check
    const unitPrice = approxWeightKg > 0 ? quotedPrice / approxWeightKg : 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);

    const historicalEntries = await prisma.priceEntry.findMany({
      where: {
        categoryId,
        city,
        recordedAt: { gte: thirtyDaysAgo },
      },
      select: { buyingPrice: true },
      take: 100,
    });

    const prices = historicalEntries.map((e) => Number(e.buyingPrice));
    const priceAnomaly = checkPriceAnomaly(unitPrice, prices);

    if (priceAnomaly && priceAnomaly.isOutlier) {
      reasons.push(priceAnomaly.reason!);
      anomalyDetail = {
        z: priceAnomaly.z,
        mean: priceAnomaly.mean,
        sd: priceAnomaly.sd,
        expectedMin: priceAnomaly.expectedMin,
        expectedMax: priceAnomaly.expectedMax,
      };
    }

    // 2. Weight Plausibility Check
    const category = await prisma.materialCategory.findUnique({
      where: { id: categoryId },
      select: { code: true },
    });

    if (category) {
      const weightPlausibility = checkWeightPlausibility(
        category.code as MaterialCode,
        approxWeightKg
      );
      if (weightPlausibility.isImplausible) {
        reasons.push(weightPlausibility.reason!);
        anomalyDetail = {
          ...anomalyDetail,
          weightRange: { min: weightPlausibility.minKg, max: weightPlausibility.maxKg },
        };
      }
    }

    const anomalyFlag = reasons.length > 0;
    const anomalyReason = anomalyFlag ? reasons.join('; ') : null;

    return {
      anomalyFlag,
      anomalyReason,
      anomalyDetail,
    };
  }

  /**
   * Evaluates verified weight difference during handover confirmation
   */
  static evaluateWeightDifference(
    declaredWeightKg: number,
    verifiedWeightKg: number
  ): {
    anomalyFlag: boolean;
    anomalyReason: string | null;
    diffPercent: number;
  } {
    const diff = checkWeightDivergence(declaredWeightKg, verifiedWeightKg);
    return {
      anomalyFlag: diff.isDivergent,
      anomalyReason: diff.reason || null,
      diffPercent: diff.diffPercent,
    };
  }
}
