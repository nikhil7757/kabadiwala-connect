import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TopBar } from '../../components/common/TopBar.js';
import { SpeakerButton } from '../../components/common/SpeakerButton.js';
import { Sparkline } from '../../components/common/Sparkline.js';
import { db, PriceItem } from '../../db/index.js';

interface CategoryPriceRow {
  code: string;
  name: string;
  buyingPrice: string;
  unit: string;
  trend: 'UP' | 'DOWN' | 'FLAT';
  marketMin: string;
  marketMax: string;
  updatedAt: string;
  history: number[];
}

export const PriceBoardScreen: React.FC = () => {
  const { t } = useTranslation();
  const [district, setDistrict] = useState('Pune');
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  // Seeded sample category prices for demonstration
  const [prices, setPrices] = useState<CategoryPriceRow[]>([
    {
      code: 'CABLE',
      name: 'Cables & Wires (केबल और तार)',
      buyingPrice: '180.00',
      unit: 'KG',
      trend: 'UP',
      marketMin: '165.00',
      marketMax: '200.00',
      updatedAt: 'Today',
      history: [165, 168, 170, 172, 175, 178, 180],
    },
    {
      code: 'PCB',
      name: 'Circuit Boards (सर्किट बोर्ड)',
      buyingPrice: '320.00',
      unit: 'KG',
      trend: 'UP',
      marketMin: '300.00',
      marketMax: '350.00',
      updatedAt: 'Today',
      history: [290, 295, 305, 310, 315, 318, 320],
    },
    {
      code: 'BATTERY',
      name: 'Batteries (बैटरी)',
      buyingPrice: '70.00',
      unit: 'KG',
      trend: 'FLAT',
      marketMin: '65.00',
      marketMax: '75.00',
      updatedAt: 'Today',
      history: [71, 70, 69, 70, 71, 70, 70],
    },
    {
      code: 'CRT',
      name: 'Old TV / CRT (पुराना टीवी)',
      buyingPrice: '12.00',
      unit: 'KG',
      trend: 'DOWN',
      marketMin: '10.00',
      marketMax: '15.00',
      updatedAt: 'Today',
      history: [15, 14, 14, 13, 13, 12, 12],
    },
    {
      code: 'LCD',
      name: 'Flat Screen / LCD (फ्लैट स्क्रीन)',
      buyingPrice: '35.00',
      unit: 'KG',
      trend: 'UP',
      marketMin: '30.00',
      marketMax: '40.00',
      updatedAt: 'Today',
      history: [32, 32, 33, 34, 34, 35, 35],
    },
    {
      code: 'MOTOR',
      name: 'Motors & Magnets (मोटर और चुंबक)',
      buyingPrice: '90.00',
      unit: 'KG',
      trend: 'FLAT',
      marketMin: '85.00',
      marketMax: '95.00',
      updatedAt: 'Today',
      history: [90, 89, 90, 91, 90, 89, 90],
    },
    {
      code: 'PLASTIC',
      name: 'Plastic Casing (प्लास्टिक केसिंग)',
      buyingPrice: '15.00',
      unit: 'KG',
      trend: 'FLAT',
      marketMin: '12.00',
      marketMax: '18.00',
      updatedAt: 'Today',
      history: [15, 15, 14, 15, 15, 16, 15],
    },
    {
      code: 'OTHER',
      name: 'Other E-waste (अन्य ई-कचरा)',
      buyingPrice: '25.00',
      unit: 'KG',
      trend: 'FLAT',
      marketMin: '20.00',
      marketMax: '30.00',
      updatedAt: 'Today',
      history: [24, 25, 25, 24, 26, 25, 25],
    },
  ]);

  const toggleExpand = (code: string) => {
    setExpandedCode((prev) => (prev === code ? null : code));
  };

  const districts = ['Pune', 'Thane', 'Nagpur', 'Nashik'];

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-12">
      <TopBar title={t('home_prices')} />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-4">
        {/* District Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {districts.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDistrict(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all whitespace-nowrap active:scale-95 ${
                district === d
                  ? 'bg-kc-accent text-kc-accent-ink shadow-[2px_2px_0px_#141414]'
                  : 'bg-kc-surface border border-kc-border text-kc-ink'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Sample Data Caption */}
        <div className="flex items-center justify-between text-xs text-kc-ink-dim px-1 font-mono">
          <span>RATES FOR {district.toUpperCase()} DISTRICT</span>
          <span className="px-1.5 py-0.5 rounded bg-kc-warn-soft text-kc-warn border border-kc-warn/30 font-bold text-[10px]">
            SAMPLE DATA
          </span>
        </div>

        {/* Price Rows List */}
        <div className="flex flex-col gap-2.5">
          {prices.map((p) => {
            const isExpanded = expandedCode === p.code;

            return (
              <div
                key={p.code}
                onClick={() => toggleExpand(p.code)}
                className="p-3.5 rounded-xs border-2 border-kc-border-strong bg-kc-surface shadow-[2px_2px_0px_#141414] cursor-pointer select-none transition-transform active:translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <SpeakerButton
                      audioKey={`mat_${p.code.toLowerCase()}`}
                      fallbackText={`${p.name} rate is ${p.buyingPrice} rupees per kilogram`}
                      size="sm"
                    />
                    <div>
                      <h3 className="text-base font-bold text-kc-ink leading-tight">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs font-mono text-kc-ink-dim">
                        <span>Range: ₹{p.marketMin} - ₹{p.marketMax}</span>
                        {p.trend === 'UP' && (
                          <span className="flex items-center text-kc-success font-bold text-[11px]">
                            <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                            <span>UP</span>
                          </span>
                        )}
                        {p.trend === 'DOWN' && (
                          <span className="flex items-center text-kc-danger font-bold text-[11px]">
                            <ArrowDownRight className="w-3.5 h-3.5 stroke-[3]" />
                            <span>DOWN</span>
                          </span>
                        )}
                        {p.trend === 'FLAT' && (
                          <span className="flex items-center text-kc-ink-dim font-bold text-[11px]">
                            <Minus className="w-3 h-3 stroke-[3]" />
                            <span>STABLE</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-xl font-mono font-black text-kc-accent">
                        ₹{p.buyingPrice}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-kc-ink-dim block">
                        /{p.unit}
                      </span>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-kc-ink-dim" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-kc-ink-dim" />
                    )}
                  </div>
                </div>

                {/* Expanded 30-Day Trend Sparkline */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-kc-border flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="font-bold text-kc-ink-dim uppercase block text-[10px]">
                        7-DAY PRICE MOVEMENT
                      </span>
                      <span className="text-xs text-kc-ink">
                        Low: ₹{Math.min(...p.history)} • High: ₹{Math.max(...p.history)}
                      </span>
                    </div>

                    <Sparkline data={p.history} width={120} height={28} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
