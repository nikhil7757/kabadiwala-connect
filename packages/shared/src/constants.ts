export const ROLES = ['COLLECTOR', 'RECYCLER', 'ADMIN'] as const;
export type Role = (typeof ROLES)[number];

export const LANGUAGES = ['HI', 'MR', 'EN'] as const;
export type Language = (typeof LANGUAGES)[number];

export const AUTHORIZATION_STATUSES = ['PENDING', 'VERIFIED', 'SUSPENDED'] as const;
export type AuthorizationStatus = (typeof AUTHORIZATION_STATUSES)[number];

export const HAZARD_LEVELS = ['NONE', 'LOW', 'HIGH'] as const;
export type HazardLevel = (typeof HAZARD_LEVELS)[number];

export const UNITS = ['KG', 'PIECE'] as const;
export type Unit = (typeof UNITS)[number];

export const LOT_STATUSES = [
  'DRAFT',
  'LISTED',
  'QUOTED',
  'ACCEPTED',
  'HANDED_OVER',
  'CONFIRMED',
  'PAID',
  'CANCELLED',
] as const;
export type LotStatus = (typeof LOT_STATUSES)[number];

export const LOT_CONDITIONS = ['WORKING', 'BROKEN', 'BURNT'] as const;
export type LotCondition = (typeof LOT_CONDITIONS)[number];

export const SOURCE_TYPES = ['HOUSEHOLD', 'OFFICE', 'SHOP', 'AGGREGATOR', 'OTHER'] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const LOCATION_SOURCES = ['GPS', 'LAST', 'DISTRICT'] as const;
export type LocationSource = (typeof LOCATION_SOURCES)[number];

export const PRICE_SOURCES = ['RECYCLER', 'SEED', 'FIELD_SURVEY'] as const;
export type PriceSource = (typeof PRICE_SOURCES)[number];

export const PHOTO_PURPOSES = ['COLLECTION', 'HANDOVER'] as const;
export type PhotoPurpose = (typeof PHOTO_PURPOSES)[number];

export const HANDOVER_METHODS = ['QR', 'OTP'] as const;
export type HandoverMethod = (typeof HANDOVER_METHODS)[number];

export const PAYMENT_MODES = ['CASH', 'UPI'] as const;
export type PaymentMode = (typeof PAYMENT_MODES)[number];

export const PAYMENT_STATUSES = ['PENDING', 'PARTIAL', 'PAID'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const TRACE_EVENT_TYPES = [
  'LOT_CREATED',
  'RECYCLER_SELECTED',
  'QUOTED',
  'QUOTE_ACCEPTED',
  'HANDOVER_INITIATED',
  'HANDOVER_CONFIRMED',
  'PAYMENT_RECORDED',
  'CANCELLED',
] as const;
export type TraceEventType = (typeof TRACE_EVENT_TYPES)[number];

export const SYNC_ACTION_TYPES = [
  'LOT_CREATE',
  'SELECT_RECYCLER',
  'ACCEPT_QUOTE',
  'CANCEL_LOT',
  'HANDOVER_INITIATE',
] as const;
export type SyncActionType = (typeof SYNC_ACTION_TYPES)[number];

export const SYNC_ACTION_STATUSES = ['APPLIED', 'DUPLICATE', 'REJECTED'] as const;
export type SyncActionStatus = (typeof SYNC_ACTION_STATUSES)[number];

export const MATERIAL_CODES = [
  'CABLE',
  'PCB',
  'BATTERY',
  'CRT',
  'LCD',
  'MOTOR',
  'PLASTIC',
  'OTHER',
] as const;
export type MaterialCode = (typeof MATERIAL_CODES)[number];

export const HAZARDOUS_CATEGORIES: readonly MaterialCode[] = ['BATTERY', 'CRT'];
