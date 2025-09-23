import React from 'react'
import { BsFolder2, BsHouse, BsBuilding, BsGlobe, BsBox, BsLightbulb, BsTruck, BsBriefcase, BsFileText } from 'react-icons/bs'

const CategorySidebar = ({ categories, blogs, activeCategory, onCategoryChange }) => {
  // Define the 8 main categories with icons and colors
  const mainCategories = [
    {
      name: 'Residential Moving',
      icon: BsHouse,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      name: 'Office & Corporate Relocation',
      icon: BsBuilding,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      name: 'International & Long-Distance Moves',
      icon: BsGlobe,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10 hover:bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      name: 'Storage & Logistics',
      icon: BsBox,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10 hover:bg-orange-500/20',
      borderColor: 'border-orange-500/30'
    },
    {
      name: 'Moving Tips & Guides',
      icon: BsLightbulb,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10 hover:bg-yellow-500/20',
      borderColor: 'border-yellow-500/30'
    },
    {
      name: 'Specialized Moves',
      icon: BsTruck,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 hover:bg-red-500/20',
      borderColor: 'border-red-500/30'
    },
    {
      name: 'Lifestyle & Inspiration',
      icon: BsLightbulb,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
      borderColor: 'border-pink-500/30'
    },
    {
      name: 'Business & Industry Insights',
      icon: BsBriefcase,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 hover:bg-indigo-500/20',
      borderColor: 'border-indigo-500/30'
    }
  ]

  // Count posts per category
  const getCategoryCount = (categoryName) => {
    if (!blogs || !Array.isArray(blogs)) return 0
    
    return blogs.filter(blog => {
      if (!blog.blogCategories) return false
      return blog.blogCategories.some(cat => 
        cat.category?.toLowerCase().includes(categoryName.toLowerCase()) ||
        categoryName.toLowerCase().includes(cat.category?.toLowerCase() || '')
      )
    }).length
  }

  // Get total posts
  const totalPosts = blogs ? blogs.length : 0

  return (
    <div className="space-y-6">
      {/* Search stays at the top */}
      
      {/* Categories Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <BsFolder2 className="mr-2 text-orange-400" size={18} />
          Categories
        </h3>
        
        <div className="space-y-2">
          {/* All Posts */}
          <button
            onClick={() => onCategoryChange('')}
            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
              activeCategory === '' 
                ? 'bg-orange-500/20 border border-orange-500/30 text-orange-400' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <BsFileText className="mr-3" size={16} />
              <span>All Posts</span>
            </div>
            <span className="text-sm text-gray-400">{totalPosts}</span>
          </button>

          {/* Main Categories */}
          {mainCategories.map((category) => {
            const IconComponent = category.icon
            const count = getCategoryCount(category.name)
            const isActive = activeCategory === category.name

            return (
              <button
                key={category.name}
                onClick={() => onCategoryChange(category.name)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                  isActive 
                    ? `${category.bgColor} border ${category.borderColor} ${category.color}` 
                    : `hover:bg-gray-700 text-gray-300`
                }`}
              >
                <div className="flex items-center">
                  <IconComponent className={`mr-3 ${isActive ? category.color : 'text-gray-400'}`} size={16} />
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="text-sm text-gray-400">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Case Studies Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <BsFileText className="mr-2 text-green-400" size={18} />
          Case Studies
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Explore real-world moving scenarios and solutions.
        </p>
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          View Case Studies
        </button>
      </div>

      {/* Daily Experience Counter */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/30 p-6">
        <h3 className="text-white font-semibold mb-2">Daily Development</h3>
        <div className="text-2xl font-bold text-orange-400 mb-1">
          {totalPosts}
        </div>
        <p className="text-gray-400 text-sm">
          Articles published documenting our moving experience and expertise
        </p>
        <div className="mt-4 bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((totalPosts / 100) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Progress towards 100 articles</p>
      </div>
    </div>
  )
}

export default CategorySidebar