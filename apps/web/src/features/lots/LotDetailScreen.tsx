import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Scale,
  DollarSign,
  Package,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';
import { TopBar } from '../../components/common/TopBar.js';
import { StatusChip } from '../../components/common/StatusChip.js';
import { NotchCard } from '../../components/common/NotchCard.js';
import { StickyActionBar } from '../../components/common/StickyActionBar.js';
import { db, LotItem, PhotoItem } from '../../db/index.js';
import { syncClient } from '../../lib/sync.js';

export const LotDetailScreen: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [lot, setLot] = useState<LotItem | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!clientId) return;
    const found = await db.lots.get(clientId);
    if (!found) return;
    setLot(found);

    const photoList = await db.photos.where('lotClientId').equals(clientId).toArray();
    setPhotos(photoList);
  };

  useEffect(() => {
    loadData();
  }, [clientId]);

  if (!lot) {
    return (
      <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col items-center justify-center p-4">
        <p className="font-bold text-lg mb-2">Lot not found</p>
        <button
          type="button"
          onClick={() => navigate('/lots')}
          className="px-4 py-2 bg-kc-accent text-kc-accent-ink font-bold uppercase rounded-xs"
        >
          Back to My Lots
        </button>
      </div>
    );
  }

  // Handle Accept Quote
  const handleAcceptQuote = async () => {
    setLoading(true);
    try {
      await db.lots.update(lot.clientId, {
        status: 'ACCEPTED',
        updatedAt: new Date(),
      });
      await syncClient.queueAction('ACCEPT_QUOTE', {
        lotClientId: lot.clientId,
      });
      await loadData();
    } catch (err) {
      console.error('Error accepting quote:', err);
    } finally {
      setLoading(false);
    }
  };

  // Timeline steps
  const timelineSteps = [
    { key: 'DRAFT', label: 'Lot Created' },
    { key: 'LISTED', label: 'Buyer Selected' },
    { key: 'QUOTED', label: 'Price Quoted' },
    { key: 'ACCEPTED', label: 'Quote Accepted' },
    { key: 'HANDED_OVER', label: 'Handover Started' },
    { key: 'CONFIRMED', label: 'Recycler Confirmed' },
    { key: 'PAID', label: 'Payment Completed' },
  ];

  const currentStepIdx = timelineSteps.findIndex((s) => s.key === lot.status);

  // Contextual primary action logic per APP_FLOW 5.5
  let primaryLabel = '';
  let primaryAction: () => void = () => {};
  let primaryDisabled = false;

  if (lot.status === 'DRAFT') {
    primaryLabel = t('find_buyer');
    primaryAction = () => navigate(`/lot/${lot.clientId}/match`);
  } else if (lot.status === 'LISTED') {
    primaryLabel = 'Waiting for Quote';
    primaryDisabled = true;
    primaryAction = () => {};
  } else if (lot.status === 'QUOTED') {
    primaryLabel = t('accept_quote');
    primaryAction = handleAcceptQuote;
  } else if (lot.status === 'ACCEPTED') {
    primaryLabel = t('start_handover');
    primaryAction = () => navigate(`/lot/${lot.clientId}/handover`);
  } else if (lot.status === 'HANDED_OVER') {
    primaryLabel = t('show_code');
    primaryAction = () => navigate(`/lot/${lot.clientId}/handover`);
  } else if (lot.status === 'CONFIRMED' || lot.status === 'PAID') {
    primaryLabel = 'View Certificate';
    primaryAction = () => alert(`Tamper-evident trace verified for lot ${lot.refCode}`);
  }

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-28">
      <TopBar title={lot.refCode || 'Lot Detail'} />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 flex flex-col gap-4">
        {/* Header NotchCard */}
        <NotchCard className="shadow-[3px_3px_0px_#141414]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs font-mono font-bold text-kc-ink-dim block mb-0.5">
                REFERENCE CODE
              </span>
              <h2 className="text-xl font-mono font-black text-kc-ink">
                {lot.refCode || 'LOCAL DRAFT'}
              </h2>
            </div>
            <StatusChip status={lot.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-kc-border">
            <div>
              <span className="text-[11px] font-mono font-bold text-kc-ink-dim">WEIGHT</span>
              <p className="text-xl font-mono font-bold text-kc-ink">{lot.approxWeightKg} kg</p>
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-kc-ink-dim">
                {lot.finalPrice ? 'FINAL AMOUNT' : lot.quotedPrice ? 'QUOTED PRICE' : 'ESTIMATE'}
              </span>
              <p className="text-2xl font-mono font-black text-kc-accent">
                ₹{lot.finalPrice || lot.quotedPrice || lot.estimatedValue}
              </p>
            </div>
          </div>
        </NotchCard>

        {/* Photos Strip */}
        {photos.length > 0 && (
          <div>
            <span className="text-xs font-mono font-bold text-kc-ink-dim uppercase block mb-1.5">
              CAPTURED PHOTOS ({photos.length})
            </span>
            <div className="grid grid-cols-4 gap-2">
              {photos.map((p, idx) => (
                <div key={p.id} className="aspect-square rounded-xs border-2 border-kc-border-strong overflow-hidden bg-kc-surface-2">
                  <img src={p.dataUrl} alt={`Scrap photo ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quote Received Card (if QUOTED) */}
        {lot.status === 'QUOTED' && (
          <div className="p-4 rounded-xs border-2 border-kc-accent bg-kc-accent-soft/40 shadow-[3px_3px_0px_#FF5400]">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-6 h-6 text-kc-accent" />
              <h3 className="text-lg font-bold text-kc-ink">Buyer Quote Received!</h3>
            </div>
            <p className="text-sm text-kc-ink mb-3">
              The buyer has reviewed your lot and offered a price of{' '}
              <span className="text-xl font-bold font-mono text-kc-accent">₹{lot.quotedPrice}</span>.
            </p>
          </div>
        )}

        {/* Vertical Timeline */}
        <div className="p-4 rounded-xs border-2 border-kc-border-strong bg-kc-surface">
          <span className="text-xs font-mono font-bold text-kc-ink-dim uppercase block mb-3">
            TRANSACTION LIFECYCLE
          </span>

          <div className="flex flex-col gap-3 relative pl-3 border-l-2 border-kc-border ml-2">
            {timelineSteps.map((step, idx) => {
              const isPast = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={step.key} className="flex items-center gap-2.5 relative">
                  <span
                    className={`absolute -left-[19px] w-3.5 h-3.5 rounded-full border-2 border-kc-surface ${
                      isPast
                        ? 'bg-kc-success'
                        : isCurrent
                        ? 'bg-kc-accent ring-2 ring-kc-accent'
                        : 'bg-kc-surface-2 border-kc-border'
                    }`}
                  />
                  <span
                    className={`text-xs font-mono ${
                      isPast ? 'font-bold text-kc-ink' : 'text-kc-ink-dim'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {primaryLabel && (
        <StickyActionBar
          primaryLabel={primaryLabel}
          primaryOnClick={primaryAction}
          primaryDisabled={primaryDisabled}
          primaryLoading={loading}
        />
      )}
    </div>
  );
};
