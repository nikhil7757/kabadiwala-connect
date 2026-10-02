import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Radio, ShieldCheck } from 'lucide-react';
import { useLang } from '../../hooks/useLang';

// 5 Cinematic Noir Scenes of the Circular Journey
const SLIDES = [
  {
    id: 1,
    title: 'THE INFORMAL HERO',
    subtitle: 'Kabadiwala with Cart · Doorstep Recovery',
    tag: 'PHASE 01 // FIRST MILE AGGREGATION',
    bg: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1800&q=80',
  },
  {
    id: 2,
    title: 'MICRO-HUB SEGREGATION',
    subtitle: 'Urban Scrap Yard · Precision Separation',
    tag: 'PHASE 02 // DENSITY SORTING',
    bg: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1800&q=80',
  },
  {
    id: 3,
    title: 'DIGITAL PURITY AUDIT',
    subtitle: 'Copper, Brass, Motherboards & PET Baling',
    tag: 'PHASE 03 // QR LOT TRACEABILITY',
    bg: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=1800&q=80',
  },
  {
    id: 4,
    title: 'INDUSTRIAL SMELTING',
    subtitle: 'Formal Recycling Mill · Secondary Metallurgy',
    tag: 'PHASE 04 // JNARDDC ZERO-LOSS CIRCULARITY',
    bg: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1800&q=80',
  },
  {
    id: 5,
    title: 'GREEN RE-MANUFACTURE',
    subtitle: 'High-Grade Secondary Ingot & Fiber Conversion',
    tag: 'PHASE 05 // CIRCULAR ZERO LANDFILL',
    bg: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=80',
  },
];

const DURATION_PER_SLIDE = 6500; // ms

export const HeroReel: React.FC = () => {
  const { lang } = useLang();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [liveCount, setLiveCount] = useState(148);

  useEffect(() => {
    // Timestamp driven loop
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const totalIndex = Math.floor(elapsed / DURATION_PER_SLIDE) % SLIDES.length;
      const currentProgress = ((elapsed % DURATION_PER_SLIDE) / DURATION_PER_SLIDE) * 100;
      setCurrentIdx(totalIndex);
      setProgress(currentProgress);
    }, 50);

    // Live counter jitter
    const countTimer = setInterval(() => {
      setLiveCount((c) => c + (Math.random() > 0.6 ? 1 : 0));
    }, 4500);

    return () => {
      clearInterval(timer);
      clearInterval(countTimer);
    };
  }, []);

  const slide = SLIDES[currentIdx];

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden border-b border-[#1F221F] bg-[#0A0B0A] pt-20">
      {/* Background Cinematic Reel with Ken Burns Zoom & Noir Tone */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.38, scale: 1.0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-cover bg-center grayscale contrast-125"
            style={{ backgroundImage: `url(${slide.bg})` }}
          />
        </AnimatePresence>

        {/* Scanlines & Noir Radial Falloff */}
        <div className="absolute inset-0 scanline opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0A] via-[#0A0B0A]/70 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0A0B0A]/40 to-[#0A0B0A]" />
        
        {/* Ambient Lime Glow in top-right */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#A3E635]/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Strip / Chapter Progress */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141614] border border-[#1F221F] text-[#A3E635]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#A3E635]" />
            <span className="font-bold tracking-wider">LIVE TELEMETRY</span>
          </span>
          <span className="text-[#F5F5F5] font-bold">
            {liveCount} <span className="text-[#6A6E6A] font-normal">PICKUPS LOGGED TODAY</span>
          </span>
        </div>

        {/* Chapter Counter & Progress */}
        <div className="flex items-center gap-3">
          <span className="text-[#A3E635] font-bold tracking-widest">
            0{slide.id} <span className="text-[#6A6E6A]">/ 0{SLIDES.length}</span>
          </span>
          <div className="w-24 h-1 bg-[#1F221F] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#A3E635] transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="hidden sm:inline text-[#6A6E6A] uppercase">{slide.tag}</span>
        </div>
      </div>

      {/* Main Headline & Hero Action */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 lg:py-20 my-auto">
        <div className="max-w-4xl space-y-6">
          {/* Section Marker */}
          <div className="flex items-center gap-3">
            <span className="w-10 h-0.5 bg-[#A3E635]" />
            <span className="font-mono text-xs text-[#A3E635] uppercase tracking-widest font-bold">
              SIH 2026 // MINISTRY OF MINES & JNARDDC
            </span>
          </div>

          {/* Masked Headline Reveal Line by Line */}
          <div className="space-y-1 font-display uppercase tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9]">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-[#F5F5F5]"
              >
                {lang === 'hi' ? 'कबाड़ी से शुरू.' : 'FROM KABADI.'}
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-stroke"
              >
                {lang === 'hi' ? 'सर्कुलर भविष्य.' : 'TO CIRCULAR.'}
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-[#A3E635]"
              >
                {lang === 'hi' ? '100% ट्रेसेबल.' : 'TRACEABLE.'}
              </motion.h1>
            </div>
          </div>

          {/* Tagline / Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[#C8C8C8] max-w-2xl font-body leading-relaxed">
            {lang === 'hi'
              ? 'अनौपचारिक कबाड़ीवालों को औपचारिक रीसाइक्लिंग चेन से जोड़ना। पारदर्शी दरें, त्वरित डिजिटल वजन, ऑन-द-स्पॉट UPI भुगतान और प्रमाणित रीसायकल बैच।'
              : 'Bringing the Informal Collector into the Formal Recycling Chain. Verified doorstep pickups, live mandi transparent rates, instant digital weighing, and complete EPR traceability.'}
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/book"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#A3E635] text-[#0A0B0A] font-heading text-xl font-bold uppercase tracking-wider rounded-sm glow-lime hover:bg-[#bbf451] active:scale-95 transition-all duration-200"
            >
              <span>{lang === 'hi' ? 'पिकअप शेड्यूल करें' : 'SCHEDULE PICKUP'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/rates"
              className="inline-flex items-center gap-2 px-6 py-4 bg-[#141614] border border-[#1F221F] hover:border-[#A3E635] text-[#F5F5F5] font-mono text-sm uppercase tracking-wider rounded-sm hover:bg-[#1B1E1B] transition-all"
            >
              <span>{lang === 'hi' ? 'लाइव दरें देखें' : 'VIEW LIVE RATES (₹/KG)'}</span>
            </Link>

            <div className="flex items-center gap-2 text-xs font-mono text-[#6A6E6A] pl-2">
              <ShieldCheck className="w-4 h-4 text-[#A3E635]" />
              <span>ZERO COMMISSION ON INFORMAL COLLECTORS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Metadata Reel Caption */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-6 pt-4 border-t border-[#1F221F]/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#6A6E6A]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A3E635]" />
          <span className="text-[#F5F5F5] font-bold">{slide.title}</span>
          <span>— {slide.subtitle}</span>
        </div>
        <div className="text-[11px] text-[#A3E635]">
          CYCLE FREQUENCY: 6.5s · SATELLITE GPS ACTIVE
        </div>
      </div>
    </section>
  );
};
