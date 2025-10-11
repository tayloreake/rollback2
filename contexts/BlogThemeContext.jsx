import React, { createContext, useContext, useState, useEffect } from 'react'

const BlogThemeContext = createContext()

export const useBlogTheme = () => {
  const context = useContext(BlogThemeContext)
  if (!context) {
    throw new Error('useBlogTheme must be used within a BlogThemeProvider')
  }
  return context
}

export const BlogThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('blog-theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
    setMounted(true)
  }, [])

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('blog-theme', theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }

  // Prevent flash of wrong theme
  if (!mounted) {
    return null
  }

  return (
    <BlogThemeContext.Provider value={value}>
      {children}
    </BlogThemeContext.Provider>
  )
}
