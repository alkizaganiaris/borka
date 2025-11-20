import { useEffect, useState } from "react";

export function useTabletOrientationLock() {
  const [showOrientationMessage, setShowOrientationMessage] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Exclude mobile phones (≤600px) - they should work in portrait mode
      const isMobilePhone = window.innerWidth <= 600;
      if (isMobilePhone) {
        setShowOrientationMessage(false);
        return;
      }

      // Check if device is a tablet based on dimensions
      // Tablets typically have width between 768-1025px OR height between 768-1025px
      // (accounting for both portrait and landscape orientations)
      const isTabletWidth = window.innerWidth >= 768 && window.innerWidth <= 1025;
      const isTabletHeight = window.innerHeight >= 768 && window.innerHeight <= 1025;
      const isTablet = isTabletWidth || isTabletHeight;

      if (!isTablet) {
        setShowOrientationMessage(false);
        return;
      }

      // Check if currently in portrait mode
      const isPortrait = window.matchMedia('(orientation: portrait)').matches;
      setShowOrientationMessage(isPortrait);
    };

    // Check on mount
    checkOrientation();

    // Monitor orientation changes
    const portraitMediaQuery = window.matchMedia('(orientation: portrait)');
    const handleOrientationChange = (e: MediaQueryListEvent) => {
      // Exclude mobile phones (≤600px) - they should work in portrait mode
      const isMobilePhone = window.innerWidth <= 600;
      if (isMobilePhone) {
        setShowOrientationMessage(false);
        return;
      }

      const isTabletWidth = window.innerWidth >= 768 && window.innerWidth <= 1025;
      const isTabletHeight = window.innerHeight >= 768 && window.innerHeight <= 1025;
      const isTablet = isTabletWidth || isTabletHeight;
      
      if (isTablet) {
        setShowOrientationMessage(e.matches);
      } else {
        setShowOrientationMessage(false);
      }
    };

    portraitMediaQuery.addEventListener('change', handleOrientationChange);
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      portraitMediaQuery.removeEventListener('change', handleOrientationChange);
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return showOrientationMessage;
}

