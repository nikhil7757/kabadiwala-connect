import React from 'react';

export interface AvatarItem {
  id: string;
  name: string;
  src?: string;
  fallback: string;
}

interface AvatarStackProps {
  avatars: AvatarItem[];
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Standardized AvatarStack Component (Phase 2 Component)
 * - Isolated negative margin overlap (-space-x-3) confined ONLY inside this component
 * - Ring border for separation (ring-2 ring-[#0A0B0A])
 * - Fixed square aspect ratio, rounded, object-cover
 * - Capped at 4 visible by default with "+N" chip for overflow
 * - Marked with [data-qa-check="avatar"]
 */
export const AvatarStack: React.FC<AvatarStackProps> = ({
  avatars,
  max = 4,
  size = 'md',
  className = '',
}) => {
  const visible = avatars.slice(0, max);
  const remaining = Math.max(0, avatars.length - max);

  const sizeClasses = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

  return (
    <div
      data-qa-check="avatar"
      className={`inline-flex items-center -space-x-3 select-none ${className}`}
    >
      {visible.map((av) => (
        <div
          key={av.id}
          title={av.name}
          className={`relative ${sizeClasses} rounded-full ring-2 ring-[#0A0B0A] bg-[#141614] border border-[#1F221F] flex items-center justify-center font-mono font-bold text-[#A3E635] overflow-hidden shrink-0 aspect-square shadow-sm`}
        >
          {av.src ? (
            <img
              src={av.src}
              alt={av.name}
              width={40}
              height={40}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{av.fallback}</span>
          )}
        </div>
      ))}

      {remaining > 0 && (
        <div
          className={`relative ${sizeClasses} rounded-full ring-2 ring-[#0A0B0A] bg-[#1F221F] text-[#F5F5F5] font-mono font-bold flex items-center justify-center shrink-0 aspect-square shadow-sm text-xs`}
          title={`${remaining} more`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default AvatarStack;
