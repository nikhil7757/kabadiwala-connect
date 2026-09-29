import React from 'react';

interface NotchCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  highlight?: boolean;
}

export const NotchCard: React.FC<NotchCardProps> = ({
  children,
  className = '',
  onClick,
  highlight = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-xs border-2 bg-kc-surface p-4 transition-all ${
        highlight ? 'border-kc-accent' : 'border-kc-border-strong'
      } ${onClick ? 'cursor-pointer active:translate-y-0.5' : ''} ${className}`}
    >
      {/* Top-Left Corner Notch Bracket */}
      <span className="absolute -top-[2px] -left-[2px] w-3.5 h-3.5 border-t-[3px] border-l-[3px] border-kc-accent pointer-events-none" />

      {/* Bottom-Right Corner Notch Bracket */}
      <span className="absolute -bottom-[2px] -right-[2px] w-3.5 h-3.5 border-b-[3px] border-r-[3px] border-kc-accent pointer-events-none" />

      {children}
    </div>
  );
};
