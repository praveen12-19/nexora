import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';

export function useVisitorTracking() {
  const location = useLocation();
  const lastPathRef = useRef<string>('');

  useEffect(() => {
    // If admin is active or device is an admin device, completely skip page view tracking
    if (analyticsService.isAdminActive()) {
      return;
    }

    const currentPath = location.pathname + location.search;

    // Prevent duplicate firing on same URL
    if (lastPathRef.current !== currentPath) {
      lastPathRef.current = currentPath;
      analyticsService.trackEvent('page_view').catch((err) => {
        console.warn('Page view tracking failed:', err);
      });
    }
  }, [location]);
}
