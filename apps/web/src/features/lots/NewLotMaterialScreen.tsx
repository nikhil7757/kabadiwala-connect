import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Cable,
  Cpu,
  BatteryCharging,
  Tv,
  Monitor,
  Cog,
  Box,
  Layers,
  Sparkles,
  Check,
} from 'lucide-react';
import { TopBar } from '../../components/common/TopBar.js';
import { StepHeader } from '../../components/common/StepHeader.js';
import { SafetyPopup } from '../../components/common/SafetyPopup.js';
import { SpeakerButton } from '../../components/common/SpeakerButton.js';
import { useAppStore } from '../../store/useAppStore.js';

interface MaterialCategoryOption {
  code: 'CABLE' | 'PCB' | 'BATTERY' | 'CRT' | 'LCD' | 'MOTOR' | 'PLASTIC' | 'OTHER';
  nameEn: string;
  nameHi: string;
  nameMr: string;
  hazard: 'NONE' | 'HIGH';
  icon: React.ReactNode;
  audioKey: string;
}

const CATEGORIES: MaterialCategoryOption[] = [
  {
    code: 'CABLE',
    nameEn: 'Cables & Wires',
    nameHi: 'केबल और तार',
    nameMr: 'केबल आणि तारा',
    hazard: 'NONE',
    icon: <Cable className="w-8 h-8 stroke-[2.2]" />,
    audioKey: 'mat_cable',
  },
  {
    code: 'PCB',
    nameEn: 'Circuit Boards',
    nameHi: 'सर्किट बोर्ड',
    nameMr: 'सर्किट बोर्ड',
    hazard: 'NONE',
    icon: <Cpu className="w-8 h-8 stroke-[2.2]" />,
    audioKey: 'mat_pcb',
  },
  {
    code: 'BATTERY',
    nameEn: 'Batteries',
    nameHi: 'बैटरी (सेल)',
    nameMr: 'बॅटरी',
    hazard: 'HIGH',
    icon: <BatteryCharging className="w-8 h-8 stroke-[2.2] text-kc-danger" />,
    audioKey: 'mat_battery',
  },
  {
    code: 'CRT',
    nameEn: 'Old TV / CRT',
    nameHi: 'पुराना टीवी (CRT)',
    nameMr: 'जुना टीव्ही / CRT',
    hazard: 'HIGH',
    icon: <Tv className="w-8 h-8 stroke-[2.2] text-kc-danger" />,
    audioKey: 'mat_crt',
  },
  {
    code: 'LCD',
    nameEn: 'Flat Screen / LCD',
    nameHi: 'फ्लैट स्क्रीन',
    nameMr: 'फ्लॅट स्क्रीन',
    hazard: 'NONE',
    icon: <Monitor className="w-8 h-8 stroke-[2.2]" />,
    audioKey: 'mat_lcd',
  },
  {
    code: 'MOTOR',
    nameEn: 'Motors & Magnets',
    nameHi: 'मोटर और चुंबक',
    nameMr: 'मोटर आणि चुंबक',
    hazard: 'NONE',
    icon: <Cog className="w-8 h-8 stroke-[2.2]" />,
    audioKey: 'mat_motor',
  },
  {
    code: 'PLASTIC',
    nameEn: 'Plastic Casing',
    nameHi: 'प्लास्टिक केसिंग',
    nameMr: 'प्लास्टिक केसिंग',
    hazard: 'NONE',
    icon: <Layers className="w-8 h-8 stroke-[2.2]" />,
    audioKey: 'mat_plastic',
  },
  {
    code: 'OTHER',
    nameEn: 'Other E-waste',
    nameHi: 'अन्य ई-कचरा',
    nameMr: 'इतर ई-कचरा',
    hazard: 'NONE',
    icon: <Box className="w-8 h-8 stroke-[2.2]" />,
    audioKey: 'mat_other',
  },
];

export const NewLotMaterialScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);

  const photos = location.state?.photos || [];

  const [selectedCategory, setSelectedCategory] = useState<MaterialCategoryOption | null>(null);
  const [safetyPopupTarget, setSafetyPopupTarget] = useState<'BATTERY' | 'CRT' | null>(null);

  // If user passed from photos, we can provide AI suggestion (mocked/teachable machine)
  const aiSuggestion = CATEGORIES[1]; // PCB as primary demo suggestion

  const handleSelect = (cat: MaterialCategoryOption) => {
    setSelectedCategory(cat);

    if (cat.hazard === 'HIGH') {
      setSafetyPopupTarget(cat.code as 'BATTERY' | 'CRT');
    } else {
      // Advance to weight step
      setTimeout(() => {
        navigate('/lot/new/weight', {
          state: {
            photos,
            category: cat,
          },
        });
      }, 150);
    }
  };

  const handleSafetyUnderstand = () => {
    const cat = selectedCategory;
    setSafetyPopupTarget(null);
    if (cat) {
      navigate('/lot/new/weight', {
        state: {
          photos,
          category: cat,
        },
      });
    }
  };

  const getLocalizedName = (cat: MaterialCategoryOption) => {
    if (language === 'HI') return cat.nameHi;
    if (language === 'MR') return cat.nameMr;
    return cat.nameEn;
  };

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-12">
      <TopBar title={t('step_material')} />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-2 flex flex-col">
        <StepHeader currentStep={2} totalSteps={3} title={t('step_material')} />

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-kc-ink-dim">
            Select the material category that best describes your scrap.
          </p>
          <SpeakerButton
            audioKey="choose_material"
            fallbackText="Tap the icon for the scrap material you have collected"
            size="sm"
          />
        </div>

        {/* AI Suggestion Card */}
        {aiSuggestion && (
          <div className="p-3 mb-4 rounded-xs border-2 border-kc-accent bg-kc-accent-soft/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-kc-accent" />
              <div>
                <span className="text-xs font-mono font-bold uppercase text-kc-accent-text">
                  AI Suggestion (88% Match)
                </span>
                <p className="text-sm font-bold text-kc-ink">
                  {getLocalizedName(aiSuggestion)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSelect(aiSuggestion)}
              className="px-3 py-1.5 bg-kc-accent text-kc-accent-ink font-bold text-xs uppercase rounded-xs border border-kc-border-strong shadow-[2px_2px_0px_#141414] active:scale-95"
            >
              Choose
            </button>
          </div>
        )}

        {/* 8-Category 2-Column Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory?.code === cat.code;
            return (
              <button
                key={cat.code}
                type="button"
                onClick={() => handleSelect(cat)}
                className={`relative min-h-[110px] rounded-xs border-2 p-3 flex flex-col items-center justify-center text-center transition-all active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus ${
                  isSelected
                    ? 'border-kc-accent bg-kc-accent-soft/30 shadow-[3px_3px_0px_#FF5400]'
                    : 'border-kc-border-strong bg-kc-surface shadow-[2px_2px_0px_#141414]'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-kc-accent text-kc-accent-ink flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}

                <div className="mb-2 text-kc-ink">{cat.icon}</div>
                <span className="text-base font-bold text-kc-ink leading-tight">
                  {getLocalizedName(cat)}
                </span>
                {cat.hazard === 'HIGH' && (
                  <span className="mt-1 px-1.5 py-0.2 text-[9px] font-mono font-bold rounded bg-kc-danger-soft text-kc-danger border border-kc-danger/30">
                    HAZARDOUS
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Safety Modal Interceptor */}
      {safetyPopupTarget && (
        <SafetyPopup
          categoryCode={safetyPopupTarget}
          isOpen={Boolean(safetyPopupTarget)}
          onUnderstand={handleSafetyUnderstand}
        />
      )}
    </div>
  );
};
