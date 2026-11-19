// Google Tag Manager utility functions
import { getAttribution, deriveLeadSource } from './attribution';

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
    if (process.env.NODE_ENV === 'development') console.log('GTM Event:', event);
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

// ---------------------------------------------------------------------------
// T6 / T7 — attribution events (playbook "GTM data layer pushes")
// ---------------------------------------------------------------------------
// NOTE ON EVENT NAME: the playbook calls the lead event `lead`. The live GTM
// container (GTM-W6T72F2Z) fires the GA4 key event AND the Google Ads
// conversion (AW-966026451) off `generate_lead` — see GTM-SETUP.md §2/§3.
// Emitting a second `lead` event would double-count conversions the moment a
// trigger is added for it, so the push stays on `generate_lead` and carries
// every field the playbook asks for (campaign_id, gclid, utm_*, lead_source,
// form_id, event_action). Point GTM at `generate_lead` and read them there.

// Dedupe window — a delegated document click listener and component-level
// onClick handlers can both fire for the same tap (e.g. Navbar tel: links).
const REPEAT_WINDOW_MS = 800;
const lastPushed = {};
const isDuplicate = (key) => {
  const now = Date.now();
  if (lastPushed[key] && now - lastPushed[key] < REPEAT_WINDOW_MS) return true;
  lastPushed[key] = now;
  return false;
};

// Helper — campaign_id from the URL, falling back to the first-touch cookie
// so a navigation without the query string still carries the campaign.
export const getCampaignIdFromUrl = () => {
  if (typeof window === 'undefined') return '';
  try {
    const params = new URLSearchParams(window.location.search);
    // Google Ads auto-tagging uses utm_id for the campaign id; paid social
    // links usually carry campaign_id explicitly.
    const fromUrl = params.get('campaign_id') || params.get('utm_id');
    if (fromUrl) return fromUrl;
    const stored = getAttribution();
    return stored.campaign_id || stored.utm_id || '';
  } catch {
    return '';
  }
};

const attributionFields = (attribution = {}) => ({
  // Cookie first, URL second — the CRM record is built from the same cookie,
  // so GA4 and Zoho must agree on which campaign/ad produced the lead.
  // (getCampaignIdFromUrl still exists for click events, which have no CRM row.)
  campaign_id: String(attribution.campaign_id || attribution.utm_id || '') || getCampaignIdFromUrl(),
  campaign_name: String(attribution.campaign_name || attribution.utm_campaign || ''),
  gclid: String(attribution.gclid || ''),
  gbraid: String(attribution.gbraid || ''),
  wbraid: String(attribution.wbraid || ''),
  fbclid: String(attribution.fbclid || ''),
  msclkid: String(attribution.msclkid || ''),
  utm_source: String(attribution.utm_source || ''),
  utm_medium: String(attribution.utm_medium || ''),
  utm_campaign: String(attribution.utm_campaign || ''),
  utm_term: String(attribution.utm_term || ''),
  utm_content: String(attribution.utm_content || ''),
  ad_id: String(attribution.ad_id || ''),
  ad_name: String(attribution.ad_name || ''),
  keyword: String(attribution.keyword || ''),
  platform: String(attribution.platform || ''),
});

// 1. Lead form submission — fires when the user submits the Quote or Contact
//    form. `source` is optional; without it the channel is derived from the
//    campaign data / the visitor's own "how did you hear about us" answer.
export const gtmPushLead = (leadData = {}) => {
  const attribution = leadData.attribution || getAttribution();
  gtmTrackEvent({
    event: 'generate_lead',
    event_category: 'engagement',
    event_action: 'form_submit',
    form_id: leadData.formId || 'quote',
    lead_source: leadData.source || deriveLeadSource(attribution, leadData.referral || ''),
    referral_answer: leadData.referral || '',
    ...attributionFields(attribution),
    user_id: leadData.userId || '',
    value: leadData.value === undefined ? 1 : leadData.value,
    currency: 'KES',
    // Shared with the server-side Meta CAPI call so Meta dedupes browser + server (T15b)
    ...(leadData.eventId ? { event_id: leadData.eventId } : {}),
    ...(leadData.move_type ? { move_type: leadData.move_type } : {}),
    ...(leadData.bedrooms ? { bedrooms: leadData.bedrooms } : {}),
    timestamp: new Date().toISOString(),
  });
};

// 2. WhatsApp click — fires when a wa.me link is tapped. `refCode` comes from
//    the link's `ref` param or the `(ref: XXX)` marker inside its text.
export const gtmPushWhatsAppClick = (refCode = '', channel = 'Website') => {
  if (isDuplicate('whatsapp_click')) return;
  gtmTrackEvent({
    event: 'whatsapp_click',
    event_category: 'engagement',
    event_action: 'click_to_whatsapp',
    whatsapp_ref: String(refCode || ''),
    channel: String(channel || 'Website'),
    campaign_id: getCampaignIdFromUrl(),
    timestamp: new Date().toISOString(),
  });
};

// 3. Phone click — fires when a tel: link is tapped.
export const gtmPushPhoneClick = (phoneNumber = '') => {
  if (isDuplicate('phone_click')) return;
  gtmTrackEvent({
    event: 'phone_click',
    event_category: 'engagement',
    event_action: 'click_to_call',
    contact_method: 'Phone',
    phone_number: String(phoneNumber || ''),
    campaign_id: getCampaignIdFromUrl(),
    timestamp: new Date().toISOString(),
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
// NOTE: the email address is intentionally NOT pushed to the dataLayer (PII).
export const gtmTrackNewsletterSignup = () => {
  gtmTrackEvent({
    event: 'newsletter_signup',
    form_name: 'Newsletter',
    timestamp: new Date().toISOString()
  });
};

// Track phone number clicks (legacy wrapper — now carries campaign_id)
export const gtmTrackPhoneClick = (phoneNumber) => {
  gtmPushPhoneClick(phoneNumber || '+254 721 410 517');
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
  gtmPushLead,
  gtmPushWhatsAppClick,
  gtmPushPhoneClick,
  getCampaignIdFromUrl,
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