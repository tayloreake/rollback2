import React, { useState } from 'react'
import { BsFilter, BsX } from 'react-icons/bs'

const BlogLayout = ({ children, sidebar }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Spacer for existing navbar - accounts for phone bar + navbar */}
      <div className="h-[140px] md:h-[280px] bg-transparent"></div>

      {/* Main content area */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6 relative">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-6">
              {sidebar}
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              
              {/* Sidebar */}
              <aside className="fixed top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-700 z-50 lg:hidden overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">Filters & Categories</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <BsX size={20} />
                      <span className="sr-only">Close filters</span>
                    </button>
                  </div>
                  {sidebar}
                </div>
              </aside>
            </>
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0 relative">
            {children}
            
            {/* Floating mobile filter button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden fixed bottom-6 right-6 z-30 p-4 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg transition-colors"
            >
              <BsFilter size={24} />
              <span className="sr-only">Open filters</span>
            </button>
          </main>
        </div>
      </div>
    </div>
  )
}

export default BlogLayout