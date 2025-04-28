'use client';

import { useStore } from '@/components/store/useStore';
import { devicePresets } from '@/constants/devices';
import { showNotification } from '@/utils/notifications';
import { DeviceType } from '@/types/editor.types';
import { useCallback } from 'react';

/**
 * Hook for managing device-related state and actions
 */
export function useDevice() {
  const currentDevice = useStore((state) => state.currentDevice);
  const setCurrentDevice = useStore((state) => state.setCurrentDevice);

  /**
   * Change the current device
   * @param deviceType The device type to switch to
   */
  const handleDeviceChange = useCallback((deviceType: DeviceType) => {
    // Update device in global store
    setCurrentDevice(deviceType);
    
    // Dispatch custom event to notify the canvas about device change
    const deviceChangeEvent = new CustomEvent('device-change', {
      detail: {
        ...devicePresets[deviceType],
        // Don't include React elements in the event
        icon: undefined
      }
    });
    
    document.dispatchEvent(deviceChangeEvent);
    showNotification(`Switched to ${devicePresets[deviceType].name} view`);
  }, [setCurrentDevice]);

  /**
   * Check if the current view is in device frame mode
   */
  const isDeviceFrame = currentDevice !== 'desktop';

  return {
    currentDevice,
    setCurrentDevice,
    isDeviceFrame,
    handleDeviceChange,
    devicePresets
  };
} 