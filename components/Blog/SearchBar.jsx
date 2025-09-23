import React, { useState } from 'react'
import { BsSearch, BsX } from 'react-icons/bs'

const SearchBar = ({ onSearch, placeholder = "Search by title or hashtags..." }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)

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
      <div className={`flex items-center bg-gray-800 border rounded-lg transition-colors duration-200 ${
        isFocused ? 'border-orange-500' : 'border-gray-600'
      }`}>
        <BsSearch 
          size={18} 
          className={`ml-4 transition-colors duration-200 ${
            isFocused ? 'text-orange-500' : 'text-gray-400'
          }`} 
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-400 outline-none"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="mr-3 p-1 text-gray-400 hover:text-white transition-colors"
          >
            <BsX size={20} />
          </button>
        )}
      </div>
      
      {/* Search suggestions could go here in the future */}
      {searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
          <div className="p-3 text-sm text-gray-400">
            Searching for: <span className="text-white">"{searchTerm}"</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar