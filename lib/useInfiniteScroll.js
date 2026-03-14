/**
 * Infinite Scroll Hook - Automatically load more items when scrolling to bottom
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useInfiniteScroll Hook
 * Handles infinite scroll pagination
 * 
 * @param {Function} fetchMore - Async function to fetch more items
 * @param {Object} options - Configuration options
 * @returns {Object} - { ref, items, isLoading, hasMore, error }
 */
export function useInfiniteScroll(fetchMore, options = {}) {
  const {
    threshold = 100, // pixels from bottom to trigger load
    initialPage = 1,
  } = options;

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const scrollElementRef = useRef(null);
  const observerRef = useRef(null);

  // Fetch more items
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const { items: newItems, hasMore: more } = await fetchMore(page);
      setItems((prev) => [...prev, ...newItems]);
      setHasMore(more);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, fetchMore]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    // Create a sentinel element at bottom
    const sentinelElement = document.createElement('div');
    sentinelElement.id = 'infinite-scroll-sentinel';

    if (scrollElementRef.current) {
      scrollElementRef.current.appendChild(sentinelElement);
    }

    // Create observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    );

    if (sentinelElement) {
      observerRef.current.observe(sentinelElement);
    }

    return () => {
      if (observerRef.current && sentinelElement) {
        observerRef.current.unobserve(sentinelElement);
      }
      if (sentinelElement && sentinelElement.parentNode) {
        sentinelElement.parentNode.removeChild(sentinelElement);
      }
    };
  }, [loadMore, hasMore, isLoading, threshold]);

  return {
    ref: scrollElementRef,
    items,
    isLoading,
    hasMore,
    error,
    loadMore,
  };
}

/**
 * InfiniteScroll Component Wrapper
 * Easy-to-use wrapper around useInfiniteScroll
 */
export function InfiniteScroll({
  fetchMore,
  children,
  isLoading,
  hasMore,
  loadingComponent = <div className="text-center py-4">Loading...</div>,
  endComponent = <div className="text-center py-4 text-gray-500">No more items</div>,
  options = {},
}) {
  const { ref, items, isLoading: internalIsLoading, hasMore: internalHasMore } =
    useInfiniteScroll(fetchMore, options);

  const loading = isLoading !== undefined ? isLoading : internalIsLoading;
  const moreAvailable = hasMore !== undefined ? hasMore : internalHasMore;

  return (
    <div ref={ref}>
      {children(items)}
      {loading && loadingComponent}
      {!moreAvailable && !loading && endComponent}
    </div>
  );
}

export default useInfiniteScroll;
