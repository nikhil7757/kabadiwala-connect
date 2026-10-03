import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Star, MapPin, ArrowRight, RotateCw, QrCode } from 'lucide-react';
import { useLang } from '../../hooks/useLang';
import { Icon } from './Icon';

interface CollectorProps {
  collector: {
    id: string;
    name: string;
    phone: string;
    city: string;
    rating: number;
    categories: string[];
    slots: string[];
  };
}

/**
 * Standardized Collector Card (Phase 2 & 3 Component)
 * - Equal height in flex/grid stretch
 * - No clipping or fixed-height overflow
 * - Digital ID reveal toggle
 * - Marked with [data-qa-check="card"]
 */
export const CollectorFlipCard: React.FC<CollectorProps> = ({ collector }) => {
  const [showId, setShowId] = useState(false);
  const navigate = useNavigate();
  const { lang } = useLang();

  const initials = collector.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div
      data-qa-check="card"
      className="bg-[#141614] border border-[#1F221F] hover:border-[#A3E635]/60 transition-all rounded-sm corner-brackets p-6 flex flex-col justify-between min-h-[380px] w-full min-w-0"
    >
      {!showId ? (
        <>
          {/* Top Bar: Verification Badge & City */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span
                data-qa-check="badge"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider rounded-sm shrink-0"
              >
                <Icon icon={ShieldCheck} size={14} />
                <span>GOVT VERIFIED</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono text-[#6A6E6A] truncate">
                <Icon icon={MapPin} size={12} className="text-[#A3E635]" />
                <span className="truncate">{collector.city}</span>
              </span>
            </div>

            {/* Avatar & Collector Name */}
            <div className="flex items-center gap-3.5 mb-4">
              <div
                data-qa-check="avatar"
                className="w-14 h-14 rounded-sm bg-[#050605] border-2 border-[#1F221F] flex items-center justify-center font-display text-xl text-[#A3E635] font-bold shrink-0 aspect-square"
              >
                {initials}
              </div>
              <div className="min-w-0">
                <h3
                  data-qa-check="heading"
                  className="font-heading text-lg sm:text-xl font-bold text-[#F5F5F5] uppercase tracking-wide truncate"
                >
                  {collector.name}
                </h3>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-[#FFB020] font-mono font-bold">
                  <Icon icon={Star} size={14} className="fill-[#FFB020] text-[#FFB020]" />
                  <span>{collector.rating.toFixed(1)} / 5.0</span>
                  <span className="text-[#6A6E6A] font-normal text-[11px]">(184)</span>
                </div>
              </div>
            </div>

            {/* Verified Category Tags */}
            <div className="space-y-1.5 mt-3">
              <span className="text-[10px] font-mono text-[#6A6E6A] uppercase tracking-wider block">
                SPECIALTIES:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {collector.categories.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 bg-[#050605] border border-[#1F221F] text-[#C8C8C8] text-[10px] font-mono uppercase rounded-sm"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 mt-4 border-t border-[#1F221F] space-y-2">
            <button
              type="button"
              onClick={() => setShowId(true)}
              data-qa-check="button"
              className="w-full min-h-[44px] text-xs font-mono text-[#A3E635] hover:text-[#bbf451] flex items-center justify-center gap-1.5"
            >
              <Icon icon={RotateCw} size={14} />
              <span>VIEW DIGITAL GOVT ID</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/book?collector=${collector.id}`)}
              data-qa-check="button"
              className="w-full min-h-[44px] bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-sm font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <span>{lang === 'hi' ? 'बुक करें' : 'BOOK THIS COLLECTOR'}</span>
              <Icon icon={ArrowRight} size={16} />
            </button>
          </div>
        </>
      ) : (
        /* Digital ID Mode */
        <div className="flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1F221F]">
              <div>
                <div className="text-[9px] font-mono text-[#6A6E6A]">JNARDDC CIRCULAR NETWORK</div>
                <div className="font-mono text-xs font-bold text-[#A3E635]">
                  DIGITAL OPERATOR PASS
                </div>
              </div>
              <Icon icon={QrCode} size={28} className="text-[#F5F5F5]" />
            </div>

            <div className="py-3 space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#6A6E6A]">ID:</span>
                <span className="text-[#F5F5F5] font-bold">KC-2026-{collector.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6E6A]">PHONE:</span>
                <span className="text-[#F5F5F5]">{collector.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6E6A]">SCALE:</span>
                <span className="text-[#A3E635] font-bold">CALIBRATED BT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6E6A]">PICKUPS:</span>
                <span className="text-[#A3E635]">428 COMPLETED</span>
              </div>
            </div>

            <div className="p-2.5 bg-[#050605] border border-[#1F221F] rounded-sm text-[11px] font-mono text-[#C8C8C8]">
              <span className="text-[#6A6E6A] block text-[9px] mb-0.5">SLOTS TODAY:</span>
              <span>{collector.slots.join(' · ')}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#1F221F]">
            <button
              type="button"
              onClick={() => setShowId(false)}
              data-qa-check="button"
              className="w-full min-h-[44px] text-xs font-mono text-[#C8C8C8] hover:text-[#F5F5F5] flex items-center justify-center gap-1"
            >
              ← RETURN TO PROFILE
            </button>
            <button
              type="button"
              onClick={() => navigate(`/book?collector=${collector.id}`)}
              data-qa-check="button"
              className="w-full min-h-[44px] bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-sm font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2"
            >
              <span>CONFIRM BOOKING</span>
              <Icon icon={ArrowRight} size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectorFlipCard;
