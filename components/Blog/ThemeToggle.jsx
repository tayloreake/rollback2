import React from 'react'
import { BsSun, BsMoon } from 'react-icons/bs'
import { useBlogTheme } from '../../contexts/BlogThemeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useBlogTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`p-3 rounded-lg transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-gray-700'
          : 'bg-white text-orange-600 hover:bg-gray-100 border border-gray-200 shadow-sm'
      }`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <BsSun size={20} className="animate-pulse" />
      ) : (
        <BsMoon size={20} />
      )}
    </button>
  )
}

export default ThemeToggle
