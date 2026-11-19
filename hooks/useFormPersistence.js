import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for persisting form data to localStorage
 * @param {string} formKey - Unique key to identify the form in localStorage
 * @param {Object} initialData - Initial form data structure
 * @param {number} debounceMs - Debounce time for auto-save (default: 1000ms)
 * @returns {Object} - { formData, updateFormData, clearFormData, hasPersistedData }
 */
export function useFormPersistence(formKey, initialData, debounceMs = 1000) {
  const [formData, setFormData] = useState(initialData);
  const [hasPersistedData, setHasPersistedData] = useState(false);
  const saveTimeoutRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Load persisted data on mount - only run once
  useEffect(() => {
    if (typeof window === 'undefined' || isInitializedRef.current) return;

    try {
      const savedData = localStorage.getItem(`quoteForm_${formKey}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Validate that the saved data has the same structure
        const isValidData = Object.keys(initialData).every(key => 
          parsedData.hasOwnProperty(key)
        );

        if (isValidData) {
          setFormData(parsedData);
          setHasPersistedData(true);
        } else {
          // Clean up invalid data
          localStorage.removeItem(`quoteForm_${formKey}`);
        }
      }
      isInitializedRef.current = true;
    } catch (error) {
      console.error('Error loading persisted form data:', error);
      // Clean up corrupted data
      try {
        localStorage.removeItem(`quoteForm_${formKey}`);
      } catch (cleanupError) {
        console.error('Error cleaning up corrupted form data:', cleanupError);
      }
      isInitializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formKey]);

  // Debounced save function
  const saveToStorage = useCallback((data) => {
    if (!isInitializedRef.current || typeof window === 'undefined') return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(() => {
      try {
        // Only save if data has meaningful content (not just empty fields)
        const hasContent = Object.values(data).some(value => 
          value && value.toString().trim().length > 0
        );

        if (hasContent) {
          localStorage.setItem(`quoteForm_${formKey}`, JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error saving form data to localStorage:', error);
      }
    }, debounceMs);
  }, [formKey, debounceMs]);

  // Update form data with persistence
  const updateFormData = useCallback((field, value) => {
    setFormData(prevData => {
      // Only update if value actually changed
      if (prevData[field] === value) {
        return prevData;
      }

      const newData = {
        ...prevData,
        [field]: value
      };

      // Save to localStorage (async, won't block state update)
      if (isInitializedRef.current) {
        saveToStorage(newData);
      }

      return newData;
    });
  }, [saveToStorage]);

  // Clear form data from both state and localStorage
  const clearFormData = useCallback(() => {
    setFormData(initialData);
    setHasPersistedData(false);
    
    // Clear timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Remove from localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`quoteForm_${formKey}`);
      } catch (error) {
        console.error('Error clearing form data from localStorage:', error);
      }
    }
  }, [formKey, initialData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Reset form data to initial values (but keep in localStorage)
  const resetForm = useCallback(() => {
    setFormData(initialData);
  }, [initialData]);

  // Get specific field value
  const getFieldValue = useCallback((field) => {
    return formData[field] || '';
  }, [formData]);

  // Check if form has any data
  const hasFormData = useCallback(() => {
    return Object.values(formData).some(value => 
      value && value.toString().trim().length > 0
    );
  }, [formData]);

  return {
    formData,
    updateFormData,
    clearFormData,
    resetForm,
    hasPersistedData,
    hasFormData,
    getFieldValue
  };
}

export default useFormPersistence;