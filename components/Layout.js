import React from "react"
import Navbar from './Navbar'
import AnnouncementBar from './AnnouncementBar'
import Footer from './Footer'
import dynamic from "next/dynamic"

// Load performance optimizers dynamically (client-side only)
const RouteWarmup = dynamic(() => import("./RouteWarmup"), { ssr: false })
const PerformanceOptimizer = dynamic(() => import("./PerformanceOptimizer"), { ssr: false })

const Layout = ({ children, caseStudies = [] }) => {
  return (
    <>
      <Navbar />
      <AnnouncementBar />
      <RouteWarmup />
      <PerformanceOptimizer />
      <main>{children}</main>
      <Footer caseStudies={caseStudies} />
    </>
  )
}

export default Layout
