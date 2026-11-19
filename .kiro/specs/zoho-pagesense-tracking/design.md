# Design Document

## Overview

This design implements Zoho PageSense visitor tracking integration for the Taylor Movers Next.js application. The solution will add the PageSense tracking script to collect visitor metrics while maintaining optimal performance and following Next.js best practices.

The implementation leverages Next.js's built-in Script component for optimal loading performance and integrates seamlessly with the existing Google Analytics and GTM tracking infrastructure.

## Architecture

### Integration Points
- **Next.js Document**: Add DNS prefetch for PageSense CDN in `_document.js`
- **Next.js App**: Integrate PageSense script in `_app.js` alongside existing tracking
- **Environment Configuration**: Support for environment-based tracking control
- **Performance Optimization**: Async loading with proper loading strategy

### Loading Strategy
The PageSense script will use Next.js's `afterInteractive` strategy to ensure:
- Script loads after the page becomes interactive
- No blocking of critical rendering path
- Proper integration with existing tracking scripts

## Components and Interfaces

### 1. Script Integration Component
**Location**: `pages/_app.js`
**Purpose**: Load PageSense tracking script with optimal performance

```javascript
// PageSense Script Integration
<Script
  src="https://cdn.pagesense.io/js/taylorsolutions/9c8c7528274e4f4b978c2486a52f8634.js"
  strategy="afterInteractive"
  id="pagesense-tracking"
/>
```

### 2. DNS Prefetch Optimization
**Location**: `pages/_document.js`
**Purpose**: Improve script loading performance

```javascript
<link rel="dns-prefetch" href="https://cdn.pagesense.io" />
<link rel="preconnect" href="https://cdn.pagesense.io" crossOrigin="anonymous" />
```

### 3. Configuration Management
**Location**: Environment variables or configuration file
**Purpose**: Enable/disable tracking and manage settings

```javascript
const PAGESENSE_ENABLED = process.env.NEXT_PUBLIC_PAGESENSE_ENABLED !== 'false'
const PAGESENSE_SCRIPT_ID = process.env.NEXT_PUBLIC_PAGESENSE_SCRIPT_ID || '9c8c7528274e4f4b978c2486a52f8634'
```

## Data Models

### Environment Variables
```
NEXT_PUBLIC_PAGESENSE_ENABLED=true
NEXT_PUBLIC_PAGESENSE_SCRIPT_ID=9c8c7528274e4f4b978c2486a52f8634
```

### Script Configuration Object
```javascript
const pagesensetConfig = {
  enabled: boolean,
  scriptId: string,
  domain: 'taylorsolutions',
  cdnUrl: 'https://cdn.pagesense.io/js'
}
```

## Error Handling

### Script Loading Failures
- **Graceful Degradation**: Website continues to function if PageSense fails to load
- **Error Logging**: Log script loading errors for debugging
- **Fallback Behavior**: No impact on user experience if tracking fails

### Implementation Strategy
```javascript
<Script
  src={pagesensetScriptUrl}
  strategy="afterInteractive"
  onError={(e) => {
    console.warn('PageSense tracking script failed to load:', e)
  }}
  onLoad={() => {
    console.log('PageSense tracking initialized')
  }}
/>
```

### Network and Performance Considerations
- **Timeout Handling**: Script loading timeout won't affect page functionality
- **CDN Fallback**: Primary CDN failure handled gracefully
- **Performance Monitoring**: Track script loading impact on Core Web Vitals

## Testing Strategy

### Unit Testing
- Test configuration loading and validation
- Test conditional script rendering based on environment
- Test error handling for script loading failures

### Integration Testing
- Verify script loads correctly in different environments
- Test interaction with existing Google Analytics/GTM tracking
- Validate DNS prefetch and preconnect optimizations

### Performance Testing
- Measure impact on Core Web Vitals (LCP, FID, CLS)
- Test script loading in various network conditions
- Validate async loading doesn't block page rendering

### Manual Testing Checklist
- [ ] Script loads on all pages (public and admin routes)
- [ ] No console errors related to PageSense
- [ ] Page performance remains optimal
- [ ] Tracking data appears in PageSense dashboard
- [ ] Script respects environment configuration
- [ ] Graceful handling when script fails to load

## Implementation Considerations

### Performance Optimization
- Use `afterInteractive` loading strategy for optimal performance
- Add DNS prefetch to reduce connection time
- Implement proper error boundaries to prevent tracking failures from affecting UX

### Privacy and Compliance
- Ensure tracking respects user privacy preferences
- Consider GDPR/CCPA compliance requirements
- Implement tracking consent management if required

### Maintenance and Monitoring
- Centralized configuration for easy updates
- Environment-based enabling/disabling
- Logging for troubleshooting and monitoring
- Documentation for future maintenance

### Integration with Existing Analytics
- Coordinate with existing Google Analytics and GTM implementations
- Ensure no conflicts between tracking systems
- Maintain consistent data collection patterns