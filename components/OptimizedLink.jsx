import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/**
 * OptimizedLink component that provides instant visual feedback
 * and handles page transitions smoothly
 */
const OptimizedLink = ({ href, children, className, onClick, ...props }) => {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    // Prefetch the link on mount for instant navigation
    if (href) {
      router.prefetch(href).catch(() => {})
    }
  }, [href, router])

  const handleClick = (e) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e)
    }

    // Don't interfere with default Link behavior
    // Just provide visual feedback
    setIsNavigating(true)
    
    // Reset after navigation
    const timeout = setTimeout(() => {
      setIsNavigating(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }

  return (
    <Link 
      href={href} 
      className={`${className} ${isNavigating ? 'opacity-70' : ''}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  )
}

export default OptimizedLink
