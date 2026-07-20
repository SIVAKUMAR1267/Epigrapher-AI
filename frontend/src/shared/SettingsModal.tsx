import React from 'react';
import { Settings, X } from 'lucide-react';
import { Card } from './ui/Card';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <Card variant="glass" className="fade-in" style={{ padding: 'var(--space-8)', maxWidth: '500px', width: '90%', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 'var(--space-1)' }}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Settings size={28} /> Settings & About
        </h2>
        
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)', fontSize: '1rem', fontWeight: 600 }}>Application Status</h3>
          <p style={{ marginBottom: 'var(--space-4)', fontSize: '0.9rem' }}>
            Version: 1.0.0 (Production Hardened)<br />
            Environment: Local
          </p>

          <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)', fontSize: '1rem', fontWeight: 600 }}>Legal Notice</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-2)' }}>
            Epigrapher provides AI-assisted analysis for educational, research, and reference purposes.
            While the application strives for accuracy, it does not guarantee the correctness, completeness, or suitability of any transcription, translation, restoration, or historical interpretation.
          </p>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Users are responsible for independently verifying results before relying on them for academic, archaeological, legal, conservation, museum, or other significant purposes.
          </p>
        </div>
      </Card>
    </div>
  );
};
