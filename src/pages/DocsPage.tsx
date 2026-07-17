import React from 'react';
import { Container, Stack, Flex, Grid } from '../shared/layout';
import { Card, Button } from '../shared/ui';
import { BookOpen, Camera, Globe, Search, BookMarked, HelpCircle } from 'lucide-react';

export default function DocsPage() {
  const sections = [
    { title: 'Getting Started', icon: <BookOpen />, desc: 'Learn the basics of Epigrapher AI.' },
    { title: 'Uploading Images', icon: <Camera />, desc: 'Tips for optimal image recognition.' },
    { title: 'Supported Scripts', icon: <BookMarked />, desc: 'View all supported ancient scripts.' },
    { title: 'Supported Languages', icon: <Globe />, desc: 'View translation languages.' },
    { title: 'OCR Tips', icon: <Search />, desc: 'How to improve character recognition.' },
    { title: 'FAQ', icon: <HelpCircle />, desc: 'Frequently asked questions.' },
  ];

  return (
    <Container maxWidth="lg">
      <Stack gap={6}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Documentation</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Everything you need to know about Epigrapher AI.</p>
        </div>
        
        <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
          {sections.map((section, idx) => (
            <Card key={idx} padding="lg" style={{ cursor: 'pointer', transition: 'all 0.2s ease', border: '1px solid var(--color-border)' }}>
              <Flex direction="column" gap={3}>
                <div style={{ color: 'var(--color-primary)' }}>{section.icon}</div>
                <h3 style={{ margin: 0 }}>{section.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '0.875rem' }}>{section.desc}</p>
              </Flex>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
