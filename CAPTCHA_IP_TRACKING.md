# CAPTCHA & IP Tracking Implementation

## Overview
This implementation adds comprehensive spam protection and tracking for quote submissions to help identify and prevent bot spam and competitor harassment.

## Features Implemented

### 1. **IP Address Capture**
- Captures real client IP addresses from multiple sources:
  - `X-Forwarded-For` header (for proxies/load balancers)
  - `X-Real-IP` header
  - `CF-Connecting-IP` (Cloudflare)
  - `True-Client-IP` (Cloudflare Enterprise)
  - Socket IP (fallback)

### 2. **reCAPTCHA Verification**
- Validates submissions using Google reCAPTCHA v2/v3
- Tracks reCAPTCHA scores (0.0 = bot, 1.0 = human)
- Logs low scores for review (threshold: < 0.5)

### 3. **Detailed Metadata Logging**
All quote submissions are logged to Sanity CMS with:
- Client IP address
- User agent
- Referer URL
- Geolocation data (if available via CDN)
- Timestamp
- reCAPTCHA score
- Email/SMS send status

### 4. **Spam Detection**
- Rate limiting (5 requests per 15 minutes per IP)
- Client-side cooldown (2 minutes between submissions)
- Low reCAPTCHA score warnings
- VPN/Proxy detection utilities

## Files Modified/Created

### New Files:
1. **`utils/getClientIp.js`** - IP capture utilities
2. **`CAPTCHA_IP_TRACKING.md`** - This documentation

### Modified Files:
1. **`sanity/schemas/quote_req-schema.js`** - Enhanced with IP tracking fields
2. **`sanity/sanity-utils.js`** - Updated `createQuote()` function
3. **`pages/api/sendEmail.js`** - Added IP capture and Sanity logging
4. **`pages/api/sendSms.js`** - Added IP capture and includes IP in SMS
5. **`components/Quote/Form.jsx`** - Sends complete quote data to API

## How It Works

### Flow:
1. User fills out quote form
2. reCAPTCHA validates user is human
3. Form submits to API endpoints
4. **IP address is captured immediately**
5. APIs verify reCAPTCHA
6. SMS sent with IP appended to message
7. Email sent to sales team
8. **Quote data logged to Sanity CMS with full metadata**
9. User redirected to thank you page

### SMS Format:
```
New Move Request:
Name: John Doe
Email: john@example.com
Phone: 0700000000
...

[Submitted from IP: 197.232.45.123]
```

## Viewing Submissions in Sanity

1. Log in to Sanity Studio
2. Navigate to "Quote submissions"
3. View submissions with:
   - IP address in subtitle
   - Submission status (pending/verified/spam/processed)
   - Full IP details, user agent, geolocation
   - reCAPTCHA score
   - Timestamp

### Submission Statuses:
- **Pending**: New submission, not yet reviewed
- **Verified**: Legitimate customer
- **Spam**: Identified as spam/bot
- **Processed**: Quote has been handled

## Identifying Spam/Competitors

### Red Flags to Look For:
1. **Same IP Multiple Submissions**
   - Check IP address field
   - Multiple quotes from same IP in short time = suspicious

2. **Low reCAPTCHA Scores**
   - Score < 0.5 = likely bot
   - Score < 0.3 = very likely bot

3. **VPN/Proxy IPs**
   - Private network ranges (10.x.x.x, 192.168.x.x)
   - Known VPN providers

4. **Suspicious Patterns**
   - Similar names/emails
   - Fake phone numbers
   - Unrealistic move dates
   - Generic email domains in bulk

5. **User Agent Analysis**
   - Automated tools have distinctive user agents
   - Missing or suspicious user agents

### Blocking Competitors:
1. Identify spam IP in Sanity
2. Note the IP address
3. Add IP to your server firewall rules:
   ```bash
   # Example (requires server access)
   iptables -A INPUT -s 123.456.789.0 -j DROP
   ```
4. Or add to rate limiter blacklist
5. Mark submission as "spam" in Sanity

## Rate Limiting

Current limits (per IP):
- **5 requests per 15 minutes** (API level)
- **2 minutes cooldown** (Client side)

To adjust, edit:
- `pages/api/sendEmail.js` - Line 6-7
- `pages/api/sendSms.js` - Line 8-9
- `components/Quote/Form.jsx` - Line 57

## Security Best Practices

### ✅ Implemented:
- reCAPTCHA verification
- Rate limiting
- IP logging
- Input validation
- HTTPS (assumed in production)

### 🔐 Additional Recommendations:
1. **Deploy to production with HTTPS**
2. **Monitor Sanity dashboard regularly**
3. **Set up alerts for multiple submissions from same IP**
4. **Review low reCAPTCHA scores weekly**
5. **Keep reCAPTCHA keys secure** (use environment variables)
6. **Consider upgrading to reCAPTCHA v3** for invisible protection

## Environment Variables Required

Make sure these are set in `.env.local`:
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

## Testing

### Test IP Capture:
1. Submit a quote form
2. Check Sanity CMS "Quote submissions"
3. Verify IP address is captured
4. Check SMS received includes IP
5. Verify reCAPTCHA score is logged

### Test Rate Limiting:
1. Submit 6 quotes rapidly
2. 6th should be blocked with "Too many requests"
3. Wait 15 minutes, can submit again

## Analyzing Spam Patterns

### SQL-like Queries in Sanity:
```groq
// Find all submissions from specific IP
*[_type == "quote" && ipAddress == "123.456.789.0"]

// Find submissions with low reCAPTCHA scores
*[_type == "quote" && recaptchaScore < 0.5]

// Find recent spam submissions
*[_type == "quote" && submissionStatus == "spam"] | order(submittedAt desc)

// Count submissions per IP
*[_type == "quote"] | order(ipAddress) {
  ipAddress,
  count
}
```

## Reporting & Analytics

### Key Metrics to Track:
1. **Average reCAPTCHA score** - Trend over time
2. **Submissions per IP** - Identify repeat offenders
3. **Spam rate** - Percentage marked as spam
4. **Conversion rate** - Verified vs total submissions
5. **Geographic distribution** - Where spam originates

## Support & Troubleshooting

### Common Issues:

**Issue**: IP shows as "unknown"
- **Cause**: Local development or missing headers
- **Fix**: Deploy to production with proper reverse proxy

**Issue**: reCAPTCHA score is null
- **Cause**: Using reCAPTCHA v2 (doesn't provide scores)
- **Fix**: Upgrade to reCAPTCHA v3 or ignore score field

**Issue**: All IPs are the same
- **Cause**: Behind a proxy without forwarding headers
- **Fix**: Configure proxy to set X-Forwarded-For header

## Future Enhancements

Consider adding:
1. **Honeypot fields** - Hidden fields that bots fill out
2. **Time-based analysis** - Flag submissions completed too quickly
3. **Email domain verification** - Block disposable email providers
4. **Phone number validation** - Verify against Kenyan number formats
5. **Automated spam scoring** - ML model to auto-flag suspicious submissions
6. **IP geolocation blocking** - Block specific countries/regions
7. **Webhook notifications** - Alert on suspicious submissions

## Contact

For questions or issues with this implementation, contact your development team.

---

**Last Updated**: 2025-10-11
**Implementation Version**: 1.0
