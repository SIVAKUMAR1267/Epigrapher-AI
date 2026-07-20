import React from 'react';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: number | string;
  flex?: string | number;
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className = '', direction = 'row', align = 'stretch', justify = 'flex-start', wrap = 'nowrap', gap, flex, style, children, ...props }, ref) => {
    
    // Convert numeric gap (e.g. 2 -> var(--space-2)) or use string literally
    const gapStyle = typeof gap === 'number' ? `var(--space-${gap})` : gap;

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: direction,
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap,
          gap: gapStyle,
          flex,
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
Flex.displayName = 'Flex';
