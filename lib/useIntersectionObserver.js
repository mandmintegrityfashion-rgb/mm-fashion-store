/**
 * Hook for Intersection Observer - Detect when elements come into view
 * Used for lazy loading images, data, and components
 */

import { useEffect, useRef, useState } from 'react';

/**
 * useIntersectionObserver Hook
 * Detects when element comes into viewport and triggers callback
 * 
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - When to trigger (0-1, default: 0.1)
 * @param {string} options.rootMargin - Space around root to start loading (default: '50px')
 * @param {boolean} options.once - Only trigger once (default: true)
 * @returns {Object} - { ref, isVisible, hasBeenVisible }
 */
export function useIntersectionObserver(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    once = true,
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);

          // Unobserve after first visibility if once is true
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, once]);

  return { ref, isVisible, hasBeenVisible };
}

/**
 * Hook to lazy load images
 * Loads image when it comes into viewport
 */
export function useLazyImage() {
  const [src, setSrc] = useState(null);
  const [placeholder, setPlaceholder] = useState(null);
  const { ref, isVisible, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.01,
    rootMargin: '100px',
  });

  const loadImage = (imageSrc, placeholderSrc) => {
    setPlaceholder(placeholderSrc);
    if (hasBeenVisible) {
      setSrc(imageSrc);
    }
  };

  useEffect(() => {
    if (isVisible && src === null && placeholder) {
      // Load actual image after a small delay
      const timer = setTimeout(() => {
        setSrc(src || placeholder);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hasBeenVisible]);

  return {
    ref,
    src,
    placeholder,
    loadImage,
    isVisible,
    hasBeenVisible,
  };
}

/**
 * Hook to load content when element becomes visible
 * Used for lazy loading data and components
 */
export function useLazyLoad(callback, options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    once = true,
  } = options;

  const ref = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !isLoaded && !isLoading) {
          setIsLoading(true);
          try {
            await callback();
            setIsLoaded(true);
          } catch (err) {
          } finally {
            setIsLoading(false);
          }

          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [callback, isLoaded, isLoading, threshold, rootMargin, once]);

  return { ref, isLoaded, isLoading };
}

export default useIntersectionObserver;
