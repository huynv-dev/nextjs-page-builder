"use client";

import { useNode } from "@craftjs/core";
import { useEffect, useRef } from "react";
import BlockContainer from '../editor/BlockContainer';

export const AdvancedTextBlock = ({
  text,
  // Typography
  fontSize,
  lineHeight,
  fontWeight,
  fontStyle,
  fontFamily,
  letterSpacing,
  textAlign,
  textDecoration,
  textTransform,
  // Colors
  color,
  backgroundColor,
  // Spacing
  padding,
  margin,
  // Border
  borderWidth,
  borderStyle,
  borderColor,
  borderRadius,
  // Shadow
  shadowColor,
  shadowBlur,
  shadowOffsetX,
  shadowOffsetY,
  // Advanced
  zIndex,
  opacity,
  maxWidth,
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
  
  // Construct style object
  const style = {
    // Typography
    fontSize: fontSize ? `${fontSize}px` : undefined,
    lineHeight: lineHeight ? lineHeight : undefined,
    fontWeight: fontWeight || undefined,
    fontStyle: fontStyle || undefined,
    fontFamily: fontFamily || undefined,
    letterSpacing: letterSpacing ? `${letterSpacing}px` : undefined,
    textAlign: textAlign || undefined,
    textDecoration: textDecoration || undefined,
    textTransform: textTransform || undefined,
    // Colors
    color: color || undefined,
    backgroundColor: backgroundColor || undefined,
    // Spacing
    padding: padding ? `${padding}px` : undefined,
    margin: margin ? `${margin}px` : undefined,
    // Border
    borderWidth: borderWidth ? `${borderWidth}px` : undefined,
    borderStyle: borderStyle || undefined,
    borderColor: borderColor || undefined,
    borderRadius: borderRadius ? `${borderRadius}px` : undefined,
    // Shadow
    boxShadow: shadowColor ? `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}` : undefined,
    // Advanced
    zIndex: zIndex || undefined,
    opacity: opacity !== undefined ? opacity : undefined,
    maxWidth: maxWidth ? `${maxWidth}px` : undefined,
    minHeight: "24px",
  };
  
  return (
    <BlockContainer>
      <div
        ref={ref}
        className="quill-content p-2 text-left bg-transparent"
        style={style}
        suppressContentEditableWarning
      ></div>
    </BlockContainer>
  );
};

AdvancedTextBlock.craft = {
  props: {
    text: "Edit me in settings panel",
    // Typography
    fontSize: 18,
    lineHeight: 1.5,
    fontWeight: "normal",
    fontStyle: "normal",
    fontFamily: "Arial, sans-serif",
    letterSpacing: 0,
    textAlign: "left",
    textDecoration: "none",
    textTransform: "none",
    // Colors
    color: "#000000",
    backgroundColor: "transparent",
    // Spacing
    padding: 0,
    margin: 0,
    // Border
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "#000000",
    borderRadius: 0,
    // Shadow
    shadowColor: "rgba(0,0,0,0)",
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    // Advanced
    zIndex: "auto",
    opacity: 1,
    maxWidth: null,
  },
  displayName: "Advanced Text",
  related: {
    settings: AdvancedTextSettings
  }
};

// Định nghĩa component cài đặt tùy chỉnh cho AdvancedTextBlock
function AdvancedTextSettings() {
  const { actions, selected, nodes } = useEditor((state) => {
    const currentNodeId = state.events.selected;
    let currentNode;
    if (currentNodeId) {
      currentNode = state.nodes[currentNodeId];
    }
    return {
      selected: currentNodeId,
      nodes: currentNode,
    };
  });

  const [openSections, setOpenSections] = useState({
    typography: true,
    colors: false,
    spacing: false,
    border: false,
    shadow: false,
    advanced: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!selected || !nodes) {
    return <div>Select a text block to edit</div>;
  }

  const props = nodes.data.props;

  const handlePropChange = (propName, value) => {
    actions.setProp(selected, (props) => {
      props[propName] = value;
    });
  };

  return (
    <div className="space-y-4">
      {/* Text Content Section */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-100 p-2 font-medium flex items-center justify-between cursor-pointer">
          <span>Content</span>
        </div>
        <div className="p-3">
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Text Content</label>
            <div className="border rounded">
              <ReactQuill 
                value={props.text} 
                onChange={(value) => handlePropChange('text', value)}
                modules={quillModules}
                formats={quillFormats}
                theme="snow"
                className="bg-white"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Typography Section */}
      <div className="border rounded-md overflow-hidden">
        <div 
          className="bg-gray-100 p-2 font-medium flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('typography')}
        >
          <span>Typography</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${openSections.typography ? 'rotate-180' : ''}`} 
          />
        </div>
        {openSections.typography && (
          <div className="p-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Font Size (px)</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={props.fontSize}
                onChange={(e) => handlePropChange('fontSize', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Line Height</label>
              <input
                type="number"
                step="0.1"
                className="border p-2 rounded w-full"
                value={props.lineHeight}
                onChange={(e) => handlePropChange('lineHeight', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Font Weight</label>
              <select
                className="border p-2 rounded w-full"
                value={props.fontWeight}
                onChange={(e) => handlePropChange('fontWeight', e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Lighter</option>
                <option value="bolder">Bolder</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
                <option value="700">700</option>
                <option value="800">800</option>
                <option value="900">900</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Font Style</label>
              <select
                className="border p-2 rounded w-full"
                value={props.fontStyle}
                onChange={(e) => handlePropChange('fontStyle', e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
                <option value="oblique">Oblique</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Font Family</label>
              <select
                className="border p-2 rounded w-full"
                value={props.fontFamily}
                onChange={(e) => handlePropChange('fontFamily', e.target.value)}
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="'Segoe UI', sans-serif">Segoe UI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Letter Spacing (px)</label>
              <input
                type="number"
                step="0.5"
                className="border p-2 rounded w-full"
                value={props.letterSpacing}
                onChange={(e) => handlePropChange('letterSpacing', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Text Align</label>
              <select
                className="border p-2 rounded w-full"
                value={props.textAlign}
                onChange={(e) => handlePropChange('textAlign', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Text Decoration</label>
              <select
                className="border p-2 rounded w-full"
                value={props.textDecoration}
                onChange={(e) => handlePropChange('textDecoration', e.target.value)}
              >
                <option value="none">None</option>
                <option value="underline">Underline</option>
                <option value="overline">Overline</option>
                <option value="line-through">Line Through</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Text Transform</label>
              <select
                className="border p-2 rounded w-full"
                value={props.textTransform}
                onChange={(e) => handlePropChange('textTransform', e.target.value)}
              >
                <option value="none">None</option>
                <option value="capitalize">Capitalize</option>
                <option value="uppercase">Uppercase</option>
                <option value="lowercase">Lowercase</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Colors Section */}
      <div className="border rounded-md overflow-hidden">
        <div 
          className="bg-gray-100 p-2 font-medium flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('colors')}
        >
          <span>Colors</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${openSections.colors ? 'rotate-180' : ''}`} 
          />
        </div>
        {openSections.colors && (
          <div className="p-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Text Color</label>
              <div className="flex">
                <input
                  type="color"
                  className="border p-1 rounded"
                  value={props.color}
                  onChange={(e) => handlePropChange('color', e.target.value)}
                />
                <input
                  type="text"
                  className="border p-2 rounded ml-2 flex-1"
                  value={props.color}
                  onChange={(e) => handlePropChange('color', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Background Color</label>
              <div className="flex">
                <input
                  type="color"
                  className="border p-1 rounded"
                  value={props.backgroundColor === 'transparent' ? '#ffffff' : props.backgroundColor}
                  onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
                />
                <input
                  type="text"
                  className="border p-2 rounded ml-2 flex-1"
                  value={props.backgroundColor}
                  onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
                  placeholder="transparent"
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={props.backgroundColor === 'transparent'}
                  onChange={(e) => handlePropChange('backgroundColor', e.target.checked ? 'transparent' : '#ffffff')}
                  className="mr-2"
                />
                <span className="text-sm">Transparent background</span>
              </label>
            </div>
          </div>
        )}
      </div>
      
      {/* Spacing Section */}
      <div className="border rounded-md overflow-hidden">
        <div 
          className="bg-gray-100 p-2 font-medium flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('spacing')}
        >
          <span>Spacing</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${openSections.spacing ? 'rotate-180' : ''}`} 
          />
        </div>
        {openSections.spacing && (
          <div className="p-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Padding (px)</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={props.padding}
                onChange={(e) => handlePropChange('padding', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Margin (px)</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={props.margin}
                onChange={(e) => handlePropChange('margin', Number(e.target.value))}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Border Section */}
      <div className="border rounded-md overflow-hidden">
        <div 
          className="bg-gray-100 p-2 font-medium flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('border')}
        >
          <span>Border</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${openSections.border ? 'rotate-180' : ''}`} 
          />
        </div>
        {openSections.border && (
          <div className="p-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Border Width (px)</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={props.borderWidth}
                onChange={(e) => handlePropChange('borderWidth', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Border Style</label>
              <select
                className="border p-2 rounded w-full"
                value={props.borderStyle}
                onChange={(e) => handlePropChange('borderStyle', e.target.value)}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
                <option value="groove">Groove</option>
                <option value="ridge">Ridge</option>
                <option value="inset">Inset</option>
                <option value="outset">Outset</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Border Color</label>
              <div className="flex">
                <input
                  type="color"
                  className="border p-1 rounded"
                  value={props.borderColor}
                  onChange={(e) => handlePropChange('borderColor', e.target.value)}
                />
                <input
                  type="text"
                  className="border p-2 rounded ml-2 flex-1"
                  value={props.borderColor}
                  onChange={(e) => handlePropChange('borderColor', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Border Radius (px)</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={props.borderRadius}
                onChange={(e) => handlePropChange('borderRadius', Number(e.target.value))}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Shadow Section */}
      <div className="border rounded-md overflow-hidden">
        <div 
          className="bg-gray-100 p-2 font-medium flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('shadow')}
        >
          <span>Shadow</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${openSections.shadow ? 'rotate-180' : ''}`} 
          />
        </div>
        {openSections.shadow && (
          <div className="p-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Shadow Color</label>
              <div className="flex">
                <input
                  type="color"
                  className="border p-1 rounded"
                  value={props.shadowColor === 'rgba(0,0,0,0)' ? '#000000' : props.shadowColor}
                  onChange={(e) => handlePropChange('shadowColor', e.target.value)}
                />
                <input
                  type="text"
                  className="border p-2 rounded ml-2 flex-1"
                  value={props.shadowColor}
                  onChange={(e) => handlePropChange('shadowColor', e.target.value)}
                  placeholder="rgba(0,0,0,0.2)"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Blur Radius (px)</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={props.shadowBlur}
                onChange={(e) => handlePropChange('shadowBlur', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Offset X (px)</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={props.shadowOffsetX}
                onChange={(e) => handlePropChange('shadowOffsetX', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Offset Y (px)</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={props.shadowOffsetY}
                onChange={(e) => handlePropChange('shadowOffsetY', Number(e.target.value))}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Advanced Section */}
      <div className="border rounded-md overflow-hidden">
        <div 
          className="bg-gray-100 p-2 font-medium flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('advanced')}
        >
          <span>Advanced</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${openSections.advanced ? 'rotate-180' : ''}`} 
          />
        </div>
        {openSections.advanced && (
          <div className="p-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Z-Index</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={props.zIndex === 'auto' ? '' : props.zIndex}
                onChange={(e) => handlePropChange('zIndex', e.target.value === '' ? 'auto' : Number(e.target.value))}
                placeholder="auto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Opacity</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                className="border p-2 rounded w-full"
                value={props.opacity}
                onChange={(e) => handlePropChange('opacity', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Width (px)</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={props.maxWidth === null ? '' : props.maxWidth}
                onChange={(e) => handlePropChange('maxWidth', e.target.value === '' ? null : Number(e.target.value))}
                placeholder="None"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Thêm import cần thiết ở đầu file
import { useEditor } from "@craftjs/core";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import React Quill
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="border p-2 rounded h-40 flex items-center justify-center text-gray-400">Loading editor...</div>
});

// Import React Quill styles
import 'react-quill/dist/quill.snow.css';

// Quill editor configuration
const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],
    ['link', 'image']
  ]
};

const quillFormats = [
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
  'header', 'list', 'script', 'indent', 'direction', 'size',
  'color', 'background', 'font', 'align', 'clean', 'link', 'image'
]; 