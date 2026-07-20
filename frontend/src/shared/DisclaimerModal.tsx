import React, { useState, useEffect } from 'react';
import { BrainCircuit, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export const DisclaimerModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('aiDisclaimerAccepted');
    if (!accepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('aiDisclaimerAccepted', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <Card variant="glass" className="fade-in" style={{ padding: 'var(--space-8)', maxWidth: '600px', width: '90%' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <BrainCircuit size={28} /> AI-Assisted Analysis
        </h2>
        
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7', marginBottom: 'var(--space-8)', fontSize: '0.95rem' }}>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            Epigrapher uses artificial intelligence to assist with the transcription, restoration, transliteration, translation, and historical interpretation of ancient inscriptions.
          </p>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            AI-generated results may contain errors, uncertainties, or multiple valid interpretations, particularly when inscriptions are damaged, incomplete, ambiguous, or difficult to read.
          </p>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            The application is designed to assist researchers, students, archaeologists, and historians, but its results should not be treated as definitive scholarly conclusions without independent verification.
          </p>
          <p>
            For academic publications, archaeological reports, museum documentation, legal matters, or other important decisions, always verify the results using primary sources and qualified experts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={() => alert('Redirecting to AI documentation...')}>
            Learn More
          </Button>
          <Button variant="primary" onClick={handleAccept}>
            <CheckCircle2 size={16} /> I Understand
          </Button>
        </div>
      </Card>
    </div>
  );
};
