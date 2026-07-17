import React from 'react';
import { Container, Stack, Flex } from '../shared/layout';
import { Card } from '../shared/ui';
import { BrainCircuit } from 'lucide-react';

export default function AboutPage() {
  return (
    <Container maxWidth="md">
      <Stack gap={6}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>About Epigrapher AI</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Bridging the gap between antiquity and modern technology.</p>
        </div>
        
        <Card padding="lg">
          <Flex direction="column" align="center" style={{ textAlign: 'center' }} gap={4}>
            <div style={{ color: 'var(--color-primary)', padding: '1rem', background: 'var(--color-bg-base)', borderRadius: '50%' }}>
              <BrainCircuit size={48} />
            </div>
            <h2 style={{ margin: 0 }}>The Mission</h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: '600px' }}>
              Epigrapher AI was built to assist researchers, archaeologists, and historians in the difficult task of transcribing and translating ancient stone inscriptions. 
              By leveraging state-of-the-art vision models and large language models, we aim to accelerate historical discovery and preserve human heritage.
            </p>
          </Flex>
        </Card>
      </Stack>
    </Container>
  );
}
