import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Globe,
  MapPin,
  Type,
  Volume2,
  Info,
  Trash2,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { TopBar } from '../../components/common/TopBar.js';
import { useAppStore, LanguageCode } from '../../store/useAppStore.js';
import { db } from '../../db/index.js';

export const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, setLanguage, logout } = useAppStore();

  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleLanguageChange = async (lang: LanguageCode) => {
    await setLanguage(lang);
  };

  const handleTextSize = (size: 'normal' | 'large') => {
    setTextSize(size);
    document.documentElement.style.fontSize = size === 'large' ? '18px' : '16px';
  };

  const handleClearData = async () => {
    await db.delete();
    await logout();
    window.location.href = '/welcome';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/welcome', { replace: true });
  };

  const districts = ['Pune', 'Thane', 'Nagpur', 'Nashik'];

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-12">
      <TopBar title="Settings" />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 flex flex-col gap-6">
        {/* Language Section */}
        <div className="p-4 rounded-xs border-2 border-kc-border-strong bg-kc-surface shadow-[2px_2px_0px_#141414]">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-kc-accent" />
            <h2 className="text-base font-bold text-kc-ink uppercase tracking-wider">
              {t('welcome_title')}
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['HI', 'MR', 'EN'] as LanguageCode[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageChange(lang)}
                className={`h-12 rounded-xs border-2 font-bold text-sm flex items-center justify-center active:scale-95 touch-manipulation ${
                  language === lang
                    ? 'border-kc-accent bg-kc-accent text-kc-accent-ink shadow-[2px_2px_0px_#141414]'
                    : 'border-kc-border bg-kc-surface-2 text-kc-ink'
                }`}
              >
                {lang === 'HI' ? 'हिन्दी' : lang === 'MR' ? 'मराठी' : 'English'}
              </button>
            ))}
          </div>
        </div>

        {/* Operating District Section */}
        <div className="p-4 rounded-xs border-2 border-kc-border-strong bg-kc-surface shadow-[2px_2px_0px_#141414]">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-kc-accent" />
            <h2 className="text-base font-bold text-kc-ink uppercase tracking-wider">
              Operating District
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {districts.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDistrict(d)}
                className={`h-12 rounded-xs border-2 font-bold text-sm flex items-center justify-center active:scale-95 touch-manipulation ${
                  selectedDistrict === d
                    ? 'border-kc-accent bg-kc-accent text-kc-accent-ink shadow-[2px_2px_0px_#141414]'
                    : 'border-kc-border bg-kc-surface-2 text-kc-ink'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Text Size Section */}
        <div className="p-4 rounded-xs border-2 border-kc-border-strong bg-kc-surface shadow-[2px_2px_0px_#141414]">
          <div className="flex items-center gap-2 mb-3">
            <Type className="w-5 h-5 text-kc-accent" />
            <h2 className="text-base font-bold text-kc-ink uppercase tracking-wider">
              Display Text Size
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTextSize('normal')}
              className={`h-12 rounded-xs border-2 font-bold text-sm flex items-center justify-center active:scale-95 touch-manipulation ${
                textSize === 'normal'
                  ? 'border-kc-accent bg-kc-accent text-kc-accent-ink shadow-[2px_2px_0px_#141414]'
                  : 'border-kc-border bg-kc-surface-2 text-kc-ink'
              }`}
            >
              Normal (100%)
            </button>
            <button
              type="button"
              onClick={() => handleTextSize('large')}
              className={`h-12 rounded-xs border-2 font-bold text-base flex items-center justify-center active:scale-95 touch-manipulation ${
                textSize === 'large'
                  ? 'border-kc-accent bg-kc-accent text-kc-accent-ink shadow-[2px_2px_0px_#141414]'
                  : 'border-kc-border bg-kc-surface-2 text-kc-ink'
              }`}
            >
              Large (125%)
            </button>
          </div>
        </div>

        {/* About Card */}
        <div className="p-4 rounded-xs border border-kc-border bg-kc-surface-2 flex items-start gap-3">
          <Info className="w-5 h-5 text-kc-ink-dim shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-kc-ink">
              Kabadiwala Connect (Smart India Hackathon 2026)
            </p>
            <p className="text-kc-ink-dim mt-1">
              Ministry of Mines / JNARDDC (Problem Statement SIH26229)
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded bg-kc-warn-soft border border-kc-warn/40 text-kc-warn font-mono font-bold text-[10px]">
              ALL SEEDED DATA IS STRICTLY SAMPLE DATA
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="w-full h-14 rounded-xs border-2 border-kc-danger bg-kc-danger-soft text-kc-danger font-bold text-base uppercase tracking-wider flex items-center justify-center gap-2 active:translate-y-0.5 touch-manipulation"
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear Local Data</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-14 rounded-xs border-2 border-kc-border-strong bg-kc-surface text-kc-ink font-bold text-base uppercase tracking-wider flex items-center justify-center gap-2 active:translate-y-0.5 touch-manipulation"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 bg-kc-ink/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-kc-surface border-3 border-kc-danger rounded-xs p-6 text-center shadow-xl">
              <AlertTriangle className="w-12 h-12 text-kc-danger mx-auto mb-3" />
              <h3 className="text-xl font-bold text-kc-ink mb-2">Delete Local Data?</h3>
              <p className="text-sm text-kc-ink-dim mb-6">
                This will remove all unsynced lots and offline data from this phone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 h-12 border-2 border-kc-border-strong rounded-xs font-bold uppercase text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClearData}
                  className="flex-1 h-12 bg-kc-danger text-white rounded-xs font-bold uppercase text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
