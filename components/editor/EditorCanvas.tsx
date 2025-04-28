"use client";

import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { TextBlock } from "../blocks/TextBlock";
import { ContainerBlock } from "../blocks/ContainerBlock";
import { Toolbox } from "../common/Toolbox";
import { SliderBlock } from "../blocks/SliderBlock";
import { AccordionBlock } from "../blocks/AccordionBlock";
import { TabsBlock } from "../blocks/TabsBlock";
import { AnimateBlock } from "../blocks/AnimateBlock";
import { useState, useEffect, useRef } from "react";
import { SettingsPanel } from "../common/SettingsPanel";
import { FloatingToolbar } from "../common/FloatingToolbar";
import { AdminHeader, devicePresets, DeviceType } from "../common/AdminHeader";
import { Smartphone, Tablet, Laptop } from "lucide-react";
import { AutoLoadLayout } from "./AutoLoadLayout";

export const EditorCanvas = () => {
  const [mounted, setMounted] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<DeviceType>('desktop');
  const [showScrollbars, setShowScrollbars] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const canvasRef = useRef<HTMLDivElement>(null);
  const frameContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);

    // Listen for device change events
    const handleDeviceChange = (e: CustomEvent) => {
      const deviceDetails = e.detail;
      const deviceType = Object.keys(devicePresets).find(
        device => devicePresets[device as DeviceType].width === deviceDetails.width
      ) as DeviceType;
      
      setCurrentDevice(deviceType);
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

    // Lắng nghe sự kiện chuyển trang
    const handlePageSelected = (e: CustomEvent) => {
      const { slug } = e.detail;
      console.log(`Page selected event received for: ${slug}`); // Log event reception
      setCurrentPage(slug);
      
      // Hiện nhãn thông báo trang hiện tại
      const pageNotification = document.createElement('div');
      pageNotification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg z-50 notification-enter';
      pageNotification.innerText = `Editing page: ${slug}`;
      document.body.appendChild(pageNotification);
      
      setTimeout(() => {
        pageNotification.classList.remove('notification-enter');
        pageNotification.classList.add('notification-exit');
        setTimeout(() => pageNotification.remove(), 300);
      }, 2000);
    };

    document.addEventListener('device-change', handleDeviceChange as EventListener);
    document.addEventListener('page-selected', handlePageSelected as EventListener);
    
    return () => {
      document.removeEventListener('device-change', handleDeviceChange as EventListener);
      document.removeEventListener('page-selected', handlePageSelected as EventListener);
    };
  }, []);

  if (!mounted) {
    return <div className="flex h-screen bg-gray-100">Loading editor...</div>;
  }

  const deviceFrame = currentDevice !== 'desktop';
  const deviceIcon = {
    desktop: <Laptop size={16} />,
    tablet: <Tablet size={16} />,
    mobile: <Smartphone size={16} />,
  };

  return (
    <Editor 
      resolver={{ TextBlock, ContainerBlock, SliderBlock, AccordionBlock, TabsBlock, AnimateBlock }}
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

      <div className="flex flex-col h-screen">
        {/* Admin Header */}
        <AdminHeader />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/5 bg-gray-100 p-3 overflow-y-auto border-r">
            <h2 className="text-lg font-bold mb-4">Blocks</h2>
            <div className="space-y-2">
              <Toolbox />
            </div>
            
            {deviceFrame && (
              <div className="mt-6 p-3 bg-primary-light rounded border border-primary-medium">
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
            
            {/* Hiển thị trang hiện tại */}
            <div className="mt-6 p-3 bg-blue-100 rounded border border-blue-300">
              <h3 className="text-sm font-medium text-blue-800 flex items-center">
                <span className="ml-1.5">Current Page</span>
              </h3>
              <p className="text-sm font-bold text-blue-700 mt-1">
                /{currentPage}
              </p>
            </div>
          </div>

          {/* Canvas */}
          <div 
            ref={canvasRef}
            className="flex-1 bg-gray-50 overflow-auto relative flex flex-col items-center"
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

          {/* Settings */}
          <div className="w-1/5 bg-gray-100 p-3 overflow-y-auto border-l">
            <h2 className="text-lg font-bold mb-4">Settings</h2>
            <SettingsPanel />
            
            {deviceFrame && (
              <div className="mt-6 bg-gray-200 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                  {deviceIcon[currentDevice]}
                  <span className="ml-1.5">Responsive Design Tips</span>
                </h3>
                <ul className="text-xs text-gray-700 space-y-1.5 list-disc pl-4">
                  <li>Design for mobile-first when possible</li>
                  <li>Use relative units (%, rem) instead of fixed pixels</li>
                  <li>Text should be at least 16px on mobile devices</li>
                  <li>Ensure touch targets are at least 44x44px</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Editor>
  );
};
