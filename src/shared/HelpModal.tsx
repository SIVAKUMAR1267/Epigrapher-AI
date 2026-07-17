import React from 'react';
import { Info, X } from 'lucide-react';
import { Card } from './ui/Card';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <Card variant="glass" className="fade-in" style={{ padding: 'var(--space-8)', maxWidth: '600px', width: '90%', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 'var(--space-1)' }}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Info size={28} /> About AI Analysis
        </h2>
        
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)', fontSize: '1rem', fontWeight: 600 }}>How OCR Works</h3>
          <p style={{ marginBottom: 'var(--space-4)', fontSize: '0.9rem' }}>
            Optical Character Recognition (OCR) attempts to identify individual characters in the uploaded image. Damage, fading, and lighting can reduce its ability to accurately read ancient glyphs.
          </p>

          <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)', fontSize: '1rem', fontWeight: 600 }}>Script & Language Detection</h3>
          <p style={{ marginBottom: 'var(--space-4)', fontSize: '0.9rem' }}>
            The AI analyzes the shapes of the characters to determine the likely script (e.g., Brahmi) and the language (e.g., Prakrit). Sometimes scripts look very similar, leading to multiple possible matches.
          </p>

          <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)', fontSize: '1rem', fontWeight: 600 }}>Translation & Interpretation</h3>
          <p style={{ marginBottom: 'var(--space-4)', fontSize: '0.9rem' }}>
            Ancient languages often lack direct modern equivalents. The AI provides the most likely scholarly interpretation based on historical context, but alternative translations are frequently possible.
          </p>

          <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)', fontSize: '1rem', fontWeight: 600 }}>Confidence Scores</h3>
          <p style={{ marginBottom: 'var(--space-4)', fontSize: '0.9rem' }}>
            Confidence scores indicate how certain the AI is about its reading. A low confidence score (below 70%) means you should be highly skeptical of the result and manually verify the characters.
          </p>

          <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)', fontSize: '1rem', fontWeight: 600 }}>Limitations of AI</h3>
          <p style={{ fontSize: '0.9rem' }}>
            AI cannot replace human epigraphists. It may confidently hallucinate text if the image is too blurry. It is a powerful tool to assist research, not to finalize it.
          </p>
        </div>
      </Card>
    </div>
  );
};
