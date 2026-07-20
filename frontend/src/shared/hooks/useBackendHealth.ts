import { useState, useEffect, useRef } from 'react';
import { config } from '../../config';

export type HealthStatus = 'checking' | 'connecting' | 'ready' | 'timeout' | 'error';

export function useBackendHealth() {
  const [status, setStatus] = useState<HealthStatus>('checking');
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const initialDelayRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const startTimeRef = useRef<number>(Date.now());
  const retryCount = useRef(0);
  const isReadyRef = useRef(false);

  const MAX_TIMEOUT_MS = 90 * 1000;
  const INITIAL_DELAY_MS = 1000; // Show loading screen after 1s if not ready

  const getBackoffMs = (attempt: number) => {
    const backoffs = [2000, 3000, 5000, 8000, 10000];
    return backoffs[Math.min(attempt, backoffs.length - 1)];
  };

  const checkHealth = async () => {
    if (isReadyRef.current) return;

    if (Date.now() - startTimeRef.current > MAX_TIMEOUT_MS) {
      setStatus('timeout');
      setShowLoadingScreen(true);
      return;
    }

    try {
      const response = await fetch(`${config.VITE_API_URL}/health`, {
        signal: AbortSignal.timeout(5000), // Prevent hanging requests
        headers: {
          'Accept': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          isReadyRef.current = true;
          setStatus('ready');
          setShowLoadingScreen(false);
          clearTimeout(timeoutRef.current);
          clearTimeout(initialDelayRef.current);
          return;
        } else if (data.status === 'starting') {
          setStatus('connecting');
          setProgress(data.progress || null);
        }
      } else {
        setStatus('connecting');
      }
    } catch (e) {
      // Backend is likely asleep (network error or timeout)
      setStatus('connecting');
    }

    // Schedule next retry
    const delay = getBackoffMs(retryCount.current);
    retryCount.current++;
    timeoutRef.current = setTimeout(checkHealth, delay);
  };

  useEffect(() => {
    startTimeRef.current = Date.now();
    retryCount.current = 0;
    isReadyRef.current = false;

    checkHealth();

    initialDelayRef.current = setTimeout(() => {
      if (!isReadyRef.current) {
        setShowLoadingScreen(true);
      }
    }, INITIAL_DELAY_MS);

    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(initialDelayRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retry = () => {
    startTimeRef.current = Date.now();
    retryCount.current = 0;
    isReadyRef.current = false;
    setStatus('checking');
    checkHealth();
  };

  return { status, showLoadingScreen, progress, retry };
}
