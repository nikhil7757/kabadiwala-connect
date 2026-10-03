import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Standardized Container Primitive (Phase 1 Foundation)
 * - Max-width 1280px
 * - Centered via mx-auto
 * - Responsive horizontal padding: 16px mobile (px-4) / 24px tablet (sm:px-6) / 32px desktop (lg:px-8)
 * - min-w-0 to prevent flex/grid blowout
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={`max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 min-w-0 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;
