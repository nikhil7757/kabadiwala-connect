import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  'data-qa-check'?: string;
}

/**
 * Standardized Global Container Component (Phase 1 Foundation)
 * - Maximum width: 1280px
 * - Centered via mx-auto
 * - Responsive horizontal padding: 16px (mobile) / 24px (tablet sm/md) / 32px (desktop lg+)
 * - Guarantees zero edge-collision or horizontal overflow
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  id,
  as: Component = 'div',
  'data-qa-check': dataQaCheck = 'container',
}) => {
  return (
    <Component
      id={id}
      data-qa-check={dataQaCheck}
      className={`w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 min-w-0 ${className}`}
    >
      {children}
    </Component>
  );
};

export default Container;
