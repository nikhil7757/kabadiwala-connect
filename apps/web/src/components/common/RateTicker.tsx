import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { ratesService } from '../../services/ratesService';
import { Icon } from './Icon';

/**
 * Standardized RateTicker Marquee (Phase 2 & 3 Component)
 * - Flexible layout without fixed px clashing
 * - Seamless marquee animation
 * - Marked with [data-qa-check="card"]
 */
export const RateTicker: React.FC = () => {
  const rates = ratesService.getAll();

  return (
    <div className="relative z-[20] border-y border-[#1F221F] bg-[#050605] py-2 overflow-hidden select-none">
      <div className="flex items-center min-w-0">
        {/* Responsive Title Tag */}
        <div className="shrink-0 bg-[#A3E635] text-[#0A0B0A] px-2.5 sm:px-3.5 py-1.5 text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 z-10 shadow-md">
          <Icon icon={TrendingUp} size={14} className="stroke-[2.5]" />
          <span className="hidden sm:inline">MANDI LIVE RATES</span>
          <span className="sm:hidden">RATES</span>
        </div>

        {/* Scrolling Ticker Track */}
        <div className="overflow-hidden whitespace-nowrap flex-1 min-w-0">
          <div className="animate-marquee font-mono text-xs flex items-center">
            {[...rates, ...rates, ...rates].map((item: any, idx: number) => (
              <Link
                key={idx}
                to={`/rates?category=${item.category}`}
                className="inline-flex items-center gap-2 mx-4 text-[#C8C8C8] hover:text-[#A3E635] transition-colors cursor-pointer group"
              >
                <span className="text-sm shrink-0">{item.icon}</span>
                <span className="font-bold text-[#F5F5F5] uppercase tracking-wide group-hover:text-[#A3E635] truncate max-w-[120px]">
                  {item.name}
                </span>
                <span className="text-[#A3E635] font-black tracking-tight inline-flex items-center shrink-0">
                  ₹{item.rate}/KG
                  <Icon icon={ArrowUpRight} size={12} className="text-[#A3E635] ml-0.5" />
                </span>
                <span className="text-[#1F221F] font-bold mx-1.5">/</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateTicker;
