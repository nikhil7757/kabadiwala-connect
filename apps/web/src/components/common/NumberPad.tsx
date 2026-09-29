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
    <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto w-full select-none">
      {keys.map((k) => {
        if (k === 'DEL') {
          return (
            <button
              key="del"
              type="button"
              onClick={handleBackspace}
              className="h-16 rounded-xs border-2 border-kc-border-strong bg-kc-surface-2 text-kc-ink flex items-center justify-center font-bold text-xl active:bg-kc-border touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus"
              aria-label="Backspace"
            >
              <Delete className="w-6 h-6 text-kc-ink" />
            </button>
          );
        }

        return (
          <button
            key={k}
            type="button"
            onClick={() => handleDigit(k)}
            className="h-16 rounded-xs border-2 border-kc-border-strong bg-kc-surface text-kc-ink font-mono font-bold text-2xl active:bg-kc-surface-2 active:translate-y-0.5 touch-manipulation focus:outline-none focus:ring-2 focus:ring-kc-focus"
          >
            {k}
          </button>
        );
      })}
    </div>
  );
};
