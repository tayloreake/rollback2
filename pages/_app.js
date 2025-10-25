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
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useGTM, useScrollTracking } from '../hooks/useGTM'

const GA_MEASUREMENT_ID = "G-GRKXLN7WHG"

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  // Initialize GTM tracking
  useGTM()
  
  // Initialize scroll depth tracking
  useScrollTracking()

  useEffect(() => {
    const handleRouteChange = (url) => {
      // Track pageview in GTM
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_path: url,
        })
      }
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  // Check if current route is admin page - if so, render without Layout
  const isAdminRoute = router.pathname.startsWith('/admin')
  
  if (isAdminRoute) {
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </>
    )
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout caseStudies={pageProps.caseStudies || []}>
        {/* Google Tag Manager */}
        <Script id="gtm-setup" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W6T72F2Z');
          `}
        </Script>

        {/* GA Script - Load after page is interactive for better performance */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
      <Script id="ga-setup" strategy="lazyOnload">
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
    </>
  )
}

export default MyApp
