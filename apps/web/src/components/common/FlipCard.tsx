import React, { useState } from 'react';
import { SpeakerButton } from './SpeakerButton.js';
import { RotateCw } from 'lucide-react';

interface FlipCardProps {
  title: string;
  body: string;
  icon: React.ReactNode;
  audioKey: string;
  className?: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  title,
  body,
  icon,
  audioKey,
  className = '',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsFlipped(!isFlipped)}
      className={`relative min-h-[170px] rounded-xs border-2 border-kc-border-strong bg-kc-surface p-4 flex flex-col justify-between cursor-pointer select-none transition-transform active:translate-y-0.5 shadow-[2px_2px_0px_#141414] touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus ${className}`}
      aria-expanded={isFlipped}
    >
      <div className="flex items-start justify-between">
        <div className="text-kc-ink flex items-center justify-center w-12 h-12 rounded-xs bg-kc-surface-2">
          {icon}
        </div>
        <div className="flex items-center gap-1">
          <SpeakerButton audioKey={audioKey} fallbackText={`${title}. ${body}`} size="sm" />
          <span className="p-1 text-kc-ink-dim hover:text-kc-ink">
            <RotateCw className="w-4 h-4" />
          </span>
        </div>
      </div>

      <div className="mt-3">
        {!isFlipped ? (
          <div>
            <h3 className="text-base font-bold text-kc-ink leading-tight mb-1">
              {title}
            </h3>
            <p className="text-xs text-kc-accent-text font-bold uppercase tracking-wider">
              TAP TO READ
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-kc-ink leading-relaxed">
              {body}
            </p>
            <p className="text-[10px] text-kc-ink-dim font-bold uppercase tracking-wider mt-1">
              TAP TO FLIP BACK
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
