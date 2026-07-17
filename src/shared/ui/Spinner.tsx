import React from 'react';

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className = '', size = 'md', style, ...props }, ref) => {
    
    const sizeStyles = {
      sm: { width: '16px', height: '16px' },
      md: { width: '24px', height: '24px' },
      lg: { width: '32px', height: '32px' },
      xl: { width: '48px', height: '48px' },
    };

    return (
      <svg
        ref={ref}
        className={`animate-spin ${className}`}
        style={{
          ...sizeStyles[size],
          animation: 'spin 1s linear infinite',
          ...style
        }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    );
  }
);
Spinner.displayName = 'Spinner';
