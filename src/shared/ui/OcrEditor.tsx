import React from 'react';
import { Undo, Redo, Type } from 'lucide-react';
import { Flex } from '../layout/Flex';

export interface OcrEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
}

export const OcrEditor = React.forwardRef<HTMLTextAreaElement, OcrEditorProps>(
  ({ className = '', value, onChange, label, style, disabled, ...props }, ref) => {
    
    // We can add a simple character count
    const charCount = value.length;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', ...style }} className={className}>
        <Flex justify="space-between" align="flex-end" style={{ marginBottom: 'var(--space-2)' }}>
          {label && (
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              {label}
            </label>
          )}
          
          {/* Toolbar */}
          <Flex align="flex-end" gap={2}>
            <button
              type="button"
              disabled={disabled}
              style={{
                background: 'none', border: 'none', color: 'var(--color-text-muted)',
                cursor: disabled ? 'not-allowed' : 'pointer', padding: 'var(--space-1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-sm)'
              }}
              title="Undo (Coming Soon)"
            >
              <Undo size={16} />
            </button>
            <button
              type="button"
              disabled={disabled}
              style={{
                background: 'none', border: 'none', color: 'var(--color-text-muted)',
                cursor: disabled ? 'not-allowed' : 'pointer', padding: 'var(--space-1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-sm)'
              }}
              title="Redo (Coming Soon)"
            >
              <Redo size={16} />
            </button>
          </Flex>
        </Flex>

        <div style={{ 
          position: 'relative', 
          border: '1px solid var(--color-border)', 
          borderRadius: 'var(--radius-md)', 
          backgroundColor: 'var(--color-bg-base)',
          transition: 'border-color var(--animate-fast), box-shadow var(--animate-fast)',
          display: 'flex',
          overflow: 'hidden'
        }}
        className="ocr-editor-container"
        >
          {/* Line Numbers Column (Optional enhancement, currently simplified to an icon/gutter) */}
          <div style={{
            width: '40px',
            backgroundColor: 'var(--color-bg-hover)',
            borderRight: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 'var(--space-4)',
            color: 'var(--color-text-muted)',
            userSelect: 'none',
          }}>
            <Type size={16} style={{ opacity: 0.5 }} />
          </div>

          <textarea
            ref={ref}
            value={value}
            onChange={onChange}
            disabled={disabled}
            style={{
              flex: 1,
              minHeight: '180px',
              padding: 'var(--space-4)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-mono)', // Enforce monospace
              fontSize: '1rem',
              lineHeight: '1.6',
              resize: 'vertical',
              outline: 'none',
            }}
            onFocus={(e) => {
              const container = e.currentTarget.parentElement;
              if (container) {
                container.style.borderColor = 'var(--color-primary)';
                container.style.boxShadow = '0 0 0 1px var(--color-primary)';
              }
            }}
            onBlur={(e) => {
              const container = e.currentTarget.parentElement;
              if (container) {
                container.style.borderColor = 'var(--color-border)';
                container.style.boxShadow = 'none';
              }
            }}
            aria-label={label || 'OCR Editor'}
            {...props}
          />
        </div>
        
        <Flex justify="flex-end" style={{ marginTop: 'var(--space-1)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {charCount} characters
          </span>
        </Flex>
      </div>
    );
  }
);
OcrEditor.displayName = 'OcrEditor';
