import React from 'react';
import { Container, Stack, Flex } from '../shared/layout';
import { Card, Button } from '../shared/ui';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { config } from '../config';
import toast from 'react-hot-toast';

import { AppPhase, useWorkflowStore } from '../stores/workflow';
import { useAnalysisStore } from '../stores/analysis';
import { useSettingsStore } from '../stores/settings';
import { useHistoryStore } from '../stores/history';

import { UploadPhase } from '../features/upload/UploadPhase';
import { ProcessingPhase } from '../features/shared/ProcessingPhase';
import { ReviewPhase } from '../features/ocr/ReviewPhase';
import { ResultsPhase } from '../features/translation/ResultsPhase';

// Helper to optimize image
const optimizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1600;
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          reject(new Error('Canvas context not available'));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export default function HomePage() {
  const workflow = useWorkflowStore();
  const analysis = useAnalysisStore();
  const settings = useSettingsStore();
  const history = useHistoryStore();

  const ocrMutation = useMutation({
    mutationFn: async (base64Image: string) => {
      const res = await fetch(`${config.VITE_API_URL}/api/transcribe-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, language: 'auto' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to extract text from image.');
      if (data.warnings && data.warnings.length > 0 && data.text.trim() === '') {
        throw new Error(data.warnings[0]);
      }
      return data;
    },
    onSuccess: (data) => {
      analysis.setOCRData({
        text: data.text || '',
        language: data.detected_language || 'Unknown Script',
        confidence: data.confidence || 0,
        warnings: data.warnings || []
      });
      workflow.setPhase(AppPhase.Review);
    },
    onError: (error: Error) => {
      workflow.setErrorMessage(error.message || 'An unexpected error occurred during OCR.');
    }
  });

  const translateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${config.VITE_API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: analysis.transcriptionText,
          language: analysis.detectedLanguage.toLowerCase().includes('greek') ? 'greek' : 'latin',
          tasks: ['translate'],
          targetLanguage: settings.defaultTargetLanguage
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Translation failed.');
      if (data.error) throw new Error(data.error);
      return data.translation;
    },
    onSuccess: (translationResult) => {
      analysis.setTranslationResult(translationResult);
      workflow.setPhase(AppPhase.Results);
      
      if (settings.saveHistory) {
        history.addEntry({
          thumbnailUrl: analysis.imagePreview || '',
          script: analysis.detectedLanguage,
          language: analysis.detectedLanguage,
          confidence: analysis.confidence,
          targetLanguage: settings.defaultTargetLanguage,
          transcription: analysis.transcriptionText,
          translation: translationResult.text,
          notes: translationResult.notes
        });
      }
    },
    onError: (error: Error) => {
      workflow.setErrorMessage(error.message || 'An unexpected error occurred during translation.');
    }
  });

  const handleImageSelected = async (file: File) => {
    try {
      workflow.setPhase(AppPhase.ProcessingOCR);
      const base64Image = await optimizeImage(file);
      analysis.setImagePreview(base64Image);
      ocrMutation.mutate(base64Image);
    } catch (err: any) {
      workflow.setErrorMessage(err.message || 'Failed to process image locally.');
    }
  };

  const handleReset = () => {
    analysis.resetAnalysis();
    workflow.resetWorkflow();
    ocrMutation.reset();
    translateMutation.reset();
  };

  return (
    <Container maxWidth="lg">
      
      {workflow.phase === AppPhase.Upload && (
        <UploadPhase onImageSelected={handleImageSelected} />
      )}

      {workflow.phase === AppPhase.ProcessingOCR && (
        <ProcessingPhase 
          title="Extracting ancient text..." 
          subtitle="Detecting scripts, normalizing noise, and preserving gaps." 
        />
      )}

      {workflow.phase === AppPhase.Review && (
        <ReviewPhase 
          onTranslate={() => {
            workflow.setPhase(AppPhase.ProcessingTranslation);
            translateMutation.mutate();
          }} 
          onReset={handleReset} 
        />
      )}

      {workflow.phase === AppPhase.ProcessingTranslation && (
        <ProcessingPhase 
          title={`Translating to ${settings.defaultTargetLanguage}...`} 
          subtitle="Preserving historical context and cultural nuances." 
        />
      )}

      {workflow.phase === AppPhase.Results && (
        <ResultsPhase onReset={handleReset} />
      )}

      {workflow.phase === AppPhase.Error && (
        <Card padding="lg" className="fade-in" style={{ border: '1px solid var(--color-error)' }}>
          <Flex direction="column" align="center" gap={4} style={{ textAlign: 'center' }}>
            <AlertTriangle size={48} color="var(--color-error)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-error)', margin: 0 }}>Processing Failed</h2>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{workflow.errorMessage}</p>
            <Button variant="secondary" onClick={handleReset} style={{ marginTop: '1rem' }}>
              <RotateCcw size={16} style={{ marginRight: '0.5rem' }}/> Try Again
            </Button>
          </Flex>
        </Card>
      )}

    </Container>
  );
}
