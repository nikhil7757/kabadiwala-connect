import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Star, QrCode, Phone, MapPin, ArrowRight, RotateCw } from 'lucide-react';
import { useLang } from '../../hooks/useLang';

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

export const CollectorFlipCard: React.FC<CollectorProps> = ({ collector }) => {
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();
  const { lang } = useLang();

  // Synthetic avatar styling
  const initials = collector.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div
      className="relative h-[410px] w-full cursor-pointer [perspective:1000px] select-none"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* ==================== FRONT OF CARD ==================== */}
        <div className="absolute inset-0 w-full h-full bg-[#141614] border border-[#1F221F] hover:border-[#A3E635]/60 transition-colors p-6 flex flex-col justify-between [backface-visibility:hidden] corner-brackets">
          <div>
            {/* Top Bar: Verification Badge & City */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635] text-[11px] font-mono font-bold tracking-wider rounded-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>GOVT VERIFIED</span>
              </span>
              <span className="flex items-center gap-1 text-xs font-mono text-[#6A6E6A]">
                <MapPin className="w-3 h-3 text-[#A3E635]" />
                {collector.city}
              </span>
            </div>

            {/* Avatar & Name */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-sm bg-[#050605] border-2 border-[#1F221F] flex items-center justify-center font-display text-2xl text-[#A3E635] font-bold shadow-inner">
                {initials}
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-[#F5F5F5] uppercase tracking-wide">
                  {collector.name}
                </h3>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-[#FFB020] font-mono font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#FFB020]" />
                  <span>{collector.rating.toFixed(1)} / 5.0</span>
                  <span className="text-[#6A6E6A] font-normal">(184 reviews)</span>
                </div>
              </div>
            </div>

            {/* Specialties / Badges */}
            <div className="space-y-2 mt-4">
              <span className="text-[11px] font-mono text-[#6A6E6A] uppercase tracking-wider block">
                VERIFIED CATEGORIES:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {collector.categories.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 bg-[#050605] border border-[#1F221F] text-[#C8C8C8] text-[11px] font-mono uppercase rounded-sm"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Flip Trigger Hint */}
          <div className="pt-4 border-t border-[#1F221F] flex items-center justify-between text-xs font-mono text-[#6A6E6A]">
            <span className="flex items-center gap-1.5 text-[#A3E635]">
              <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>TAP TO VIEW DIGITAL ID</span>
            </span>
            <span>KC-{collector.id.toUpperCase()}</span>
          </div>
        </div>

        {/* ==================== BACK OF CARD (Digital ID) ==================== */}
        <div className="absolute inset-0 w-full h-full bg-[#050605] border-2 border-[#A3E635] p-6 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div>
            {/* Digital ID Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1F221F]">
              <div>
                <div className="text-[10px] font-mono text-[#6A6E6A]">JNARDDC RECYCLING NETWORK</div>
                <div className="font-mono text-xs font-bold text-[#A3E635]">
                  OFFICIAL DIGITAL OPERATOR PASS
                </div>
              </div>
              <QrCode className="w-8 h-8 text-[#F5F5F5]" />
            </div>

            {/* Detailed Credentials */}
            <div className="py-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#6A6E6A]">OPERATOR ID:</span>
                <span className="text-[#F5F5F5] font-bold">KC-2026-{collector.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6E6A]">FULL NAME:</span>
                <span className="text-[#F5F5F5]">{collector.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6E6A]">TELEPHONE:</span>
                <span className="text-[#F5F5F5]">{collector.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6E6A]">PICKUPS LOGGED:</span>
                <span className="text-[#A3E635] font-bold">428 COMPLETED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6E6A]">ON-TIME RATE:</span>
                <span className="text-[#FFB020] font-bold">99.2% ACCURACY</span>
              </div>
            </div>

            {/* Operating Area & Slots */}
            <div className="p-3 bg-[#141614] border border-[#1F221F] rounded-sm text-xs font-mono text-[#C8C8C8]">
              <span className="text-[#6A6E6A] block text-[10px] mb-1">AVAILABLE TIME SLOTS TODAY:</span>
              <span>{collector.slots.join(' · ')}</span>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/book?collector=${collector.id}`);
              }}
              className="w-full py-3 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-base font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition"
            >
              <span>{lang === 'hi' ? 'इस कबाड़ीवाले को बुक करें' : 'BOOK THIS COLLECTOR'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
