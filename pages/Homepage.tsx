import { useState, useRef } from "react";
import CircularText, { type CircularTextRef } from "../components/CircularText";
import { AnimatePresence, motion } from "motion/react";

interface HomepageProps {
  isDarkMode: boolean;
}

export function Homepage({ isDarkMode }: HomepageProps) {
  const [isCircularTextVisible, setIsCircularTextVisible] = useState(false);
  const circularTextRef = useRef<CircularTextRef>(null);

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

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: '600px', height: '600px' }}>
        {/* Circular text around the logo - only this toggles */}
        <AnimatePresence>
          {isCircularTextVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pointer-events-none z-0"
              style={{ width: '600px', height: '600px' }}
            >
              <CircularText
                ref={circularTextRef}
                text="BORBALA * KUN * "
                spinDuration={30}
                onHover="slowDown"
                size={600}
                fontSize="text-5xl"
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
          className="relative max-h-full max-w-full object-contain cursor-pointer z-20"
          style={{ width: '600px', height: 'auto', pointerEvents: 'auto' }}
          onMouseEnter={handleLogoHover}
          onMouseLeave={handleLogoLeave}
        />
      </div>
    </div>
  );
}
