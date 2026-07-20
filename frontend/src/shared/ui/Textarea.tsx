import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, style, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        style={{
          width: '100%',
          minHeight: '100px',
          padding: 'var(--space-3) var(--space-4)',
          backgroundColor: 'var(--color-bg-input)',
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text)',
          fontSize: '1rem',
          fontFamily: 'var(--font-sans)',
          transition: 'all 0.2s ease',
          outline: 'none',
          resize: 'vertical',
          ...style
        }}
        className={className}
        onFocus={(e) => {
          if (!error) e.target.style.borderColor = 'var(--color-primary)';
          e.target.style.boxShadow = `0 0 0 2px ${error ? 'var(--color-error-bg)' : 'var(--color-primary-bg)'}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
