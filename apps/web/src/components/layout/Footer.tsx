import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Mail, Globe, Github, Twitter, Linkedin } from 'lucide-react';
import { useLang } from '../../hooks/useLang';

export const Footer: React.FC = () => {
  const { lang } = useLang();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-[#050605] border-t border-[#1F221F] pt-20 pb-12 overflow-hidden text-[#C8C8C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Grid: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#1F221F]">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-sm bg-[#A3E635] text-[#0A0B0A] font-display text-2xl font-black flex items-center justify-center">
                KC
              </span>
              <div>
                <span className="font-heading font-black text-2xl text-[#F5F5F5] tracking-wider block">
                  KABADIWALA CONNECT
                </span>
                <span className="font-mono text-[10px] text-[#A3E635] tracking-widest block uppercase">
                  SCRAP · COMMUNITY · CHAIN
                </span>
              </div>
            </div>

            <p className="text-sm text-[#6A6E6A] font-body leading-relaxed max-w-md">
              Smart India Hackathon 2026 (Problem Statement SIH26229). Spearheaded with the
              Ministry of Mines and JNARDDC to bridge India’s informal scrap collectors into a
              cryptographically verifiable, circular zero-landfill recycling economy.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs font-mono text-[#A3E635]">
              <ShieldCheck className="w-4 h-4" />
              <span>JNARDDC CIRCULAR ACCREDITATION ACTIVE</span>
            </div>
          </div>

          {/* Links 1: Platform */}
          <div className="lg:col-span-2 space-y-3 font-mono text-xs">
            <div className="font-bold text-[#F5F5F5] uppercase tracking-wider mb-2">PLATFORM</div>
            <ul className="space-y-2 text-[#6A6E6A]">
              <li><Link to="/rates" className="hover:text-[#A3E635] transition">Scrap Rates (₹/KG)</Link></li>
              <li><Link to="/calculator" className="hover:text-[#A3E635] transition">Smart Calculator</Link></li>
              <li><Link to="/book" className="hover:text-[#A3E635] transition">Book Doorstep Pickup</Link></li>
              <li><Link to="/track" className="hover:text-[#A3E635] transition">GPS Live Tracker</Link></li>
              <li><Link to="/collectors" className="hover:text-[#A3E635] transition">Find Collectors</Link></li>
            </ul>
          </div>

          {/* Links 2: Governance & Dashboards */}
          <div className="lg:col-span-2 space-y-3 font-mono text-xs">
            <div className="font-bold text-[#F5F5F5] uppercase tracking-wider mb-2">DASHBOARDS</div>
            <ul className="space-y-2 text-[#6A6E6A]">
              <li><Link to="/dashboard" className="hover:text-[#A3E635] transition">Household Portal</Link></li>
              <li><Link to="/collector" className="hover:text-[#A3E635] transition">Collector Terminal</Link></li>
              <li><Link to="/recycler" className="hover:text-[#A3E635] transition">Recycler Traceability</Link></li>
              <li><Link to="/municipality" className="hover:text-[#A3E635] transition">Municipality Audit</Link></li>
              <li><Link to="/rewards" className="hover:text-[#A3E635] transition">Green Rewards</Link></li>
            </ul>
          </div>

          {/* Links 3: Education & Newsletter */}
          <div className="lg:col-span-3 space-y-4">
            <div className="font-mono text-xs font-bold text-[#F5F5F5] uppercase tracking-wider">
              MANDI RATE UPDATES
            </div>
            <p className="text-xs text-[#6A6E6A] font-body">
              Receive daily SMS and WhatsApp alerts for scrap market price changes across Indian mandis.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#141614] border border-[#1F221F] focus:border-[#A3E635] text-xs font-mono text-[#F5F5F5] py-2.5 px-3 outline-none rounded-sm transition"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#A3E635] text-[#0A0B0A] rounded-xs font-mono text-xs font-bold uppercase hover:bg-[#bbf451] transition"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] font-mono text-[#A3E635]">✓ Subscribed to daily mandi bulletins!</p>
              )}
            </form>
          </div>
        </div>

        {/* Giant Outlined Wordmark (Pattern 13) */}
        <div className="py-12 select-none overflow-hidden text-center">
          <div className="font-display text-stroke text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter opacity-25 hover:opacity-40 transition-opacity">
            KABADIWALA CONNECT
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 border-t border-[#1F221F] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#6A6E6A]">
          <div>
            © 2026 KABADIWALA CONNECT · SIH26229 · MINISTRY OF MINES & JNARDDC
          </div>
          <div className="flex items-center gap-6">
            <Link to="/learn" className="hover:text-[#A3E635] transition">Segregation Guide</Link>
            <Link to="/about" className="hover:text-[#A3E635] transition">About Mission</Link>
            <Link to="/contact" className="hover:text-[#A3E635] transition">Support</Link>
            <Link to="/privacy" className="hover:text-[#A3E635] transition">EPR Privacy</Link>
            <Link to="/terms" className="hover:text-[#A3E635] transition">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};