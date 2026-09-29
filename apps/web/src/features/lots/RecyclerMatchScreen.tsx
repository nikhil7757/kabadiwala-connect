import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  matchRecyclers,
  MatchedRecycler,
  RecyclerCandidate,
} from '@kabadiwala/shared';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  MapPin,
  Check,
  RefreshCw,
} from 'lucide-react';
import { TopBar } from '../../components/common/TopBar.js';
import { NotchCard } from '../../components/common/NotchCard.js';
import { db, LotItem } from '../../db/index.js';
import { syncClient } from '../../lib/sync.js';

export const RecyclerMatchScreen: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [lot, setLot] = useState<LotItem | null>(null);
  const [matches, setMatches] = useState<MatchedRecycler[]>([]);
  const [pickupSelections, setPickupSelections] = useState<Record<string, boolean>>({});
  const [selectingId, setSelectingId] = useState<string | null>(null);

  useEffect(() => {
    const loadAndMatch = async () => {
      if (!clientId) return;
      const foundLot = await db.lots.get(clientId);
      if (!foundLot) return;
      setLot(foundLot);

      const collectorLat = foundLot.lat || 18.5204;
      const collectorLng = foundLot.lng || 73.8567;

      // Seeded sample candidates for offline matching
      const candidates: RecyclerCandidate[] = [
        {
          id: 'r0100000-0000-0000-0000-000000000001',
          name: 'Sample Recycler Pune 1',
          lat: 18.5304,
          lng: 73.8467,
          serviceRadiusKm: 25,
          pickupAvailable: true,
          authorizationStatus: 'VERIFIED',
          offeredRate: 340,
          rateUpdatedAt: new Date(),
          lotsSelectedCount: 15,
          handoversConfirmedCount: 14,
        },
        {
          id: 'r0100000-0000-0000-0000-000000000002',
          name: 'Sample Recycler Pune 2',
          lat: 18.5004,
          lng: 73.8667,
          serviceRadiusKm: 30,
          pickupAvailable: false,
          authorizationStatus: 'VERIFIED',
          offeredRate: 330,
          rateUpdatedAt: new Date(),
          lotsSelectedCount: 8,
          handoversConfirmedCount: 7,
        },
        {
          id: 'r0100000-0000-0000-0000-000000000003',
          name: 'Sample Recycler Pune 3',
          lat: 18.5504,
          lng: 73.8167,
          serviceRadiusKm: 20,
          pickupAvailable: true,
          authorizationStatus: 'VERIFIED',
          offeredRate: 310,
          rateUpdatedAt: new Date(),
          lotsSelectedCount: 20,
          handoversConfirmedCount: 19,
        },
      ];

      const ranked = matchRecyclers(collectorLat, collectorLng, candidates, {
        lotWeightKg: foundLot.approxWeightKg,
      });

      setMatches(ranked);
    };

    loadAndMatch();
  }, [clientId]);

  const togglePickup = (recyclerId: string) => {
    setPickupSelections((prev) => ({
      ...prev,
      [recyclerId]: !prev[recyclerId],
    }));
  };

  const handleSelectRecycler = async (match: MatchedRecycler) => {
    if (!clientId || !lot) return;
    setSelectingId(match.recycler.id);

    try {
      const pickupRequested = Boolean(pickupSelections[match.recycler.id]);

      // 1. Update local lot in Dexie
      await db.lots.update(clientId, {
        status: 'LISTED',
        selectedRecyclerId: match.recycler.id,
        pickupRequested,
        updatedAt: new Date(),
      });

      // 2. Queue SELECT_RECYCLER action in outbox
      await syncClient.queueAction('SELECT_RECYCLER', {
        lotClientId: clientId,
        recyclerId: match.recycler.id,
        pickupRequested,
      });

      navigate(`/lot/${clientId}`, { replace: true });
    } catch (err) {
      console.error('Failed to select recycler:', err);
    } finally {
      setSelectingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-12">
      <TopBar title={t('find_buyer')} />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-kc-ink mb-1">
            Nearby Authorized Buyers
          </h2>
          <p className="text-xs text-kc-ink-dim font-medium">
            Ranked by price, distance, reliability, and pickup availability.
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="p-8 text-center rounded-xs border border-kc-border bg-kc-surface">
            <p className="text-base font-bold text-kc-ink mb-2">
              {t('no_buyer_near')}
            </p>
            <p className="text-xs text-kc-ink-dim">
              Your lot is saved offline. You can find a buyer anytime from My Lots.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {matches.map((m, idx) => {
              const isTop = idx === 0;
              const hasPickup = m.recycler.pickupAvailable;
              const pickupActive = Boolean(pickupSelections[m.recycler.id]);

              return (
                <NotchCard
                  key={m.recycler.id}
                  highlight={isTop}
                  className="shadow-[3px_3px_0px_#141414]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-mono font-bold text-kc-accent-text">
                          MATCH SCORE: {m.score}%
                        </span>
                        {isTop && (
                          <span className="px-2 py-0.5 rounded-full bg-kc-accent text-kc-accent-ink font-mono font-bold text-[10px]">
                            TOP MATCH
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-kc-ink leading-tight">
                        {m.recycler.name}
                      </h3>
                      <p className="text-xs text-kc-ink-dim flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-kc-accent" />
                        <span>{m.distanceKm} km away</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-kc-ink-dim">OFFERED RATE</span>
                      <p className="text-2xl font-black font-mono text-kc-accent">
                        ₹{m.offeredRate}<span className="text-xs text-kc-ink">/kg</span>
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {m.badges.map((b) => (
                      <span
                        key={b}
                        className="px-2 py-0.5 rounded-full bg-kc-surface-2 border border-kc-border text-kc-ink font-mono text-[10px] font-bold"
                      >
                        {b === 'BEST_RATE' && '★ '}
                        {t(b.toLowerCase())}
                      </span>
                    ))}
                  </div>

                  {/* Total Value & Pickup Option */}
                  <div className="pt-2 border-t border-kc-border flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-kc-ink-dim">ESTIMATED VALUE</span>
                      <p className="text-lg font-bold font-mono text-kc-ink">
                        ₹{m.estimatedLotValue}
                      </p>
                    </div>

                    {hasPickup && (
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-kc-ink">
                        <input
                          type="checkbox"
                          checked={pickupActive}
                          onChange={() => togglePickup(m.recycler.id)}
                          className="w-4 h-4 rounded text-kc-accent accent-kc-accent focus:ring-0"
                        />
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-kc-accent" />
                          <span>Request Pickup</span>
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Choose Buyer Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectRecycler(m)}
                    disabled={selectingId !== null}
                    className="w-full h-12 rounded-xs bg-kc-surface border-2 border-kc-border-strong text-kc-ink font-bold text-sm uppercase tracking-wider shadow-[2px_2px_0px_#141414] active:translate-y-0.5 active:shadow-none hover:bg-kc-accent hover:text-kc-accent-ink hover:border-kc-accent transition-colors flex items-center justify-center gap-2"
                  >
                    {selectingId === m.recycler.id ? (
                      <span className="w-4 h-4 border-2 border-kc-ink border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>{t('choose')}</span>
                      </>
                    )}
                  </button>
                </NotchCard>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
