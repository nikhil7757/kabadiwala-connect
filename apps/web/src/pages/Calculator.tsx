import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator as CalcIcon, Sparkles, ArrowRight, Leaf, Droplet, Trees } from 'lucide-react';
import { ratesService } from '../services/ratesService';
import { useLang } from '../hooks/useLang';

export const Calculator: React.FC = () => {
  const { lang } = useLang();
  const allRates = ratesService.getAll();

  // Multi-item weight selection
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

  // Calculations
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
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-0.5 bg-[#A3E635]" />
            <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
              SMART ESTIMATION ENGINE // ZERO LOSS
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-[#F5F5F5] uppercase tracking-tight">
            {lang === 'hi' ? 'स्क्रैप वैल्यू कैलकुलेटर' : 'SCRAP VALUE CALCULATOR'}
          </h1>
          <p className="mt-2 text-[#6A6E6A] font-body text-sm sm:text-base max-w-2xl">
            {lang === 'hi'
              ? 'अनुमानित वजन चुनें और तुरंत अपनी कमाई और पर्यावरण प्रभाव की गणना करें।'
              : 'Estimate your exact doorstep payout and environmental carbon offset in real-time.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Material Weight Inputs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 bg-[#141614] border border-[#1F221F] rounded-sm font-mono text-xs text-[#A3E635] flex items-center justify-between">
              <span>SELECT SCRAP WEIGHT (KG / UNITS):</span>
              <span>15 MATERIALS INDEXED</span>
            </div>

            <div className="space-y-3">
              {allRates.map((item: any) => {
                const currentWeight = weights[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className={`p-4 bg-[#141614] border rounded-sm transition-all corner-brackets flex items-center justify-between gap-4 ${
                      currentWeight > 0 ? 'border-[#A3E635]/60' : 'border-[#1F221F]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className="font-heading text-base font-bold text-[#F5F5F5] uppercase">
                          {item.name}
                        </h4>
                        <span className="text-xs font-mono text-[#A3E635]">
                          ₹{item.rate}/kg
                        </span>
                      </div>
                    </div>

                    {/* Weight Input Counter */}
                    <div className="flex items-center gap-3 font-mono">
                      <button
                        onClick={() => handleWeightChange(item.id, currentWeight - 1)}
                        className="w-8 h-8 rounded-sm bg-[#050605] border border-[#1F221F] hover:border-[#A3E635] text-[#F5F5F5] font-bold flex items-center justify-center"
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
                        className="w-16 bg-[#050605] border border-[#1F221F] text-center text-[#F5F5F5] font-bold py-1 px-2 text-sm outline-none focus:border-[#A3E635]"
                      />
                      <button
                        onClick={() => handleWeightChange(item.id, currentWeight + 1)}
                        className="w-8 h-8 rounded-sm bg-[#050605] border border-[#1F221F] hover:border-[#A3E635] text-[#F5F5F5] font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-24 text-right font-mono">
                      <span className="text-sm font-bold text-[#FFB020]">
                        ₹{item.rate * currentWeight}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Payout Summary & Ecological Offset Card */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="p-8 bg-[#141614] border-2 border-[#A3E635] rounded-sm corner-brackets shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#1F221F]">
                <span className="font-mono text-xs text-[#6A6E6A] uppercase font-bold">
                  ESTIMATED TOTAL VALUATION
                </span>
                <span className="px-2.5 py-0.5 bg-[#A3E635]/10 text-[#A3E635] font-mono text-[11px] font-bold rounded-sm">
                  100% TO CITIZEN
                </span>
              </div>

              {/* Huge Cash Display */}
              <div>
                <div className="font-display text-6xl sm:text-7xl font-black text-[#A3E635] tracking-tight">
                  ₹{totalCash.toLocaleString()}
                </div>
                <div className="text-xs font-mono text-[#6A6E6A] mt-1">
                  TOTAL ESTIMATED WEIGHT: {totalKg} KG
                </div>
              </div>

              {/* Environmental Metrics Strip */}
              <div className="p-4 bg-[#0A0B0A] border border-[#1F221F] rounded-sm space-y-3 font-mono text-xs">
                <span className="text-[#A3E635] font-bold block mb-1 uppercase">
                  🌿 ZERO-LANDFILL IMPACT METRICS:
                </span>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#C8C8C8]">
                    <Leaf className="w-4 h-4 text-[#A3E635]" />
                    CO₂ Avoided:
                  </span>
                  <span className="font-bold text-[#F5F5F5]">{co2OffsetKg} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#C8C8C8]">
                    <Trees className="w-4 h-4 text-[#A3E635]" />
                    Equivalent Trees Preserved:
                  </span>
                  <span className="font-bold text-[#F5F5F5]">{treesEquivalent} trees</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[#C8C8C8]">
                    <Droplet className="w-4 h-4 text-[#A3E635]" />
                    Industrial Water Conserved:
                  </span>
                  <span className="font-bold text-[#F5F5F5]">{waterSavedLitres} L</span>
                </div>
              </div>

              {/* Book Pickup Trigger */}
              <Link
                to="/book"
                className="w-full py-4 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-xl font-bold uppercase tracking-wider rounded-sm glow-lime flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>BOOK PICKUP FOR ₹{totalCash}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="text-center font-mono text-[11px] text-[#6A6E6A]">
                ✓ NO BARGAINING · SCALE WEIGHED AT DOORSTEP · CASH/UPI
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Calculator;