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
    <div className="min-h-screen text-kc-ink flex flex-col pb-28 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-[-10%] left-[-20%] w-64 h-64 bg-kc-accent/20 rounded-full blur-[80px] pointer-events-none" />

      <TopBar title="Kabadiwala Connect" showBack={false} />

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-6 flex flex-col justify-between relative z-10">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-extrabold text-gradient tracking-tight">
              {t('login_title')}
            </h1>
            <SpeakerButton
              audioKey="enter_phone"
              fallbackText="Enter your 10 digit mobile number to sign in"
            />
          </div>

          <p className="text-sm text-kc-ink-dim mb-8 leading-relaxed">
            We only use your mobile number to sign you in. No personal details needed.
          </p>

          {/* Number Display Box */}
          <div className="relative mb-8">
            <div className={`h-20 rounded-2xl kc-glass flex items-center px-6 transition-all duration-300 ${phone ? 'border-kc-accent/50 shadow-[0_8px_32px_rgba(0,212,170,0.2)]' : ''}`}>
              <div className={`p-2 rounded-full mr-4 transition-colors ${phone ? 'bg-kc-accent/20 text-kc-accent' : 'bg-kc-surface-2 text-kc-ink-dim'}`}>
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-3xl font-mono font-bold tracking-widest text-kc-ink">
                {phone ? (
                  `${phone.slice(0, 5)} ${phone.slice(5)}`
                ) : (
                  <span className="text-kc-ink-dim/40 font-mono">00000 00000</span>
                )}
              </span>
            </div>

            {error && (
              <p className="text-sm font-bold text-kc-danger mt-3 animate-pulse">{error}</p>
            )}
          </div>

          {/* Sample Demo Account Hint */}
          <div className="p-4 rounded-xl kc-glass-strong mb-8 flex items-start gap-3 text-sm">
            <ShieldCheck className="w-5 h-5 text-kc-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-kc-ink tracking-wide text-xs uppercase opacity-80">Demo Accounts:</span>
              <p className="text-kc-ink-dim mt-1 text-xs space-y-1">
                <span className="block">Hindi: <button type="button" onClick={() => setPhone('9000000001')} className="underline font-mono font-bold text-kc-accent hover:text-kc-accent-text transition-colors">9000000001</button></span>
                <span className="block">Marathi: <button type="button" onClick={() => setPhone('9000000002')} className="underline font-mono font-bold text-kc-accent hover:text-kc-accent-text transition-colors">9000000002</button></span>
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
