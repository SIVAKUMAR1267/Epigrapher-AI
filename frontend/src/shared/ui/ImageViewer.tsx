import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize, X } from 'lucide-react';
import { Button } from './Button';
import { Flex } from '../layout/Flex';

interface ImageViewerProps {
  src: string;
  alt?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt = "Preview" }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  const handleReset = () => setZoomLevel(1);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setZoomLevel(1); // Reset zoom on toggle
  };

  if (isFullscreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: 'var(--z-modal)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Flex justify="space-between" align="center" style={{ padding: 'var(--space-4)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}>
          <Flex gap={2}>
            <Button variant="ghost" size="icon" onClick={handleZoomOut} style={{ color: 'white' }}><ZoomOut size={20} /></Button>
            <span style={{ display: 'flex', alignItems: 'center', width: '40px', justifyContent: 'center', fontSize: '0.9rem' }}>{Math.round(zoomLevel * 100)}%</span>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} style={{ color: 'white' }}><ZoomIn size={20} /></Button>
            <Button variant="ghost" size="sm" onClick={handleReset} style={{ color: 'white', marginLeft: 'var(--space-2)' }}>Reset</Button>
          </Flex>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen} style={{ color: 'white' }}><X size={24} /></Button>
        </Flex>
        
        <div style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4)'
        }}>
          <img 
            src={src} 
            alt={alt} 
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform var(--animate-normal) var(--ease-out)',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }} 
          />
        </div>
      </div>
    );
  }

  // Inline view
  return (
    <div 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        cursor: 'zoom-in',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden'
      }}
      onClick={toggleFullscreen}
    >
      <img src={src} alt={alt} style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', transition: 'transform var(--animate-normal)' }} />
      <div style={{
        position: 'absolute',
        bottom: 'var(--space-2)',
        right: 'var(--space-2)',
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: 'var(--space-1) var(--space-2)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.75rem'
      }}>
        <Maximize size={12} /> Click to expand
      </div>
    </div>
  );
};
