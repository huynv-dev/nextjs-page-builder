import { DevicePreset, DeviceType } from '@/types/editor.types';
import { Laptop, Smartphone, Tablet } from 'lucide-react';
import React from 'react';

// Define device presets
export const devicePresets: Record<DeviceType, DevicePreset> = {
  desktop: {
    name: 'Desktop',
    width: 1920,
    height: 1080,
    icon: React.createElement(Laptop, { size: 20 })
  },
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
    icon: React.createElement(Tablet, { size: 20 })
  },
  mobile: {
    name: 'Mobile',
    width: 375,
    height: 667,
    icon: React.createElement(Smartphone, { size: 20 })
  }
}; 