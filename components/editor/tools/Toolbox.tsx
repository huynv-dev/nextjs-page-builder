'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Layers, 
  ArrowLeft, 
  Settings, 
  Search, 
  Code,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Download,
  Upload,
  Monitor,
  Smartphone,
  Tablet,
  Laptop
} from 'lucide-react';
import { BlocksTab } from './BlocksTab';
import { PagesTab } from './PagesTab';
import { SafeDeviceTab } from './SafeDeviceTab';
import { useEditor } from "@craftjs/core";
import { useDevice } from '@/hooks/useDevice';
import { useLayouts } from '@/hooks/useLayouts';
import { useEditorCapabilities } from '@/hooks/useEditorCapabilities';
import { devicePresets } from '@/constants/devices';
import { useStore } from '@/components/store/useStore';

interface ToolboxProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export const Toolbox = ({ onCollapseChange }: ToolboxProps) => {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"blocks" | "pages" | "devices" | "settings">("blocks");
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);
  
  // Get editor capabilities - safely handles case when outside Editor context
  const { 
    canUndo, 
    canRedo, 
    isEditMode, 
    undo, 
    redo, 
    toggleEditMode,
    isInEditorContext
  } = useEditorCapabilities();
  
  // Get state from hooks
  const currentPage = useStore((state) => state.currentPage);
  const { currentDevice, handleDeviceChange } = useDevice();
  
  // useLayouts hook already has built-in error handling for outside Editor context
  const { handleSaveLayout, handleLoadLayout } = useLayouts();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset search when changing tabs
  useEffect(() => {
    setSearchQuery("");
  }, [tab]);

  // Notify parent component when collapsed state changes
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(collapsed);
    }
  }, [collapsed, onCollapseChange]);

  // Close device dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDeviceDropdown) {
        setShowDeviceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDeviceDropdown]);

  const getPlaceholderText = () => {
    switch(tab) {
      case 'blocks': return 'Search widgets...';
      case 'pages': return 'Search pages...';
      case 'devices': return 'Search devices...';
      case 'settings': return 'Search settings...';
      default: return 'Search...';
    }
  };
  
  // Handle device switcher
  const onDeviceChange = (deviceType: string) => {
    handleDeviceChange(deviceType as any);
    setShowDeviceDropdown(false);
  };

  return (
    <div 
      className={`transition-all duration-300 ease-in-out h-full ${collapsed ? 'w-14' : 'w-80'} 
                  flex flex-col bg-gray-50 border-r border-gray-200 overflow-hidden`}
    >
      {/* Header Area - Fixed */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-3 px-4 flex justify-between items-center flex-shrink-0">
        <div className={`font-medium text-lg ${collapsed ? 'hidden' : 'block'} flex items-center`}>
          <Code size={20} />
          <span className="ml-2">Page Builder</span>
        </div>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-white hover:bg-primary/40 rounded-sm"
          title={collapsed ? "Expand toolbox" : "Collapse toolbox"}
        >
          <ArrowLeft size={18} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Search Bar - Fixed */}
      {!collapsed && (
        <div className="px-4 py-2 bg-white border-b border-gray-200 flex-shrink-0 sticky top-0 z-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getPlaceholderText()}
              className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {/* Main layout with fixed header/footer and scrollable content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Content Area - Scrollable */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden bg-white ${collapsed ? 'hidden' : 'block'}`}>
          {!collapsed && (
            <>
              {tab === "blocks" && <BlocksTab mounted={mounted} searchQuery={searchQuery} />}
              {tab === "pages" && <PagesTab searchQuery={searchQuery} />}
              {tab === "devices" && <SafeDeviceTab searchQuery={searchQuery} />}
              {tab === "settings" && (
                <div className="p-6 text-center">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                    <Settings size={24} className="mx-auto text-primary mb-2" />
                    <p className="text-sm text-gray-600">Settings panel coming soon</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Bottom Navigation - Fixed */}
      <div className="bg-primary/90 border-t border-primary flex flex-shrink-0 sticky bottom-0 z-10">
        <button 
          onClick={() => setTab("blocks")} 
          className={`flex items-center justify-center p-3 flex-1
                     transition-colors duration-200 ${
                       tab === "blocks" 
                       ? "bg-primary text-white" 
                       : "text-white/80 hover:bg-primary"
                     }`}
          title="Widgets"
        >
          <LayoutGrid size={collapsed ? 20 : 18} />
          {!collapsed && <span className="ml-2 text-sm font-medium">Widgets</span>}
        </button>
        
        <button 
          onClick={() => setTab("pages")} 
          className={`flex items-center justify-center p-3 flex-1
                     transition-colors duration-200 ${
                       tab === "pages" 
                       ? "bg-primary text-white" 
                       : "text-white/80 hover:bg-primary"
                     }`}
          title="Pages"
        >
          <Layers size={collapsed ? 20 : 18} />
          {!collapsed && <span className="ml-2 text-sm font-medium">Pages</span>}
        </button>
        
        <button 
          onClick={() => setTab("devices")} 
          className={`flex items-center justify-center p-3 flex-1
                     transition-colors duration-200 ${
                       tab === "devices" 
                       ? "bg-primary text-white" 
                       : "text-white/80 hover:bg-primary"
                     }`}
          title="Devices"
        >
          <Monitor size={collapsed ? 20 : 18} />
          {!collapsed && <span className="ml-2 text-sm font-medium">Devices</span>}
        </button>
        
        <button 
          onClick={() => setTab("settings")}
          className={`flex items-center justify-center p-3 flex-1
                     transition-colors duration-200 ${
                       tab === "settings" 
                       ? "bg-primary text-white" 
                       : "text-white/80 hover:bg-primary"
                     }`}
          title="Settings"
        >
          <Settings size={collapsed ? 20 : 18} />
          {!collapsed && <span className="ml-2 text-sm font-medium">Settings</span>}
        </button>
      </div>
      
      {/* Editor Controls Footer - Fixed */}
      <div className="bg-white border-t border-gray-200 flex flex-shrink-0 p-1 justify-between">
        {/* Left Group - History Controls */}
        <div className="flex">
          <button 
            onClick={undo} 
            className="p-2 rounded-md hover:bg-gray-100" 
            title="Undo"
            disabled={!canUndo}
          >
            <Undo2 size={18} className={canUndo ? "text-gray-700" : "text-gray-400"} />
          </button>
          <button 
            onClick={redo} 
            className="p-2 rounded-md hover:bg-gray-100"
            title="Redo"
            disabled={!canRedo}
          >
            <Redo2 size={18} className={canRedo ? "text-gray-700" : "text-gray-400"} />
          </button>
        </div>
        
        {/* Center Group - File Operations */}
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
        
        {/* Right Group - Preview & Responsive */}
        <div className="flex relative">
          <button 
            onClick={toggleEditMode} 
            className={`p-2 rounded-md hover:bg-gray-100 ${isEditMode ? 'text-primary' : 'text-gray-700'}`}
            title={isEditMode ? "Switch to Preview Mode" : "Switch to Edit Mode"}
          >
            <Monitor size={18} />
          </button>
          
          <div className="relative">
            <button 
              className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
              onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
              title="Change Device View"
            >
              {currentDevice === 'desktop' && <Laptop size={18} />}
              {currentDevice === 'tablet' && <Tablet size={18} />}
              {currentDevice === 'mobile' && <Smartphone size={18} />}
            </button>
            
            {showDeviceDropdown && (
              <div 
                className="absolute bottom-full right-0 mb-1 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
              >
                <div className="py-1" role="menu">
                  <button
                    onClick={() => onDeviceChange('desktop')}
                    className={`flex items-center w-full px-3 py-2 text-xs hover:bg-gray-100 ${
                      currentDevice === 'desktop' ? 'bg-primary/10 text-primary' : 'text-gray-700'
                    }`}
                  >
                    <Laptop size={14} className="mr-2" />
                    Desktop
                    <span className="ml-auto text-xs text-gray-400">
                      1920px
                    </span>
                  </button>
                  <button
                    onClick={() => onDeviceChange('tablet')}
                    className={`flex items-center w-full px-3 py-2 text-xs hover:bg-gray-100 ${
                      currentDevice === 'tablet' ? 'bg-primary/10 text-primary' : 'text-gray-700'
                    }`}
                  >
                    <Tablet size={14} className="mr-2" />
                    Tablet
                    <span className="ml-auto text-xs text-gray-400">
                      768px
                    </span>
                  </button>
                  <button
                    onClick={() => onDeviceChange('mobile')}
                    className={`flex items-center w-full px-3 py-2 text-xs hover:bg-gray-100 ${
                      currentDevice === 'mobile' ? 'bg-primary/10 text-primary' : 'text-gray-700'
                    }`}
                  >
                    <Smartphone size={14} className="mr-2" />
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
      </div>
    </div>
  );
}; 