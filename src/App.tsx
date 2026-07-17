import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { Layout } from './shared/layout/Layout';
import { useSettingsStore } from './stores/settings';
import { useKeyboardShortcuts } from './shared/hooks/useKeyboardShortcuts';

// Pages
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import DocsPage from './pages/DocsPage';
import HelpPage from './pages/HelpPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AboutPage from './pages/AboutPage';
import AIDisclaimerPage from './pages/AIDisclaimerPage';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient();

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <h2 style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>Something went wrong:</h2>
      <pre style={{ color: 'var(--color-error-content)', background: 'var(--color-error-bg)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', maxWidth: '80vw', overflowX: 'auto' }}>
        {(error as Error).message}
      </pre>
      <button 
        onClick={resetErrorBoundary}
        style={{
          padding: '0.75rem 1.5rem',
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Try again
      </button>
    </div>
  );
}

// Global Theme Manager synced with Zustand
function ThemeManager() {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light-theme', 'dark-theme');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme' : 'light-theme';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(`${theme}-theme`);
  }, [theme]);

  return null;
}

export default function App() {
  useKeyboardShortcuts();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeManager />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="docs" element={<DocsPage />} />
              <Route path="help" element={<HelpPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="ai-disclaimer" element={<AIDisclaimerPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-center" />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
