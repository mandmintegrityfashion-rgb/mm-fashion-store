/**
 * API Cache Wrapper - Wraps axios calls with intelligent caching
 * Reduces redundant API calls and improves performance
 */

import axios from 'axios';
import cacheManager from './cacheManager';

/**
 * Cached GET request
 * @param {string} url - API endpoint
 * @param {object} config - Axios config
 * @param {number} cacheTTL - Cache time to live in minutes (default: 5)
 * @returns {Promise} - Response data
 */
export async function cachedGet(url, config = {}, cacheTTL = 5) {
  // Create cache key from URL and params
  const cacheKey = `api_get_${url}_${JSON.stringify(config.params || {})}`;

  // Check cache first
  const cached = cacheManager.get(cacheKey, cacheTTL);
  if (cached) {
    return cached;
  }

  try {
    // Fetch from API
    const response = await axios.get(url, config);
    const data = response.data;

    // Store in cache
    cacheManager.set(cacheKey, data, cacheTTL);

    return data;
  } catch (err) {
    // Return cached data if available, even if expired
    let expiredCache = cacheManager.memoryCache.get(cacheKey);
    if (!expiredCache) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const stored = localStorage.getItem(`cache_${cacheKey}`);
          expiredCache = stored ? JSON.parse(stored).data : null;
        }
      } catch {
        expiredCache = null;
      }
    }
    
    if (expiredCache) {
      // Use stale cache as fallback
      return expiredCache;
    }

    throw err;
  }
}

/**
 * Cached POST request (typically not cached, but can be for specific cases)
 * @param {string} url - API endpoint
 * @param {object} data - Request body
 * @param {object} config - Axios config
 * @returns {Promise} - Response data
 */
export async function cachedPost(url, data, config = {}) {
  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (err) {
    throw err;
  }
}

/**
 * Pre-fetch and cache data
 * @param {string} url - API endpoint
 * @param {object} config - Axios config
 * @param {number} cacheTTL - Cache time to live in minutes
 */
export async function prefetchAndCache(url, config = {}, cacheTTL = 5) {
  try {
    await cachedGet(url, config, cacheTTL);
  } catch (err) {
    // Prefetch failed - silently continue
  }
}

/**
 * Invalidate cache for a specific endpoint pattern
 * @param {string} pattern - Pattern to match in cache keys
 */
export function invalidateCache(pattern) {
  cacheManager.clearPattern(pattern);
}

export default {
  cachedGet,
  cachedPost,
  prefetchAndCache,
  invalidateCache,
};
