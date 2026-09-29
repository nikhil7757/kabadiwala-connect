import { z } from 'zod';
import { LANGUAGES } from '../constants.js';

export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number');

export const otpRequestSchema = z.object({
  phone: phoneSchema,
});
export type OtpRequestDto = z.infer<typeof otpRequestSchema>;

export const otpVerifySchema = z.object({
  phone: phoneSchema,
  otp: z.string().length(6, 'Verification code must be exactly 6 digits'),
  preferredLanguage: z.enum(LANGUAGES).optional().default('HI'),
});
export type OtpVerifyDto = z.infer<typeof otpVerifySchema>;

export const staffLoginSchema = z.object({
  email: z.string().email('Invalid email address').transform((val) => val.toLowerCase().trim()),
  password: z.string().min(1, 'Password is required'),
});
export type StaffLoginDto = z.infer<typeof staffLoginSchema>;

export const updateCollectorSchema = z.object({
  preferredLanguage: z.enum(LANGUAGES).optional(),
  district: z.string().min(1).max(50).optional(),
  operatingArea: z.string().min(1).max(100).optional(),
});
export type UpdateCollectorDto = z.infer<typeof updateCollectorSchema>;
