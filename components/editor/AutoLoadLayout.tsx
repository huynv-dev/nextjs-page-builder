"use client";

import { useEditor } from "@craftjs/core";
import { useEffect, useState, useRef } from "react";
import { usePathname } from 'next/navigation';

interface Layout {
  slug: string;
  content: any;
  createdAt: string;
  updatedAt: string;
}

export const AutoLoadLayout = () => {
  const { actions } = useEditor();
  const [isLoading, setIsLoading] = useState(true);
  const hasLoaded = useRef(false);
  const pathname = usePathname();
  
  // Xác định slug từ pathname hoặc mặc định là 'home'
  const getSlugFromPath = () => {
    // Nếu là route admin, thử lấy slug từ URL
    if (pathname.includes('/admin/edit/')) {
      const parts = pathname.split('/');
      return parts[parts.length - 1] || 'home';
    }
    return 'home'; // Mặc định là home
  };

  useEffect(() => {
    // Đảm bảo chỉ load một lần
    if (hasLoaded.current) return;
    
    const loadLayout = async () => {
      try {
        setIsLoading(true);
        const slug = getSlugFromPath();
        const response = await fetch(`/api/layouts?slug=${slug}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch layout for slug: ${slug}`);
        }
        
        const layouts: Layout[] = await response.json();
        
        if (layouts && layouts.length > 0) {
          // Tìm layout với slug cụ thể
          const targetLayout = layouts.find(layout => layout.slug === slug) || layouts[0];
          
          // Deserialize content vào editor
          actions.deserialize(targetLayout.content);
          console.log(`Loaded layout: ${targetLayout.slug}`);
          hasLoaded.current = true;
        } else {
          console.log(`No layout found for slug: ${slug}`);
        }
      } catch (error) {
        console.error('Error loading layout:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLayout();
  }, [actions, pathname]);

  return null;
};
