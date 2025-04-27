"use client";

import { useEffect, useRef, useState } from "react";
import { useNode } from "@craftjs/core";
import BlockContainer from '../editor/BlockContainer';

export const TabsBlock = ({ tabs }: { tabs: { title: string; content: string }[] }) => {
  const { connectors: { connect, drag } } = useNode();
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      connect(drag(ref.current));
    }
  }, [connect, drag]);
  return (
    <BlockContainer>
      <div
        ref={ref}
        className="tabs-block"
        data-type="tabs"
      >
        <div className="flex space-x-2">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`p-2 ${active === index ? "bg-primary text-white" : "bg-gray-200"}`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <div className="p-4 bg-gray-100">
          {tabs[active]?.content}
        </div>
      </div>
    </BlockContainer>
  );
};

TabsBlock.craft = {
  props: {
    tabs: [
      { title: "Tab 1", content: "Content for Tab 1" },
      { title: "Tab 2", content: "Content for Tab 2" },
    ],
  },
  displayName: "Tabs",
};
