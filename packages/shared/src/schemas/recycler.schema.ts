import { z } from 'zod';
import { AUTHORIZATION_STATUSES } from '../constants.js';
import { moneyStringSchema } from './lot.schema.js';

export const updateRecyclerProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Must be a 10-digit Indian phone number').optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  serviceRadiusKm: z.number().positive().max(200).optional(),
  pickupAvailable: z.boolean().optional(),
});
export type UpdateRecyclerProfileDto = z.infer<typeof updateRecyclerProfileSchema>;

export const rateItemSchema = z.object({
  categoryId: z.string().uuid('categoryId must be a valid UUID'),
  offeredRatePerUnit: moneyStringSchema,
});

export const updateRecyclerRatesSchema = z.object({
  rates: z.array(rateItemSchema).min(1, 'At least one rate must be provided'),
});
export type UpdateRecyclerRatesDto = z.infer<typeof updateRecyclerRatesSchema>;

export const adminCreateRecyclerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  city: z.string().min(2),
  district: z.string().min(2),
  state: z.string().length(2),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  serviceRadiusKm: z.number().positive().default(25),
  pickupAvailable: z.boolean().default(false),
  authorizationNo: z.string().max(100).optional().nullable(),
  authorizationBody: z.string().max(100).optional().nullable(),
  authorizationValidTill: z.coerce.date().optional().nullable(),
});
export type AdminCreateRecyclerDto = z.infer<typeof adminCreateRecyclerSchema>;

export const adminUpdateRecyclerStatusSchema = z.object({
  authorizationStatus: z.enum(AUTHORIZATION_STATUSES),
});
export type AdminUpdateRecyclerStatusDto = z.infer<typeof adminUpdateRecyclerStatusSchema>;
