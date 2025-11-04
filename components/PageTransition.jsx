import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/**
 * Optimistic page transition wrapper
 * Shows instant visual feedback while Next.js loads the new page
 */
const PageTransition = ({ children }) => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleStart = () => {
      // Don't hide content, just show we're transitioning
      setIsVisible(true)
    }

    const handleComplete = () => {
      setIsVisible(true)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return (
    <div 
      className="transition-opacity duration-150" 
      style={{ opacity: isVisible ? 1 : 0.95 }}
    >
      {children}
    </div>
  )
}

export default PageTransition
