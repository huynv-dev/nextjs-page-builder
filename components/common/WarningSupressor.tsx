'use client';

import { useEffect } from 'react';
import { suppressDeprecationWarnings } from '@/utils/suppressWarnings';

/**
 * A client component that suppresses specific console warnings.
 * This should be mounted only once in the application.
 */
export function WarningSupressor() {
  useEffect(() => {
    // Apply the warning suppression and get the cleanup function
    const cleanup = suppressDeprecationWarnings();
    
    // Return the cleanup function to restore the original console.warn when unmounted
    return cleanup;
  }, []);
  
  // This component doesn't render anything
  return null;
} 