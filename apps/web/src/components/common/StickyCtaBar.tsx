import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLang } from '../../hooks/useLang';
import { Container } from '../layout/Container';
import { Icon } from './Icon';

/**
 * Standardized Sticky CTA Bar (Phase 1, 2, 3 Component)
 * - Desktop/Tablet only (hidden on mobile sm:hidden where bottom tab bar is active)
 * - Eliminates the dual-stack bottom bar collision bug
 * - Inside standardized <Container>
 */
export const StickyCtaBar: React.FC = () => {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const heroThreshold = 450;

      const bookingEl = document.getElementById('booking-section');
      let inBooking = false;
      if (bookingEl) {
        const rect = bookingEl.getBoundingClientRect();
        inBooking = rect.top < window.innerHeight && rect.bottom > 0;
      }

      setVisible(scrollPos > heroThreshold && !inBooking);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="complementary"
      aria-label="Quick Action Bar"
      className="hidden sm:block fixed bottom-0 left-0 right-0 z-[20] bg-[#0A0B0A]/95 backdrop-blur-md border-t border-[#1F221F] py-3 transition-all duration-300 shadow-[0_-8px_20px_rgba(0,0,0,0.8)]"
    >
      <Container>
        <div className="flex items-center justify-between gap-4">
          {/* Left Status */}
          <div className="flex items-center gap-2.5 font-mono text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635] animate-ping shrink-0" />
            <span className="text-[#F5F5F5] font-bold">
              12 VERIFIED KABADIWALAS ONLINE IN YOUR METRO
            </span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/rates"
              data-qa-check="button"
              className="min-h-[44px] px-4 py-2 border border-[#1F221F] hover:border-[#6A6E6A] text-xs font-mono uppercase text-[#C8C8C8] rounded-sm flex items-center justify-center transition"
            >
              Check Rates (₹/KG)
            </Link>
            <Link
              to="/book"
              data-qa-check="button"
              className="min-h-[44px] px-6 py-2.5 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-sm font-bold uppercase tracking-wider rounded-sm glow-lime flex items-center gap-2 active:scale-95 transition"
            >
              <Icon icon={Sparkles} size={16} />
              <span>{lang === 'hi' ? 'तुरंत पिकअप बुक करें' : 'BOOK DOORSTEP PICKUP'}</span>
              <Icon icon={ArrowRight} size={16} />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default StickyCtaBar;
