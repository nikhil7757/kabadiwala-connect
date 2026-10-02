import React from 'react';
import { SpeakerButton } from './SpeakerButton.js';

interface BigTileProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  audioKey: string;
  badge?: string | number;
  highlightPulse?: boolean;
}

export const BigTile: React.FC<BigTileProps> = ({
  label,
  icon,
  onClick,
  audioKey,
  badge,
  highlightPulse = false,
}) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`relative min-h-[160px] rounded-2xl kc-glass p-5 flex flex-col justify-between cursor-pointer select-none transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus group ${
        highlightPulse ? 'border-kc-accent/60 shadow-[0_4px_20px_rgba(0,212,170,0.15)] hover:border-kc-accent' : 'hover:border-kc-border-strong'
      }`}
    >
      {highlightPulse && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-kc-accent/10 to-transparent pointer-events-none" />
      )}
      
      <div className="flex items-start justify-between relative z-10">
        <div className={`flex items-center justify-center w-14 h-14 rounded-xl border transition-colors ${highlightPulse ? 'bg-kc-accent/20 border-kc-accent/40 text-kc-accent group-hover:bg-kc-accent/30' : 'bg-kc-surface-2 border-kc-border text-kc-ink group-hover:bg-kc-surface'}`}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: `${(icon as any).props.className || ''} ${highlightPulse ? 'text-kc-accent' : 'text-kc-ink'} group-hover:scale-110 transition-transform duration-300` 
          })}
        </div>
        <SpeakerButton audioKey={audioKey} fallbackText={label} size="sm" />
      </div>

      <div className="mt-4 flex items-baseline justify-between relative z-10">
        <span className="text-lg font-bold text-kc-ink leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-kc-ink group-hover:to-kc-ink-dim transition-all">
          {label}
        </span>
        {badge !== undefined && (
          <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-full bg-kc-accent text-kc-accent-ink shadow-[0_0_10px_rgba(0,212,170,0.4)]">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
