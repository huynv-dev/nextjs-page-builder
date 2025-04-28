"use client";

import React from 'react';
import { useEditor } from "@craftjs/core";
import { useState, useRef, useEffect } from "react";
import { Undo2, Redo2, Save, FolderOpen, Download, Upload, Settings, Monitor, Home, Smartphone, Tablet, Laptop } from "lucide-react";
import { useStore } from '@/components/store/useStore';
import { useDevice } from '@/hooks/useDevice';
import { useLayouts } from '@/hooks/useLayouts';
import { devicePresets } from '@/constants/devices';

export const AdminHeader = () => {
  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);
  const [showPageDropdown, setShowPageDropdown] = useState(false);
  
  // Get state from hooks
  const currentPage = useStore((state) => state.currentPage);
  const { currentDevice, handleDeviceChange } = useDevice();
  const { handleSaveLayout, handleLoadLayout, handleExportLayout, handleImportLayout } = useLayouts();
  
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const deviceButtonRef = useRef<HTMLButtonElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);
  const deviceDropdownRef = useRef<HTMLDivElement>(null);
  const pageButtonRef = useRef<HTMLButtonElement>(null);
  const pageDropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close settings dropdown if clicked outside
      if (
        showDropdown && 
        settingsButtonRef.current && 
        settingsDropdownRef.current && 
        !settingsButtonRef.current.contains(event.target as Node) &&
        !settingsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      
      // Close device dropdown if clicked outside
      if (
        showDeviceDropdown && 
        deviceButtonRef.current && 
        deviceDropdownRef.current && 
        !deviceButtonRef.current.contains(event.target as Node) &&
        !deviceDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDeviceDropdown(false);
      }
      
      // Close page dropdown if clicked outside
      if (
        showPageDropdown && 
        pageButtonRef.current && 
        pageDropdownRef.current && 
        !pageButtonRef.current.contains(event.target as Node) &&
        !pageDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showDeviceDropdown, showPageDropdown]);

  // Close dropdowns when escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showDropdown) setShowDropdown(false);
        if (showDeviceDropdown) setShowDeviceDropdown(false);
        if (showPageDropdown) setShowPageDropdown(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showDropdown, showDeviceDropdown, showPageDropdown]);

  // Editor actions
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

  // Toggle editor mode (edit/preview)
  const handleTogglePreview = () => {
    actions.setOptions(options => {
      options.enabled = !enabled;
    });
  };

  // Handle device switcher
  const onDeviceChange = (deviceType: string) => {
    handleDeviceChange(deviceType as any);
    setShowDeviceDropdown(false);
  };

  // Handle dropdown closing
  const handleExportAndClose = () => {
    handleExportLayout();
    setShowDropdown(false);
  };

  const handleImportAndClose = () => {
    handleImportLayout();
    setShowDropdown(false);
  };

  // Handle load layout button
  const onLoadLayout = () => {
    handleLoadLayout(currentPage);
  };

  return (
    <header className="admin-header sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and site title */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Page Builder</span>
            </a>           
          </div>

          {/* Center controls */}
          <div className="flex items-center space-x-1">
            <button 
              onClick={handleUndo} 
              className="p-2 rounded-md hover:bg-gray-100" 
              title="Undo"
              disabled={!query.history.canUndo()}
            >
              <Undo2 size={20} className={query.history.canUndo() ? "text-gray-700" : "text-gray-400"} />
            </button>
            <button 
              onClick={handleRedo} 
              className="p-2 rounded-md hover:bg-gray-100"
              title="Redo"
              disabled={!query.history.canRedo()}
            >
              <Redo2 size={20} className={query.history.canRedo() ? "text-gray-700" : "text-gray-400"} />
            </button>
            <div className="h-6 border-r border-gray-300 mx-2"></div>
            <button 
              onClick={handleSaveLayout} 
              className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
              title="Save Layout"
            >
              <Save size={20} />
            </button>
            <button 
              onClick={onLoadLayout} 
              className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
              title="Load Layout"
            >
              <FolderOpen size={20} />
            </button>
            <div className="h-6 border-r border-gray-300 mx-2"></div>
            <button 
              onClick={handleTogglePreview} 
              className={`p-2 rounded-md hover:bg-gray-100 ${enabled ? 'text-blue-600' : 'text-gray-700'}`}
              title={enabled ? "Switch to Preview Mode" : "Switch to Edit Mode"}
            >
              <Monitor size={20} />
            </button>
            
            {/* Device switcher */}
            <div className="relative">
              <button 
                ref={deviceButtonRef}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-700 flex items-center ml-2"
                onClick={() => {
                  setShowDeviceDropdown(!showDeviceDropdown);
                  setShowDropdown(false); // Close other dropdown
                }}
                title="Change Device View"
              >
                {devicePresets[currentDevice].icon}
              </button>
              
              {showDeviceDropdown && (
                <div 
                  ref={deviceDropdownRef}
                  className="absolute mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div className="py-1" role="menu">
                    <button
                      onClick={() => onDeviceChange('desktop')}
                      className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                        currentDevice === 'desktop' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                      role="menuitem"
                    >
                      <span className="mr-2">{React.createElement(Laptop, { size: 16 })}</span>
                      Desktop
                      <span className="ml-auto text-xs text-gray-400">
                        1920px
                      </span>
                    </button>
                    <button
                      onClick={() => onDeviceChange('tablet')}
                      className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                        currentDevice === 'tablet' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                      role="menuitem"
                    >
                      <span className="mr-2">{React.createElement(Tablet, { size: 16 })}</span>
                      Tablet
                      <span className="ml-auto text-xs text-gray-400">
                        768px
                      </span>
                    </button>
                    <button
                      onClick={() => onDeviceChange('mobile')}
                      className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                        currentDevice === 'mobile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                      role="menuitem"
                    >
                      <span className="mr-2">{React.createElement(Smartphone, { size: 16 })}</span>
                      Mobile
                      <span className="ml-auto text-xs text-gray-400">
                        375px
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center">
            <div className="relative">
              <button 
                ref={settingsButtonRef}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  setShowDeviceDropdown(false); // Close other dropdown
                }}
              >
                <Settings size={20} />
              </button>

              {showDropdown && (
                <div 
                  ref={settingsDropdownRef}
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={handleExportAndClose}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <Download size={16} className="inline mr-2" />
                      Export Layout
                    </button>
                    <button
                      onClick={handleImportAndClose}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <Upload size={16} className="inline mr-2" />
                      Import Layout
                    </button>
                    <a
                      href="/"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <Home size={16} className="inline mr-2" />
                      Go to Home
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 