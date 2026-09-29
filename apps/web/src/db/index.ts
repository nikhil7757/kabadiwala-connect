import Dexie, { type Table } from 'dexie';

export interface MetaItem {
  key: string;
  value: any;
}

export interface MaterialItem {
  id: string;
  code: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  iconKey: string;
  hazardLevel: 'NONE' | 'LOW' | 'HIGH';
  unit: 'KG' | 'PIECE';
  sortOrder: number;
  subCategories?: Array<{ id: string; code: string; nameEn: string; nameHi: string; nameMr: string }>;
}

export interface PriceItem {
  id: string;
  categoryId: string;
  categoryCode?: string;
  district: string;
  city: string;
  buyingPrice: string;
  unit: string;
  recordedAt: string;
  isSampleData?: boolean;
}

export interface RecyclerItem {
  id: string;
  name: string;
  phone?: string | null;
  city: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  serviceRadiusKm: number;
  pickupAvailable: boolean;
  authorizationStatus: string;
  materials?: Array<{ categoryId: string; offeredRatePerUnit: string }>;
}

export interface LotItem {
  clientId: string; // Primary key (UUID v4)
  serverId?: string;
  refCode?: string;
  categoryId: string;
  subCategoryCode?: string | null;
  description?: string | null;
  condition: 'WORKING' | 'BROKEN' | 'BURNT';
  sourceType?: string | null;
  approxWeightKg: number;
  estimatedValue: string;
  aiLabel?: string | null;
  aiConfidence?: number | null;
  lat?: number | null;
  lng?: number | null;
  collectedAt: string | Date;
  status: 'LOCAL_DRAFT' | 'DRAFT' | 'LISTED' | 'QUOTED' | 'ACCEPTED' | 'HANDED_OVER' | 'CONFIRMED' | 'PAID' | 'CANCELLED';
  selectedRecyclerId?: string | null;
  pickupRequested?: boolean;
  quotedPrice?: string | null;
  finalPrice?: string | null;
  anomalyFlag?: boolean;
  anomalyReason?: string | null;
  updatedAt: string | Date;
  handover?: {
    handoverRef: string;
    otp?: string;
    qrPayload?: string;
    expiresAt: string | Date;
  };
}

export interface PhotoItem {
  id: string;
  lotClientId: string;
  sha256: string;
  blob?: Blob;
  dataUrl?: string;
  purpose: 'COLLECTION' | 'HANDOVER';
  takenAt: string | Date;
  uploadedToServer?: boolean;
}

export interface LedgerItem {
  id: string;
  lotId: string;
  lotRefCode?: string;
  collectorId: string;
  recyclerId: string;
  recyclerName?: string;
  amountPaid: string;
  dueAmount: string;
  mode: 'CASH' | 'UPI';
  status: 'PENDING' | 'PARTIAL' | 'PAID';
  paidAt: string | Date;
}

export interface SafetyItem {
  id: string;
  code: string;
  titleEn: string;
  titleHi: string;
  titleMr: string;
  bodyEn: string;
  bodyHi: string;
  bodyMr: string;
  pictogramKey: string;
  audioKey: string;
  appliesToCategoryCode?: string | null;
}

export interface OutboxItem {
  actionId: string; // UUID v4
  type: 'LOT_CREATE' | 'SELECT_RECYCLER' | 'ACCEPT_QUOTE' | 'CANCEL_LOT' | 'HANDOVER_INITIATE';
  createdAt: string;
  payload: any;
  status: 'PENDING' | 'SYNCING' | 'REJECTED';
  errorMessage?: string;
}

/**
 * Dexie IndexedDB Schema v1 per TRD Section 12.3
 */
export class KabadiwalaDatabase extends Dexie {
  meta!: Table<MetaItem, string>;
  materials!: Table<MaterialItem, string>;
  prices!: Table<PriceItem, string>;
  recyclers!: Table<RecyclerItem, string>;
  lots!: Table<LotItem, string>;
  photos!: Table<PhotoItem, string>;
  ledger!: Table<LedgerItem, string>;
  safety!: Table<SafetyItem, string>;
  outbox!: Table<OutboxItem, string>;

  constructor() {
    super('KabadiwalaConnectDB');
    this.version(1).stores({
      meta: 'key',
      materials: 'id, code',
      prices: 'id, categoryId, district, recordedAt',
      recyclers: 'id, district',
      lots: 'clientId, status, updatedAt, serverId',
      photos: 'id, lotClientId',
      ledger: 'id, lotId',
      safety: 'id, code',
      outbox: 'actionId, createdAt',
    });
  }
}

export const db = new KabadiwalaDatabase();
