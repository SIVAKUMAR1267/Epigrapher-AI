import React from 'react';
import { Card } from '../../shared/ui';
import { Flex, Stack } from '../../shared/layout';
import '../../index.css'; // For spinner

interface ProcessingPhaseProps {
  title: string;
  subtitle: string;
}

export const ProcessingPhase: React.FC<ProcessingPhaseProps> = ({ title, subtitle }) => {
  return (
    <Card padding="lg" className="fade-in">
      <Flex direction="column" align="center" justify="center" gap={6} style={{ minHeight: '300px', textAlign: 'center' }}>
        <div className="spinner-large"></div>
        <Stack gap={2}>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary)' }}>{title}</div>
          <div style={{ color: 'var(--color-text-secondary)' }}>{subtitle}</div>
        </Stack>
      </Flex>
    </Card>
  );
};
