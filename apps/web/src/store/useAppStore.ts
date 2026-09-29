import { create } from 'zustand';
import { db } from '../db/index.js';

export type LanguageCode = 'HI' | 'MR' | 'EN';
export type AppTheme = 'field' | 'control';

export interface AppState {
  language: LanguageCode;
  token: string | null;
  role: 'COLLECTOR' | 'RECYCLER' | 'ADMIN' | null;
  collector: {
    id: string;
    phone?: string;
    preferredLanguage?: LanguageCode;
    district?: string;
    operatingArea?: string;
  } | null;
  isOnline: boolean;
  pendingCount: number;
  syncing: boolean;
  theme: AppTheme;
  deviceId: string;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  setAuth: (token: string, role: 'COLLECTOR' | 'RECYCLER' | 'ADMIN', user?: any) => Promise<void>;
  logout: () => Promise<void>;
  setOnline: (status: boolean) => void;
  setPendingCount: (count: number) => void;
  setSyncing: (syncing: boolean) => void;
  setTheme: (theme: AppTheme) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  language: 'HI',
  token: null,
  role: null,
  collector: null,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pendingCount: 0,
  syncing: false,
  theme: 'field',
  deviceId: '',
  isInitialized: false,

  initialize: async () => {
    try {
      const [langItem, tokenItem, roleItem, collectorItem, deviceItem] = await Promise.all([
        db.meta.get('language'),
        db.meta.get('token'),
        db.meta.get('role'),
        db.meta.get('collector'),
        db.meta.get('deviceId'),
      ]);

      let deviceId = deviceItem?.value;
      if (!deviceId) {
        deviceId = crypto.randomUUID();
        await db.meta.put({ key: 'deviceId', value: deviceId });
      }

      const pendingCount = await db.outbox.count();

      const lang: LanguageCode = langItem?.value || 'HI';
      const role = roleItem?.value || null;
      const theme: AppTheme = role === 'RECYCLER' || role === 'ADMIN' ? 'control' : 'field';

      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.setAttribute('lang', lang.toLowerCase());

      set({
        language: lang,
        token: tokenItem?.value || null,
        role,
        collector: collectorItem?.value || null,
        deviceId,
        pendingCount,
        theme,
        isInitialized: true,
      });
    } catch (err) {
      console.error('Failed to initialize app store from Dexie:', err);
      set({ isInitialized: true });
    }
  },

  setLanguage: async (lang: LanguageCode) => {
    await db.meta.put({ key: 'language', value: lang });
    document.documentElement.setAttribute('lang', lang.toLowerCase());
    set({ language: lang });
  },

  setAuth: async (token: string, role: 'COLLECTOR' | 'RECYCLER' | 'ADMIN', user?: any) => {
    await Promise.all([
      db.meta.put({ key: 'token', value: token }),
      db.meta.put({ key: 'role', value: role }),
      user ? db.meta.put({ key: 'collector', value: user }) : Promise.resolve(),
    ]);

    const theme: AppTheme = role === 'RECYCLER' || role === 'ADMIN' ? 'control' : 'field';
    document.documentElement.setAttribute('data-theme', theme);

    set({
      token,
      role,
      collector: user || null,
      theme,
    });
  },

  logout: async () => {
    await Promise.all([
      db.meta.delete('token'),
      db.meta.delete('role'),
      db.meta.delete('collector'),
    ]);

    document.documentElement.setAttribute('data-theme', 'field');
    set({
      token: null,
      role: null,
      collector: null,
      theme: 'field',
    });
  },

  setOnline: (isOnline: boolean) => set({ isOnline }),
  setPendingCount: (pendingCount: number) => set({ pendingCount }),
  setSyncing: (syncing: boolean) => set({ syncing }),
  setTheme: (theme: AppTheme) => {
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
}));
