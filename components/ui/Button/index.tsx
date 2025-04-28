'use client';

import { EditorButtonProps } from '@/types/editor.types';
import React, { forwardRef } from 'react';

/**
 * A reusable button component with support for forwarding refs
 */
export const Button = forwardRef<HTMLButtonElement, EditorButtonProps>(
  ({ children, onClick, className = '', title, style }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className={className}
      title={title}
      style={style}
    >
      {children}
    </button>
  )
);

// Add display name for better debugging
Button.displayName = 'Button'; 