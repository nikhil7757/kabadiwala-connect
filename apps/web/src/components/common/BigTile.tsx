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
      className={`relative min-h-[145px] rounded-xs border-2 border-kc-border-strong bg-kc-surface p-4 flex flex-col justify-between cursor-pointer select-none transition-transform active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_#141414] touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus ${
        highlightPulse ? 'border-kc-accent ring-1 ring-kc-accent' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="text-kc-ink flex items-center justify-center w-14 h-14 rounded-xs bg-kc-surface-2">
          {icon}
        </div>
        <SpeakerButton audioKey={audioKey} fallbackText={label} size="sm" />
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-lg font-bold text-kc-ink leading-tight">
          {label}
        </span>
        {badge !== undefined && (
          <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-kc-accent text-kc-accent-ink">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
