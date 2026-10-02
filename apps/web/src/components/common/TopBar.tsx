import React from 'react';
import { ArrowLeft, Home, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useAppStore, LanguageCode } from '../../store/useAppStore.js';
import { ConnectivityDot } from './ConnectivityDot.js';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  showHome?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  showBack = true,
  showHome = false,
  onBack,
  rightElement,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useAppStore();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const cycleLanguage = () => {
    const nextLang: Record<LanguageCode, LanguageCode> = {
      HI: 'MR',
      MR: 'EN',
      EN: 'HI',
    };
    setLanguage(nextLang[language]);
  };

  const langLabel: Record<LanguageCode, string> = {
    HI: 'हिन्दी',
    MR: 'मराठी',
    EN: 'ENG',
  };

  return (
    <header className="sticky top-0 z-40 kc-glass-panel px-4 h-16 flex items-center justify-between border-b-0 shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-kc-bg/40 to-transparent pointer-events-none" />
      <div className="flex items-center gap-2 relative z-10">
        {showBack && location.pathname !== '/home' && (
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-kc-ink hover:bg-kc-surface transition-colors active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}
        {showHome && (
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-kc-ink hover:bg-kc-surface transition-colors active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus"
            aria-label="Home"
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}
        {title && (
          <h1 className="text-lg font-bold text-gradient truncate max-w-[180px] tracking-wide">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3 relative z-10">
        {rightElement}
        <button
          type="button"
          onClick={cycleLanguage}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-kc-border-strong bg-kc-surface/50 backdrop-blur-md text-kc-ink text-xs font-bold active:scale-95 hover:bg-kc-surface hover:border-kc-accent/50 transition-all touch-manipulation shadow-sm"
          aria-label={`Current language: ${langLabel[language]}. Tap to switch`}
        >
          <Globe className="w-3.5 h-3.5 text-kc-accent" />
          <span>{langLabel[language]}</span>
        </button>
        <ConnectivityDot showLabel={false} />
      </div>
    </header>
  );
};
