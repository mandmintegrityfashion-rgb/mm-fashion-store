/**
 * Cache Manager - Handles all caching logic for API responses and data
 * Supports both memory cache and localStorage with TTL
 */

class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.cacheTimestamps = new Map();
  }

  /**
   * Get item from cache (memory first, then localStorage)
   * @param {string} key - Cache key
   * @param {number} ttlMinutes - Time to live in minutes
   * @returns {any} - Cached value or null
   */
  get(key, ttlMinutes = 5) {
    // Check memory cache first
    if (this.memoryCache.has(key)) {
      const timestamp = this.cacheTimestamps.get(key);
      const now = Date.now();
      
      if (now - timestamp < ttlMinutes * 60 * 1000) {
        return this.memoryCache.get(key);
      } else {
        // Expired
        this.memoryCache.delete(key);
        this.cacheTimestamps.delete(key);
      }
    }

    // Check localStorage
    try {
      if (typeof window === 'undefined' || !window.localStorage) throw new Error('no-localstorage');
      const stored = localStorage.getItem(`cache_${key}`);
      if (stored) {
        const { data, timestamp } = JSON.parse(stored);
        const now = Date.now();
        
        if (now - timestamp < ttlMinutes * 60 * 1000) {
          // Store in memory for faster access next time
          this.memoryCache.set(key, data);
          this.cacheTimestamps.set(key, timestamp);
          return data;
        } else {
          // Expired
          localStorage.removeItem(`cache_${key}`);
        }
      }
    } catch (err) {
      // localStorage access failed or not available (server); silently continue
    }

    return null;
  }

  /**
   * Set item in cache (both memory and localStorage)
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttlMinutes - Time to live in minutes
   */
  set(key, value, ttlMinutes = 5) {
    const timestamp = Date.now();
    
    // Store in memory
    this.memoryCache.set(key, value);
    this.cacheTimestamps.set(key, timestamp);

    // Store in localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(
          `cache_${key}`,
          JSON.stringify({ data: value, timestamp })
        );
      }
    } catch (err) {
      // localStorage write failed or not available - silently continue
    }
  }

  /**
   * Clear specific cache key
   * @param {string} key - Cache key to clear
   */
  clear(key) {
    this.memoryCache.delete(key);
    this.cacheTimestamps.delete(key);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(`cache_${key}`);
      }
    } catch (err) {
      // localStorage removal failed or not available - silently continue
    }
  }

  /**
   * Clear all cache entries matching a pattern
   * @param {string} pattern - Pattern to match (e.g., "products_" will clear all keys starting with "products_")
   */
  clearPattern(pattern) {
    // Clear memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
        this.cacheTimestamps.delete(key);
      }
    }

    // Clear localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.includes(`cache_${pattern}`)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
    } catch (err) {
      // localStorage pattern clear failed or not available - silently continue
    }
  }

  /**
   * Clear all cache
   */
  clearAll() {
    this.memoryCache.clear();
    this.cacheTimestamps.clear();
    
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith('cache_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
    } catch (err) {
      // localStorage clear all failed or not available - silently continue
    }
  }

  /**
   * Get cache statistics
   * @returns {object} - Cache stats
   */
  getStats() {
    return {
      memoryCacheSize: this.memoryCache.size,
      cacheKeys: Array.from(this.memoryCache.keys()),
    };
  }
}

// Create singleton instance
const cacheManager = new CacheManager();

export default cacheManager;
