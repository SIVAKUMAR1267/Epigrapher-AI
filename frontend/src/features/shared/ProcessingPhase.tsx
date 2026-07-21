import React from 'react';
import { Card, Button } from '../../shared/ui';
import { Flex, Stack } from '../../shared/layout';
import '../../index.css'; // For spinner
import { X } from 'lucide-react';

interface ProcessingPhaseProps {
  title: string;
  subtitle: string;
  onCancel?: () => void;
}

export const ProcessingPhase: React.FC<ProcessingPhaseProps> = ({ title, subtitle, onCancel }) => {
  return (
    <Card padding="lg" className="fade-in">
      <Flex direction="column" align="center" justify="center" gap={6} style={{ minHeight: '300px', textAlign: 'center' }}>
        <div className="spinner-large"></div>
        <Stack gap={2}>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary)' }}>{title}</div>
          <div style={{ color: 'var(--color-text-secondary)' }}>{subtitle}</div>
        </Stack>
        {onCancel && (
          <Button variant="outline" onClick={onCancel} style={{ marginTop: '1rem' }}>
            <X size={16} style={{ marginRight: '0.5rem' }} /> Cancel Processing
          </Button>
        )}
      </Flex>
    </Card>
  );
};
