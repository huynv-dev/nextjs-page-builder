import { Node } from '@craftjs/core';
import React from 'react';

// Device types
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface DevicePreset {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

// Page/Layout related types
export interface PageMetadata {
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Layout {
  slug: string;
  content: any; // The node tree
  html: string;
  createdAt: string;
  updatedAt: string;
}

// Block related types
export interface BaseBlockProps {
  id?: string;
  className?: string;
}

// Common props for components in the editor
export interface EditorComponentProps {
  children?: React.ReactNode;
  className?: string;
  disableInteraction?: boolean;
}

// Button component props for editor controls
export interface EditorButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
} 