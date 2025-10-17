# Taylor Movers - Sanity CMS User Guide

## What is Sanity CMS?

Sanity is the **Content Management System** (CMS) that powers your Taylor Movers website. Think of it as the "admin panel" where you can:
- ✏️ Edit website content without touching code
- 📝 Create and manage blog posts
- 🖼️ Upload and manage images
- 📊 View quote submissions from customers
- 👥 Manage client logos and testimonials
- ⚙️ Configure site-wide settings

**No coding knowledge required!** - Everything is done through a user-friendly interface.

---

## 🚀 How to Access Sanity Studio

### Method 1: Via Your Website (Recommended)
1. Go to your website: `https://taylorea.com/admin`
2. Log in with your Sanity credentials

### Method 2: Run Locally (For Development)
```bash
cd /home/ace/rollback2
npm run sanity
```
Then visit: `http://localhost:3333`

---

## 📋 What Can You Manage?

Your Sanity setup has the following content types:

### 1. **Quote Submissions** 📥
- **View**: All customer quote requests
- **What you can do**:
  - View customer details (name, email, phone, location)
  - See IP addresses to identify spam/competitors
  - Mark submissions as verified, spam, or processed
  - Add internal notes
  - Track reCAPTCHA scores
- **Location in Sanity**: Click "Quote submissions"

### 2. **Blog Posts** 📝
- **Create**: New blog articles
- **What you can do**:
  - Write blog posts with rich text editor
  - Add images and media
  - Categorize posts
  - Add tags for SEO
  - Set publish dates
  - Create case studies
- **Location in Sanity**: Click "Blogs"

### 3. **Landing Page** 🏠
- **Edit**: Homepage hero section and content
- **What you can do**:
  - Change hero text
  - Update homepage images
  - Modify call-to-action buttons
  - Update statistics/numbers
- **Location in Sanity**: Click "Landing Page"

### 4. **About Page** 👥
- **Edit**: Company information
- **What you can do**:
  - Update company story
  - Add team member information
  - Change about page images
  - Modify mission/vision statements
- **Location in Sanity**: Click "About Page"

### 5. **Services** 🚚
- **Manage**: Service offerings
- **What you can do**:
  - Add new services
  - Edit service descriptions
  - Upload service images
  - Set service pricing (if applicable)
- **Location in Sanity**: Click "Services" or "Services Page"

### 6. **Client Logos** 🏢
- **Manage**: Trusted clients section
- **What you can do**:
  - Upload client company logos
  - Organize by category
  - Show/hide specific logos
- **Location in Sanity**: Click "Client Logos"

### 7. **Reviews/Testimonials** ⭐
- **Manage**: Customer testimonials
- **What you can do**:
  - Add new testimonials
  - Edit existing reviews
  - Set ratings
  - Moderate submitted reviews
- **Location in Sanity**: Click "Reviews" or "Client Reviews"

### 8. **Site Logos & Branding** 🎨
- **Configure**: Site-wide logos
- **What you can do**:
  - Upload header logo
  - Upload footer logo
  - Change favicon
- **Location in Sanity**: Click "Site Logos"

### 9. **Thank You Page** 🎉
- **Edit**: Post-submission message
- **What you can do**:
  - Customize thank you message
  - Update success page content
- **Location in Sanity**: Click "Thank You Message"

### 10. **Categories & Tags** 🏷️
- **Organize**: Blog content
- **What you can do**:
  - Create blog categories
  - Add SEO tags
  - Organize content structure
- **Location in Sanity**: Click "Categories" or "Tags"

---

## 📖 Step-by-Step Guides

### How to View Quote Submissions

1. **Access Sanity Studio** (yourdomain.com/admin)
2. Click **"Quote submissions"** in the left sidebar
3. You'll see a list of all submissions with:
   - Customer name
   - Submission status (pending/verified/spam/processed)
   - IP address
   - Email address
4. **Click on any submission** to view full details:
   - All form fields
   - IP tracking information
   - reCAPTCHA score
   - Timestamp
   - User agent and browser info

**To manage spam:**
- Check the IP address field
- Look for multiple submissions from same IP
- Check reCAPTCHA score (< 0.5 is suspicious)
- Update "Submission Status" to "spam" if confirmed
- Add notes in "Admin Notes" field

### How to Create a Blog Post

1. **Access Sanity Studio**
2. Click **"Blogs"** in left sidebar
3. Click **"+ Create"** button (top right)
4. Fill in the fields:
   - **Blog Title**: Your post headline
   - **Slug**: URL-friendly version (auto-generated)
   - **Blog Excerpt**: Short summary (for preview cards)
   - **Blog Content**: Main article content
   - **Featured Image**: Upload main image
   - **Categories**: Select relevant categories
   - **Tags**: Add SEO tags
   - **Date**: Publish date
5. Click **"Publish"** when ready

**Tips:**
- Use clear, descriptive titles
- Add images to break up text
- Use categories like "Moving Tips", "Case Studies", etc.
- Add relevant tags for SEO

### How to Update Homepage Content

1. **Access Sanity Studio**
2. Click **"Landing Page"** in left sidebar
3. Click on the existing landing page entry
4. **Edit sections**:
   - Hero text and descriptions
   - Call-to-action button text
   - Homepage images
   - Statistics/counters
5. Click **"Publish"** to save changes

**Note**: Changes appear on website within 1 hour (due to caching)

### How to Add a Client Logo

1. **Access Sanity Studio**
2. Click **"Client Logos"** in left sidebar
3. Click **"+ Create"**
4. Fill in:
   - **Client Name**: Company name
   - **Logo Image**: Upload PNG/SVG (transparent background preferred)
   - **Category**: Select industry category
   - **Display Order**: Set priority (lower = appears first)
5. Click **"Publish"**

**Best practices:**
- Use high-quality logos (PNG or SVG)
- Ensure transparent backgrounds
- Keep file sizes under 500KB
- Use consistent sizing (logos auto-resize)

### How to Manage Testimonials

1. **Access Sanity Studio**
2. Click **"Client Reviews"** or **"Reviews"**
3. To add new:
   - Click **"+ Create"**
   - Enter customer name
   - Add review text
   - Set star rating
   - Upload customer photo (optional)
   - Set sentiment (positive/neutral/negative)
4. Click **"Publish"**

### How to Change Site Logos

1. **Access Sanity Studio**
2. Click **"Site Logos"** in left sidebar
3. Click on the existing entry (or create new)
4. Upload:
   - **Header Logo**: Appears in navigation (recommended: 200x60px)
   - **Footer Logo**: Appears in footer
   - **Favicon**: Browser tab icon (recommended: 32x32px)
5. Click **"Publish"**

**Note**: Logo changes may take up to 1 hour to appear site-wide

---

## 🎯 Common Tasks

### Daily/Weekly Tasks:
- ✅ Check new quote submissions
- ✅ Mark spam submissions
- ✅ Respond to customer quotes (via email/phone)
- ✅ Review new testimonials

### Monthly Tasks:
- ✅ Publish new blog posts
- ✅ Update service descriptions
- ✅ Add new client logos
- ✅ Review analytics in Sanity

### As Needed:
- ✅ Update pricing
- ✅ Change seasonal promotions
- ✅ Update contact information
- ✅ Modify homepage content

---

## 🔍 Understanding Quote Submissions

### Submission Fields Explained:

**Customer Information:**
- **First Name**: Customer's full name
- **Email**: Contact email
- **Phone Number**: Contact phone
- **Current Location**: Where they're moving from
- **Destination Location**: Where they're moving to
- **Move Type**: Local/International/Business
- **Bedrooms**: Number of bedrooms (for house moves)
- **Move Date**: Preferred moving date
- **Referrals**: How they heard about you

**Spam Detection Fields:**
- **IP Address**: Customer's internet address
  - Multiple quotes from same IP = suspicious
- **reCAPTCHA Score**: Bot detection score
  - 1.0 = definitely human
  - 0.5 = maybe bot
  - 0.0 = definitely bot
- **Submission Status**: Your classification
  - Pending (new, not reviewed)
  - Verified (legitimate customer)
  - Spam (bot or competitor)
  - Processed (quote already handled)

**Technical Information:**
- **IP Details**: Full IP tracking data
- **User Agent**: Customer's browser info
- **Geolocation**: Country/city (if available)
- **Submitted At**: Exact timestamp
- **Email Sent**: Whether email notification worked
- **SMS Sent**: Whether SMS notification worked

---

## 🛡️ Identifying Spam Submissions

### Red Flags:
1. ⚠️ **Multiple submissions from same IP** within minutes
2. ⚠️ **reCAPTCHA score below 0.5**
3. ⚠️ **Generic/fake email addresses** (test@test.com)
4. ⚠️ **Invalid phone numbers** (all zeros, repeated digits)
5. ⚠️ **Unrealistic move dates** (past dates, very far future)
6. ⚠️ **Nonsense names or locations**
7. ⚠️ **Same email submitting repeatedly**

### What to Do:
1. Open the suspicious submission
2. Check IP address and reCAPTCHA score
3. Compare with recent submissions (look for patterns)
4. Change "Submission Status" to **"spam"**
5. Add note explaining why (e.g., "Same IP, low score")
6. Do NOT contact this person
7. Consider blocking the IP if severe

---

## 💡 Best Practices

### Content Writing:
- ✍️ Write clear, customer-friendly content
- 📸 Use high-quality images
- 🔍 Add SEO keywords naturally
- 📱 Keep mobile users in mind
- ✅ Proofread before publishing

### Media Management:
- 📏 Optimize images before upload (compress large files)
- 🎨 Use consistent image styles
- 📐 Recommended dimensions:
  - Hero images: 1920x1080px
  - Blog featured images: 1200x630px
  - Logos: 200x60px (header), vary (footer)
  - Client logos: 300x100px

### Security:
- 🔒 Never share your Sanity login credentials
- 👁️ Monitor quote submissions regularly
- 🚫 Mark spam immediately
- 📝 Keep admin notes for future reference

### Performance:
- ⚡ Don't upload images larger than 2MB
- 🗂️ Delete unused/old content periodically
- 📦 Archive processed quotes (don't delete)

---

## 🆘 Troubleshooting

### "I can't access Sanity Studio"
**Solution**:
1. Check your internet connection
2. Verify the URL: `yourdomain.com/admin`
3. Clear browser cache
4. Try incognito/private mode
5. Contact your developer if still not working

### "My changes don't appear on the website"
**Reason**: Your site uses caching for speed
**Solution**: Wait up to 1 hour for changes to appear
**Quick fix**: Ask developer to clear cache manually

### "I accidentally deleted something"
**Solution**: Sanity has revision history!
1. Click on the document type
2. Look for "History" or "Revisions"
3. Restore previous version
4. Contact developer if you need help

### "Images won't upload"
**Possible causes**:
- File too large (max 10MB)
- Wrong file format (use JPG, PNG, SVG)
- Slow internet connection

**Solution**: Compress image first using tools like TinyPNG

### "I see duplicate entries"
**Solution**: 
- Check if they're drafts vs published
- Look for "(Draft)" label
- Only one should be published
- Delete drafts after publishing

---

## 📞 Getting Help

### Quick Reference:
- **Sanity Documentation**: https://www.sanity.io/docs
- **Support**: Contact your development team
- **Project ID**: bsg3746e
- **Dataset**: production

### When to Contact Developer:
- Need new content types
- Want to change website structure
- Technical errors in Sanity
- Need advanced features
- Security concerns

---

## 🚀 Quick Start Checklist

After getting Sanity access:

- [ ] Log in successfully
- [ ] View existing quote submissions
- [ ] Mark a test submission as "processed"
- [ ] View blog posts
- [ ] Edit a blog post (save as draft first)
- [ ] Upload a test image
- [ ] View client logos
- [ ] Check site settings
- [ ] Bookmark the admin URL

---

## 📊 Content Strategy Tips

### Blog Content Ideas:
- ✅ Moving tips and checklists
- ✅ Case studies of successful moves
- ✅ International moving guides
- ✅ Packing advice
- ✅ Customer success stories
- ✅ Seasonal moving tips
- ✅ Industry news and updates

### SEO Best Practices:
- Use relevant keywords in titles
- Write descriptive meta descriptions
- Add alt text to images
- Internal link to other pages
- Regular content updates (aim for 2-4 posts/month)

---

## 🔐 Security & Privacy

### Important Notes:
- Quote submissions contain **personal information**
- IP addresses are **sensitive data**
- Treat all customer data as **confidential**
- Only authorized staff should access Sanity
- Never share submission details publicly
- Follow data protection regulations (GDPR, etc.)

### Data Retention:
- Keep verified quotes indefinitely (for business records)
- Archive spam after 30 days
- Processed quotes: Keep for at least 1 year
- Blog posts: Keep published
- Images: Remove unused after 6 months

---

**Last Updated**: 2025-10-11  
**For**: Taylor Movers Website Management  
**Sanity Studio**: taylorea.com/admin
