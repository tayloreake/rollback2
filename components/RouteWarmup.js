import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

const knownRoutes = [
  '/', '/About', '/Gallery', '/Blog', '/faq', '/Contacts', '/Feedback', '/Jobs', '/services',
  '/services/home', '/services/office', '/services/corporate', '/services/intl', '/services/storage', '/services/long', '/services/moves', '/services/special',
  '/services/piano-moving', '/services/pet-relocation'
]

const heroImages = [
  '/assets/jumbotron/taylor-movers-services-hero.png',
  '/assets/jumbotron/specialized-services-kenya.png',
  '/assets/jumbotron/storage-services-kenya.png',
  '/assets/jumbotron/internationalmovers.jpeg',
  '/assets/jumbotron/consolidated-moves-nairobi.png',
  '/assets/jumbotron/taylor-movers-kenya-professional-team.png',
  '/assets/jumbotron/taylor-movers-kenya-packing-boxes.png',
  '/assets/jumbotron/piano-moving-professionals.png'
]

const requestIdle = (cb) => {
  if (typeof window === 'undefined') return
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(cb, { timeout: 2000 })
  }
  return setTimeout(cb, 300)
}

const RouteWarmup = () => {
  const router = useRouter()

  useEffect(() => {
    // Prefetch all known routes during idle time
    requestIdle(() => {
      knownRoutes.forEach((r) => {
        try { router.prefetch(r) } catch (e) {}
      })
    })

    // Preload hero images so first paint on route is instant
    requestIdle(() => {
      heroImages.forEach((src) => {
        try {
          const link = document.createElement('link')
          link.rel = 'prefetch'
          link.as = 'image'
          link.href = src
          document.head.appendChild(link)

          const img = new Image()
          img.src = src
        } catch (e) {}
      })
    })
  }, [router])

  return null
}

export default RouteWarmup


