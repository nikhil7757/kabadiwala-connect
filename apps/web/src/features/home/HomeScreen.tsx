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
  ChevronRight
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
    <div className="min-h-screen text-kc-ink flex flex-col pb-12 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-[10%] left-[-20%] w-72 h-72 bg-kc-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-20%] w-64 h-64 bg-kc-info/15 rounded-full blur-[100px] pointer-events-none" />

      <TopBar
        title="कबाड़ीवाला कनेक्ट"
        showBack={false}
        rightElement={
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-kc-ink hover:bg-kc-surface transition-colors active:scale-95 touch-manipulation"
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
        <div className="bg-gradient-to-r from-kc-accent-soft to-transparent border-b border-kc-accent/30 px-4 py-2 flex items-center justify-between text-xs font-bold text-kc-accent">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>{t('offline_banner')}</span>
          </div>
          <span className="font-mono text-[10px] bg-kc-surface/50 px-1.5 py-0.5 rounded border border-kc-accent/20">
            OFFLINE
          </span>
        </div>
      )}

      {/* Sync Status Banner */}
      {pendingCount > 0 && (
        <div
          onClick={() => navigate('/sync')}
          className="mx-4 mt-3 p-3 rounded-xl kc-glass border-kc-warn/30 text-xs font-bold text-kc-warn flex items-center justify-between cursor-pointer active:scale-95 hover:border-kc-warn/50 transition-all"
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
            className="px-3 py-1.5 bg-kc-warn/10 hover:bg-kc-warn/20 border border-kc-warn/40 rounded-lg text-[11px] uppercase font-bold transition-colors"
          >
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      )}

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-6 flex flex-col gap-5 relative z-10">
        {/* 2x2 BigTile Grid */}
        <div className="grid grid-cols-2 gap-4">
          <BigTile
            label={t('home_new_lot')}
            icon={<PlusCircle className="w-8 h-8 stroke-[2.5]" />}
            onClick={() => navigate('/lot/new/photo')}
            audioKey="welcome_greeting"
            highlightPulse={true}
          />

          <BigTile
            label={t('home_prices')}
            icon={<TrendingUp className="w-8 h-8 stroke-[2.5]" />}
            onClick={() => navigate('/prices')}
            audioKey="price_board_intro"
          />

          <BigTile
            label={t('home_my_lots')}
            icon={<Package className="w-8 h-8 stroke-[2.5]" />}
            onClick={() => navigate('/lots')}
            audioKey="home_my_lots"
            badge={lotCount > 0 ? lotCount : undefined}
          />

          <BigTile
            label={t('home_earnings')}
            icon={<IndianRupee className="w-8 h-8 stroke-[2.5]" />}
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
          className="w-full mt-2 min-h-[90px] rounded-2xl kc-glass p-5 flex items-center justify-between cursor-pointer group hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,107,94,0.15)] hover:border-kc-danger/40 transition-all active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-danger/50"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-kc-danger/10 border border-kc-danger/20 flex items-center justify-center text-kc-danger group-hover:bg-kc-danger/20 transition-colors">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-kc-ink leading-tight mb-1">
                {t('home_safety')}
              </h2>
              <p className="text-sm text-kc-ink-dim font-medium">
                6 safety rules for battery, cables & CRT
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-kc-surface flex items-center justify-center group-hover:bg-kc-danger/10 transition-colors border border-kc-border">
            <ChevronRight className="w-5 h-5 text-kc-ink-dim group-hover:text-kc-danger" />
          </div>
        </div>
      </main>
    </div>
  );
};
