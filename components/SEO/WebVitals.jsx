import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Core Web Vitals tracking for SEO performance
const WebVitals = () => {
  const router = useRouter()

  useEffect(() => {
    // Web Vitals reporting function
    const reportWebVitals = (metric) => {
      // Send to Google Analytics
      if (window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        })
      }

      // Send to console for development
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric)
      }

      // You can also send to your analytics service
      // sendToAnalytics(metric)
    }

    // Dynamic import of web-vitals library
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(reportWebVitals)
      getFID(reportWebVitals)
      getFCP(reportWebVitals)
      getLCP(reportWebVitals)
      getTTFB(reportWebVitals)
    }).catch(err => {
      console.warn('Web Vitals could not be loaded:', err)
    })

    // Performance observer for custom metrics
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        // Monitor Long Tasks (important for FID)
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) { // Tasks longer than 50ms
              if (window.gtag) {
                window.gtag('event', 'long_task', {
                  event_category: 'Performance',
                  value: Math.round(entry.duration),
                  custom_parameter_1: entry.name
                })
              }
            }
          })
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })

        // Monitor Layout Shifts
        const layoutShiftObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (!entry.hadRecentInput) {
              if (window.gtag) {
                window.gtag('event', 'layout_shift', {
                  event_category: 'Performance',
                  value: Math.round(entry.value * 1000)
                })
              }
            }
          })
        })
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })

        // Monitor First Input
        const firstInputObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (window.gtag) {
              window.gtag('event', 'first_input', {
                event_category: 'Performance',
                value: Math.round(entry.processingStart - entry.startTime)
              })
            }
          })
        })
        firstInputObserver.observe({ entryTypes: ['first-input'] })
      } catch (error) {
        console.warn('Performance observers not supported:', error)
      }
    }

    // Track navigation timing
    const trackNavigationTiming = () => {
      if (typeof window !== 'undefined' && window.performance && window.performance.timing) {
        const timing = window.performance.timing
        const navigationStart = timing.navigationStart
        
        const metrics = {
          dns: timing.domainLookupEnd - timing.domainLookupStart,
          tcp: timing.connectEnd - timing.connectStart,
          ssl: timing.secureConnectionStart > 0 ? timing.connectEnd - timing.secureConnectionStart : 0,
          ttfb: timing.responseStart - timing.requestStart,
          download: timing.responseEnd - timing.responseStart,
          dom: timing.domComplete - timing.domLoading,
          total: timing.loadEventEnd - navigationStart
        }

        // Send metrics to analytics
        Object.keys(metrics).forEach(key => {
          if (metrics[key] > 0 && window.gtag) {
            window.gtag('event', `navigation_${key}`, {
              event_category: 'Navigation Timing',
              value: metrics[key]
            })
          }
        })
      }
    }

    // Track on route change
    const handleRouteChange = () => {
      // Small delay to ensure metrics are available
      setTimeout(trackNavigationTiming, 100)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    
    // Track initial load
    if (document.readyState === 'complete') {
      trackNavigationTiming()
    } else {
      window.addEventListener('load', trackNavigationTiming)
    }

    // Cleanup
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      window.removeEventListener('load', trackNavigationTiming)
    }
  }, [router])

  // Performance optimizations
  useEffect(() => {
    // Preload critical resources based on user behavior
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontPreloads = [
        '/fonts/Montserrat-Bold.otf',
        '/fonts/Montserrat-ExtraBold.otf'
      ]
      
      fontPreloads.forEach(font => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = font
        link.as = 'font'
        link.type = 'font/otf'
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      })

      // Preload hero images
      const heroImages = [
        '/assets/Bgs/taylor-packaging-boxes.png',
        '/assets/General/logo.png'
      ]
      
      heroImages.forEach(image => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = image
        link.as = 'image'
        document.head.appendChild(link)
      })
    }

    // Run after initial render
    setTimeout(preloadCriticalResources, 100)

    // Implement resource hints for better performance
    const addResourceHints = () => {
      // DNS prefetch for external domains
      const prefetchDomains = [
        'https://fonts.googleapis.com',
        'https://cdn.sanity.io',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com'
      ]

      prefetchDomains.forEach(domain => {
        const link = document.createElement('link')
        link.rel = 'dns-prefetch'
        link.href = domain
        document.head.appendChild(link)
      })

      // Preconnect to critical domains
      const preconnectDomains = [
        'https://fonts.gstatic.com',
        'https://cdn.sanity.io'
      ]

      preconnectDomains.forEach(domain => {
        const link = document.createElement('link')
        link.rel = 'preconnect'
        link.href = domain
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      })
    }

    addResourceHints()

    // Implement lazy loading for images below the fold
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
              observer.unobserve(img)
            }
          }
        })
      })

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img)
      })
    }

    // Critical CSS detection and lazy loading
    const loadNonCriticalCSS = () => {
      const nonCriticalCSS = [
        '/styles/non-critical.css' // You can create this for non-critical styles
      ]

      nonCriticalCSS.forEach(css => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = css
        link.media = 'print'
        link.onload = function() { this.media = 'all' }
        document.head.appendChild(link)
      })
    }

    // Load non-critical CSS after page load
    if (document.readyState === 'complete') {
      loadNonCriticalCSS()
    } else {
      window.addEventListener('load', loadNonCriticalCSS)
    }
  }, [])

  // This component doesn't render anything - it's just for performance tracking
  return null
}

export default WebVitals

// Utility function to measure custom performance metrics
export const measurePerformance = (name, fn) => {
  if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
    const startMark = `${name}-start`
    const endMark = `${name}-end`
    const measureName = `${name}-measure`

    window.performance.mark(startMark)
    
    const result = fn()
    
    if (result && typeof result.then === 'function') {
      // Handle async functions
      return result.finally(() => {
        window.performance.mark(endMark)
        window.performance.measure(measureName, startMark, endMark)
        
        const measure = window.performance.getEntriesByName(measureName)[0]
        if (measure && window.gtag) {
          window.gtag('event', 'custom_performance', {
            event_category: 'Performance',
            event_label: name,
            value: Math.round(measure.duration)
          })
        }
      })
    } else {
      // Handle sync functions
      window.performance.mark(endMark)
      window.performance.measure(measureName, startMark, endMark)
      
      const measure = window.performance.getEntriesByName(measureName)[0]
      if (measure && window.gtag) {
        window.gtag('event', 'custom_performance', {
          event_category: 'Performance',
          event_label: name,
          value: Math.round(measure.duration)
        })
      }
      
      return result
    }
  }
  
  return fn()
}