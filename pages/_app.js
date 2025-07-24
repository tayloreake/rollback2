import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from "../components/Layout";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TawkTo from "next-tawkto";
import { useEffect } from "react";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Script from "next/script";


function MyApp({ Component, pageProps }) {

  useEffect(() => {

    var tawk = new TawkTo(process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID, process.env.NEXT_PUBLIC_TAWK_ID)

    tawk.onStatusChange((status) => {
      // console.log(status)
    })
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'AW-966026451');

    // Disable some dev tools key combinations
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) || // Ctrl+Shift+I/J/C
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Disable some dev tools key combinations
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) || // Ctrl+Shift+I/J/C
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };

  }, [])
  return (
    <Layout>
      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-966026451"></script>

      <ToastContainer position='top-center' />
      <Component {...pageProps} />
    </Layout>

  )
}

export default MyApp
