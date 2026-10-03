import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Truck, QrCode, Factory, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLang } from '../../hooks/useLang';
import { Container } from '../layout/Container';
import { Icon } from './Icon';
import { LazyImage } from './LazyImage';

const STEPS = [
  {
    step: '01',
    title: 'DOORSTEP CITIZEN REQUEST',
    titleHi: 'घर बैठे पिकअप अनुरोध',
    icon: Smartphone,
    desc: 'Households and shops select recyclable materials, view live transparent mandi rates, and schedule verified doorstep pickup.',
    descHi: 'घर और व्यावसायिक प्रतिष्ठान पारदर्शी दरों पर ऑनलाइन कबाड़ पिकअप शेड्यूल करते हैं।',
    actor: 'CITIZEN / HOUSEHOLD',
    metric: '100% DIGITAL SCHEDULE',
    badge: 'STAGE 01',
    img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    step: '02',
    title: 'INFORMAL COLLECTOR DISPATCH',
    titleHi: 'कबाड़ीवाला त्वरित स्वीकृति',
    icon: Truck,
    desc: 'Local informal kabadiwalas receive instant mobile alerts, navigate to the doorstep with calibrated scales, and pay on the spot via UPI or cash.',
    descHi: 'स्थानीय कबाड़ीवाले मोबाइल पर अलर्ट पाते हैं, डिजिटल तराजू से तौलते हैं और तुरंत भुगतान करते हैं।',
    actor: 'VERIFIED KABADIWALA',
    metric: 'ON-THE-SPOT UPI PAYOUT',
    badge: 'STAGE 02',
    img: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1000&q=80',
  },
  {
    step: '03',
    title: 'MICRO-HUB BATCH DIGITIZATION',
    titleHi: 'माइक्रो-हब सॉर्टिंग व डिजिटल बैच',
    icon: QrCode,
    desc: 'Collected scrap is sorted into 15 high-purity sub-grades. A cryptographic QR lot tag is generated, linking the batch to its original collector network.',
    descHi: 'सामग्री को 15 उप-श्रेणियों में छांटा जाता है और डिजिटल क्यूआर बैच कोड जारी किया जाता है।',
    actor: 'COMMUNITY AGGREGATOR',
    metric: 'QR TRACEABILITY CODE',
    badge: 'STAGE 03',
    img: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=1000&q=80',
  },
  {
    step: '04',
    title: 'FORMAL RECYCLER MANIFEST',
    titleHi: 'औपचारिक रीसाइक्लर प्रोसेसिंग',
    icon: Factory,
    desc: 'Government-registered recycling plants scan the batch QR code, verify purity logs, and feed materials directly into secondary smelters.',
    descHi: 'पंजीकृत रीसाइक्लिंग मिलें बैच को सत्यापित कर सीधे औद्योगिक रीसाइक्लिंग में उपयोग करती हैं।',
    actor: 'REGISTERED RECYCLER',
    metric: 'EPR COMPLIANCE AUDIT',
    badge: 'STAGE 04',
    img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
  },
  {
    step: '05',
    title: 'CIRCULAR ECONOMY RESTORATION',
    titleHi: 'सर्कुलर इकोनॉमी नया उत्पाद',
    icon: RefreshCw,
    desc: 'High-grade copper ingots, recycled plastic pellets, and paper pulp re-enter Indian industry, closing the loop with zero landfill leakage.',
    descHi: 'शुद्ध कॉपर और रीसाइकल प्लास्टिक भारतीय उद्योगों में वापस आकर जीरो लैंडफिल चक्र पूरा करते हैं।',
    actor: 'CIRCULAR INDUSTRY',
    metric: 'ZERO LANDFILL DIVERSION',
    badge: 'STAGE 05',
    img: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
  },
];

/**
 * Standardized Informal-to-Formal Chain Stepper (Phase 3 Component)
 * - Horizontal stepper on desktop (md:flex)
 * - Vertical stepper on mobile (md:hidden)
 * - Inside standardized <Container>
 */
export const ScrollChainStory: React.FC = () => {
  const { lang } = useLang();
  const [activeStep, setActiveStep] = useState(0);

  const cur = STEPS[activeStep];
  const StepIcon = cur.icon;

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-[#050605] border-b border-[#1F221F]">
      <Container>
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-0.5 bg-[#A3E635]" />
            <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
              04 // THE INFORMAL TO FORMAL PIPELINE
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2
                data-qa-check="heading"
                className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight"
              >
                {lang === 'hi' ? 'सर्कुलर आपूर्ति श्रृंखला' : 'HOW THE CHAIN WORKS'}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#6A6E6A] font-body max-w-xl">
                {lang === 'hi'
                  ? 'कबाड़ीवाले की साइकिल से लेकर आधुनिक रीसाइक्लिंग प्लांट तक — 5 चरणों की पारदर्शी यात्रा।'
                  : 'From the doorstep kabadi cart to high-grade industrial ingots: an unbroken digital chain of custody.'}
              </p>
            </div>

            {/* Desktop Horizontal Stepper (hidden on mobile) */}
            <div className="hidden md:flex items-center gap-2">
              {STEPS.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  data-qa-check="button"
                  className={`min-h-[44px] px-3.5 py-2 text-xs font-mono font-bold rounded-sm border transition-all flex items-center gap-2 ${
                    activeStep === idx
                      ? 'bg-[#A3E635] text-[#0A0B0A] border-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.3)]'
                      : 'bg-[#141614] text-[#C8C8C8] border-[#1F221F] hover:border-[#6A6E6A]'
                  }`}
                >
                  <span>{s.step}</span>
                  <span className="hidden lg:inline">{s.actor.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Vertical Stepper Navigation (hidden on desktop) */}
        <div className="md:hidden grid grid-cols-5 gap-1.5 mb-6">
          {STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(idx)}
              data-qa-check="button"
              className={`min-h-[44px] py-2 text-center font-mono text-xs font-bold rounded-sm border transition-all ${
                activeStep === idx
                  ? 'bg-[#A3E635] text-[#0A0B0A] border-[#A3E635]'
                  : 'bg-[#141614] text-[#6A6E6A] border-[#1F221F]'
              }`}
            >
              {s.step}
            </button>
          ))}
        </div>

        {/* Interactive Main Chain Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0A0B0A] border border-[#1F221F] p-6 sm:p-10 corner-brackets min-w-0">
          {/* Left Column: Info & Metrics */}
          <div className="lg:col-span-6 space-y-6 min-w-0">
            <div className="flex items-center gap-3">
              <span
                data-qa-check="badge"
                className="px-3 py-1 bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635] text-xs font-mono font-bold tracking-widest rounded-sm shrink-0"
              >
                {cur.badge}
              </span>
              <span className="text-xs font-mono text-[#6A6E6A] tracking-wider uppercase truncate">
                {cur.actor}
              </span>
            </div>

            <div className="space-y-3">
              <div className="font-display text-2xl sm:text-4xl lg:text-5xl text-[#F5F5F5] uppercase tracking-tight flex items-center gap-3">
                <Icon icon={StepIcon} size={28} className="text-[#A3E635]" />
                <span data-qa-check="heading">{lang === 'hi' ? cur.titleHi : cur.title}</span>
              </div>
              <p className="text-[#C8C8C8] text-sm sm:text-base font-body leading-relaxed">
                {lang === 'hi' ? cur.descHi : cur.desc}
              </p>
            </div>

            {/* Key Assurance Metric Box */}
            <div className="p-4 bg-[#141614] border border-[#1F221F] rounded-sm flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#F5F5F5] font-mono min-w-0">
                <Icon icon={CheckCircle2} size={18} className="text-[#A3E635]" />
                <span className="font-bold truncate">{cur.metric}</span>
              </div>
              <span className="text-[10px] font-mono text-[#A3E635] shrink-0">VERIFIED</span>
            </div>

            {/* Next / Prev Stepper Controls */}
            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                data-qa-check="button"
                className="min-h-[44px] px-5 py-2.5 bg-[#141614] border border-[#1F221F] text-xs font-mono font-bold uppercase tracking-wider text-[#F5F5F5] disabled:opacity-30 hover:border-[#A3E635] transition"
              >
                ← PREV
              </button>
              <button
                disabled={activeStep === STEPS.length - 1}
                onClick={() => setActiveStep((p) => Math.min(STEPS.length - 1, p + 1))}
                data-qa-check="button"
                className="min-h-[44px] px-6 py-2.5 bg-[#A3E635] text-[#0A0B0A] text-xs font-mono font-bold uppercase tracking-wider disabled:opacity-30 hover:bg-[#bbf451] transition"
              >
                NEXT STAGE →
              </button>
            </div>
          </div>

          {/* Right Column: Photography Showcase with Clean Inset */}
          <div className="lg:col-span-6 min-w-0">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-sm border border-[#1F221F] bg-[#141614]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={cur.step}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 0.9, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-cover bg-center grayscale contrast-125"
                  style={{ backgroundImage: `url(${cur.img})` }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 scanline opacity-60 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0A] via-transparent to-transparent opacity-80 pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-[#F5F5F5] bg-[#0A0B0A]/85 backdrop-blur-sm p-3 border border-[#1F221F]">
                <span className="text-[#A3E635] font-bold">STAGE // {cur.step}</span>
                <span className="text-[#6A6E6A] truncate max-w-[200px]">{cur.actor}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ScrollChainStory;
