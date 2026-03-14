/**
 * Hook to register and manage Service Worker
 */

import { useEffect, useState } from 'react';

export function useServiceWorker() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Service worker disabled for now - using direct DB processing
    // This will prevent caching and ensure fresh data from database
    setIsRegistered(false);
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isRegistered,
    isOnline,
  };
}
