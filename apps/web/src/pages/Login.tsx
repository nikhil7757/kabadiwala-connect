import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Phone, KeyRound, Sparkles, User, Truck, Factory, Building2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../services/authService';
import { useLang } from '../hooks/useLang';

export const Login: React.FC = () => {
  const { lang } = useLang();
  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('HOUSEHOLD');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setErrorMsg('');
    setStep('otp');
    setOtp('123456'); // Pre-fill mock OTP for quick SIH testing
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') {
      setErrorMsg('Invalid OTP. Use demo OTP: 123456');
      return;
    }
    login(phone, role);
    redirectByRole(role);
  };

  const quickDemoLogin = (r: UserRole) => {
    setRole(r);
    login(`demo_${r.toLowerCase()}@kc.gov.in`, r);
    redirectByRole(r);
  };

  const redirectByRole = (r: UserRole) => {
    if (r === 'COLLECTOR') navigate('/collector');
    else if (r === 'RECYCLER') navigate('/recycler');
    else if (r === 'MUNICIPALITY') navigate('/municipality');
    else navigate('/dashboard');
  };

  const roles = [
    { id: 'HOUSEHOLD', title: 'Citizen / Shop', icon: User, desc: 'Sell scrap, earn instant cash & track carbon offset' },
    { id: 'COLLECTOR', title: 'Kabadiwala', icon: Truck, desc: 'Receive requests, weigh digitally & trigger spot payouts' },
    { id: 'RECYCLER', title: 'Recycling Mill', icon: Factory, desc: 'Verify incoming purity logs & EPR lot manifests' },
    { id: 'MUNICIPALITY', title: 'City Governance', icon: Building2, desc: 'Landfill diversion telemetry & collector registry' },
  ];

  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635] text-xs font-mono font-bold tracking-widest rounded-sm mb-3">
            SECURE ACCESS // MULTI-ACTOR AUTH
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[#F5F5F5] uppercase tracking-tight">
            SIGN IN TO KABADIWALA CONNECT
          </h1>
          <p className="mt-2 text-[#6A6E6A] font-body text-xs sm:text-sm">
            Zero password friction. Select your role in India's circular economy chain.
          </p>
        </div>

        {/* Role Selector Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = role === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setRole(r.id as UserRole)}
                className={`p-4 rounded-sm border cursor-pointer transition-all corner-brackets flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#A3E635] bg-[#A3E635]/10 text-[#F5F5F5]'
                    : 'border-[#1F221F] bg-[#141614] text-[#C8C8C8] hover:border-[#6A6E6A]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-[#A3E635]' : 'text-[#6A6E6A]'}`} />
                  <span className="font-mono text-[10px] text-[#A3E635]">
                    {isSelected ? 'ACTIVE' : ''}
                  </span>
                </div>
                <div>
                  <div className="font-heading text-sm font-bold uppercase">{r.title}</div>
                  <div className="text-[11px] font-mono text-[#6A6E6A] mt-1 leading-tight">{r.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Auth Console Card */}
        <div className="bg-[#141614] border-2 border-[#1F221F] p-6 sm:p-8 corner-brackets shadow-2xl space-y-6">
          {errorMsg && (
            <div className="p-3 bg-[#FF6B5E]/10 border border-[#FF6B5E] text-[#FF6B5E] text-xs font-mono font-bold rounded-sm">
              ⚠ {errorMsg}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-6 font-mono text-xs">
              <div>
                <label className="block text-[#6A6E6A] uppercase mb-2">
                  ENTER 10-DIGIT MOBILE NUMBER:
                </label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-3 bg-[#050605] border border-[#1F221F] text-[#F5F5F5] font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] font-mono text-base p-2.5 rounded-sm outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-lg font-bold uppercase tracking-wider rounded-sm glow-lime transition active:scale-95"
              >
                REQUEST VERIFICATION CODE (SMS)
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6 font-mono text-xs">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[#6A6E6A] uppercase">
                    ENTER 6-DIGIT VERIFICATION CODE:
                  </label>
                  <span className="text-[#A3E635] font-bold">DEMO CODE: 123456</span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] text-center text-3xl tracking-widest text-[#A3E635] font-mono p-3 rounded-sm outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-lg font-bold uppercase tracking-wider rounded-sm glow-lime transition active:scale-95"
              >
                VERIFY & ENTER DASHBOARD
              </button>
            </form>
          )}

          {/* Quick Demo Bypass Bar */}
          <div className="pt-4 border-t border-[#1F221F]">
            <span className="font-mono text-[10px] text-[#6A6E6A] block text-center mb-3 uppercase">
              OR QUICK DEMO LOGIN AS:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              <button
                onClick={() => quickDemoLogin('HOUSEHOLD')}
                className="py-1.5 px-2 bg-[#050605] border border-[#1F221F] hover:border-[#A3E635] text-[#C8C8C8] rounded-sm uppercase font-bold"
              >
                Citizen
              </button>
              <button
                onClick={() => quickDemoLogin('COLLECTOR')}
                className="py-1.5 px-2 bg-[#050605] border border-[#1F221F] hover:border-[#A3E635] text-[#A3E635] rounded-sm uppercase font-bold"
              >
                Kabadiwala
              </button>
              <button
                onClick={() => quickDemoLogin('RECYCLER')}
                className="py-1.5 px-2 bg-[#050605] border border-[#1F221F] hover:border-[#A3E635] text-[#FFB020] rounded-sm uppercase font-bold"
              >
                Recycler
              </button>
              <button
                onClick={() => quickDemoLogin('MUNICIPALITY')}
                className="py-1.5 px-2 bg-[#050605] border border-[#1F221F] hover:border-[#A3E635] text-[#F5F5F5] rounded-sm uppercase font-bold"
              >
                Govt Ward
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;