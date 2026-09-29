import React from 'react';

interface StepHeaderProps {
  currentStep: number;
  totalSteps?: number;
  title: string;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  currentStep,
  totalSteps = 3,
  title,
}) => {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="flex flex-col gap-2 pt-2 pb-4">
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-kc-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-kc-accent transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-2">
          <span className="w-4 h-[2px] bg-kc-accent" />
          <span className="text-xs font-mono font-bold tracking-widest text-kc-ink-dim uppercase">
            STEP {currentStep} / {totalSteps}
          </span>
        </div>

        {/* Large Outlined Step Number */}
        <span
          className="text-4xl font-extrabold font-mono leading-none select-none text-transparent"
          style={{
            WebkitTextStroke: '2px var(--kc-ink)',
          }}
        >
          0{currentStep}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-kc-ink leading-tight">
        {title}
      </h2>
    </div>
  );
};
