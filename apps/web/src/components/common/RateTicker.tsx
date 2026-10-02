import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { ratesService } from '../../services/ratesService';

export const RateTicker: React.FC = () => {
  const rates = ratesService.getAll();

  return (
    <div className="relative z-20 border-y border-[#1F221F] bg-[#050605] py-2.5 overflow-hidden select-none">
      <div className="flex items-center">
        {/* Fixed Title Tag */}
        <div className="shrink-0 bg-[#A3E635] text-[#0A0B0A] px-3.5 py-1 text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 z-10 shadow-[4px_0_12px_rgba(0,0,0,0.8)]">
          <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>MANDI LIVE RATES</span>
        </div>

        {/* Scrolling Ticker Track */}
        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="animate-marquee font-mono text-xs flex items-center">
            {[...rates, ...rates, ...rates].map((item: any, idx: number) => (
              <Link
                key={idx}
                to={`/rates?category=${item.category}`}
                className="inline-flex items-center gap-2 mx-5 text-[#C8C8C8] hover:text-[#A3E635] transition-colors cursor-pointer group"
              >
                <span className="text-sm">{item.icon}</span>
                <span className="font-bold text-[#F5F5F5] uppercase tracking-wide group-hover:text-[#A3E635]">
                  {item.name}
                </span>
                <span className="text-[#A3E635] font-black tracking-tight flex items-center">
                  ₹{item.rate}/KG
                  <ArrowUpRight className="w-3 h-3 text-[#A3E635] ml-0.5 inline opacity-70 group-hover:opacity-100" />
                </span>
                <span className="text-[#1F221F] font-bold mx-2">/</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
