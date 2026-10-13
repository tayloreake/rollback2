export const GA_MEASUREMENT_ID = "G-S2W1496B3K";

export const pageview = (url) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("config", GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }
};
