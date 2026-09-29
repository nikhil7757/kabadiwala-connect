import React from 'react';

interface StickyActionBarProps {
  primaryLabel: string;
  primaryOnClick: () => void;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  secondaryLabel?: string;
  secondaryOnClick?: () => void;
  secondaryDisabled?: boolean;
  speakerKey?: string;
  speakerFallback?: string;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  primaryLabel,
  primaryOnClick,
  primaryDisabled = false,
  primaryLoading = false,
  secondaryLabel,
  secondaryOnClick,
  secondaryDisabled = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-kc-bg/95 border-t-2 border-kc-border p-4 pb-safe flex flex-col gap-2 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        {secondaryLabel && secondaryOnClick && (
          <button
            type="button"
            onClick={secondaryOnClick}
            disabled={secondaryDisabled}
            className="flex-1 h-14 rounded-xs border-2 border-kc-border-strong bg-kc-surface text-kc-ink font-bold text-base uppercase tracking-wider transition-transform active:translate-y-0.5 disabled:opacity-50 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus"
          >
            {secondaryLabel}
          </button>
        )}
        <button
          type="button"
          onClick={primaryOnClick}
          disabled={primaryDisabled || primaryLoading}
          className="flex-2 h-14 rounded-xs border-2 border-kc-border-strong bg-kc-accent text-kc-accent-ink font-bold text-lg uppercase tracking-wider shadow-[4px_4px_0px_#141414] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none disabled:bg-kc-surface-2 disabled:text-kc-ink-dim disabled:shadow-none disabled:opacity-60 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus flex items-center justify-center gap-2"
        >
          {primaryLoading ? (
            <span className="w-5 h-5 border-2 border-kc-ink border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>{primaryLabel}</span>
          )}
        </button>
      </div>
    </div>
  );
};
