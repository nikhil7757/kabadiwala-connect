import { getItem, setItem } from './store';
import { pickups as seedPickups } from '../data/seed';

export const pickupService = {
  getAll: () => getItem('pickups', seedPickups),
  getByUser: (userId: string) => getItem('pickups', seedPickups).filter((p: any) => p.userId === userId),
  create: (pickup: any) => {
    const all = getItem('pickups', seedPickups);
    const newPickup = { id: 'p_' + Date.now(), ...pickup, status: 'REQUESTED' };
    setItem('pickups', [newPickup, ...all]);
    return newPickup;
  },
  accept: (id: string, collectorId: string) => {
    const all = getItem('pickups', seedPickups);
    const updated = all.map((p: any) => p.id === id ? { ...p, status: 'ACCEPTED', collectorId } : p);
    setItem('pickups', updated);
  }
};