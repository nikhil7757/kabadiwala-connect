import React, { useEffect, useState, useRef } from 'react';
import { useLang } from '../../hooks/useLang';

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
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const collectors = useCounter(1240, 1800, inView);
  const kgRecycled = useCounter(52340, 2200, inView);
  const co2Saved = useCounter(26, 1600, inView);
  const paidOutLakhs = useCounter(1840, 2000, inView); // in thousands (18.4 L)

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
    <section ref={ref} className="py-16 bg-[#0A0B0A] border-b border-[#1F221F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="w-8 h-0.5 bg-[#A3E635]" />
          <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
            01 // PROVEN IMPACT TELEMETRY
          </span>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="relative p-6 bg-[#141614] border border-[#1F221F] hover:border-[#A3E635]/60 transition-all duration-300 corner-brackets group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-[#A3E635] font-black tracking-widest px-2 py-0.5 rounded bg-[#A3E635]/10 border border-[#A3E635]/30">
                  {stat.unit}
                </span>
                <span className="font-mono text-xs text-[#6A6E6A]">0{i + 1}</span>
              </div>

              <div className="font-display text-4xl sm:text-5xl font-black text-[#F5F5F5] group-hover:text-[#A3E635] transition-colors tracking-tight">
                {stat.value}
              </div>

              <div className="mt-3 font-heading text-sm uppercase font-bold text-[#C8C8C8] tracking-wider">
                {stat.label}
              </div>

              <div className="mt-1 text-xs text-[#6A6E6A] font-body">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
