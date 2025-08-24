// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'

import Layout from '../components/Layout'
import { ToastContainer } from 'react-toastify'
import Script from 'next/script'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as gtag from '../lib/gtag'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  // Track route changes for GA
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

  return (
    <Layout>
      {/* Google Analytics + Google Ads */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Google Analytics
            gtag('config', '${process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });

            // Google Ads
            gtag('config', 'AW-966026451');
          `,
        }}
      />

      {/* Tawk.to widget */}
      <Script
        id="tawkto"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/${process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID}/${process.env.NEXT_PUBLIC_TAWK_ID}';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `,
        }}
      />

      {/* Zoho SalesIQ */}
      <Script
        id="zoho-salesiq"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.$zoho = window.$zoho || {};
            $zoho.salesiq = $zoho.salesiq || { ready:function(){} };
          `,
        }}
      />
      <Script
        src="https://salesiq.zohopublic.com/widget?wc=siq45906fdec817e7bc305045159438b409c7d9d2a0921da2ee29bafbbf82da3c75"
        strategy="afterInteractive"
      />

      {/* Toasts */}
      <ToastContainer position="top-center" />

      {/* App content */}
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
