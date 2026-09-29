import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { calculateValuation } from '@kabadiwala/shared';
import { TopBar } from '../../components/common/TopBar.js';
import { NotchCard } from '../../components/common/NotchCard.js';
import { AmountDisplay } from '../../components/common/AmountDisplay.js';
import { StickyActionBar } from '../../components/common/StickyActionBar.js';
import { db, LotItem } from '../../db/index.js';
import { syncClient } from '../../lib/sync.js';
import { MapPin, Info } from 'lucide-react';

export const NewLotEstimateScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { photos, category, weightKg, condition } = location.state || {};

  const [ratePerKg, setRatePerKg] = useState(180);
  const [rateDate, setRateDate] = useState<string>('Today');
  const [estimatedValue, setEstimatedValue] = useState<string>('0.00');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // 1. Look up rate from cached Dexie prices or fall back to default
    const resolveRate = async () => {
      let rate = 180;
      if (category?.code === 'PCB') rate = 320;
      else if (category?.code === 'BATTERY') rate = 70;
      else if (category?.code === 'CRT') rate = 12;
      else if (category?.code === 'LCD') rate = 35;
      else if (category?.code === 'MOTOR') rate = 90;
      else if (category?.code === 'PLASTIC') rate = 15;
      else if (category?.code === 'OTHER') rate = 25;

      const cached = await db.prices.where('categoryCode').equals(category?.code || '').first();
      if (cached) {
        rate = parseFloat(cached.buyingPrice);
        setRateDate(new Date(cached.recordedAt).toLocaleDateString());
      }

      setRatePerKg(rate);
      const val = calculateValuation({ quantity: weightKg || 10, unitRate: rate });
      setEstimatedValue(val.estimatedValue);
    };

    resolveRate();
  }, [category, weightKg]);

  // Saves lot to Dexie and queues LOT_CREATE in outbox
  const saveLotToDatabase = async (): Promise<string> => {
    const clientId = crypto.randomUUID();

    // 1. Attempt GPS capture with timeout
    let lat: number | null = null;
    let lng: number | null = null;
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 3000,
          });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch (err) {
        // Fall back to Pune district center
        lat = 18.5204;
        lng = 73.8567;
      }
    }

    const now = new Date();

    const newLot: LotItem = {
      clientId,
      refCode: `KC-LOCAL-${clientId.slice(0, 8).toUpperCase()}`,
      categoryId: category?.id || 'c0100000-0000-0000-0000-000000000001',
      condition: condition || 'BROKEN',
      approxWeightKg: weightKg || 10,
      estimatedValue,
      lat,
      lng,
      collectedAt: now,
      status: 'DRAFT',
      updatedAt: now,
    };

    await db.lots.add(newLot);

    // Save photos
    if (photos && photos.length > 0) {
      for (const p of photos) {
        await db.photos.add({
          id: p.id,
          lotClientId: clientId,
          sha256: p.sha256,
          dataUrl: p.dataUrl,
          purpose: 'COLLECTION',
          takenAt: now,
        });
      }
    }

    // Queue LOT_CREATE action in outbox for sync
    await syncClient.queueAction('LOT_CREATE', {
      clientId,
      categoryId: newLot.categoryId,
      condition: newLot.condition,
      approxWeightKg: newLot.approxWeightKg,
      estimatedValue: newLot.estimatedValue,
      lat,
      lng,
      collectedAt: now.toISOString(),
    });

    return clientId;
  };

  const handleFindBuyer = async () => {
    setSaving(true);
    try {
      const clientId = await saveLotToDatabase();
      navigate(`/lot/${clientId}/match`);
    } catch (err) {
      console.error('Error saving lot:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveForLater = async () => {
    setSaving(true);
    try {
      await saveLotToDatabase();
      navigate('/lots');
    } catch (err) {
      console.error('Error saving lot:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-28">
      <TopBar title={t('estimate_caption')} />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 flex flex-col justify-between">
        <div>
          {/* Featured Estimate NotchCard */}
          <NotchCard className="mb-6 shadow-[4px_4px_0px_#141414]" highlight={true}>
            <AmountDisplay
              amount={estimatedValue}
              caption={t('estimate_caption')}
              isSample={true}
            />

            <div className="pt-3 mt-3 border-t border-kc-border flex items-center justify-between text-xs font-mono text-kc-ink-dim">
              <span>RATE: ₹{ratePerKg}/kg</span>
              <span>WEIGHT: {weightKg} kg</span>
            </div>
          </NotchCard>

          {/* Rate freshness info */}
          <div className="p-3 rounded-xs bg-kc-surface-2 border border-kc-border mb-4 flex items-center gap-2 text-xs text-kc-ink-dim">
            <Info className="w-4 h-4 text-kc-ink-dim shrink-0" />
            <span>
              Rates updated {rateDate} for {category?.nameEn || 'material'} in Maharashtra.
            </span>
          </div>

          {/* Summary Details */}
          <div className="p-4 rounded-xs border-2 border-kc-border-strong bg-kc-surface flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-kc-ink-dim">Material Category:</span>
              <span className="font-bold text-kc-ink">{category?.nameEn || 'Circuit Boards'}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-kc-ink-dim">Condition:</span>
              <span className="font-bold text-kc-ink uppercase">{condition}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-kc-ink-dim">Photos Captured:</span>
              <span className="font-bold text-kc-ink">{photos?.length || 1} photo(s)</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-kc-ink-dim">GPS Location:</span>
              <span className="font-bold text-kc-ink flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-kc-accent" />
                <span>Captured</span>
              </span>
            </div>
          </div>
        </div>
      </main>

      <StickyActionBar
        primaryLabel={t('find_buyer')}
        primaryOnClick={handleFindBuyer}
        primaryLoading={saving}
        secondaryLabel={t('save_later')}
        secondaryOnClick={handleSaveForLater}
      />
    </div>
  );
};
