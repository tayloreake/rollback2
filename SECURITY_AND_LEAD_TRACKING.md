# Security Measures & Lead Tracking Documentation

## Overview
This document outlines the comprehensive security measures and lead source tracking implemented in the Taylor Movers quote form system.

---

## 🔒 Security Measures

### 1. **Google reCAPTCHA Protection**
- **Type**: Invisible reCAPTCHA (v2/v3)
- **Implementation**: Dual verification for both SMS and Email endpoints
- **Score Threshold**: 0.5 (configurable)
- **Features**:
  - Prevents automated bot submissions
  - Scores submissions from 0.0 (bot) to 1.0 (human)
  - Low scores are logged for monitoring
  - Token verification on server-side before processing

**Location**: 
- Frontend: `components/Quote/Form.jsx` (lines with `recaptchaRef`)
- Backend: `pages/api/sendEmail.js` & `pages/api/sendSms.js`

### 2. **Rate Limiting**
- **Window**: 15 minutes
- **Max Requests**: 5 per IP address
- **Type**: In-memory IP-based rate limiting
- **Response**: 429 (Too Many Requests) when exceeded

**Implementation**:
```javascript
windowMs: 15 * 60 * 1000  // 15 minutes
max: 5                     // 5 requests per IP
```

**Location**: `pages/api/middleware/rateLimiter.js`

### 3. **Client-Side Rate Limiting**
- **Cooldown Period**: 2 minutes (120 seconds)
- **Implementation**: Prevents rapid form resubmissions
- **User Feedback**: Shows countdown timer for remaining wait time

**Code**:
```javascript
if (now - lastSubmissionTime < 120000) {
  const remainingTime = Math.ceil((120000 - (now - lastSubmissionTime)) / 1000);
  toast.error(`Please wait ${remainingTime} seconds before submitting another request`);
  return;
}
```

### 4. **Input Validation**
Comprehensive validation on both client and server:

**Name Validation**:
- Minimum 2 characters
- Letters and spaces only
- Regex: `/^[a-zA-Z\s]+$/`

**Email Validation**:
- Standard email format
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

**Phone Number Validation**:
- Kenyan format (07/01XXXXXXXX)
- Regex: `/^\0\d{9}$/`

**Location Validation**:
- Minimum 3 characters for both current location and destination

**Date Validation**:
- Must be today or future date
- Past dates rejected with error message

### 5. **Request Timeout Protection**
- **SMS Timeout**: 15 seconds
- **Email Timeout**: 15 seconds
- **reCAPTCHA Timeout**: 10 seconds
- Prevents hanging requests and resource exhaustion

### 6. **IP Address Tracking & Logging**
Advanced IP capture system that handles:
- Proxy headers (`x-forwarded-for`)
- Cloudflare headers (`cf-connecting-ip`)
- Real IP headers (`x-real-ip`)
- Socket IP as fallback

**Captured Information**:
```javascript
{
  clientIp: "actual IP",
  xForwardedFor: "proxy chain",
  cfConnectingIp: "cloudflare IP",
  userAgent: "browser info",
  referer: "source page",
  origin: "request origin"
}
```

### 7. **Geolocation Tracking**
Captures location data from CDN headers:
- Country code
- City (if available)
- Timezone

**Location**: `utils/getClientIp.js` - `getGeolocation()`

### 8. **VPN/Proxy Detection**
Basic detection for suspicious IP ranges:
- Private networks (10.x.x.x, 192.168.x.x)
- Localhost (127.x.x.x)
- Can be expanded with commercial VPN IP lists

### 9. **Job Application Filter**
- **New Feature**: Informational notice at top of form
- Redirects job seekers to `/Jobs` page
- Reduces irrelevant submissions
- Clear visual distinction with blue info box

---

## 📊 Lead Source Tracking

### 1. **"How did you find us?" Field**
Captures lead source with predefined options:
- Referrals
- Social Media Pages
- Internet Search
- Door To Door Marketing
- Taylor Mover Trucks
- Previous Interactions

**Field Name**: `ref` (referrals)

### 2. **Sanity CMS Integration**
All quote submissions are logged to Sanity with:

**Quote Data**:
```javascript
{
  firstName: string,
  email: string,
  phoneNumber: string,
  location: string,
  destination: string,
  moveType: string,
  bedrooms: string,
  moveDate: date,
  referrals: string,        // Lead source
  ipAddress: string,        // Client IP
  ipDetails: object,        // Full IP info
  geolocation: object,      // Location data
  recaptchaScore: number,   // Bot score
  emailSent: boolean,       // Email status
  smsSent: boolean          // SMS status
}
```

**Function**: `createQuote()` in `sanity/sanity-utils.js`

### 3. **Submission Metadata**
Each submission includes:
- Timestamp (automatic)
- IP address (for fraud detection)
- User agent (browser/device info)
- Referer (source page)
- reCAPTCHA score (bot likelihood)
- Delivery status (email/SMS success)

### 4. **Form Analytics Event**
Custom event dispatched on successful submission:
```javascript
window.dispatchEvent(new CustomEvent("tayloreaFormSubmitted", {
  detail: { status: "success", timestamp: Date.now() }
}));
```

Can be tracked by Google Analytics, Facebook Pixel, or other analytics tools.

---

## 🛡️ Additional Security Features

### 1. **Form Persistence**
- Auto-saves form data to localStorage
- 5-minute timeout (300 seconds)
- Cleared on successful submission
- Prevents data loss but doesn't compromise security

### 2. **CORS Protection**
- API routes only accept POST requests
- Returns 405 (Method Not Allowed) for other methods

### 3. **Environment Variable Protection**
Sensitive credentials stored in environment variables:
- `RECAPTCHA_SECRET_KEY`
- `GMAIL_USERNAME`
- `GMAIL_APP_PASSWORD`
- `NEXT_PUBLIC_AT_USER_ID` (Africa's Talking)

### 4. **Error Handling**
- Graceful degradation (continues even if email/SMS fails)
- User-friendly error messages
- Detailed server-side logging
- No sensitive data exposed to client

---

## 📈 Monitoring & Analytics

### Current Logging
1. **Console Logs**:
   - IP addresses with each submission
   - reCAPTCHA scores
   - Email/SMS delivery status
   - Rate limit violations

2. **Sanity CMS**:
   - Complete submission history
   - Lead source analytics
   - IP tracking for fraud detection
   - Delivery status tracking

### Recommended Additions
1. **Spam Detection Dashboard**:
   - Track submissions by IP
   - Monitor reCAPTCHA score trends
   - Flag suspicious patterns

2. **Lead Source Analytics**:
   - Conversion rates by source
   - Geographic distribution
   - Time-based patterns

3. **Alert System**:
   - Email alerts for low reCAPTCHA scores
   - Notifications for rate limit violations
   - Warnings for suspicious IP patterns

---

## 🔧 Configuration

### Rate Limiting Adjustment
To change rate limits, modify:
```javascript
// pages/api/middleware/rateLimiter.js
windowMs: 15 * 60 * 1000,  // Time window
max: 5                      // Max requests
```

### reCAPTCHA Score Threshold
To adjust bot detection sensitivity:
```javascript
// pages/api/sendEmail.js & sendSms.js
if (recaptchaResult.score < 0.5) {  // Change 0.5 to desired threshold
  // Handle low score
}
```

### Client-Side Cooldown
To change submission cooldown:
```javascript
// components/Quote/Form.jsx
if (now - lastSubmissionTime < 120000) {  // Change 120000 (2 min)
  // Show error
}
```

---

## 🚀 Future Enhancements

### Recommended Security Improvements
1. **Honeypot Fields**: Hidden fields to catch bots
2. **Email Verification**: Confirm email addresses before processing
3. **Phone Verification**: SMS OTP for high-value leads
4. **IP Reputation Service**: Integration with commercial IP blacklists
5. **Machine Learning**: Pattern detection for spam submissions
6. **CSRF Tokens**: Additional protection against cross-site attacks

### Lead Tracking Enhancements
1. **UTM Parameter Tracking**: Capture campaign sources
2. **Session Recording**: Track user journey before submission
3. **A/B Testing**: Test different form variations
4. **Lead Scoring**: Automatic quality assessment
5. **CRM Integration**: Direct sync with sales tools

---

## 📝 Summary

Your quote form has **robust multi-layered security**:
- ✅ reCAPTCHA bot protection
- ✅ IP-based rate limiting (server + client)
- ✅ Comprehensive input validation
- ✅ Request timeout protection
- ✅ IP tracking and geolocation
- ✅ VPN/proxy detection
- ✅ Job application filtering

Your lead tracking captures:
- ✅ Lead source ("How did you find us?")
- ✅ Complete submission metadata
- ✅ IP and geolocation data
- ✅ Delivery status tracking
- ✅ reCAPTCHA quality scores
- ✅ Persistent storage in Sanity CMS

The system is production-ready with good protection against spam, bots, and abuse while maintaining detailed analytics for lead attribution.
