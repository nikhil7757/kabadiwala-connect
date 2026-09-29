import { z } from 'zod';
import { AUTHORIZATION_STATUSES } from '../constants.js';

export const createRecyclerByAdminSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number').optional().nullable(),
  address: z.string().max(255).optional().nullable(),
  city: z.string().min(2).max(50),
  district: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  serviceRadiusKm: z.number().positive().max(500).default(25),
  pickupAvailable: z.boolean().default(false),
  authorizationNo: z.string().max(100).optional().nullable(),
  authorizationBody: z.string().max(100).optional().nullable(),
  authorizationValidTill: z.coerce.date().optional().nullable(),
});
export type CreateRecyclerByAdminDto = z.infer<typeof createRecyclerByAdminSchema>;

export const updateRecyclerStatusSchema = z.object({
  authorizationStatus: z.enum(AUTHORIZATION_STATUSES),
  reason: z.string().max(255).optional(),
});
export type UpdateRecyclerStatusDto = z.infer<typeof updateRecyclerStatusSchema>;

export const adminQuerySchema = z.object({
  status: z.enum(AUTHORIZATION_STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type AdminQueryDto = z.infer<typeof adminQuerySchema>;
