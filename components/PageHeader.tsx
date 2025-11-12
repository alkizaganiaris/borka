import clsx from "clsx";
import { motion } from "motion/react";
import { useState } from "react";

interface PageHeaderProps {
  title: string;
  isDarkMode?: boolean;
}

export function PageHeader({ title, isDarkMode = false }: PageHeaderProps) {
  const monoFont = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";
  const isCeramicsPage = title === "Ceramics";
  const isJournalPage = title === "Journal";
  const isPhotographyPage = title === "Photography";
  const [journalHeaderIndex, setJournalHeaderIndex] = useState(0);

  const handleJournalHeaderClick = () => {
    if (isJournalPage && journalHeaderIndex < 7) {
      setJournalHeaderIndex(prev => Math.min(prev + 1, 7));
    }
  };

  const ceramicsImageSrc = isCeramicsPage
    ? isDarkMode
      ? "/media/ceramics_unglazed.png"
      : "/media/ceramics_glazed.png"
    : null;
  const journalImageSrc = isJournalPage ? `/media/journal_header_${journalHeaderIndex}.png` : null;
  const photographyImageSrc = isPhotographyPage ? "/media/photography_header.png" : null;

  return (
    <motion.header
      className="w-full pt-16 px-8 text-black"
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
            <motion.img
              key={journalImageSrc}
              src={journalImageSrc}
              alt="Journal title"
              className="h-auto max-w-full"
              style={{
                width: "min(680px, 82vw)",
                cursor: journalHeaderIndex >= 7 ? "default" : "pointer",
                pointerEvents: journalHeaderIndex >= 7 ? "none" : "auto"
              }}
              onClick={handleJournalHeaderClick}
              initial={false}
              animate={{}}
              transition={{ duration: 0 }}
            />
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
               {title === "Journal" && (
                 <>

                   
                   {/* Shavings image - bottom right */}
                   <div className="fixed bottom-[-20px] right-4 z-1">
                     <img 
                       src="/media/shavings_1.png" 
                       alt="Pencil shavings" 
                       className="h-auto"
                       style={{ 
                         width: '300px',
                         opacity: 0.8
                       }}
                     />
                   </div>

                   {/* Coffee/Tea image - center viewport */}
                   <div
                    className="fixed top-1/2 left-1/2 pointer-events-auto"
                    style={{ transform: 'translate(-50%, -35%)', zIndex: 1 }}
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

