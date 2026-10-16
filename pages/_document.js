import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en" className="scroll-smooth">
            <Head>
            {/* Consent Mode v2 defaults: deny everything until the visitor
                chooses in ConsentBanner (audit §1 P1). Must run before GTM. */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};window.gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});`,
                }}
            />
            {/* GA4 is owned SOLELY by GTM (container GTM-W6T72F2Z).
                Do NOT add a hardcoded gtag.js / gtag('config') here — it
                double-counts every page_view with the GTM Google tag.
                GTM fires GA4 page_view off the dataLayer 'page_view' event
                pushed by useGTM (history-change auto page-views OFF). */}
            <script
                   dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-W6T72F2Z');`,
                }}
                />

                        
                {/* Meta tags */}
                <meta charSet="UTF-8" />
                <meta name="theme-color" content="#FF5000" />
                <meta name="robots" content="index, follow" />
                
                {/* Favicon and Icons */}
                <link rel="icon" href="/favicon.svg" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest.json" />
                
                {/* Resource Hints for Performance (fonts now via next/font, no external font CSS) */}
                <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
                <link rel="dns-prefetch" href="https://cdn.pagesense.io" />
                <link rel="preconnect" href="https://cdn.pagesense.io" crossOrigin="anonymous" />
                
                {/* Per-page canonicals are rendered by each page's <Head>.
                    Do NOT add a global canonical here — it de-indexes service pages. */}
            </Head>
            <body className="">
                {/* Google Tag Manager (noscript) */}
                            
                <noscript>
                    <iframe 
                        src="https://www.googletagmanager.com/ns.html?id=GTM-W6T72F2Z"
                        height="0" 
                        width="0" 
                        style={{display: 'none', visibility: 'hidden'}}
                    />
                </noscript>
                
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
