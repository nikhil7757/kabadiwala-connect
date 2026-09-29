import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { isReducedMotion } from '../../lib/motion.js';

export interface TickerItem {
  code: string;
  name: string;
  rate: string;
  trend: 'UP' | 'DOWN' | 'FLAT';
}

interface TickerProps {
  items: TickerItem[];
  className?: string;
}

export const Ticker: React.FC<TickerProps> = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null;

  const reduced = isReducedMotion();

  return (
    <div
      className={`w-full overflow-hidden bg-kc-surface-2 border-b border-kc-border py-1.5 px-2 select-none ${className}`}
      aria-label="Live price ticker"
    >
      <div
        className={`flex items-center gap-6 whitespace-nowrap text-xs font-mono font-bold ${
          !reduced ? 'animate-marquee hover:[animation-play-state:paused]' : 'overflow-x-auto'
        }`}
      >
        {items.concat(!reduced ? items : []).map((item, idx) => (
          <div key={`${item.code}-${idx}`} className="inline-flex items-center gap-1.5">
            <span className="text-kc-ink-dim uppercase">{item.code}:</span>
            <span className="text-kc-ink font-bold">₹{item.rate}/kg</span>
            {item.trend === 'UP' ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-kc-success stroke-[3]" />
            ) : item.trend === 'DOWN' ? (
              <ArrowDownRight className="w-3.5 h-3.5 text-kc-danger stroke-[3]" />
            ) : (
              <Minus className="w-3 h-3 text-kc-ink-dim stroke-[2.5]" />
            )}
            <span className="text-kc-border-strong mx-1">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
