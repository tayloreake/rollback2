export const pageview = (url) => {
    window.gtag('config', process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID, {
        page_path: url,
    });
};