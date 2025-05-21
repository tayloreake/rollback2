import React from "react"
// import Navbar from './Navbar'
// import Footer from './Footer'
import dynamic from "next/dynamic"
// import Navbar from "./Navbar.jsx"

const Footer = dynamic(() => import("./Footer"))
const Navbar = dynamic(() => import("./Navbar"))

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default Layout
