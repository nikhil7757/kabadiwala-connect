import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export function UiKit() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState<'field' | 'control'>('field');

  const toggleTheme = (newTheme: 'field' | 'control') => {
    setTheme(newTheme);
    document.documentElement.dataset.theme = newTheme;
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8 pb-20">
      {/* Dev Controls Header */}
      <header className="border-b border-kc-border pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono-code text-kc-accent-text tracking-wider uppercase font-semibold">
            DEVELOPMENT ENVIRONMENT
          </span>
          <h1 className="text-2xl font-bold font-heading">/dev/ui-kit Component Catalog</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme selector */}
          <div className="flex bg-kc-surface-2 p-1 rounded-sm border border-kc-border text-xs font-semibold">
            <button
              onClick={() => toggleTheme('field')}
              className={`px-3 py-1.5 rounded-sm transition ${
                theme === 'field' ? 'bg-kc-surface text-kc-ink shadow-sm' : 'text-kc-ink-dim hover:text-kc-ink'
              }`}
            >
              Field (Collector)
            </button>
            <button
              onClick={() => toggleTheme('control')}
              className={`px-3 py-1.5 rounded-sm transition ${
                theme === 'control' ? 'bg-kc-surface text-kc-ink shadow-sm' : 'text-kc-ink-dim hover:text-kc-ink'
              }`}
            >
              Control (Desktop)
            </button>
          </div>

          {/* Language selector */}
          <div className="flex bg-kc-surface-2 p-1 rounded-sm border border-kc-border text-xs font-semibold">
            {(['hi', 'mr', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`px-2.5 py-1.5 rounded-sm uppercase transition ${
                  i18n.language === lang ? 'bg-kc-accent text-kc-accent-ink font-bold' : 'text-kc-ink-dim hover:text-kc-ink'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* SAMPLE DATA Disclaimer Badge */}
      <div className="flex items-center gap-2 px-3 py-1 bg-kc-warn-soft text-kc-warn rounded-sm text-xs font-bold w-fit">
        <AlertTriangle size={14} />
        <span>{t('sample_data')}</span>
      </div>

      {/* 1. Typography & Devanagari Rendering */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-4 bg-kc-accent"></div>
          <h2 className="text-lg font-bold font-heading uppercase tracking-wide">1. Typography & Language Rendering</h2>
        </div>
        <div className="bg-kc-surface p-5 border border-kc-border rounded-sm space-y-3">
          <div>
            <span className="text-xs font-mono-code text-kc-ink-dim">English Display Heading (Oswald Bold):</span>
            <div className="text-3xl font-heading font-bold uppercase tracking-wider text-kc-ink">
              KABADIWALA CONNECT 2026
            </div>
          </div>
          <div>
            <span className="text-xs font-mono-code text-kc-ink-dim">Devanagari Heading (Noto Sans Devanagari 700):</span>
            <div className="text-2xl font-bold text-kc-ink">
              कबाड़ीवाला कनेक्ट: अनौपचारिक कचरा संग्राहक सशक्तीकरण
            </div>
          </div>
          <div>
            <span className="text-xs font-mono-code text-kc-ink-dim">Devanagari Body (Noto Sans Devanagari 400, line-height 1.6):</span>
            <p className="text-base text-kc-ink">
              सर्व इलेक्ट्रॉनिक कचरा अधिकृत पुनर्प्रक्रिया केंद्राकडे सुपूर्द करा. केबल जाळू नका, बॅटरी सुरक्षित ठेवा.
            </p>
          </div>
          <div>
            <span className="text-xs font-mono-code text-kc-ink-dim">Reference Code (JetBrains Mono 500):</span>
            <div className="font-mono-code text-sm font-medium text-kc-accent-text">
              KC-MH-20260929-0007 | HO-09290007-K4Q9
            </div>
          </div>
        </div>
      </section>

      {/* 2. Signature Section 15 Aesthetic Elements */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-4 bg-kc-accent"></div>
          <h2 className="text-lg font-bold font-heading uppercase tracking-wide">2. Signature Aesthetic Elements (Section 15)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ScaleLabel Card */}
          <div className="bg-kc-surface border-2 border-kc-border-strong rounded-sm p-4 relative kc-notch">
            <div className="kc-perf absolute top-0 left-0 right-0"></div>
            <div className="pt-2">
              <div className="flex justify-between items-center text-xs font-mono-code text-kc-ink-dim">
                <span>SCALE RECORD: 0048</span>
                <span className="text-kc-accent-text font-bold">VERIFIED</span>
              </div>
              <div className="text-4xl font-heading font-bold text-kc-ink mt-2">
                ₹ 12,500<span className="text-lg font-normal text-kc-ink-dim">.00</span>
              </div>
              <div className="border-t border-dashed border-kc-border my-3"></div>
              <div className="flex justify-between text-xs text-kc-ink-dim">
                <span>PCB (Circuit Boards) - 12.5 kg</span>
                <span>{t('rates_updated', { date: 'Today' })}</span>
              </div>
            </div>
            <div className="kc-perf absolute bottom-0 left-0 right-0"></div>
          </div>

          {/* Hazard Tape and Status Cards */}
          <div className="space-y-4">
            <div className="kc-hazard rounded-sm"></div>
            <div className="bg-kc-surface p-4 border border-kc-border rounded-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-kc-success-soft flex items-center justify-center text-kc-success">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="text-sm font-bold">{t('handover_done')}</div>
                  <div className="text-xs text-kc-ink-dim">Trace chain seq #4 verified</div>
                </div>
              </div>
              <svg className="w-8 h-8 kc-tick text-kc-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" stroke="#17704A" strokeOpacity="0.2" />
                <path d="M7 12l3.5 3.5 6.5-6.5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Action Buttons & Touch Targets (56px minimum) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-4 bg-kc-accent"></div>
          <h2 className="text-lg font-bold font-heading uppercase tracking-wide">3. Primary Action Buttons (56px Touch Target)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="h-14 w-full bg-kc-accent text-kc-accent-ink font-heading font-bold text-lg uppercase tracking-wider rounded-sm shadow-[4px_4px_0_var(--kc-ink)] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2 cursor-pointer">
            <span>{t('find_buyer')}</span>
            <ArrowRight size={20} />
          </button>

          <button className="h-14 w-full bg-transparent text-kc-ink border-2 border-kc-ink font-heading font-bold text-lg uppercase tracking-wider rounded-sm hover:bg-kc-surface-2 transition flex items-center justify-center gap-2 cursor-pointer">
            <span>{t('save_later')}</span>
          </button>
        </div>

        {/* Audio Speaker Button (48px circle) */}
        <div className="flex items-center gap-4 bg-kc-surface p-4 border border-kc-border rounded-sm">
          <button className="w-12 h-12 rounded-full bg-kc-surface-2 border border-kc-border flex items-center justify-center text-kc-ink hover:bg-kc-accent-soft hover:text-kc-accent-text transition cursor-pointer">
            <Volume2 size={24} />
          </button>
          <div>
            <div className="text-sm font-bold">Spoken Audio Guidance</div>
            <div className="text-xs text-kc-ink-dim">Tap speaker to hear vernacular voice assistance</div>
          </div>
        </div>
      </section>

      {/* 4. Connectivity Indicator */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-4 bg-kc-accent"></div>
          <h2 className="text-lg font-bold font-heading uppercase tracking-wide">4. Connectivity Status</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-kc-surface border border-kc-border rounded-sm text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-kc-success"></span>
            <span>ONLINE</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-kc-surface border border-kc-border rounded-sm text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-kc-accent animate-pulse"></span>
            <span>OFFLINE (SAVED TO PHONE)</span>
          </div>
        </div>
      </section>
    </div>
  );
}
