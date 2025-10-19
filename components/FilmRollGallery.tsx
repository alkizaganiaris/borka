import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, useScroll } from "motion/react";
import { FilmFrame } from "./FilmFrame";
import { PhotoStackPreview, type StackItem } from "./PhotoStackPreview";
import DecryptedText from "./DecryptedText";

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
}


function NotesContent({ 
  compact = false, 
  title = "inspiration", 
  subtitle = "/ ˌɪn spəˈreɪ ʃən /",
  filmUsed,
  year,
  photos,
}: { 
  compact?: boolean;
  title?: string;
  subtitle?: string;
  filmUsed?: string;
  year?: string;
  photos?: number;
}) {
  const monoFont =
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";

  return (
    <div
      style={{ fontFamily: monoFont }}
      className={
        compact
          ? "text-zinc-900 text-sm leading-tight tracking-tight"
          : "text-zinc-900 text-base leading-tight tracking-tight"
      }
    >
      <h2
        className={
          compact
            ? "font-semibold uppercase pointer-events-auto text-2xl"
            : "text-lg font-semibold uppercase pointer-events-auto"
        }
      >
        <DecryptedText 
          text={title}
          speed={35}
          maxIterations={12}
          animateOn="hover"
          revealDirection="start"
        />
      </h2>
      <p className="text-zinc-600 mb-0">{subtitle}</p>

      {/* Film metadata */}
      {(filmUsed || year || photos) && (
        <div className="mt-4 space-y-0.5 text-zinc-600 text-xs">
          {filmUsed && <p>Film: {filmUsed}</p>}
          {year && <p>Year: {year}</p>}
          {photos && <p>Photos: {photos}</p>}
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
}: FilmRollGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [stack, setStack] = useState<StackItem[]>([]);
  const [internalRolledOut, setInternalRolledOut] = useState(false);
  
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
      {/* Preview box (stack of chosen photos) */}
      <div ref={previewRef}>
        <PhotoStackPreview 
          stack={stack} 
          rolledOut={rolledOut} 
          title={title}
          subtitle={subtitle}
          filmUsed={filmUsed}
          description={description}
        />
      </div>

      {/* Reel section */}
      <div className="relative w-full px-4 pb-10">
        <div className="max-w-7xl mx-auto relative">
          {/* Canister (toggle rollout) */}
          <motion.button
            aria-label="Toggle film"
            onClick={() => {
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
            initial={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04 }}
            className="absolute left-0 top-[7.5%] z-30 w-40 h-48 flex items-center justify-center"
          >
            <div className="relative w-40 h-70">
              <img
                src="/film-canister.png"
                alt="Film Roll"
                className="w-full h-full object-contain drop-shadow-2xl"
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
            className="relative overflow-x-auto overflow-y-hidden scrollbar-hide pl-44 pr-8 flex items-center mt-8"
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
                animate={animationsEnabled ? (rolledOut ? "off" : "on") : false}
                variants={{
                  on: { x: 0, opacity: 1 },
                  off: { x: "40vw", opacity: 0 },
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
                />
              </motion.div>
            </div>

            {/* LANE DESCRIPTION (pinned overlay: Y fixed, X animates) - Right half */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                left: "calc(50% + 1rem)",
                top: "50%",
                transform: "translateY(-50%)",
                width: "calc(50% - 2rem)",
              }}
            >
              <motion.div
                initial={{ x: 0, opacity: 1 }}
                animate={animationsEnabled ? (rolledOut ? "off" : "on") : false}
                variants={{
                  on: { x: 0, opacity: 1 },
                  off: { x: "40vw", opacity: 0 },
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1],
                  delay: rolledOut ? 0.05 : REEL_DUR,
                }}
                style={{ willChange: "transform, opacity" }}
              >
                {description && (
                  <div className="text-white text-sm max-w-lg leading-relaxed bg-black/20 px-2 py-1 rounded">
                    {description}
                  </div>
                )}
              </motion.div>
            </div>
          </div>

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

      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

