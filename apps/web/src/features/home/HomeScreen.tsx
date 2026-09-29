import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  PlusCircle,
  TrendingUp,
  Package,
  IndianRupee,
  ShieldAlert,
  Settings,
  RefreshCw,
  WifiOff,
} from 'lucide-react';
import { TopBar } from '../../components/common/TopBar.js';
import { BigTile } from '../../components/common/BigTile.js';
import { Ticker, TickerItem } from '../../components/common/Ticker.js';
import { useAppStore } from '../../store/useAppStore.js';
import { db } from '../../db/index.js';
import { syncClient } from '../../lib/sync.js';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isOnline, pendingCount, syncing } = useAppStore();

  const [lotCount, setLotCount] = useState<number>(0);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([
    { code: 'CABLE', name: 'Copper Cable', rate: '180', trend: 'UP' },
    { code: 'PCB', name: 'Circuit Board', rate: '320', trend: 'UP' },
    { code: 'BATTERY', name: 'Lead Battery', rate: '70', trend: 'FLAT' },
    { code: 'CRT', name: 'Old TV / CRT', rate: '12', trend: 'DOWN' },
    { code: 'MOTOR', name: 'Copper Motor', rate: '90', trend: 'FLAT' },
  ]);

  useEffect(() => {
    // Load lot counts and latest prices from Dexie
    const loadLocalData = async () => {
      try {
        const count = await db.lots.count();
        setLotCount(count);

        const prices = await db.prices.toArray();
        if (prices.length > 0) {
          const mapped: TickerItem[] = prices.slice(0, 6).map((p) => ({
            code: p.categoryCode || 'MAT',
            name: p.city,
            rate: p.buyingPrice,
            trend: 'UP',
          }));
          setTickerItems(mapped);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      }
    };

    loadLocalData();
  }, []);

  const handleManualSync = () => {
    syncClient.triggerSync().catch(console.error);
  };

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-12">
      <TopBar
        title="कबाड़ीवाला कनेक्ट"
        showBack={false}
        rightElement={
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-kc-ink active:scale-95 touch-manipulation"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        }
      />

      {/* Marquee Ticker */}
      <Ticker items={tickerItems} />

      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-kc-accent-soft border-b border-kc-accent px-4 py-2 flex items-center justify-between text-xs font-bold text-kc-accent-ink">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-kc-accent" />
            <span>{t('offline_banner')}</span>
          </div>
          <span className="font-mono text-[10px] bg-kc-surface px-1.5 py-0.5 rounded border border-kc-border-strong">
            OFFLINE
          </span>
        </div>
      )}

      {/* Sync Status Banner */}
      {pendingCount > 0 && (
        <div
          onClick={() => navigate('/sync')}
          className="mx-4 mt-3 p-2.5 rounded-xs bg-kc-warn-soft border border-kc-warn text-xs font-bold text-kc-warn flex items-center justify-between cursor-pointer active:scale-98"
        >
          <div className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>
              {pendingCount} action{pendingCount > 1 ? 's' : ''} waiting to sync
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleManualSync();
            }}
            disabled={syncing}
            className="px-2 py-1 bg-kc-surface border border-kc-warn rounded text-[11px] uppercase font-bold active:bg-kc-warn active:text-white"
          >
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      )}

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 flex flex-col gap-4">
        {/* 2x2 BigTile Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          <BigTile
            label={t('home_new_lot')}
            icon={<PlusCircle className="w-9 h-9 stroke-[2.5] text-kc-accent" />}
            onClick={() => navigate('/lot/new/photo')}
            audioKey="welcome_greeting"
            highlightPulse={true}
          />

          <BigTile
            label={t('home_prices')}
            icon={<TrendingUp className="w-9 h-9 stroke-[2.2] text-kc-success" />}
            onClick={() => navigate('/prices')}
            audioKey="price_board_intro"
          />

          <BigTile
            label={t('home_my_lots')}
            icon={<Package className="w-9 h-9 stroke-[2.2] text-kc-ink" />}
            onClick={() => navigate('/lots')}
            audioKey="home_my_lots"
            badge={lotCount > 0 ? lotCount : undefined}
          />

          <BigTile
            label={t('home_earnings')}
            icon={<IndianRupee className="w-9 h-9 stroke-[2.2] text-kc-accent" />}
            onClick={() => navigate('/earnings')}
            audioKey="earnings_intro"
          />
        </div>

        {/* Wide Safety Tile */}
        <div
          onClick={() => navigate('/safety')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/safety')}
          className="w-full min-h-[90px] rounded-xs border-2 border-kc-border-strong bg-kc-surface p-4 flex items-center justify-between cursor-pointer active:translate-y-0.5 shadow-[2px_2px_0px_#141414] touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xs bg-kc-danger-soft border border-kc-danger/30 flex items-center justify-center text-kc-danger">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-kc-ink leading-tight">
                {t('home_safety')}
              </h2>
              <p className="text-xs text-kc-ink-dim font-medium">
                6 safety rules for battery, cables & CRT
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-kc-surface-2 border border-kc-border text-kc-ink">
            VIEW
          </span>
        </div>
      </main>
    </div>
  );
};
