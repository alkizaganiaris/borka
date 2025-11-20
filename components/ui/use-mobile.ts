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
      // Check if viewport width is within mobile phone range
      // iPhone 12-16 Pro are ~390-402px wide in portrait
      const width = window.innerWidth;
      setIsMobile(width <= MOBILE_PHONE_BREAKPOINT);
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
