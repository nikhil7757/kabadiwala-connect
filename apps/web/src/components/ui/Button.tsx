import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'money';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/**
 * Standardized Button Primitive (Phase 1 & 2 Component)
 * - Guarantees minimum 44px tap target height (WCAG 2.5.5 / mobile accessible)
 * - Marked with [data-qa-check="button"]
 * - Accessible focus rings & active feedback
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'min-h-[44px] px-3.5 py-2 text-xs font-mono',
    md: 'min-h-[44px] px-5 py-2.5 text-sm font-heading font-bold uppercase tracking-wider',
    lg: 'min-h-[48px] px-8 py-3.5 text-base font-heading font-bold uppercase tracking-wider',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] glow-lime border border-[#A3E635] active:scale-[0.98]',
    secondary:
      'bg-[#141614] hover:bg-[#1B1E1B] text-[#F5F5F5] border border-[#1F221F] hover:border-[#6A6E6A]',
    outline:
      'bg-transparent hover:bg-[#141614] text-[#A3E635] border border-[#A3E635] hover:border-[#bbf451]',
    money:
      'bg-[#FFB020] hover:bg-[#ffbe42] text-[#0A0B0A] border border-[#FFB020] active:scale-[0.98]',
  };

  return (
    <button
      data-qa-check="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-sm transition-all select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;