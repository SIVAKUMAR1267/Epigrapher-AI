import React from 'react';
import { RotateCcw, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { Card, Button, Badge, Select, Textarea } from '../../shared/ui';
import { Flex, Stack } from '../../shared/layout';
import { useAnalysisStore } from '../../stores/analysis';
import { useSettingsStore } from '../../stores/settings';

interface ReviewPhaseProps {
  onTranslate: () => void;
  onReset: () => void;
}

export const ReviewPhase: React.FC<ReviewPhaseProps> = ({ onTranslate, onReset }) => {
  const analysis = useAnalysisStore();
  const settings = useSettingsStore();

  return (
    <Card padding="lg" className="fade-in">
      <Stack gap={6}>
        <Flex justify="space-between" align="center">
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: '1.8rem', margin: 0 }}>Review Extraction</h2>
          <Button variant="outline" onClick={onReset} size="sm">
            <RotateCcw size={16} style={{ marginRight: '0.5rem' }} /> Start Over
          </Button>
        </Flex>
        
        {analysis.imagePreview && (
          <div style={{ textAlign: 'center', background: 'var(--color-bg-base)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
            <img src={analysis.imagePreview} alt="Preview" style={{ maxHeight: '120px', borderRadius: '4px' }} />
          </div>
        )}

        <Flex gap={3} wrap="wrap">
          <Badge variant="default">
            <CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> 
            Detected: {analysis.detectedLanguage || 'Unknown'}
          </Badge>
          <Badge variant="outline">Confidence: {(analysis.confidence * 100).toFixed(0)}%</Badge>
          {analysis.warnings.map((w, i) => (
            <Badge key={i} variant="outline" style={{ color: 'var(--color-error)', borderColor: 'var(--color-error-bg)' }}>
              <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> {w}
            </Badge>
          ))}
        </Flex>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Extracted Text (Editable)</label>
          <Textarea 
            value={analysis.transcriptionText}
            onChange={(e) => analysis.setTranscriptionText(e.target.value)}
            style={{ minHeight: '150px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Target Language</label>
          <Select 
            value={settings.defaultTargetLanguage}
            onChange={(value: string) => settings.setDefaultTargetLanguage(value as any)}
            options={[
              { label: 'English', value: 'en' },
              { label: 'Spanish', value: 'es' },
              { label: 'French', value: 'fr' },
              { label: 'German', value: 'de' },
              { label: 'Modern Greek', value: 'el' },
              {
                label: 'Indian Languages',
                options: [
                  { label: 'Hindi', value: 'hi' },
                  { label: 'Bengali', value: 'bn' },
                  { label: 'Telugu', value: 'te' },
                  { label: 'Marathi', value: 'mr' },
                  { label: 'Tamil', value: 'ta' },
                  { label: 'Urdu', value: 'ur' },
                  { label: 'Sanskrit', value: 'sa' },
                ]
              }
            ]}
          />
        </div>

        <Button onClick={onTranslate} size="lg" style={{ width: '100%' }}>
          <FileText size={20} style={{ marginRight: '0.5rem' }} /> Translate Document
        </Button>
      </Stack>
    </Card>
  );
};
