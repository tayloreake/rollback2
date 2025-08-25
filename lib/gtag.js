export const GA_MEASUREMENT_ID = "G-GRKXLN7WHG";

export const pageview = (url) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("config", GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }
};
