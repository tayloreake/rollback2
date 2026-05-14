import React from "react"
import Navbar from './Navbar'
import Footer from './Footer'
import dynamic from "next/dynamic"

// Load performance optimizers dynamically (client-side only)
const RouteWarmup = dynamic(() => import("./RouteWarmup"), { ssr: false })
const PerformanceOptimizer = dynamic(() => import("./PerformanceOptimizer"), { ssr: false })

const Layout = ({ children, caseStudies = [] }) => {
  return (
    <>
      <Navbar />
      <RouteWarmup />
      <PerformanceOptimizer />
      {children}
      <Footer caseStudies={caseStudies} />
    {/* Zoho SalesIQ */}
      <Script id="zoho-salesiq-init" strategy="afterInteractive">
        {`
          window.$zoho = window.$zoho || {};
          window.$zoho.salesiq = window.$zoho.salesiq || {
            widgetcode: "siq45906fdec817e7bc305045159438b409c7d9d2a0921da2ee29bafbbf82da3c75",
            values: {},
            ready: function() {}
          };
        `}
      </Script>
      <Script
        id="zsiqscript"
        src="https://salesiq.zohopublic.com/widget?wc=siq45906fdec817e7bc305045159438b409c7d9d2a0921da2ee29bafbbf82da3c75"
        strategy="afterInteractive"
      />
    </>
  )
}

export default Layout
