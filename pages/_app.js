// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'

import Layout from '../components/Layout'
import { ToastContainer } from 'react-toastify'
import Script from 'next/script'
import TawkTo from 'next-tawkto'
import { useEffect } from 'react'
import { useRouter } from 'next/router';
import * as gtag from '../lib/gtag';

function MyApp({ Component, pageProps }) {
  const router = useRouter()


  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);



  useEffect(() => {
    // Init Tawk.to
    const tawk = new TawkTo(
      process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID,
      process.env.NEXT_PUBLIC_TAWK_ID
    )

    tawk.onStatusChange((status) => {
      // console.log(status)
    })

    // Disable right-click and dev tools
    const handleContextMenu = (e) => e.preventDefault()
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        e.key === 'F12'
      ) {
        e.preventDefault()
      }
    }

    // document.addEventListener('contextmenu', handleContextMenu)
    // document.addEventListener('keydown', handleKeyDown) // Uncomment to block keys

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <Layout>
      {/* Google Ads tracking */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-966026451"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-966026451');
        `}
      </Script>

      {/* google analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', ${process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID}, {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      <ToastContainer position="top-center" />
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
