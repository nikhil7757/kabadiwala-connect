import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  brackets?: boolean;
}

/**
 * Standardized Card Primitive (Phase 1 & 2 Component)
 * - Dark noir base theme (#141614 / #1F221F)
 * - Corner bracket tech styling
 * - Equal height flex stretch support
 * - Marked with [data-qa-check="card"]
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  brackets = false,
  ...props
}) => {
  return (
    <div
      data-qa-check="card"
      className={`bg-[#141614] border border-[#1F221F] rounded-sm p-6 text-[#F5F5F5] transition-colors relative flex flex-col justify-between ${
        brackets ? 'corner-brackets' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;