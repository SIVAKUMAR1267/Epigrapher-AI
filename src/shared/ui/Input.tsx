import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, style, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: '100%', ...style }}>
        {label && (
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
            {label}
          </label>
        )}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {icon && (
            <div style={{ position: 'absolute', left: 'var(--space-3)', color: 'var(--color-text-muted)', display: 'flex' }}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={className}
            style={{
              width: '100%',
              height: '48px',
              padding: icon ? 'var(--space-2) var(--space-4) var(--space-2) var(--space-10)' : 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
              backgroundColor: 'var(--color-bg-base)',
              color: 'var(--color-text-primary)',
              fontSize: '1rem',
              fontFamily: 'inherit',
              transition: 'border-color var(--animate-fast) var(--ease-out), box-shadow var(--animate-fast) var(--ease-out)',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-primary)';
              e.currentTarget.style.boxShadow = `0 0 0 1px ${error ? 'var(--color-danger)' : 'var(--color-primary)'}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            {...props}
          />
        </div>
        {error && (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
