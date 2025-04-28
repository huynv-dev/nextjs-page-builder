'use client';

import { useEditor } from '@craftjs/core';

/**
 * A wrapper hook around useEditor to provide safer access to editor capabilities
 * Abstracts away the TypeScript errors and provides fallbacks
 * Safely handles the case when used outside of Editor context
 */
export function useEditorCapabilities() {
  // Create a safe version that won't throw when used outside Editor context
  let editor;
  let isInEditorContext = true;
  
  try {
    editor = useEditor();
  } catch (error) {
    // We're outside of Editor context
    isInEditorContext = false;
    editor = {
      query: {},
      actions: {},
      enabled: false,
      options: { enabled: false }
    };
    console.warn('useEditorCapabilities used outside of Editor context');
  }
  
  // Safely check if functions exist before calling them
  const canUndo = isInEditorContext && typeof editor.query?.history?.canUndo === 'function' 
    ? editor.query.history.canUndo() 
    : false;
    
  const canRedo = isInEditorContext && typeof editor.query?.history?.canRedo === 'function' 
    ? editor.query.history.canRedo() 
    : false;
  
  // Safely get the edit mode state
  // @ts-ignore - Access the properties even if TypeScript doesn't know about them
  const isEditMode = isInEditorContext && editor.options?.enabled !== undefined 
    ? editor.options.enabled 
    : true;
  
  // Safe wrappers around editor actions
  const undo = () => {
    if (!isInEditorContext) return;
    
    if (canUndo && typeof editor.actions?.history?.undo === 'function') {
      editor.actions.history.undo();
    }
  };
  
  const redo = () => {
    if (!isInEditorContext) return;
    
    if (canRedo && typeof editor.actions?.history?.redo === 'function') {
      editor.actions.history.redo();
    }
  };
  
  const toggleEditMode = () => {
    if (!isInEditorContext) return;
    
    if (typeof editor.actions?.setOptions === 'function') {
      editor.actions.setOptions((options: any) => {
        if (options && typeof options.enabled !== 'undefined') {
          options.enabled = !isEditMode;
        }
      });
    }
  };
  
  return {
    editor,
    canUndo,
    canRedo,
    isEditMode,
    undo,
    redo,
    toggleEditMode,
    isInEditorContext
  };
} 