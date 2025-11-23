import { motion, AnimatePresence } from "motion/react";
import { PageHeader } from "../components/PageHeader";
import { useState, useRef, useEffect } from "react";
import TextType from "../components/TextType";
import "../styles/fonts.css";
import StaggeredMenu from "../components/StaggeredMenu";
import { getJournalEntries } from "../src/lib/sanityQueries";
import { useIsMobile } from "../components/ui/use-mobile";
import { useTabletLandscape } from "../components/ui/use-tablet-landscape";

interface JournalProps {
  isDarkMode: boolean;
}

interface JournalEntry {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  timestamp: Date;
}

export function Journal({ isDarkMode }: JournalProps) {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typeKey, setTypeKey] = useState(0);
  const [isEntryListHovered, setIsEntryListHovered] = useState(false);
  const [hoveredEntryId, setHoveredEntryId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialDelayComplete, setIsInitialDelayComplete] = useState(false);
  const [readEntries, setReadEntries] = useState<Set<string>>(new Set());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [entryFonts, setEntryFonts] = useState<Map<string, string>>(new Map());
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const isTabletLandscape = useTabletLandscape();
  
  // Configuration values
  const containerTranslateY = -11;
  const textTranslateY = 0;
  const fontSize = 1.4;
  const lineHeight = 2.2;

  // Custom fonts array
  const customFonts = ['Caveat', 'Indie Flower', 'Patrick Hand SC'];

  // Fetch journal entries from Sanity
  useEffect(() => {
    async function fetchEntries() {
      try {
        const entries = await getJournalEntries();
        // Transform Sanity data to match your existing format
        const formatted = entries.map((entry: any) => ({
          id: entry._id,
          title: entry.title,
          date: new Date(entry.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          excerpt: '', // No excerpt in schema
          content: entry.content,
          timestamp: new Date(entry.date)
        }));
        setJournalEntries(formatted);
        
        // Assign random fonts to each entry
        const fonts = new Map<string, string>();
        formatted.forEach((entry: JournalEntry) => {
          const randomFont = customFonts[Math.floor(Math.random() * customFonts.length)];
          fonts.set(entry.id, randomFont);
        });
        setEntryFonts(fonts);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      }
    }
    fetchEntries();
  }, []);

  // Add initial loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300); // 300ms delay before showing content
    return () => clearTimeout(timer);
  }, []);

  // Small additional delay so layout is ready before revealing
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialDelayComplete(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Reset read entries when user comes to this page
  useEffect(() => {
    setReadEntries(new Set());
  }, []);

  // Handle escape key to close selected entry
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedEntry) {
        if (isMobile && isPreviewOpen) {
          handleClosePreview();
        } else {
          // Mark entry as read when closing with escape
          setReadEntries(prev => new Set([...prev, selectedEntry.id]));
          setIsTyping(false);
          setSelectedEntry(null);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEntry, isMobile, isPreviewOpen]);

  // Journal entries are now fetched from Sanity in the useEffect above

  // Sort entries by date (newest first)
  const sortedEntries = [...journalEntries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const playPageTurn = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleEntryClick = (entry: JournalEntry) => {
    if (isMobile) {
      // Mobile: Open preview modal
      setSelectedEntry(entry);
      setTypeKey(prev => prev + 1); // Force TextType to remount
      setIsTyping(true);
      setIsPreviewOpen(true);
      return;
    }

    if (isTabletLandscape) {
      // Tablet landscape: Show preview container to the right
      // If clicking the same entry, deselect it
      if (selectedEntry?.id === entry.id) {
        // Mark previous entry as read when closing it
        if (selectedEntry) {
          setReadEntries(prev => new Set([...prev, selectedEntry.id]));
        }
        setIsTyping(false);
        setSelectedEntry(null);
        return;
      }

      // Mark previous entry as read when switching to a new entry
      if (selectedEntry) {
        setReadEntries(prev => new Set([...prev, selectedEntry.id]));
      }

      // Stop current typing and clear
      setIsTyping(false);
      setSelectedEntry(null);

      // Set new entry and start typing
      setSelectedEntry(entry);
      setTypeKey(prev => prev + 1); // Force TextType to remount
      setIsTyping(true);
      return;
    }

    // Desktop: Original behavior
    // If clicking the same entry, deselect it
    if (selectedEntry?.id === entry.id) {
      // Mark previous entry as read when closing it
      if (selectedEntry) {
        setReadEntries(prev => new Set([...prev, selectedEntry.id]));
      }
      setIsTyping(false);
      setSelectedEntry(null);
      return;
    }

    // Mark previous entry as read when switching to a new entry
    if (selectedEntry) {
      setReadEntries(prev => new Set([...prev, selectedEntry.id]));
    }

    // Stop current typing and clear
    setIsTyping(false);
    setSelectedEntry(null);

    // Play page turn animation
    playPageTurn();

    // Wait for video to finish (adjust timing based on your video length)
    setTimeout(() => {
      setSelectedEntry(entry);
      setTypeKey(prev => prev + 1); // Force TextType to remount
      setIsTyping(true);
    }, 800); // Adjust this delay to match your video duration
  };

  const handleClosePreview = () => {
    if (selectedEntry) {
      setReadEntries(prev => new Set([...prev, selectedEntry.id]));
    }
    setIsTyping(false);
    setSelectedEntry(null);
    setIsPreviewOpen(false);
  };

  const handleRandomThought = () => {
    if (sortedEntries.length === 0) return;
    
    // Pick a random entry
    const randomIndex = Math.floor(Math.random() * sortedEntries.length);
    const randomEntry = sortedEntries[randomIndex];
    
    // Use the same logic as handleEntryClick
    handleEntryClick(randomEntry);
  };

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Photography', ariaLabel: 'View photography', link: '/photography' },
    { label: 'Journal', ariaLabel: 'Read journal entries', link: '/journal' },
    { label: 'Ceramics', ariaLabel: 'View ceramics', link: '/ceramics' }
  ];

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/borbalakun/' },
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'Email', link: 'mailto:hello@borka.com' }
  ];

  return (
    <motion.div 
      className="fixed inset-0 overflow-hidden" 
      style={{
        fontFamily: '"Indie Flower", cursive',
        pointerEvents: isInitialDelayComplete ? 'auto' : 'none'
      }}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: isInitialDelayComplete ? 1 : 0, y: isInitialDelayComplete ? 0 : 30, scale: isInitialDelayComplete ? 1 : 0.98 }}
      exit={{ opacity: 0, y: -30, scale: 1.02 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <PageHeader title="Journal" isDarkMode={isDarkMode} />
      <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <StaggeredMenu
          position="left"
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor="#1C1C1C"
          openMenuButtonColor="#1C1C1C"
          changeMenuColorOnOpen={true}
          colors={['#E875A8', '#3E4BAA', '#3CB4AC']}
          logoUrl=""
          accentColor="#1e5a55"
          isFixed={true}
          onMenuOpen={() => setIsMenuOpen(true)}
          onMenuClose={() => setIsMenuOpen(false)}
        />
      </div>
      
      {/* Opacity overlay when menu is open */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 35
          }}
        />
      )}
      
      <div className="relative w-full h-full">
        {/* Notebook Background - Fixed in Center, Above Background Layer - Hidden on mobile and tablet landscape */}
        {!isMobile && !isTabletLandscape && (
          <div 
            className="fixed inset-0 flex items-center justify-center pointer-events-none" 
            style={{ zIndex: 1 }}
          >
            <motion.video
              ref={videoRef}
              className="opacity-100"
              animate={{
                width: selectedEntry 
                  ? '64vw'
                  : (!selectedEntry && isEntryListHovered ? '48vw' : '40vw'),
                transform: selectedEntry
                  ? 'translateY(20vh)'
                  : (!selectedEntry && isEntryListHovered 
                    ? 'translateY(70vh)' 
                    : 'translateY(80vh)')
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ 
                height: 'auto'
              }}
              src="/media/notebook_transparent.webm"
              muted
              playsInline
            />
          </div>
        )}

        {/* Random thought button - above journal entries on mobile, center bottom on desktop/tablet */}
        {isLoaded && sortedEntries.length > 0 && (
          <>
            {isMobile ? (
              <motion.button
                onClick={handleRandomThought}
                className="fixed z-[10] border-2 border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors font-mono text-sm font-semibold px-4 py-2"
                style={{
                  left: '5vw',
                  top: 'calc(8rem + 20vh - 3.5rem)',
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
                  color: 'black'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Pick a random thought
              </motion.button>
            ) : (
              <div 
                className="fixed z-[10]"
                style={{ 
                  left: '50%',
                  bottom: '2rem',
                  transform: 'translateX(-50%)'
                }}
              >
                <motion.button
                  onClick={handleRandomThought}
                  className="border-2 border-black rounded-lg bg-white hover:bg-black hover:text-white transition-colors font-mono text-sm font-semibold px-3 py-1.5"
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
                    color: 'black'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Pick a random thought
                </motion.button>
              </div>
            )}
          </>
        )}

        {/* Left Sidebar - Entry List (Far Left) - Expanded on mobile */}
        {isLoaded && (
          <div 
            className={`fixed overflow-y-auto px-1 z-1 border-2 border-black rounded-xl bg-white ${
              isMobile ? 'mobile-journal-entries' : ''
            }`}
            style={{ 
              width: isMobile ? '90vw' : (isTabletLandscape ? '24vw' : '20vw'), 
              left: isMobile ? '5vw' : '2rem', 
              top: isMobile ? 'calc(8rem + 20vh)' : (isTabletLandscape ? 'calc(100vh - 58.8vh)' : '30vh'), 
              paddingTop: '0rem', 
              bottom: isMobile ? '4rem' : (isTabletLandscape ? '4vh' : '4vh'), 
              paddingBottom: '0rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {/* Background text */}
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '1.8rem',
                color: 'black',
                fontWeight: 'bold',
                pointerEvents: 'none',
                zIndex: 0,
                whiteSpace: 'nowrap',
                fontFamily: '"Indie Flower", cursive'
              }}
            >
              Thoughts...
            </div>
            <div className="space-y-0 pb-12" 
            style={{ 
              marginTop: '0rem',
              marginBottom: '0rem',
              position: 'relative',
              zIndex: 1
               }}
               >
            {sortedEntries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => handleEntryClick(entry)}
                onMouseEnter={() => {
                  if (!selectedEntry) {
                    setIsEntryListHovered(true);
                    setHoveredEntryId(entry.id);
                  }
                }}
                onMouseLeave={() => {
                  setIsEntryListHovered(false);
                  setHoveredEntryId(null);
                }}
                 className={`w-full text-left p-2    ${
                   selectedEntry?.id === entry.id
                     ? 'text-black shadow-lg'
                     : 'text-black shadow-md'
                 }`}
                 style={{
                   paddingLeft: isMobile ? '20%' : '10%',
                   border: selectedEntry?.id === entry.id ? '2px solid black' : 'none',
                   fontFamily: entryFonts.get(entry.id) || 'Indie Flower',
                   ...(readEntries.has(entry.id)
                     ? {
                         backgroundColor: 'transparent',
                         backgroundImage: 'url(/media/entry_bg.jpeg)',
                         backgroundSize: 'cover',
                         backgroundRepeat: 'no-repeat',
                         backgroundPosition: 'center'
                       }
                     : {
                         backgroundColor: 'transparent',
                         backgroundImage: 'url(/media/entry_bg.jpeg)',
                         backgroundSize: 'cover',
                         backgroundRepeat: 'no-repeat',
                         backgroundPosition: 'center'
                       }),
                   transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
                   transform: hoveredEntryId === entry.id ? 'scale(1.02)' : 'scale(1)'
                 }}
              >
                <h4 
                  className="text-lg mb-0.5"
                  style={{
                    color: 'black',
                    textDecoration: readEntries.has(entry.id) ? 'line-through' : 'none',
                    textDecorationColor: readEntries.has(entry.id) ? 'red' : 'black',
                    textDecorationThickness: '0.5px'
                  }}
                >
                  {entry.title}
                </h4>
                <p 
                  className="text-sm"
                  style={{
                    color: '#71717a'
                  }}
                >
                  {entry.date}
                </p>
              </button>
            ))}
            </div>
          </div>
        )}

        {/* Tablet Landscape Preview Container - To the right of tea/coffee image */}
        {isTabletLandscape && selectedEntry && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed overflow-y-auto px-4 z-[50] border-2 border-black rounded-xl bg-white"
            style={{
              width: '24vw',
              right: '2rem', // Same distance from right edge as journal entries from left edge
              top: 'calc(100vh - 58.8vh)', // Same top as journal entries container
              bottom: '4vh', // Same bottom as journal entries container
              paddingTop: '1rem',
              paddingBottom: '1rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="text-black">
              {/* Title and Date Header */}
              {isTyping && (
                <div 
                  className="mb-4 pb-4 border-b border-black/20"
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    lineHeight: '1.4',
                    fontFamily: entryFonts.get(selectedEntry.id) || 'Indie Flower'
                  }}
                >
                  {selectedEntry.title} — {selectedEntry.date}
                </div>
              )}
              
              {/* Typed Content */}
              {isTyping && (
                <div
                  style={{
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    fontFamily: entryFonts.get(selectedEntry.id) || 'Indie Flower'
                  }}
                >
                  <TextType
                    key={typeKey}
                    text={selectedEntry.content}
                    typingSpeed={5}
                    className="text-black"
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      fontFamily: entryFonts.get(selectedEntry.id) || 'Indie Flower'
                    }}
                    showCursor={false}
                    cursorCharacter="|"
                    loop={false}
                    variableSpeed={{ min: 5, max: 50 }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Content Overlay - Centered over Notebook - Hidden on mobile and tablet landscape */}
        {!isMobile && !isTabletLandscape && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
            <motion.div 
              className="relative pointer-events-auto"
              animate={{
                width: selectedEntry ? '64vw' : '40vw',
                transform: selectedEntry
                  ? `translateY(calc(19vh + ${containerTranslateY}vh))`
                  : (!selectedEntry && isEntryListHovered 
                    ? `translateY(calc(70vh + ${containerTranslateY}vh))` 
                    : `translateY(calc(80vh + ${containerTranslateY}vh))`)
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div 
                className="overflow-auto" 
                style={{ 
                  height: `calc(73vh + ${lineHeight * 2}rem)`,
                  paddingTop: '3rem',
                  paddingBottom: '3rem',
                  paddingLeft: '13%', 
                  paddingRight: '7%',
                  transform: `translateY(-2vh)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <AnimatePresence mode="wait">
                  {selectedEntry ? (
                    <motion.div
                      key={selectedEntry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-black"
                    >
                      {/* Title and Date Header */}
                      {isTyping && (
                        <div 
                          className="mb-2"
                          style={{
                            fontSize: `${fontSize * 1.2}rem`,
                            fontWeight: 'bold',
                            lineHeight: `${lineHeight}`,
                            fontFamily: entryFonts.get(selectedEntry.id) || 'Indie Flower'
                          }}
                        >
                          {selectedEntry.title} — {selectedEntry.date}
                        </div>
                      )}
                      
                      {/* Typed Content */}
                      {isTyping && (
                        <TextType
                          key={typeKey}
                          text={selectedEntry.content}
                          typingSpeed={5}
                          className="text-black"
                          style={{
                            fontSize: `${fontSize}rem`,
                            lineHeight: `${lineHeight}`,
                            fontFamily: entryFonts.get(selectedEntry.id) || 'Indie Flower'
                          }}
                          showCursor={false}
                          cursorCharacter="|"
                          loop={false}
                          variableSpeed={{ min: 5, max: 50 }}
                        />
                      )}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}

        {/* Mobile Preview Modal */}
        <AnimatePresence>
          {isMobile && isPreviewOpen && selectedEntry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              style={{ backgroundColor: '#0f4a45' }}
              onClick={(e) => {
                // Close if click is on the backdrop, not on the modal content
                const target = e.target as HTMLElement;
                const isModalContent = target.closest('.journal-preview-content');
                const isCloseButton = target.closest('.close-preview-button');
                if (!isModalContent && !isCloseButton) {
                  handleClosePreview();
                }
              }}
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="journal-preview-content relative w-full max-w-2xl max-h-[90vh] bg-white rounded-lg overflow-hidden flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal content */}
                  <div className="overflow-y-auto p-6 flex-1">
                  <AnimatePresence mode="wait">
                    {selectedEntry && (
                      <motion.div
                        key={selectedEntry.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-black"
                      >
                        {/* Title and Date Header */}
                        {isTyping && (
                          <div 
                            className="mb-4 pb-4 border-b border-black/20"
                            style={{
                              fontSize: '1.5rem',
                              fontWeight: 'bold',
                              lineHeight: '1.4',
                              fontFamily: entryFonts.get(selectedEntry.id) || 'Indie Flower'
                            }}
                          >
                            {selectedEntry.title} — {selectedEntry.date}
                          </div>
                        )}
                        
                        {/* Typed Content */}
                        {isTyping && (
                          <div
                            style={{
                              fontSize: '1rem',
                              lineHeight: '1.6',
                              fontFamily: entryFonts.get(selectedEntry.id) || 'Indie Flower'
                            }}
                          >
                            <TextType
                              key={typeKey}
                              text={selectedEntry.content}
                              typingSpeed={5}
                              className="text-black"
                              style={{
                                fontSize: '1rem',
                                lineHeight: '1.6',
                                fontFamily: entryFonts.get(selectedEntry.id) || 'Indie Flower'
                              }}
                              showCursor={false}
                              cursorCharacter="|"
                              loop={false}
                              variableSpeed={{ min: 5, max: 50 }}
                            />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </div>
                </motion.div>

                {/* Close button - under the preview modal */}
                <motion.button
                  onClick={handleClosePreview}
                  className="close-preview-button border-2 border-black rounded-lg text-black transition-colors font-mono text-sm font-semibold px-4 py-2"
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
                    backgroundColor: '#FF7F7F'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: '#FF6B6B'
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close preview"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
