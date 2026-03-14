/**
 * Code Splitting & Dynamic Imports Utility
 * Split large components and load them on demand
 */

import dynamic from 'next/dynamic';
import React from 'react';

/**
 * Loading fallback component
 */
export const ComponentLoader = ({ component = 'Component' }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-luxuryGreen mb-4" />
      <p className="text-gray-600 text-sm">Loading {component}...</p>
    </div>
  </div>
);

/**
 * Error fallback component
 */
export const ComponentError = ({ error, component = 'Component' }) => (
  <div className="p-8 text-center">
    <p className="text-red-600 font-semibold mb-2">Failed to load {component}</p>
    <p className="text-gray-600 text-sm">{error?.message || 'Unknown error'}</p>
  </div>
);

/**
 * Dynamic import helper with better options
 * @param {Function} importStatement - Dynamic import statement
 * @param {Object} options - Options for loading/error states
 * @returns {React.Component} - Dynamically loaded component
 */
export function lazyComponent(
  importStatement,
  {
    componentName = 'Component',
    loading = true,
    ssr = false,
  } = {}
) {
  return dynamic(importStatement, {
    loading: loading
      ? () => <ComponentLoader component={componentName} />
      : undefined,
    ssr,
  });
}

/**
 * Common lazy-loaded components
 */

// Heavy components that should be code-split
export const LazyCarousel = lazyComponent(
  () => import('@/components/Carousel'),
  { componentName: 'Carousel', ssr: true }
);

export const LazyReviewForm = lazyComponent(
  () => import('@/components/ReviewForm'),
  { componentName: 'Review Form', ssr: false }
);

export const LazyCategoryList = lazyComponent(
  () => import('@/components/CategoryList'),
  { componentName: 'Categories', ssr: true }
);

export const LazyContactForm = lazyComponent(
  () => import('@/components/ContactForm'),
  { componentName: 'Contact Form', ssr: false }
);

export const LazyProductGrid = lazyComponent(
  () => import('@/components/LazyProductGrid'),
  { componentName: 'Product Grid', ssr: true }
);

export const LazyAccountLayout = lazyComponent(
  () => import('@/components/account/AccountLayout'),
  { componentName: 'Account', ssr: false }
);

/**
 * Pre-load a component before it's needed
 * Useful for prefetching on hover or route change
 */
export async function preloadComponent(importStatement) {
  try {
    await importStatement();
  } catch (err) {
  }
}

/**
 * Create a deferred loading component
 * Loads after initial page render
 */
export function createDeferredComponent(importStatement, options = {}) {
  const { delay = 500 } = options;

  return dynamic(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return importStatement();
    },
    {
      loading: () => <ComponentLoader {...options} />,
      ssr: options.ssr ?? false,
    }
  );
}

export default {
  lazyComponent,
  preloadComponent,
  createDeferredComponent,
  ComponentLoader,
  ComponentError,
};
