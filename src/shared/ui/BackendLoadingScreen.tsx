import React, { useState, useEffect } from 'react';
import { BrainCircuit, Loader2, ServerOff, RefreshCw } from 'lucide-react';
import { Flex, Stack } from '../layout';
import { Button } from './Button';
import type { HealthStatus } from '../hooks/useBackendHealth';

interface BackendLoadingScreenProps {
  status: HealthStatus;
  progress: number | null;
  onRetry: () => void;
}

const loadingMessages = [
  "Starting AI services...",
  "Waking up backend...",
  "Connecting securely...",
  "Preparing translation engine...",
  "Loading ancient models..."
];

export const BackendLoadingScreen: React.FC<BackendLoadingScreenProps> = ({ status, progress, onRetry }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (status !== 'connecting' && status !== 'checking') return;
    
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [status]);

  if (status === 'timeout' || status === 'error') {
    return (
      <Flex 
        direction="column" 
        align="center" 
        justify="center" 
        style={{ minHeight: '100vh', padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-base)' }}
      >
        <Stack align="center" gap={6} style={{ maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-danger-bg)', borderRadius: '50%', color: 'var(--color-danger)' }}>
            <ServerOff size={48} />
          </div>
          
          <Stack gap={2}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Backend is unavailable</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              The server is taking longer than expected to wake up. It may still be starting, or there might be a network issue.
            </p>
          </Stack>

          <Flex gap={4} style={{ marginTop: 'var(--space-4)' }}>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
            <Button variant="primary" onClick={onRetry}>
              <Flex align="center" gap={2}>
                <RefreshCw size={16} />
                Retry Connection
              </Flex>
            </Button>
          </Flex>
        </Stack>
      </Flex>
    );
  }

  // Connecting or Checking state
  return (
    <Flex 
      direction="column" 
      align="center" 
      justify="center" 
      style={{ minHeight: '100vh', padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-base)' }}
    >
      <Stack align="center" gap={8}>
        
        <Flex align="center" gap={3} style={{ opacity: 0.8 }}>
          <div style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
            <BrainCircuit size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>
            Epigrapher AI
          </h1>
        </Flex>

        <Stack align="center" gap={4}>
          <div style={{ color: 'var(--color-primary)' }}>
            <Loader2 size={40} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-primary)', fontWeight: 500, fontSize: '1.125rem' }}>
              {loadingMessages[messageIndex]}
            </p>
            {progress !== null && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: 'var(--space-2)' }}>
                Progress: {progress}%
              </p>
            )}
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: 'var(--space-2)' }}>
              Free-tier servers may take up to 90 seconds to wake up.
            </p>
          </div>
        </Stack>

      </Stack>
    </Flex>
  );
};
