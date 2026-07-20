import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = '', variant = 'text', width, height, style, ...props }, ref) => {
    
    const variantStyles = {
      text: { borderRadius: '4px', height: height || '1em' },
      circular: { borderRadius: '50%', height: height || '40px', width: width || '40px' },
      rectangular: { borderRadius: '0px', height: height || '100px', width: width || '100%' },
      rounded: { borderRadius: 'var(--radius-sm)', height: height || '100px', width: width || '100%' },
    };

    return (
      <div
        ref={ref}
        style={{
          ...variantStyles[variant],
          width: width !== undefined ? width : (variant === 'text' ? '100%' : undefined),
          backgroundColor: 'var(--color-bg-hover)',
          backgroundImage: 'linear-gradient(90deg, var(--color-bg-hover) 0px, var(--color-border) 40px, var(--color-bg-hover) 80px)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite linear',
          ...style
        }}
        className={`skeleton ${className}`}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';
