/**
 * Service Worker for Chioma Hair
 * Minimal - only handles offline support
 * Caching is disabled to use direct DB processing
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `chioma-hair-${CACHE_VERSION}`;

// Install event - skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

// Activate event - claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch event - pass through to network, no caching
self.addEventListener('fetch', (event) => {
  // Just pass through all requests
  // No caching - direct database processing enabled
});
