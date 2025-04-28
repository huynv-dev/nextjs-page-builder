import { create } from 'zustand';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface AppState {
  // Current page
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // Device type
  currentDevice: DeviceType;
  setCurrentDevice: (device: DeviceType) => void;
  
  // Layout state
  layoutLoaded: boolean;
  setLayoutLoaded: (loaded: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // Default values
  currentPage: 'home',
  currentDevice: 'desktop',
  layoutLoaded: false,
  
  // Actions
  setCurrentPage: (page) => set({ currentPage: page }),
  setCurrentDevice: (device) => set({ currentDevice: device }),
  setLayoutLoaded: (loaded) => set({ layoutLoaded: loaded }),
})); 