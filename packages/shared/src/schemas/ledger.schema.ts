import { z } from 'zod';
import { PAYMENT_MODES } from '../constants.js';
import { moneyStringSchema } from './lot.schema.js';

export const createLedgerEntrySchema = z.object({
  lotId: z.string().uuid('lotId must be a valid UUID'),
  amountPaid: moneyStringSchema,
  mode: z.enum(PAYMENT_MODES),
});
export type CreateLedgerEntryDto = z.infer<typeof createLedgerEntrySchema>;
