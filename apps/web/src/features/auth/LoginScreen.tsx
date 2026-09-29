import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TopBar } from '../../components/common/TopBar.js';
import { NumberPad } from '../../components/common/NumberPad.js';
import { StickyActionBar } from '../../components/common/StickyActionBar.js';
import { SpeakerButton } from '../../components/common/SpeakerButton.js';
import { Phone, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.js';

export const LoginScreen: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isOnline = useAppStore((s) => s.isOnline);

  const handleSendCode = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!isOnline) {
      setError('Internet connection required for first-time login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        console.warn('Backend warning:', body?.error?.message);
      }
    } catch (err: any) {
      console.warn('Network offline or backend unreachable, proceeding in demo mode:', err);
    } finally {
      setLoading(false);
      navigate('/otp', { state: { phone } });
    }
  };

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-28">
      <TopBar title="Kabadiwala Connect" showBack={false} />

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-extrabold text-kc-ink">
              {t('login_title')}
            </h1>
            <SpeakerButton
              audioKey="enter_phone"
              fallbackText="Enter your 10 digit mobile number to sign in"
            />
          </div>

          <p className="text-sm text-kc-ink-dim mb-6">
            We only use your mobile number to sign you in. No personal details needed.
          </p>

          {/* Number Display Box */}
          <div className="relative mb-6">
            <div className="h-18 rounded-xs border-3 border-kc-border-strong bg-kc-surface flex items-center px-4 shadow-[4px_4px_0px_#141414]">
              <Phone className="w-6 h-6 text-kc-accent mr-3" />
              <span className="text-2xl font-mono font-bold tracking-widest text-kc-ink">
                {phone ? (
                  `${phone.slice(0, 5)} ${phone.slice(5)}`
                ) : (
                  <span className="text-kc-ink-dim/40 font-mono">00000 00000</span>
                )}
              </span>
            </div>

            {error && (
              <p className="text-sm font-bold text-kc-danger mt-2">{error}</p>
            )}
          </div>

          {/* Sample Demo Account Hint */}
          <div className="p-3 rounded-xs bg-kc-surface-2 border border-kc-border mb-6 flex items-start gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-kc-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-kc-ink">Demo Accounts (SAMPLE DATA):</span>
              <p className="text-kc-ink-dim mt-0.5">
                Collector 1 (Hindi): <button type="button" onClick={() => setPhone('9000000001')} className="underline font-mono font-bold text-kc-accent">9000000001</button> • 
                Collector 2 (Marathi): <button type="button" onClick={() => setPhone('9000000002')} className="underline font-mono font-bold text-kc-accent">9000000002</button>
              </p>
            </div>
          </div>
        </div>

        {/* NumberPad */}
        <div className="mb-4">
          <NumberPad value={phone} onChange={setPhone} maxDecimals={0} maxDigits={10} />
        </div>
      </main>

      <StickyActionBar
        primaryLabel={t('send_code')}
        primaryOnClick={handleSendCode}
        primaryDisabled={phone.length !== 10}
        primaryLoading={loading}
      />
    </div>
  );
};
