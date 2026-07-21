import React, { useRef, useState, useEffect, useCallback } from 'react';
import { UploadCloud, Type, Image as ImageIcon, FileWarning, ArrowRight } from 'lucide-react';
import { Card, Button } from '../../shared/ui';
import { Flex } from '../../shared/layout';

interface UploadPhaseProps {
  onImageSelected: (file: File | null, manualText?: string) => void;
}

export const UploadPhase: React.FC<UploadPhaseProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualText, setManualText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file.');
      return;
    }
    // Perform a quick blur check on the client-side
    // We will just do a basic check by loading the image
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      // Pass the file down
      onImageSelected(file);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setErrorMsg('Failed to read image. It might be corrupted.');
    };
    img.src = url;
  }, [onImageSelected]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (manualMode) return; // Don't steal paste if typing
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) processFile(file);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [manualMode, processFile]);

  return (
    <Card padding="lg" className="fade-in">
      <Flex justify="space-between" align="center" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', fontSize: '1.5rem', margin: 0 }}>
          {manualMode ? 'Manual Entry' : 'Select an Inscription'}
        </h2>
        <Button 
          variant="secondary" 
          onClick={() => {
            setManualMode(!manualMode);
            setErrorMsg(null);
          }}
        >
          {manualMode ? <ImageIcon size={16} style={{ marginRight: '0.5rem' }}/> : <Type size={16} style={{ marginRight: '0.5rem' }}/>}
          {manualMode ? 'Upload Image Instead' : 'Type Manually'}
        </Button>
      </Flex>

      {errorMsg && (
        <div style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error-content)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileWarning size={16} />
          {errorMsg}
        </div>
      )}

      {manualMode ? (
        <Flex direction="column" gap={4}>
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Type or paste the inscription text here..."
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-base)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
          <Button 
            variant="primary" 
            disabled={!manualText.trim()} 
            onClick={() => onImageSelected(null, manualText)}
            style={{ alignSelf: 'flex-end' }}
          >
            Continue <ArrowRight size={16} style={{ marginLeft: '0.5rem' }}/>
          </Button>
        </Flex>
      ) : (
        <>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileChange} 
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '4rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: isDragging ? 'var(--color-primary-bg)' : 'var(--color-bg-base)',
            }}
            onMouseOver={(e) => (!isDragging && (e.currentTarget.style.borderColor = 'var(--color-primary)'))}
            onMouseOut={(e) => (!isDragging && (e.currentTarget.style.borderColor = 'var(--color-border)'))}
          >
            <Flex direction="column" align="center" gap={3}>
              <UploadCloud size={48} color={isDragging ? 'var(--color-primary)' : 'var(--color-primary-muted)'} />
              <div style={{ fontWeight: 500, fontSize: '1.125rem' }}>
                {isDragging ? 'Drop image here' : 'Click, Drag & Drop, or Paste an image here'}
              </div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                Supports high-res JPG, PNG, WEBP. Images are optimized automatically.
              </div>
            </Flex>
          </div>
        </>
      )}
    </Card>
  );
};
