import { useRef, useEffect, useState } from "react";

interface PhotoItem {
  src: string;
  alt: string;
}

interface HorizontalPhotoRowProps {
  images: PhotoItem[];
  imageSize?: number;
  spacing?: number;
  enableHover?: boolean;
  autoScroll?: boolean;
  scrollDirection?: 'left' | 'right';
  scrollSpeed?: number;
  className?: string;
  rowIndex?: number; // For staggered animation timing
}

export default function HorizontalPhotoRow({
  images,
  imageSize = 120,
  spacing = 20,
  enableHover = true,
  autoScroll = false,
  scrollDirection = 'right',
  scrollSpeed = 10,
  className = "",
  rowIndex = 0
}: HorizontalPhotoRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(rowIndex * 100); // Stagger initial positions
  const animationFrameRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [duplicateCount, setDuplicateCount] = useState(3); // Start with 3 duplicates

  // Calculate required duplicates to fill viewport
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const viewportWidth = window.innerWidth;
    const singleSetWidth = images.length * (imageSize + spacing);
    // Calculate how many duplicates we need - ensure we have 3 full viewport widths of content
    const requiredDuplicates = Math.ceil((viewportWidth * 4) / singleSetWidth);
    setDuplicateCount(Math.max(5, requiredDuplicates));
  }, [images.length, imageSize, spacing]);

  // Auto-scroll animation
  useEffect(() => {
    if (!autoScroll || !containerRef.current) return;

    const container = containerRef.current;
    const singleSetWidth = images.length * (imageSize + spacing);
    const speed = scrollDirection === 'right' ? scrollSpeed : -scrollSpeed;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      // Pause animation when hovering
      if (isPaused) {
        lastTime = currentTime; // Keep lastTime updated so we don't jump when unpausing
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Update position
      scrollPositionRef.current += speed * (deltaTime / 1000);

      // Use modulo to create seamless loop, handling direction properly
      if (scrollDirection === 'right') {
        // For right direction, we need to handle negative modulo properly
        scrollPositionRef.current = ((scrollPositionRef.current % singleSetWidth) + singleSetWidth) % singleSetWidth;
      } else {
        // For left direction, standard modulo works fine
        scrollPositionRef.current = scrollPositionRef.current % singleSetWidth;
      }

      // Apply transform using translate3d for better performance
      container.style.transform = `translate3d(${-scrollPositionRef.current}px, 0, 0)`;
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [autoScroll, scrollDirection, scrollSpeed, images.length, imageSize, spacing, isPaused]);

  // Duplicate images based on calculated count
  const duplicatedImages = Array(duplicateCount).fill(images).flat();
  const totalWidth = duplicatedImages.length * (imageSize + spacing);

  return (
    <div 
      className={`relative w-full overflow-hidden ${className}`}
      style={{ 
        touchAction: 'none',
        userSelect: 'none',
        contain: 'layout style paint' // CSS containment for performance
      }}
    >
      <div
        ref={containerRef}
        className="flex items-center"
        style={{
          width: `${totalWidth}px`,
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
        }}
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={`${index}-${image.src}`}
            className={`flex-shrink-0 ${enableHover ? 'ceramic-hover' : ''}`}
            style={{
              width: `${imageSize}px`,
              height: `${imageSize}px`,
              marginRight: `${spacing}px`,
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <img
              src={image.src}
              alt=""
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
              decoding="async"
              draggable="false"
              style={{
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Gradient overlays */}
      <div 
        className="absolute left-0 top-0 w-20 h-full pointer-events-none"
        style={{
          background: 'linear-gradient(to right, white, transparent)',
          zIndex: 1
        }}
      />
      <div 
        className="absolute right-0 top-0 w-20 h-full pointer-events-none"
        style={{
          background: 'linear-gradient(to left, white, transparent)',
          zIndex: 1
        }}
      />
    </div>
  );
}
