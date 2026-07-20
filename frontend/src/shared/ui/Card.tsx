import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', padding = 'md', children, style, ...props }, ref) => {
    
    const variantStyles = {
      default: { backgroundColor: 'var(--color-bg-panel)', border: '1px solid var(--color-border)' },
      glass: { 
        backgroundColor: 'var(--color-bg-panel)', 
        border: '1px solid var(--color-border)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      },
      outline: { backgroundColor: 'transparent', border: '1px solid var(--color-border)' },
    };

    const paddingStyles = {
      none: { padding: '0' },
      sm: { padding: 'var(--space-4)' },
      md: { padding: 'var(--space-6)' },
      lg: { padding: 'var(--space-8)' },
    };

    return (
      <div
        ref={ref}
        style={{
          ...variantStyles[variant],
          ...paddingStyles[padding],
          borderRadius: 'var(--radius-lg)',
          boxShadow: variant === 'glass' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          transition: 'box-shadow var(--animate-normal) var(--ease-out), border-color var(--animate-normal) var(--ease-out)',
          ...style
        }}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
