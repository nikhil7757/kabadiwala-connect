import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Scale, CheckCircle2, XCircle, Flame } from 'lucide-react';
import { TopBar } from '../../components/common/TopBar.js';
import { StepHeader } from '../../components/common/StepHeader.js';
import { NumberPad } from '../../components/common/NumberPad.js';
import { StickyActionBar } from '../../components/common/StickyActionBar.js';
import { SpeakerButton } from '../../components/common/SpeakerButton.js';

export const NewLotWeightScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { photos, category } = location.state || {};

  const [weight, setWeight] = useState('12');
  const [condition, setCondition] = useState<'WORKING' | 'BROKEN' | 'BURNT'>('BROKEN');

  const handleNext = () => {
    const numWeight = parseFloat(weight);
    if (isNaN(numWeight) || numWeight <= 0) return;

    navigate('/lot/new/estimate', {
      state: {
        photos,
        category,
        weightKg: numWeight,
        condition,
      },
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
  };

  const conditionOptions = [
    { key: 'WORKING', label: 'Working', icon: <CheckCircle2 className="w-4 h-4 text-kc-success" /> },
    { key: 'BROKEN', label: 'Broken', icon: <XCircle className="w-4 h-4 text-kc-ink-dim" /> },
    { key: 'BURNT', label: 'Burnt', icon: <Flame className="w-4 h-4 text-kc-danger" /> },
  ];

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-28">
      <TopBar title={t('step_weight')} />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-2 flex flex-col justify-between">
        <div>
          <StepHeader currentStep={3} totalSteps={3} title={t('step_weight')} />

          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-kc-ink-dim">
              Enter the approximate weight in kilograms.
            </p>
            <SpeakerButton
              audioKey="enter_weight"
              fallbackText="Enter weight in kilograms using keypad or slider"
              size="sm"
            />
          </div>

          {/* Large Weight Readout Display */}
          <div className="p-4 rounded-xs border-3 border-kc-border-strong bg-kc-surface shadow-[4px_4px_0px_#141414] flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-kc-accent" />
              <div>
                <span className="text-xs font-mono font-bold text-kc-ink-dim uppercase">
                  APPROX WEIGHT
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black font-mono tracking-tight text-kc-ink">
                    {weight || '0'}
                  </span>
                  <span className="text-xl font-bold font-mono text-kc-ink-dim">kg</span>
                </div>
              </div>
            </div>

            {/* Quick Increment Buttons */}
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setWeight((prev) => (parseFloat(prev || '0') + 5).toString())}
                className="px-3 py-1.5 bg-kc-surface-2 border border-kc-border rounded font-mono font-bold text-xs active:bg-kc-border"
              >
                +5 kg
              </button>
              <button
                type="button"
                onClick={() => setWeight((prev) => Math.max(1, parseFloat(prev || '0') - 5).toString())}
                className="px-3 py-1.5 bg-kc-surface-2 border border-kc-border rounded font-mono font-bold text-xs active:bg-kc-border"
              >
                -5 kg
              </button>
            </div>
          </div>

          {/* Range Slider for fast adjustment */}
          <div className="mb-4 px-1">
            <input
              type="range"
              min="0.5"
              max="100"
              step="0.5"
              value={parseFloat(weight) || 12}
              onChange={handleSliderChange}
              className="w-full h-3 bg-kc-surface-2 rounded-lg appearance-none cursor-pointer accent-kc-accent border border-kc-border"
            />
            <div className="flex justify-between text-[11px] font-mono font-bold text-kc-ink-dim mt-1">
              <span>0.5 kg</span>
              <span>25 kg</span>
              <span>50 kg</span>
              <span>100 kg</span>
            </div>
          </div>

          {/* Condition Chips */}
          <div className="mb-4">
            <span className="text-xs font-mono font-bold text-kc-ink-dim uppercase mb-1.5 block">
              MATERIAL CONDITION
            </span>
            <div className="grid grid-cols-3 gap-2">
              {conditionOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setCondition(opt.key as any)}
                  className={`h-11 rounded-xs border-2 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    condition === opt.key
                      ? 'border-kc-accent bg-kc-accent-soft text-kc-accent-text shadow-[2px_2px_0px_#FF5400]'
                      : 'border-kc-border bg-kc-surface text-kc-ink'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* NumberPad */}
        <div className="mb-2">
          <NumberPad value={weight} onChange={setWeight} maxDecimals={1} maxDigits={5} />
        </div>
      </main>

      <StickyActionBar
        primaryLabel={t('see_value')}
        primaryOnClick={handleNext}
        primaryDisabled={!weight || parseFloat(weight) <= 0}
      />
    </div>
  );
};
