import React, { useState } from 'react'
import { BsSearch, BsX } from 'react-icons/bs'
import { useBlogTheme } from '../../contexts/BlogThemeContext'

const SearchBar = ({ onSearch, placeholder = "Search by title or hashtags..." }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const { theme } = useBlogTheme()

  const handleSearch = (value) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const clearSearch = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div className="relative mb-6">
      <div className={`flex items-center border rounded-lg transition-colors duration-200 ${
        theme === 'dark'
          ? `bg-gray-800 ${
              isFocused ? 'border-orange-500' : 'border-gray-600'
            }`
          : `bg-white ${
              isFocused ? 'border-orange-500' : 'border-gray-300'
            }`
      }`}>
        <BsSearch 
          size={18} 
          className={`ml-4 transition-colors duration-200 ${
            isFocused 
              ? 'text-orange-500' 
              : theme === 'dark' 
                ? 'text-gray-400' 
                : 'text-gray-500'
          }`} 
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-transparent outline-none ${
            theme === 'dark'
              ? 'text-white placeholder-gray-400'
              : 'text-gray-900 placeholder-gray-500'
          }`}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className={`mr-3 p-1 transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <BsX size={20} />
          </button>
        )}
      </div>
      
      {/* Search suggestions could go here in the future */}
      {searchTerm && (
        <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-10 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-600'
            : 'bg-white border-gray-200'
        }`}>
          <div className={`p-3 text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Searching for: <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>"{searchTerm}"</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar