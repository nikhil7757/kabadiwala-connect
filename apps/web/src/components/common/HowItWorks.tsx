import React from 'react';
import { Smartphone, Scale, QrCode, ArrowRight } from 'lucide-react';
import { useLang } from '../../hooks/useLang';
import { Container } from '../layout/Container';
import { Icon } from './Icon';

interface StepItem {
  num: string;
  title: string;
  titleHi: string;
  desc: string;
  descHi: string;
  icon: any;
  metric: string;
}

const STEPS: StepItem[] = [
  {
    num: '01',
    title: 'SCHEDULE DOORSTEP PICKUP',
    titleHi: 'पिकअप शेड्यूल करें',
    desc: 'Select scrap items in 30 seconds. Choose your preferred 2-hour window and view live mandi transparent rates.',
    descHi: '30 सेकंड में स्क्रैप सामग्री चुनें, समय चुनें और लाइव पारदर्शी दरें देखें।',
    icon: Smartphone,
    metric: '100% FREE DOORSTEP VISIT',
  },
  {
    num: '02',
    title: 'VERIFIED WEIGHING AT DOOR',
    titleHi: 'डिजिटल वजन व सत्यापन',
    desc: 'A govt-verified local collector arrives with a calibrated digital scale. Purity is checked and weight logged digitally.',
    descHi: 'प्रमाणित कबाड़ीवाला डिजिटल तराजू के साथ आता है। सही वजन और गुणवत्ता की डिजिटल जांच होती है।',
    icon: Scale,
    metric: 'BLUETOOTH TAMPER-PROOF SCALE',
  },
  {
    num: '03',
    title: 'INSTANT UPI PAYOUT & TRACEABILITY',
    titleHi: 'तुरंत UPI भुगतान और क्यूआर',
    desc: 'Receive immediate bank credit via UPI or cash with zero deductions. A cryptographic batch QR ensures zero landfill leakage.',
    descHi: 'बिना किसी कमीशन कटौती के सीधे बैंक खाते में तत्काल भुगतान पाएं। क्यूआर से लैंडफिल रिसाव रुकता है।',
    icon: QrCode,
    metric: 'SPOT CASH OR UPI CREDIT',
  },
];

/**
 * Standardized How It Works Section (Phase 3 Component)
 * - 3 steps with equal-height cards
 * - Connector lines drawn as decorative elements only (pointer-events-none)
 * - Consistent heading hierarchy
 * - Standardized <Container>
 */
export const HowItWorks: React.FC = () => {
  const { lang } = useLang();

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-[#050605] border-b border-[#1F221F] relative">
      <Container>
        {/* Section Heading */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-0.5 bg-[#A3E635]" />
            <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
              02 // THREE SIMPLE STEPS
            </span>
          </div>
          <h2
            data-qa-check="heading"
            className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight"
          >
            {lang === 'hi' ? 'यह कैसे काम करता है' : 'HOW IT WORKS'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#6A6E6A] font-body max-w-2xl">
            {lang === 'hi'
              ? 'बिना मोलभाव, पारदर्शी तौल और त्वरित भुगतान — घर बैठे 3 आसान चरणों में।'
              : 'Zero bargaining, certified weights, and immediate digital payments in 3 seamless steps.'}
          </p>
        </div>

        {/* 3 Equal-Height Cards Grid with Decorative Non-Disruptive Connectors */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch min-w-0">
          {/* Desktop Decorative Connector Line */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-[#A3E635]/30 to-transparent pointer-events-none z-0"
          />

          {STEPS.map((step) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.num}
                data-qa-check="card"
                className="relative z-10 p-6 sm:p-8 bg-[#141614] border border-[#1F221F] hover:border-[#A3E635]/60 transition-all rounded-sm corner-brackets flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Step number + Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-black text-[#A3E635] bg-[#A3E635]/10 border border-[#A3E635]/30 px-2.5 py-1 rounded-sm">
                      STEP {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-sm bg-[#050605] border border-[#1F221F] flex items-center justify-center text-[#A3E635] group-hover:border-[#A3E635] transition-colors">
                      <Icon icon={StepIcon} size={24} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3
                    data-qa-check="heading"
                    className="font-heading text-xl font-bold uppercase text-[#F5F5F5] group-hover:text-[#A3E635] transition-colors mb-3"
                  >
                    {lang === 'hi' ? step.titleHi : step.title}
                  </h3>

                  <p className="text-sm font-body text-[#C8C8C8] leading-relaxed">
                    {lang === 'hi' ? step.descHi : step.desc}
                  </p>
                </div>

                {/* Bottom Assurance Metric */}
                <div className="pt-6 mt-6 border-t border-[#1F221F] flex items-center gap-2 font-mono text-xs text-[#A3E635]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635]" />
                  <span className="font-bold text-[11px] tracking-wide">{step.metric}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;
