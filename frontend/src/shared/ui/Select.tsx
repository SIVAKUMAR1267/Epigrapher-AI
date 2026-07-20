import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps {
  options: (SelectOption | SelectGroup)[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({ options, value, onChange, label, placeholder = 'Select...', disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten options for easy lookup
  const flatOptions = options.flatMap(opt => 'options' in opt ? opt.options : [opt]);
  const selectedOption = flatOptions.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: '100%', position: 'relative' }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
          {label}
        </label>
      )}
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '48px',
          padding: 'var(--space-2) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${isOpen ? 'var(--color-primary)' : 'var(--color-border)'}`,
          backgroundColor: disabled ? 'var(--color-bg-hover)' : 'var(--color-bg-base)',
          color: selectedOption ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
          fontSize: '1rem',
          fontFamily: 'inherit',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'border-color var(--animate-fast) var(--ease-out), box-shadow var(--animate-fast) var(--ease-out)',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 1px var(--color-primary)' : 'none',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {selectedOption?.icon}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={18} style={{ color: 'var(--color-text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--animate-fast) var(--ease-out)' }} />
      </button>

      {isOpen && !disabled && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + var(--space-1))',
          left: 0,
          right: 0,
          maxHeight: '300px',
          overflowY: 'auto',
          backgroundColor: 'var(--color-bg-panel)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 'var(--z-above)',
          padding: 'var(--space-2)',
        }}>
          {options.map((opt, index) => {
            if ('options' in opt) {
              return (
                <div key={index} style={{ marginBottom: 'var(--space-2)' }}>
                  <div style={{ padding: 'var(--space-1) var(--space-3)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {opt.label}
                  </div>
                  {opt.options.map((subOpt) => (
                    <OptionItem key={subOpt.value} option={subOpt} isSelected={subOpt.value === value} onSelect={() => handleSelect(subOpt.value)} />
                  ))}
                </div>
              );
            }
            return <OptionItem key={opt.value} option={opt} isSelected={opt.value === value} onSelect={() => handleSelect(opt.value)} />;
          })}
        </div>
      )}
    </div>
  );
};

const OptionItem: React.FC<{ option: SelectOption; isSelected: boolean; onSelect: () => void }> = ({ option, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-2) var(--space-3)',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: isSelected ? 'var(--color-primary-hover)' : isHovered ? 'var(--color-bg-hover)' : 'transparent',
        color: isSelected ? '#fff' : 'var(--color-text-primary)',
        cursor: 'pointer',
        transition: 'background-color var(--animate-fast) var(--ease-out)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {option.icon}
        {option.label}
      </span>
      {isSelected && <Check size={16} />}
    </div>
  );
};
