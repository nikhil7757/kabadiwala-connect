import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TopBar } from '../../components/common/TopBar.js';
import { NumberPad } from '../../components/common/NumberPad.js';
import { StickyActionBar } from '../../components/common/StickyActionBar.js';
import { SpeakerButton } from '../../components/common/SpeakerButton.js';
import { useAppStore } from '../../store/useAppStore.js';
import { syncClient } from '../../lib/sync.js';

export const OtpScreen: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, setAuth } = useAppStore();

  const phone = location.state?.phone || '9000000001';

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          otp,
          preferredLanguage: language,
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error?.message || 'Invalid or expired code');
      }

      await setAuth(body.data.token, 'COLLECTOR', body.data.collector);

      // Trigger initial background sync
      syncClient.triggerSync().catch(console.error);

      navigate('/home', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Verification error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-28">
      <TopBar title="Verify Code" />

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-extrabold text-kc-ink">
              {t('enter_code')}
            </h1>
            <SpeakerButton
              audioKey="enter_code"
              fallbackText="Enter the 6-digit code sent to your phone"
            />
          </div>

          <p className="text-sm text-kc-ink-dim mb-4">
            Code sent to <span className="font-mono font-bold text-kc-ink">{phone}</span>
          </p>

          {/* 6 OTP Digits Display */}
          <div className="flex items-center justify-between gap-2 mb-4">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const digit = otp[idx] || '';
              return (
                <div
                  key={idx}
                  className={`w-12 h-16 rounded-xs border-3 bg-kc-surface flex items-center justify-center font-mono font-extrabold text-3xl shadow-[2px_2px_0px_#141414] ${
                    digit
                      ? 'border-kc-accent text-kc-ink'
                      : 'border-kc-border-strong text-kc-ink-dim/30'
                  }`}
                >
                  {digit || '•'}
                </div>
              );
            })}
          </div>

          {/* Demo Hint */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setOtp('123456')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-kc-warn-soft text-kc-warn border border-kc-warn/40 text-xs font-mono font-bold active:scale-95"
            >
              <span>DEMO OTP: 123456 (Tap to fill)</span>
            </button>
          </div>

          {error && (
            <p className="text-sm font-bold text-kc-danger mb-4">{error}</p>
          )}
        </div>

        {/* NumberPad */}
        <div className="mb-4">
          <NumberPad value={otp} onChange={setOtp} maxDecimals={0} maxDigits={6} />
        </div>
      </main>

      <StickyActionBar
        primaryLabel={t('accept_quote')}
        primaryOnClick={handleVerify}
        primaryDisabled={otp.length !== 6}
        primaryLoading={loading}
      />
    </div>
  );
};
