// React hook for Google Tag Manager integration
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { 
  initGTM, 
  gtmTrackPageView, 
  gtmTrackScrollDepth,
  gtmTrackSectionView 
} from '../utils/gtm';

// Main GTM hook
export const useGTM = () => {
  const router = useRouter();
  const scrollTrackedRef = useRef(new Set());

  useEffect(() => {
    // Initialize GTM
    initGTM();

    // Track initial page view
    const handleRouteChange = (url) => {
      gtmTrackPageView(url, document.title);
      // Reset scroll tracking for new page
      scrollTrackedRef.current.clear();
    };

    // Track current page on mount
    gtmTrackPageView(router.asPath, document.title);

    // Listen for route changes
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return null; // This hook doesn't render anything
};

// Hook for tracking scroll depth
export const useScrollTracking = () => {
  const router = useRouter();
  const scrollTrackedRef = useRef(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      // Track at 25%, 50%, 75%, and 100% intervals
      const milestones = [25, 50, 75, 100];
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !scrollTrackedRef.current.has(milestone)) {
          scrollTrackedRef.current.add(milestone);
          gtmTrackScrollDepth(milestone, router.asPath);
        }
      });
    };

    // Throttle scroll events
    let scrollTimer = null;
    const throttledScroll = () => {
      if (scrollTimer) return;
      scrollTimer = setTimeout(() => {
        handleScroll();
        scrollTimer = null;
      }, 1000); // Track scroll every 1 second max
    };

    window.addEventListener('scroll', throttledScroll);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
    };
  }, [router.asPath]);
};

// Hook for tracking section views with intersection observer
export const useSectionTracking = (sectionName, threshold = 0.5) => {
  const router = useRouter();
  const elementRef = useRef();
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedRef.current) {
            gtmTrackSectionView(sectionName, router.asPath);
            hasTrackedRef.current = true;
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [sectionName, router.asPath, threshold]);

  // Reset tracking when page changes
  useEffect(() => {
    hasTrackedRef.current = false;
  }, [router.asPath]);

  return elementRef;
};

// Hook for form tracking
export const useFormTracking = () => {
  const trackFormStart = (formName) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'form_start',
        form_name: formName,
        timestamp: new Date().toISOString()
      });
    }
  };

  const trackFormError = (formName, fieldName, errorMessage) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'form_error',
        form_name: formName,
        field_name: fieldName,
        error_message: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  };

  const trackFormSuccess = (formName, additionalData = {}) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'form_success',
        form_name: formName,
        ...additionalData,
        timestamp: new Date().toISOString()
      });
    }
  };

  return {
    trackFormStart,
    trackFormError,
    trackFormSuccess
  };
};

export default useGTM;