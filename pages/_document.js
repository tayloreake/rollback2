import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en" className="scroll-smooth">
            <Head>
                {/* Meta tags */}
                <meta charSet="UTF-8" />
                <meta name="theme-color" content="#FF5000" />
                <meta name="robots" content="index, follow" />
                
                {/* Favicon and Icons */}
                <link rel="icon" href="/favicon.svg" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest.json" />
                
                {/* Resource Hints for Performance */}
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
                <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                
                {/* Canonical URL base - will be overridden by page-specific canonicals */}
                <link rel="canonical" href="https://taylorea.com" />

                {/* Google Fonts with optimized loading */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
                    rel="stylesheet"
                    media="print"
                    onLoad="this.media='all'"
                />
                <noscript>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
                        rel="stylesheet"
                    />
                </noscript>
                
                {/* Google Tag Manager */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-W6T72F2Z');`
                    }}
                />
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
