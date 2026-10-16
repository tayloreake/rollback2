import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Core Web Vitals tracking for SEO performance
const WebVitals = () => {
  const router = useRouter()

  useEffect(() => {
    // Web Vitals reporting function — via dataLayer so GTM/consent owns delivery.
    // Never call window.gtag directly (no hardcoded GA4 on site).
    const reportWebVitals = (metric) => {
      try {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: 'web_vitals',
          web_vitals_name: metric.name,
          web_vitals_id: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        })
      } catch { /* no-op */ }

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
        // Monitor Long Tasks (important for FID) — dataLayer only, sampled
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) { // Tasks longer than 50ms
              try {
                window.dataLayer = window.dataLayer || []
                window.dataLayer.push({
                  event: 'long_task',
                  value: Math.round(entry.duration),
                })
              } catch { /* no-op */ }
            }
          })
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })

        // Monitor Layout Shifts
        const layoutShiftObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (!entry.hadRecentInput) {
              try {
                window.dataLayer = window.dataLayer || []
                window.dataLayer.push({
                  event: 'layout_shift',
                  value: Math.round(entry.value * 1000)
                })
              } catch { /* no-op */ }
            }
          })
        })
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })

        // Monitor First Input
        const firstInputObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            try {
              window.dataLayer = window.dataLayer || []
              window.dataLayer.push({
                event: 'first_input',
                value: Math.round(entry.processingStart - entry.startTime)
              })
            } catch { /* no-op */ }
          })
        })
        firstInputObserver.observe({ entryTypes: ['first-input'] })
      } catch (error) {
        console.warn('Performance observers not supported:', error)
      }
    }

    // Navigation-timing events REMOVED (audit: duplicate/noisy hits).
    // WebVitals previously sent window.gtag('event','navigation_*') directly,
    // bypassing Consent Mode + GTM and inflating GA4 event counts.
    // Core Web Vitals above (via web-vitals lib) are enough; add more only
    // as GTM custom events if needed.
  }, [router])

  // Performance optimizations
  useEffect(() => {
    // Preload only the small logo — never the 2.4 MB packaging PNG or
    // the missing OTF fonts (audit §2 P1: 404s that blocked render).
    const preloadCriticalResources = () => {
      // Preload hero images
      const heroImages = [
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

    // NOTE: non-critical.css does not exist (404s) — do not inject it.
    // If deferred styles are ever needed, create the file first, then re-enable.
  }, [])

  // This component doesn't render anything - it's just for performance tracking
  return null
}

export default WebVitals

// Utility function to measure custom performance metrics
// Pushes to dataLayer (GTM-owned). Never calls window.gtag directly.
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
        if (measure) {
          try {
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({ event: 'custom_performance', event_label: name, value: Math.round(measure.duration) })
          } catch { /* no-op */ }
        }
      })
    } else {
      // Handle sync functions
      window.performance.mark(endMark)
      window.performance.measure(measureName, startMark, endMark)
      
      const measure = window.performance.getEntriesByName(measureName)[0]
      if (measure) {
        try {
          window.dataLayer = window.dataLayer || []
          window.dataLayer.push({ event: 'custom_performance', event_label: name, value: Math.round(measure.duration) })
        } catch { /* no-op */ }
      }
      
      return result
    }
  }
  
  return fn()
}