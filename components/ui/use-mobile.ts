import * as React from "react";

// Mobile phone breakpoint: targets iPhone 12-16 Pro (390-402px) and similar phones
// Using 600px max to include phones while excluding tablets (768px+)
const MOBILE_PHONE_BREAKPOINT = 600;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const checkMobile = () => {
      // Check if viewport dimensions indicate a mobile phone
      // Mobile phones have at least one dimension ≤ 600px
      // iPhone 12-16 Pro are ~390-402px wide in portrait, ~844-896px tall
      // When rotated to landscape, width becomes ~844-896px but height becomes ~390-402px
      // So we check both dimensions to maintain mobile detection during rotation
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobilePhone = width <= MOBILE_PHONE_BREAKPOINT || height <= MOBILE_PHONE_BREAKPOINT;
      setIsMobile(isMobilePhone);
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_PHONE_BREAKPOINT}px)`);
    const onChange = () => {
      checkMobile();
    };
    
    // Check orientation changes as well
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    mql.addEventListener("change", onChange);
    
    // Initial check
    checkMobile();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return !!isMobile;
}
