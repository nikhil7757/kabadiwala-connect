import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Truck, QrCode, Factory, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useLang } from '../../hooks/useLang';

const STEPS = [
  {
    step: '01',
    title: 'DOORSTEP CITIZEN REQUEST',
    titleHi: 'घर बैठे पिकअप अनुरोध',
    icon: Smartphone,
    desc: 'Households and commercial shops select scrap materials, view live transparent mandi rates, and schedule verified doorstep pickup.',
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
    desc: 'Local informal kabadiwalas receive instant mobile alerts, navigate to the doorstep with digital scales, audit purity, and pay on the spot via UPI or cash.',
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
    desc: 'Government-registered recycling plants scan the batch QR code, verify purity logs, and feed materials directly into secondary smelters and chemical recovery tanks.',
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

export const ScrollChainStory: React.FC = () => {
  const { lang } = useLang();
  const [activeStep, setActiveStep] = useState(0);

  const cur = STEPS[activeStep];
  const Icon = cur.icon;

  return (
    <section className="py-24 bg-[#050605] border-b border-[#1F221F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Marker */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-0.5 bg-[#A3E635]" />
          <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
            02 // THE INFORMAL TO FORMAL PIPELINE
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight">
              {lang === 'hi' ? 'सर्कुलर आपूर्ति श्रृंखला' : 'HOW THE CHAIN WORKS'}
            </h2>
            <p className="mt-2 text-[#6A6E6A] font-body max-w-xl text-sm sm:text-base">
              {lang === 'hi'
                ? 'कबाड़ीवाले की साइकिल से लेकर आधुनिक रीसाइक्लिंग प्लांट तक — 5 चरणों की पारदर्शी यात्रा।'
                : 'From the doorstep kabadi cart to high-grade industrial ingots: an unbroken digital chain of custody.'}
            </p>
          </div>

          {/* Quick Step Indicators */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`px-3 py-2 text-xs font-mono font-bold rounded-sm border transition-all flex items-center gap-2 ${
                  activeStep === idx
                    ? 'bg-[#A3E635] text-[#0A0B0A] border-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                    : 'bg-[#141614] text-[#C8C8C8] border-[#1F221F] hover:border-[#6A6E6A]'
                }`}
              >
                <span>{s.step}</span>
                <span className="hidden lg:inline">{s.actor.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Main Chain Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0A0B0A] border border-[#1F221F] p-6 sm:p-10 corner-brackets">
          {/* Left Info Panel */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635] text-xs font-mono font-bold tracking-widest rounded-sm">
                {cur.badge}
              </span>
              <span className="text-xs font-mono text-[#6A6E6A] tracking-wider uppercase">
                {cur.actor}
              </span>
            </div>

            <div className="space-y-2">
              <div className="font-display text-3xl sm:text-5xl text-[#F5F5F5] uppercase tracking-tight flex items-center gap-3">
                <Icon className="w-8 h-8 text-[#A3E635] stroke-[2]" />
                <span>{lang === 'hi' ? cur.titleHi : cur.title}</span>
              </div>
              <p className="text-[#C8C8C8] text-base sm:text-lg font-body leading-relaxed">
                {lang === 'hi' ? cur.descHi : cur.desc}
              </p>
            </div>

            {/* Key Assurance Metric Box */}
            <div className="p-4 bg-[#141614] border border-[#1F221F] rounded-sm flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#F5F5F5] font-mono">
                <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
                <span className="font-bold">{cur.metric}</span>
              </div>
              <span className="text-[11px] font-mono text-[#A3E635]">VERIFIED PROTOCOL</span>
            </div>

            {/* Next / Prev Stepper Controls */}
            <div className="flex items-center gap-4 pt-2">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                className="px-5 py-2.5 bg-[#141614] border border-[#1F221F] text-xs font-mono font-bold uppercase tracking-wider text-[#F5F5F5] disabled:opacity-30 hover:border-[#A3E635] transition"
              >
                ← PREVIOUS
              </button>
              <button
                disabled={activeStep === STEPS.length - 1}
                onClick={() => setActiveStep((p) => Math.min(STEPS.length - 1, p + 1))}
                className="px-6 py-2.5 bg-[#A3E635] text-[#0A0B0A] text-xs font-mono font-bold uppercase tracking-wider disabled:opacity-30 hover:bg-[#bbf451] transition"
              >
                NEXT STAGE →
              </button>
            </div>
          </div>

          {/* Right Noir Photography Showcase with Zoom */}
          <div className="lg:col-span-6 relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-sm border border-[#1F221F]">
            <AnimatePresence mode="wait">
              <motion.div
                key={cur.step}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-cover bg-center grayscale contrast-125"
                style={{ backgroundImage: `url(${cur.img})` }}
              />
            </AnimatePresence>

            <div className="absolute inset-0 scanline opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0A] via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-[#F5F5F5] bg-[#0A0B0A]/80 backdrop-blur-sm p-3 border border-[#1F221F]">
              <span className="text-[#A3E635] font-bold">STAGE // {cur.step}</span>
              <span className="text-[#6A6E6A] truncate max-w-[200px]">{cur.actor}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
