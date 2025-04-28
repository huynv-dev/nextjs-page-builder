"use client";

import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { AdvancedTextBlock } from "../blocks/AdvancedTextBlock";
import { ContainerBlock } from "../blocks/ContainerBlock";
import { SliderBlock } from "../blocks/SliderBlock";
import { AccordionBlock } from "../blocks/AccordionBlock";
import { TabsBlock } from "../blocks/TabsBlock";
import { AnimateBlock } from "../blocks/AnimateBlock";
import { useState, useEffect, useRef } from "react";
import { SettingsPanel } from "../common/SettingsPanel";
import { FloatingToolbar } from "../common/FloatingToolbar";
import { 
  Smartphone, 
  Tablet, 
  Laptop, 
  Undo2, 
  Redo2, 
  Save, 
  FolderOpen,
  Download,
  Upload,
  Settings as SettingsIcon,
  Layers,
  Paintbrush 
} from "lucide-react";
import { AutoLoadLayout } from "./AutoLoadLayout";
import { useStore } from "../store/useStore";
import { devicePresets } from "@/constants/devices";
import { useDevice } from "@/hooks/useDevice";
import { showPageChangeNotification } from "@/utils/notifications";
import { DeviceType } from "@/types/editor.types";
import { TextBlock } from "..";
import { SafeToolbox } from "./tools/SafeToolbox";
import { HeadingBlock } from "../blocks/HeadingBlock";
import { useLayouts } from "@/hooks/useLayouts";

export const EditorCanvas = () => {
  const [mounted, setMounted] = useState(false);
  const [showScrollbars, setShowScrollbars] = useState(false);
  const [toolboxCollapsed, setToolboxCollapsed] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"style" | "layers">("style");
  const canvasRef = useRef<HTMLDivElement>(null);
  const frameContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);

  // Get state from Zustand store
  const currentPage = useStore((state) => state.currentPage);
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  // Use the device hook
  const { currentDevice, setCurrentDevice, isDeviceFrame } = useDevice();
  
  // Get layout functions
  const { handleSaveLayout, handleLoadLayout, handleExportLayout, handleImportLayout } = useLayouts();

  // Editor state for undo/redo
  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  // Set up local device icons for the UI
  const deviceIcon = {
    desktop: <Laptop size={16} />,
    tablet: <Tablet size={16} />,
    mobile: <Smartphone size={16} />,
  };

  // Handle toolbox collapse state
  const handleToolboxCollapse = (collapsed: boolean) => {
    setToolboxCollapsed(collapsed);
    
    // Force resize event to update responsive components
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  };
  
  // Handle undo/redo
  const handleUndo = () => {
    if (query.history.canUndo()) {
      actions.history.undo();
    }
  };

  const handleRedo = () => {
    if (query.history.canRedo()) {
      actions.history.redo();
    }
  };

  useEffect(() => {
    setMounted(true);

    // Listen for device change events
    const handleDeviceChange = (e: CustomEvent) => {
      const deviceDetails = e.detail;
      const deviceType = Object.keys(devicePresets).find(
        device => devicePresets[device as keyof typeof devicePresets].width === deviceDetails.width
      ) as DeviceType | undefined;

      if (deviceType) {
        setCurrentDevice(deviceType);
      }

      setShowScrollbars(false);

      // When device changes, ensure the frame is properly updated for sliders
      setTimeout(() => {
        // Force a resize event to update sliders
        window.dispatchEvent(new Event('resize'));

        // Ensure the frame is visible with proper overflow
        if (frameContainerRef.current) {
          frameContainerRef.current.style.overflow = 'visible';
        }
      }, 300);
    };

    // Listen for page change events
    const handlePageSelected = (e: CustomEvent) => {
      const { slug } = e.detail;
      console.log(`Page selected event received for: ${slug}`);
      setCurrentPage(slug);

      // Show page change notification
      showPageChangeNotification(slug);
    };

    document.addEventListener('device-change', handleDeviceChange as EventListener);
    document.addEventListener('page-selected', handlePageSelected as EventListener);

    return () => {
      document.removeEventListener('device-change', handleDeviceChange as EventListener);
      document.removeEventListener('page-selected', handlePageSelected as EventListener);
    };
  }, [setCurrentDevice, setCurrentPage]);

  if (!mounted) {
    return <div className="flex h-screen bg-gray-100">Loading editor...</div>;
  }

  const deviceFrame = currentDevice !== 'desktop';

  return (
    <Editor
      resolver={{
        TextBlock,
        AdvancedTextBlock,
        ContainerBlock,
        SliderBlock,
        AccordionBlock,
        TabsBlock,
        AnimateBlock,
        HeadingBlock
      }}
      onRender={({ render }) => {
        // If node is hidden and not in edit mode, don't render
        if (!render) {
          return null;
        }
        return render;
      }}
      onNodesChange={(query) => {
        // Cập nhật reference tới editor instance
        if (!editorInstanceRef.current) {
          editorInstanceRef.current = query;
        }
      }}
    >
      {/* Load Layout automatically */}
      <AutoLoadLayout />

      <div className="flex h-screen">
        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar with Toolbox */}
          <div className={`transition-all duration-300 ease-in-out ${toolboxCollapsed ? 'w-14' : 'w-80'} h-full bg-gray-100 overflow-hidden border-r`}>
            <SafeToolbox onCollapseChange={handleToolboxCollapse} />

            {deviceFrame && !toolboxCollapsed && (
              <div className="mt-6 mx-4 p-3 bg-primary-light rounded border border-primary-medium">
                <h3 className="text-sm font-medium text-primary flex items-center">
                  {deviceIcon[currentDevice]}
                  <span className="ml-1.5">Responsive Preview</span>
                </h3>
                <p className="text-xs text-primary mt-1">
                  Currently viewing in {devicePresets[currentDevice].name} mode
                  ({devicePresets[currentDevice].width}x{devicePresets[currentDevice].height})
                </p>
              </div>
            )}
          </div>

          {/* Canvas - grows to fill space when toolbox collapses */}
          <div
            ref={canvasRef}
            className="flex-1 bg-gray-50 overflow-auto relative flex flex-col items-center transition-all duration-300"
          >
            {deviceFrame && (
              <div className="device-indicator w-full">
                <span>
                  {deviceIcon[currentDevice]}
                  {devicePresets[currentDevice].name} • {devicePresets[currentDevice].width}px
                </span>
              </div>
            )}

            <div className={`relative w-full ${deviceFrame ? 'py-8' : ''}`}>
              <div
                ref={frameContainerRef}
                className={`device-frame ${currentDevice} transition-all mx-auto p-4`}
                style={{
                  width: deviceFrame ? `${devicePresets[currentDevice].width}px` : '100%',
                  height: deviceFrame ? `${devicePresets[currentDevice].height}px` : 'auto',
                  maxWidth: '100%',
                  overflow: 'visible'
                }}
              >
                <Frame>
                  <Element is={ContainerBlock} canvas>
                    <TextBlock text="Welcome to the builder!" />
                  </Element>
                </Frame>
              </div>

              {deviceFrame && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mt-3 bg-gray-200 w-32 h-1.5 rounded-full"></div>
              )}
            </div>

            <FloatingToolbar />
          </div>

          {/* Settings Panel - Redesigned */}
          <div className="w-80 h-full flex flex-col bg-gray-50 border-l">
            {/* Settings Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-3 px-4 flex justify-between items-center flex-shrink-0">
              <div className="font-medium text-lg flex items-center">
                <SettingsIcon size={20} />
                <span className="ml-2">Settings</span>
              </div>
              
              <div className="flex space-x-1">
                <button 
                  onClick={handleExportLayout}
                  className="p-1 text-white hover:bg-primary/40 rounded-sm"
                  title="Export Layout"
                >
                  <Download size={16} />
                </button>
                <button 
                  onClick={handleImportLayout}
                  className="p-1 text-white hover:bg-primary/40 rounded-sm"
                  title="Import Layout"
                >
                  <Upload size={16} />
                </button>
              </div>
            </div>
            
            {/* Settings Tabs */}
            <div className="bg-white border-b border-gray-200 flex flex-shrink-0">
              <button 
                onClick={() => setSettingsTab("style")} 
                className={`flex items-center justify-center py-3 px-4 flex-1
                         transition-colors duration-200 ${
                           settingsTab === "style" 
                           ? "border-b-2 border-primary text-primary font-medium" 
                           : "text-gray-600 hover:bg-gray-50"
                         }`}
              >
                <Paintbrush size={16} />
                <span className="ml-2 text-sm">Style</span>
              </button>
              
              <button 
                onClick={() => setSettingsTab("layers")} 
                className={`flex items-center justify-center py-3 px-4 flex-1
                         transition-colors duration-200 ${
                           settingsTab === "layers" 
                           ? "border-b-2 border-primary text-primary font-medium" 
                           : "text-gray-600 hover:bg-gray-50"
                         }`}
              >
                <Layers size={16} />
                <span className="ml-2 text-sm">Layers</span>
              </button>
            </div>
            
            {/* Settings Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              <SettingsPanel activeTab={settingsTab} />
            </div>
            
            {/* Settings Footer Controls */}
            <div className="bg-white border-t border-gray-200 flex flex-shrink-0 p-1 justify-between">
              <div className="flex">
                <button 
                  onClick={handleUndo} 
                  className="p-2 rounded-md hover:bg-gray-100" 
                  title="Undo"
                  disabled={!query.history.canUndo()}
                >
                  <Undo2 size={18} className={query.history.canUndo() ? "text-gray-700" : "text-gray-400"} />
                </button>
                <button 
                  onClick={handleRedo} 
                  className="p-2 rounded-md hover:bg-gray-100"
                  title="Redo"
                  disabled={!query.history.canRedo()}
                >
                  <Redo2 size={18} className={query.history.canRedo() ? "text-gray-700" : "text-gray-400"} />
                </button>
              </div>
              
              <div className="flex">
                <button 
                  onClick={handleSaveLayout} 
                  className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
                  title="Save Layout"
                >
                  <Save size={18} />
                </button>
                <button 
                  onClick={() => handleLoadLayout(currentPage)} 
                  className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
                  title="Load Layout"
                >
                  <FolderOpen size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Editor>
  );
};
