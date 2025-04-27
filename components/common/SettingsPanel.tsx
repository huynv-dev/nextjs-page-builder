"use client";

import { useEditor } from "@craftjs/core";
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, Square } from 'lucide-react';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="border p-2 rounded h-40 flex items-center justify-center text-gray-400">Loading editor...</div>
});

// Import React Quill styles
import 'react-quill/dist/quill.snow.css';

// Tabs for Settings Panel
type SettingsTab = 'properties' | 'layers';

export const SettingsPanel = () => {
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
  const [activeTab, setActiveTab] = useState<SettingsTab>('properties');

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
          className={`flex items-center p-2 hover:bg-gray-100 ${isSelected ? 'bg-primary-light' : ''}`}
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
            className="mr-2 text-gray-500 hover:text-gray-700"
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
    
    if (type.includes('text')) return <span className="text-gray-700">T</span>;
    if (type.includes('container')) return <Square size={16} className="text-gray-700" />;
    if (type.includes('slider')) return <span className="text-gray-700">🖼️</span>;
    if (type.includes('accordion')) return <span className="text-gray-700">▼</span>;
    if (type.includes('tabs')) return <span className="text-gray-700">⎍</span>;
    if (type.includes('animate')) return <span className="text-gray-700">✨</span>;
    
    return <Square size={16} className="text-gray-700" />;
  };

  // Get the root node ID
  const rootNodeId = Object.keys(query.getNodes()).find(id => !query.node(id).get().data.parent) || '';

  // Create a function to render the Properties panel
  const renderProperties = () => {
    if (!selected || !nodes) {
      return <div className="text-gray-400">Select a block to edit settings</div>;
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
          <span className="inline-block px-2 py-1 bg-primary-light text-primary rounded text-sm font-medium">
            {nodeData.displayName}
          </span>
        </div>
        
        {/* Text Content with Rich Text Editor */}
        {mounted && "text" in props && (
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Text Content</label>
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
            <label className="text-sm font-medium">Font Size (px)</label>
            <input
              type="number"
              className="border p-2 rounded"
              value={props.fontSize}
              onChange={(e) => handlePropChange('fontSize', Number(e.target.value))}
            />
          </div>
        )}

        {/* Text Color */}
        {"color" in props && (
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Text Color</label>
            <input
              type="color"
              className="border p-2 rounded"
              value={props.color}
              onChange={(e) => handlePropChange('color', e.target.value)}
            />
          </div>
        )}

        {/* Background Color */}
        {"backgroundColor" in props && (
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Background Color</label>
            <input
              type="color"
              className="border p-2 rounded"
              value={props.backgroundColor}
              onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
            />
          </div>
        )}

        {/* Padding */}
        {"padding" in props && (
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Padding (px)</label>
            <input
              type="number"
              className="border p-2 rounded"
              value={props.padding}
              onChange={(e) => handlePropChange('padding', Number(e.target.value))}
            />
          </div>
        )}

        {/* Slides for SliderBlock */}
        {"slides" in props && Array.isArray(props.slides) && (
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Slides (URLs)</label>
            {props.slides.map((slide: string, index: number) => (
              <div key={index} className="flex items-center mb-1">
                <input
                  type="text"
                  className="border p-2 rounded flex-1 mr-1"
                  value={slide}
                  onChange={(e) => {
                    const newSlides = [...props.slides];
                    newSlides[index] = e.target.value;
                    handlePropChange('slides', newSlides);
                  }}
                />
                <button
                  className="p-1 text-red-500 hover:bg-red-100 rounded"
                  onClick={() => {
                    const newSlides = [...props.slides];
                    newSlides.splice(index, 1);
                    handlePropChange('slides', newSlides);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              className="px-2 py-1 bg-primary-light text-primary rounded text-sm"
              onClick={() => {
                handlePropChange('slides', [...props.slides, 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1000&auto=format&fit=crop']);
              }}
            >
              + Add Slide
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2 settings-panel">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'properties' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('properties')}
        >
          Properties
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'layers' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('layers')}
        >
          Layers
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'properties' && renderProperties()}
      
      {activeTab === 'layers' && (
        <div className="border rounded bg-white max-h-[500px] overflow-y-auto">
          {renderLayers(rootNodeId)}
        </div>
      )}
    </div>
  );
};
