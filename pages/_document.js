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
            </body>
        </Html>
    );
}
