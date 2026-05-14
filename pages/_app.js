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
import PageTransitionLoader from '../components/PageTransitionLoader'
import { ToastContainer } from 'react-toastify'
import Script from 'next/script'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useGTM, useScrollTracking } from '../hooks/useGTM'

const GA_MEASUREMENT_ID = "G-GRKXLN7WHG"

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Initialize GTM tracking
  useGTM()
  
  // Initialize scroll depth tracking
  useScrollTracking()

  // Instant page transition handling with scroll restoration
  useEffect(() => {
    const handleStart = (url) => {
      if (url !== router.asPath) {
        setIsTransitioning(true)
        // Scroll to top immediately on navigation start
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }
    const handleComplete = () => {
      setIsTransitioning(false)
      // Ensure we're at top after page loads
      window.scrollTo({ top: 0, behavior: 'instant' })
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
      
      {/* Page transition loader */}
      <PageTransitionLoader />
      
      <Layout caseStudies={pageProps.caseStudies || []}>
        {/* Defer third-party scripts until idle to keep navigation snappy */}
        <Script id="3p-after-idle" strategy="afterInteractive">
          {`
            (function(){
              var injected=false;
              function inject(){
                if(injected) return; injected=true;
                try {
                  // GTM
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-W6T72F2Z');

                  // Zoho PageSense
                  var p=document.createElement('script');
                  p.src='https://cdn.pagesense.io/js/taylorsolutions/9c8c7528274e4f4b978c2486a52f8634.js';
                  p.async=true; document.head.appendChild(p);

                  window.$zoho = window.$zoho || {};
                  $zoho.salesiq = $zoho.salesiq || { ready: function() {} };
              
                  // Zoho SalesIQ Widget Script
                  var s = document.createElement('script');
                  s.id = 'zsiqscript';
                  s.src = 'https://salesiq.zohopublic.com/widget?wc=siq45906fdec817e7bc305045159438b409c7d9d2a0921da2ee29bafbbf82da3c75';
                  s.defer = true;
                  document.body.appendChild(s);
                                    
                  
                } catch(e) { /* no-op */ }
              }
              function onIdle(cb){
                if('requestIdleCallback' in window){return window.requestIdleCallback(cb,{timeout:2000});}
                return setTimeout(cb,300);
              }
              // Inject after first route settle + idle
              var done=false;
              function ready(){ if(done) return; done=true; onIdle(inject); }
              if(document.readyState==='complete'){ ready(); }
              else window.addEventListener('load', ready, { once: true });
            })();
          `}
        </Script>

      {/* GA Script - Load after idle via gtag, keep lazy */}
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
