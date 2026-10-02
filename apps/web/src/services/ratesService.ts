import { getItem } from './store';
import { scrapItems } from '../data/seed';

export const ratesService = {
  getAll: () => getItem('rates', scrapItems),

  getTrends: (itemId = '6') => {
    // Generate 7-day realistic price trend
    const base = getItem('rates', scrapItems).find((r: any) => r.id === itemId) || scrapItems[5];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
    const rate = base.rate;

    return days.map((day, i) => {
      const variance = (i - 3) * (rate * 0.02) + (Math.sin(i) * (rate * 0.015));
      return {
        day,
        rate: Math.round(rate + variance),
        marketAvg: Math.round(rate + variance * 0.8),
      };
    });
  },
};