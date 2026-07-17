import React from 'react';
import { Flex } from '../layout/Flex';
import { Check } from 'lucide-react';

export interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  return (
    <div style={{ width: '100%', marginBottom: 'var(--space-6)' }}>
      <Flex align="center" justify="space-between" style={{ position: 'relative' }}>
        {/* Background Line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          right: '0',
          height: '1px',
          backgroundColor: 'var(--color-border)',
          zIndex: 0,
        }} />
        
        {/* Active Line (fills up to current step) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          width: `${(currentStep / (steps.length - 1)) * 100}%`,
          height: '1px',
          backgroundColor: 'var(--color-primary)',
          zIndex: 1,
          transition: 'width var(--animate-slow) var(--ease-out)',
        }} />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;
          
          return (
            <div key={step} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              zIndex: 2, 
              backgroundColor: 'var(--color-bg-base)',
              padding: '0 var(--space-2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isCompleted || isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                opacity: isPending ? 0.5 : 1,
              }}>
                {isCompleted ? <Check size={14} strokeWidth={3} /> : isActive ? <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-primary)'}} /> : <div style={{width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-text-muted)'}} />}
              </div>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: isActive ? 600 : 500,
                color: isCompleted || isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                opacity: isPending ? 0.5 : 1,
                transition: 'color var(--animate-normal) var(--ease-out)',
              }}>
                {step}
              </div>
            </div>
          );
        })}
      </Flex>
    </div>
  );
};
