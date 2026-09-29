import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.js';

export const AdminLoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAppStore((s) => s.setAuth);

  const [email, setEmail] = useState('admin@sample.kc');
  const [password, setPassword] = useState('Demo@1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error?.message || 'Invalid admin credentials');
      }

      await setAuth(body.data.token, body.data.user.role, body.data.user);
      navigate('/admin/recyclers', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141414] border border-[#2A2A2A] rounded-xs p-6 shadow-2xl relative">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-7 h-7 text-kc-accent" />
          <h1 className="text-xl font-mono font-bold tracking-wider uppercase text-white">
            ADMIN VERIFIER TERMINAL
          </h1>
        </div>

        <p className="text-xs font-mono text-[#9A9A9A] mb-6">
          Ministry of Mines / JNARDDC Regulatory Governance Interface
        </p>

        {error && (
          <div className="p-3 mb-4 rounded-xs bg-kc-danger-soft/20 border border-kc-danger text-xs font-mono text-kc-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4 font-mono">
          <div>
            <label className="text-xs text-[#C0C0C0] uppercase tracking-wider block mb-1">
              ADMINISTRATIVE EMAIL
            </label>
            <div className="h-12 border-b-2 border-[#2A2A2A] focus-within:border-kc-accent flex items-center px-1">
              <Mail className="w-4 h-4 text-[#9A9A9A] mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent text-sm text-white focus:outline-none"
                placeholder="admin@sample.kc"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#C0C0C0] uppercase tracking-wider block mb-1">
              CREDENTIAL KEY
            </label>
            <div className="h-12 border-b-2 border-[#2A2A2A] focus-within:border-kc-accent flex items-center px-1">
              <Lock className="w-4 h-4 text-[#9A9A9A] mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent text-sm text-white focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[11px] text-[#9A9A9A]">
            <span className="font-bold text-kc-accent">SAMPLE DEMO ADMIN:</span>
            <p>Email: admin@sample.kc • Password: Demo@1234</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 bg-kc-accent text-black font-bold uppercase tracking-wider text-sm rounded-xs flex items-center justify-center gap-2 hover:bg-[#FF7A33]"
          >
            {loading ? 'Authenticating...' : 'Sign In To Governance Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
