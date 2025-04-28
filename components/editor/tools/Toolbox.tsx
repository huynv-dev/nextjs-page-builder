'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, Layers, ArrowLeft, Settings, Search, Code } from 'lucide-react';
import { BlocksTab } from './BlocksTab';
import { PagesTab } from './PagesTab';

export const Toolbox = () => {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"blocks" | "pages">("blocks");
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      className={`transition-all duration-300 ease-in-out h-full ${collapsed ? 'w-14' : 'w-72'} 
                  flex flex-col`}
    >
      {/* Header Area */}
      <div className="bg-gradient-to-r from-[#6a0075] to-[#930061] text-white py-3 px-4 flex justify-between items-center">
        <div className={`font-medium text-lg ${collapsed ? 'hidden' : 'block'} flex items-center`}>
          <Code size={20} />
          <span className="ml-2">Page Builder</span>
        </div>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-white hover:bg-[#800070]/40 rounded-sm"
          title={collapsed ? "Expand toolbox" : "Collapse toolbox"}
        >
          <ArrowLeft size={18} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Search Bar */}
      {!collapsed && (
        <div className="px-4 py-2 bg-white border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Widget..."
              className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#6a0075]"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 overflow-y-auto bg-white ${collapsed ? 'hidden' : 'block'}`}>
        {!collapsed && (
          <div className="py-0">
            {tab === "blocks" && <BlocksTab mounted={mounted} searchQuery={searchQuery} />}
            {tab === "pages" && <PagesTab />}
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <div className="bg-[#333] border-t border-[#444] flex">
        <button 
          onClick={() => setTab("blocks")} 
          className={`flex items-center justify-center p-3 flex-1
                     transition-colors duration-200 ${
                       tab === "blocks" 
                       ? "bg-[#6a0075] text-white" 
                       : "text-gray-300 hover:bg-[#444]"
                     }`}
          title="Elements"
        >
          <LayoutGrid size={collapsed ? 20 : 18} />
          {!collapsed && <span className="ml-2 text-sm font-medium">Widgets</span>}
        </button>
        
        <button 
          onClick={() => setTab("pages")} 
          className={`flex items-center justify-center p-3 flex-1
                     transition-colors duration-200 ${
                       tab === "pages" 
                       ? "bg-[#6a0075] text-white" 
                       : "text-gray-300 hover:bg-[#444]"
                     }`}
          title="Pages"
        >
          <Layers size={collapsed ? 20 : 18} />
          {!collapsed && <span className="ml-2 text-sm font-medium">Pages</span>}
        </button>
        
        <button 
          className="flex items-center justify-center p-3 flex-1 text-gray-300 hover:bg-[#444]"
          title="Settings"
        >
          <Settings size={collapsed ? 20 : 18} />
          {!collapsed && <span className="ml-2 text-sm font-medium">Settings</span>}
        </button>
      </div>
    </div>
  );
}; 