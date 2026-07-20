import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from './Container';
import { Flex } from './Flex';
import { config } from '../../config';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      padding: 'var(--space-4) 0',
      marginTop: 'auto',
      backgroundColor: 'var(--color-bg-base)',
      color: 'var(--color-text-muted)',
      fontSize: '0.75rem',
    }}>
      <Container maxWidth="xl" padding={true}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Flex align="center" gap={4}>
            <span style={{ fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              &copy; {new Date().getFullYear()} Epigrapher AI
            </span>
            <Flex gap={4}>
              <Link to="/docs" style={{ color: 'inherit', textDecoration: 'none' }}>Documentation</Link>
              <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</Link>
              <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</Link>
              <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About</Link>
              
              {/* External Links from Env */}
              {config.VITE_GITHUB_URL && (
                <a href={config.VITE_GITHUB_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  GitHub
                </a>
              )}
            </Flex>
          </Flex>
          
          <div style={{ color: 'var(--color-text-muted)' }}>
            Version 1.0.0
          </div>
        </Flex>
      </Container>
    </footer>
  );
};
