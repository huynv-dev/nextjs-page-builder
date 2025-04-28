'use client';

import { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Laptop, 
  Monitor, 
  ChevronDown,
  Sliders,
  ArrowRight
} from 'lucide-react';
import { useDevice } from '@/hooks/useDevice';
import { DeviceType } from '@/types/editor.types';
import { devicePresets } from '@/constants/devices';

interface DeviceTabProps {
  searchQuery?: string;
}

interface DeviceOption {
  type: DeviceType;
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
  description?: string;
}

export const DeviceTab = ({ searchQuery = "" }: DeviceTabProps) => {
  // Add error handling for useDevice hook
  let deviceContext;
  try {
    deviceContext = useDevice();
  } catch (error) {
    console.warn('DeviceTab: useDevice hook failed, using fallback values');
    // Provide fallback values if the hook fails
    deviceContext = {
      currentDevice: 'desktop' as DeviceType,
      handleDeviceChange: () => {},
      devicePresets: {
        desktop: { name: 'Desktop', width: 1920, height: 1080, icon: <Laptop size={20} /> },
        tablet: { name: 'Tablet', width: 768, height: 1024, icon: <Tablet size={20} /> },
        mobile: { name: 'Mobile', width: 375, height: 667, icon: <Smartphone size={20} /> }
      }
    };
  }
  
  const { currentDevice, handleDeviceChange, devicePresets } = deviceContext;
  
  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'devices': true,
    'customSizes': false,
    'settings': false
  });
  
  // Filtered devices
  const [filteredDevices, setFilteredDevices] = useState<DeviceOption[]>([]);
  
  // Define device options with descriptions
  const deviceOptions: DeviceOption[] = [
    {
      type: 'desktop',
      name: 'Desktop',
      width: devicePresets.desktop.width,
      height: devicePresets.desktop.height,
      icon: <Laptop size={18} />,
      description: 'Standard desktop view (1920 × 1080)'
    },
    {
      type: 'tablet',
      name: 'Tablet',
      width: devicePresets.tablet.width,
      height: devicePresets.tablet.height,
      icon: <Tablet size={18} />,
      description: 'Tablet view (768 × 1024)'
    },
    {
      type: 'mobile',
      name: 'Mobile',
      width: devicePresets.mobile.width,
      height: devicePresets.mobile.height,
      icon: <Smartphone size={18} />,
      description: 'Mobile view (375 × 667)'
    }
  ];
  
  // Custom preset sizes
  const customSizes: { name: string; width: number; height: number; icon: React.ReactNode }[] = [
    { name: 'HD Display', width: 1366, height: 768, icon: <Monitor size={18} /> },
    { name: 'Full HD', width: 1920, height: 1080, icon: <Monitor size={18} /> },
    { name: 'iPad Pro', width: 1024, height: 1366, icon: <Tablet size={18} /> },
    { name: 'iPhone X', width: 375, height: 812, icon: <Smartphone size={18} /> }
  ];
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Filter devices based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredDevices([]);
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = [
      ...deviceOptions,
      ...customSizes.map(size => ({
        type: getDeviceTypeFromWidth(size.width) as DeviceType,
        ...size
      }))
    ].filter(device => 
      device.name.toLowerCase().includes(lowerCaseQuery) ||
      device.width.toString().includes(lowerCaseQuery) ||
      device.height.toString().includes(lowerCaseQuery)
    );
    
    setFilteredDevices(filtered);
  }, [searchQuery]);
  
  // Helper function to determine device type from width
  function getDeviceTypeFromWidth(width: number): string {
    if (width >= 992) return 'desktop';
    if (width >= 768) return 'tablet';
    return 'mobile';
  }
  
  // Apply custom device size
  const applyCustomSize = (width: number, height: number) => {
    const deviceType = getDeviceTypeFromWidth(width) as DeviceType;
    handleDeviceChange(deviceType, width, height);
  };
  
  // Handle device selection
  const onSelectDevice = (deviceType: DeviceType) => {
    handleDeviceChange(deviceType);
  };
  
  // Show search results if there's a query
  if (searchQuery) {
    return (
      <div className="text-gray-800 p-4">
        <h3 className="text-xs uppercase font-medium text-gray-500 mb-3">
          Search Results
        </h3>
        
        {filteredDevices.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded p-4 text-gray-500 text-center">
            <Sliders size={20} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No devices found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filteredDevices.map((device, index) => (
              <div 
                key={`${device.name}-${index}`}
                onClick={() => onSelectDevice(device.type)}
                className={`bg-white border border-gray-200 rounded flex flex-col items-center py-4 px-2 cursor-pointer hover:border-[#6a0075] transition-colors ${
                  currentDevice === device.type ? 'border-[#6a0075] border-2' : ''
                }`}
              >
                <div className={`mb-2 ${currentDevice === device.type ? 'text-[#6a0075]' : 'text-gray-500'}`}>
                  {device.icon}
                </div>
                <div className="text-xs text-center font-medium">{device.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {device.width} × {device.height}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="text-gray-800">
      {/* Devices Section */}
      <div className="border-b border-gray-100">
        <button 
          onClick={() => toggleSection('devices')}
          className="w-full flex items-center justify-between py-3 px-4 text-sm transition-colors hover:bg-gray-50"
        >
          <div className="uppercase text-xs font-medium tracking-wide text-gray-600">
            Devices
          </div>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${expandedSections['devices'] ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {expandedSections['devices'] && (
          <div className="p-3 grid grid-cols-1 gap-2">
            {deviceOptions.map((device) => (
              <div
                key={device.type}
                onClick={() => onSelectDevice(device.type)}
                className={`bg-white border ${
                  currentDevice === device.type 
                    ? 'border-[#6a0075] border-2' 
                    : 'border-gray-200'
                } rounded-md overflow-hidden transition-all hover:border-[#6a0075] cursor-pointer`}
              >
                <div className="flex items-center p-3">
                  <div className={`${currentDevice === device.type ? 'text-[#6a0075]' : 'text-gray-500'} mr-3`}>
                    {device.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {device.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {device.width} × {device.height}
                    </div>
                  </div>
                  {currentDevice === device.type ? (
                    <div className="text-xs bg-[#6a0075] text-white px-2 py-0.5 rounded">
                      Active
                    </div>
                  ) : (
                    <ArrowRight size={16} className="text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Custom Sizes Section */}
      <div className="border-b border-gray-100">
        <button 
          onClick={() => toggleSection('customSizes')}
          className="w-full flex items-center justify-between py-3 px-4 text-sm transition-colors hover:bg-gray-50"
        >
          <div className="uppercase text-xs font-medium tracking-wide text-gray-600">
            Custom Sizes
          </div>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${expandedSections['customSizes'] ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {expandedSections['customSizes'] && (
          <div className="p-3">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {customSizes.map((size, index) => (
                <div 
                  key={`${size.name}-${index}`}
                  onClick={() => applyCustomSize(size.width, size.height)}
                  className="bg-white border border-gray-200 rounded flex flex-col items-center py-3 px-2 cursor-pointer hover:border-[#6a0075] transition-colors"
                >
                  <div className="text-gray-500 mb-1">{size.icon}</div>
                  <div className="text-xs text-center font-medium">{size.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {size.width} × {size.height}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <div className="text-xs font-medium mb-2">Custom size</div>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <input 
                    type="number" 
                    placeholder="Width"
                    className="w-full p-2 text-xs border border-gray-200 rounded"
                  />
                </div>
                <div className="text-gray-400">×</div>
                <div className="flex-1">
                  <input 
                    type="number" 
                    placeholder="Height"
                    className="w-full p-2 text-xs border border-gray-200 rounded"
                  />
                </div>
                <button className="bg-[#6a0075] text-white p-2 rounded text-xs">
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Settings Section */}
      <div className="border-b border-gray-100">
        <button 
          onClick={() => toggleSection('settings')}
          className="w-full flex items-center justify-between py-3 px-4 text-sm transition-colors hover:bg-gray-50"
        >
          <div className="uppercase text-xs font-medium tracking-wide text-gray-600">
            Responsive Settings
          </div>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${expandedSections['settings'] ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {expandedSections['settings'] && (
          <div className="p-3">
            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <div className="text-xs font-medium mb-2">Frame Options</div>
              <div className="flex items-center mb-2">
                <input 
                  type="checkbox" 
                  id="showDeviceFrame" 
                  className="mr-2"
                />
                <label htmlFor="showDeviceFrame" className="text-xs">
                  Show device frame
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="autoRotate" 
                  className="mr-2"
                />
                <label htmlFor="autoRotate" className="text-xs">
                  Auto-rotate to landscape
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="py-3 flex items-center justify-center">
        <div className="text-xs text-gray-500">
          Page Builder
        </div>
      </div>
    </div>
  );
}; 