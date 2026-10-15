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

  // Render on the server with the default theme so SEO tags and headings are
  // present in server HTML (previously returned null pre-mount, which left
  // /blog and posts with empty <title> for crawlers). Client preference from
  // localStorage still applies on mount; worst case is a one-frame flash.
  return (
    <BlogThemeContext.Provider value={value}>
      {children}
    </BlogThemeContext.Provider>
  )
}
