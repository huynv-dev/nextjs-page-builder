"use client";

import { useEditor } from "@craftjs/core";
import { useEffect, useRef, useState } from "react";
import { Copy, Trash2, Move, ChevronUp, ChevronDown, ArrowUp } from "lucide-react";

export const FloatingToolbar = () => {
  const { actions, selected, node, query } = useEditor((state) => {
    const currentNodeId = Array.from(state.events.selected)[0];
    let currentNode;
    if (currentNodeId) {
      currentNode = state.nodes[currentNodeId];
    }
    return {
      selected: currentNodeId,
      node: currentNode,
    };
  });

  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showMoveOptions, setShowMoveOptions] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const moveButtonRef = useRef<HTMLButtonElement>(null);
  const moveDropdownRef = useRef<HTMLDivElement>(null);

  // Update position when selected node changes
  useEffect(() => {
    if (selected && node?.dom) {
      const updatePosition = () => {
        if (node?.dom && toolbarRef.current) {
          const rect = node.dom.getBoundingClientRect();
          setPosition({
            top: Math.max(rect.top - 50, 10), // Prevent going off the top of screen
            left: Math.max(rect.left, 10)     // Prevent going off the left of screen
          });
        }
      };

      // Initial position update
      updatePosition();

      // Update position on scroll and resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      // Clean up
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [selected, node]);

  // Close move options when clicking outside, but only when dropdown is open
  useEffect(() => {
    if (!showMoveOptions) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both the button and dropdown
      if (
        moveButtonRef.current && 
        moveDropdownRef.current &&
        !moveButtonRef.current.contains(event.target as Node) &&
        !moveDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMoveOptions(false);
      }
    };

    // Add event listener only when dropdown is open
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoveOptions]);
  
  // Handle move actions
  const handleMoveUp = () => {
    const parent = node?.data?.parent;
    if (parent) {
      const siblings = query.node(parent).childNodes();
      const currentIndex = siblings.indexOf(selected);
      if (currentIndex > 0) {
        actions.move(selected, parent, currentIndex - 1);
      }
    }
    setShowMoveOptions(false);
  };
  
  const handleMoveDown = () => {
    const parent = node?.data?.parent;
    if (parent) {
      const siblings = query.node(parent).childNodes();
      const currentIndex = siblings.indexOf(selected);
      if (currentIndex < siblings.length - 1) {
        actions.move(selected, parent, currentIndex + 1);
      }
    }
    setShowMoveOptions(false);
  };

  // Handle duplicate action
  const handleDuplicate = () => {
    if (selected) {
      // Clone không được hỗ trợ trực tiếp, sử dụng phương pháp khác
      const targetNode = query.node(selected).get();
      const parent = node?.data?.parent;
      
      if (parent) {
        const siblings = query.node(parent).childNodes();
        const currentIndex = siblings.indexOf(selected);
        const nodeData = JSON.parse(JSON.stringify(targetNode.data));
        
        actions.addNodeTree(nodeData, parent, currentIndex + 1);
      }
    }
  };

  // Handle delete action
  const handleDelete = () => {
    actions.delete(selected);
  };

  const canMoveUp = () => {
    if (!node?.data?.parent) return false;
    const siblings = query.node(node.data.parent).childNodes();
    const currentIndex = siblings.indexOf(selected);
    return currentIndex > 0;
  };

  const canMoveDown = () => {
    if (!node?.data?.parent) return false;
    const siblings = query.node(node.data.parent).childNodes();
    const currentIndex = siblings.indexOf(selected);
    return currentIndex < siblings.length - 1;
  };
  
  if (!selected || !node) {
    return null;
  }
  
  return (
    <div
      ref={toolbarRef}
      className="floating-toolbar absolute text-white p-2 rounded flex space-x-2 z-[400] shadow-lg"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <button 
        onClick={handleMoveUp} 
        className={`hover:bg-primary-medium p-1 rounded ${!canMoveUp() ? 'opacity-50' : ''}`} 
        title="Move Up"
        disabled={!canMoveUp()}
      >
        <ArrowUp size={16} />
      </button>
      <div className="relative">
        <button 
          ref={moveButtonRef}
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling
            setShowMoveOptions(!showMoveOptions);
          }} 
          className="hover:bg-primary-medium p-1 rounded flex items-center" 
          title="Move Options"
        >
          <Move size={16} />
        </button>
        {showMoveOptions && (
          <div 
            ref={moveDropdownRef}
            className="absolute top-8 left-0 bg-white rounded shadow-lg z-10 w-32 py-1 overflow-hidden text-gray-700"
            onClick={(e) => e.stopPropagation()} // Prevent event from bubbling
          >
            <button 
              onClick={handleMoveUp} 
              className={`flex items-center w-full px-3 py-2 text-sm ${canMoveUp() ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!canMoveUp()}
            >
              <ChevronUp size={14} className="mr-2" />
              Move Up
            </button>
            <button 
              onClick={handleMoveDown} 
              className={`flex items-center w-full px-3 py-2 text-sm ${canMoveDown() ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!canMoveDown()}
            >
              <ChevronDown size={14} className="mr-2" />
              Move Down
            </button>
          </div>
        )}
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent event from bubbling
          handleDuplicate();
        }} 
        className="hover:bg-primary-medium p-1 rounded" 
        title="Duplicate"
      >
        <Copy size={16} />
      </button>
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent event from bubbling
          handleDelete();
        }} 
        className="hover:bg-red-500 p-1 rounded" 
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
