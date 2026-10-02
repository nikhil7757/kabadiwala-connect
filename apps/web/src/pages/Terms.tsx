import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <div className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold mb-2">
            LEGAL PROTOCOL // FAIR TRADE RECYCLING
          </div>
          <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-tight">
            TERMS OF SERVICE & ZERO-CUT GUARANTEE
          </h1>
          <p className="text-xs font-mono text-[#6A6E6A] mt-1">LAST REVISED: OCTOBER 2026 // SIH26229</p>
        </div>

        <div className="p-8 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-6 font-mono text-xs text-[#C8C8C8] leading-relaxed">
          <div>
            <h3 className="text-sm font-bold text-[#A3E635] uppercase mb-2">1. 0% COMMISSION RULE ON INFORMAL COLLECTORS</h3>
            <p>
              Kabadiwala Connect operates under a strict zero-cut charter for informal kabadiwalas. 100% of the scrap material value weighed at the doorstep is paid directly to the citizen and the collector without platform deductions.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#A3E635] uppercase mb-2">2. CALIBRATED DIGITAL SCALE ACCURACY</h3>
            <p>
              All authorized collectors agree to carry certified, calibrated digital scales. Discrepancies exceeding ±0.1 kg are subject to instant audit and municipal grievance resolution.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#A3E635] uppercase mb-2">3. RECYCLABLE PURITY AND PROHIBITED MATERIALS</h3>
            <p>
              Hazardous unneutralized industrial chemicals, radioactive medical waste, and explosive ordnance are strictly prohibited from collection. Non-ferrous and ferrous materials must comply with national sorting specifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Terms;