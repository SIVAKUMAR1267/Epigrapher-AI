import React from 'react';
import { HelpCircle, Settings, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Flex } from './Flex';
import { Container } from './Container';

export const Header: React.FC = () => {
  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 'var(--z-sticky)' as any, 
      backgroundColor: 'var(--color-bg-panel)',
      borderBottom: '1px solid var(--color-border)',
      height: '64px',
    }}>
      <Container maxWidth="full" style={{ height: '100%', paddingLeft: 'var(--space-8)', paddingRight: 'var(--space-8)' }}>
        <Flex justify="space-between" align="center" style={{ height: '100%' }}>
          
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Flex align="center" gap={3}>
              <div style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
                <img src="/favicon.svg" alt="Epigrapher AI Logo" style={{ width: '28px', height: '28px' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  Epigrapher AI
                </h1>
              </div>
            </Flex>
          </Link>

          <Flex align="center" gap={4}>
            <ThemeToggle />
            
            <Link to="/history" style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }} title="History">
              <History size={18} />
            </Link>
            
            <Link to="/settings" style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }} title="Settings">
              <Settings size={18} />
            </Link>
            
            <Link to="/help" style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }} title="Help">
              <HelpCircle size={18} />
            </Link>
          </Flex>
          
        </Flex>
      </Container>
    </header>
  );
};
