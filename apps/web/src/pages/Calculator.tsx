import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Leaf, Droplet, Trees } from 'lucide-react';
import { ratesService } from '../services/ratesService';
import { useLang } from '../hooks/useLang';
import { Container } from '../components/layout/Container';
import { Icon } from '../components/common/Icon';

export const Calculator: React.FC = () => {
  const { lang } = useLang();
  const allRates = ratesService.getAll();

  const [weights, setWeights] = useState<Record<string, number>>({
    '1': 15, // Paper
    '3': 8,  // PET
    '6': 3,  // Copper
    '7': 12, // Iron
  });

  const handleWeightChange = (id: string, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [id]: Math.max(0, val),
    }));
  };

  let totalCash = 0;
  let totalKg = 0;

  Object.entries(weights).forEach(([id, kg]) => {
    const item = allRates.find((r: any) => r.id === id);
    if (item && kg > 0) {
      totalCash += item.rate * kg;
      totalKg += kg;
    }
  });

  const co2OffsetKg = (totalKg * 1.8).toFixed(1);
  const treesEquivalent = (totalKg * 0.08).toFixed(1);
  const waterSavedLitres = Math.round(totalKg * 34);

  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-12 sm:py-16">
      <Container>
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-0.5 bg-[#A3E635]" />
            <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
              SMART ESTIMATION ENGINE // ZERO LOSS
            </span>
          </div>
          <h1
            data-qa-check="heading"
            className="font-display text-4xl sm:text-6xl lg:text-7xl text-[#F5F5F5] uppercase tracking-tight"
          >
            {lang === 'hi' ? 'स्क्रैप वैल्यू कैलकुलेटर' : 'SCRAP VALUE CALCULATOR'}
          </h1>
          <p className="mt-2 text-[#6A6E6A] font-body text-sm sm:text-base max-w-2xl">
            {lang === 'hi'
              ? 'अनुमानित वजन चुनें और तुरंत अपनी कमाई और पर्यावरण प्रभाव की गणना करें।'
              : 'Estimate your exact doorstep payout and environmental carbon offset in real-time.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-w-0">
          {/* Left Column: Material Weight Inputs */}
          <div className="lg:col-span-7 space-y-4 min-w-0">
            <div className="p-4 bg-[#141614] border border-[#1F221F] rounded-sm font-mono text-xs text-[#A3E635] flex items-center justify-between">
              <span>SELECT SCRAP WEIGHT (KG / UNITS):</span>
              <span>15 COMMODITIES</span>
            </div>

            <div className="space-y-3">
              {allRates.map((item: any) => {
                const currentWeight = weights[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    data-qa-check="card"
                    className={`p-4 bg-[#141614] border rounded-sm transition-all corner-brackets flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 ${
                      currentWeight > 0 ? 'border-[#A3E635]/60' : 'border-[#1F221F]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <span className="text-2xl shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <h4 className="font-heading text-base font-bold text-[#F5F5F5] uppercase truncate">
                          {item.name}
                        </h4>
                        <span className="text-xs font-mono text-[#A3E635]">
                          ₹{item.rate}/kg
                        </span>
                      </div>
                    </div>

                    {/* Weight Input Counter with accessible min 44px tap targets */}
                    <div className="flex items-center gap-2 font-mono">
                      <button
                        type="button"
                        onClick={() => handleWeightChange(item.id, currentWeight - 1)}
                        data-qa-check="button"
                        aria-label={`Decrease ${item.name}`}
                        className="w-11 h-11 rounded-sm bg-[#050605] border border-[#1F221F] hover:border-[#A3E635] text-[#F5F5F5] font-bold flex items-center justify-center text-lg min-h-[44px] min-w-[44px]"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={currentWeight === 0 ? '' : currentWeight}
                        placeholder="0"
                        onChange={(e) =>
                          handleWeightChange(item.id, parseFloat(e.target.value) || 0)
                        }
                        className="w-16 min-h-[44px] bg-[#050605] border border-[#1F221F] text-center text-[#F5F5F5] font-bold py-1 px-2 text-sm outline-none focus:border-[#A3E635]"
                      />
                      <button
                        type="button"
                        onClick={() => handleWeightChange(item.id, currentWeight + 1)}
                        data-qa-check="button"
                        aria-label={`Increase ${item.name}`}
                        className="w-11 h-11 rounded-sm bg-[#050605] border border-[#1F221F] hover:border-[#A3E635] text-[#F5F5F5] font-bold flex items-center justify-center text-lg min-h-[44px] min-w-[44px]"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-24 text-right font-mono shrink-0">
                      <span className="text-base font-bold text-[#FFB020]">
                        ₹{item.rate * currentWeight}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Payout Summary with Safe Sticky Offset */}
          <div className="lg:col-span-5 lg:sticky lg:top-[calc(var(--header-h,72px)+16px)] space-y-6 min-w-0">
            <div
              data-qa-check="card"
              className="p-6 sm:p-8 bg-[#141614] border-2 border-[#A3E635] rounded-sm corner-brackets shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#1F221F]">
                <span className="font-mono text-xs text-[#6A6E6A] uppercase font-bold">
                  ESTIMATED TOTAL VALUATION
                </span>
                <span
                  data-qa-check="badge"
                  className="px-2.5 py-0.5 bg-[#A3E635]/10 text-[#A3E635] font-mono text-[11px] font-bold rounded-sm border border-[#A3E635]/30"
                >
                  100% TO CITIZEN
                </span>
              </div>

              <div>
                <div
                  data-qa-check="heading"
                  className="font-display text-5xl sm:text-6xl font-black text-[#A3E635] tracking-tight truncate"
                >
                  ₹{totalCash.toLocaleString()}
                </div>
                <div className="text-xs font-mono text-[#6A6E6A] mt-1">
                  TOTAL ESTIMATED WEIGHT: {totalKg} KG
                </div>
              </div>

              {/* Ecological Offset Metrics */}
              <div className="p-4 bg-[#0A0B0A] border border-[#1F221F] rounded-sm space-y-3 font-mono text-xs">
                <span className="text-[#A3E635] font-bold block mb-1 uppercase">
                  🌿 ZERO-LANDFILL IMPACT METRICS:
                </span>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#C8C8C8]">
                    <Icon icon={Leaf} size={14} className="text-[#A3E635]" />
                    CO₂ Avoided:
                  </span>
                  <span className="font-bold text-[#F5F5F5]">{co2OffsetKg} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#C8C8C8]">
                    <Icon icon={Trees} size={14} className="text-[#A3E635]" />
                    Trees Preserved:
                  </span>
                  <span className="font-bold text-[#F5F5F5]">{treesEquivalent} trees</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#C8C8C8]">
                    <Icon icon={Droplet} size={14} className="text-[#A3E635]" />
                    Water Conserved:
                  </span>
                  <span className="font-bold text-[#F5F5F5]">{waterSavedLitres} L</span>
                </div>
              </div>

              {/* Booking CTA */}
              <Link
                to="/book"
                data-qa-check="button"
                className="w-full min-h-[52px] py-4 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-lg font-bold uppercase tracking-wider rounded-sm glow-lime flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>BOOK PICKUP FOR ₹{totalCash}</span>
                <Icon icon={ArrowRight} size={18} />
              </Link>

              <div className="text-center font-mono text-[11px] text-[#6A6E6A]">
                ✓ ZERO BARGAINING · SCALE WEIGHED AT DOORSTEP · CASH/UPI
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Calculator;