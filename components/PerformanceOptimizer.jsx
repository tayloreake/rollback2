import { useEffect } from 'react'
import { useRouter } from 'next/router'

/**
 * Performance Optimizer Component
 * Implements smart prefetching and optimization strategies
 */
const PerformanceOptimizer = () => {
  const router = useRouter()

  useEffect(() => {
    // Prefetch visible links intelligently
    const prefetchVisibleLinks = () => {
      const links = document.querySelectorAll('a[href^="/"]')
      
      if (!links.length) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const href = entry.target.getAttribute('href')
              if (href && href.startsWith('/') && !href.includes('#')) {
                // Prefetch with error handling
                router.prefetch(href).catch(() => {})
                // Stop observing after prefetch
                observer.unobserve(entry.target)
              }
            }
          })
        },
        { 
          rootMargin: '100px', // Prefetch when link is 100px from viewport
          threshold: 0.1 
        }
      )

      links.forEach((link) => {
        try {
          observer.observe(link)
        } catch (e) {
          // Ignore errors
        }
      })

      return () => {
        try {
          observer.disconnect()
        } catch (e) {
          // Ignore errors
        }
      }
    }

    // Delay prefetching to not block initial render
    const timeout = setTimeout(prefetchVisibleLinks, 2000)

    return () => clearTimeout(timeout)
  }, [router, router.asPath]) // Re-run when route changes

  useEffect(() => {
    // Preconnect to external domains for faster loading
    const preconnectDomains = [
      'https://cdn.sanity.io',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ]

    const links = []
    preconnectDomains.forEach((domain) => {
      try {
        const link = document.createElement('link')
        link.rel = 'preconnect'
        link.href = domain
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
        links.push(link)
      } catch (e) {
        // Ignore errors
      }
    })

    // Cleanup
    return () => {
      links.forEach(link => {
        try {
          document.head.removeChild(link)
        } catch (e) {
          // Ignore errors
        }
      })
    }
  }, [])

  return null
}

export default PerformanceOptimizer
