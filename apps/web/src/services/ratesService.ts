import { getItem } from './store';
import { scrapItems } from '../data/seed';

export const ratesService = {
  getAll: () => getItem('rates', scrapItems)
};