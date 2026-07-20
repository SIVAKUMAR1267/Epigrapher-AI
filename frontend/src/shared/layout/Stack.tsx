import React from 'react';
import { Flex, type FlexProps } from './Flex';

export interface StackProps extends Omit<FlexProps, 'direction'> {
  direction?: 'column' | 'row';
}

/**
 * Stack is a simplified Flex component that defaults to a column direction.
 * Useful for vertical stacking of elements with consistent gaps.
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className = '', direction = 'column', gap = 4, children, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        direction={direction}
        gap={gap}
        className={className}
        {...props}
      >
        {children}
      </Flex>
    );
  }
);
Stack.displayName = 'Stack';
