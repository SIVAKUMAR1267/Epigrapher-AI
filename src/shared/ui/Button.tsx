import React, { useState } from 'react';
import { Spinner } from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, style, ...props }, ref) => {
    
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const variantStyles = {
      primary: { 
        backgroundColor: isHovered ? 'var(--color-primary-hover)' : 'var(--color-primary)', 
        color: '#fff', 
        border: 'none',
        boxShadow: isActive ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : 'none',
      },
      secondary: { 
        backgroundColor: isHovered ? 'var(--color-border)' : 'var(--color-bg-hover)', 
        color: 'var(--color-text-primary)', 
        border: '1px solid var(--color-border)',
        boxShadow: isActive ? 'inset 0 2px 4px rgba(0,0,0,0.05)' : 'none',
      },
      outline: { 
        backgroundColor: isHovered ? 'var(--color-bg-hover)' : 'transparent', 
        color: 'var(--color-text-primary)', 
        border: '1px solid var(--color-border)',
        boxShadow: isActive ? 'inset 0 2px 4px rgba(0,0,0,0.05)' : 'none',
      },
      ghost: { 
        backgroundColor: isHovered ? 'var(--color-bg-hover)' : 'transparent', 
        color: 'var(--color-text-primary)', 
        border: 'none',
        boxShadow: isActive ? 'inset 0 2px 4px rgba(0,0,0,0.05)' : 'none',
      },
      danger: { 
        backgroundColor: isHovered ? '#b91c1c' : 'var(--color-danger)', 
        color: '#fff', 
        border: 'none',
        boxShadow: isActive ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : 'none',
      },
      success: { 
        backgroundColor: isHovered ? '#15803d' : 'var(--color-success)', 
        color: '#fff', 
        border: 'none',
        boxShadow: isActive ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : 'none',
      },
    };

    const sizeStyles = {
      sm: { height: '36px', padding: '0 var(--space-3)', fontSize: '0.875rem' },
      md: { height: '48px', padding: '0 var(--space-4)', fontSize: '1rem' },
      lg: { height: '56px', padding: '0 var(--space-6)', fontSize: '1.125rem' },
      icon: { height: '48px', width: '48px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
    };

    const currentVariant = variantStyles[variant];
    const currentSize = sizeStyles[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        onMouseEnter={(e) => { setIsHovered(true); props.onMouseEnter?.(e); }}
        onMouseLeave={(e) => { setIsHovered(false); setIsActive(false); props.onMouseLeave?.(e); }}
        onMouseDown={(e) => { setIsActive(true); props.onMouseDown?.(e); }}
        onMouseUp={(e) => { setIsActive(false); props.onMouseUp?.(e); }}
        style={{
          ...currentVariant,
          ...currentSize,
          borderRadius: 'var(--radius-md)',
          cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
          opacity: (disabled || isLoading) ? 'var(--opacity-disabled)' : 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-2)',
          fontWeight: 600,
          transition: 'all var(--animate-fast) var(--ease-out)',
          outline: 'none',
          ...style
        }}
        className={className}
        {...props}
      >
        {isLoading && <Spinner size="sm" />}
        {!isLoading && children}
      </button>
    );
  }
);
Button.displayName = 'Button';
