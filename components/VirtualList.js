/**
 * Virtual List Component - Efficient rendering of large lists
 * Only renders visible items to improve performance
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * VirtualList Component
 * Renders only visible items based on scroll position
 * 
 * Props:
 * - items: Array of items to render
 * - itemHeight: Height of each item (or function to get height)
 * - renderItem: Function to render each item
 * - containerHeight: Height of container
 * - overscan: Number of items to render outside viewport (default: 3)
 * - onLoadMore: Callback when near bottom (for infinite scroll)
 */
export function VirtualList({
  items = [],
  itemHeight = 200,
  renderItem,
  containerHeight = 800,
  overscan = 3,
  onLoadMore,
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  // Calculate which items are visible
  const getVisibleRange = useCallback(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const { startIndex, endIndex } = getVisibleRange();
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;
  const totalHeight = items.length * itemHeight;

  // Handle scroll
  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);

    // Trigger load more when near bottom
    if (onLoadMore) {
      const scrollPercentage = (newScrollTop + containerHeight) / totalHeight;
      if (scrollPercentage > 0.8) {
        onLoadMore();
      }
    }
  }, [containerHeight, totalHeight, onLoadMore]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      }}
      className="scroll-smooth"
    >
      <div
        ref={contentRef}
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: offsetY + index * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualList;
