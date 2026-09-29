import React, { useEffect } from 'react';
import { AlertTriangle, Check, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SpeakerButton } from './SpeakerButton.js';
import { audioService } from '../../lib/audio.js';

interface SafetyPopupProps {
  categoryCode: 'BATTERY' | 'CRT';
  isOpen: boolean;
  onUnderstand: () => void;
}

export const SafetyPopup: React.FC<SafetyPopupProps> = ({
  categoryCode,
  isOpen,
  onUnderstand,
}) => {
  const { t } = useTranslation();

  const isBattery = categoryCode === 'BATTERY';
  const audioKey = isBattery ? 'safety_battery' : 'safety_crt';
  const title = isBattery
    ? 'बैटरी सुरक्षा: आग का खतरा!'
    : 'CRT सुरक्षा: टूटने और फूटने का खतरा!';
  const instruction = isBattery
    ? 'बैटरी को कभी दबाएँ, काटें या जलाएँ नहीं। गर्मी से दूर रखें।'
    : 'पुराने टीवी या मॉनिटर को कभी हथौड़े से न तोड़ें। शीशा फूट सकता है।';

  useEffect(() => {
    if (isOpen) {
      audioService.play(audioKey, `${title}. ${instruction}`);
    }
  }, [isOpen, audioKey, title, instruction]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-kc-ink/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md bg-kc-surface border-4 border-kc-danger rounded-xs p-6 flex flex-col items-center text-center shadow-2xl animate-in fade-in duration-200">
        <div className="w-20 h-20 rounded-full bg-kc-danger-soft border-2 border-kc-danger flex items-center justify-center text-kc-danger mb-4">
          <ShieldAlert className="w-12 h-12" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-black text-kc-danger uppercase">
            {isBattery ? 'HAZARDOUS BATTERY' : 'DANGEROUS CRT TUBE'}
          </h2>
          <SpeakerButton audioKey={audioKey} fallbackText={instruction} size="sm" />
        </div>

        <p className="text-lg font-bold text-kc-ink mb-2">{title}</p>
        <p className="text-base text-kc-ink-dim mb-6 leading-relaxed">
          {instruction}
        </p>

        <button
          type="button"
          onClick={onUnderstand}
          className="w-full h-16 rounded-xs bg-kc-success text-white font-bold text-xl uppercase tracking-wider shadow-[4px_4px_0px_#141414] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 touch-manipulation focus:outline-none focus:ring-4 focus:ring-kc-focus"
        >
          <Check className="w-7 h-7 stroke-[3]" />
          <span>{t('i_understand')}</span>
        </button>
      </div>
    </div>
  );
};
