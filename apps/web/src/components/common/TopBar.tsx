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
    <header className="sticky top-0 z-40 bg-kc-bg/95 backdrop-blur-xs border-b border-kc-border px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {showBack && location.pathname !== '/home' && (
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-kc-ink active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}
        {showHome && (
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-kc-ink active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus"
            aria-label="Home"
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}
        {title && (
          <h1 className="text-lg font-bold text-kc-ink truncate max-w-[180px]">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {rightElement}
        <button
          type="button"
          onClick={cycleLanguage}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-kc-border-strong bg-kc-surface text-kc-ink text-xs font-bold active:scale-95 touch-manipulation"
          aria-label={`Current language: ${langLabel[language]}. Tap to switch`}
        >
          <Globe className="w-3.5 h-3.5 text-kc-ink-dim" />
          <span>{langLabel[language]}</span>
        </button>
        <ConnectivityDot showLabel={false} />
      </div>
    </header>
  );
};
