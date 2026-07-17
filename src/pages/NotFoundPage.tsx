import React from 'react';
import { Container, Stack, Flex } from '../shared/layout';
import { Card, Button } from '../shared/ui';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Container maxWidth="md">
      <Flex direction="column" align="center" justify="center" style={{ minHeight: '50vh', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>404</h1>
        <h2 style={{ marginBottom: '2rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </Flex>
    </Container>
  );
}
