import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useLang } from '../../hooks/useLang';
import { Container } from './Container';
import { Logo } from '../common/Logo';
import { Icon } from '../common/Icon';

/**
 * Standardized Footer Component (Phase 1, 2, 3)
 * - 4-column grid collapsing cleanly to 1 on mobile
 * - Inside standardized <Container>
 * - Standardized Logo primitive with inline SVG
 * - Fluid clamped wordmark with zero horizontal overflow
 * - Marked with [data-qa-check]
 */
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
    <footer
      role="contentinfo"
      className="relative bg-[#050605] border-t border-[#1F221F] pt-16 pb-12 overflow-hidden text-[#C8C8C8]"
    >
      <Container>
        {/* Top 4-Column Grid: Brand / Platform / Dashboards / Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-[#1F221F]">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Logo size="md" showText />

            <p className="text-xs text-[#6A6E6A] font-body leading-relaxed">
              Smart India Hackathon 2026 (SIH26229). Spearheaded with the Ministry of Mines and
              JNARDDC to bridge India’s informal scrap collectors into a cryptographically
              verifiable circular recycling chain.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs font-mono text-[#A3E635]">
              <Icon icon={ShieldCheck} size={16} />
              <span className="text-[11px] font-bold">JNARDDC ACCREDITED</span>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-3 font-mono text-xs">
            <h4
              data-qa-check="heading"
              className="font-bold text-[#F5F5F5] uppercase tracking-wider mb-2"
            >
              PLATFORM
            </h4>
            <ul className="space-y-2 text-[#6A6E6A]">
              <li>
                <Link to="/rates" data-qa-check="nav-item" className="hover:text-[#A3E635] transition inline-block py-1">
                  Scrap Rates (₹/KG)
                </Link>
              </li>
              <li>
                <Link to="/calculator" data-qa-check="nav-item" className="hover:text-[#A3E635] transition inline-block py-1">
                  Smart Calculator
                </Link>
              </li>
              <li>
                <Link to="/book" data-qa-check="nav-item" className="hover:text-[#A3E635] transition inline-block py-1">
                  Book Doorstep Pickup
                </Link>
              </li>
              <li>
                <Link to="/track" data-qa-check="nav-item" className="hover:text-[#A3E635] transition inline-block py-1">
                  GPS Live Tracker
                </Link>
              </li>
              <li>
                <Link to="/collectors" data-qa-check="nav-item" className="hover:text-[#A3E635] transition inline-block py-1">
                  Find Collectors
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Dashboards */}
          <div className="space-y-3 font-mono text-xs">
            <h4
              data-qa-check="heading"
              className="font-bold text-[#F5F5F5] uppercase tracking-wider mb-2"
            >
              DASHBOARDS
            </h4>
            <ul className="space-y-2 text-[#6A6E6A]">
              <li>
                <Link to="/dashboard" data-qa-check="nav-item" className="hover:text-[#A3E635] transition inline-block py-1">
                  Household Portal
                </Link>
              </li>
              <li>
                <Link to="/collector" data-qa-check="nav-item" className="hover:text-[#A3E635] transition inline-block py-1">
                  Collector Terminal
                </Link>
              </li>
              <li>
                <Link to="/recycler" data-qa-check="nav-item" className="hover:text-[#A3E635] transition inline-block py-1">
                  Recycler Traceability
                </Link>
              </li>
              <li>
                <Link to="/municipality" data-qa-check="nav-item" className="hover:text-[#A3E635] transition inline-block py-1">
                  Municipality Audit
                </Link>
              </li>
              <li>
                <Link to="/rewards" data-qa-check="nav-item" className="hover:text-[#A3E635] transition inline-block py-1">
                  Green Rewards
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Daily Alerts */}
          <div className="space-y-3 font-mono text-xs">
            <h4
              data-qa-check="heading"
              className="font-bold text-[#F5F5F5] uppercase tracking-wider mb-2"
            >
              MANDI BULLETINS
            </h4>
            <p className="text-xs text-[#6A6E6A] font-body leading-relaxed">
              Daily verified scrap market benchmark rates across 12 Indian metros.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#141614] border border-[#1F221F] focus:border-[#A3E635] text-xs font-mono text-[#F5F5F5] py-2.5 pl-3 pr-10 outline-none rounded-sm transition min-h-[44px]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to bulletins"
                  data-qa-check="button"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#A3E635] text-[#0A0B0A] rounded-xs font-mono text-xs font-bold uppercase hover:bg-[#bbf451] transition flex items-center justify-center min-w-[36px]"
                >
                  <Icon icon={ArrowRight} size={16} />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] font-mono text-[#A3E635]">✓ Subscribed to daily bulletins!</p>
              )}
            </form>
          </div>
        </div>

        {/* Wordmark: Fluid clamp, zero horizontal scroll */}
        <div className="py-8 select-none overflow-hidden text-center">
          <div className="font-display text-stroke text-3xl sm:text-5xl md:text-7xl lg:text-8xl tracking-wider opacity-20">
            KABADIWALA CONNECT
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 border-t border-[#1F221F] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#6A6E6A]">
          <div className="text-center sm:text-left text-[11px]">
            © 2026 KABADIWALA CONNECT · SIH26229 · MINISTRY OF MINES &amp; JNARDDC
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <Link to="/learn" data-qa-check="nav-item" className="hover:text-[#A3E635] transition">Segregation Guide</Link>
            <Link to="/about" data-qa-check="nav-item" className="hover:text-[#A3E635] transition">About Mission</Link>
            <Link to="/contact" data-qa-check="nav-item" className="hover:text-[#A3E635] transition">Support</Link>
            <Link to="/privacy" data-qa-check="nav-item" className="hover:text-[#A3E635] transition">Privacy</Link>
            <Link to="/terms" data-qa-check="nav-item" className="hover:text-[#A3E635] transition">Terms</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;