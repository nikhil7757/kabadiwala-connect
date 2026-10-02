import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLang } from '../../hooks/useLang';

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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0B0A]/95 backdrop-blur-md border-t border-[#1F221F] py-3.5 px-4 transition-all duration-300 shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Status */}
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635] animate-ping" />
          <span className="font-mono text-xs text-[#F5F5F5] font-bold hidden sm:inline">
            12 VERIFIED KABADIWALAS ONLINE IN YOUR METRO
          </span>
          <span className="font-mono text-xs text-[#A3E635] font-bold sm:hidden">
            ONLINE COLLECTORS ACTIVE
          </span>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link
            to="/rates"
            className="px-4 py-2 border border-[#1F221F] hover:border-[#6A6E6A] text-xs font-mono uppercase text-[#C8C8C8] rounded-sm hidden md:inline"
          >
            Check Rates (₹/KG)
          </Link>
          <Link
            to="/book"
            className="px-6 py-2.5 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-sm font-bold uppercase tracking-wider rounded-sm glow-lime flex items-center gap-2 active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'hi' ? 'तुरंत पिकअप बुक करें' : 'BOOK DOORSTEP PICKUP'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
