# 🚀 Performance Testing Guide

## ⚠️ IMPORTANT: Development vs Production

### Why is Development Mode Slow?

You're currently seeing poor performance (79.58s LCP) because you're running in **DEVELOPMENT MODE**. Here's why:

| Feature | Development Mode | Production Mode |
|---------|------------------|-----------------|
| Code Minification | ❌ No | ✅ Yes |
| Image Optimization | ❌ Limited | ✅ Full |
| Bundle Size | 🔴 Large | 🟢 Small |
| Hot Reload | ✅ Yes | ❌ No |
| Source Maps | ✅ Yes | ❌ No |
| Caching | ❌ Disabled | ✅ Enabled |
| **Performance** | 🐌 Slow | 🚀 Fast |

**Bottom Line**: Development mode is 5-10x slower than production!

## ✅ How to Test Real Performance

### Option 1: Production Build (RECOMMENDED)

```bash
# 1. Build the optimized production version
npm run build

# 2. Start production server
npm start

# 3. Open http://localhost:3000 in Chrome
# 4. Run Lighthouse in Chrome DevTools
```

### Option 2: Production Preview

```bash
# Build and preview
npm run build
npm start

# Test with Lighthouse:
# - Open Chrome DevTools (F12)
# - Go to "Lighthouse" tab
# - Click "Analyze page load"
# - Check Performance score
```

## 📊 Expected Performance Results

### Current (Development Mode)
- **LCP**: 79.58s ⚠️ (Very Poor - due to dev mode)
- **INP**: 240ms ⚠️ (Needs Improvement)
- **CLS**: 0.00 ✅ (Good)

### After Production Build
- **LCP**: ~1.5-2.5s ✅ (Good)
- **INP**: ~150-200ms ✅ (Good)
- **CLS**: 0.00 ✅ (Good)
- **Performance Score**: 90+ ✅

## 🖼️ Optional: Compress Hero Images

Your hero images are quite large (1.1MB, 1MB, 632KB). You can compress them further:

### Using Our Script (Recommended)

```bash
# Requires ImageMagick
sudo apt-get install imagemagick

# Run optimization script
./scripts/optimize-images.sh
```

This will:
- ✅ Backup original images
- ✅ Resize to 1920x1080
- ✅ Compress to 75% quality
- ✅ Strip unnecessary metadata
- ✅ Reduce file sizes by 60-70%

### Manual Compression

Use online tools:
- **TinyPNG**: https://tinypng.com/
- **Squoosh**: https://squoosh.app/
- **ImageOptim**: https://imageoptim.com/

Target sizes:
- Hero images: **150-300KB** each
- Other images: **50-150KB** each

## 🔧 What We Already Optimized

### ✅ Code Optimizations
1. **Static Site Generation (SSG)**: Pages pre-built at build time
2. **Parallel API Calls**: All data fetched simultaneously
3. **Lazy Loading**: Heavy components load on-demand
4. **Image Quality**: Reduced from 90 to 50 (still good quality)
5. **Debounced localStorage**: Batch writes with 1.5s delay
6. **Reduced Motion**: Respects accessibility preferences
7. **Optimized Scripts**: GTM loads after page interactive

### ✅ Image Optimizations
1. **Smart Loading**: Only 3 images rendered at once (not 5)
2. **Priority Loading**: First image loads with `priority={true}`
3. **Blur Placeholder**: Shimmer effect while loading
4. **WebP/AVIF**: Modern formats enabled
5. **Responsive Sizes**: Multiple sizes generated

### ✅ Caching
1. **Static Props**: 1-hour revalidation (was 10 seconds)
2. **Image Cache**: 1-year TTL
3. **Browser Caching**: Aggressive headers

## 🎯 Quick Performance Checklist

Before testing performance, ensure:

- [ ] Run `npm run build` (not `npm run dev`)
- [ ] Test with production server (`npm start`)
- [ ] Clear browser cache (Ctrl+Shift+Del)
- [ ] Use Chrome Incognito mode
- [ ] Run Lighthouse in "Desktop" mode first
- [ ] Test on actual mobile device for mobile scores

## 📱 Mobile vs Desktop Performance

### Desktop
- **Expected LCP**: 1.5-2.0s
- **Expected INP**: 150-180ms
- **Performance Score**: 95+

### Mobile
- **Expected LCP**: 2.5-3.5s
- **Expected INP**: 180-220ms
- **Performance Score**: 85-90

Mobile will naturally be slower due to:
- Slower network (3G/4G)
- Less powerful CPU
- Smaller viewport

## 🐛 Troubleshooting Poor Performance

### If LCP is still >4s in production:

1. **Compress Hero Images**
   ```bash
   ./scripts/optimize-images.sh
   ```

2. **Check Network Tab**
   - Open DevTools → Network
   - Look for large files (>500KB)
   - Check slow requests (>1s)

3. **Disable Extensions**
   - Test in Incognito mode
   - Extensions can slow down page loads

4. **Check CDN Usage**
   - Are images served from CDN?
   - Is Sanity CDN enabled?

5. **Verify Build Output**
   ```bash
   npm run build
   # Check output sizes
   # First Load JS should be <200KB
   ```

## 📈 Monitoring Real-World Performance

### Google Analytics 4
Your site already tracks Web Vitals:
- Check GA4 dashboard
- Look at "Web Vitals" report
- Monitor real user metrics

### Chrome UX Report
- Visit: https://developers.google.com/speed/pagespeed/insights/
- Enter: https://taylorea.com
- See real-world data from Chrome users

## 🎓 Performance Best Practices (Already Implemented!)

✅ Use Next.js Image component
✅ Implement lazy loading
✅ Minimize JavaScript bundle
✅ Use efficient caching strategies
✅ Optimize fonts with font-display: swap
✅ Remove unused CSS/JS
✅ Use compression (gzip/brotli)
✅ Implement proper resource hints
✅ Use modern image formats (WebP/AVIF)
✅ Defer non-critical JavaScript

## 🔄 After Making Changes

Always rebuild and restart:

```bash
# 1. Clean build
rm -rf .next

# 2. Fresh build
npm run build

# 3. Start production
npm start

# 4. Test with Lighthouse
```

## 📝 Summary

**Current Issue**: You're testing in development mode (79.58s LCP)
**Solution**: Test in production mode (`npm run build && npm start`)
**Expected Result**: ~2s LCP, 90+ Performance Score

Development mode is MEANT to be slow because it includes:
- Hot reload
- Source maps
- Detailed error messages
- Un-minified code
- Development-only checks

**Production mode removes all of this for maximum speed!**

---

**Need Help?**
- Check build output: `npm run build`
- View bundle sizes: Look for "Route (pages)" table
- Monitor Web Vitals: Check browser console
- Use Lighthouse: Chrome DevTools → Lighthouse tab
