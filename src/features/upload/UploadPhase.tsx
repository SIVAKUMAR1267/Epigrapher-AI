import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { Card } from '../../shared/ui';
import { Flex } from '../../shared/layout';

interface UploadPhaseProps {
  onImageSelected: (file: File) => void;
}

export const UploadPhase: React.FC<UploadPhaseProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
  };

  return (
    <Card padding="lg" className="fade-in">
      <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        Select an Inscription
      </h2>
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />
      <div 
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '4rem 2rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: 'var(--color-bg-base)',
        }}
        onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
        onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
      >
        <Flex direction="column" align="center" gap={3}>
          <UploadCloud size={48} color="var(--color-primary)" />
          <div style={{ fontWeight: 500, fontSize: '1.125rem' }}>Click or Drag & Drop an image here</div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Supports high-res JPG, PNG, WEBP. Images are optimized automatically.
          </div>
        </Flex>
      </div>
    </Card>
  );
};
