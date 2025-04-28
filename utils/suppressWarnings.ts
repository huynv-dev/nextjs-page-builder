'use client';

const WARNINGS_TO_FILTER = [
  'Listener added for a \'DOMNodeInserted\' mutation event',
  '[Deprecation]',
  'Support for this event type has been removed'
];

/**
 * Suppresses specific console warnings in development
 * This is a temporary solution to hide deprecation warnings coming from third-party libraries
 * Should only be used during development
 */
export function suppressDeprecationWarnings() {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') {
    return; // Only apply in non-production client-side environments
  }

  const originalConsoleWarn = console.warn;
  console.warn = function filteredWarning(...args) {
    // Check if the warning message includes any of our filtered phrases
    const warningMessage = args.join(' ');
    const shouldFilter = WARNINGS_TO_FILTER.some(filter => 
      typeof warningMessage === 'string' && warningMessage.includes(filter)
    );

    // Only pass through warnings that shouldn't be filtered
    if (!shouldFilter) {
      originalConsoleWarn.apply(console, args);
    }
  };

  // Make sure to restore the original function when the component unmounts
  return () => {
    console.warn = originalConsoleWarn;
  };
} 