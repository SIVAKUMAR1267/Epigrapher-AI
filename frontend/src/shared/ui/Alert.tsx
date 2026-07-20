import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Flex } from '../layout/Flex';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  icon?: React.ReactNode;
  expandable?: boolean;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = '', variant = 'info', title, icon, expandable = false, children, style, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const variantStyles = {
      info: { backgroundColor: 'var(--color-bg-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' },
      success: { backgroundColor: 'var(--color-success-bg)', border: '1px solid rgba(34, 197, 94, 0.2)', color: 'var(--color-success)' },
      warning: { backgroundColor: 'var(--color-warning-bg)', border: '1px solid rgba(245, 158, 11, 0.2)', color: 'var(--color-warning)' },
      error: { backgroundColor: 'var(--color-danger-bg)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--color-danger)' },
    };

    const hasContent = Boolean(children);

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        style={{
          ...variantStyles[variant],
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          ...style
        }}
        className={className}
        {...props}
      >
        <Flex align="center" justify="space-between" style={{ width: '100%' }}>
          <Flex align="center" gap={3}>
            {icon && (
              <div style={{ flexShrink: 0, display: 'flex' }}>
                {icon}
              </div>
            )}
            {title && <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{title}</span>}
            {!title && !expandable && hasContent && (
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{children}</div>
            )}
          </Flex>
          
          {expandable && hasContent && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                padding: 'var(--space-1)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              <span style={{ fontSize: '0.8rem', marginLeft: 'var(--space-1)' }}>
                {isExpanded ? 'Hide Details' : 'Show Details'}
              </span>
            </button>
          )}
        </Flex>

        {(isExpanded || (!expandable && title)) && hasContent && (
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-secondary)', 
            marginTop: 'var(--space-2)',
            marginLeft: icon ? 'calc(24px + var(--space-3))' : 0, 
          }}>
            {children}
          </div>
        )}
      </div>
    );
  }
);
Alert.displayName = 'Alert';
