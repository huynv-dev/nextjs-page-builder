'use client';

import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { showNotification } from '@/utils/notifications';

/**
 * Higher-order component that wraps a component with Editor context if needed
 * This solves the "Invariant failed: You can only use useEditor in the context of" error
 * 
 * @param Component The component to wrap
 * @param requiresEditor Whether the component requires Editor context
 */
export function withEditorContext<P>(
  Component: React.ComponentType<P>,
  requiresEditor: boolean = true
) {
  // Return a new component
  return function WithEditorContext(props: P) {
    // Check if we're already in an Editor context
    let isInEditorContext = false;
    
    try {
      // This will throw if we're not in an Editor context
      if (typeof window !== 'undefined') {
        const craftState = (window as any).__CRAFT_STATE__;
        isInEditorContext = Boolean(craftState);
      }
    } catch (e) {
      isInEditorContext = false;
    }
    
    // If we don't need Editor context or we're already in one, just render the component
    if (!requiresEditor || isInEditorContext) {
      return <Component {...props} />;
    }
    
    // Otherwise, wrap it in a minimal Editor
    return (
      <div className="editor-context-wrapper">
        <Editor
          resolver={{}}
          enabled={false}
          onRender={() => null}
        >
          <Component {...props} />
        </Editor>
      </div>
    );
  };
}

/**
 * Example usage:
 * 
 * // Regular component that uses useEditor
 * const MyComponent = (props) => {
 *   const { enabled } = useEditor();
 *   return <div>Editor enabled: {enabled ? 'Yes' : 'No'}</div>;
 * };
 * 
 * // Wrapped component that can be used anywhere
 * export const SafeMyComponent = withEditorContext(MyComponent);
 */ 