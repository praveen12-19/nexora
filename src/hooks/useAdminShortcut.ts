import { useEffect, useState, useCallback, useRef } from 'react';

interface UseAdminShortcutReturn {
  isOpen: boolean;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  handleMobileLogoTap: () => void;
}

/**
 * Hook for hidden admin access:
 * - Desktop: Ctrl + Shift + A (or Cmd + Shift + A)
 * - Mobile: 5 rapid taps on the brand logo within 3 seconds
 */
export function useAdminShortcut(): UseAdminShortcutReturn {
  const [isOpen, setIsOpen] = useState(false);
  const tapTimesRef = useRef<number[]>([]);

  const openAdminModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeAdminModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Desktop keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl + Shift + A or Cmd + Shift + A
      const isModifierActive = event.ctrlKey || event.metaKey;
      if (isModifierActive && event.shiftKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mobile secret logo tap gesture
  const handleMobileLogoTap = useCallback(() => {
    const now = Date.now();
    // Keep taps from the last 3000ms
    tapTimesRef.current = [...tapTimesRef.current.filter((t) => now - t < 3000), now];

    // If 5 taps within 3 seconds
    if (tapTimesRef.current.length >= 5) {
      tapTimesRef.current = [];
      setIsOpen(true);
    }
  }, []);

  return {
    isOpen,
    openAdminModal,
    closeAdminModal,
    handleMobileLogoTap,
  };
}
