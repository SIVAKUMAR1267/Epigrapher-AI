
import { Container, Stack } from '../shared/layout';
import { Card } from '../shared/ui';

export default function PrivacyPage() {
  return (
    <Container maxWidth="md">
      <Stack gap={6}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Privacy Policy</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <Card padding="lg">
          <Stack gap={4}>
            <section>
              <h2>Image Processing</h2>
              <p>Images uploaded to Epigrapher AI are processed temporarily for OCR and analysis. They are never permanently stored on our servers.</p>
            </section>
            
            <section>
              <h2>Third-Party Services</h2>
              <p>We utilize advanced AI APIs (e.g., Google Gemini) to process inscriptions. Your images and text are sent securely to these providers exclusively for the purpose of analysis.</p>
            </section>
            
            <section>
              <h2>Data Retention</h2>
              <p>All analysis history is stored locally in your browser using standard Web Storage APIs. You have full control over this data and can clear it at any time.</p>
            </section>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
