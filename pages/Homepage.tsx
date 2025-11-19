import { useState, useRef } from "react";
import CircularText, { type CircularTextRef } from "../components/CircularText";
import { AnimatePresence, motion } from "motion/react";
import { useIsMobile } from "../components/ui/use-mobile";

interface HomepageProps {
  isDarkMode: boolean;
}

export function Homepage({ isDarkMode }: HomepageProps) {
  const [isCircularTextVisible, setIsCircularTextVisible] = useState(false);
  const circularTextRef = useRef<CircularTextRef>(null);
  const isMobile = useIsMobile();

  // Calculate responsive sizes
  const containerSize = isMobile ? '80vw' : 'min(600px, 90vw)';
  const logoSize = isMobile ? '80vw' : 'min(600px, 90vw)';
  const circularSize = isMobile ? 320 : 600;
  const fontSize = isMobile ? 'text-2xl' : 'text-5xl';

  const handleLogoHover = () => {
    setIsCircularTextVisible(true);
    if (circularTextRef.current) {
      circularTextRef.current.slowDown();
    }
  };

  const handleLogoLeave = () => {
    setIsCircularTextVisible(false);
    if (circularTextRef.current) {
      circularTextRef.current.resume();
    }
  };

  // Handle touch for mobile
  const handleTouchStart = () => {
    if (isMobile) {
      setIsCircularTextVisible(true);
      if (circularTextRef.current) {
        circularTextRef.current.slowDown();
      }
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      // Small delay before hiding on mobile for better UX
      setTimeout(() => {
        setIsCircularTextVisible(false);
        if (circularTextRef.current) {
          circularTextRef.current.resume();
        }
      }, 2000);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center px-4">
      <div 
        className="relative flex items-center justify-center"
        style={{ 
          width: containerSize, 
          height: containerSize,
          maxWidth: '600px',
          maxHeight: '600px'
        }}
      >
        {/* Circular text around the logo - only this toggles */}
        <AnimatePresence>
          {isCircularTextVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pointer-events-none z-0"
              style={{ 
                width: isMobile ? '80vw' : '600px', 
                height: isMobile ? '80vw' : '600px',
                maxWidth: '600px',
                maxHeight: '600px'
              }}
            >
              <CircularText
                ref={circularTextRef}
                text="BORBALA * KUN * "
                spinDuration={30}
                onHover="slowDown"
                size={circularSize}
                fontSize={fontSize}
                fontFamily="Montserrat"
                className={isDarkMode ? "text-black" : "text-black"}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Logo in the center - always visible */}
        <img 
          src={isDarkMode ? "/media/boku_home.svg" : "/media/boku_home.svg"} 
          alt="BOKU" 
          className="relative max-h-full max-w-full object-contain cursor-pointer z-20 w-full h-auto"
          style={{ 
            width: logoSize,
            height: 'auto',
            maxWidth: '600px',
            pointerEvents: 'auto' 
          }}
          onMouseEnter={handleLogoHover}
          onMouseLeave={handleLogoLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    </div>
  );
}
