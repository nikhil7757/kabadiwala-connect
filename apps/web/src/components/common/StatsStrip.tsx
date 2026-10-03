import React, { useEffect, useState, useRef } from 'react';
import { useLang } from '../../hooks/useLang';
import { Container } from '../layout/Container';

function useCounter(target: number, duration = 2000, trigger = true) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const increment = target / (duration / 20);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else {
        setVal(Math.floor(start));
      }
    }, 20);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);

  return val;
}

/**
 * Standardized Stats Strip Section (Phase 3 Component)
 * - 2x2 grid on mobile (grid-cols-2), 4 columns on desktop (lg:grid-cols-4)
 * - Animated count-up
 * - Equal height cards with corner bracket styling
 * - Standardized <Container>
 */
export const StatsStrip: React.FC = () => {
  const { lang } = useLang();
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const collectors = useCounter(1240, 1800, inView);
  const kgRecycled = useCounter(52340, 2200, inView);
  const co2Saved = useCounter(26, 1600, inView);
  const paidOutLakhs = useCounter(1840, 2000, inView);

  const stats = [
    {
      label: lang === 'hi' ? 'सत्यापित कबाड़ीवाले' : 'VERIFIED COLLECTORS',
      value: `${collectors.toLocaleString()}+`,
      sub: lang === 'hi' ? 'डिजिटल पहचान प्रमाणित' : 'QR-Identified Informal Workers',
      unit: 'ACTIVE',
    },
    {
      label: lang === 'hi' ? 'पुनर्नवीनीकरण स्क्रैप' : 'RECYCLED WEIGHT',
      value: `${kgRecycled.toLocaleString()} KG`,
      sub: lang === 'hi' ? 'डंपिंग यार्ड से बचाया' : 'Diverted from Urban Landfills',
      unit: 'TRACEABLE',
    },
    {
      label: lang === 'hi' ? 'CO₂ उत्सर्जन बचत' : 'CARBON AVOIDED',
      value: `${co2Saved} TONNES`,
      sub: lang === 'hi' ? 'पर्यावरण संरक्षण प्रभाव' : 'Certified Greenhouse Offset',
      unit: 'JNARDDC',
    },
    {
      label: lang === 'hi' ? 'कुल प्रत्यक्ष भुगतान' : 'DIRECT PAYOUTS',
      value: `₹${(paidOutLakhs / 100).toFixed(1)} LAKH`,
      sub: lang === 'hi' ? 'ऑन-द-स्पॉट UPI व नकद' : 'Direct to Informal Pockets',
      unit: 'ZERO CUT',
    },
  ];

  return (
    <section ref={ref} className="py-12 sm:py-16 bg-[#0A0B0A] border-b border-[#1F221F]">
      <Container>
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-0.5 bg-[#A3E635]" />
          <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
            01 // PROVEN IMPACT TELEMETRY
          </span>
        </div>

        {/* 2x2 Grid on Mobile, 4 Columns on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-w-0">
          {stats.map((stat, i) => (
            <div
              key={i}
              data-qa-check="card"
              className="relative p-4 sm:p-6 bg-[#141614] border border-[#1F221F] hover:border-[#A3E635]/60 transition-all corner-brackets flex flex-col justify-between min-w-0 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[9px] sm:text-[10px] text-[#A3E635] font-black tracking-wider px-1.5 py-0.5 rounded bg-[#A3E635]/10 border border-[#A3E635]/30">
                  {stat.unit}
                </span>
                <span className="font-mono text-[11px] text-[#6A6E6A]">0{i + 1}</span>
              </div>

              <div
                data-qa-check="heading"
                className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-[#F5F5F5] group-hover:text-[#A3E635] transition-colors tracking-tight truncate"
              >
                {stat.value}
              </div>

              <div className="mt-2 font-heading text-xs sm:text-sm uppercase font-bold text-[#C8C8C8] tracking-wider truncate">
                {stat.label}
              </div>

              <div className="mt-1 text-[11px] sm:text-xs text-[#6A6E6A] font-body line-clamp-1">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default StatsStrip;
