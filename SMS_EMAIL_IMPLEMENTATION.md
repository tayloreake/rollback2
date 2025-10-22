# SMS & Email Implementation for Quote Submissions

**Date**: January 22, 2025  
**Status**: ✅ Fully Implemented

---

## Overview

When a customer submits a quote request form, the system sends notifications via both SMS and Email to ensure the company receives the request immediately.

---

## Current Implementation

### 1. SMS Notification (Company) 📱

**Recipient**: `+254721410517`  
**Service**: Africa's Talking SMS API  
**Endpoint**: `/api/sendSms`

**What gets sent**:
```
New Move Request:
Name: [Customer Name]
Email: [Customer Email]
Phone Number: [Customer Phone]
Move Type: [Move Type]
Bedrooms: [Number of Bedrooms]
Move Date: [Preferred Date]
From: [Current Location]
To: [Destination]
How did you hear about us: [Referral Source]

[Submitted from IP: xxx.xxx.xxx.xxx]
```

**Features**:
- ✅ Instant notification via SMS
- ✅ IP tracking for security
- ✅ Rate limiting (5 requests per 15 minutes)
- ✅ reCAPTCHA verification
- ✅ Timeout protection (15 seconds)

---

### 2. Email to Company 📧

**Recipient**: `sales@taylorea.com`  
**Service**: Nodemailer (Gmail SMTP)  
**Endpoint**: `/api/sendEmail`

**What gets sent**:
```
Subject: Taylor Movers Quote Request

New Move Request:
Name: [Customer Name]
Email: [Customer Email]
Phone Number: [Customer Phone]
Move Type: [Move Type]
Bedrooms: [Number of Bedrooms]
Move Date: [Preferred Date]
From: [Current Location]
To: [Destination]
How did you hear about us: [Referral Source]
```

**Features**:
- ✅ Professional email format
- ✅ Logged to Sanity CMS with full details
- ✅ IP tracking and geolocation
- ✅ reCAPTCHA score logging
- ✅ Rate limiting (5 requests per 15 minutes)
- ✅ Timeout protection (15 seconds)

---

### 3. Confirmation Email to Customer 📨 (NEW)

**Recipient**: Customer's email address  
**Service**: Nodemailer (Gmail SMTP)  
**Endpoint**: `/api/sendEmail`

**What gets sent**:
```
Subject: Taylor Movers Quote Request

dear [Customer Name]
This is a confirmation email that you have made a new move request with the following details:

Name: [Customer Name]
Email: [Customer Email]
Phone Number: [Customer Phone]
Move Type: [Move Type]
Bedrooms: [Number of Bedrooms]
Move Date: [Preferred Date]
From: [Current Location]
To: [Destination]
How did you hear about us: [Referral Source]
```

**Features**:
- ✅ Immediate confirmation to customer
- ✅ Personalized message with customer's name
- ✅ Full details of their request
- ✅ Non-blocking (if fails, doesn't stop submission)
- ✅ Separate timeout protection

---

## Submission Flow

```
Customer submits form
        ↓
[1] Validate form fields
        ↓
[2] Get reCAPTCHA token (10s timeout)
        ↓
[3] Send SMS to +254721410517 (15s timeout)
        ↓
[4] Reset reCAPTCHA (1s wait)
        ↓
[5] Get new reCAPTCHA token (10s timeout)
        ↓
[6] Send email to sales@taylorea.com (15s timeout)
     ├─ Log quote to Sanity CMS
     └─ Include IP, geolocation, reCAPTCHA score
        ↓
[7] Send confirmation to customer email (15s timeout)
     └─ Non-blocking (won't stop if fails)
        ↓
[8] Show success message
        ↓
[9] Clear form & redirect to Thank You page
```

---

## Configuration Details

### Phone Numbers

**Company SMS**: `+254721410517`  
**Location**: Hardcoded in `/pages/api/sendSms.js` (line 73)

To change:
```javascript
// In sendSms.js
response = await sms.send({
  to: ['+254XXXXXXXXX'], // Change this number
  message: messageWithIp,
  from: process.env.AT_USER_ID || 'TaylorMover'
});
```

---

### Email Addresses

**Company Email**: `sales@taylorea.com`  
**Location**: `/components/Quote/Form.jsx` (line 177)

To change:
```javascript
// In Form.jsx
body: JSON.stringify({
  to: "newemail@taylorea.com", // Change this email
  message: tayloreaMessageContent,
  recaptchaToken: emailToken,
  quoteData: quoteDataForLogging
}),
```

---

### Email Configuration

**SMTP Service**: Gmail  
**Environment Variables Required**:
```env
NEXT_PUBLIC_GMAIL_USERNAME=your-email@gmail.com
NEXT_PUBLIC_GMAIL_APP_PASSWORD=your-app-specific-password
```

**Setup Gmail App Password**:
1. Go to Google Account settings
2. Security → 2-Step Verification
3. App passwords → Generate new
4. Use generated password in .env

---

### SMS Configuration

**Service**: Africa's Talking  
**Configuration File**: `/africastalking.config.js`

**Environment Variables Required**:
```env
AT_API_KEY=your-africastalking-api-key
AT_USERNAME=your-africastalking-username
AT_USER_ID=TaylorMover
```

---

## Security Features

### 1. Rate Limiting
- **Limit**: 5 requests per 15 minutes per IP
- **Purpose**: Prevent spam and abuse
- **Implementation**: Custom rate limiter middleware

### 2. reCAPTCHA Verification
- **Version**: v3 (invisible)
- **Score**: Warns if < 0.5 (potential bot)
- **Purpose**: Block automated submissions
- **Tokens**: Separate tokens for SMS and Email

### 3. IP Tracking
- **Captured**: IP address, user agent, geolocation
- **Logged**: Stored in Sanity CMS with each quote
- **Purpose**: Security audit trail

### 4. Timeout Protection
- **reCAPTCHA**: 10 second timeout
- **SMS API**: 15 second timeout
- **Email API**: 15 second timeout
- **Purpose**: Prevent hanging requests

---

## Error Handling

### SMS Fails
- ✅ Error logged to console
- ✅ Continues to send email
- ✅ Quote still submitted
- ✅ Customer still gets confirmation

### Company Email Fails
- ❌ Submission stops
- ❌ Error shown to user
- ❌ Form data preserved (can retry)

### Customer Email Fails
- ✅ Warning logged to console
- ✅ Submission continues
- ✅ Company still gets notification
- ✅ Quote still saved to Sanity

---

## Data Logging (Sanity CMS)

Each quote submission logs:
```javascript
{
  firstName: "John Doe",
  email: "john@example.com",
  phoneNumber: "+254712345678",
  location: "Westlands, Nairobi",
  destination: "Karen, Nairobi",
  moveType: "Local House Move",
  bedrooms: "3br",
  moveDate: "2025-02-15",
  referrals: "Social Media Pages",
  
  // Security & Tracking
  ipAddress: "xxx.xxx.xxx.xxx",
  ipDetails: { /* user agent, headers */ },
  geolocation: { /* country, city, coords */ },
  recaptchaScore: 0.9,
  
  // Status
  submittedAt: "2025-01-22T10:48:59Z",
  submissionStatus: "pending",
  emailSent: true,
  smsSent: true
}
```

---

## Testing

### Test SMS
```bash
curl -X POST http://localhost:3002/api/sendSms \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["+254721410517"],
    "message": "Test SMS from Taylor Movers",
    "recaptchaToken": "test-token"
  }'
```

### Test Email
```bash
curl -X POST http://localhost:3002/api/sendEmail \
  -H "Content-Type: application/json" \
  -d '{
    "to": "sales@taylorea.com",
    "message": "Test email from Taylor Movers",
    "recaptchaToken": "test-token"
  }'
```

---

## Troubleshooting

### SMS Not Sending
1. ✅ Check Africa's Talking API key in `.env`
2. ✅ Verify account has SMS credits
3. ✅ Check phone number format (+254XXXXXXXXX)
4. ✅ Review console logs for errors

### Email Not Sending
1. ✅ Check Gmail credentials in `.env`
2. ✅ Verify App Password is correct
3. ✅ Check Gmail account hasn't blocked the app
4. ✅ Review Nodemailer logs

### Customer Not Getting Email
1. ✅ Check spam/junk folder
2. ✅ Verify email address is valid
3. ✅ Check console for customer email errors
4. ✅ Test with another email address

### reCAPTCHA Failing
1. ✅ Check site key and secret key in `.env`
2. ✅ Verify domain is registered with Google
3. ✅ Check reCAPTCHA v3 is enabled
4. ✅ Review score threshold (currently 0.5)

---

## Files Involved

### Frontend
- `components/Quote/Form.jsx` - Main form logic
- `components/Quote/QuoteModal.jsx` - Modal wrapper

### Backend APIs
- `pages/api/sendSms.js` - SMS sending endpoint
- `pages/api/sendEmail.js` - Email sending endpoint
- `pages/api/middleware/rateLimiter.js` - Rate limiting

### Configuration
- `africastalking.config.js` - SMS service config
- `.env.local` - Environment variables
- `sanity/sanity-utils.js` - Sanity CMS integration

### Utilities
- `utils/getClientIp.js` - IP tracking utilities

---

## Summary

The quote submission system sends **3 notifications**:

1. **SMS to +254721410517** - Instant notification to company phone
2. **Email to sales@taylorea.com** - Detailed quote info to company
3. **Email to customer** - Confirmation to customer's email

All notifications include:
- ✅ Full quote details
- ✅ Customer contact information
- ✅ Move requirements
- ✅ Security tracking (IP, reCAPTCHA)
- ✅ Timestamp and metadata

The system is robust with:
- ✅ Rate limiting to prevent abuse
- ✅ Timeout protection to prevent hanging
- ✅ Error handling to ensure submissions succeed
- ✅ Logging to Sanity for record keeping
- ✅ Customer confirmation for peace of mind

**Everything is working as expected!** 🎉
