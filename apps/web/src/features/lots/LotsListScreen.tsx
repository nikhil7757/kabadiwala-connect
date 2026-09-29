import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Package, Plus, ChevronRight, Clock, Scale } from 'lucide-react';
import { TopBar } from '../../components/common/TopBar.js';
import { StatusChip } from '../../components/common/StatusChip.js';
import { db, LotItem } from '../../db/index.js';

export const LotsListScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [lots, setLots] = useState<LotItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'CONFIRMED' | 'PAID'>('ALL');

  useEffect(() => {
    const loadLots = async () => {
      const items = await db.lots.orderBy('updatedAt').reverse().toArray();
      setLots(items);
    };

    loadLots();
  }, []);

  const filteredLots = lots.filter((lot) => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') {
      return ['LOCAL_DRAFT', 'DRAFT', 'LISTED', 'QUOTED', 'ACCEPTED', 'HANDED_OVER'].includes(
        lot.status
      );
    }
    if (filter === 'CONFIRMED') return lot.status === 'CONFIRMED';
    if (filter === 'PAID') return lot.status === 'PAID';
    return true;
  });

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-12">
      <TopBar
        title={t('home_my_lots')}
        rightElement={
          <button
            type="button"
            onClick={() => navigate('/lot/new/photo')}
            className="w-10 h-10 rounded-full bg-kc-accent text-kc-accent-ink flex items-center justify-center font-bold shadow-[1px_1px_0px_#141414] active:scale-95"
            aria-label="New lot"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        }
      />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(['ALL', 'ACTIVE', 'CONFIRMED', 'PAID'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all whitespace-nowrap active:scale-95 ${
                filter === f
                  ? 'bg-kc-ink text-kc-bg shadow-[1px_1px_0px_#FF5400]'
                  : 'bg-kc-surface border border-kc-border text-kc-ink-dim'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Lots List */}
        {filteredLots.length === 0 ? (
          <div className="p-8 text-center rounded-xs border-2 border-dashed border-kc-border bg-kc-surface mt-4">
            <Package className="w-12 h-12 text-kc-ink-dim mx-auto mb-3" />
            <p className="text-base font-bold text-kc-ink mb-1">No lots found</p>
            <p className="text-xs text-kc-ink-dim mb-4">
              Tap the button below to photograph and list your first scrap lot.
            </p>
            <button
              type="button"
              onClick={() => navigate('/lot/new/photo')}
              className="px-4 py-2 bg-kc-accent text-kc-accent-ink font-bold text-sm uppercase rounded-xs border border-kc-border-strong shadow-[2px_2px_0px_#141414]"
            >
              Create New Lot
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredLots.map((lot) => (
              <div
                key={lot.clientId}
                onClick={() => navigate(`/lot/${lot.clientId}`)}
                role="button"
                tabIndex={0}
                className="p-4 rounded-xs border-2 border-kc-border-strong bg-kc-surface flex items-center justify-between shadow-[2px_2px_0px_#141414] cursor-pointer active:translate-y-0.5 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xs bg-kc-surface-2 border border-kc-border flex items-center justify-center text-kc-ink shrink-0">
                    <Package className="w-6 h-6 text-kc-accent" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-xs text-kc-ink tracking-tight">
                        {lot.refCode || 'DRAFT'}
                      </span>
                      <StatusChip status={lot.status} />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-kc-ink-dim font-mono">
                      <span className="flex items-center gap-1 font-bold text-kc-ink">
                        <Scale className="w-3.5 h-3.5 text-kc-accent" />
                        {lot.approxWeightKg} kg
                      </span>
                      <span>•</span>
                      <span className="font-bold text-kc-ink">
                        ₹{lot.finalPrice || lot.quotedPrice || lot.estimatedValue}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-kc-ink-dim shrink-0" />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
