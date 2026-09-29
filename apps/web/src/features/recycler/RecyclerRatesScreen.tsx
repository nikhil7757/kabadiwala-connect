import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { TrendingUp, Save, CheckCircle2, ArrowLeft } from 'lucide-react';

export const RecyclerRatesScreen: React.FC = () => {
  const navigate = useNavigate();

  const [rates, setRates] = useState([
    { code: 'CABLE', name: 'Cables & Wires', rate: '185.00', unit: 'KG', updated: 'Today' },
    { code: 'PCB', name: 'Circuit Boards', rate: '340.00', unit: 'KG', updated: 'Today' },
    { code: 'BATTERY', name: 'Lead Acid Batteries', rate: '72.00', unit: 'KG', updated: 'Yesterday' },
    { code: 'CRT', name: 'Old CRT Monitors', rate: '12.00', unit: 'KG', updated: '3d ago' },
    { code: 'LCD', name: 'Flat Screens & LCDs', rate: '38.00', unit: 'KG', updated: 'Today' },
    { code: 'MOTOR', name: 'Copper Motors', rate: '92.00', unit: 'KG', updated: 'Today' },
    { code: 'PLASTIC', name: 'Rigid Plastics', rate: '16.00', unit: 'KG', updated: '4d ago' },
    { code: 'OTHER', name: 'Mixed Electronics', rate: '26.00', unit: 'KG', updated: 'Today' },
  ]);

  const [saved, setSaved] = useState(false);

  const handleRateChange = (idx: number, newVal: string) => {
    setRates((prev) => {
      const copy = [...prev];
      copy[idx].rate = newVal;
      return copy;
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-mono flex flex-col p-6">
      <header className="max-w-4xl mx-auto w-full mb-6 flex items-center justify-between border-b border-[#2A2A2A] pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/recycler')}
            className="w-8 h-8 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#9A9A9A] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-white">
              FACILITY OFFERED BUYING RATES
            </h1>
            <p className="text-xs text-[#9A9A9A]">
              Rates published here directly update local price discovery and matching algorithm.
            </p>
          </div>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-kc-success font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>RATES PUBLISHED TO NETWORK</span>
          </span>
        )}
      </header>

      <main className="max-w-4xl mx-auto w-full flex-1">
        <div className="border border-[#2A2A2A] bg-[#141414] rounded-xs overflow-hidden shadow-xl mb-6">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#2A2A2A] bg-[#1A1A1A] text-[#9A9A9A]">
              <tr>
                <th className="py-3 px-4">CODE</th>
                <th className="py-3 px-4">MATERIAL DESCRIPTION</th>
                <th className="py-3 px-4">OFFERED RATE (₹)</th>
                <th className="py-3 px-4">UNIT</th>
                <th className="py-3 px-4">FRESHNESS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {rates.map((item, idx) => (
                <tr key={item.code} className="hover:bg-[#1A1A1A]">
                  <td className="py-3 px-4 font-bold text-kc-accent">{item.code}</td>
                  <td className="py-3 px-4 text-white font-bold">{item.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 max-w-[140px]">
                      <span className="text-[#9A9A9A]">₹</span>
                      <input
                        type="text"
                        value={item.rate}
                        onChange={(e) => handleRateChange(idx, e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-[#2A2A2A] px-2 py-1 text-sm font-bold text-white focus:border-kc-accent focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#9A9A9A]">{item.unit}</td>
                  <td className="py-3 px-4 text-[11px] text-[#9A9A9A]">{item.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full h-12 bg-kc-accent text-black font-bold uppercase tracking-wider text-sm rounded-xs flex items-center justify-center gap-2 hover:bg-[#FF7A33]"
        >
          <Save className="w-4 h-4" />
          <span>Save & Broadcast Rates to Collectors</span>
        </button>
      </main>
    </div>
  );
};
