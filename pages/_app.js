// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
// import 'lightswind/lightswindv1.0.css' // Removed - using local implementations
import '../styles/globals.css'
import '../styles/hero-enhancements.css'

import Layout from '../components/Layout'
import ConsentBanner from '../components/ConsentBanner'
import ConsentGatedTags from '../components/ConsentGatedTags'
import StickyMobileBar from '../components/StickyMobileBar'
import { initAttribution } from '../utils/attribution'
import WebVitals from '../components/SEO/WebVitals'
import PageTransitionLoader from '../components/PageTransitionLoader'
import { ToastContainer } from 'react-toastify'
import Script from 'next/script'
import Head from 'next/head'
import { Montserrat } from 'next/font/google'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useGTM, useScrollTracking } from '../hooks/useGTM'

// GA4 is managed in GTM (container GTM-W6T72F2Z), NOT hard-coded here.
// Single WOFF2 font loading (audit §2 P1) — replaces local OTF/TTF,
// Google Fonts <link> tags and the Typekit reference.
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})
// GTM setup required (outside code):
//  - Google tag for G-S2W1496B3K on Initialization – All Pages
//  - GA4 Event `page_view` on Custom Event `page_view` (pushed by useGTM),
//    with automatic history-change page-views OFF to avoid doubles.
//  - GA4 Event `generate_lead` + Google Ads Conversion on Custom Event `generate_lead`.

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Initialize GTM tracking
  useGTM()

  // First-touch attribution (UTM/gclid/landing in a 90-day cookie)
  useEffect(() => { initAttribution() }, [])
  
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
    // SPA page-views are pushed to the dataLayer by useGTM() as {event:'page_view'}.
    // GTM forwards them to GA4. Do not call window.gtag directly here.
    const handleRouteChange = () => {}
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
      <div className={montserrat.className}>
      <Layout caseStudies={pageProps.caseStudies || []}>
        {/* Single GTM loader lives in _document.js. This idle loader handles
            ONLY Zoho (PageSense + SalesIQ) to avoid double gtm.js pushes. */}
        <Script id="3p-after-idle" strategy="afterInteractive">
          {`
            (function(){
              var injected=false;
              // Zoho is part of our single consent banner (ConsentBanner):
              // PageSense (analytics) + SalesIQ load ONLY after the visitor
              // grants analytics or ads consent. Until then nothing from Zoho
              // loads, so its own cookie banner never appears either.
              function consented(){
                try {
                  var raw = localStorage.getItem('tm-consent-v1');
                  if(!raw) return false;
                  var c = JSON.parse(raw);
                  return !!(c && (c.analytics || c.ads));
                } catch(e) { return false; }
              }
              function inject(){
                if(injected) return;
                if(!consented()) return; // wait for a tm-consent event
                injected=true;
                try {
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
              // Inject after first route settle + idle (only if consented),
              // or the moment consent is granted in the banner.
              var done=false;
              function ready(){ if(done) return; done=true; onIdle(inject); }
              if(document.readyState==='complete'){ ready(); }
              else window.addEventListener('load', ready, { once: true });
              window.addEventListener('tm-consent', function(){ onIdle(inject); });
            })();
          `}
        </Script>

      {/* Web Vitals Tracking */}
      <WebVitals />

      {/* Consent Mode v2 banner + consent-gated ad tags */}
      <ConsentBanner />
      <ConsentGatedTags />

      {/* Sticky mobile call/WhatsApp/quote bar */}
      <StickyMobileBar />
      
      <ToastContainer position="top-center" />
      <Component {...pageProps} />
    </Layout>
      </div>
    </>
  )
}

export default MyApp
