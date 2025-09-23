// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-toastify/dist/ReactToastify.css'
import 'antd/dist/reset.css'
// import 'lightswind/lightswindv1.0.css' // Removed - using local implementations
import '../styles/globals.css'
import '../styles/hero-enhancements.css'

import Layout from '../components/Layout'
import WebVitals from '../components/SEO/WebVitals'
import { ToastContainer } from 'react-toastify'
import Script from 'next/script'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const GA_MEASUREMENT_ID = "G-GRKXLN7WHG"

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      console.log("Logging pageview:", url)
      window.gtag('event', 'page_view', {
        page_path: url,
      })
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  return (
    <Layout>
      {/* GA Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-setup" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            custom_map: {
              'metric1': 'CLS',
              'metric2': 'FID',
              'metric3': 'FCP',
              'metric4': 'LCP',
              'metric5': 'TTFB'
            }
          });
        `}
      </Script>

      {/* Web Vitals Tracking */}
      <WebVitals />
      
      <ToastContainer position="top-center" />
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
