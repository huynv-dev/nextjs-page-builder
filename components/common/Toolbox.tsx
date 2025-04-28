"use client";

import { useEditor } from "@craftjs/core";
import { useEffect, useRef, useState } from "react";
import { Plus, FileText, Layout, Image, Zap, List, Table } from "lucide-react"; // Icon đẹp từ lucide-react

import { TextBlock } from "../blocks/TextBlock";
import { ContainerBlock } from "../blocks/ContainerBlock";
import { SliderBlock } from "../blocks/SliderBlock";
import { AnimateBlock } from "../blocks/AnimateBlock";
import { AccordionBlock } from "../blocks/AccordionBlock";
import { TabsBlock } from "../blocks/TabsBlock";

interface PageMetadata {
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export const Toolbox = () => {
  const { connectors, actions } = useEditor();
  
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const animateRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"blocks" | "pages">("blocks");
  const [pages, setPages] = useState<PageMetadata[]>([]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [layoutLoaded, setLayoutLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadPages();
  }, []);

  // Thiết lập kết nối connectors
  const setupConnectors = () => {
    if (!mounted) return;

    if (textRef.current) {
      connectors.create(textRef.current, <TextBlock text="New Text" />);
    }
    if (containerRef.current) {
      connectors.create(containerRef.current, <ContainerBlock><div></div></ContainerBlock>);
    }
    if (sliderRef.current) {
      connectors.create(sliderRef.current, <SliderBlock slides={[
        "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000&auto=format&fit=crop",
      ]} />);
    }
    if (animateRef.current) {
      connectors.create(animateRef.current, <AnimateBlock text="Animated Text" />);
    }
    if (accordionRef.current) {
      connectors.create(accordionRef.current, <AccordionBlock title="Accordion Title" content="Accordion Content" />);
    }
    if (tabsRef.current) {
      connectors.create(tabsRef.current, <TabsBlock tabs={[
        { title: "Tab 1", content: "Content 1" },
        { title: "Tab 2", content: "Content 2" }
      ]} />);
    }
  };

  // Thiết lập connectors ban đầu
  useEffect(() => {
    setupConnectors();
  }, [connectors, mounted]);

  // Thiết lập connectors lại sau khi load layout
  useEffect(() => {
    if (layoutLoaded) {
      // Đặt timeout để đảm bảo editor đã render xong
      setTimeout(() => {
        setupConnectors();
        setLayoutLoaded(false);
      }, 300);
    }
  }, [layoutLoaded]);

  // Re-establish connectors when the tab changes
  useEffect(() => {
    if (mounted) {
      setupConnectors();
    }
  }, [tab, mounted]);

  const loadPages = async () => {
    try {
      const res = await fetch("/api/list-pages");
      const data = await res.json();
      setPages(data.pages);
    } catch (error) {
      console.error("Failed to load pages", error);
    }
  };

  const handleCreatePage = async () => {
    setIsCreatingPage(true);
    
    try {
      const pageName = prompt("Enter page title:");
      if (!pageName) {
        setIsCreatingPage(false);
        return;
      }

      const slugSuggestion = pageName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const slug = prompt("Enter page slug:", slugSuggestion);
      if (!slug) {
        setIsCreatingPage(false);
        return;
      }
      
      const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

      // Tạo node tree mặc định
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

      // Sử dụng API mới
      const response = await fetch("/api/create-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pageName,
          slug: sanitizedSlug,
          nodeTree: defaultNodeTree,
          html,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Page "${pageName}" created successfully!`);
        await loadPages();
        handleSelectPage(sanitizedSlug);
      } else {
        alert(`Error creating page: ${result.error}`);
      }
    } catch (error) {
      console.error("Error creating page:", error);
      alert("Failed to create page. Please try again.");
    } finally {
      setIsCreatingPage(false);
    }
  };

  const handleSelectPage = (slug: string) => {
    console.log(`Selecting page: ${slug}`);
    setSelectedPage(slug);
    
    // Tạo custom event để thông báo cho các component khác
    const event = new CustomEvent("page-selected", { 
      detail: { slug } 
    });
    console.log(`Dispatching page-selected event for: ${slug}`);
    window.dispatchEvent(event);
    
    // Load layout page này
    const loadPageLayout = async () => {
      try {
        const response = await fetch(`/api/layouts?slug=${slug}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch layout for "${slug}"`);
        }
        
        const layouts = await response.json();
        
        if (layouts && layouts.length > 0) {
          // Deserialize content vào editor
          actions.deserialize(layouts[0].content);
          console.log(`Loaded layout: ${slug}`);
          
          // Đánh dấu đã load layout mới để thiết lập lại connectors
          setLayoutLoaded(true);
        } else {
          console.log(`No layout found for: ${slug}`);
        }
      } catch (error) {
        console.error('Error loading layout:', error);
      }
    };
    
    loadPageLayout();
  };

  return (
    <div className="p-4 w-48 bg-gray-200 space-y-4">
      {/* Tab Switcher */}
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={() => setTab("blocks")} 
          className={`px-3 py-1 rounded ${tab === "blocks" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
        >
          Blocks
        </button>
        <button 
          onClick={() => setTab("pages")} 
          className={`px-3 py-1 rounded ${tab === "pages" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
        >
          Pages
        </button>
      </div>

      {/* Content */}
      {tab === "blocks" && (
        <div className="space-y-2">
          <div ref={textRef} className="p-2 bg-white border cursor-pointer flex items-center space-x-2">
            <FileText size={16} /> <span>Text</span>
          </div>
          <div ref={containerRef} className="p-2 bg-white border cursor-pointer flex items-center space-x-2">
            <Layout size={16} /> <span>Container</span>
          </div>
          <div ref={sliderRef} className="p-2 bg-white border cursor-pointer flex items-center space-x-2">
            <Image size={16} /> <span>Slider</span>
          </div>
          <div ref={animateRef} className="p-2 bg-white border cursor-pointer flex items-center space-x-2">
            <Zap size={16} /> <span>Animate</span>
          </div>
          <div ref={accordionRef} className="p-2 bg-white border cursor-pointer flex items-center space-x-2">
            <List size={16} /> <span>Accordion</span>
          </div>
          <div ref={tabsRef} className="p-2 bg-white border cursor-pointer flex items-center space-x-2">
            <Table size={16} /> <span>Table</span>
          </div>
        </div>
      )}

      {tab === "pages" && (
        <div className="space-y-2">
          <button 
            onClick={handleCreatePage} 
            disabled={isCreatingPage}
            className="flex items-center bg-blue-500 text-white p-2 rounded w-full justify-center"
          >
            <Plus size={16} /> <span className="ml-1">New Page</span>
          </button>
          
          {pages.length === 0 && (
            <div className="text-gray-500 text-sm p-2 text-center">
              No pages found
            </div>
          )}
          
          {pages.map(page => (
            <div
              key={page.slug}
              onClick={() => handleSelectPage(page.slug)}
              className={`cursor-pointer p-2 rounded hover:bg-gray-300 ${
                selectedPage === page.slug ? "bg-blue-100 border-l-4 border-blue-500" : ""
              }`}
            >
              <div className="font-medium">{page.title}</div>
              <div className="text-xs text-gray-500">/{page.slug}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
