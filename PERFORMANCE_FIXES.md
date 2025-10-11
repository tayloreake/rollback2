# Performance Optimization Plan

## Critical Issues & Fixes

### 1. Hero Image Slideshow (LCP Issue - Most Important)
**Problem**: Loading 5 full-size images simultaneously
**Impact**: 14.72s LCP

**Solutions**:
```javascript
// Option A: Load only active image + next image
- Preload only the first image
- Lazy load remaining images
- Use lower quality for background (quality={60})

// Option B: Use static hero image
- Replace slideshow with single optimized image
- Add subtle CSS animations instead

// Option C: Progressive loading
- Load thumbnail first (blur placeholder)
- Load full image after interaction
```

**Recommended Fix**:
```jsx
// In AnimatedHero.jsx - Only render 2 images at a time
{taylorMoversImages.map((image, index) => {
  const isActive = index === currentImageIndex;
  const isNext = index === (currentImageIndex + 1) % taylorMoversImages.length;
  
  if (!isActive && !isNext) return null; // Don't render inactive images
  
  return (
    <div key={image.id} className={...}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={index === 0}
        quality={60} // Reduce quality
        loading={index === 0 ? 'eager' : 'lazy'}
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,...`}
      />
    </div>
  );
})}
```

### 2. Server-Side Data Fetching
**Problem**: 7 Sanity queries on every request with 10s cache
**Impact**: Slow Time to First Byte (TTFB)

**Solution**:
```javascript
// In pages/index.js
export async function getStaticProps() { // Change to getStaticProps
  const [landingPage, reviews, clients, siteLogos, landingServices, landingAbout, clientCategories] = 
    await Promise.all([ // Parallel fetching
      getLandingPageData(),
      getClientReviews(),
      getClientLogos(),
      getSiteLogos(),
      getLandingServices(),
      getLandingAbout(),
      getClientCategories()
    ]);

  return {
    props: {
      landingPage,
      reviews,
      clients,
      clientCategories,
      siteLogos,
      landingAbout,
      landingServices
    },
    revalidate: 3600 // Revalidate every hour instead of 10 seconds
  }
}
```

### 3. Reduce JavaScript Bundle Size
**Problem**: Heavy animation libraries and unused code
**Impact**: High INP (1,248ms)

**Solutions**:
- Lazy load Framer Motion animations
- Use CSS animations instead where possible
- Code split heavy components
- Remove unused dependencies

```javascript
// Use dynamic imports
const AnimatedHero = dynamic(
  () => import('../components/modern/AnimatedHero'),
  { loading: () => <HeroSkeleton />, ssr: false }
);

const CaseStudies = dynamic(
  () => import('../components/CaseStudies'),
  { loading: () => <div>Loading...</div> }
);
```

### 4. Optimize localStorage Usage
**Problem**: Writing to localStorage on every render
**Impact**: Blocking main thread

**Solution**:
```javascript
// Debounce localStorage writes
import { useEffect, useRef } from 'react';

const useLocalStorageCache = (key, data) => {
  const timeoutRef = useRef();
  
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      if (data && typeof window !== 'undefined') {
        try {
          localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
          console.error('localStorage error:', e);
        }
      }
    }, 1000); // Debounce by 1 second
    
    return () => clearTimeout(timeoutRef.current);
  }, [key, data]);
};
```

### 5. Optimize Animations
**Problem**: Continuous animations blocking interactions
**Impact**: 1,248ms INP

**Solutions**:
- Use CSS animations instead of JS
- Reduce animation complexity
- Use `will-change` CSS property
- Disable animations on low-end devices

```javascript
// Detect low-end devices
const usePrefersReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);
  }, []);
  
  return prefersReduced;
};

// Conditionally disable animations
const shouldAnimate = !usePrefersReducedMotion();
```

### 6. Image Compression
**Action Items**:
1. Compress hero images (use TinyPNG or Squoosh)
2. Convert to WebP/AVIF format
3. Generate multiple sizes for responsive images
4. Use CDN for image delivery

### 7. Remove Blocking Scripts
- Move GTM script to load after page interactive
- Defer non-critical JavaScript
- Use `next/script` with strategy="lazyOnload"

### 8. Database Query Optimization
**In sanity-utils.js**:
```javascript
// Add proper projections to reduce data transfer
export async function getClientReviews() {
  return client.fetch(
    `*[_type == "review" && !(_id in path("drafts.**"))] | order(_createdAt desc) [0...10] {
      _id,
      reviewerName,
      reviewText,
      rating,
      _createdAt
      // Only fetch fields you actually use
    }`
  );
}
```

## Priority Order

1. **CRITICAL**: Optimize hero images (will fix LCP)
2. **HIGH**: Change to getStaticProps with longer cache
3. **HIGH**: Lazy load components below fold
4. **MEDIUM**: Optimize animations
5. **MEDIUM**: Debounce localStorage
6. **LOW**: Code splitting and tree shaking

## Expected Improvements

After implementing these fixes:
- **LCP**: 14.72s → <2.5s (80% improvement)
- **INP**: 1,248ms → <200ms (85% improvement)
- **Bundle Size**: Reduce by 30-40%
- **Initial Load**: 50-60% faster

## Quick Wins (Can implement now)

1. Change quality from 90 to 60 in hero images
2. Add `loading="lazy"` to all below-fold images
3. Increase cache time to 3600 seconds
4. Remove console.log statements in production
