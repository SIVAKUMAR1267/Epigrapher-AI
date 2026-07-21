import React from 'react';
import { Copy, Download, Share2, RotateCcw } from 'lucide-react';
import { Card, Button, Badge } from '../../shared/ui';
import { Flex, Stack } from '../../shared/layout';
import { useAnalysisStore } from '../../stores/analysis';
import { useSettingsStore } from '../../stores/settings';
import toast from 'react-hot-toast';

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English', fr: 'French', de: 'German', es: 'Spanish', it: 'Italian',
  gr: 'Greek', he: 'Hebrew', ar: 'Arabic', ta: 'Tamil', hi: 'Hindi',
  kn: 'Kannada', te: 'Telugu', ml: 'Malayalam', mr: 'Marathi', bn: 'Bengali',
  gu: 'Gujarati', or: 'Odia', pa: 'Punjabi', sa: 'Sanskrit',
};

interface ResultsPhaseProps {
  onReset: () => void;
}

export const ResultsPhase: React.FC<ResultsPhaseProps> = ({ onReset }) => {
  const analysis = useAnalysisStore();
  const settings = useSettingsStore();

  const handleCopy = () => {
    if (analysis.translationResult?.text) {
      navigator.clipboard.writeText(analysis.translationResult.text);
      toast.success('Copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (analysis.translationResult?.text) {
      const blob = new Blob([analysis.translationResult.text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'translation.txt';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Download started');
    }
  };

  return (
    <Card padding="lg" className="fade-in">
      <Stack gap={6}>
        <Flex justify="space-between" align="center">
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: '2rem', margin: 0 }}>Translation</h2>
          <Button variant="outline" onClick={onReset} size="sm">
            <RotateCcw size={16} style={{ marginRight: '0.5rem' }} /> New Image
          </Button>
        </Flex>

        <Flex gap={3}>
          <Badge variant="outline">Source: {analysis.detectedLanguage}</Badge>
          <Badge variant="outline">Target: {LANGUAGE_NAMES[settings.defaultTargetLanguage] || settings.defaultTargetLanguage}</Badge>
        </Flex>

        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: 'var(--color-bg-base)', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--color-border)',
          whiteSpace: 'pre-wrap',
          fontFamily: 'var(--font-serif)',
          fontSize: '1.125rem',
          lineHeight: 1.6
        }}>
          {analysis.translationResult?.text || "No translation generated."}
        </div>

        {analysis.translationResult?.notes && (
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-primary-bg)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary)' }}>
            <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Translator's Notes</strong>
            <span style={{ color: 'var(--color-text-secondary)' }}>{analysis.translationResult.notes}</span>
          </div>
        )}

        <Flex gap={3} style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <Button variant="outline" onClick={handleCopy}>
            <Copy size={16} style={{ marginRight: '0.5rem' }}/> Copy
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download size={16} style={{ marginRight: '0.5rem' }}/> Download TXT
          </Button>
          <Button variant="outline" onClick={() => toast('Sharing coming soon!')}>
            <Share2 size={16} style={{ marginRight: '0.5rem' }}/> Share
          </Button>
        </Flex>
      </Stack>
    </Card>
  );
};
