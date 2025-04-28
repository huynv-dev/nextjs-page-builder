"use client";

import { useEditor } from "@craftjs/core";
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, Square, PanelLeft, Layout, Type, Image, FileText } from 'lucide-react';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="border p-2 rounded h-40 flex items-center justify-center text-gray-400">Loading editor...</div>
});

// Import React Quill styles
import 'react-quill/dist/quill.snow.css';

// Tabs for Settings Panel
type SettingsTab = 'style' | 'layers';

interface SettingsPanelProps {
  activeTab?: SettingsTab;
}

export const SettingsPanel = ({ activeTab = 'style' }: SettingsPanelProps) => {
  const { actions, selected, nodes } = useEditor((state) => {
    const currentNodeId = Array.from(state.events.selected)[0];
    let currentNode;
    if (currentNodeId) {
      currentNode = state.nodes[currentNodeId];
    }
    return {
      selected: currentNodeId,
      nodes: currentNode,
    };
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Quill editor modules and formats
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

  // Get the full editor state to access all nodes
  const { query, connectors } = useEditor();
  
  // Create a function to render the layer tree recursively
  const renderLayers = (nodeId: string, level = 0) => {
    const node = query.node(nodeId).get();
    const isCanvas = node.data.isCanvas;
    const childNodes = isCanvas ? query.node(nodeId).childNodes() : [];
    const isSelected = selected === nodeId;
    const displayName = node.data.displayName || node.data.name || 'Layer';
    const isHidden = node.data.hidden;
    
    return (
      <div key={nodeId} style={{ marginLeft: `${level * 16}px` }}>
        <div 
          className={`flex items-center p-2 hover:bg-gray-100 rounded ${isSelected ? 'bg-primary/10 text-primary' : ''}`}
          onClick={() => {
            actions.selectNode(nodeId);
          }}
        >
          {isCanvas && childNodes.length > 0 && (
            <button className="mr-1 text-gray-500 hover:text-gray-700" onClick={(e) => {
              e.stopPropagation();
              actions.setProp(nodeId, (props: any) => {
                props.expanded = !node.data.props.expanded;
              });
            }}>
              {node.data.props.expanded !== false ? 
                <ChevronDown size={16} /> : 
                <ChevronUp size={16} />
              }
            </button>
          )}
          
          <button 
            className={`mr-2 hover:text-primary ${isHidden ? 'text-gray-400' : 'text-gray-500'}`}
            onClick={(e) => {
              e.stopPropagation();
              // Toggle hidden property
              const newHidden = !isHidden;
              
              // Cập nhật trạng thái ẩn/hiện
              actions.setHidden(nodeId, newHidden);
            }}
          >
            {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          
          {getLayerIcon(node.data)}
          
          <span className={`ml-1 text-sm flex-1 truncate ${isHidden ? 'text-gray-400' : ''}`}>
            {displayName}
          </span>
        </div>
        
        {isCanvas && childNodes.length > 0 && node.data.props.expanded !== false && (
          <div>
            {childNodes.map(childId => renderLayers(childId, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  // Helper function to get appropriate icon for layer type
  const getLayerIcon = (nodeData: any) => {
    const type = nodeData.displayName?.toLowerCase() || '';
    
    if (type.includes('text')) return <FileText size={16} className="text-primary/70" />;
    if (type.includes('heading')) return <Type size={16} className="text-primary/70" />;
    if (type.includes('container')) return <Layout size={16} className="text-primary/70" />;
    if (type.includes('image')) return <Image size={16} className="text-primary/70" />;
    if (type.includes('slider')) return <PanelLeft size={16} className="text-primary/70" />;
    if (type.includes('accordion')) return <ChevronDown size={16} className="text-primary/70" />;
    if (type.includes('tabs')) return <Square size={16} className="text-primary/70" />;
    
    return <Square size={16} className="text-primary/70" />;
  };

  // Get the root node ID
  const rootNodeId = Object.keys(query.getNodes()).find(id => !query.node(id).get().data.parent) || '';

  // Create a function to render the Properties panel
  const renderProperties = () => {
    if (!selected || !nodes) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-400">
          <Square size={32} className="mb-2 text-gray-300" />
          <p className="text-sm">Select a block to edit settings</p>
          <p className="text-xs mt-2">Click on any element in the canvas to customize it</p>
        </div>
      );
    }

    const nodeData = nodes.data;
    const { props } = nodeData;

    // Update function for each prop
    const handlePropChange = (propName: string, value: any) => {
      actions.setProp(selected, (props: any) => {
        props[propName] = value;
      });
    };

    return (
      <div className="space-y-6">
        {/* Component Name */}
        <div className="mb-4">
          <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
            {nodeData.displayName}
          </span>
        </div>
        
        {/* Text Content with Rich Text Editor */}
        {mounted && "text" in props && (
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Text Content</label>
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
        )}

        {/* Font Size */}
        {"fontSize" in props && (
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Font Size (px)</label>
            <input
              type="number"
              className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={props.fontSize}
              onChange={(e) => handlePropChange('fontSize', Number(e.target.value))}
            />
          </div>
        )}

        {/* Text Color */}
        {"color" in props && (
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Text Color</label>
            <div className="flex items-center">
              <input
                type="color"
                className="w-10 h-10 border p-1 rounded-l"
                value={props.color}
                onChange={(e) => handlePropChange('color', e.target.value)}
              />
              <input 
                type="text"
                className="border p-2 rounded-r flex-1 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                value={props.color}
                onChange={(e) => handlePropChange('color', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Background Color */}
        {"backgroundColor" in props && (
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Background Color</label>
            <div className="flex items-center">
              <input
                type="color"
                className="w-10 h-10 border p-1 rounded-l"
                value={props.backgroundColor}
                onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
              />
              <input 
                type="text"
                className="border p-2 rounded-r flex-1 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                value={props.backgroundColor}
                onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Padding */}
        {"padding" in props && (
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Padding (px)</label>
            <input
              type="number"
              className="border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={props.padding}
              onChange={(e) => handlePropChange('padding', Number(e.target.value))}
            />
          </div>
        )}

        {/* Slides for SliderBlock */}
        {"slides" in props && Array.isArray(props.slides) && (
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Slides (URLs)</label>
            {props.slides.map((slide: string, index: number) => (
              <div key={index} className="flex items-center mb-1">
                <input
                  type="text"
                  className="border p-2 rounded flex-1 mr-1 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  value={slide}
                  onChange={(e) => {
                    actions.setProp(selected, (props: any) => {
                      props.slides[index] = e.target.value;
                    });
                  }}
                />
                <button
                  className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100"
                  onClick={() => {
                    actions.setProp(selected, (props: any) => {
                      props.slides.splice(index, 1);
                    });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="mt-2 p-2 bg-primary/10 text-primary rounded hover:bg-primary/20"
              onClick={() => {
                actions.setProp(selected, (props: any) => {
                  props.slides.push('https://via.placeholder.com/600x400');
                });
              }}
            >
              Add Slide
            </button>
          </div>
        )}
      </div>
    );
  };

  if (activeTab === "layers") {
    return (
      <div className="h-full">
        {/* Layers Tree */}
        <div className="mb-4">
          <div className="mb-2 text-sm font-medium text-gray-700">Page Structure</div>
          <div className="border rounded bg-white">
            {rootNodeId && renderLayers(rootNodeId)}
          </div>
        </div>
      </div>
    );
  }

  return renderProperties();
};
