import React from 'react';

export interface PartnerLogo {
  id: string;
  name: string;
  category: string;
  badge: string;
}

const DEFAULT_PARTNERS: PartnerLogo[] = [
  { id: 'jnarddc', name: 'JNARDDC', category: 'Ministry of Mines', badge: 'ACCREDITED' },
  { id: 'tata-steel', name: 'TATA RECYCLING', category: 'Secondary Steel', badge: 'SMELTER' },
  { id: 'hindalco', name: 'HINDALCO', category: 'Non-Ferrous Mill', badge: 'PARTNER' },
  { id: 'vedanta', name: 'VEDANTA RECOVERY', category: 'Copper & Zinc', badge: 'AUDITED' },
  { id: 'mcgm', name: 'MCGM SWM', category: 'Civic Urban Body', badge: 'MUNICIPAL' },
  { id: 'pmc', name: 'PMC CLEAN CITY', category: 'Municipal Ward 12', badge: 'SWRO' },
];

interface PartnerStripProps {
  marquee?: boolean;
  className?: string;
}

/**
 * Standardized Partner / Recycler Logo Strip (Phase 2 Component)
 * - Identical fixed-size cells (140x64)
 * - object-contain, centered, min-gap 24px
 * - For marquee: flex track with gap, duplicated content, width: max-content, no negative margins
 * - Marked with [data-qa-check="logo"]
 */
export const PartnerStrip: React.FC<PartnerStripProps> = ({
  marquee = false,
  className = '',
}) => {
  const content = (
    <div className="flex items-center gap-6 shrink-0 py-2">
      {DEFAULT_PARTNERS.map((p) => (
        <div
          key={p.id}
          data-qa-check="logo"
          className="w-[140px] h-[64px] shrink-0 bg-[#141614] border border-[#1F221F] rounded-sm flex flex-col items-center justify-center p-2 text-center select-none hover:border-[#A3E635]/60 transition-colors"
        >
          <span className="font-heading font-bold text-xs uppercase text-[#F5F5F5] tracking-wider leading-tight truncate w-full">
            {p.name}
          </span>
          <span className="font-mono text-[9px] text-[#A3E635] tracking-widest uppercase mt-0.5">
            {p.badge}
          </span>
        </div>
      ))}
    </div>
  );

  if (marquee) {
    return (
      <div className={`w-full overflow-hidden select-none ${className}`}>
        <div className="animate-marquee flex items-center gap-6">
          {content}
          {content}
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center w-full ${className}`}>
      {DEFAULT_PARTNERS.map((p) => (
        <div
          key={p.id}
          data-qa-check="logo"
          className="w-[140px] h-[64px] shrink-0 bg-[#141614] border border-[#1F221F] rounded-sm flex flex-col items-center justify-center p-2 text-center select-none hover:border-[#A3E635]/60 transition-colors"
        >
          <span className="font-heading font-bold text-xs uppercase text-[#F5F5F5] tracking-wider leading-tight truncate w-full">
            {p.name}
          </span>
          <span className="font-mono text-[9px] text-[#A3E635] tracking-widest uppercase mt-0.5">
            {p.badge}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PartnerStrip;
