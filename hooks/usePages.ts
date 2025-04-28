'use client';

import { useStore } from '@/components/store/useStore';
import { PageMetadata } from '@/types/editor.types';
import { useState, useCallback, useEffect } from 'react';
import { createPage, listPages } from '@/services/pages.service';
import { loadLayout } from '@/services/layouts.service';

/**
 * Hook for managing pages in the editor
 */
export function usePages() {
  const [pages, setPages] = useState<PageMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Get current page from global store
  const currentPage = useStore((state) => state.currentPage);
  const setCurrentPage = useStore((state) => state.setCurrentPage);
  const setLayoutLoaded = useStore((state) => state.setLayoutLoaded);
  
  // Load all pages
  const fetchPages = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await listPages();
      if (result.success && result.pages) {
        setPages(result.pages);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load pages on mount
  useEffect(() => {
    fetchPages();
  }, [fetchPages]);
  
  // Create a new page
  const handleCreatePage = useCallback(async (title: string, slug: string) => {
    setIsCreating(true);
    try {
      const result = await createPage(title, slug);
      if (result.success) {
        await fetchPages();
        handleSelectPage(slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } finally {
      setIsCreating(false);
    }
  }, [fetchPages]);
  
  // Select a page and load its layout
  const handleSelectPage = useCallback(async (slug: string) => {
    setCurrentPage(slug);
    
    // Create event to notify components of page change
    const event = new CustomEvent("page-selected", { 
      detail: { slug } 
    });
    window.dispatchEvent(event);
    
    // Load the page layout
    try {
      const result = await loadLayout(slug);
      if (result.success && result.layout) {
        // We need access to the editor actions here
        // This will be used in the component that consumes this hook
        return { success: true, layout: result.layout };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error loading page layout:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, [setCurrentPage]);
  
  return {
    pages,
    currentPage,
    isLoading,
    isCreating,
    fetchPages,
    handleCreatePage,
    handleSelectPage
  };
} 