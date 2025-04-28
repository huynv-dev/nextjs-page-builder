'use client';

import React from 'react';
import { useEditor } from '@craftjs/core';
import { RefObject, useCallback, useEffect } from 'react';
import { useStore } from '@/components/store/useStore';

interface BlockConnectorRefs {
  textRef: RefObject<HTMLDivElement>;
  containerRef: RefObject<HTMLDivElement>;
  sliderRef: RefObject<HTMLDivElement>;
  animateRef: RefObject<HTMLDivElement>;
  accordionRef: RefObject<HTMLDivElement>;
  tabsRef: RefObject<HTMLDivElement>;
  headingRef?: RefObject<HTMLDivElement>;
  imageRef?: RefObject<HTMLDivElement>;
  videoRef?: RefObject<HTMLDivElement>;
  buttonRef?: RefObject<HTMLDivElement>;
  counterRef?: RefObject<HTMLDivElement>;
  progressRef?: RefObject<HTMLDivElement>;
  testimonialRef?: RefObject<HTMLDivElement>;
  toggleRef?: RefObject<HTMLDivElement>;
  socialRef?: RefObject<HTMLDivElement>;
  alertRef?: RefObject<HTMLDivElement>;
  soundcloudRef?: RefObject<HTMLDivElement>;
  shortcodeRef?: RefObject<HTMLDivElement>;
  htmlRef?: RefObject<HTMLDivElement>;
  menuRef?: RefObject<HTMLDivElement>;
  sidebarRef?: RefObject<HTMLDivElement>;
  readMoreRef?: RefObject<HTMLDivElement>;
  [key: string]: RefObject<HTMLDivElement> | undefined;
}

/**
 * Hook for managing block connectors in the editor
 * @param refs Object containing refs for block connectors
 * @param mounted Whether the component is mounted
 */
export function useBlockConnectors(refs: BlockConnectorRefs, mounted: boolean) {
  const { connectors } = useEditor();
  const layoutLoaded = useStore((state) => state.layoutLoaded);
  const setLayoutLoaded = useStore((state) => state.setLayoutLoaded);
  
  // Setup connectors
  const setupConnectors = useCallback(() => {
    if (!mounted) return;

    const TextBlock = require('@/components/blocks/TextBlock').TextBlock;
    const ContainerBlock = require('@/components/blocks/ContainerBlock').ContainerBlock;
    const SliderBlock = require('@/components/blocks/SliderBlock').SliderBlock;
    const AnimateBlock = require('@/components/blocks/AnimateBlock').AnimateBlock;
    const AccordionBlock = require('@/components/blocks/AccordionBlock').AccordionBlock;
    const TabsBlock = require('@/components/blocks/TabsBlock').TabsBlock;

    // Set up core blocks (required)
    if (refs.textRef?.current) {
      connectors.create(refs.textRef.current, React.createElement(TextBlock, { text: "New Text" }));
    }
    if (refs.containerRef?.current) {
      connectors.create(
        refs.containerRef.current, 
        React.createElement(ContainerBlock, { 
          children: React.createElement('div', null) 
        })
      );
    }
    if (refs.sliderRef?.current) {
      connectors.create(
        refs.sliderRef.current, 
        React.createElement(SliderBlock, { 
          slides: [
            "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000&auto=format&fit=crop",
          ]
        })
      );
    }
    if (refs.animateRef?.current) {
      connectors.create(
        refs.animateRef.current, 
        React.createElement(AnimateBlock, { text: "Animated Text" })
      );
    }
    if (refs.accordionRef?.current) {
      connectors.create(
        refs.accordionRef.current, 
        React.createElement(AccordionBlock, { 
          title: "Accordion Title", 
          content: "Accordion Content" 
        })
      );
    }
    if (refs.tabsRef?.current) {
      connectors.create(
        refs.tabsRef.current, 
        React.createElement(TabsBlock, { 
          tabs: [
            { title: "Tab 1", content: "Content 1" },
            { title: "Tab 2", content: "Content 2" }
          ]
        })
      );
    }

    // Additional blocks can use the same components for now
    // We'll use the TextBlock for text-like components
    const textLikeRefs = ['headingRef', 'shortcodeRef', 'htmlRef'];
    textLikeRefs.forEach(refName => {
      if (refs[refName]?.current) {
        const element = refs[refName]?.current;
        if (element) {
          connectors.create(
            element, 
            React.createElement(TextBlock, { 
              text: `New ${refName.replace('Ref', '')}` 
            })
          );
        }
      }
    });

    // Use SliderBlock for image-like components
    const imageLikeRefs = ['imageRef', 'videoRef'];
    imageLikeRefs.forEach(refName => {
      if (refs[refName]?.current) {
        const element = refs[refName]?.current;
        if (element) {
          connectors.create(
            element, 
            React.createElement(SliderBlock, { 
              slides: [
                "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1000&auto=format&fit=crop"
              ]
            })
          );
        }
      }
    });

    // Use ContainerBlock for container-like components
    const containerLikeRefs = ['buttonRef', 'counterRef', 'progressRef', 'testimonialRef', 
                             'toggleRef', 'socialRef', 'alertRef', 'soundcloudRef', 
                             'menuRef', 'sidebarRef', 'readMoreRef'];
    containerLikeRefs.forEach(refName => {
      if (refs[refName]?.current) {
        const element = refs[refName]?.current;
        if (element) {
          connectors.create(
            element, 
            React.createElement(ContainerBlock, {
              children: React.createElement('div', null, refName.replace('Ref', ''))
            })
          );
        }
      }
    });

  }, [connectors, mounted, refs]);

  // Initialize connectors
  useEffect(() => {
    setupConnectors();
  }, [setupConnectors]);

  // Re-setup connectors when layout is loaded
  useEffect(() => {
    if (layoutLoaded) {
      // Set timeout to ensure editor has rendered
      setTimeout(() => {
        setupConnectors();
        setLayoutLoaded(false);
      }, 300);
    }
  }, [layoutLoaded, setupConnectors, setLayoutLoaded]);

  return { setupConnectors };
} 