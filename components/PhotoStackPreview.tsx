import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

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
  allImages?: string[]; // All images to preload
  selectedImageIndex?: number; // Index of the currently selected image from the reel
  onPreviewIndexChange?: (index: number) => void; // Callback when preview index changes
  previewBackgroundColor?: 'white' | 'dark-teal' | 'ochre-yellow'; // Background color for preview
  onPreviewBackgroundColorChange?: (color: 'white' | 'dark-teal' | 'ochre-yellow') => void; // Callback when background color changes
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
  allImages = [],
  selectedImageIndex,
  onPreviewIndexChange,
  previewBackgroundColor = 'white',
  onPreviewBackgroundColorChange,
  rolledOut,
  className = "",
  title,
  subtitle,
  filmUsed,
  isDarkMode = false,
}: PhotoStackPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);

  // Use allImages if provided, otherwise fall back to stack
  const imagesToShow = allImages.length > 0 ? allImages : stack.map(item => item.src);

  // Preload all images when rolled out
  useEffect(() => {
    if (rolledOut && imagesToShow.length > 0) {
      const preloadPromises = imagesToShow.map((src) => {
        return new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(src);
          img.onerror = () => reject(src);
          img.src = src;
        });
      });

      Promise.allSettled(preloadPromises).then((results) => {
        const loaded = results
          .filter((result) => result.status === 'fulfilled')
          .map((result) => (result as PromiseFulfilledResult<string>).value);
        setPreloadedImages(loaded);
      });
    }
  }, [rolledOut, imagesToShow]);

  // Update current index when a new image is selected from the reel
  useEffect(() => {
    if (selectedImageIndex !== undefined && selectedImageIndex >= 0 && selectedImageIndex < imagesToShow.length) {
      setCurrentIndex(selectedImageIndex);
      onPreviewIndexChange?.(selectedImageIndex);
    }
  }, [selectedImageIndex, imagesToShow.length, onPreviewIndexChange]);

  // Reset to first image when images change (only if no specific selection)
  useEffect(() => {
    if (imagesToShow.length > 0 && selectedImageIndex === undefined) {
      setCurrentIndex(0);
    }
  }, [imagesToShow.length, selectedImageIndex]);

  // Handle keyboard navigation and close zoom on Escape
  useEffect(() => {
    if (!rolledOut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed && e.key === 'Escape') {
        setIsZoomed(false);
      } else if (!isZoomed) {
        if (e.key === 'ArrowLeft') {
          setCurrentIndex((prev) => {
            const newIndex = prev > 0 ? prev - 1 : imagesToShow.length - 1;
            onPreviewIndexChange?.(newIndex);
            return newIndex;
          });
        } else if (e.key === 'ArrowRight') {
          setCurrentIndex((prev) => {
            const newIndex = prev < imagesToShow.length - 1 ? prev + 1 : 0;
            onPreviewIndexChange?.(newIndex);
            return newIndex;
          });
        }
      } else if (isZoomed) {
        if (e.key === 'ArrowLeft') {
          setCurrentIndex((prev) => {
            const newIndex = prev > 0 ? prev - 1 : imagesToShow.length - 1;
            onPreviewIndexChange?.(newIndex);
            return newIndex;
          });
        } else if (e.key === 'ArrowRight') {
          setCurrentIndex((prev) => {
            const newIndex = prev < imagesToShow.length - 1 ? prev + 1 : 0;
            onPreviewIndexChange?.(newIndex);
            return newIndex;
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rolledOut, isZoomed, imagesToShow.length, onPreviewIndexChange]);

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : imagesToShow.length - 1;
      onPreviewIndexChange?.(newIndex);
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev < imagesToShow.length - 1 ? prev + 1 : 0;
      onPreviewIndexChange?.(newIndex);
      return newIndex;
    });
  };

  const handleImageClick = () => {
    setIsZoomed(true);
  };

  const handleCloseZoom = () => {
    setIsZoomed(false);
  };

  const currentImageSrc = imagesToShow.length > 0 ? imagesToShow[currentIndex] : null;

  // Background color mapping
  const backgroundColorMap = {
    'white': '#FFFFFF',
    'dark-teal': '#1e5a55',
    'ochre-yellow': '#F4DE7C'
  };

  return (
    <>
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
            ease: [0.34, 1.56, 0.64, 1],
            opacity: { duration: 0.5, ease: "easeOut" },
            scale: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
          }}
          className={`photo-stack-preview-container px-4 tablet-landscape:px-6 tablet-landscape:w-[92vw] ${className}`}
          style={{ 
            marginBottom: rolledOut ? "2rem" : "0",
            overflow: rolledOut ? "visible" : "hidden",
            width: '87vw',
            marginLeft: 'auto',
            marginRight: 'auto',
            zIndex: 1,
            position: 'relative'
          }}
        >
          <motion.div 
            className="photo-stack-preview-inner relative overflow-hidden flex items-center justify-center p-8 tablet-landscape:p-10 tablet-landscape:h-[70vh] border border-black"
            style={{ 
              borderWidth: '1px',
              height: '63vh',
              borderRadius: '16px',
              backgroundColor: backgroundColorMap[previewBackgroundColor]
            }}
          >
            {/* Logo in bottom left */}
            <motion.img
              src={isDarkMode ? "/media/boku_home.svg" : "/media/boku_home.svg"}
              alt="BOKU"
              className="absolute bottom-4 left-4 z-10"
              style={{
                width: '120px',
                height: 'auto',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: rolledOut ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />

            {/* Image display area */}
            {currentImageSrc && (
              <div className="relative w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full flex items-center justify-center cursor-pointer"
                    style={{ maxWidth: '80%', maxHeight: '80%' }}
                    onClick={handleImageClick}
                  >
                    <img
                      src={currentImageSrc}
                      alt={`Photo ${currentIndex + 1}`}
                      className="max-w-full max-h-full object-contain border border-black"
                      style={{
                        borderRadius: '4px',
                        borderWidth: '1px',
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* Navigation buttons */}
            {imagesToShow.length > 1 && (
              <>
                {/* Previous button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white border border-black rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  aria-label="Previous image"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                {/* Next button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white border border-black rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  aria-label="Next image"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </>
            )}

            {/* Image counter */}
            {imagesToShow.length > 1 && (
              <div
                className="absolute bottom-4 right-4 bg-white/80 border border-black rounded-lg px-3 py-2 text-black text-sm z-10"
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
                }}
              >
                {currentIndex + 1} / {imagesToShow.length}
              </div>
            )}

            {/* Title info overlay with color picker */}
            {(title || subtitle || filmUsed) && (
              <motion.div 
                className="absolute top-4 right-4 bg-white/80 border border-black rounded-lg px-3 py-2 text-black text-sm z-10 flex items-center gap-2"
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: rolledOut ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center gap-1">
                  {title && (
                    <span className="font-bold mr-3">{title}</span>
                  )}
                  {subtitle && (
                    <span className="opacity-90 mr-3">{subtitle}</span>
                  )}
                  {filmUsed && (
                    <span className="opacity-75">Film: {filmUsed}</span>
                  )}
                </div>
                
                {/* Color picker circles */}
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-black/20">
                  <button
                    onClick={() => onPreviewBackgroundColorChange?.('white')}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      previewBackgroundColor === 'white' 
                        ? 'border-black scale-125' 
                        : 'border-black/30 hover:border-black/60'
                    }`}
                    style={{ backgroundColor: '#FFFFFF' }}
                    aria-label="White background"
                  />
                  <button
                    onClick={() => onPreviewBackgroundColorChange?.('dark-teal')}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      previewBackgroundColor === 'dark-teal' 
                        ? 'border-black scale-125' 
                        : 'border-black/30 hover:border-black/60'
                    }`}
                    style={{ backgroundColor: '#1e5a55' }}
                    aria-label="Dark teal background"
                  />
                  <button
                    onClick={() => onPreviewBackgroundColorChange?.('ochre-yellow')}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      previewBackgroundColor === 'ochre-yellow' 
                        ? 'border-black scale-125' 
                        : 'border-black/30 hover:border-black/60'
                    }`}
                    style={{ backgroundColor: '#F4DE7C' }}
                    aria-label="Ochre yellow background"
                  />
                </div>
              </motion.div>
            )}
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

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && currentImageSrc && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-md"
              onClick={handleCloseZoom}
            />
            
            {/* Zoomed image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-8"
              onClick={handleCloseZoom}
            >
              <div 
                className="relative flex items-center justify-center"
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  width: '100%',
                  height: '100%'
                }}
              >
                <img
                  src={currentImageSrc}
                  alt={`Photo ${currentIndex + 1}`}
                  className="object-contain border border-black"
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    width: 'auto',
                    height: 'auto',
                    borderRadius: '8px',
                    borderWidth: '1px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                
                {/* Close button */}
                <button
                  onClick={handleCloseZoom}
                  className="absolute -top-12 right-0 bg-white/90 hover:bg-white border border-black rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  aria-label="Close zoom"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                {/* Navigation in zoom mode */}
                {imagesToShow.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-black rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      aria-label="Previous image"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-black rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      aria-label="Next image"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
