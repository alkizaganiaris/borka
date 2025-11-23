import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

export type StackItem = {
  id: number;
  src: string;
  rot: number;
  dx: number;
  dy: number;
  key: string;
};

interface PhotoStackPreviewProps {
  stack: StackItem[];
  rolledOut: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
  filmUsed?: string;
  description?: string;
  isDarkMode?: boolean;
}

export function PhotoStackPreview({
  stack,
  rolledOut,
  className = "",
  title,
  subtitle,
  filmUsed,
  isDarkMode = false,
}: PhotoStackPreviewProps) {
  const [isTopClicked, setIsTopClicked] = useState(false);
  const [lastStackLength, setLastStackLength] = useState(0);
  const [newlyAddedItem, setNewlyAddedItem] = useState<string | null>(null);
  const [mouseMoved, setMouseMoved] = useState(false);
  const [hoveredImageDimensions, setHoveredImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isLaptop, setIsLaptop] = useState(false);
  const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState<Map<string, { width: number; height: number }>>(new Map());
  const photoRef = useRef<HTMLDivElement>(null);
  const loadedImageKeysRef = useRef<Set<string>>(new Set());
  const imageDimensionsRef = useRef<Map<string, { width: number; height: number }>>(new Map());

  // Track when new items are added to the stack
  useEffect(() => {
    if (stack.length > lastStackLength && stack.length > 0) {
      // A new item was added
      const newestItem = stack[stack.length - 1];
      setNewlyAddedItem(newestItem.key);
      setMouseMoved(false); // Reset mouse movement flag
    }
    setLastStackLength(stack.length);
  }, [stack.length, stack, lastStackLength]);

  // Track mouse movement to drop zoomed photo
  useEffect(() => {
    if (!newlyAddedItem) return;

    const handleMouseMove = () => {
      setMouseMoved(true);
      setNewlyAddedItem(null); // Drop the zoomed photo when mouse moves
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [newlyAddedItem]);

  // Detect if we're on a laptop (not tablet/mobile)
  useEffect(() => {
    const checkIsLaptop = () => {
      const width = window.innerWidth;
      // Consider laptop if width > 1025px (above tablet landscape breakpoint)
      setIsLaptop(width > 1025);
    };

    checkIsLaptop();
    window.addEventListener('resize', checkIsLaptop);
    return () => window.removeEventListener('resize', checkIsLaptop);
  }, []);

  // Calculate center offset when clicking top photo
  useEffect(() => {
    if (!isTopClicked || !photoRef.current) {
      setCenterOffset({ x: 0, y: 0 });
      return;
    }

    const calculateCenterOffset = () => {
      if (!photoRef.current) return;
      
      requestAnimationFrame(() => {
        if (!photoRef.current) return;
        
        const rect = photoRef.current.getBoundingClientRect();
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;
        
        // Calculate offset needed to center the photo in viewport
        const offsetX = viewportCenterX - (rect.left + rect.width / 2);
        const offsetY = viewportCenterY - (rect.top + rect.height / 2);
        
        setCenterOffset({ x: offsetX, y: offsetY });
      });
    };

    // Calculate continuously during animation (first 500ms)
    const interval = setInterval(calculateCenterOffset, 16); // ~60fps
    const timeout = setTimeout(() => {
      clearInterval(interval);
      // Final calculation after animation
      calculateCenterOffset();
    }, 500);
    
    window.addEventListener('resize', calculateCenterOffset);
    window.addEventListener('scroll', calculateCenterOffset, { passive: true });
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      window.removeEventListener('resize', calculateCenterOffset);
      window.removeEventListener('scroll', calculateCenterOffset);
    };
  }, [isTopClicked]);

  // Load original dimensions for all images in stack (laptop only)
  useEffect(() => {
    if (!isLaptop || stack.length === 0) {
      setImageDimensions(new Map());
      loadedImageKeysRef.current.clear();
      imageDimensionsRef.current.clear();
      return;
    }

    const newDimensions = new Map(imageDimensionsRef.current);
    let pendingLoads = 0;

    stack.forEach((item) => {
      if (loadedImageKeysRef.current.has(item.key)) {
        // Already loaded, keep existing dimensions
        return;
      }

      pendingLoads++;
      const img = new Image();
      img.onload = () => {
        const dims = {
          width: img.naturalWidth,
          height: img.naturalHeight
        };
        newDimensions.set(item.key, dims);
        imageDimensionsRef.current.set(item.key, dims);
        loadedImageKeysRef.current.add(item.key);
        pendingLoads--;
        if (pendingLoads === 0) {
          setImageDimensions(new Map(newDimensions));
        }
      };
      img.onerror = () => {
        // Use default dimensions if image fails to load
        const defaultDims = { width: 500, height: 333 };
        newDimensions.set(item.key, defaultDims);
        imageDimensionsRef.current.set(item.key, defaultDims);
        loadedImageKeysRef.current.add(item.key);
        pendingLoads--;
        if (pendingLoads === 0) {
          setImageDimensions(new Map(newDimensions));
        }
      };
      img.src = item.src;
    });

    // If no pending loads, update immediately
    if (pendingLoads === 0) {
      setImageDimensions(new Map(newDimensions));
    }
  }, [isLaptop, stack]);

  // Load image dimensions when hovering starts (laptop only)
  useEffect(() => {
    if (!isTopClicked || !isLaptop || stack.length === 0) {
      setHoveredImageDimensions(null);
      return;
    }

    const topItem = stack[stack.length - 1];
    if (!topItem) return;

    const img = new Image();
    img.onload = () => {
      // Get original dimensions
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      
      // Calculate max dimensions to prevent overflow (80% of viewport)
      const maxWidth = window.innerWidth * 0.8;
      const maxHeight = window.innerHeight * 0.8;
      
      // Calculate aspect ratio
      const aspectRatio = originalWidth / originalHeight;
      
      // Scale to fit within max dimensions while maintaining aspect ratio
      let displayWidth = originalWidth;
      let displayHeight = originalHeight;
      
      if (displayWidth > maxWidth) {
        displayWidth = maxWidth;
        displayHeight = displayWidth / aspectRatio;
      }
      
      if (displayHeight > maxHeight) {
        displayHeight = maxHeight;
        displayWidth = displayHeight * aspectRatio;
      }
      
      setHoveredImageDimensions({ width: displayWidth, height: displayHeight });
    };
    img.onerror = () => {
      // If image fails to load, don't set dimensions
      setHoveredImageDimensions(null);
    };
    img.src = topItem.src;
  }, [isTopClicked, isLaptop, stack]);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, height: 0 }}
        animate={{
          opacity: rolledOut ? 1 : 0,
          scale: rolledOut ? 1 : 0.95,
          height: rolledOut ? "auto" : 0,
        }}
        transition={{ 
          duration: 0.8,
          ease: [0.34, 1.56, 0.64, 1], // Bounce easing for swell effect
          opacity: { duration: 0.5, ease: "easeOut" },
          scale: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }, // Extra bounce for scale
        }}
        className={`photo-stack-preview-container px-4 tablet-landscape:px-6 tablet-landscape:w-[92vw] ${className}`}
        style={{ 
          marginBottom: rolledOut ? "2rem" : "0",
          overflow: rolledOut ? "visible" : "hidden",
          width: '87vw', // Adjust this value to control width
          marginLeft: 'auto',
          marginRight: 'auto',
          zIndex: isTopClicked ? 50 : 1, // Higher than film reel (z-30) when clicked
          position: 'relative'
        }}
      >
      <motion.div 
        className="photo-stack-preview-inner relative overflow-visible flex items-center justify-center p-8 tablet-landscape:p-10 tablet-landscape:h-[70vh] border border-black"
        style={{ 
          borderWidth: '0.5px',
          height: '63vh' // Adjust this value to control height
        }}
        animate={{
          borderRadius: isTopClicked ? "8px" : "16px"
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
      >
        {/* Diagonal color blocks */}
        <motion.div 
          className="absolute inset-0 overflow-hidden"
          animate={{
            borderRadius: isTopClicked ? "8px" : "16px"
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut"
          }}
        >
          {/* Wooden table background */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(/media/wooden_table.jpg)',
              opacity: isTopClicked ? 0.3 : 1
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {/* BOKU stamp in bottom left */}
            <motion.img
              src={isDarkMode ? "/media/boku_home.svg" : "/media/boku_home.svg"}
              alt="BOKU"
              className="absolute bottom-1 left-1"
              style={{
                width: '120px',
                height: 'auto',
                opacity: isTopClicked ? 0.5 : 1
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Visual notes overlay */}
          <motion.div 
            className="absolute bottom-4 right-4 bg-buttery/100 border border-black rounded-lg px-3 py-2 text-black text-sm shadow-lg"
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
            }}
            animate={{
              opacity: isTopClicked ? 0 : 1
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {title && (
              <span className="font-bold mr-3">{title}</span>
            )}
            {subtitle && (
              <span className="opacity-90 mr-3">{subtitle}</span>
            )}
            {filmUsed && (
              <span className="opacity-75">Film: {filmUsed}</span>
            )}
          </motion.div>

        </motion.div>
        
        
        {/* STACK: newest on top */}
        <div
          className="absolute"
          style={{ 
            // Calculate container size based on top image's original dimensions (laptop only)
            // Container size stays FIXED - never changes on hover
            ...(isLaptop && stack.length > 0 && (() => {
              const topItem = stack[stack.length - 1];
              const topDimensions = imageDimensions.get(topItem.key);
              
              if (topDimensions) {
                // Scale to fit within 500×333 while maintaining aspect ratio
                const maxWidth = 500;
                const maxHeight = 333;
                const aspectRatio = topDimensions.width / topDimensions.height;
                
                let containerWidth = topDimensions.width;
                let containerHeight = topDimensions.height;
                
                // Scale down if needed
                if (containerWidth > maxWidth) {
                  containerWidth = maxWidth;
                  containerHeight = containerWidth / aspectRatio;
                }
                if (containerHeight > maxHeight) {
                  containerHeight = maxHeight;
                  containerWidth = containerHeight * aspectRatio;
                }
                
                // Always use calculated dimensions - never change on hover
                return {
                  width: `${containerWidth}px`,
                  height: `${containerHeight}px`,
                };
              }
              return {};
            })()) || {
              // Default size when not laptop or dimensions not loaded
              width: "500px",
              height: "333px",
            },
            // Position controls - adjust these values:
            left: '70%',      // Horizontal position: 'left', 'center', 'right', or percentage/px
            top: '50%',       // Vertical position: 'top', 'center', 'bottom', or percentage/px
            transform: 'translate(-50%, -50%)', // Centers when using percentages
          }}
        >
          {stack.map((item, i) => {
            const isTop = i === stack.length - 1;
            const isNewlyAdded = newlyAddedItem === item.key;
            const clickActive = isTop && isTopClicked && !isNewlyAdded; // Don't click if newly added
            
            // Calculate dimensions for this image (laptop only)
            const itemDimensions = isLaptop ? imageDimensions.get(item.key) : null;
            let imageWidth = "100%";
            let imageHeight = "100%";
            
            if (isLaptop && itemDimensions) {
              // For all images (including top), scale to fit within 500×333
              const maxWidth = 500;
              const maxHeight = 333;
              const aspectRatio = itemDimensions.width / itemDimensions.height;
              
              let scaledWidth = itemDimensions.width;
              let scaledHeight = itemDimensions.height;
              
              if (scaledWidth > maxWidth) {
                scaledWidth = maxWidth;
                scaledHeight = scaledWidth / aspectRatio;
              }
              if (scaledHeight > maxHeight) {
                scaledHeight = maxHeight;
                scaledWidth = scaledHeight * aspectRatio;
              }
              
              imageWidth = `${scaledWidth}px`;
              imageHeight = `${scaledHeight}px`;
            }
            
            // Calculate scale - ONLY the top image should scale on click
            // Clicked top items scale, other top items slightly scaled, rest stay at 1
            const clickScale = 2; // Adjust this value to control click zoom
            // When clicked, always apply the click scale to the top image
            const scaleToFit = clickActive 
              ? clickScale // Scale up when clicked
              : (isTop ? 1.02 : 1); // Top item slightly scaled when not clicked, others stay at 1
            
            return (
              <motion.div
                key={item.key}
                ref={isTop ? photoRef : undefined}
                className={clickActive ? "fixed" : "absolute"}
                style={{
                  // All images use fixed dimensions - top image scales via transform, not size
                  width: imageWidth,
                  height: imageHeight,
                  zIndex: clickActive ? 1000000 : (isTop ? 999 : i), // Extremely high z-index when clicked
                  pointerEvents: isTop ? "auto" : "none",
                  isolation: clickActive ? "isolate" : undefined, // Create new stacking context when clicked
                  cursor: isTop ? "pointer" : "default", // Show pointer cursor on top image
                  opacity: clickActive ? 1 : undefined, // Explicitly set opacity to 1 when clicked
                }}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  rotate: 0,
                  x: isNewlyAdded ? (Math.random() - 0.5) * 100 : 0,  // Random horizontal slide for newly added
                  y: isNewlyAdded ? (Math.random() - 0.5) * 80 : 0,   // Random vertical slide for newly added
                }}
                animate={{
                  opacity: 1,
                  rotate: clickActive ? 0 : (isNewlyAdded ? 0 : item.rot),
                  x: clickActive 
                    ? centerOffset.x 
                    : (isNewlyAdded ? 0 : item.dx),
                  y: clickActive 
                    ? centerOffset.y 
                    : (isNewlyAdded ? 0 : item.dy),
                  scale: scaleToFit,
                  boxShadow: clickActive
                    ? "0 16px 48px rgba(0,0,0,0.55)"
                    : isTop
                      ? "0 12px 36px rgba(0,0,0,0.4)"
                      : "0 6px 18px rgba(0,0,0,0.3)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 24,
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent container click from firing
                  if (isTop) {
                    setIsTopClicked(prev => {
                      const newValue = !prev;
                      // Clear dimensions when unclicking (toggling from true to false)
                      if (prev && !newValue) {
                        setHoveredImageDimensions(null);
                      }
                      return newValue;
                    });
                  }
                }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={item.src}
                    alt={`Photo ${item.id}`}
                    className="w-full h-full object-cover"
                    style={{
                      borderRadius: 0,
                      filter: clickActive
                        ? "contrast(1.05) brightness(1) saturate(1.1)" // Full brightness when clicked
                        : "contrast(1.05) brightness(0.95) saturate(1.1)",
                      opacity: clickActive ? 1 : undefined, // Explicitly 100% opacity when clicked
                    }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.55)_100%)] pointer-events-none" />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.0) 70%)",
                      mixBlendMode: "screen",
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      </motion.div>
      {/* Tablet landscape styles */}
      <style>{`
        /* Tablet landscape: 768px-1024px width, landscape orientation (includes iPad Mini 1024x768) */
        @media (min-width: 768px) and (max-width: 1025px) and (orientation: landscape) {
          .photo-stack-preview-container {
            width: 92vw !important;
          }
          .photo-stack-preview-inner {
            height: 70vh !important;
          }
        }
        /* Ensure desktop/laptop (> 1025px) doesn't get tablet styles */
        @media (min-width: 1025px) {
          .photo-stack-preview-container {
            width: 87vw !important;
          }
          .photo-stack-preview-inner {
            height: 63vh !important;
          }
        }
      `}</style>
    </div>
  );
}

