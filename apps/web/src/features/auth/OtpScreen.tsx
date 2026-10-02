import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TopBar } from '../../components/common/TopBar.js';
import { NumberPad } from '../../components/common/NumberPad.js';
import { StickyActionBar } from '../../components/common/StickyActionBar.js';
import { SpeakerButton } from '../../components/common/SpeakerButton.js';
import { useAppStore } from '../../store/useAppStore.js';
import { syncClient } from '../../lib/sync.js';
import { Sparkles } from 'lucide-react';

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

    let token = `demo-token-${Date.now()}`;
    let collector = {
      id: crypto.randomUUID(),
      phone,
      preferredLanguage: language,
      state: 'MH',
      district: 'Pune',
      operatingArea: 'Shivajinagar',
      isSampleData: true,
    };

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

      const body = await res.json().catch(() => null);
      if (res.ok && body?.data?.token) {
        token = body.data.token;
        collector = body.data.collector;
      } else if (otp !== '123456') {
        throw new Error(body?.error?.message || 'Invalid code. In Demo Mode, use code 123456.');
      }
    } catch (err: any) {
      if (otp !== '123456') {
        setError(err.message || 'Verification error. Use demo code 123456.');
        setLoading(false);
        return;
      }
    }

    await setAuth(token, 'COLLECTOR', collector);

    // Trigger initial background sync
    syncClient.triggerSync().catch(() => {});

    navigate('/home', { replace: true });
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-kc-ink flex flex-col pb-28 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-20%] w-64 h-64 bg-kc-info/20 rounded-full blur-[80px] pointer-events-none" />
      
      <TopBar title="Verify Code" />

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-6 flex flex-col justify-between relative z-10">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-extrabold text-gradient tracking-tight">
              {t('enter_code')}
            </h1>
            <SpeakerButton
              audioKey="enter_code"
              fallbackText="Enter the 6-digit code sent to your phone"
            />
          </div>

          <p className="text-sm text-kc-ink-dim mb-8">
            Code sent to <span className="font-mono font-bold text-kc-ink tracking-widest">{phone}</span>
          </p>

          {/* 6 OTP Digits Display */}
          <div className="flex items-center justify-between gap-3 mb-8">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const digit = otp[idx] || '';
              return (
                <div
                  key={idx}
                  className={`flex-1 aspect-[3/4] rounded-xl kc-glass flex items-center justify-center font-mono font-extrabold text-3xl transition-all duration-300 ${
                    digit
                      ? 'border-kc-accent/50 text-kc-accent-text shadow-[0_4px_15px_rgba(0,212,170,0.2)] bg-kc-accent/5 scale-105'
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full kc-glass-strong text-kc-warn border-kc-warn/30 text-xs font-mono font-bold active:scale-95 hover:bg-kc-warn/10 transition-colors"
            >
              <Sparkles size={14} />
              <span>DEMO OTP: 123456 (Tap to fill)</span>
            </button>
          </div>

          {error && (
            <p className="text-sm font-bold text-kc-danger mb-4 animate-pulse">{error}</p>
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
