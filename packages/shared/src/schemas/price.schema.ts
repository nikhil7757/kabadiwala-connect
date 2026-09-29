import { z } from 'zod';
import { UNITS } from '../constants.js';
import { moneyStringSchema } from './lot.schema.js';

export const createPriceEntrySchema = z.object({
  categoryId: z.string().uuid('categoryId must be a valid UUID'),
  subCategoryCode: z.string().max(50).optional().nullable(),
  buyingPrice: moneyStringSchema,
  quotedPrice: moneyStringSchema.optional().nullable(),
  unit: z.enum(UNITS).optional().default('KG'),
  marketMin: moneyStringSchema.optional().nullable(),
  marketMax: moneyStringSchema.optional().nullable(),
});
export type CreatePriceEntryDto = z.infer<typeof createPriceEntrySchema>;

export const priceQuerySchema = z.object({
  district: z.string().optional(),
  city: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  days: z.coerce.number().int().min(1).max(365).default(30),
});
export type PriceQueryDto = z.infer<typeof priceQuerySchema>;

export const priceBoardQuerySchema = z.object({
  district: z.string().min(1, 'District is required'),
});
export type PriceBoardQueryDto = z.infer<typeof priceBoardQuerySchema>;
