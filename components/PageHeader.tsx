import clsx from "clsx";
import { motion } from "motion/react";
import { useState, useRef } from "react";
import { useIsMobile } from "./ui/use-mobile";

interface PageHeaderProps {
  title: string;
  isDarkMode?: boolean;
}

export function PageHeader({ title, isDarkMode = false }: PageHeaderProps) {
  const monoFont = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";
  const isCeramicsPage = title === "Ceramics";
  const isJournalPage = title === "Thoughts";
  const isPhotographyPage = title === "Photography";
  const isMobile = useIsMobile();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; // Reset to first frame
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const handleVideoEnded = () => {
    // Loop the video when it ends
    if (videoRef.current && isVideoPlaying) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const ceramicsImageSrc = isCeramicsPage
    ? isDarkMode
      ? "/media/ceramics_unglazed.png"
      : "/media/ceramics_glazed.png"
    : null;
  const journalImageSrc = isJournalPage ? "/media/inspiration_upscaled.png" : null;
  const photographyImageSrc = isPhotographyPage ? "/media/photography_header.png" : null;

  // Check if journalImageSrc is a video file
  const isVideoFile = (src: string | null): boolean => {
    if (!src) return false;
    const videoExtensions = ['.mov', '.mp4', '.webm', '.ogg', '.avi', '.m4v'];
    return videoExtensions.some(ext => src.toLowerCase().endsWith(ext));
  };

  const isJournalVideo = isJournalPage && journalImageSrc && isVideoFile(journalImageSrc);

  return (
    <motion.header
      className="w-full px-8 text-black pt-[calc(4rem+5vh)] lg:pt-16"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h1
          className={clsx(
            "leading-none mb-8",
            isCeramicsPage || isJournalPage || isPhotographyPage
              ? "flex justify-center"
              : "font-medium uppercase tracking-tight"
          )}
          style={
            isCeramicsPage || isJournalPage || isPhotographyPage
              ? undefined
              : {
                  fontFamily: monoFont,
                  fontSize: "13vw"
                }
          }
        >
          {isCeramicsPage && ceramicsImageSrc ? (
            <motion.img
              key={ceramicsImageSrc}
              src={ceramicsImageSrc}
              alt="Ceramics title"
              className="h-auto max-w-full"
              style={{ width: "min(680px, 80vw)" }}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ) : isJournalPage && journalImageSrc ? (
            isJournalVideo ? (
              <motion.video
                ref={videoRef}
                key={journalImageSrc}
                src={journalImageSrc}
                className="h-auto max-w-full cursor-pointer"
                style={{ width: "min(680px, 82vw)" }}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                preload="metadata"
                muted
                playsInline
                onClick={handleVideoClick}
                onLoadedMetadata={() => {
                  // Ensure first frame is shown initially
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                  }
                }}
                onEnded={handleVideoEnded}
              />
            ) : (
              <motion.img
                key={journalImageSrc}
                src={journalImageSrc}
                alt="Thoughts title"
                className="h-auto max-w-full"
                style={{ width: "min(680px, 82vw)" }}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )
          ) : isPhotographyPage && photographyImageSrc ? (
            <motion.img
              key={photographyImageSrc}
              src={photographyImageSrc}
              alt="Photography title"
              className="h-auto max-w-full"
              style={{ width: "min(720px, 82vw)" }}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ) : (
            title
          )}
        </h1>
               {title === "Thoughts" && !isMobile && (
                 <>

                   
                   {/* Shavings image - bottom right - Hidden on mobile */}
                   <div className="fixed bottom-[-20px] right-4 z-1">
                     <motion.img 
                       src="/media/shavings_1.png" 
                       alt="Pencil shavings" 
                       className="h-auto"
                       style={{ 
                         width: '300px',
                         opacity: 0.8
                       }}
                       initial={{ opacity: 0, y: 25, rotate: -4 }}
                       animate={{ opacity: 1, y: 0, rotate: 0 }}
                       transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
                     />
                   </div>

                   {/* Coffee/Tea image - center viewport - Hidden on mobile */}
                   <div
                    className="fixed top-1/2 left-1/2 pointer-events-auto"
                    style={{ transform: 'translate(-50%, -35%)', zIndex: 1  }}
                  >
                     <motion.img 
                       src={isDarkMode ? "/media/tea.png" : "/media/coffee.png"} 
                       alt={isDarkMode ? "Tea" : "Coffee"} 
                       className="h-auto cursor-pointer"
                       style={{ 
                         width: '400px',
                         opacity: 1,
                         pointerEvents: 'auto'
                       }}
                       initial={{ opacity: 0, scale: 0.85, y: -20 }}
                       animate={{ opacity: 1, scale: 1, y: 0 }}
                       transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
                       whileHover={{ 
                         rotate: 58,
                         transition: { duration: 0.3, ease: "easeOut" }
                       }}
                       whileTap={{ scale: 0.95 }}
                     />
                   </div>
                 </>
               )}
      </div>
    </motion.header>
  );
}

