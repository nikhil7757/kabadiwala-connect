import {
  Role,
  Language,
  AuthorizationStatus,
  HazardLevel,
  Unit,
  LotStatus,
  LotCondition,
  SourceType,
  LocationSource,
  PriceSource,
  PhotoPurpose,
  HandoverMethod,
  PaymentMode,
  PaymentStatus,
  TraceEventType,
  SyncActionType,
  SyncActionStatus,
} from './constants.js';

export interface ApiResponse<T = any> {
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}

export interface JwtPayload {
  sub: string;
  role: Role;
  iat: number;
  exp: number;
}

export interface CollectorPublic {
  id: string;
  phone: string;
  preferredLanguage: Language;
  state?: string | null;
  district?: string | null;
  operatingArea?: string | null;
  isSampleData: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecyclerPublic {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  city: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  serviceRadiusKm: number;
  pickupAvailable: boolean;
  authorizationNo?: string | null;
  authorizationBody?: string | null;
  authorizationValidTill?: string | null;
  authorizationStatus: AuthorizationStatus;
  isSampleData: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialCategoryDto {
  id: string;
  code: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  iconKey: string;
  hazardLevel: HazardLevel;
  unit: Unit;
  sortOrder: number;
  isActive: boolean;
  subCategories?: MaterialSubCategoryDto[];
}

export interface MaterialSubCategoryDto {
  id: string;
  categoryId: string;
  code: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  sortOrder: number;
}

export interface PriceBoardItem {
  categoryId: string;
  categoryCode: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  iconKey: string;
  latest: string;
  unit: Unit;
  ma7: string | null;
  ma30: string | null;
  trend: 'UP' | 'DOWN' | 'FLAT' | 'NONE';
  marketMin: string | null;
  marketMax: string | null;
  updatedAt: string;
  isSampleData: boolean;
  isFallback?: boolean;
}
