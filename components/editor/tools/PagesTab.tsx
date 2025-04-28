'use client';

import { useEditor } from '@craftjs/core';
import { 
  Plus, 
  FileText, 
  ArrowRight, 
  Trash2,
  Copy,
  Eye,
  Save,
  ChevronDown,
  FilePlus,
  Folder,
  FolderOpen,
  Settings,
  ExternalLink,
  Library,
  Search,
  Layers,
  Layout,
  PanelLeft
} from 'lucide-react';
import { usePages } from '@/hooks/usePages';
import { useLayouts } from '@/hooks/useLayouts';
import { showNotification } from '@/utils/notifications';
import { useState, useEffect } from 'react';

interface PagesTabProps {
  searchQuery?: string;
}

export const PagesTab = ({ searchQuery = "" }: PagesTabProps) => {
  const { actions } = useEditor();
  const { 
    pages, 
    currentPage, 
    isCreating, 
    handleCreatePage, 
    handleSelectPage 
  } = usePages();
  
  const { handleSaveLayout } = useLayouts();
  
  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'sitePages': true,
    'templates': false,
    'settings': false
  });
  
  // Filtered pages
  const [filteredMainPages, setFilteredMainPages] = useState(pages.filter(page => !page.slug.includes('template')));
  const [filteredTemplatePages, setFilteredTemplatePages] = useState(pages.filter(page => page.slug.includes('template')));
  
  // Filter pages based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredMainPages(pages.filter(page => !page.slug.includes('template')));
      setFilteredTemplatePages(pages.filter(page => page.slug.includes('template')));
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    setFilteredMainPages(
      pages.filter(page => 
        !page.slug.includes('template') && 
        (page.title.toLowerCase().includes(lowerCaseQuery) || 
         page.slug.toLowerCase().includes(lowerCaseQuery))
      )
    );
    
    setFilteredTemplatePages(
      pages.filter(page => 
        page.slug.includes('template') && 
        (page.title.toLowerCase().includes(lowerCaseQuery) || 
         page.slug.toLowerCase().includes(lowerCaseQuery))
      )
    );
  }, [searchQuery, pages]);
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle page creation
  const onCreatePage = async () => {
    if (isCreating) return;
    
    const pageName = prompt("Enter page title:");
    if (!pageName) return;

    const slugSuggestion = pageName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const slug = prompt("Enter page slug:", slugSuggestion);
    if (!slug) return;
    
    const result = await handleCreatePage(pageName, slug);
    
    if (result.success) {
      showNotification(`Page "${pageName}" created successfully!`);
    } else {
      showNotification(`Error creating page: ${result.error}`, "error");
    }
  };
  
  // Handle page selection
  const onSelectPage = async (slug: string) => {
    const result = await handleSelectPage(slug);
    
    if (result.success && result.layout) {
      // Deserialize the layout content
      actions.deserialize(result.layout.content);
      showNotification(`Loaded page: ${slug}`);
    } else if (result.error) {
      showNotification(`Error loading page: ${result.error}`, "error");
    }
  };
  
  // Placeholder for future features
  const onDuplicatePage = (slug: string) => {
    showNotification("Duplicate page feature coming soon");
  };
  
  const onDeletePage = (slug: string) => {
    showNotification("Delete page feature coming soon");
  };
  
  const onViewPage = (slug: string) => {
    showNotification("View page feature coming soon");
  };
  
  // Show search results if there's a query
  if (searchQuery) {
    return (
      <div className="text-gray-800 p-4">
        <h3 className="text-xs uppercase font-medium text-gray-500 mb-3">
          Search Results
        </h3>
        
        {filteredMainPages.length === 0 && filteredTemplatePages.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded p-4 text-gray-500 text-center">
            <Search size={20} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No pages found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMainPages.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-600 mb-2 ml-1">Pages</h4>
                <div className="space-y-2">
                  {filteredMainPages.map(page => (
                    <div
                      key={page.slug}
                      className="bg-white border border-gray-200 rounded hover:border-[#6a0075] transition-all overflow-hidden shadow-sm"
                    >
                      <div 
                        onClick={() => onSelectPage(page.slug)}
                        className={`p-3 cursor-pointer ${
                          currentPage === page.slug 
                            ? "bg-gray-50 border-l-4 border-[#6a0075]" 
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText 
                              size={16} 
                              className={currentPage === page.slug ? "text-[#6a0075]" : "text-gray-400"} 
                            />
                            <div className="ml-2">
                              <div className="font-medium text-sm text-gray-800">{page.title}</div>
                              <div className="text-xs text-gray-500">/{page.slug}</div>
                            </div>
                          </div>
                          {currentPage === page.slug ? (
                            <div className="text-xs bg-[#6a0075] text-white px-2 py-0.5 rounded">
                              Active
                            </div>
                          ) : (
                            <ArrowRight size={16} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {filteredTemplatePages.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-600 mb-2 ml-1">Templates</h4>
                <div className="space-y-2">
                  {filteredTemplatePages.map(page => (
                    <div
                      key={page.slug}
                      className="bg-white border border-gray-200 rounded hover:border-[#6a0075] transition-all overflow-hidden shadow-sm"
                    >
                      <div 
                        onClick={() => onSelectPage(page.slug)}
                        className={`p-3 cursor-pointer ${
                          currentPage === page.slug 
                            ? "bg-gray-50 border-l-4 border-[#6a0075]" 
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText 
                              size={16} 
                              className={currentPage === page.slug ? "text-[#6a0075]" : "text-gray-400"} 
                            />
                            <div className="ml-2">
                              <div className="font-medium text-sm text-gray-800">{page.title}</div>
                              <div className="text-xs text-gray-500">/{page.slug}</div>
                            </div>
                          </div>
                          {currentPage === page.slug ? (
                            <div className="text-xs bg-[#6a0075] text-white px-2 py-0.5 rounded">
                              Active
                            </div>
                          ) : (
                            <ArrowRight size={16} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="text-gray-800">
      <div className="py-3 px-4 border-b border-gray-100 flex space-x-2">
        <button 
          onClick={onCreatePage} 
          disabled={isCreating}
          className="flex items-center bg-[#6a0075] hover:bg-[#800070] text-white p-2 rounded flex-1 justify-center transition-all"
        >
          <FilePlus size={16} /> <span className="ml-1 text-xs font-medium">New Page</span>
        </button>
        
        {currentPage && (
          <button 
            onClick={handleSaveLayout}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white p-2 rounded flex-1 justify-center transition-all"
          >
            <Save size={16} /> <span className="ml-1 text-xs font-medium">Save Page</span>
          </button>
        )}
      </div>
      
      {/* Site Pages Section */}
      <div className="border-b border-gray-100">
        <button 
          onClick={() => toggleSection('sitePages')}
          className="w-full flex items-center justify-between py-3 px-4 text-sm transition-colors hover:bg-gray-50"
        >
          <div className="flex items-center">
            <Layout size={16} className="text-[#6a0075] mr-2" />
            <span className="uppercase text-xs font-medium tracking-wide text-gray-600">
              Site Pages
            </span>
          </div>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${expandedSections['sitePages'] ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {expandedSections['sitePages'] && (
          <div className="pt-1 pb-3 px-4">
            {filteredMainPages.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded p-4 text-gray-500 text-xs text-center">
                No pages created yet
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMainPages.map(page => (
                  <div
                    key={page.slug}
                    className="bg-white border border-gray-200 rounded hover:border-[#6a0075] transition-all overflow-hidden shadow-sm"
                  >
                    <div 
                      onClick={() => onSelectPage(page.slug)}
                      className={`p-3 cursor-pointer ${
                        currentPage === page.slug 
                          ? "bg-gray-50 border-l-4 border-[#6a0075]" 
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText 
                            size={16} 
                            className={currentPage === page.slug ? "text-[#6a0075]" : "text-gray-400"} 
                          />
                          <div className="ml-2">
                            <div className="font-medium text-sm text-gray-800">{page.title}</div>
                            <div className="text-xs text-gray-500">/{page.slug}</div>
                          </div>
                        </div>
                        {currentPage === page.slug ? (
                          <div className="text-xs bg-[#6a0075] text-white px-2 py-0.5 rounded">
                            Active
                          </div>
                        ) : (
                          <ArrowRight size={16} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end border-t border-gray-100 px-2 py-1.5 bg-gray-50">
                      <button 
                        onClick={() => onViewPage(page.slug)}
                        className="p-1.5 text-gray-400 hover:text-[#6a0075] transition-all rounded-full hover:bg-gray-100"
                        title="View Page"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button 
                        onClick={() => onDuplicatePage(page.slug)}
                        className="p-1.5 text-gray-400 hover:text-[#6a0075] transition-all rounded-full hover:bg-gray-100"
                        title="Duplicate Page"
                      >
                        <Copy size={14} />
                      </button>
                      <button 
                        onClick={() => onDeletePage(page.slug)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-all rounded-full hover:bg-gray-100"
                        title="Delete Page"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Templates Section */}
      <div className="border-b border-gray-100">
        <button 
          onClick={() => toggleSection('templates')}
          className="w-full flex items-center justify-between py-3 px-4 text-sm transition-colors hover:bg-gray-50"
        >
          <div className="flex items-center">
            <Library size={16} className="text-[#6a0075] mr-2" />
            <span className="uppercase text-xs font-medium tracking-wide text-gray-600">
              Templates
            </span>
          </div>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${expandedSections['templates'] ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {expandedSections['templates'] && (
          <div className="pt-1 pb-3 px-4">
            {filteredTemplatePages.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded p-4 text-gray-500 text-xs text-center">
                No templates created yet
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTemplatePages.map(page => (
                  <div
                    key={page.slug}
                    className="bg-white border border-gray-200 rounded hover:border-[#6a0075] transition-all overflow-hidden shadow-sm"
                  >
                    <div 
                      onClick={() => onSelectPage(page.slug)}
                      className={`p-3 cursor-pointer ${
                        currentPage === page.slug 
                          ? "bg-gray-50 border-l-4 border-[#6a0075]" 
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText 
                            size={16} 
                            className={currentPage === page.slug ? "text-[#6a0075]" : "text-gray-400"} 
                          />
                          <div className="ml-2">
                            <div className="font-medium text-sm text-gray-800">{page.title}</div>
                            <div className="text-xs text-gray-500">/{page.slug}</div>
                          </div>
                        </div>
                        {currentPage === page.slug ? (
                          <div className="text-xs bg-[#6a0075] text-white px-2 py-0.5 rounded">
                            Active
                          </div>
                        ) : (
                          <ArrowRight size={16} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end border-t border-gray-100 px-2 py-1.5 bg-gray-50">
                      <button 
                        onClick={() => onViewPage(page.slug)}
                        className="p-1.5 text-gray-400 hover:text-[#6a0075] transition-all rounded-full hover:bg-gray-100"
                        title="View Template"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button 
                        onClick={() => onDuplicatePage(page.slug)}
                        className="p-1.5 text-gray-400 hover:text-[#6a0075] transition-all rounded-full hover:bg-gray-100"
                        title="Duplicate Template"
                      >
                        <Copy size={14} />
                      </button>
                      <button 
                        onClick={() => onDeletePage(page.slug)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-all rounded-full hover:bg-gray-100"
                        title="Delete Template"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Settings Section */}
      <div className="border-b border-gray-100">
        <button 
          onClick={() => toggleSection('settings')}
          className="w-full flex items-center justify-between py-3 px-4 text-sm transition-colors hover:bg-gray-50"
        >
          <div className="flex items-center">
            <Settings size={16} className="text-[#6a0075] mr-2" />
            <span className="uppercase text-xs font-medium tracking-wide text-gray-600">
              Page Settings
            </span>
          </div>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${expandedSections['settings'] ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {expandedSections['settings'] && (
          <div className="p-4">
            <div className="bg-gray-50 border border-gray-200 rounded p-3 text-gray-500 text-xs">
              <p className="font-medium mb-2">Page settings coming soon</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Search size={14} className="mr-2 text-gray-400" />
                  <div>SEO settings</div>
                </div>
                <div className="flex items-center">
                  <Layers size={14} className="mr-2 text-gray-400" />
                  <div>Page permissions</div>
                </div>
                <div className="flex items-center">
                  <PanelLeft size={14} className="mr-2 text-gray-400" />
                  <div>Publishing options</div>
                </div>
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