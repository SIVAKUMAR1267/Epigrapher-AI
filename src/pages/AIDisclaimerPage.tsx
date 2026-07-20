
import { Container, Stack, Flex } from '../shared/layout';
import { Card } from '../shared/ui';
import { ShieldAlert } from 'lucide-react';

export default function AIDisclaimerPage() {
  return (
    <Container maxWidth="md">
      <Stack gap={6}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>AI Disclaimer</h1>
        </div>
        
        <Card padding="lg" style={{ border: '1px solid var(--color-warning)', background: 'var(--color-warning-bg)' }}>
          <Flex direction="column" gap={4}>
            <Flex align="center" gap={3} style={{ color: 'var(--color-warning)' }}>
              <ShieldAlert size={32} />
              <h2 style={{ margin: 0, color: 'inherit' }}>Important Limitations</h2>
            </Flex>
            <div style={{ color: 'var(--color-warning-content)', lineHeight: 1.6 }}>
              <p style={{ marginBottom: '1rem' }}>
                Epigrapher AI utilizes advanced Artificial Intelligence (LLMs and Vision models) to assist in reading ancient texts. <strong>However, AI is not perfect.</strong>
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                <li style={{ marginBottom: '0.5rem' }}><strong>Hallucinations:</strong> The AI may occasionally "guess" characters or words that are heavily damaged, leading to historically inaccurate transcriptions.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Context Blindness:</strong> Ancient languages heavily depend on historical context, dialects, and eras which the AI may misunderstand.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Not a Substitute:</strong> This tool is an assistant, not a replacement for a trained epigrapher.</li>
              </ul>
              <p>
                Always verify the AI's output against the original image before using the transcription in academic papers or publications.
              </p>
            </div>
          </Flex>
        </Card>
      </Stack>
    </Container>
  );
}
