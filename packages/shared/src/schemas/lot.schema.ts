import { z } from 'zod';
import {
  LOT_CONDITIONS,
  SOURCE_TYPES,
  LOT_STATUSES,
} from '../constants.js';

export const moneyStringSchema = z
  .string()
  .regex(/^\d{1,8}(\.\d{1,2})?$/, 'Must be a valid non-negative amount with at most 2 decimal places');

export const createLotSchema = z.object({
  clientId: z.string().uuid('clientId must be a valid UUID v4'),
  categoryId: z.string().uuid('categoryId must be a valid UUID'),
  subCategory: z.string().max(50).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  condition: z.enum(LOT_CONDITIONS),
  sourceType: z.enum(SOURCE_TYPES).optional().nullable(),
  approxWeightKg: z
    .number()
    .positive('Weight must be greater than 0')
    .max(5000, 'Weight cannot exceed 5000 kg'),
  estimatedValue: moneyStringSchema,
  aiLabel: z.string().max(50).optional().nullable(),
  aiConfidence: z.number().min(0).max(1).optional().nullable(),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
  collectedAt: z.coerce.date().default(() => new Date()),
});
export type CreateLotDto = z.infer<typeof createLotSchema>;

export const selectRecyclerSchema = z.object({
  recyclerId: z.string().uuid('recyclerId must be a valid UUID'),
  pickupRequested: z.boolean().default(false),
});
export type SelectRecyclerDto = z.infer<typeof selectRecyclerSchema>;

export const quoteLotSchema = z.object({
  quotedPrice: moneyStringSchema,
});
export type QuoteLotDto = z.infer<typeof quoteLotSchema>;

export const lotQuerySchema = z.object({
  status: z.enum(LOT_STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  updatedSince: z.string().datetime().optional(),
});
export type LotQueryDto = z.infer<typeof lotQuerySchema>;
