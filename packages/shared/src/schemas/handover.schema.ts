import { z } from 'zod';
import { HANDOVER_METHODS } from '../constants.js';

export const initiateHandoverSchema = z.object({
  lotId: z.string().uuid('lotId must be a valid UUID'),
  weightKg: z.number().positive().max(5000),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
  handoverAt: z.coerce.date().default(() => new Date()),
});
export type InitiateHandoverDto = z.infer<typeof initiateHandoverSchema>;

export const confirmHandoverSchema = z
  .object({
    handoverRef: z.string().optional(),
    otp: z.string().length(6, 'OTP must be 6 digits').optional(),
    qrPayload: z.string().optional(),
    weightKgVerified: z.number().positive().max(5000),
    method: z.enum(HANDOVER_METHODS),
  })
  .refine(
    (data) => (data.handoverRef && data.otp) || data.qrPayload,
    'Either (handoverRef and otp) or qrPayload must be provided'
  );
export type ConfirmHandoverDto = z.infer<typeof confirmHandoverSchema>;

export const qrPayloadSchema = z.object({
  v: z.literal(1),
  t: z.literal('KC-HO'),
  ref: z.string().min(5),
  lot: z.string().uuid(),
  w: z.number().positive(),
});
export type QrPayloadDto = z.infer<typeof qrPayloadSchema>;
