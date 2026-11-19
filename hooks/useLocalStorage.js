import { useEffect, useRef } from 'react';

/**
 * Custom hook to debounce localStorage writes
 * Prevents blocking the main thread with frequent writes
 */
export const useLocalStorageCache = (key, data, delay = 1000) => {
  const timeoutRef = useRef();
  
  useEffect(() => {
    // Don't run on server
    if (typeof window === 'undefined' || !data) return;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Debounce the write
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        // Handle quota exceeded or other errors gracefully
        if (error.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded');
        } else {
          console.error('localStorage error:', error);
        }
      }
    }, delay);
    
    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [key, data, delay]);
};

/**
 * Hook to write multiple items to localStorage efficiently
 */
export const useBatchLocalStorage = (items, delay = 1000) => {
  const timeoutRef = useRef();
  
  useEffect(() => {
    if (typeof window === 'undefined' || !items || Object.keys(items).length === 0) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      try {
        Object.entries(items).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            localStorage.setItem(key, JSON.stringify(value));
          }
        });
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded');
        } else {
          console.error('localStorage error:', error);
        }
      }
    }, delay);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [items, delay]);
};
