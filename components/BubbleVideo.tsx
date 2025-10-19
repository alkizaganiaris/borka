import { memo } from "react";
import { motion } from "motion/react";

interface BubbleVideoProps {
  isVisible: boolean;
  previewPosition: { top: number; height: number };
}

export const BubbleVideo = memo(function BubbleVideo({ isVisible, previewPosition }: BubbleVideoProps) {
  if (!isVisible || previewPosition.height === 0) {
    return null;
  }

  return (
    <motion.video
      key="bubble-video" // Add stable key to prevent remounting
      className="absolute w-48 h-48 object-contain pointer-events-none z-50"
      style={{
        left: 'calc(33vw - 400px)', // Position to the left of the preview box
        top: previewPosition.top + (previewPosition.height / 2) - 96, // Center video with preview
      }}
      autoPlay
      muted
      playsInline
      loop={false}
      initial={{ 
        scale: 0.8,
        opacity: 0,
      }}
      animate={{ 
        scale: 1,
        opacity: 1,
      }}
      transition={{ 
        duration: 0.5, 
        ease: "easeOut",
      }}
    >
      <source src="/pop_bubbles.mp4" type="video/mp4" />
    </motion.video>
  );
});
