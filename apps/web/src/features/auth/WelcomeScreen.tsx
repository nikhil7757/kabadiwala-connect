import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Volume2, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.js';

export function WelcomeScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleSelectLanguage = async (lang: 'hi' | 'mr' | 'en') => {
    i18n.changeLanguage(lang);
    await useAppStore.getState().setLanguage(lang.toUpperCase() as any);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-kc-bg flex flex-col justify-between p-4 max-w-md mx-auto">
      {/* Top Bar Branding */}
      <header className="pt-8 pb-4 text-center">
        <div className="w-16 h-16 bg-kc-accent text-kc-accent-ink mx-auto rounded-sm flex items-center justify-center font-heading font-bold text-3xl shadow-[3px_3px_0_var(--kc-ink)] mb-4">
          KC
        </div>
        <h1 className="text-3xl font-heading font-bold uppercase tracking-wider text-kc-ink">
          KABADIWALA CONNECT
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2 text-kc-ink-dim">
          <button className="p-1 rounded-full hover:bg-kc-surface-2">
            <Volume2 size={20} className="text-kc-accent-text" />
          </button>
          <span className="text-base font-medium">{t('welcome_title')}</span>
        </div>
      </header>

      {/* Language Selection Buttons (56px minimum target with outlined glyph) */}
      <div className="space-y-4 my-auto">
        {/* Hindi */}
        <button
          onClick={() => handleSelectLanguage('hi')}
          className="w-full h-20 bg-kc-surface border-2 border-kc-border-strong rounded-sm p-4 flex items-center justify-between shadow-[4px_4px_0_var(--kc-ink)] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer hover:bg-kc-surface-2"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-kc-ink-dim select-none">हिं</span>
            <span className="text-xl font-bold text-kc-ink">हिन्दी</span>
          </div>
          <Volume2 size={24} className="text-kc-accent-text" />
        </button>

        {/* Marathi */}
        <button
          onClick={() => handleSelectLanguage('mr')}
          className="w-full h-20 bg-kc-surface border-2 border-kc-border-strong rounded-sm p-4 flex items-center justify-between shadow-[4px_4px_0_var(--kc-ink)] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer hover:bg-kc-surface-2"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-kc-ink-dim select-none">मरा</span>
            <span className="text-xl font-bold text-kc-ink">मराठी</span>
          </div>
          <Volume2 size={24} className="text-kc-accent-text" />
        </button>

        {/* English */}
        <button
          onClick={() => handleSelectLanguage('en')}
          className="w-full h-20 bg-kc-surface border-2 border-kc-border-strong rounded-sm p-4 flex items-center justify-between shadow-[4px_4px_0_var(--kc-ink)] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer hover:bg-kc-surface-2"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl font-heading font-bold text-kc-ink-dim select-none">EN</span>
            <span className="text-xl font-bold text-kc-ink font-heading">English</span>
          </div>
          <Volume2 size={24} className="text-kc-accent-text" />
        </button>
      </div>

      {/* Footer link to dev UI Kit */}
      <footer className="pt-6 pb-4 text-center">
        <button
          onClick={() => navigate('/dev/ui-kit')}
          className="inline-flex items-center gap-1.5 text-xs font-mono-code text-kc-ink-dim hover:text-kc-accent-text transition"
        >
          <span>Open Component Catalog (/dev/ui-kit)</span>
          <ArrowRight size={14} />
        </button>
      </footer>
    </div>
  );
}
