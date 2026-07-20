
import { Container, Stack, Grid, Flex } from '../shared/layout';
import { Card } from '../shared/ui';
import { Keyboard, LifeBuoy, FileQuestion } from 'lucide-react';

export default function HelpPage() {
  const shortcuts = [
    { key: 'Ctrl + O', action: 'Upload Image' },
    { key: 'Ctrl + V', action: 'Paste Image' },
    { key: 'Ctrl + Enter', action: 'Analyze' },
    { key: 'Ctrl + S', action: 'Download TXT' },
    { key: 'Ctrl + P', action: 'Print' },
    { key: 'Esc', action: 'Close dialogs' },
    { key: '?', action: 'Open Help' },
  ];

  return (
    <Container maxWidth="lg">
      <Stack gap={6}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Help & Support</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Find answers and learn how to navigate the platform.</p>
        </div>
        
        <Grid columns="repeat(auto-fit, minmax(350px, 1fr))" gap={6}>
          <Stack gap={6}>
            <Card padding="lg">
              <Flex align="center" gap={3} style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                <FileQuestion size={24} />
                <h2 style={{ margin: 0, color: 'var(--color-text)' }}>Frequently Asked Questions</h2>
              </Flex>
              <Stack gap={4}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>How accurate is the translation?</h4>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Accuracy depends heavily on the image quality and preservation of the inscription. AI is best used as a first-pass tool.</p>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>Why did my image fail to upload?</h4>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Ensure your image is a PNG, JPG, or WEBP under 10MB.</p>
                </div>
              </Stack>
            </Card>

            <Card padding="lg">
              <Flex align="center" gap={3} style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                <LifeBuoy size={24} />
                <h2 style={{ margin: 0, color: 'var(--color-text)' }}>Contact Support</h2>
              </Flex>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>If you encounter persistent issues, please reach out via our GitHub repository or support channels.</p>
            </Card>
          </Stack>

          <Card padding="lg">
            <Flex align="center" gap={3} style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
              <Keyboard size={24} />
              <h2 style={{ margin: 0, color: 'var(--color-text)' }}>Keyboard Shortcuts</h2>
            </Flex>
            <Stack gap={3}>
              {shortcuts.map((sc, idx) => (
                <Flex key={idx} justify="space-between" align="center" style={{ paddingBottom: '0.75rem', borderBottom: idx !== shortcuts.length -1 ? '1px solid var(--color-border)' : 'none' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{sc.action}</span>
                  <kbd style={{ 
                    background: 'var(--color-bg-base)', 
                    border: '1px solid var(--color-border)', 
                    borderRadius: '4px', 
                    padding: '2px 6px', 
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)'
                  }}>{sc.key}</kbd>
                </Flex>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Stack>
    </Container>
  );
}
