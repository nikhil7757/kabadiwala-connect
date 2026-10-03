import React from 'react';

export type BadgeVariant = 'lime' | 'amber' | 'muted' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  slot?: 'inline' | 'corner-top-left' | 'corner-top-right';
}

/**
 * Standardized Badge Primitive (Phase 2 Component)
 * - Safe flex placement by default
 * - Documented corner slots with 12px safe insets
 * - Marked with [data-qa-check="badge"]
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'lime',
  className = '',
  slot = 'inline',
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    lime: 'bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/30',
    amber: 'bg-[#FFB020]/10 text-[#FFB020] border border-[#FFB020]/30',
    muted: 'bg-[#141614] text-[#C8C8C8] border border-[#1F221F]',
    outline: 'bg-transparent text-[#F5F5F5] border border-[#1F221F]',
  };

  const slotStyles: Record<string, string> = {
    inline: 'inline-flex items-center gap-1.5',
    'corner-top-left': 'absolute top-3 left-3 z-10 inline-flex items-center gap-1.5',
    'corner-top-right': 'absolute top-3 right-3 z-10 inline-flex items-center gap-1.5',
  };

  return (
    <span
      data-qa-check="badge"
      className={`px-2.5 py-0.5 rounded-sm font-mono text-[11px] font-bold tracking-wider uppercase ${variantStyles[variant]} ${slotStyles[slot]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;