import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, useScroll, AnimatePresence } from "motion/react";
import { FilmFrame } from "./FilmFrame";
import { PhotoStackPreview, type StackItem } from "./PhotoStackPreview";
import DecryptedText from "./DecryptedText";
import { useTabletLandscape } from "./ui/use-tablet-landscape";
import { useIsMobile } from "./ui/use-mobile";

interface FilmRollGalleryProps {
  images: string[];
  title?: string;
  subtitle?: string;
  filmUsed?: string;
  year?: string;
  description?: string;
  className?: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  scrollToPreview?: boolean;
  previewScrollOffset?: number; // Vertical offset in pixels when centering (negative = higher, positive = lower)
  onPreviewPositionChange?: (top: number, height: number) => void; // Callback to report preview position
  showBubbleVideo?: boolean; // Whether to show the bubble video for this gallery (defaults to true)
  isDarkMode?: boolean;
  currentGalleryIndex?: number; // Current gallery index for tablet landscape and mobile
  totalGalleries?: number; // Total number of galleries for tablet landscape and mobile
  onNavigateGallery?: (direction: 'next' | 'prev') => void; // Navigation callback for tablet landscape and mobile
  isMenuOpen?: boolean; // Whether the menu is open (to disable hover effects)
  isMobile?: boolean; // Whether the device is a mobile phone
}


function NotesContent({ 
  compact = false, 
  title = "inspiration", 
  subtitle = "/ ˌɪn spəˈreɪ ʃən /",
  filmUsed,
  year, 
  photos,
  //isDarkMode = false,
  isCanisterHovered = false,
}: { 
  compact?: boolean;
  title?: string;
  subtitle?: string;
  filmUsed?: string;
  year?: string;
  photos?: number;
  isDarkMode?: boolean;
  isCanisterHovered?: boolean;
}) {
  const monoFont =
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";

  return (
    <div
      style={{ fontFamily: monoFont }}
      className={
        compact
          ? `text-sm leading-tight tracking-tight transition-colors duration-500 text-zinc-900`
          : `text-base leading-tight tracking-tight transition-colors duration-500 text-zinc-900`
      }
    >
      <h2
        className={
          compact
            ? "font-semibold uppercase text-2xl"
            : "text-lg font-semibold uppercase"
        }
      >
        <DecryptedText 
          text={title}
          speed={30}
          maxIterations={10}
          animateOn="trigger"
          trigger={isCanisterHovered}
          revealDirection="start"
        />
      </h2>
      <p className="mb-0 transition-colors duration-500 text-zinc-600">
        <DecryptedText 
          text={subtitle}
          speed={25}
          maxIterations={8}
          animateOn="trigger"
          trigger={isCanisterHovered}
          revealDirection="start"
        />
      </p>

      {/* Film metadata */}
      {(filmUsed || year || photos) && (
        <div className="mt-4 space-y-0.5 text-xs transition-colors duration-500 text-black">
          {filmUsed && (
            <p>
              <DecryptedText 
                text={`Film: ${filmUsed}`}
                speed={25}
                maxIterations={8}
                animateOn="trigger"
                trigger={isCanisterHovered}
                revealDirection="start"
              />
            </p>
          )}
          {year && (
            <p>
              <DecryptedText 
                text={`Year: ${year}`}
                speed={25}
                maxIterations={8}
                animateOn="trigger"
                trigger={isCanisterHovered}
                revealDirection="start"
              />
            </p>
          )}
          {photos && (
            <p>
              <DecryptedText 
                text={`Photos: ${photos}`}
                speed={25}
                maxIterations={8}
                animateOn="trigger"
                trigger={isCanisterHovered}
                revealDirection="start"
              />
            </p>
          )}
        </div>
      )}

      {/* Lane-only extras */}
      {!compact && (
        <div className="mt-1 space-y-1 text-zinc-700">
          <p className="text-sm">
            the spark that kicks off ideas, frames, and little happy accidents.
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>hover a frame to light it up</li>
            <li>click to add to the preview stack</li>
            <li>press the canister to roll in/out</li>
          </ul>
          <p className="text-xs text-zinc-500 mt-2">
            tip: scroll the reel to browse more.
          </p>
        </div>
      )}
    </div>
  );
}

export function FilmRollGallery({
  images,
  title = "Inspiration",
  subtitle,
  filmUsed,
  year,
  description,
  className = "",
  isOpen,
  onToggle,
  scrollToPreview = true,
  previewScrollOffset = 180, // Negative = scroll higher up
  onPreviewPositionChange,
  isDarkMode = false,
  currentGalleryIndex = 0,
  totalGalleries: _totalGalleries = 1, // Available for future use (e.g., gallery counter)
  onNavigateGallery,
  isMenuOpen = false,
  isMobile: isMobileProp = false,
}: FilmRollGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [stack, setStack] = useState<StackItem[]>([]);
  const [internalRolledOut, setInternalRolledOut] = useState(false);
  const [isCanisterHovered, setIsCanisterHovered] = useState(false);
  const [ribbonPulled, setRibbonPulled] = useState(false); // For tablet landscape ribbon interaction

  // Reset hover state when menu opens
  useEffect(() => {
    if (isMenuOpen) {
      setIsCanisterHovered(false);
    }
  }, [isMenuOpen]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // Simple preview modal for tablet landscape
  const [previewImageIndex, setPreviewImageIndex] = useState(0); // Current image in preview
  const [tabletLandscapeHeight, setTabletLandscapeHeight] = useState<string>('60vh'); // Dynamic height for tablet landscape
  const [gallerySpacing, setGallerySpacing] = useState<number>(0); // Dynamic spacing between gallery items
  const [isSwipeGesture, setIsSwipeGesture] = useState(false); // Track if canister was swiped (not clicked)
  const [canisterDragX, setCanisterDragX] = useState(0); // Track canister drag position
  const [isLandscape, setIsLandscape] = useState(false); // Track orientation for mobile preview
  
  const isTabletLandscape = useTabletLandscape();
  const isMobileHook = useIsMobile();
  const isMobileDevice = isMobileProp || isMobileHook; // Use prop if provided, otherwise use hook
  
  // Use controlled state if provided, otherwise use internal state
  const rolledOut = isOpen !== undefined ? isOpen : internalRolledOut;
  
  // Track if animations should be enabled (prevents glitchy first render)
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  const REEL_DUR = 1.2; // seconds — faster, smoother animation

  // Enable animations after first render to prevent glitches
  useEffect(() => {
    // Small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      setAnimationsEnabled(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const rand = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const scrollRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const tabletLandscapeRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({
    container: scrollRef,
  });

  // Helper function to toggle the rolled out state
  const toggleRolledOut = (newState: boolean) => {
    if (onToggle) {
      onToggle(newState);
    } else {
      setInternalRolledOut(newState);
    }
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && rolledOut) {
        // Reset horizontal scroll
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        }

        // clear preview stack (same behavior as clicking canister)
        setStack([]);
        
        // Close the gallery
        toggleRolledOut(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rolledOut, onToggle]);

  // Report preview position to parent component (only when rolled out and this gallery is active)
  useEffect(() => {
    if (!previewRef.current || !onPreviewPositionChange || !rolledOut || !isOpen) return;

    const updatePosition = () => {
      if (previewRef.current) {
        const rect = previewRef.current.getBoundingClientRect();
        onPreviewPositionChange(rect.top + window.scrollY, rect.height);
      }
    };

    // Initial position update
    updatePosition();
    
    // Only update on scroll/resize, not on every render
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [rolledOut, isOpen, onPreviewPositionChange]);

  function addToStack(index: number) {
    const src = images[index];
    setStack((prev) => {
      if (prev.length && prev[prev.length - 1].id === index) return prev;
      const item: StackItem = {
        id: index,
        src,
        rot: rand(-10, 10),
        dx: rand(-18, 18),
        dy: rand(-12, 12),
        key: `${index}-${crypto.randomUUID?.() ?? Date.now()}`,
      };
      return [...prev, item].slice(-images.length);
    });
  }

  // Add first photo to stack when rolled out
  useEffect(() => {
    if (rolledOut && stack.length === 0 && images.length > 0) {
      // Small delay to let the animation start
      const timeout = setTimeout(() => {
        addToStack(0);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [rolledOut, images.length]);

  // Reset ribbon state when gallery closes
  useEffect(() => {
    if (!rolledOut) {
      setRibbonPulled(false);
    }
  }, [rolledOut]);

         // Track previous gallery index to prevent reset on orientation change
         const prevGalleryIndexRef = useRef(currentGalleryIndex);

         // Reset preview when gallery changes (tablet landscape and mobile)
         // Don't reset when orientation changes - only when gallery index actually changes
         useEffect(() => {
           if ((isTabletLandscape || isMobileDevice) && onNavigateGallery) {
             // Only reset if the gallery actually changed, not on orientation change
             if (prevGalleryIndexRef.current !== currentGalleryIndex) {
               setIsPreviewOpen(false);
               setPreviewImageIndex(0);
               setIsSwipeGesture(false);
               setCanisterDragX(0);
               prevGalleryIndexRef.current = currentGalleryIndex;
             }
           }
         }, [currentGalleryIndex, isTabletLandscape, isMobileDevice, onNavigateGallery]);

         // Keyboard navigation for tablet landscape and mobile preview
         useEffect(() => {
           if ((!isTabletLandscape && !isMobileDevice) || !isPreviewOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setPreviewImageIndex((prev) => 
          prev > 0 ? prev - 1 : images.length - 1
        );
      } else if (e.key === 'ArrowRight') {
        setPreviewImageIndex((prev) => 
          prev < images.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'Escape') {
        setIsPreviewOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTabletLandscape, isMobileDevice, isPreviewOpen, images.length]);

  // Track orientation for mobile preview to maximize space in landscape
  useEffect(() => {
    if (!isMobileDevice || !isPreviewOpen) {
      setIsLandscape(false);
      return;
    }

    const checkOrientation = () => {
      const isLandscapeMode = window.matchMedia('(orientation: landscape)').matches;
      setIsLandscape(isLandscapeMode);
    };

    // Initial check
    checkOrientation();

    // Listen for orientation changes
    const portraitMediaQuery = window.matchMedia('(orientation: portrait)');
    const landscapeMediaQuery = window.matchMedia('(orientation: landscape)');
    
    const handleOrientationChange = () => {
      checkOrientation();
    };

    portraitMediaQuery.addEventListener('change', handleOrientationChange);
    landscapeMediaQuery.addEventListener('change', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      portraitMediaQuery.removeEventListener('change', handleOrientationChange);
      landscapeMediaQuery.removeEventListener('change', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [isMobileDevice, isPreviewOpen]);

  // Dynamically calculate height for tablet landscape layout
  useEffect(() => {
    if (!isTabletLandscape) {
      setTabletLandscapeHeight('60vh');
      return;
    }

    const calculateHeight = () => {
      const viewportHeight = window.innerHeight;
      // Account for header/page title area (approximately 120px-150px)
      const headerOffset = 140;
      // Calculate available height and use 85-90% of it for better fit
      const availableHeight = viewportHeight - headerOffset;
      const calculatedHeight = Math.max(availableHeight * 0.85, 400); // Minimum 400px
      setTabletLandscapeHeight(`${calculatedHeight}px`);
    };

    // Calculate on mount and resize
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    window.addEventListener('orientationchange', calculateHeight);

    return () => {
      window.removeEventListener('resize', calculateHeight);
      window.removeEventListener('orientationchange', calculateHeight);
    };
  }, [isTabletLandscape]);

  // Calculate dynamic spacing between gallery items based on content height
  useLayoutEffect(() => {
    if (!isTabletLandscape || !tabletLandscapeRef.current) {
      setGallerySpacing(0);
      return;
    }

    const calculateSpacing = () => {
      if (!tabletLandscapeRef.current) return;

      const container = tabletLandscapeRef.current;
      const innerContainer = container.querySelector('.tablet-landscape-inner') as HTMLElement;
      
      if (!innerContainer) return;

      // Get the actual rendered heights
      const descriptionElement = innerContainer.querySelector('.tablet-landscape-description') as HTMLElement;
      const titleElement = innerContainer.querySelector('.tablet-landscape-title') as HTMLElement;
      const canisterElement = innerContainer.querySelector('.tablet-landscape-canister-button') as HTMLElement;

      let maxContentHeight = 0;

      // Measure description height
      if (descriptionElement) {
        maxContentHeight = Math.max(maxContentHeight, descriptionElement.offsetHeight);
      }

      // Measure title area height
      if (titleElement) {
        maxContentHeight = Math.max(maxContentHeight, titleElement.offsetHeight);
      }

      // Canister height (160px = 40 * 4rem = h-40)
      const canisterHeight = canisterElement ? canisterElement.offsetHeight : 160;
      maxContentHeight = Math.max(maxContentHeight, canisterHeight);

      // Calculate spacing: use a small percentage of content height (8-10%)
      // Minimum spacing of 15px, maximum of 50px for tighter spacing
      const spacing = Math.min(Math.max(maxContentHeight * 0.08, 15), 50);
      setGallerySpacing(spacing);
    };

    // Use ResizeObserver for more accurate measurements
    const resizeObserver = new ResizeObserver(() => {
      calculateSpacing();
    });

    if (tabletLandscapeRef.current) {
      resizeObserver.observe(tabletLandscapeRef.current);
    }

    // Initial calculation
    calculateSpacing();

    return () => {
      resizeObserver.disconnect();
    };
  }, [isTabletLandscape, description, title, subtitle, filmUsed, year, images.length]);

  // Scroll to preview when rolled out
  useEffect(() => {
    if (rolledOut && scrollToPreview && previewRef.current) {
      // Wait for the rollout animation to complete
      const timeout = setTimeout(() => {
        if (previewRef.current) {
          const previewElement = previewRef.current;
          const elementRect = previewElement.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          
          // Adaptive positioning based on screen size
          const viewportHeight = window.innerHeight;
          const elementHeight = elementRect.height;
          
          // For smaller screens, position higher up; for larger screens, more centered
          const adaptiveOffset = viewportHeight < 768 
            ? viewportHeight * 0.15  // 15% from top on mobile
            : viewportHeight * 0.25; // 25% from top on desktop
          
          const targetPosition = absoluteElementTop - adaptiveOffset;
          
          window.scrollTo({
            top: targetPosition + previewScrollOffset,
            behavior: 'smooth'
          });
        }
      }, 600); // Wait for rollout animation (500ms) + buffer
      return () => clearTimeout(timeout);
    }
  }, [rolledOut, scrollToPreview, previewScrollOffset]);

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop: Preview box (stack of chosen photos) */}
      {!isTabletLandscape && !isMobileDevice && (
        <div ref={previewRef}>
          <PhotoStackPreview 
            stack={stack} 
            rolledOut={rolledOut} 
            title={title}
            subtitle={subtitle}
            filmUsed={filmUsed}
            description={description}
            isDarkMode={isDarkMode}
          />
          {/* Logo in bottom right - removed for desktop/laptop, only shown for tablet/mobile */}
        </div>
      )}

      {/* Tablet Landscape: Simplified centered layout */}
      {isTabletLandscape && (
        <div 
          ref={tabletLandscapeRef}
          className="relative w-full flex items-start justify-center px-8"
          style={{ 
            minHeight: tabletLandscapeHeight, 
            height: tabletLandscapeHeight
          }}
        >
          <div className="tablet-landscape-inner flex items-center justify-center gap-8 max-w-6xl w-full border border-black p-8 pt-6 mt-8">
            {/* Left side: Description */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={`description-${currentGalleryIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col items-end text-right"
              >
                {description && (
                  <div 
                    className="tablet-landscape-description text-sm leading-relaxed font-mono text-black max-w-md"
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
                    }}
                  >
                    {description}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Center: Canister with navigation buttons */}
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              {/* Canister - Swipeable left/right, click to open preview */}
              <motion.button
                aria-label="View photos"
                onClick={() => {
                  // Only open preview if it wasn't a swipe gesture
                  // For tablet landscape with navigation, check swipe flag
                  // For desktop/tablet without navigation, always open
                  if (onNavigateGallery) {
                    if (!isSwipeGesture) {
                      setIsPreviewOpen(true);
                      setPreviewImageIndex(0);
                    }
                    // Reset swipe flag after a short delay
                    setTimeout(() => setIsSwipeGesture(false), 100);
                  } else {
                    // No navigation available, always open preview
                    setIsPreviewOpen(true);
                    setPreviewImageIndex(0);
                  }
                }}
                drag={onNavigateGallery ? "x" : false}
                dragConstraints={onNavigateGallery ? { left: 0, right: 0 } : undefined}
                dragElastic={onNavigateGallery ? 0.2 : undefined}
                onDrag={onNavigateGallery ? (_, info) => {
                  setCanisterDragX(info.offset.x);
                } : undefined}
                onDragEnd={onNavigateGallery ? (_, info) => {
                  const threshold = 80; // Minimum swipe distance to trigger navigation
                  const absOffset = Math.abs(info.offset.x);
                  
                  if (absOffset > threshold && onNavigateGallery) {
                    setIsSwipeGesture(true);
                    if (info.offset.x < -threshold) {
                      // Swiped left - next gallery
                      onNavigateGallery('next');
                    } else if (info.offset.x > threshold) {
                      // Swiped right - previous gallery
                      onNavigateGallery('prev');
                    }
                  }
                  setCanisterDragX(0);
                } : undefined}
                initial={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                whileDrag={onNavigateGallery ? { 
                  scale: 1.1,
                  cursor: 'grabbing'
                } : undefined}
                animate={onNavigateGallery ? {
                  x: canisterDragX
                } : {}}
                className={`tablet-landscape-canister-button z-30 w-32 h-40 flex items-center justify-center ${onNavigateGallery ? 'cursor-grab active:cursor-grabbing' : ''}`}
              >
                <div className="relative w-full h-full">
                  <img
                    src="/media/film-canister.png"
                    alt="Film Roll"
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.button>

              {/* Navigation buttons - only show when onNavigateGallery is provided */}
              {onNavigateGallery && (
                <div className="flex items-center justify-center gap-4">
                  {/* Previous button */}
                  <motion.button
                    onClick={() => {
                      if (onNavigateGallery) {
                        onNavigateGallery('prev');
                      }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="px-4 py-2 bg-black/10 hover:bg-black/20 text-black rounded-lg transition-colors font-mono text-xs font-semibold"
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
                    }}
                    aria-label="Previous gallery"
                  >
                    ← Prev
                  </motion.button>

                  {/* Next button */}
                  <motion.button
                    onClick={() => {
                      if (onNavigateGallery) {
                        onNavigateGallery('next');
                      }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="px-4 py-2 bg-black/10 hover:bg-black/20 text-black rounded-lg transition-colors font-mono text-xs font-semibold"
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
                    }}
                    aria-label="Next gallery"
                  >
                    Next →
                  </motion.button>
                </div>
              )}
            </div>

            {/* Right side: Title, subtitle, film, year, photos */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={`title-${currentGalleryIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="tablet-landscape-title flex-1 flex flex-col items-start text-left"
              >
                <NotesContent 
                  compact={true}
                  title={title || "Untitled"}
                  subtitle={subtitle}
                  filmUsed={filmUsed}
                  year={year}
                  photos={images.length}
                  isDarkMode={isDarkMode}
                  isCanisterHovered={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Mobile Portrait: Simplified layout with canister + title/subtitle in one row, description below */}
      {isMobileDevice && !isTabletLandscape && (
        <div 
          className="relative w-full flex flex-col items-center justify-start px-4 py-6"
        >
          <div className="mobile-portrait-inner w-full max-w-lg border border-black p-4 flex flex-col gap-4">
            {/* Top row: Canister + Title/Subtitle/Metadata */}
            <div className="flex items-center gap-4">
              {/* Canister */}
              <div className="flex-shrink-0">
                <motion.button
                  aria-label="View photos"
                  onClick={() => {
                    if (!isSwipeGesture && onNavigateGallery) {
                      setIsPreviewOpen(true);
                      setPreviewImageIndex(0);
                    }
                    setTimeout(() => setIsSwipeGesture(false), 100);
                  }}
                  drag={onNavigateGallery ? "x" : false}
                  dragConstraints={onNavigateGallery ? { left: 0, right: 0 } : undefined}
                  dragElastic={onNavigateGallery ? 0.2 : undefined}
                  onDrag={onNavigateGallery ? (_, info) => {
                    setCanisterDragX(info.offset.x);
                  } : undefined}
                  onDragEnd={onNavigateGallery ? (_, info) => {
                    const threshold = 80;
                    const absOffset = Math.abs(info.offset.x);
                    
                    if (absOffset > threshold && onNavigateGallery) {
                      setIsSwipeGesture(true);
                      if (info.offset.x < -threshold) {
                        onNavigateGallery('next');
                      } else if (info.offset.x > threshold) {
                        onNavigateGallery('prev');
                      }
                    }
                    setCanisterDragX(0);
                  } : undefined}
                  initial={{ opacity: 1, scale: 1 }}
                  whileTap={{ scale: 0.95 }}
                  whileDrag={onNavigateGallery ? { 
                    scale: 1.1,
                    cursor: 'grabbing'
                  } : undefined}
                  animate={onNavigateGallery ? {
                    x: canisterDragX
                  } : {}}
                  className={`mobile-canister-button z-30 w-24 h-32 flex items-center justify-center ${onNavigateGallery ? 'cursor-grab active:cursor-grabbing' : ''}`}
                >
                  <div className="relative w-full h-full">
                    <img
                      src="/media/film-canister.png"
                      alt="Film Roll"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </motion.button>
              </div>

              {/* Title/Subtitle/Metadata */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`title-${currentGalleryIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col items-start text-left"
                >
                  <NotesContent 
                    compact={true}
                    title={title || "Untitled"}
                    subtitle={subtitle}
                    filmUsed={filmUsed}
                    year={year}
                    photos={images.length}
                    isDarkMode={isDarkMode}
                    isCanisterHovered={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Description below */}
            {description && (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`description-${currentGalleryIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full pt-4 border-t border-black/20"
                >
                  <div 
                    className="text-sm leading-relaxed font-mono text-black"
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
                    }}
                  >
                    {description}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Navigation buttons */}
            {onNavigateGallery && (
              <div className="flex items-center justify-center gap-4 pt-2">
                <motion.button
                  onClick={() => {
                    if (onNavigateGallery) {
                      onNavigateGallery('prev');
                    }
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="px-4 py-2 bg-black/10 active:bg-black/20 text-black rounded-lg transition-colors font-mono text-xs font-semibold"
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
                  }}
                  aria-label="Previous gallery"
                >
                  ← Prev
                </motion.button>

                <motion.button
                  onClick={() => {
                    if (onNavigateGallery) {
                      onNavigateGallery('next');
                    }
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="px-4 py-2 bg-black/10 active:bg-black/20 text-black rounded-lg transition-colors font-mono text-xs font-semibold"
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
                  }}
                  aria-label="Next gallery"
                >
                  Next →
                </motion.button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop: Reel section */}
      {!isTabletLandscape && !isMobileDevice && (
      <div className="relative w-full px-4 pb-10 tablet-landscape:px-6 tablet-landscape:pb-12">
        <div className="max-w-7xl mx-auto relative">
          {/* Canister (toggle rollout) */}
          <motion.button
            aria-label="Toggle film"
            onClick={() => {
              // On tablet landscape, open simple preview instead of film roll
              if (isTabletLandscape) {
                setIsPreviewOpen(true);
                setPreviewImageIndex(0);
                return;
              }

              // Desktop behavior: toggle film roll
              const next = !rolledOut;

              if (!next) {
                setStack([]); // clear preview stack when closing

                // Reset horizontal scroll when reel retracts
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({
                    left: 0,
                    behavior: "smooth",
                  });
                }
              }

              toggleRolledOut(next);
            }}
            onMouseEnter={() => {
              if (!isMenuOpen) {
                setIsCanisterHovered(true);
              }
            }}
            onMouseLeave={() => {
              if (!isMenuOpen) {
                setIsCanisterHovered(false);
              }
            }}
            initial={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04 }}
            className="tablet-landscape-canister absolute left-0 top-[7.5%] z-30 w-40 h-48 tablet-landscape:w-32 tablet-landscape:h-[9.5rem] flex items-center justify-center"
          >
            <div className="relative w-40 h-70 tablet-landscape:w-32 tablet-landscape:h-56">
              <img
                src="/media/film-canister.png"
                alt="Film Roll"
                className="w-full h-full object-contain"
              />
              {/* Leader grows/shrinks with rollout, but waits on close */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 left-full h-[75%] rounded-r-sm pointer-events-none z-20"
                animate={{ width: rolledOut ? 20 : 0 }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                  delay: rolledOut ? 0 : REEL_DUR,
                }}
                style={{
                  background:
                    "linear-gradient(to right, rgba(209,213,219,1) 0%, rgba(26,26,26,1) 25%, rgba(0,0,0,1) 100%)",
                  boxShadow: "inset -3px 0 6px rgba(0,0,0,0.7)",
                }}
              />
            </div>
            {/* Optional glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-transparent blur-xl pointer-events-none" />
          </motion.button>

          {/* Scroll container (reel lane) */}
          <div
            ref={scrollRef}
            className="tablet-landscape-reel-scroll relative overflow-x-auto overflow-y-hidden scrollbar-hide pl-44 pr-8 tablet-landscape:pl-36 tablet-landscape:pr-10 flex items-center mt-8 tablet-landscape:mt-10"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              minHeight: "48px", // Match canister height
            }}
          >
            {/* Reel reveal / rollback (clip-path) */}
            <motion.div
              className="relative inline-flex items-center py-8 bg-transparent opacity-100"
              style={{ 
                alignItems: 'center',
                minHeight: '48px', // Match canister height
                willChange: "clip-path"
              }}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={animationsEnabled ? {
                clipPath: rolledOut
                  ? "inset(0 0% 0 0)"
                  : "inset(0 100% 0 0)",
              } : false}
              transition={{
                duration: REEL_DUR,
                ease: [0.4, 0, 0.2, 1], // Custom bezier curve for smoother animation
                delay: rolledOut ? 0.8 : 0, // Wait 1s for scroll to complete before unraveling
              }}
            >
              {/* Frames */}
              <div className="relative flex gap-0 px-0 bg-transparent">
                {images.map((image, index) => (
                  <FilmFrame
                    key={index}
                    id={index + 1}
                    imageUrl={image}
                    isSelected={selectedImage === index}
                    onClick={() => {
                      setSelectedImage(index);
                      addToStack(index);
                    }}
                    delay={index * 0.05}
                  />
                ))}
              </div>
            </motion.div>

            {/* LANE NOTES (pinned overlay: Y fixed, X animates) - Left half */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                left: "11rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: "calc(50% - 11rem - 1rem)",
              }}
            >
              <motion.div
                initial={{ x: 0, opacity: 1 }}
                animate={animationsEnabled ? (rolledOut ? "off" : ribbonPulled ? "ribbon-pulled" : "on") : false}
                variants={{
                  on: { x: 0, opacity: 1 },
                  off: { x: "40vw", opacity: 0 },
                  "ribbon-pulled": { x: "-15rem", opacity: 0.3 }, // Move left behind canister
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1],
                  delay: rolledOut ? 0.05 : REEL_DUR,
                }}
                style={{ willChange: "transform, opacity" }}
              >
                <NotesContent 
                  compact 
                  title={title.toLowerCase()} 
                  subtitle={subtitle}
                  filmUsed={filmUsed}
                  year={year}
                  photos={images.length}
                  isDarkMode={isDarkMode}
                  isCanisterHovered={isCanisterHovered}
                />
              </motion.div>
            </div>

            {/* LANE DESCRIPTION (pinned overlay: Y fixed, X animates) - Right half */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                right: "0", // Align with right edge of container
                top: "0", // Align with top of container
                width: "80vh", // Fixed width - FULL CONTROL
                height: "100%", // Match container height
              }}
            >
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{
                  x: ribbonPulled ? "calc(50vw - 40vh)" : (isCanisterHovered && !rolledOut && !isMenuOpen) ? "0%" : "100%",
                  opacity: ribbonPulled ? 1 : (isCanisterHovered && !rolledOut && !isMenuOpen) ? 1 : 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{ 
                  willChange: "transform, opacity",
                  width: "100%",
                  height: "100%",
                }}
              >
                {description && (
                  <div 
                    className="text-sm leading-relaxed rounded-l-lg transition-colors duration-500 relative overflow-hidden font-mono text-black"
                    style={{
                      width: "100%", // Fill the fixed container
                      height: "100%", // Fill the fixed container
                      padding: "16px 20px", // Fixed padding
                      boxSizing: "border-box", // Include padding in height calculation
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* White background - visible when ribbon is pulled */}
                    <motion.div 
                      className="absolute inset-0 bg-white/95 backdrop-blur-sm" 
                      animate={{
                        opacity: ribbonPulled ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Content - centered in fixed container */}
                    <div className="relative z-10 text-center">
                      {description}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Ribbon for tablet landscape - pull to reveal description (specific to this gallery) */}
          {description && !rolledOut && (
            <motion.div
              className="tablet-landscape-ribbon absolute right-0 top-1/2 -translate-y-1/2 z-40 cursor-grab active:cursor-grabbing"
              style={{
                display: 'none', // Hidden by default, shown via CSS for tablet landscape
              }}
              drag="x"
              dragConstraints={{ left: -200, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                // If dragged left more than 100px, pull the ribbon
                if (info.offset.x < -100) {
                  setRibbonPulled(true);
                } else {
                  setRibbonPulled(false);
                }
              }}
              onClick={() => {
                // Toggle ribbon on click
                setRibbonPulled(!ribbonPulled);
              }}
              whileDrag={{ scale: 1.05 }}
              whileHover={{ scale: 1.1 }}
              animate={{
                x: ribbonPulled ? -200 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <div className="relative w-12 h-32 bg-gradient-to-l from-buttery to-buttery/80 border-l-2 border-black shadow-lg flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-1 h-8 bg-black/60 rounded-full" />
                  <div className="w-1 h-8 bg-black/60 rounded-full" />
                  <div className="w-1 h-8 bg-black/60 rounded-full" />
                </div>
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px] border-l-black" />
              </div>
            </motion.div>
          )}

          {/* Progress indicator only when rolled out */}
          {rolledOut && (
            <div className="absolute bottom-0 left-44 right-8 h-1 flex items-center mt-4">
              <div className="relative w-full h-full">
                {/* Track */}
                <div className="absolute left-0 right-0 top-0 h-0.5 bg-zinc-800/50 rounded-full" />
                {/* Progress bar */}
                <motion.div
                  className="absolute left-0 top-0 h-0.5 bg-gradient-to-r from-amber-500 to-[#E11D48] rounded-full origin-left"
                  style={{ scaleX: scrollXProgress }}
                />
                {/* Dots + tiny red labels */}
                <div className="absolute left-0 right-0 top-0 flex justify-between items-center -translate-y-[1px]">
                  {images.map((_, index) => {
                    const isCurrent = selectedImage === index;
                    const isLast = index === images.length - 1;
                    return (
                      <div
                        key={index}
                        className="relative flex items-center justify-center"
                      >
                        {(isCurrent || isLast) && (
                          <span
                            className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] leading-none font-medium ${
                              isCurrent
                                ? "text-[#E11D48]"
                                : "text-[#E11D48]/80"
                            } pointer-events-none select-none`}
                          >
                            {isLast ? images.length : index + 1}
                          </span>
                        )}
                        <motion.div
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            isCurrent
                              ? "bg-[#E11D48] scale-150 shadow-[0_0_8px_rgba(225,29,72,0.6)]"
                              : "bg-zinc-600"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Simple Preview Modal for Tablet Landscape and Mobile */}
      <AnimatePresence>
        {(isTabletLandscape || isMobileDevice) && isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center ${
              isMobileDevice && isLandscape ? 'p-0' : 'p-8'
            }`}
            onClick={(e) => {
              // Close when clicking on the backdrop or empty space
              // Don't close if clicking on the image container or its children
              const target = e.target as HTMLElement;
              const imageContainer = target.closest('.relative.flex.items-center.justify-center.bg-black');
              const closeButton = target.closest('button[aria-label="Close preview"]');
              const counter = target.closest('.text-black');
              
              // Only close if not clicking on image container, close button, or counter
              if (!imageContainer && !closeButton && !counter) {
                setIsPreviewOpen(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`relative flex flex-col items-center ${
                isMobileDevice && isLandscape 
                  ? 'w-full h-full' 
                  : 'w-full max-w-5xl max-h-[90vh]'
              }`}
              onClick={(e) => {
                // Close when clicking on empty space within the container
                // Don't close if clicking on image container, close button, or counter
                const target = e.target as HTMLElement;
                const imageContainer = target.closest('.relative.flex.items-center.justify-center.bg-black');
                const closeButton = target.closest('button[aria-label="Close preview"]');
                const counter = target.closest('.text-black');
                
                // Close if clicking on empty space (container itself) and not on image/counter/button
                if (target === e.currentTarget || (!imageContainer && !closeButton && !counter)) {
                  setIsPreviewOpen(false);
                }
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsPreviewOpen(false)}
                className={`absolute text-white text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 active:bg-white/20 transition-colors z-10 ${
                  isMobileDevice && isLandscape 
                    ? 'top-4 right-4' 
                    : '-top-12 right-0'
                }`}
                aria-label="Close preview"
              >
                ×
              </button>

              {/* Image - Swipeable */}
              <motion.div 
                className={`relative flex items-center justify-center bg-black overflow-hidden cursor-grab active:cursor-grabbing ${
                  isMobileDevice && isLandscape 
                    ? 'w-full h-full' 
                    : 'w-full h-[70vh] rounded-lg'
                }`}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  const threshold = 100; // Minimum swipe distance
                  if (info.offset.x > threshold) {
                    // Swiped right - go to previous
                    setPreviewImageIndex((prev) => 
                      prev > 0 ? prev - 1 : images.length - 1
                    );
                  } else if (info.offset.x < -threshold) {
                    // Swiped left - go to next
                    setPreviewImageIndex((prev) => 
                      prev < images.length - 1 ? prev + 1 : 0
                    );
                  }
                }}
              >
                <motion.img
                  key={previewImageIndex}
                  src={images[previewImageIndex]}
                  alt={`Photo ${previewImageIndex + 1}`}
                  className={`pointer-events-none ${
                    isMobileDevice && isLandscape
                      ? 'w-full h-full object-contain'
                      : 'max-w-full max-h-full object-contain'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    maxWidth: isMobileDevice && isLandscape ? '100vw' : undefined,
                    maxHeight: isMobileDevice && isLandscape ? '100vh' : undefined,
                    width: isMobileDevice && isLandscape ? 'auto' : undefined,
                    height: isMobileDevice && isLandscape ? '100%' : undefined,
                  }}
                />
              </motion.div>

              {/* Image counter - adjust position for landscape */}
              <div 
                className={`flex items-center justify-center ${
                  isMobileDevice && isLandscape ? 'absolute bottom-4 left-1/2 -translate-x-1/2' : 'mt-6'
                }`}
              >
                <span 
                  className="text-black font-mono text-sm font-semibold bg-white/80 px-4 py-2 rounded-lg"
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
                  }}
                >
                  {previewImageIndex + 1} / {images.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo in bottom right of viewport - only when tablet or mobile preview is open */}
      {(isTabletLandscape || isMobileDevice) && isPreviewOpen && (
        <img
          src={isDarkMode ? "/media/boku_home_white.svg" : "/media/boku_home.svg"}
          alt="BOKU"
          className="fixed bottom-4 right-4 w-24 h-auto opacity-60 z-[101] pointer-events-none"
        />
      )}


      {/* Hide scrollbar and tablet landscape styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        /* Tablet landscape: 768px-1024px width, landscape orientation (includes iPad Mini 1024x768) */
        @media (min-width: 768px) and (max-width: 1025px) and (orientation: landscape) {
          .tablet-landscape-canister {
            width: 8rem !important; /* 32 = 8rem */
            height: 9.5rem !important; /* 38 = 9.5rem */
          }
          .tablet-landscape-reel-scroll {
            padding-left: 9rem !important; /* 36 = 9rem, adjusted for smaller canister */
            min-height: 38px !important; /* Match smaller canister height */
          }
          .tablet-landscape-ribbon {
            display: block !important;
          }
        }
        /* Ensure desktop/laptop (> 1025px) doesn't get tablet styles */
        @media (min-width: 1025px) {
          .tablet-landscape-canister {
            width: 10rem !important; /* Restore desktop size */
            height: 12rem !important; /* Restore desktop size */
          }
          .tablet-landscape-reel-scroll {
            padding-left: 11rem !important; /* Restore desktop padding */
            min-height: 48px !important; /* Restore desktop min-height */
          }
          .tablet-landscape-ribbon {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

