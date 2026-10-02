import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Volume2, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col justify-between p-4 max-w-md mx-auto relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-[-10%] left-[-20%] w-64 h-64 bg-kc-accent/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-20%] w-72 h-72 bg-kc-info/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar Branding */}
      <header className="pt-12 pb-8 text-center relative z-10 animate-float">
        <div className="w-20 h-20 bg-gradient-to-br from-kc-accent to-kc-success text-kc-accent-ink mx-auto rounded-2xl flex items-center justify-center font-heading font-bold text-4xl shadow-[0_8px_32px_rgba(0,212,170,0.4)] mb-6 ring-1 ring-kc-accent/50 animate-pulse-glow">
          KC
        </div>
        <h1 className="text-4xl font-heading font-bold uppercase tracking-widest text-gradient">
          KABADIWALA CONNECT
        </h1>
        <div className="flex items-center justify-center gap-2 mt-4 text-kc-ink-dim bg-kc-surface/30 backdrop-blur-md px-4 py-2 rounded-full border border-kc-border inline-flex shadow-lg mx-auto">
          <button className="p-1 rounded-full hover:bg-kc-surface transition-colors">
            <Volume2 size={18} className="text-kc-accent" />
          </button>
          <span className="text-sm font-medium tracking-wide">{t('welcome_title')}</span>
        </div>
      </header>

      {/* Language Selection Buttons */}
      <div className="space-y-5 my-auto relative z-10 w-full px-2">
        {/* Hindi */}
        <button
          onClick={() => handleSelectLanguage('hi')}
          className="w-full h-22 kc-glass rounded-2xl p-5 flex items-center justify-between transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-kc-accent/50 group active:scale-95 cursor-pointer"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-kc-surface-2 flex items-center justify-center border border-kc-border group-hover:border-kc-accent/30 transition-colors">
              <span className="text-2xl font-bold text-kc-accent select-none">हिं</span>
            </div>
            <span className="text-2xl font-bold text-kc-ink tracking-wide">हिन्दी</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-kc-surface flex items-center justify-center border border-kc-border group-hover:bg-kc-accent/10 transition-colors">
            <ArrowRight size={20} className="text-kc-ink-dim group-hover:text-kc-accent" />
          </div>
        </button>

        {/* Marathi */}
        <button
          onClick={() => handleSelectLanguage('mr')}
          className="w-full h-22 kc-glass rounded-2xl p-5 flex items-center justify-between transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-kc-accent/50 group active:scale-95 cursor-pointer"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-kc-surface-2 flex items-center justify-center border border-kc-border group-hover:border-kc-accent/30 transition-colors">
              <span className="text-2xl font-bold text-kc-accent select-none">मरा</span>
            </div>
            <span className="text-2xl font-bold text-kc-ink tracking-wide">मराठी</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-kc-surface flex items-center justify-center border border-kc-border group-hover:bg-kc-accent/10 transition-colors">
            <ArrowRight size={20} className="text-kc-ink-dim group-hover:text-kc-accent" />
          </div>
        </button>

        {/* English */}
        <button
          onClick={() => handleSelectLanguage('en')}
          className="w-full h-22 kc-glass rounded-2xl p-5 flex items-center justify-between transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-kc-accent/50 group active:scale-95 cursor-pointer"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-kc-surface-2 flex items-center justify-center border border-kc-border group-hover:border-kc-accent/30 transition-colors">
              <span className="text-2xl font-heading font-bold text-kc-accent select-none">EN</span>
            </div>
            <span className="text-2xl font-bold text-kc-ink font-heading tracking-wide">English</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-kc-surface flex items-center justify-center border border-kc-border group-hover:bg-kc-accent/10 transition-colors">
            <ArrowRight size={20} className="text-kc-ink-dim group-hover:text-kc-accent" />
          </div>
        </button>
      </div>

      {/* Footer link to dev UI Kit */}
      <footer className="pt-8 pb-6 text-center relative z-10">
        <button
          onClick={() => navigate('/dev/ui-kit')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full kc-glass text-xs font-mono-code text-kc-ink-dim hover:text-kc-accent hover:border-kc-accent/40 transition-all group"
        >
          <Sparkles size={14} className="group-hover:animate-pulse" />
          <span>Open Component Catalog (/dev/ui-kit)</span>
        </button>
      </footer>
    </div>
  );
}
