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

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          {/* Left Column: Image Preview */}
          {analysis.imagePreview && (
            <div style={{ flex: '1 1 300px', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Original Image</label>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <img src={analysis.imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '4px' }} />
              </div>
            </div>
          )}

          {/* Right Column: Editor */}
          <div style={{ flex: '2 1 400px', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Extracted Text (Editable)</label>
              <Textarea 
                value={analysis.transcriptionText}
                onChange={(e) => analysis.setTranscriptionText(e.target.value)}
                style={{ minHeight: '200px', width: '100%', fontFamily: 'var(--font-mono)' }}
              />
            </div>
            
            <Flex gap={4} wrap="wrap">
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Target Language</label>
                <Select 
                  value={settings.defaultTargetLanguage}
                  onChange={(value: string) => settings.setDefaultTargetLanguage(value as any)}
                  options={[
                    {
                      label: 'Indian Languages',
                      options: [
                        { label: 'Tamil', value: 'ta' },
                        { label: 'Telugu', value: 'te' },
                        { label: 'Kannada', value: 'kn' },
                        { label: 'Malayalam', value: 'ml' },
                        { label: 'Hindi', value: 'hi' },
                        { label: 'Marathi', value: 'mr' },
                        { label: 'Gujarati', value: 'gu' },
                        { label: 'Punjabi', value: 'pa' },
                        { label: 'Odia', value: 'or' },
                        { label: 'Bengali', value: 'bn' },
                        { label: 'Sanskrit', value: 'sa' },
                        { label: 'Urdu', value: 'ur' },
                      ]
                    },
                    {
                      label: 'International',
                      options: [
                        { label: 'English', value: 'en' },
                        { label: 'French', value: 'fr' },
                        { label: 'German', value: 'de' },
                        { label: 'Spanish', value: 'es' },
                        { label: 'Italian', value: 'it' },
                        { label: 'Modern Greek', value: 'el' },
                        { label: 'Japanese', value: 'ja' },
                        { label: 'Chinese', value: 'zh' },
                        { label: 'Arabic', value: 'ar' },
                      ]
                    }
                  ]}
                />
              </div>

              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Display Mode</label>
                <Select 
                  value={settings.analysisDisplayMode}
                  onChange={(value: string) => settings.setAnalysisDisplayMode(value as any)}
                  options={[
                    { label: 'Target Language', value: 'target_only' },
                    { label: 'Bilingual (Target + English)', value: 'bilingual' },
                    { label: 'English Only', value: 'english_only' },
                    { label: 'Research (Raw)', value: 'research' }
                  ]}
                />
              </div>
            </Flex>

            <Button onClick={onTranslate} size="lg" style={{ width: '100%', marginTop: 'auto' }}>
              <FileText size={20} style={{ marginRight: '0.5rem' }} /> Translate Document
            </Button>
          </div>
        </div>
      </Stack>
    </Card>
  );
};
