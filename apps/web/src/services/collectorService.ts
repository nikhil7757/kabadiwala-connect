import { getItem } from './store';
import { collectors as seedCollectors } from '../data/seed';

export const collectorService = {
  getAll: () => getItem('collectors', seedCollectors),
};