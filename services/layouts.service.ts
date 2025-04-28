'use client';

import { Layout } from '@/types/editor.types';
import { parseNodeTreeToHTML } from '@/utils/parseNodeTreeToHTML';

/**
 * Saves a layout to the server
 * @param slug The page slug
 * @param nodeTree The serialized node tree
 * @returns Promise with the result
 */
export async function saveLayout(slug: string, nodeTree: any): Promise<{ success: boolean; error?: string }> {
  try {
    const html = parseNodeTreeToHTML(nodeTree);
    
    const response = await fetch("/api/save-layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        nodeTree,
        html,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Failed to save layout' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving layout:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Loads a layout from the server
 * @param slug The page slug
 * @returns Promise with the layout or error
 */
export async function loadLayout(slug: string): Promise<{ success: boolean; layout?: Layout; error?: string }> {
  try {
    const response = await fetch(`/api/layouts?slug=${slug}`);
    
    if (!response.ok) {
      return { success: false, error: `Failed to fetch layout for "${slug}"` };
    }
    
    const layouts = await response.json();
    
    if (layouts && layouts.length > 0) {
      // Find layout with matching slug
      const targetLayout = layouts.find((layout: Layout) => layout.slug === slug) || layouts[0];
      return { success: true, layout: targetLayout };
    } else {
      return { success: false, error: `No layout found for slug: ${slug}` };
    }
  } catch (error) {
    console.error('Error loading layout:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 