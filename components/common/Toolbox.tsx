"use client";

import { useEditor } from "@craftjs/core";
import { useEffect, useRef, useState } from "react";
import { TextBlock } from "../blocks/TextBlock";
import { ContainerBlock } from "../blocks/ContainerBlock";
import { SliderBlock } from "../blocks/SliderBlock";
import { AnimateBlock } from "../blocks/AnimateBlock";
import { AccordionBlock } from "../blocks/AccordionBlock";
import { TabsBlock } from "../blocks/TabsBlock";

export const Toolbox = () => {
  const { connectors } = useEditor();
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const animateRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
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
  }, [connectors, mounted]);

  return (
    <div className="space-y-2">
      <div ref={textRef} className="p-2 bg-white border cursor-pointer">Text</div>
      <div ref={containerRef} className="p-2 bg-white border cursor-pointer">Container</div>
      <div ref={sliderRef} className="p-2 bg-white border cursor-pointer">Slider</div>
      <div ref={animateRef} className="p-2 bg-white border cursor-pointer">Animate</div>
      <div ref={accordionRef} className="p-2 bg-white border cursor-pointer">Accordion</div>
      <div ref={tabsRef} className="p-2 bg-white border cursor-pointer">Tabs</div>
    </div>
  );
};
