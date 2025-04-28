'use client';

import { PageMetadata } from '@/types/editor.types';

/**
 * Loads all pages from the server
 * @returns Promise with the pages or error
 */
export async function listPages(): Promise<{ success: boolean; pages?: PageMetadata[]; error?: string }> {
  try {
    const response = await fetch("/api/list-pages");
    
    if (!response.ok) {
      return { success: false, error: 'Failed to fetch pages' };
    }
    
    const data = await response.json();
    return { success: true, pages: data.pages };
  } catch (error) {
    console.error("Failed to load pages", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Creates a new page
 * @param title The page title
 * @param slug The page slug
 * @returns Promise with the result
 */
export async function createPage(title: string, slug: string): Promise<{ success: boolean; error?: string }> {
  try {
    const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // Create default node tree
    const defaultNodeTree = {
      ROOT: {
        type: { resolvedName: "ContainerBlock" },
        isCanvas: true,
        props: {
          backgroundColor: "#f9fafb",
          padding: 24
        },
        displayName: "Container",
        custom: {},
        hidden: false,
        nodes: [],
        linkedNodes: {}
      }
    };

    const html = `<div style="background-color: rgb(249, 250, 251); padding: 24px;"></div>`;

    // Make API call
    const response = await fetch("/api/create-page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug: sanitizedSlug,
        nodeTree: defaultNodeTree,
        html,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Failed to create page' };
    }
    
    const result = await response.json();
    
    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.error || 'Failed to create page' };
    }
  } catch (error) {
    console.error("Error creating page:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 