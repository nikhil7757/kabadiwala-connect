import crypto from 'node:crypto';
import { stringify } from 'csv-stringify';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';

export class ExportService {
  /**
   * Hashes collector UUID to a non-reversible 12-char identifier for privacy
   */
  static hashCollectorId(collectorId: string): string {
    return crypto.createHash('sha256').update(collectorId).digest('hex').slice(0, 12);
  }

  /**
   * Rounds GPS coordinates to 2 decimal places (~1.1 km precision) to protect collector location
   */
  static roundGps(coord: number | null | undefined): string {
    if (coord === null || coord === undefined || isNaN(coord)) return '';
    return (Math.round(coord * 100) / 100).toFixed(2);
  }

  /**
   * Streams an anonymized CSV export of the requested dataset per TRD Section 10.8 & BACKEND.md 6.8
   */
  static async streamExport(dataset: string, resStream: any) {
    const stringifier = stringify({ header: true });
    stringifier.pipe(resStream);

    switch (dataset) {
      case 'materials': {
        const rows = await prisma.materialCategory.findMany({
          orderBy: { sortOrder: 'asc' },
        });
        for (const r of rows) {
          stringifier.write({
            code: r.code,
            name_en: r.nameEn,
            name_hi: r.nameHi,
            name_mr: r.nameMr,
            hazard_level: r.hazardLevel,
            unit: r.unit,
            sort_order: r.sortOrder,
            is_active: r.isActive,
          });
        }
        break;
      }

      case 'prices': {
        const rows = await prisma.priceEntry.findMany({
          include: { category: { select: { code: true } } },
          orderBy: { recordedAt: 'desc' },
        });
        for (const r of rows) {
          stringifier.write({
            id: r.id,
            category_code: r.category.code,
            sub_category_code: r.subCategoryCode || '',
            city: r.city,
            district: r.district,
            state: r.state,
            recorded_at: r.recordedAt.toISOString(),
            buying_price: r.buyingPrice.toString(),
            quoted_price: r.quotedPrice ? r.quotedPrice.toString() : '',
            unit: r.unit,
            source: r.source,
            is_sample_data: r.isSampleData,
          });
        }
        break;
      }

      case 'recyclers': {
        const rows = await prisma.recycler.findMany({
          orderBy: { name: 'asc' },
        });
        for (const r of rows) {
          stringifier.write({
            id: r.id,
            name: r.name,
            city: r.city,
            district: r.district,
            state: r.state,
            lat: ExportService.roundGps(r.lat),
            lng: ExportService.roundGps(r.lng),
            service_radius_km: r.serviceRadiusKm,
            pickup_available: r.pickupAvailable,
            authorization_no: r.authorizationNo || '',
            authorization_body: r.authorizationBody || '',
            authorization_status: r.authorizationStatus,
            is_sample_data: r.isSampleData,
          });
        }
        break;
      }

      case 'transactions': {
        const rows = await prisma.lot.findMany({
          include: {
            category: { select: { code: true } },
            handover: true,
          },
          orderBy: { createdAt: 'desc' },
        });
        for (const r of rows) {
          stringifier.write({
            ref_code: r.refCode,
            category_code: r.category.code,
            approx_weight_kg: r.approxWeightKg,
            verified_weight_kg: r.handover?.weightKgVerified ?? '',
            estimated_value: r.estimatedValue.toString(),
            quoted_price: r.quotedPrice ? r.quotedPrice.toString() : '',
            final_price: r.finalPrice ? r.finalPrice.toString() : '',
            status: r.status,
            handover_ref: r.handover?.handoverRef || '',
            confirm_method: r.handover?.confirmMethod || '',
            anomaly_flag: r.anomalyFlag,
            anomaly_reason: r.anomalyReason || '',
            created_at: r.createdAt.toISOString(),
            confirmed_at: r.confirmedAt ? r.confirmedAt.toISOString() : '',
            is_sample_data: r.isSampleData,
          });
        }
        break;
      }

      case 'traceability': {
        const rows = await prisma.traceRecord.findMany({
          orderBy: [{ lotId: 'asc' }, { seq: 'asc' }],
        });
        for (const r of rows) {
          stringifier.write({
            lot_id: r.lotId,
            seq: r.seq,
            event_type: r.eventType,
            prev_hash: r.prevHash,
            hash: r.hash,
            created_at: r.createdAt.toISOString(),
          });
        }
        break;
      }

      case 'collectors': {
        const rows = await prisma.collector.findMany({
          orderBy: { createdAt: 'desc' },
        });
        for (const r of rows) {
          stringifier.write({
            hashed_collector_id: ExportService.hashCollectorId(r.id),
            preferred_language: r.preferredLanguage,
            state: r.state || '',
            district: r.district || '',
            operating_area: r.operatingArea || '',
            is_sample_data: r.isSampleData,
            created_at: r.createdAt.toISOString(),
          });
        }
        break;
      }

      default:
        throw AppError.notFound(`Dataset ${dataset} is not recognized for export`);
    }

    stringifier.end();
  }
}
