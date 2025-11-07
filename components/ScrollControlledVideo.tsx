import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

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
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    const card = cardRef.current;
    if (!video || !container || !card) return;

    video.muted = true;
    video.preload = "auto";

    let duration = 0;
    const onMeta = () => {
      duration = video.duration;
      // Sync video time
      gsap.to(video, {
        currentTime: duration,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      });
      // Slide-in-from-left applies ONLY TO CARD (video card)
      gsap.fromTo(card,
        { x: '-100vw', opacity: 0 },
        {
          x: '0vw', opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            end: 'top center',
            scrub: true,
          },
        }
      );
    };
    video.addEventListener('loadedmetadata', onMeta);
    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-screen left-1/2 right-1/2 -translate-x-1/2 relative overflow-visible flex justify-center items-center py-8 bg-white/85 shadow-lg ${className}`}
      style={{ position: 'relative', ...style, boxShadow: '0 0 48px 0 rgba(0,0,0,0.04)' }}
    >
      <div ref={cardRef} className="relative max-w-3xl w-full aspect-video flex justify-center items-center">
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          className="w-full h-full object-cover border-8 border-white rounded-2xl shadow-2xl"
          style={{ pointerEvents: 'none', background: '#fff' }}
        />
        {/* Gradient overlays for visual polish */}
        <div
          className="absolute top-0 left-0 w-full h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)' }}
        />
      </div>
    </div>
  );
}

