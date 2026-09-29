import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { TopBar } from '../../components/common/TopBar.js';
import { NotchCard } from '../../components/common/NotchCard.js';
import { StickyActionBar } from '../../components/common/StickyActionBar.js';
import { SpeakerButton } from '../../components/common/SpeakerButton.js';
import { db, LotItem } from '../../db/index.js';
import { syncClient } from '../../lib/sync.js';
import { useAppStore } from '../../store/useAppStore.js';

export const HandoverScreen: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isOnline = useAppStore((s) => s.isOnline);

  const [lot, setLot] = useState<LotItem | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadLot = async () => {
    if (!clientId) return;
    const found = await db.lots.get(clientId);
    if (!found) return;
    setLot(found);

    // If handover info exists, generate QR code
    if (found.handover?.qrPayload) {
      try {
        const url = await QRCode.toDataURL(found.handover.qrPayload, {
          margin: 1,
          width: 260,
          color: {
            dark: '#141414',
            light: '#FFFFFF',
          },
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Failed to render QR:', err);
      }
    }
  };

  useEffect(() => {
    loadLot();
  }, [clientId]);

  const handleStartHandover = async () => {
    if (!lot) return;
    setLoading(true);

    try {
      // If lot doesn't have handover, generate client reference and queue initiate
      const last8 = lot.clientId.slice(-8).toUpperCase();
      const handoverRef = `HO-${last8}-DEMO`;
      const otp = '123456';
      const qrPayload = btoa(
        JSON.stringify({
          v: 1,
          t: 'KC-HO',
          ref: handoverRef,
          lot: lot.clientId,
          w: lot.approxWeightKg,
        })
      );

      const handoverData = {
        handoverRef,
        otp,
        qrPayload,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      await db.lots.update(lot.clientId, {
        status: 'HANDED_OVER',
        handover: handoverData,
        updatedAt: new Date(),
      });

      await syncClient.queueAction('HANDOVER_INITIATE', {
        lotClientId: lot.clientId,
        weightKg: lot.approxWeightKg,
        handoverAt: new Date().toISOString(),
      });

      await loadLot();
    } catch (err) {
      console.error('Handover initiation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!lot) return null;

  const isConfirmed = lot.status === 'CONFIRMED' || lot.status === 'PAID';
  const hasHandover = Boolean(lot.handover);

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-28">
      <TopBar title={t('start_handover')} />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 flex flex-col items-center">
        {/* Confirmed Success Screen */}
        {isConfirmed ? (
          <div className="w-full flex flex-col items-center text-center p-6 bg-kc-surface rounded-xs border-3 border-kc-success shadow-[4px_4px_0px_#141414] animate-in fade-in">
            <div className="w-20 h-20 rounded-full bg-kc-success-soft text-kc-success flex items-center justify-center mb-4">
              <CheckCircle2 className="w-14 h-14 stroke-[2.5]" />
            </div>

            <h2 className="text-2xl font-black text-kc-ink mb-1">
              {t('handover_done')}
            </h2>
            <p className="text-sm text-kc-ink-dim mb-4">
              The buyer has verified your lot weight and finalized the transaction.
            </p>

            <div className="w-full p-4 rounded-xs bg-kc-surface-2 border border-kc-border flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-kc-ink-dim">FINAL AMOUNT:</span>
                <span className="font-bold text-kc-accent text-base">₹{lot.finalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-kc-ink-dim">VERIFIED WEIGHT:</span>
                <span className="font-bold text-kc-ink">{lot.approxWeightKg} kg</span>
              </div>
            </div>
          </div>
        ) : !hasHandover ? (
          /* Handover Confirmation Before Initiating */
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-kc-ink">Verify Handover</h2>
                <p className="text-xs text-kc-ink-dim">
                  Make sure you are at the buyer facility before starting handover.
                </p>
              </div>
              <SpeakerButton
                audioKey="start_handover"
                fallbackText="Confirm your weight and tap start handover to get the verification QR code and six digit number"
              />
            </div>

            <NotchCard className="shadow-[3px_3px_0px_#141414]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-kc-ink-dim">DECLARED WEIGHT</span>
                <span className="text-2xl font-black font-mono text-kc-ink">{lot.approxWeightKg} kg</span>
              </div>

              <div className="pt-3 border-t border-kc-border flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-kc-ink-dim">EXPECTED PAYMENT</span>
                <span className="text-2xl font-black font-mono text-kc-accent">
                  ₹{lot.quotedPrice || lot.estimatedValue}
                </span>
              </div>
            </NotchCard>
          </div>
        ) : (
          /* QR & 6-Digit Code Display */
          <div className="w-full flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-extrabold text-kc-ink">
                {t('show_code')}
              </h2>
              <SpeakerButton
                audioKey="show_code_to_buyer"
                fallbackText="Show this QR code or read the six digit number to the buyer scale operator"
              />
            </div>

            <p className="text-xs text-kc-ink-dim mb-4">
              Let the buyer scan the QR code or type the 6-digit code below.
            </p>

            {/* QR Panel with NotchCard Frame */}
            <NotchCard className="bg-white p-4 shadow-[4px_4px_0px_#141414] mb-4">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Handover verification QR code"
                  className="w-56 h-56 mx-auto"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center bg-gray-100 font-mono text-xs">
                  Generating QR Code...
                </div>
              )}
            </NotchCard>

            {/* Large 6-Digit Number */}
            <div className="w-full max-w-xs p-3 rounded-xs border-2 border-kc-border-strong bg-kc-surface shadow-[2px_2px_0px_#141414] mb-3">
              <span className="text-[10px] font-mono font-bold text-kc-ink-dim uppercase block mb-1">
                6-DIGIT VERIFICATION NUMBER
              </span>
              <span className="text-4xl font-mono font-black tracking-widest text-kc-accent">
                {lot.handover?.otp || '123456'}
              </span>
            </div>

            <span className="text-xs font-mono font-bold text-kc-ink-dim">
              REFERENCE: {lot.handover?.handoverRef}
            </span>
          </div>
        )}
      </main>

      {!hasHandover && !isConfirmed && (
        <StickyActionBar
          primaryLabel={t('start_handover')}
          primaryOnClick={handleStartHandover}
          primaryLoading={loading}
        />
      )}

      {isConfirmed && (
        <StickyActionBar
          primaryLabel="Back to My Lots"
          primaryOnClick={() => navigate('/lots')}
        />
      )}
    </div>
  );
};
