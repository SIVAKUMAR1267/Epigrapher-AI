import React, { useState } from 'react';
import { Copy, Download, RotateCcw, Globe, FileText, Type, Info, BookOpen, Search, MessageSquare, AlertTriangle, ChevronDown, Printer, Share2, Clock } from 'lucide-react';
import { Card, Button, Badge } from '../../shared/ui';
import { Flex, Stack, Grid } from '../../shared/layout';
import { useAnalysisStore } from '../../stores/analysis';
import { useSettingsStore } from '../../stores/settings';
import { t } from '../../i18n';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';

interface ResultsPhaseProps {
  onReset: () => void;
}

export const ResultsPhase: React.FC<ResultsPhaseProps> = ({ onReset }) => {
  const analysis = useAnalysisStore();
  const settings = useSettingsStore();
  const result = analysis.translationResult;
  const lang = settings.defaultTargetLanguage;
  
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  if (!result) return null;

  const buildFullText = () => {
    let text = `${t('translation', lang)}:\n${result.translation}\n\n`;
    text += `${t('original_inscription', lang)}:\n${result.original}\n\n`;
    text += `${t('transliteration', lang)}:\n${result.transliteration}\n\n`;
    
    text += `--- Metadata ---\n`;
    text += `${t('detected_script', lang)}: ${result.script_detected}\n`;
    text += `${t('ancient_language', lang)}: ${result.ancient_language}\n`;
    text += `${t('period', lang)}: ${result.estimated_period}\n`;
    if (result.dynasty) text += `${t('dynasty', lang)}: ${result.dynasty}\n`;
    if (result.region) text += `${t('region', lang)}: ${result.region}\n`;
    text += `${t('confidence', lang)}: ${(result.confidence * 100).toFixed(0)}%\n\n`;
    
    if (result.historical_analysis) text += `${t('historical_analysis', lang)}:\n${result.historical_analysis}\n\n`;
    if (result.archaeological_notes) text += `${t('archaeological_notes', lang)}:\n${result.archaeological_notes}\n\n`;
    if (result.alternative_interpretations) text += `${t('alternative_interpretations', lang)}:\n${result.alternative_interpretations}\n\n`;
    
    return text;
  };

  const handleCopy = (type: 'translation' | 'full') => {
    const text = type === 'translation' ? result.translation : buildFullText();
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
    setShowCopyMenu(false);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([buildFullText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_${lang}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Download started');
    setShowDownloadMenu(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Epigrapher AI Translation',
          text: result.translation,
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      handleCopy('translation');
    }
  };

  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF();
      const margin = 15;
      let y = 20;
      const lineHeight = 7;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxLineWidth = pageWidth - margin * 2;

      // Title
      doc.setFontSize(18);
      doc.text('Epigrapher AI - Analysis Report', margin, y);
      y += 10;
      
      doc.setFontSize(10);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y);
      y += 10;

      const addSection = (title: string, content: string) => {
        if (!content) return;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(title, margin, y);
        y += 7;
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const splitText = doc.splitTextToSize(content, maxLineWidth);
        
        splitText.forEach((line: string) => {
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        });
        y += 5;
      };

      addSection(t('translation', lang), result.translation);
      addSection(t('original_inscription', lang), result.original);
      addSection(t('transliteration', lang), result.transliteration);
      
      const metadata = [
        `${t('detected_script', lang)}: ${result.script_detected}`,
        `${t('ancient_language', lang)}: ${result.ancient_language}`,
        `${t('period', lang)}: ${result.estimated_period}`,
        result.dynasty ? `${t('dynasty', lang)}: ${result.dynasty}` : '',
        result.region ? `${t('region', lang)}: ${result.region}` : '',
        `${t('confidence', lang)}: ${(result.confidence * 100).toFixed(0)}%`
      ].filter(Boolean).join('\n');
      
      addSection('Metadata', metadata);
      
      if (result.historical_analysis) addSection(t('historical_analysis', lang), result.historical_analysis);
      if (result.archaeological_notes) addSection(t('archaeological_notes', lang), result.archaeological_notes);
      if (result.alternative_interpretations) addSection(t('alternative_interpretations', lang), result.alternative_interpretations);

      doc.save(`analysis_${lang}.pdf`);
      toast.success('PDF generated');
    } catch (e) {
      toast.error('Failed to generate PDF. Make sure jsPDF is installed correctly.');
      console.error(e);
    }
    setShowDownloadMenu(false);
  };

  return (
    <Stack gap={6} className="fade-in">
      {/* Action Bar */}
      <Flex justify="space-between" align="center">
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: '2rem', margin: 0 }}>
          {t('translation', lang)}
        </h2>
        <Flex gap={3}>
          <div style={{ position: 'relative' }}>
            <Button variant="outline" onClick={() => setShowCopyMenu(!showCopyMenu)}>
              <Copy size={16} style={{ marginRight: '0.5rem' }}/> {t('copy', lang)} <ChevronDown size={14} style={{ marginLeft: '0.25rem' }}/>
            </Button>
            {showCopyMenu && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'var(--color-bg-base)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.5rem', zIndex: 10, minWidth: '200px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Button variant="ghost" size="sm" onClick={() => handleCopy('translation')} style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '0.25rem' }}>{t('copy_translation', lang)}</Button>
                <Button variant="ghost" size="sm" onClick={() => handleCopy('full')} style={{ width: '100%', justifyContent: 'flex-start' }}>{t('copy_full_analysis', lang)}</Button>
              </div>
            )}
          </div>
          
          <div style={{ position: 'relative' }}>
            <Button variant="outline" onClick={() => setShowDownloadMenu(!showDownloadMenu)}>
              <Download size={16} style={{ marginRight: '0.5rem' }}/> {t('download', lang)} <ChevronDown size={14} style={{ marginLeft: '0.25rem' }}/>
            </Button>
            {showDownloadMenu && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'var(--color-bg-base)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.5rem', zIndex: 10, minWidth: '160px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Button variant="ghost" size="sm" onClick={handleDownloadTxt} style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '0.25rem' }}>{t('download_txt', lang)}</Button>
                <Button variant="ghost" size="sm" onClick={handleDownloadPdf} style={{ width: '100%', justifyContent: 'flex-start' }}>{t('download_pdf', lang)}</Button>
              </div>
            )}
          </div>

          <Button variant="outline" onClick={handleShare}>
            <Share2 size={16} style={{ marginRight: '0.5rem' }}/> Share
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer size={16} style={{ marginRight: '0.5rem' }}/> Print
          </Button>

          <Button variant="secondary" onClick={onReset}>
            <RotateCcw size={16} style={{ marginRight: '0.5rem' }} /> {t('new_analysis', lang) || 'New Analysis'}
          </Button>
        </Flex>
      </Flex>

      {/* Hero: Translation */}
      <Card padding="lg" style={{ borderLeft: '4px solid var(--color-primary)', backgroundColor: 'var(--color-bg-alt)' }}>
        <Flex align="center" gap={3} style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
          <Globe size={24} />
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{t('translation', lang)}</h3>
        </Flex>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {result.translation}
        </div>
      </Card>

      {/* Primary Texts */}
      <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap={4}>
        <Card padding="md">
          <Flex align="center" gap={2} style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>
            <FileText size={18} />
            <h4 style={{ margin: 0 }}>{t('original_inscription', lang)}</h4>
          </Flex>
          <div style={{ fontFamily: 'var(--font-serif)', whiteSpace: 'pre-wrap', color: 'var(--color-text-secondary)' }}>
            {result.original}
          </div>
        </Card>
        
        <Card padding="md">
          <Flex align="center" gap={2} style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>
            <Type size={18} />
            <h4 style={{ margin: 0 }}>{t('transliteration', lang)}</h4>
          </Flex>
          <div style={{ fontFamily: 'var(--font-sans)', whiteSpace: 'pre-wrap', color: 'var(--color-text-secondary)' }}>
            {result.transliteration}
          </div>
        </Card>
      </Grid>

      {/* Metadata Grid */}
      <Card padding="lg">
        <Flex align="center" gap={2} style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>
          <Info size={18} />
          <h3 style={{ margin: 0 }}>Metadata</h3>
        </Flex>
        <Grid columns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>{t('detected_script', lang)}</div>
            <div style={{ fontWeight: 500 }}>{result.script_detected}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>{t('ancient_language', lang)}</div>
            <div style={{ fontWeight: 500 }}>{result.ancient_language}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>{t('period', lang)}</div>
            <div style={{ fontWeight: 500 }}>{result.estimated_period}</div>
          </div>
          {result.dynasty && (
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>{t('dynasty', lang)}</div>
              <div style={{ fontWeight: 500 }}>{result.dynasty}</div>
            </div>
          )}
          {result.region && (
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>{t('region', lang)}</div>
              <div style={{ fontWeight: 500 }}>{result.region}</div>
            </div>
          )}
          {result.model && (
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>AI Model</div>
              <div style={{ fontWeight: 500 }}>{result.model}</div>
            </div>
          )}
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>{t('confidence', lang)}</div>
            <Badge variant="default" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
              {(result.confidence * 100).toFixed(0)}%
            </Badge>
          </div>
        </Grid>
      </Card>

      {/* Detailed Analysis Sections */}
      {result.historical_analysis && (
        <Card padding="md">
          <Flex align="center" gap={2} style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>
            <BookOpen size={18} />
            <h4 style={{ margin: 0 }}>{t('historical_analysis', lang)}</h4>
          </Flex>
          <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {result.historical_analysis}
          </div>
        </Card>
      )}

      {result.historical_context && (
        <Card padding="md">
          <Flex align="center" gap={2} style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>
            <Clock size={18} />
            <h4 style={{ margin: 0 }}>{t('historical_context', lang) || 'Historical Context'}</h4>
          </Flex>
          <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {result.historical_context}
          </div>
        </Card>
      )}

      {result.archaeological_notes && (
        <Card padding="md">
          <Flex align="center" gap={2} style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>
            <Search size={18} />
            <h4 style={{ margin: 0 }}>{t('archaeological_notes', lang)}</h4>
          </Flex>
          <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {result.archaeological_notes}
          </div>
        </Card>
      )}

      {result.alternative_interpretations && (
        <Card padding="md">
          <Flex align="center" gap={2} style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>
            <MessageSquare size={18} />
            <h4 style={{ margin: 0 }}>{t('alternative_interpretations', lang)}</h4>
          </Flex>
          <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {result.alternative_interpretations}
          </div>
        </Card>
      )}

      {/* Research mode extra fields if present */}
      {result.literal_translation && (
        <Card padding="md">
          <Flex align="center" gap={2} style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>
            <Type size={18} />
            <h4 style={{ margin: 0 }}>{t('literal_translation', lang)}</h4>
          </Flex>
          <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {result.literal_translation}
          </div>
        </Card>
      )}

      {/* AI Disclaimer */}
      <div style={{ padding: '1rem', backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <AlertTriangle size={20} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
        <div style={{ color: 'var(--color-warning-text)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          {t('ai_notice_desc', lang) || "AI-generated analysis may contain inaccuracies. Verify important historical conclusions using primary sources and expert review."}
        </div>
      </div>
    </Stack>
  );
};
