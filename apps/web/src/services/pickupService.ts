import { getItem, setItem } from './store';
import { pickups as seedPickups } from '../data/seed';

export const pickupService = {
  getAll: () => getItem('pickups', seedPickups),

  getByUser: (userId: string) => {
    const all = getItem('pickups', seedPickups);
    return all.filter((p: any) => p.userId === userId || p.userPhone === userId);
  },

  getByCollector: (collectorId: string) => {
    const all = getItem('pickups', seedPickups);
    return all.filter((p: any) => p.collectorId === collectorId);
  },

  create: (pickup: any) => {
    const all = getItem('pickups', seedPickups);
    const newPickup = {
      id: 'p_' + Date.now().toString().slice(-4),
      status: 'REQUESTED',
      date: new Date().toISOString(),
      ...pickup,
    };
    setItem('pickups', [newPickup, ...all]);
    return newPickup;
  },

  accept: (id: string, collectorId: string) => {
    const all = getItem('pickups', seedPickups);
    const updated = all.map((p: any) =>
      p.id === id ? { ...p, status: 'ACCEPTED', collectorId } : p
    );
    setItem('pickups', updated);
  },

  updateStatus: (id: string, status: string) => {
    const all = getItem('pickups', seedPickups);
    const updated = all.map((p: any) => (p.id === id ? { ...p, status } : p));
    setItem('pickups', updated);
  },

  completeWeighing: (
    id: string,
    actualWeight: number,
    actualPayout: number,
    batchId: string
  ) => {
    const all = getItem('pickups', seedPickups);
    const updated = all.map((p: any) =>
      p.id === id
        ? {
            ...p,
            status: 'PAID',
            actualWeight,
            actualPayout,
            batchId,
            paidAt: new Date().toISOString(),
          }
        : p
    );
    setItem('pickups', updated);

    // Also register in batches
    const existingBatches = getItem('recycler_batches', []);
    const newBatch = {
      id: batchId,
      pickupId: id,
      material: 'Aggregated Metals & E-Waste',
      weightKg: actualWeight,
      purityPercent: 96.5,
      collectorId: 'c1',
      recyclerDestination: 'Green Earth Metals',
      timestamp: new Date().toISOString(),
      status: 'DISPATCHED_TO_MILL',
    };
    setItem('recycler_batches', [newBatch, ...existingBatches]);
  },
};

export const batchService = {
  getAll: () =>
    getItem('recycler_batches', [
      {
        id: 'BATCH-2026-8491',
        pickupId: 'p12',
        material: 'Copper Wire & Motor Coils',
        weightKg: 42.5,
        purityPercent: 98.2,
        collectorId: 'c1',
        recyclerDestination: 'Green Earth Metals',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'DISPATCHED_TO_MILL',
      },
      {
        id: 'BATCH-2026-7214',
        pickupId: 'p24',
        material: 'High-Density Polyethylene (HDPE)',
        weightKg: 85.0,
        purityPercent: 94.0,
        collectorId: 'c2',
        recyclerDestination: 'EcoPlast Solutions',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'VERIFIED_IN_RECOVERY',
      },
      {
        id: 'BATCH-2026-5102',
        pickupId: 'p38',
        material: 'Circuit Boards & IT Assets',
        weightKg: 28.0,
        purityPercent: 99.1,
        collectorId: 'c4',
        recyclerDestination: 'TechCycle E-waste',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        status: 'PROCESSED_CIRCULAR',
      },
    ]),
};