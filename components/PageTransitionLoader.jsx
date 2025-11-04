import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const PageTransitionLoader = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleStart = (url) => {
      if (url !== router.asPath) {
        setLoading(true)
        // Add loading class to body for blur effect
        document.body.classList.add('page-transitioning')
      }
    }

    const handleComplete = () => {
      setLoading(false)
      // Remove loading class from body
      document.body.classList.remove('page-transitioning')
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
      // Cleanup
      document.body.classList.remove('page-transitioning')
    }
  }, [router])

  if (!loading) return null

  return (
    <>
      {/* Top loading bar with progress animation */}
      <div className="fixed top-0 left-0 right-0 z-[99999] h-1 bg-gradient-to-r from-[#FF5000] via-[#FF8A50] to-[#FF5000] shadow-lg">
        <div 
          className="h-full bg-white/60 animate-[loading_1s_ease-in-out_infinite]" 
          style={{ width: '30%' }} 
        />
      </div>

      {/* Subtle overlay with blur - doesn't block interaction */}
      <div 
        className="fixed inset-0 z-[99998] bg-white/20 backdrop-blur-[2px] pointer-events-none transition-opacity duration-200"
        style={{ opacity: loading ? 1 : 0 }}
      />

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }
      `}</style>
    </>
  )
}

export default PageTransitionLoader
