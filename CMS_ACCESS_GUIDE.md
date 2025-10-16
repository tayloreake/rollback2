# CMS Access Guide - Taylor Movers Website

## 🎯 Production CMS Access

Once deployed, users can access the Sanity CMS at:

**Production URL:** https://taylorea.com/admin

**Local Development:** http://localhost:3002/admin

---

## 🚀 Deployment Steps

### 1. Push Changes to Production

The changes have been committed to the `ace` branch. To deploy to production:

```bash
# Push to the ace branch (which is your production branch)
git push origin ace
```

Vercel will automatically detect the changes and deploy them.

### 2. Verify Deployment

After Vercel completes the deployment (usually 2-5 minutes):

1. Visit: **https://taylorea.com/admin**
2. You should see the Sanity Studio login screen
3. Log in with your Sanity credentials

---

## 🔐 Authentication

The CMS uses Sanity's authentication system. Users need:

1. **Sanity Account**: Must have access to the project `bsg3746e`
2. **Project Permissions**: Must be added as a member of the Sanity project

### How to Add New CMS Users:

1. Go to https://sanity.io/manage
2. Select project "Taylor Website" (ID: bsg3746e)
3. Click "Members" in the sidebar
4. Click "Invite members"
5. Enter the user's email
6. Assign appropriate role (Administrator, Editor, or Viewer)

---

## ✅ What Was Fixed

### 1. **Admin Route Created**
   - New page at `/pages/admin/[[...index]].js`
   - Renders Sanity Studio without the main site layout
   - Supports all Sanity Studio internal routing

### 2. **Layout Exclusion**
   - Admin routes bypass the main Layout component
   - Prevents navbar/footer from appearing in CMS
   - Avoids routing conflicts

### 3. **Security Headers Updated**
   - Removed `X-Frame-Options: DENY` from `/admin` routes
   - Sanity Studio requires iframes to function
   - All other routes still protected with `X-Frame-Options: DENY`

### 4. **Configuration Updates**
   - `next.config.js`: Updated headers for admin routes
   - `vercel.json`: Updated headers for production deployment
   - `_app.js`: Added conditional layout rendering
   - `_document.js`: Fixed viewport meta tag warning

---

## 📋 CMS Features Available

Once logged in at `/admin`, users can manage:

1. **Quote Submissions** - View and manage customer quote requests
2. **Blog Posts** - Create, edit, and publish blog articles
3. **Services** - Manage service offerings and descriptions
4. **Client Logos** - Upload and organize client company logos
5. **Reviews/Testimonials** - Add and moderate customer reviews
6. **Landing Page Content** - Edit homepage hero section
7. **About Page** - Update company information
8. **Site Settings** - Configure logos, thank you messages, etc.
9. **IP Blacklist** - Manage blocked IP addresses for spam prevention

---

## 🔍 Troubleshooting

### Issue: "Cannot access /admin"

**Solution:**
- Ensure the changes are deployed to production
- Check that Vercel deployment completed successfully
- Clear browser cache and try again

### Issue: "Sanity Studio not loading / blank page"

**Solution:**
- Check browser console for errors
- Verify environment variables are set in Vercel:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID=bsg3746e`
  - `NEXT_PUBLIC_SANITY_DATASET=production`
  - `NEXT_SANITY_API_TOKEN=<your-token>`

### Issue: "Access denied / Authentication failed"

**Solution:**
- Verify you have a Sanity account at sanity.io
- Check you're added as a member of project `bsg3746e`
- Try logging out and back in at sanity.io

### Issue: "X-Frame-Options blocking content"

**Solution:**
- This should be fixed with the new deployment
- If still occurring, check that both `next.config.js` and `vercel.json` are deployed
- Verify headers are correctly configured in Vercel dashboard

---

## 🌐 Environment Variables

Ensure these are set in Vercel (Project Settings → Environment Variables):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=bsg3746e
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_SANITY_API_TOKEN=skOIZWPqgTE6cFwT6u3RQ3r9f1eHfJ7CC1l29wlRsK0YyO21iUCuiZNuezGwIfNv7SHWq1vIxuYidCJJ06Xm140oeKv4Cp5zPaWc5ybkvJVczRsFH4mISePmqhDNqqiuOb3qhIRstZOeWfp2VVD7bg7xQlIovICLVHEKNNFoBQxEBM3u5fDH
```

These should already be configured based on your `.env` file.

---

## 📊 Monitoring

### Check Deployment Status

Visit Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select "Taylor Website" project
3. View deployment logs and status

### Verify CMS Functionality

1. Visit https://taylorea.com/admin
2. Log in successfully
3. Navigate through different content types
4. Make a test edit (optional)
5. Verify changes appear in the CMS

---

## 🔄 Rollback Plan

If issues occur after deployment:

```bash
# Revert to previous commit
git revert HEAD
git push origin ace
```

Vercel will automatically deploy the reverted version.

---

## 📞 Support

For Sanity-specific issues:
- Sanity Documentation: https://www.sanity.io/docs
- Sanity Support: https://www.sanity.io/help

For deployment issues:
- Vercel Documentation: https://vercel.com/docs
- Check deployment logs in Vercel dashboard

---

## ✨ Summary

**Local Access:** http://localhost:3002/admin  
**Production Access:** https://taylorea.com/admin  
**Project ID:** bsg3746e  
**Dataset:** production  

The CMS is now fully functional and accessible. Once deployed, all authorized users can manage website content through the Sanity Studio interface.

---

**Last Updated:** 2025-10-16  
**Version:** 1.0  
**Branch:** ace (production)
