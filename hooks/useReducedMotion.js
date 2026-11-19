import { useState, useEffect } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * Respects accessibility preferences and improves performance on low-end devices
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window === 'undefined') return;

    // Check for prefers-reduced-motion media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook to get animation config based on user preference
 * Returns simplified animations if user prefers reduced motion
 */
export const useAnimationConfig = () => {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion,
    // Disable or simplify animations
    shouldAnimate: !prefersReducedMotion,
    // Reduce animation duration
    duration: prefersReducedMotion ? 0.1 : 1,
    // Simplify spring animations
    spring: prefersReducedMotion 
      ? { type: "tween", duration: 0.1 }
      : { type: "spring", stiffness: 100, damping: 15 },
  };
};
