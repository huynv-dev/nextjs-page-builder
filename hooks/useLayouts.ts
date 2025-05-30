'use client';

import { useEditor } from '@craftjs/core';
import { useCallback } from 'react';
import { loadLayout, saveLayout } from '@/services/layouts.service';
import { showNotification } from '@/utils/notifications';
import { useStore } from '@/components/store/useStore';

/**
 * Interface for editor actions and query
 */
export interface EditorContext {
  actions: ReturnType<typeof useEditor>['actions'];
  query: ReturnType<typeof useEditor>['query'];
}

/**
 * Hook for managing layouts
 * Can be used outside of Editor context if editorContext is provided
 */
export function useLayouts(editorContext?: EditorContext) {
  // Use provided editor context or try to get from useEditor hook if available
  let actions, query;
  
  try {
    // This will throw an error if called outside Editor context
    const editor = editorContext || useEditor();
    actions = editor.actions;
    query = editor.query;
  } catch (error) {
    console.error('Editor context not available:', error);
    // Return functions that don't cause errors when called
    return {
      handleSaveLayout: () => {
        showNotification('Error: Editor context not available', "error");
        return Promise.resolve(false);
      },
      handleLoadLayout: () => {
        showNotification('Error: Editor context not available', "error");
        return Promise.resolve(false);
      },
      handleExportLayout: () => {
        showNotification('Error: Editor context not available', "error");
        return false;
      },
      handleImportLayout: () => {
        showNotification('Error: Editor context not available', "error");
        return false;
      }
    };
  }
  
  const currentPage = useStore((state) => state.currentPage);
  
  /**
   * Save the current layout
   */
  const handleSaveLayout = useCallback(async () => {
    try {
      const serialized = query.serialize();
      const nodeTree = JSON.parse(serialized);
      
      const result = await saveLayout(currentPage, nodeTree);
      
      if (result.success) {
        showNotification(`Layout "${currentPage}" saved successfully!`);
        return true;
      } else {
        showNotification(`Error saving layout: ${result.error}`, "error");
        return false;
      }
    } catch (error) {
      console.error('Error saving layout:', error);
      showNotification('Error saving layout', "error");
      return false;
    }
  }, [query, currentPage]);
  
  /**
   * Load a layout
   */
  const handleLoadLayout = useCallback(async (slug = currentPage) => {
    try {
      const result = await loadLayout(slug);
      
      if (result.success && result.layout) {
        actions.deserialize(result.layout.content);
        showNotification(`Layout "${slug}" loaded successfully!`);
        return true;
      } else {
        showNotification(`No saved layout found for "${slug}"!`, "error");
        return false;
      }
    } catch (error) {
      console.error('Error loading layout:', error);
      showNotification('Error loading layout from server!', "error");
      return false;
    }
  }, [actions, currentPage]);
  
  /**
   * Export the current layout as a JSON file
   */
  const handleExportLayout = useCallback(() => {
    try {
      const serializedState = query.serialize();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(serializedState));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `${currentPage}-layout.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      showNotification("Layout exported as JSON!");
      return true;
    } catch (error) {
      console.error('Error exporting layout:', error);
      showNotification('Error exporting layout', "error");
      return false;
    }
  }, [query, currentPage]);
  
  /**
   * Import a layout from a JSON file
   */
  const handleImportLayout = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          actions.deserialize(jsonData);
          showNotification("Layout imported successfully!");
        } catch (error) {
          showNotification("Error importing layout: Invalid file format", "error");
        }
      };
      reader.readAsText(file);
    };
    input.click();
    return true;
  }, [actions]);
  
  return {
    handleSaveLayout,
    handleLoadLayout,
    handleExportLayout,
    handleImportLayout
  };
} 