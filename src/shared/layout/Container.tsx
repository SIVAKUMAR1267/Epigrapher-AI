import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className = '', maxWidth = 'xl', padding = true, style, children, ...props }, ref) => {
    
    const maxWidthStyles = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1200px', // or 1440px based on preference
      full: '100%',
    };

    return (
      <div
        ref={ref}
        style={{
          width: '100%',
          maxWidth: maxWidthStyles[maxWidth],
          margin: '0 auto',
          padding: padding ? 'var(--space-6)' : '0',
          ...style
        }}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Container.displayName = 'Container';
