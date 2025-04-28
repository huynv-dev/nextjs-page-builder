'use client';

import { useEditor } from '@craftjs/core';
import { 
  Plus, 
  FileText, 
  ArrowRight, 
  Trash2,
  Copy,
  Eye,
  Save
} from 'lucide-react';
import { usePages } from '@/hooks/usePages';
import { useLayouts } from '@/hooks/useLayouts';
import { showNotification } from '@/utils/notifications';

export const PagesTab = () => {
  const { actions } = useEditor();
  const { 
    pages, 
    currentPage, 
    isCreating, 
    handleCreatePage, 
    handleSelectPage 
  } = usePages();
  
  const { handleSaveLayout } = useLayouts();
  
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
  
  return (
    <div className="text-gray-800">
      <div className="py-3 px-4 border-b border-gray-100">
        <button 
          onClick={onCreatePage} 
          disabled={isCreating}
          className="flex items-center bg-[#6a0075] hover:bg-[#800070] text-white p-2 rounded w-full justify-center transition-all mb-2"
        >
          <Plus size={16} /> <span className="ml-1 text-sm">Create New Page</span>
        </button>
        
        {currentPage && (
          <button 
            onClick={handleSaveLayout}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white p-2 rounded w-full justify-center transition-all"
          >
            <Save size={16} /> <span className="ml-1 text-sm">Save Current Page</span>
          </button>
        )}
      </div>
      
      <div className="pt-3 px-4">
        <div className="font-medium text-xs mb-3 uppercase tracking-wide text-gray-600">
          Site Pages
        </div>
        
        {pages.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded p-4 text-gray-500 text-sm text-center">
            No pages created yet
          </div>
        )}
        
        <div className="space-y-2">
          {pages.map(page => (
            <div
              key={page.slug}
              className="bg-white border border-gray-200 rounded hover:border-[#6a0075] transition-all overflow-hidden"
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
                  className="p-1.5 text-gray-400 hover:text-[#6a0075] transition-all"
                  title="View"
                >
                  <Eye size={14} />
                </button>
                <button 
                  onClick={() => onDuplicatePage(page.slug)}
                  className="p-1.5 text-gray-400 hover:text-[#6a0075] transition-all"
                  title="Duplicate"
                >
                  <Copy size={14} />
                </button>
                <button 
                  onClick={() => onDeletePage(page.slug)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-all"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 