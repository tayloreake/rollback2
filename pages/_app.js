import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from "../components/Layout"
import "../styles/globals.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import TawkTo from "next-tawkto"
import { useEffect } from "react"

function MyApp({ Component, pageProps }) {
  
  useEffect(() => {

    var tawk = new TawkTo(process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID, process.env.NEXT_PUBLIC_TAWK_ID)

    tawk.onStatusChange((status) => 
    {
        // console.log(status)
    })

}, [])
  return (

    <Layout>
      <ToastContainer position='top-center' />
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
