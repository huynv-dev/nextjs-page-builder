"use client";

import { useNode } from "@craftjs/core";
import { useEffect } from "react";
import { useRef } from "react";
import BlockContainer from '../editor/BlockContainer';

export const AnimateBlock = ({ text }: { text: string }) => {
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
        className="aos-animate"
        data-type="animate"
        data-aos="fade-up"
      >
        <p className="text-center p-4">{text}</p>
      </div>
    </BlockContainer>
  );
};

AnimateBlock.craft = {
  props: {
    text: "Animated Text",
  },
  displayName: "Animate",
};
