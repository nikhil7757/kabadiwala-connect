import { z } from 'zod';
import { SYNC_ACTION_TYPES } from '../constants.js';

export const syncActionItemSchema = z.object({
  actionId: z.string().uuid('actionId must be a valid UUID'),
  type: z.enum(SYNC_ACTION_TYPES),
  createdAt: z.coerce.date(),
  payload: z.record(z.any()),
});
export type SyncActionItemDto = z.infer<typeof syncActionItemSchema>;

export const syncPayloadSchema = z.object({
  deviceId: z.string().min(1, 'deviceId is required'),
  since: z.string().datetime().optional().nullable(),
  actions: z.array(syncActionItemSchema).default([]),
});
export type SyncPayloadDto = z.infer<typeof syncPayloadSchema>;
