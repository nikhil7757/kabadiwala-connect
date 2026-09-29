import React from 'react';
import { SpeakerButton } from './SpeakerButton.js';
import { audioService } from '../../lib/audio.js';

interface AmountDisplayProps {
  amount: string | number;
  caption?: string;
  isSample?: boolean;
  className?: string;
}

export const AmountDisplay: React.FC<AmountDisplayProps> = ({
  amount,
  caption = 'Estimated value',
  isSample = true,
  className = '',
}) => {
  const formatted =
    typeof amount === 'number'
      ? amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : parseFloat(amount || '0').toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.speakAmount(amount);
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 text-center select-none ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-kc-ink-dim uppercase mb-1">
        <span>{caption}</span>
        {isSample && (
          <span className="px-1.5 py-0.5 rounded-full bg-kc-warn-soft text-kc-warn border border-kc-warn/30 text-[10px]">
            SAMPLE
          </span>
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-bold font-mono text-kc-accent mr-1">₹</span>
          <span className="text-6xl font-extrabold font-mono tracking-tight text-kc-ink">
            {formatted}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSpeak}
          className="w-12 h-12 rounded-full border-2 border-kc-border-strong bg-kc-surface text-kc-ink flex items-center justify-center active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus"
          aria-label="Speak amount"
        >
          <SpeakerButton audioKey="estimate_intro" fallbackText={`Total value ${formatted} rupees`} />
        </button>
      </div>
    </div>
  );
};
