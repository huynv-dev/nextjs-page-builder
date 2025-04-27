"use client";

import { useNode } from "@craftjs/core";
import { useEffect, useRef } from "react";
import BlockContainer from '../editor/BlockContainer';

export const ContainerBlock = ({
  children,
  backgroundColor,
  padding,
}: { 
  children: React.ReactNode;
  backgroundColor?: string;
  padding?: number;
}) => {
  const { connectors: { connect, drag } } = useNode();
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
        style={{
          backgroundColor: backgroundColor || "#f9fafb",
          padding: padding ? `${padding}px` : "24px",
        }}
        className="min-h-[50px] border-2 border-dashed"
      >
        {children}
      </div>
    </BlockContainer>
  );
};

ContainerBlock.craft = {
  props: {
    backgroundColor: "#f9fafb",
    padding: 24,
  },
  displayName: "Container",
};
