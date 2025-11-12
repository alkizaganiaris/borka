import { motion, AnimatePresence } from "motion/react";
import { PageHeader } from "../components/PageHeader";
import { useState, useRef, useEffect } from "react";
import TextType from "../components/TextType";
import "../styles/fonts.css";
import StaggeredMenu from "../components/StaggeredMenu";
import { getJournalEntries } from "../src/lib/sanityQueries";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  
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
        // Mark entry as read when closing with escape
        setReadEntries(prev => new Set([...prev, selectedEntry.id]));
        setIsTyping(false);
        setSelectedEntry(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEntry]);

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

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Photography', ariaLabel: 'View photography', link: '/photography' },
    { label: 'Journal', ariaLabel: 'Read journal entries', link: '/journal' },
    { label: 'Ceramics', ariaLabel: 'View ceramics', link: '/ceramics' },
    { label: 'Typography', ariaLabel: 'View typography showcase', link: '/typography' }
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
      <StaggeredMenu
        position="left"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor={isDarkMode ? "#ffffff" : "#1C1C1C"}
        openMenuButtonColor="#1C1C1C"
        changeMenuColorOnOpen={true}
        colors={['#E875A8', '#3E4BAA', '#3CB4AC']}
        logoUrl=""
        accentColor="#1e5a55"
        isFixed={true}
        onMenuOpen={() => setIsMenuOpen(true)}
        onMenuClose={() => setIsMenuOpen(false)}
      />
      
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
        {/* Notebook Background - Fixed in Center, Above Background Layer */}
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

        {/* Left Sidebar - Entry List (Far Left) */}
        {isLoaded && (
          <div 
            className="fixed overflow-y-auto px-1 z-1 border-2 border-black rounded-xl bg-white" 
            style={{ 
              width: '20vw', 
              left: '2rem', 
              top: '30vh', 
              paddingTop: '0rem', 
              bottom: '4vh', 
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
              Need more thoughts...
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
                   paddingLeft: '10%',
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

        {/* Content Overlay - Centered over Notebook */}
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
      </div>
    </motion.div>
  );
}
