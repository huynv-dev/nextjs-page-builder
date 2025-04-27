"use client";

import { useNode } from "@craftjs/core";
import { useEffect, useRef } from "react";
import BlockContainer from '../editor/BlockContainer';

export const TextBlock = ({
  text,
  fontSize,
  color,
}: {
  text: string;
  fontSize?: number;
  color?: string;
}) => {
  const { connectors: { connect, drag } } = useNode();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = text;
      
      // Thêm các lớp CSS cần thiết cho các phần tử được tạo từ Quill
      const codeBlocks = ref.current.querySelectorAll('pre');
      codeBlocks.forEach(block => {
        if (!block.classList.contains('ql-syntax')) {
          block.classList.add('ql-syntax');
        }
      });
    }
  }, [text]);

  useEffect(() => {
    if (ref.current) {
      connect(drag(ref.current));
    }
  }, [connect, drag]);
  
  return (
    <BlockContainer>
      <div
        ref={ref}
        className="quill-content p-2 text-left bg-transparent"
        style={{
          fontSize: fontSize ? `${fontSize}px` : undefined,
          color: color || undefined,
          minHeight: "24px",
        }}
        suppressContentEditableWarning
      ></div>
    </BlockContainer>
  );
};

TextBlock.craft = {
  props: {
    text: "Edit me in settings panel",
    fontSize: 18,
    color: "#000000",
  },
  displayName: "Text",
};
