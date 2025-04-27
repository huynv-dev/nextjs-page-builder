"use client";

import { useEffect, useRef, useState } from "react";
import { useNode } from "@craftjs/core";
import BlockContainer from '../editor/BlockContainer';

export const AccordionBlock = ({ title, content }: { title: string; content: string }) => {
  const { connectors: { connect, drag } } = useNode();
  const [open, setOpen] = useState(false);
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
        className="accordion"
        data-type="accordion"
      >
        <button onClick={() => setOpen(!open)} className="w-full text-left p-4 bg-gray-200">
          {title}
        </button>
        {open && <div className="p-4 bg-gray-100">{content}</div>}
      </div>
    </BlockContainer>
  );
};

AccordionBlock.craft = {
  props: {
    title: "Accordion Title",
    content: "Accordion content goes here...",
  },
  displayName: "Accordion",
};
