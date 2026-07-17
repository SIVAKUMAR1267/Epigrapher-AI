import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', children, style, ...props }, ref) => {
    
    const variantStyles = {
      default: { backgroundColor: 'var(--color-bg-hover)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' },
      success: { backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', border: '1px solid rgba(34, 197, 94, 0.2)' },
      warning: { backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)', border: '1px solid rgba(245, 158, 11, 0.2)' },
      danger: { backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)' },
      outline: { backgroundColor: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' },
    };

    return (
      <span
        ref={ref}
        style={{
          ...variantStyles[variant],
          display: 'inline-flex',
          alignItems: 'center',
          padding: '2px 8px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 500,
          lineHeight: 1.5,
          whiteSpace: 'nowrap',
          ...style
        }}
        className={className}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';
