import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import NextStudio to avoid build-time issues
const NextStudio = dynamic(
  () => import('next-sanity/studio').then((mod) => mod.NextStudio),
  {
    ssr: false,
    loading: () => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            Loading Sanity Studio...
          </div>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }
)

// Dynamically import config to avoid build-time issues
const getConfig = async () => {
  const { default: config } = await import('../../sanity.config')
  return config
}

export default function StudioPage() {
  const [mounted, setMounted] = useState(false)
  const [config, setConfig] = useState(null)
  
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const sanityConfig = await getConfig()
        setConfig(sanityConfig)
        setMounted(true)
      } catch (error) {
        console.error('Failed to load Sanity config:', error)
        setMounted(true)
      }
    }
    
    loadConfig()
  }, [])

  if (!mounted || !config) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            Loading Sanity Studio...
          </div>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  return <NextStudio config={config} />
}

// Disable static generation for this page
export const getServerSideProps = async () => {
  return {
    props: {}
  }
}