import React from 'react';
import { LucideIcon } from 'lucide-react';

export type IconSize = 12 | 14 | 16 | 18 | 20 | 24 | 28 | 32 | number;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: LucideIcon;
  size?: IconSize;
  className?: string;
  'aria-label'?: string;
}

/**
 * Standardized Icon Primitive (Phase 2 Component)
 * - Strict fixed size props: 16 | 20 | 24 px
 * - Rigid flex-shrink-0 to prevent flex item crushing
 * - Marked with [data-qa-check="icon"]
 * - Standardized SVG rendering
 */
export const Icon: React.FC<IconProps> = ({
  icon: LucideComponent,
  size = 20,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  return (
    <LucideComponent
      data-qa-check="icon"
      size={size}
      className={`shrink-0 aspect-square ${className}`}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      {...props}
    />
  );
};

export default Icon;
