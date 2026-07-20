import React from 'react';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | string;
  gap?: number | string;
  align?: 'start' | 'end' | 'center' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around';
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className = '', columns = 1, gap = 4, align = 'stretch', justify = 'stretch', style, children, ...props }, ref) => {
    
    // Convert numeric gap (e.g. 4 -> var(--space-4))
    const gapStyle = typeof gap === 'number' ? `var(--space-${gap})` : gap;
    
    // Simple column parsing
    const gridTemplateColumns = typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns;

    return (
      <div
        ref={ref}
        style={{
          display: 'grid',
          gridTemplateColumns,
          gap: gapStyle,
          alignItems: align,
          justifyItems: justify,
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
Grid.displayName = 'Grid';
