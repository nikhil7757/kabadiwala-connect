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
    <div className="fixed bottom-0 left-0 right-0 z-40 kc-glass-panel p-4 pb-safe flex flex-col gap-3 max-w-lg mx-auto border-t border-kc-border shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-3">
        {secondaryLabel && secondaryOnClick && (
          <button
            type="button"
            onClick={secondaryOnClick}
            disabled={secondaryDisabled}
            className="flex-1 h-14 rounded-2xl border border-kc-border-strong bg-kc-surface-2 text-kc-ink font-bold text-base uppercase tracking-wider transition-all active:scale-95 hover:bg-kc-surface disabled:opacity-50 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus"
          >
            {secondaryLabel}
          </button>
        )}
        <button
          type="button"
          onClick={primaryOnClick}
          disabled={primaryDisabled || primaryLoading}
          className="flex-2 h-14 rounded-2xl bg-gradient-to-r from-kc-accent to-[#00e5b8] text-kc-accent-ink font-extrabold text-lg uppercase tracking-widest shadow-[0_4px_15px_rgba(0,212,170,0.4)] transition-all hover:shadow-[0_6px_20px_rgba(0,212,170,0.6)] hover:scale-[1.02] active:scale-95 disabled:from-kc-surface-2 disabled:to-kc-surface-2 disabled:text-kc-ink-dim disabled:shadow-none disabled:opacity-60 disabled:hover:scale-100 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-accent/50 flex items-center justify-center gap-2"
        >
          {primaryLoading ? (
            <span className="w-5 h-5 border-2 border-kc-accent-ink border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>{primaryLabel}</span>
          )}
        </button>
      </div>
    </div>
  );
};
