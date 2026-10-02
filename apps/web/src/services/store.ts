import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { pickups, scrapItems as rates, collectors } from '../data/seed';

export const useStore = create(
  persist(
    (set) => ({
      pickups: pickups || [],
      rates: rates || [],
      collectors: collectors || [],
      user: null,
      theme: 'dark',
      lang: 'en',
      addPickup: (pickup: any) => set((state: any) => ({ pickups: [...state.pickups, pickup] })),
      updatePickup: (id: string, updates: any) => set((state: any) => ({
        pickups: state.pickups.map((p: any) => p.id === id ? { ...p, ...updates } : p)
      })),
      setUser: (user: any) => set({ user }),
      setTheme: (theme: string) => set({ theme }),
      setLang: (lang: string) => set({ lang })
    }),
    { name: 'kabadiwala-storage' }
  )
);

export const getItem = (key: string, defaultValue: any = null) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

export const setItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};