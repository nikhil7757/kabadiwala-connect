import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Radio, ShieldCheck, Sparkles } from 'lucide-react';
import { useLang } from '../../hooks/useLang';
import { Container } from '../layout/Container';
import { Icon } from './Icon';

// 5 Cinematic Noir Scenes of the Circular Journey
const SLIDES = [
  {
    id: 1,
    title: 'THE INFORMAL HERO',
    subtitle: 'Kabadiwala with Cart · Doorstep Recovery',
    tag: 'PHASE 01 // FIRST MILE AGGREGATION',
    bg: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'MICRO-HUB SEGREGATION',
    subtitle: 'Urban Scrap Yard · Precision Separation',
    tag: 'PHASE 02 // DENSITY SORTING',
    bg: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'DIGITAL PURITY AUDIT',
    subtitle: 'Copper, Brass & PET Baling Logs',
    tag: 'PHASE 03 // QR LOT TRACEABILITY',
    bg: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'INDUSTRIAL SMELTING',
    subtitle: 'Formal Recycling Mill · Secondary Metallurgy',
    tag: 'PHASE 04 // JNARDDC ZERO-LOSS CIRCULARITY',
    bg: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'CIRCULAR RECOVERY',
    subtitle: 'High-Grade Secondary Ingot Conversion',
    tag: 'PHASE 05 // CIRCULAR ZERO LANDFILL',
    bg: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
  },
];

const DURATION_PER_SLIDE = 6500; // ms

/**
 * Standardized Hero Section (Phase 3 Component)
 * - 2 columns on desktop (text + CTA left, visual reel right), stacked on mobile
 * - Fluid headline clamp(2.25rem, 6vw, 4.5rem)
 * - CTAs wrap cleanly with 44px min touch targets
 * - Inside standardized <Container>
 */
export const HeroReel: React.FC = () => {
  const { lang } = useLang();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [liveCount, setLiveCount] = useState(148);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const totalIndex = Math.floor(elapsed / DURATION_PER_SLIDE) % SLIDES.length;
      const currentProgress = ((elapsed % DURATION_PER_SLIDE) / DURATION_PER_SLIDE) * 100;
      setCurrentIdx(totalIndex);
      setProgress(currentProgress);
    }, 50);

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
    <section className="relative overflow-hidden bg-[#0A0B0A] border-b border-[#1F221F] py-12 sm:py-16 lg:py-24">
      {/* Ambient Glow: safely constrained inside section with pointer-events-none */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#A3E635]/10 rounded-full blur-[120px] pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-w-0">
          {/* Column 1 (Left): Text, Value Prop & CTAs */}
          <div className="lg:col-span-7 space-y-6 min-w-0">
            {/* Small Label */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-0.5 bg-[#A3E635] shrink-0" />
              <span className="font-mono text-xs text-[#A3E635] uppercase tracking-widest font-bold truncate">
                SIH 2026 // MINISTRY OF MINES &amp; JNARDDC
              </span>
            </div>

            {/* Big Title (Fluid Headline Clamp) */}
            <div className="space-y-1 select-none">
              <h1
                data-qa-check="heading"
                className="font-display uppercase tracking-tight text-[#F5F5F5] fluid-headline"
              >
                {lang === 'hi' ? 'कबाड़ी से शुरू.' : 'FROM KABADI.'}
              </h1>
              <div
                className="font-display uppercase tracking-tight text-stroke fluid-headline"
              >
                {lang === 'hi' ? 'सर्कुलर भविष्य.' : 'TO CIRCULAR.'}
              </div>
              <div
                className="font-display uppercase tracking-tight text-[#A3E635] fluid-headline"
              >
                {lang === 'hi' ? '100% ट्रेसेबल.' : 'TRACEABLE.'}
              </div>
            </div>

            {/* Short Description */}
            <p className="text-base sm:text-lg text-[#C8C8C8] font-body leading-relaxed max-w-xl">
              {lang === 'hi'
                ? 'अनौपचारिक कबाड़ीवालों को औपचारिक रीसाइक्लिंग चेन से जोड़ना। पारदर्शी दरें, त्वरित डिजिटल वजन, ऑन-द-स्पॉट UPI भुगतान और प्रमाणित रीसायकल बैच।'
                : 'Bringing the informal collector into the formal recycling chain. Doorstep pickups, transparent mandi rates, instant digital weighing, and complete EPR traceability.'}
            </p>

            {/* CTAs: Wrap cleanly, minimum 44px height */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/book"
                data-qa-check="button"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 bg-[#A3E635] text-[#0A0B0A] font-heading text-base font-bold uppercase tracking-wider rounded-sm glow-lime hover:bg-[#bbf451] active:scale-95 transition"
              >
                <span>{lang === 'hi' ? 'पिकअप शेड्यूल करें' : 'SCHEDULE PICKUP'}</span>
                <Icon icon={ArrowRight} size={18} />
              </Link>

              <Link
                to="/rates"
                data-qa-check="button"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 bg-[#141614] border border-[#1F221F] hover:border-[#A3E635] text-[#F5F5F5] font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-[#1B1E1B] transition"
              >
                <span>{lang === 'hi' ? 'दरें देखें' : 'VIEW RATES (₹/KG)'}</span>
              </Link>
            </div>

            {/* Trust Assurance Badge */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#6A6E6A] pt-1">
              <Icon icon={ShieldCheck} size={16} className="text-[#A3E635]" />
              <span>ZERO COMMISSION ON INFORMAL COLLECTORS · 100% FREE DOORSTEP PICKUP</span>
            </div>
          </div>

          {/* Column 2 (Right): Interactive Visual Reel */}
          <div className="lg:col-span-5 min-w-0">
            <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-sm border-2 border-[#1F221F] overflow-hidden bg-[#050605] shadow-2xl corner-brackets">
              {/* Cinematic Scene */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 0.85, scale: 1.0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute inset-0 bg-cover bg-center grayscale contrast-125"
                  style={{ backgroundImage: `url(${slide.bg})` }}
                />
              </AnimatePresence>

              {/* Scanline & Vignette */}
              <div className="absolute inset-0 scanline opacity-75 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0A] via-transparent to-transparent opacity-90 pointer-events-none" />

              {/* Top Reel Telemetry Strip */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0A0B0A]/80 border border-[#1F221F] text-[#A3E635]">
                  <Icon icon={Radio} size={14} className="animate-pulse text-[#A3E635]" />
                  <span className="font-bold text-[10px] tracking-wider">LIVE TELEMETRY</span>
                </span>
                <span className="font-mono text-xs font-bold text-[#A3E635] bg-[#0A0B0A]/80 px-2 py-0.5 border border-[#1F221F]">
                  0{slide.id} / 0{SLIDES.length}
                </span>
              </div>

              {/* Bottom Caption and Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0A0B0A]/85 backdrop-blur-sm border-t border-[#1F221F] space-y-2 z-10">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[#F5F5F5] uppercase truncate mr-2">
                    {slide.title}
                  </span>
                  <span className="text-[10px] text-[#A3E635] shrink-0">
                    {liveCount} PICKUPS LOGGED TODAY
                  </span>
                </div>
                <div className="w-full h-1 bg-[#1F221F] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#A3E635] transition-all duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroReel;
