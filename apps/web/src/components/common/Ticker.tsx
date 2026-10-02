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
      className={`w-full overflow-hidden bg-kc-surface/40 backdrop-blur-sm border-b border-kc-border py-2 px-2 select-none shadow-sm ${className}`}
      aria-label="Live price ticker"
    >
      <div
        className={`flex items-center gap-6 whitespace-nowrap text-xs font-mono font-bold ${
          !reduced ? 'animate-marquee hover:[animation-play-state:paused]' : 'overflow-x-auto'
        }`}
      >
        {items.concat(!reduced ? items : []).map((item, idx) => (
          <div key={`${item.code}-${idx}`} className="inline-flex items-center gap-2 kc-glass px-3 py-1 rounded-full border-kc-border/50">
            <span className="text-kc-ink-dim uppercase text-[10px] tracking-wider">{item.code}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-kc-ink to-kc-ink-dim font-bold">₹{item.rate}/kg</span>
            {item.trend === 'UP' ? (
              <div className="w-4 h-4 rounded-full bg-kc-success/20 flex items-center justify-center">
                <ArrowUpRight className="w-3 h-3 text-kc-success stroke-[3]" />
              </div>
            ) : item.trend === 'DOWN' ? (
              <div className="w-4 h-4 rounded-full bg-kc-danger/20 flex items-center justify-center">
                <ArrowDownRight className="w-3 h-3 text-kc-danger stroke-[3]" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full bg-kc-surface-2 flex items-center justify-center">
                <Minus className="w-2.5 h-2.5 text-kc-ink-dim stroke-[3]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
