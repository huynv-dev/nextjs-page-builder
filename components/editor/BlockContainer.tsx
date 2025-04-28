'use client';

import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { Trash2, ArrowUpDown } from 'lucide-react';

// Define Button props interface
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
}

// Tạo component Button sử dụng forwardRef
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onClick, className = '', title, style }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className={className}
      title={title}
      style={style}
    >
      {children}
    </button>
  )
);

// Add display name for better debugging
Button.displayName = 'Button';

interface BlockContainerProps {
  children: React.ReactNode;
  className?: string;
  disableInteraction?: boolean;
  buttonClassName?: string;
  showButtons?: boolean;
}

export const BlockContainer: React.FC<BlockContainerProps> = ({
  children,
  className = '',
  disableInteraction = false,
  buttonClassName = '',
  showButtons = true,
}) => {
  const { id, connectors, isActive, isHovered } = useNode((node) => ({
    isActive: node.events.selected,
    isHovered: node.events.hovered,
    name: node.data.custom?.displayName || node.data.displayName
  }));
  
  // Sử dụng useEditor để có thể xóa node
  const { actions: editorActions } = useEditor();

  // Lấy thông tin về trạng thái ẩn/hiện
  const { hidden } = useNode((node) => ({
    hidden: node.data.hidden
  }));

  const containerRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  
  // Synchronize the component's hover state
  useEffect(() => {
    if (containerRef.current && !disableInteraction) {
      const handleMouseEnter = () => {
        setHovering(true);
      };
      
      const handleMouseLeave = () => {
        setHovering(false);
      };
      
      const domElement = containerRef.current;
      domElement.addEventListener('mouseenter', handleMouseEnter);
      domElement.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        domElement.removeEventListener('mouseenter', handleMouseEnter);
        domElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [id, disableInteraction]);

  // Generate the CSS classes for hover and selection states
  const stateClasses = [
    className,
    isHovered || hovering ? 'craftjs-node-hover' : '',
    isActive ? 'craftjs-node-selected' : '',
  ].filter(Boolean).join(' ');

  // Lấy thông tin node từ Craft.js
  const { displayName } = useNode((node) => ({
    displayName: node.data.displayName || 'Block'
  }));

  // Nếu node bị ẩn, hiển thị với kiểu ẩn
  if (hidden) {
    return (
      <div
        ref={(ref) => {
          if (!disableInteraction && ref) {
            connectors.connect(ref);
          }
          (containerRef as any).current = ref;
        }}
        className={`${stateClasses} craft-hidden-element`}
      >
        {children}
        
        {isActive && !disableInteraction && (
          <div className="absolute -top-5 left-0 bg-primary text-white text-xs py-1 px-2 rounded-t-md font-medium z-20">
            {displayName} (hidden)
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={(ref) => {
        if (!disableInteraction && ref) {
          connectors.connect(ref);
        }
        (containerRef as any).current = ref;
      }}
      className={stateClasses}
    >
      {children}
      
      {showButtons && isActive && !disableInteraction && (
        <div className={`block-controls absolute -right-3 top-0 flex flex-col gap-1 z-20 ${buttonClassName}`}>
          <Button
            className="h-6 w-6 rounded-full bg-white shadow-lg hover:bg-primary-light border border-primary-light text-primary"
            ref={(ref: HTMLButtonElement | null) => {
              if (ref) connectors.drag(ref);
            }}
            title="Move"
          >
            <ArrowUpDown className="h-3 w-3" />
          </Button>
          
          <Button
            className="h-6 w-6 rounded-full bg-white shadow-lg hover:bg-primary-light border border-primary-light text-primary"
            onClick={() => {
              // Sử dụng editorActions để xóa node
              editorActions.delete(id);
            }}
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {isActive && !disableInteraction && (
        <div className="absolute -top-5 left-0 bg-primary text-white text-xs py-1 px-2 rounded-t-md font-medium z-20">
          {displayName}
        </div>
      )}
    </div>
  );
};

export default BlockContainer; 