export const GA_MEASUREMENT_ID = "G-S2W1496B3K";

// DEPRECATED: do not call window.gtag('config') directly — it double-counts
// page_views alongside the GTM Google tag. GA4 is owned solely by GTM
// (container GTM-W6T72F2Z), which fires page_view off the dataLayer
// 'page_view' event pushed by utils/gtm.js. Kept only so old imports don't crash.
export const pageview = (url) => {
    if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
            event: "page_view",
            page_path: url,
        });
    }
};
