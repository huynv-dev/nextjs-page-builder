'use client';

import { useRef, useState, useEffect } from 'react';
import { 
  FileText, 
  Image, 
  Grid, 
  Type, 
  Play,
  ChevronDown,
  Menu,
  AlertCircle,
  Music,
  Code,
  Anchor,
  Sidebar,
  MoreHorizontal,
  Aperture,
  Text
} from 'lucide-react';
import { useBlockConnectors } from '@/hooks/useBlockConnectors';
import { useEditor } from '@craftjs/core';

interface BlocksTabProps {
  mounted: boolean;
  searchQuery?: string;
}

interface BlockCategory {
  name: string;
  icon?: React.ReactNode;
  blocks: {
    name: string;
    icon: React.ReactNode;
    ref: React.RefObject<HTMLDivElement>;
    description?: string;
    pro?: boolean;
  }[];
}

export const BlocksTab = ({ mounted, searchQuery = "" }: BlocksTabProps) => {
  // Create refs for blocks
  const textRef = useRef<HTMLDivElement>(null);
  const advancedTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const soundcloudRef = useRef<HTMLDivElement>(null);
  const shortcodeRef = useRef<HTMLDivElement>(null);
  const htmlRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const readMoreRef = useRef<HTMLDivElement>(null);
  
  // Add missing refs required by BlockConnectorRefs type
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const animateRef = useRef<HTMLDivElement>(null);
  
  // Track expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'basicElements': true,
    'siteElements': false
  });
  
  const [filteredBlocks, setFilteredBlocks] = useState<{
    name: string;
    ref: React.RefObject<HTMLDivElement>;
    icon: React.ReactNode;
    description?: string;
    pro?: boolean;
    category: string;
  }[]>([]);

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  // Setup block connectors
  const editor = useEditor();
  const editorContext = { connectors: editor.connectors };
  useBlockConnectors({
    textRef,
    advancedTextRef,
    headingRef,
    imageRef,
    videoRef,
    buttonRef,
    counterRef,
    progressRef,
    testimonialRef,
    tabsRef,
    accordionRef,
    toggleRef,
    socialRef,
    alertRef,
    soundcloudRef,
    shortcodeRef,
    htmlRef,
    menuRef,
    sidebarRef,
    readMoreRef,
    containerRef,
    sliderRef,
    animateRef
  }, mounted, editorContext);
  
  // Define block categories
  const blockCategories: BlockCategory[] = [
    {
      name: 'basicElements',
      blocks: [
        {
          name: 'Heading',
          icon: <Type size={18} />,
          ref: headingRef,
          description: 'Section heading with multiple formatting options'
        },
        {
          name: 'Image',
          icon: <Image size={18} />,
          ref: imageRef
        },
        {
          name: 'Text Editor',
          icon: <FileText size={18} />,
          ref: textRef
        },
        {
          name: 'Advanced Text',
          icon: <Text size={18} />,
          ref: advancedTextRef,
          description: 'Rich text with advanced styling options'
        },
        {
          name: 'Video',
          icon: <Play size={18} />,
          ref: videoRef
        },
        {
          name: 'Button',
          icon: <div className="rounded-md border border-[#a3a5a7] h-4 w-8" />,
          ref: buttonRef
        },
        {
          name: 'Counter',
          icon: <div className="flex items-baseline"><span className="text-xs font-bold">123</span>↑</div>,
          ref: counterRef
        },
        {
          name: 'Progress Bar',
          icon: <div className="w-10 h-3 bg-gray-200 rounded-sm overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full w-7 bg-gray-400"></div>
          </div>,
          ref: progressRef
        },
        {
          name: 'Testimonial',
          icon: <div className="w-5 h-4 flex items-center justify-center text-xl leading-none">"</div>,
          ref: testimonialRef
        },
        {
          name: 'Tabs',
          icon: <div className="flex flex-col items-center">
            <div className="w-6 h-3 border-t border-x border-[#a3a5a7] rounded-t-sm"></div>
            <div className="w-6 h-4 border border-[#a3a5a7] rounded-b-sm"></div>
          </div>,
          ref: tabsRef
        },
        {
          name: 'Accordion',
          icon: <div className="flex flex-col gap-0.5">
            <div className="w-6 h-2 border border-[#a3a5a7] rounded-sm"></div>
            <div className="w-6 h-2 border border-[#a3a5a7] rounded-sm"></div>
          </div>,
          ref: accordionRef
        },
        {
          name: 'Toggle',
          icon: <div className="flex items-center">
            <div className="w-4 h-3 border border-[#a3a5a7] rounded-sm mr-1"></div>
            <div className="w-2 border-t border-[#a3a5a7]"></div>
          </div>,
          ref: toggleRef
        },
        {
          name: 'Social Icons',
          icon: <div className="grid grid-cols-2 gap-0.5">
            <div className="w-2 h-2 rounded-sm border border-[#a3a5a7]"></div>
            <div className="w-2 h-2 rounded-sm border border-[#a3a5a7]"></div>
            <div className="w-2 h-2 rounded-sm border border-[#a3a5a7]"></div>
            <div className="w-2 h-2 rounded-sm border border-[#a3a5a7]"></div>
          </div>,
          ref: socialRef
        },
        {
          name: 'Alert',
          icon: <AlertCircle size={18} />,
          ref: alertRef
        },
        {
          name: 'SoundCloud',
          icon: <Music size={18} />,
          ref: soundcloudRef
        },
        {
          name: 'Shortcode',
          icon: <div className="font-mono text-xs">[...]</div>,
          ref: shortcodeRef
        },
        {
          name: 'HTML',
          icon: <Code size={18} />,
          ref: htmlRef
        },
        {
          name: 'Menu Anchor',
          icon: <Anchor size={18} />,
          ref: menuRef
        }
      ]
    },
    {
      name: 'siteElements',
      blocks: [
        {
          name: 'Menu',
          icon: <Menu size={18} />,
          ref: menuRef,
          pro: true
        },
        {
          name: 'Loop Grid',
          icon: <Grid size={18} />,
          ref: textRef,
          pro: true
        },
        {
          name: 'Loop Carousel',
          icon: <Aperture size={18} />,
          ref: counterRef,
          pro: true
        },
        {
          name: 'Nav Menu',
          icon: <div className="flex flex-col gap-0.5 items-center">
            <div className="w-5 h-0.5 bg-[#a3a5a7]"></div>
            <div className="w-5 h-0.5 bg-[#a3a5a7]"></div>
            <div className="w-5 h-0.5 bg-[#a3a5a7]"></div>
          </div>,
          ref: menuRef,
          pro: true
        },
        {
          name: 'Table of Contents',
          icon: <div className="flex flex-col items-start gap-0.5">
            <div className="w-3 h-0.5 bg-[#a3a5a7]"></div>
            <div className="w-4 h-0.5 bg-[#a3a5a7]"></div>
            <div className="w-3 h-0.5 bg-[#a3a5a7]"></div>
          </div>,
          ref: menuRef,
          pro: true
        },
        {
          name: 'Site Logo',
          icon: <div className="w-4 h-4 border border-[#a3a5a7] rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-[#a3a5a7] rounded-sm"></div>
          </div>,
          ref: imageRef,
          pro: true
        },
        {
          name: 'Sidebar',
          icon: <Sidebar size={18} />,
          ref: sidebarRef
        },
        {
          name: 'Read More',
          icon: <MoreHorizontal size={18} />,
          ref: readMoreRef
        }
      ]
    }
  ];
  
  // Filter blocks based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredBlocks([]);
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = blockCategories.flatMap(category => 
      category.blocks
        .filter(block => block.name.toLowerCase().includes(lowerCaseQuery))
        .map(block => ({
          ...block,
          category: category.name
        }))
    );
    
    setFilteredBlocks(filtered);
  }, [searchQuery]);
  
  return (
    <div className="text-gray-800">
      {searchQuery && filteredBlocks.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 p-4">
          {filteredBlocks.map((block, index) => (
            <div 
              key={`${block.name}-${index}`}
              ref={block.ref}
              className="bg-white border border-gray-200 rounded flex flex-col items-center py-4 px-2 cursor-move hover:border-[#6a0075] transition-colors relative"
            >
              {block.pro && (
                <div className="absolute top-0 right-0 bg-[#6a0075] text-white text-[8px] px-1 py-0.5 rounded-bl-sm font-medium">
                  PRO
                </div>
              )}
              <div className="text-[#6a0075] mb-2">{block.icon}</div>
              <div className="text-xs text-center">{block.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {blockCategories.map((category) => (
            <div key={category.name} className="border-b border-gray-100">
              <button 
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center justify-between py-3 px-4 text-sm transition-colors hover:bg-gray-50"
              >
                <div className="uppercase text-xs font-medium tracking-wide text-gray-600">
                  {category.name === 'basicElements' ? 'Basic' : 'Site'}
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${expandedCategories[category.name] ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {expandedCategories[category.name] && (
                <div className="grid grid-cols-3 gap-1 p-2">
                  {category.blocks.map((block, index) => (
                    <div 
                      key={`${block.name}-${index}`}
                      ref={block.ref}
                      className="bg-white border border-gray-200 rounded flex flex-col items-center py-4 px-2 cursor-move hover:border-[#6a0075] transition-colors relative"
                    >
                      {block.pro && (
                        <div className="absolute top-0 right-0 bg-[#6a0075] text-white text-[8px] px-1 py-0.5 rounded-bl-sm font-medium">
                          PRO
                        </div>
                      )}
                      <div className="text-[#6a0075] mb-2">{block.icon}</div>
                      <div className="text-xs text-center">{block.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div className="py-3 flex items-center justify-center">
            <div className="text-xs text-gray-500">
              Page Builder
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 