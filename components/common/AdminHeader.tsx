"use client";

import { useEditor } from "@craftjs/core";
import { useState, useRef, useEffect } from "react";
import { Undo2, Redo2, Save, FolderOpen, Download, Upload, Settings, Monitor, Home, Smartphone, Tablet, Laptop, FileText } from "lucide-react";
import { parseNodeTreeToHTML } from "@/utils/parseNodeTreeToHTML";

// Define device presets
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

export const devicePresets: Record<DeviceType, DevicePreset> = {
  desktop: {
    name: 'Desktop',
    width: 1920,
    height: 1080,
    icon: <Laptop size={20} />
  },
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
    icon: <Tablet size={20} />
  },
  mobile: {
    name: 'Mobile',
    width: 375,
    height: 667,
    icon: <Smartphone size={20} />
  }
};

export const AdminHeader = () => {
  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<DeviceType>('desktop');
  const [currentPage, setCurrentPage] = useState("home");
  const [showPageDropdown, setShowPageDropdown] = useState(false);
  
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

  // Layout management with page support
  const handleSaveLayout = async () => {
    const serialized = query.serialize();
    const nodeTree = JSON.parse(serialized);
    const html = parseNodeTreeToHTML(nodeTree);
  
    await fetch("/api/save-layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: currentPage,
        nodeTree,
        html,
      }),
    });
  
    showNotification(`Layout "${currentPage}" saved successfully!`);
  };

  const handleLoadLayout = async () => {
    try {
      const response = await fetch(`/api/layouts?slug=${currentPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch layout for "${currentPage}"`);
      }
      
      const layouts = await response.json();
      
      if (layouts && layouts.length > 0) {
        // Deserialize content vào editor
        actions.deserialize(layouts[0].content);
        showNotification(`Layout "${currentPage}" loaded successfully!`);
      } else {
        showNotification(`No saved layout found for "${currentPage}"!`, "error");
      }
    } catch (error) {
      console.error('Error loading layout:', error);
      showNotification("Error loading layout from server!", "error");
    }
  };

  // Export layout as JSON file
  const handleExportLayout = () => {
    const serializedState = query.serialize();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(serializedState));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "page-layout.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showNotification("Layout exported as JSON!");
    setShowDropdown(false); // Close dropdown after action
  };

  // Import layout from JSON file
  const handleImportLayout = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          actions.deserialize(jsonData);
          showNotification("Layout imported successfully!");
        } catch (error) {
          showNotification("Error importing layout: Invalid file format", "error");
        }
      };
      reader.readAsText(file);
    };
    input.click();
    setShowDropdown(false); // Close dropdown after action
  };

  // Change device size
  const handleDeviceChange = (deviceType: DeviceType) => {
    setCurrentDevice(deviceType);
    
    // Dispatch custom event to notify the canvas about device change
    const deviceChangeEvent = new CustomEvent('device-change', {
      detail: devicePresets[deviceType]
    });
    
    document.dispatchEvent(deviceChangeEvent);
    setShowDeviceDropdown(false);
    
    showNotification(`Switched to ${devicePresets[deviceType].name} view`);
  };

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

  // Display notification
  const showNotification = (message: string, type: "success" | "error" = "success") => {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 p-3 rounded-md shadow-lg z-50 notification-enter ${
      type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`;
    notification.innerText = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.remove('notification-enter');
      notification.classList.add('notification-exit');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
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
              onClick={handleLoadLayout} 
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
                    {(Object.keys(devicePresets) as DeviceType[]).map((deviceType) => (
                      <button
                        key={deviceType}
                        onClick={() => handleDeviceChange(deviceType)}
                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                          currentDevice === deviceType ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                        role="menuitem"
                      >
                        <span className="mr-2">{devicePresets[deviceType].icon}</span>
                        {devicePresets[deviceType].name}
                        <span className="ml-auto text-xs text-gray-400">
                          {devicePresets[deviceType].width}px
                        </span>
                      </button>
                    ))}
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
                      onClick={handleExportLayout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <Download size={16} className="inline mr-2" />
                      Export Layout
                    </button>
                    <button
                      onClick={handleImportLayout}
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