import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

const knownRoutes = [
  '/', '/about', '/services', '/quote', '/contact', '/blog'
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
    // Prefetch key routes only during idle (audit §2: 19 routes + 8 hero
    // images prefetched on home wasted ~MBs on 4G and double-downloaded heroes)
    requestIdle(() => {
      knownRoutes.forEach((r) => {
        try { router.prefetch(r) } catch (e) {}
      })
    })
  }, [router])

  return null
}

export default RouteWarmup


