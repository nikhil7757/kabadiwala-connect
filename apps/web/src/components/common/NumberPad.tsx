import React from 'react';
import { Delete } from 'lucide-react';

interface NumberPadProps {
  value: string;
  onChange: (val: string) => void;
  maxDecimals?: number;
  maxDigits?: number;
}

export const NumberPad: React.FC<NumberPadProps> = ({
  value,
  onChange,
  maxDecimals = 1,
  maxDigits = 6,
}) => {
  const handleDigit = (digit: string) => {
    if (value === '0' && digit !== '.') {
      onChange(digit);
      return;
    }
    if (value.length >= maxDigits) return;

    if (digit === '.') {
      if (value.includes('.')) return;
      onChange(value ? `${value}.` : '0.');
      return;
    }

    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1] && parts[1].length >= maxDecimals) return;
    }

    onChange(`${value}${digit}`);
  };

  const handleBackspace = () => {
    if (!value || value.length <= 1) {
      onChange('');
    } else {
      onChange(value.slice(0, -1));
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'DEL'];

  return (
    <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto w-full select-none pb-4">
      {keys.map((k) => {
        if (k === 'DEL') {
          return (
            <button
              key="del"
              type="button"
              onClick={handleBackspace}
              className="h-16 w-16 mx-auto rounded-full kc-glass-strong text-kc-ink flex items-center justify-center font-bold text-xl active:bg-kc-danger/20 active:border-kc-danger/50 active:text-kc-danger transition-all touch-manipulation focus:outline-none hover:scale-[1.05]"
              aria-label="Backspace"
            >
              <Delete className="w-6 h-6" />
            </button>
          );
        }

        return (
          <button
            key={k}
            type="button"
            onClick={() => handleDigit(k)}
            className="h-16 w-16 mx-auto rounded-full kc-glass text-kc-ink font-mono font-medium text-2xl active:bg-kc-accent/20 active:border-kc-accent/50 active:scale-95 hover:scale-[1.05] hover:border-kc-accent/30 transition-all touch-manipulation focus:outline-none flex items-center justify-center"
          >
            {k}
          </button>
        );
      })}
    </div>
  );
};
