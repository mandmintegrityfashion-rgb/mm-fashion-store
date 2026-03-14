/**
 * Custom hook for handling async data fetching with loading, error, and retry states
 * Provides consistent error handling and loading state management across components
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export function useAsyncData(asyncFn, dependencies = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      setError(null);

      // Set timeout for the request
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, 30000); // 30s timeout

      const result = await asyncFn(signal);
      clearTimeout(timeoutId);

      // Only update state if request wasn't aborted
      if (!signal.aborted) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      // Ignore abort errors
      if (err.name === 'AbortError') {
        console.warn('Request was cancelled');
        return;
      }

      console.error('Async data fetch error:', err);
      setError({
        type: err.name || 'FetchError',
        message: err.message || 'Failed to load data',
        status: err.response?.status,
      });
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [asyncFn]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchData();

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  const retry = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    retry,
    isError: !!error,
  };
}
