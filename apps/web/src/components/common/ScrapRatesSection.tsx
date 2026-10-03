import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles, TrendingUp } from 'lucide-react';
import { ratesService } from '../../services/ratesService';
import { useLang } from '../../hooks/useLang';
import { Container } from '../layout/Container';
import { Icon } from './Icon';

/**
 * Standardized Scrap Rates Section (Phase 3 Component)
 * - Responsive table on desktop/tablet, stacked cards on mobile
 * - Category filter chips that wrap with min 44px tap targets
 * - Consistent heading hierarchy
 * - Standardized <Container>
 */
export const ScrapRatesSection: React.FC = () => {
  const { lang } = useLang();
  const [selectedCat, setSelectedCat] = useState('all');
  const allRates = ratesService.getAll();

  const categories = ['all', 'metal', 'plastic', 'paper', 'e-waste', 'glass'];

  const filtered = allRates.filter((item: any) => {
    return selectedCat === 'all' || item.category === selectedCat;
  });

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-[#0A0B0A] border-b border-[#1F221F]">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-0.5 bg-[#A3E635]" />
              <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
                03 // TRANSPARENT MARKET VALUE
              </span>
            </div>
            <h2
              data-qa-check="heading"
              className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight"
            >
              {lang === 'hi' ? 'लाइव स्क्रैप मंडी दरें' : 'LIVE SCRAP MANDI RATES'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#6A6E6A] font-body max-w-xl">
              {lang === 'hi'
                ? 'सरकारी मानकों और राष्ट्रीय धातु मंडियों के अनुसार प्रमाणित दैनिक दरें।'
                : 'Government-indexed daily rates across 15 commodities. Calibrated scales, zero deductions.'}
            </p>
          </div>

          <Link
            to="/rates"
            data-qa-check="button"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase text-[#A3E635] hover:text-[#bbf451] transition min-h-[44px]"
          >
            <span>{lang === 'hi' ? 'सभी 15 श्रेणियां देखें' : 'VIEW ALL COMMODITIES'}</span>
            <Icon icon={ArrowRight} size={16} />
          </Link>
        </div>

        {/* Category Filter Chips: Wrapping with min 44px tap targets */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => {
            const isSelected = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                data-qa-check="button"
                className={`min-h-[44px] px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider rounded-sm border transition-all flex items-center justify-center ${
                  isSelected
                    ? 'bg-[#A3E635] text-[#0A0B0A] border-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.25)]'
                    : 'bg-[#141614] text-[#C8C8C8] border-[#1F221F] hover:border-[#6A6E6A]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 1. Desktop & Tablet View: Structured Responsive Table (hidden on small mobile) */}
        <div className="hidden sm:block overflow-x-auto bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1F221F] bg-[#050605] text-[#6A6E6A] uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">MATERIAL</th>
                <th className="py-4 px-6 font-bold">CATEGORY</th>
                <th className="py-4 px-6 font-bold text-right">BENCHMARK RATE</th>
                <th className="py-4 px-6 font-bold text-right">MARKET TREND</th>
                <th className="py-4 px-6 font-bold text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F221F]">
              {filtered.map((item: any) => (
                <tr
                  key={item.id}
                  data-qa-check="card"
                  className="hover:bg-[#1B1E1B] transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-1.5 bg-[#050605] border border-[#1F221F] rounded-sm shrink-0">
                        {item.icon}
                      </span>
                      <span className="font-heading text-base font-bold text-[#F5F5F5] uppercase">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#6A6E6A] uppercase">{item.category}</td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-xl font-bold font-display text-[#A3E635]">
                      ₹{item.rate}
                    </span>
                    <span className="text-[#6A6E6A] ml-1">/ KG</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="inline-flex items-center gap-1 text-[#A3E635] font-bold">
                      <Icon icon={ArrowUpRight} size={14} />
                      <span>LIVE</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Link
                      to={`/book?category=${item.category}`}
                      data-qa-check="button"
                      className="inline-flex items-center justify-center min-h-[44px] px-4 py-1.5 bg-[#050605] hover:bg-[#A3E635] text-[#F5F5F5] hover:text-[#0A0B0A] border border-[#1F221F] hover:border-[#A3E635] rounded-sm transition font-bold uppercase"
                    >
                      SELL NOW
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. Mobile View: Responsive Cards (< 640px) */}
        <div className="sm:hidden grid grid-cols-1 gap-4">
          {filtered.map((item: any) => (
            <div
              key={item.id}
              data-qa-check="card"
              className="p-5 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl p-2 bg-[#050605] border border-[#1F221F] rounded-sm shrink-0">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-base font-bold text-[#F5F5F5] uppercase truncate">
                    {item.name}
                  </h3>
                  <span className="text-[11px] font-mono text-[#6A6E6A] uppercase block">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-display text-2xl font-black text-[#A3E635]">
                  ₹{item.rate}
                  <span className="text-xs text-[#6A6E6A] font-normal"> /kg</span>
                </div>
                <Link
                  to={`/book?category=${item.category}`}
                  data-qa-check="button"
                  className="mt-1 inline-flex items-center justify-center min-h-[44px] px-3 text-xs font-mono font-bold text-[#A3E635] underline"
                >
                  SELL →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Payout Calculator Estimator Banner */}
        <div className="mt-8 text-center">
          <Link
            to="/calculator"
            data-qa-check="button"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 bg-[#141614] border border-[#1F221F] hover:border-[#A3E635] rounded-sm text-xs font-mono font-bold uppercase text-[#F5F5F5] hover:bg-[#1B1E1B] transition"
          >
            <Icon icon={Sparkles} size={16} className="text-[#A3E635]" />
            <span>ESTIMATE YOUR HOUSEHOLD SCRAP PAYOUT IN 30 SECONDS →</span>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default ScrapRatesSection;
