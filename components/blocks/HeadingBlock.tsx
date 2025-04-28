"use client";

import { useNode, useEditor } from "@craftjs/core";
import { useEffect, useRef, useState } from "react";
import BlockContainer from '../editor/BlockContainer';
import { ChevronDown, Link, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { CSSProperties } from 'react';

// Define proper interface for HeadingBlock props
interface HeadingBlockProps {
  text: string;
  link?: string;
  targetBlank?: boolean;
  // Heading specific
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: number;
  align?: 'left' | 'center' | 'right' | 'justify';
  // Style
  color?: string;
  textShadow?: string;
  // Advanced
  padding?: number;
  margin?: number;
  borderWidth?: number;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: number;
}

// Type for settings tab names
type TabName = 'content' | 'style' | 'advanced';

export const HeadingBlock = ({
  text,
  link,
  targetBlank,
  tag,
  size,
  align,
  color,
  textShadow,
  padding,
  margin,
  borderWidth,
  borderStyle,
  borderColor,
  borderRadius,
}: HeadingBlockProps) => {
  const { connectors: { connect, drag } } = useNode();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      connect(drag(ref.current));
    }
  }, [connect, drag]);
  
  // Construct style object
  const style: CSSProperties = {
    fontSize: size ? `${size}px` : undefined,
    textAlign: align || 'left',
    color: color || undefined,
    textShadow: textShadow || undefined,
    padding: padding ? `${padding}px` : undefined,
    margin: margin ? `${margin}px` : undefined,
    borderWidth: borderWidth ? `${borderWidth}px` : undefined,
    borderStyle: borderStyle || undefined,
    borderColor: borderColor || undefined,
    borderRadius: borderRadius ? `${borderRadius}px` : undefined,
  };
  
  // Render the appropriate heading tag
  const renderHeading = () => {
    const headingContent = link ? (
      <a href={link} target={targetBlank ? "_blank" : "_self"} rel="noopener noreferrer">
        {text}
      </a>
    ) : text;

    switch (tag) {
      case 'h1':
        return <h1 style={style}>{headingContent}</h1>;
      case 'h2':
        return <h2 style={style}>{headingContent}</h2>;
      case 'h3':
        return <h3 style={style}>{headingContent}</h3>;
      case 'h4':
        return <h4 style={style}>{headingContent}</h4>;
      case 'h5':
        return <h5 style={style}>{headingContent}</h5>;
      case 'h6':
        return <h6 style={style}>{headingContent}</h6>;
      default:
        return <h2 style={style}>{headingContent}</h2>;
    }
  };
  
  return (
    <BlockContainer>
      <div ref={ref} className="heading-block">
        {renderHeading()}
      </div>
    </BlockContainer>
  );
};

HeadingBlock.craft = {
  props: {
    text: "Heading Text",
    link: "",
    targetBlank: true,
    tag: "h2",
    size: 24,
    align: "left",
    color: "#000000",
    textShadow: "",
    padding: 0,
    margin: 0,
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "#000000",
    borderRadius: 0,
  },
  displayName: "Heading",
  related: {
    settings: HeadingBlockSettings
  }
};

// Define settings component for HeadingBlock
function HeadingBlockSettings() {
  const { actions, selected, nodes } = useEditor((state) => {
    const currentNodeId = state.events.selected;
    let currentNode = null;
    if (currentNodeId && typeof currentNodeId === 'string') {
      currentNode = state.nodes[currentNodeId];
    }
    return {
      selected: currentNodeId,
      nodes: currentNode,
    };
  });

  const [activeTab, setActiveTab] = useState<TabName>('content');

  if (!selected || !nodes) {
    return <div>Select a heading block to edit</div>;
  }

  const props = nodes.data.props;

  const handlePropChange = (propName: string, value: any) => {
    if (typeof selected === 'string') {
      actions.setProp(selected, (props: any) => {
        props[propName] = value;
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs Navigation */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'content' ? 'text-[#6a0075] border-b-2 border-[#6a0075]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'style' ? 'text-[#6a0075] border-b-2 border-[#6a0075]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('style')}
        >
          Style
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'advanced' ? 'text-[#6a0075] border-b-2 border-[#6a0075]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('advanced')}
        >
          Advanced
        </button>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Heading Text</label>
            <textarea
              className="border p-2 rounded w-full min-h-[100px]"
              value={props.text}
              onChange={(e) => handlePropChange('text', e.target.value)}
              placeholder="Enter heading text"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Link (Optional)</label>
            <div className="flex items-center">
              <span className="bg-gray-100 p-2 border border-r-0 rounded-l"><Link size={16} /></span>
              <input
                type="text"
                className="border rounded-r p-2 flex-1"
                value={props.link || ''}
                onChange={(e) => handlePropChange('link', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="mt-2">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={props.targetBlank}
                  onChange={(e) => handlePropChange('targetBlank', e.target.checked)}
                  className="mr-2"
                />
                <span>Open in new tab</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">HTML Tag</label>
            <select
              className="border p-2 rounded w-full"
              value={props.tag}
              onChange={(e) => handlePropChange('tag', e.target.value)}
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
              <option value="h5">H5</option>
              <option value="h6">H6</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Font Size (px)</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={props.size}
              onChange={(e) => handlePropChange('size', Number(e.target.value))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Alignment</label>
            <div className="flex border rounded overflow-hidden">
              <button
                className={`flex-1 p-2 ${props.align === 'left' ? 'bg-[#6a0075] text-white' : 'bg-white'}`}
                onClick={() => handlePropChange('align', 'left')}
                title="Align Left"
              >
                <AlignLeft size={16} className="mx-auto" />
              </button>
              <button
                className={`flex-1 p-2 ${props.align === 'center' ? 'bg-[#6a0075] text-white' : 'bg-white'}`}
                onClick={() => handlePropChange('align', 'center')}
                title="Align Center"
              >
                <AlignCenter size={16} className="mx-auto" />
              </button>
              <button
                className={`flex-1 p-2 ${props.align === 'right' ? 'bg-[#6a0075] text-white' : 'bg-white'}`}
                onClick={() => handlePropChange('align', 'right')}
                title="Align Right"
              >
                <AlignRight size={16} className="mx-auto" />
              </button>
              <button
                className={`flex-1 p-2 ${props.align === 'justify' ? 'bg-[#6a0075] text-white' : 'bg-white'}`}
                onClick={() => handlePropChange('align', 'justify')}
                title="Justify"
              >
                <AlignJustify size={16} className="mx-auto" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Style Tab */}
      {activeTab === 'style' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Text Color</label>
            <div className="flex">
              <input
                type="color"
                className="border p-1 rounded"
                value={props.color || '#000000'}
                onChange={(e) => handlePropChange('color', e.target.value)}
              />
              <input
                type="text"
                className="border p-2 rounded ml-2 flex-1"
                value={props.color || '#000000'}
                onChange={(e) => handlePropChange('color', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Text Shadow</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={props.textShadow || ''}
              onChange={(e) => handlePropChange('textShadow', e.target.value)}
              placeholder="1px 1px 2px rgba(0,0,0,0.3)"
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                className="border p-1 text-xs rounded hover:bg-gray-50"
                onClick={() => handlePropChange('textShadow', '1px 1px 2px rgba(0,0,0,0.3)')}
              >
                Soft Shadow
              </button>
              <button
                className="border p-1 text-xs rounded hover:bg-gray-50"
                onClick={() => handlePropChange('textShadow', '2px 2px 0px rgba(0,0,0,0.8)')}
              >
                Hard Shadow
              </button>
              <button
                className="border p-1 text-xs rounded hover:bg-gray-50"
                onClick={() => handlePropChange('textShadow', '0px 0px 5px rgba(0,0,255,0.5)')}
              >
                Glow Effect
              </button>
              <button
                className="border p-1 text-xs rounded hover:bg-gray-50"
                onClick={() => handlePropChange('textShadow', '')}
              >
                No Shadow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Padding (px)</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={props.padding || 0}
                onChange={(e) => handlePropChange('padding', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Margin (px)</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={props.margin || 0}
                onChange={(e) => handlePropChange('margin', Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="border-t pt-3">
            <h3 className="font-medium text-sm mb-2">Border</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Width (px)</label>
                <input
                  type="number"
                  className="border p-2 rounded w-full"
                  value={props.borderWidth || 0}
                  onChange={(e) => handlePropChange('borderWidth', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Style</label>
                <select
                  className="border p-2 rounded w-full"
                  value={props.borderStyle || 'solid'}
                  onChange={(e) => handlePropChange('borderStyle', e.target.value)}
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <div className="flex">
                  <input
                    type="color"
                    className="border p-1 rounded"
                    value={props.borderColor || '#000000'}
                    onChange={(e) => handlePropChange('borderColor', e.target.value)}
                  />
                  <input
                    type="text"
                    className="border p-2 rounded ml-2 flex-1"
                    value={props.borderColor || '#000000'}
                    onChange={(e) => handlePropChange('borderColor', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Radius (px)</label>
                <input
                  type="number"
                  className="border p-2 rounded w-full"
                  value={props.borderRadius || 0}
                  onChange={(e) => handlePropChange('borderRadius', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 