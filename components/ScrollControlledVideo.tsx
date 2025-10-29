import { useRef, useEffect, useState } from "react";

interface ScrollControlledVideoProps {
  videoSrc: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrollControlledVideo({ 
  videoSrc, 
  className = "",
  style
}: ScrollControlledVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const scrollAccumulatorRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    
    if (!video || !container) return;

    // Ensure video is loaded
    video.muted = true;
    video.preload = "auto";

    const handleWheel = (e: WheelEvent) => {
      if (!isHovering) return;
      
      // Prevent default scroll behavior
      e.preventDefault();
      e.stopPropagation();

      // Accumulate scroll delta
      scrollAccumulatorRef.current += e.deltaY;

      // Map scroll to video time
      // Adjust sensitivity: larger divisor = less sensitive
      const sensitivity = 10;
      const timeChange = scrollAccumulatorRef.current / sensitivity;
      
      // Get video duration
      const duration = video.duration;
      if (isNaN(duration)) return;

      // Calculate new time (clamp between 0 and duration)
      let newTime = video.currentTime + timeChange;
      newTime = Math.max(0, Math.min(duration, newTime));
      
      // Set video time
      video.currentTime = newTime;
      
      // Reset accumulator after applying
      scrollAccumulatorRef.current = 0;
    };

    // Add wheel event listener with passive: false to allow preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isHovering]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        cursor: isHovering ? 'ns-resize' : 'default',
        ...style
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{
          pointerEvents: 'none'
        }}
      />
      
      {/* Hover indicator */}
      {isHovering && (
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
          Scroll to control
        </div>
      )}
      
      {/* Gradient overlays for visual polish */}
      <div 
        className="absolute top-0 left-0 w-full h-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)'
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-full h-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)'
        }}
      />
    </div>
  );
}

