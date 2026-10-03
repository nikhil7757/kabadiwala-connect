import React from 'react';
import { ShieldCheck, Factory, Users, CheckCircle2 } from 'lucide-react';
import { useLang } from '../hooks/useLang';
import { Container } from '../components/layout/Container';
import { Icon } from '../components/common/Icon';

export const About: React.FC = () => {
  const { lang } = useLang();

  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-12 sm:py-16">
      <Container className="max-w-5xl space-y-12 sm:space-y-16">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-0.5 bg-[#A3E635]" />
            <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
              SIH 2026 // PROBLEM STATEMENT SIH26229
            </span>
          </div>
          <h1
            data-qa-check="heading"
            className="font-display text-4xl sm:text-6xl lg:text-7xl text-[#F5F5F5] uppercase tracking-tight"
          >
            ABOUT KABADIWALA CONNECT
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#C8C8C8] font-body leading-relaxed max-w-3xl">
            "Bringing the Informal Collector into the Formal Recycling Chain." Built for the
            Ministry of Mines and the Jawaharlal Nehru Aluminium Research Development and Design
            Centre (JNARDDC).
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div data-qa-check="card" className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-3">
            <Icon icon={Users} size={32} className="text-[#A3E635]" />
            <h3 data-qa-check="heading" className="font-heading text-lg sm:text-xl uppercase font-bold text-[#F5F5F5]">
              DIGNITY FOR INFORMAL WORKERS
            </h3>
            <p className="text-xs font-mono text-[#6A6E6A] leading-relaxed">
              India has over 4 million informal waste pickers and kabadiwalas who recover 80% of
              urban recyclable materials. We provide digital ID passes and direct UPI bank transfers.
            </p>
          </div>

          <div data-qa-check="card" className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-3">
            <Icon icon={Factory} size={32} className="text-[#FFB020]" />
            <h3 data-qa-check="heading" className="font-heading text-lg sm:text-xl uppercase font-bold text-[#F5F5F5]">
              JNARDDC CIRCULAR ACCREDITATION
            </h3>
            <p className="text-xs font-mono text-[#6A6E6A] leading-relaxed">
              Secondary metallurgy requires clean, traceable non-ferrous and ferrous scrap. Our QR
              traceability engine guarantees purity before industrial smelting.
            </p>
          </div>

          <div data-qa-check="card" className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-3">
            <Icon icon={ShieldCheck} size={32} className="text-[#A3E635]" />
            <h3 data-qa-check="heading" className="font-heading text-lg sm:text-xl uppercase font-bold text-[#F5F5F5]">
              ZERO-LANDFILL LEAKAGE
            </h3>
            <p className="text-xs font-mono text-[#6A6E6A] leading-relaxed">
              Every kilogram is audited from citizen doorstep to certified mill ingot, complying with
              Swachh Bharat Mission Urban 2.0 and Extended Producer Responsibility (EPR).
            </p>
          </div>
        </div>

        {/* Government Brief Alignment Card */}
        <div
          data-qa-check="card"
          className="p-6 sm:p-8 bg-[#050605] border-2 border-[#1F221F] rounded-sm corner-brackets space-y-4 font-mono text-xs"
        >
          <div className="text-[#A3E635] font-bold text-sm">
            OFFICIAL SIH26229 SPECIFICATION TRACEABILITY
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#C8C8C8]">
            <div className="flex items-start gap-2">
              <Icon icon={CheckCircle2} size={16} className="text-[#A3E635] shrink-0 mt-0.5" />
              <span>Calibrated digital weighing scales with Bluetooth tamper-proof logging</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon icon={CheckCircle2} size={16} className="text-[#A3E635] shrink-0 mt-0.5" />
              <span>Direct-to-bank UPI instant payment architecture</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon icon={CheckCircle2} size={16} className="text-[#A3E635] shrink-0 mt-0.5" />
              <span>Cryptographic QR batch manifests for licensed recycling mills</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon icon={CheckCircle2} size={16} className="text-[#A3E635] shrink-0 mt-0.5" />
              <span>Full offline-first persistence with zero cloud vendor lock-in</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default About;