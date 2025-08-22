import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en" className="scroll-smooth">
            <Head>
                {/* Meta tags */}
                <meta charSet="UTF-8" />
                <meta name="theme-color" content="#ffffff" />
                <meta name="description" content="Experience reliable moving of your house/business" />

                {/* Favicon */}
                <link rel="icon" href="/favicon.svg" />

                {/* Google Fonts example */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body className="">
                <Main />
                <NextScript />
                <script>window.$zoho=window.$zoho || { };$zoho.salesiq=$zoho.salesiq||{ready:function(){ }}</script><script id="zsiqscript" src="https://salesiq.zohopublic.com/widget?wc=siq45906fdec817e7bc305045159438b409c7d9d2a0921da2ee29bafbbf82da3c75" defer></script>
            </body>
        </Html>
    );
}
