import { useState } from "react";
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
}

export function PhotoStackPreview({
  stack,
  rolledOut,
  className = "",
}: PhotoStackPreviewProps) {
  const [isTopHovered, setIsTopHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, height: 0 }}
      animate={{
        opacity: rolledOut ? 1 : 0,
        scale: rolledOut ? 1 : 0.95,
        height: rolledOut ? "auto" : 0,
      }}
      transition={{ duration: 0.5 }}
      className={`max-w-4xl mx-auto px-4 ${className}`}
      style={{ 
        marginBottom: rolledOut ? "2rem" : "0",
        overflow: rolledOut ? "visible" : "hidden"
      }}
    >
      <div className="relative aspect-video overflow-visible flex items-center justify-center rounded-2xl border-2 border-black p-8">
        {/* Diagonal color blocks */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-yellow-300/80" style={{ clipPath: 'polygon(0 0, 50% 0, 25% 100%, 0 100%)' }}></div>
          <div className="absolute inset-0 bg-purple-300/80" style={{ clipPath: 'polygon(50% 0, 100% 0, 75% 100%, 25% 100%)' }}></div>
          <div className="absolute inset-0 bg-blue-300/80" style={{ clipPath: 'polygon(100% 0, 100% 100%, 75% 100%)' }}></div>
          <div className="absolute inset-0 bg-pink-300/80" style={{ clipPath: 'polygon(0 100%, 25% 100%, 0 50%)' }}></div>
        </div>
        {/* STACK: newest on top */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: "74%", height: "74%" }}
        >
          {stack.map((item, i) => {
            const isTop = i === stack.length - 1;
            const hoverActive = isTop && isTopHovered;
            
            // Calculate scale to fit the full preview when hovering
            const stackSize = 0.74; // 74% of preview (current container size)
            const hoverScale = 1.4; // Adjust this value to control hover zoom (1.5 = 150% of original size)
            const scaleToFit = hoverActive ? hoverScale : (isTop ? 1.02 : 1);
            
            return (
              <motion.div
                key={item.key}
                className="absolute"
                style={{
                  width: "100%",
                  height: "100%",
                  zIndex: isTop ? 999 : i,
                  pointerEvents: isTop ? "auto" : "none",
                }}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  rotate: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: 1,
                  rotate: hoverActive ? 0 : item.rot,
                  x: hoverActive ? 0 : item.dx,
                  y: hoverActive ? 0 : item.dy,
                  scale: scaleToFit,
                  boxShadow: hoverActive
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
                onHoverStart={() => isTop && setIsTopHovered(true)}
                onHoverEnd={() => isTop && setIsTopHovered(false)}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={item.src}
                    alt={`Photo ${item.id}`}
                    className="w-full h-full object-cover"
                    style={{
                      borderRadius: 0,
                      filter:
                        "contrast(1.05) brightness(0.95) saturate(1.1)",
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
      </div>
    </motion.div>
  );
}

