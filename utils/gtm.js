// Google Tag Manager utility functions

// Initialize dataLayer if it doesn't exist
export const initGTM = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

// Generic GTM event tracking function
export const gtmTrackEvent = (event) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(event);
    console.log('GTM Event:', event); // For debugging - remove in production
  }
};

// Track page views
export const gtmTrackPageView = (pagePath, pageTitle) => {
  gtmTrackEvent({
    event: 'page_view',
    page_path: pagePath,
    page_title: pageTitle,
    timestamp: new Date().toISOString()
  });
};

// Track quote form submissions
export const gtmTrackQuoteSubmission = (formData = {}) => {
  gtmTrackEvent({
    event: 'quote_submission',
    form_name: 'Quote Form',
    service_type: formData.serviceType || 'Unknown',
    origin: formData.origin || 'Unknown',
    destination: formData.destination || 'Unknown',
    timestamp: new Date().toISOString()
  });
};

// Track contact form submissions
export const gtmTrackContactSubmission = (formData = {}) => {
  gtmTrackEvent({
    event: 'contact_submission',
    form_name: 'Contact Form',
    contact_reason: formData.reason || 'General Inquiry',
    timestamp: new Date().toISOString()
  });
};

// Track newsletter signups
export const gtmTrackNewsletterSignup = (email) => {
  gtmTrackEvent({
    event: 'newsletter_signup',
    form_name: 'Newsletter',
    user_email: email, // Be careful with PII - consider hashing
    timestamp: new Date().toISOString()
  });
};

// Track phone number clicks
export const gtmTrackPhoneClick = () => {
  gtmTrackEvent({
    event: 'phone_click',
    contact_method: 'Phone',
    phone_number: '+254 721 410 517',
    timestamp: new Date().toISOString()
  });
};

// Track service page visits
export const gtmTrackServiceView = (serviceName, servicePage) => {
  gtmTrackEvent({
    event: 'service_view',
    service_name: serviceName,
    service_page: servicePage,
    category: 'Moving Services',
    timestamp: new Date().toISOString()
  });
};

// Track blog post reads
export const gtmTrackBlogRead = (blogTitle, blogSlug, category = null) => {
  gtmTrackEvent({
    event: 'blog_read',
    blog_title: blogTitle,
    blog_slug: blogSlug,
    blog_category: category,
    content_type: 'Blog Post',
    timestamp: new Date().toISOString()
  });
};

// Track file downloads
export const gtmTrackDownload = (fileName, fileType, downloadUrl) => {
  gtmTrackEvent({
    event: 'file_download',
    file_name: fileName,
    file_type: fileType,
    download_url: downloadUrl,
    timestamp: new Date().toISOString()
  });
};

// Track external link clicks
export const gtmTrackExternalClick = (url, linkText) => {
  gtmTrackEvent({
    event: 'external_click',
    external_url: url,
    link_text: linkText,
    timestamp: new Date().toISOString()
  });
};

// Track scroll depth (for engagement)
export const gtmTrackScrollDepth = (percentage, pagePath) => {
  gtmTrackEvent({
    event: 'scroll_depth',
    scroll_percentage: percentage,
    page_path: pagePath,
    timestamp: new Date().toISOString()
  });
};

// Track button clicks with custom data
export const gtmTrackButtonClick = (buttonName, buttonType, additionalData = {}) => {
  gtmTrackEvent({
    event: 'button_click',
    button_name: buttonName,
    button_type: buttonType,
    ...additionalData,
    timestamp: new Date().toISOString()
  });
};

// Track errors for debugging
export const gtmTrackError = (errorType, errorMessage, pagePath) => {
  gtmTrackEvent({
    event: 'error',
    error_type: errorType,
    error_message: errorMessage,
    page_path: pagePath,
    timestamp: new Date().toISOString()
  });
};

// E-commerce tracking for quote values (if applicable)
export const gtmTrackQuoteValue = (quoteData) => {
  gtmTrackEvent({
    event: 'quote_value',
    quote_id: quoteData.id || 'unknown',
    service_type: quoteData.serviceType,
    estimated_value: quoteData.estimatedValue || 0,
    currency: 'KES',
    timestamp: new Date().toISOString()
  });
};

// Track user engagement with specific sections
export const gtmTrackSectionView = (sectionName, pagePath) => {
  gtmTrackEvent({
    event: 'section_view',
    section_name: sectionName,
    page_path: pagePath,
    timestamp: new Date().toISOString()
  });
};

export default {
  initGTM,
  gtmTrackEvent,
  gtmTrackPageView,
  gtmTrackQuoteSubmission,
  gtmTrackContactSubmission,
  gtmTrackNewsletterSignup,
  gtmTrackPhoneClick,
  gtmTrackServiceView,
  gtmTrackBlogRead,
  gtmTrackDownload,
  gtmTrackExternalClick,
  gtmTrackScrollDepth,
  gtmTrackButtonClick,
  gtmTrackError,
  gtmTrackQuoteValue,
  gtmTrackSectionView
};