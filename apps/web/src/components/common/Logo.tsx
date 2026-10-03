import React from 'react';

export type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  size?: LogoSize;
  className?: string;
  showText?: boolean;
}

const SIZE_MAP: Record<LogoSize, { px: number; textSize: string; subTextSize: string }> = {
  sm: { px: 28, textSize: 'text-sm', subTextSize: 'text-[8px]' },
  md: { px: 36, textSize: 'text-lg', subTextSize: 'text-[9px]' },
  lg: { px: 48, textSize: 'text-2xl', subTextSize: 'text-[11px]' },
};

/**
 * Standardized Brand Logo (Phase 2 Component)
 * - Pure inline SVG with explicit viewBox (0 0 48 48) and 1:1 aspect ratio
 * - Rigid flex-shrink-0 to prevent layout collapse
 * - Never absolutely positioned
 * - Exact size tokens: sm (28px), md (36px), lg (48px)
 * - Clear gap before brand text
 * - Marked with [data-qa-check="logo"]
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
}) => {
  const { px, textSize, subTextSize } = SIZE_MAP[size];

  return (
    <div
      data-qa-check="logo"
      className={`inline-flex items-center gap-3 shrink-0 select-none ${className}`}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 aspect-square"
        aria-label="Kabadiwala Connect Logo"
      >
        <rect width="48" height="48" rx="6" fill="#A3E635" />
        <path
          d="M13 12V36M13 24H22M22 12L35 36M22 36L35 12"
          stroke="#0A0B0A"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <div className="flex flex-col min-w-0">
          <span
            className={`font-heading font-black text-[#F5F5F5] tracking-wider leading-none uppercase truncate ${textSize}`}
          >
            KABADIWALA CONNECT
          </span>
          <span
            className={`font-mono text-[#A3E635] tracking-widest uppercase mt-0.5 leading-none ${subTextSize}`}
          >
            SCRAP · COMMUNITY · CHAIN
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
