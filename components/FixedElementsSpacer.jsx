import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const FixedElementsSpacer = ({ children }) => {
  const [isEnhancedPage, setIsEnhancedPage] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if this is a page that uses the enhanced (fixed) navbar
    const enhancedPages = ['/', '/index', '/home']
    const isEnhanced = enhancedPages.includes(router.asPath) || router.asPath === ''
    setIsEnhancedPage(isEnhanced)
  }, [router.asPath])

  return (
    <div className={`${
      isEnhancedPage 
        ? 'pt-[140px] md:pt-[120px]' // Extra spacing for fixed navbar on enhanced pages
        : 'pt-[80px] md:pt-[60px]'   // Normal spacing for other pages
    }`}>
      {children}
    </div>
  )
}

export default FixedElementsSpacer