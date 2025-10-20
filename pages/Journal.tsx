import { motion, AnimatePresence } from "motion/react";
import { PageHeader } from "../components/PageHeader";
import { useState, useRef, useEffect } from "react";
import TextType from "../components/TextType";
import "../styles/fonts.css";
import StaggeredMenu from "../components/StaggeredMenu";

interface JournalProps {
  isDarkMode: boolean;
}

interface JournalEntry {
  id: number;
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
  const [hoveredEntryId, setHoveredEntryId] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [readEntries, setReadEntries] = useState<Set<number>>(new Set());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Configuration values
  const containerTranslateY = -10;
  const textTranslateY = 0;
  const fontSize = 1.4;
  const lineHeight = 2.2;

  // Add initial loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300); // 300ms delay before showing content
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

  const journalEntries: JournalEntry[] = [
    {
      id: 1,
      title: "The Art of Film Photography",
      date: "December 15, 2024",
      timestamp: new Date("2024-12-15"),
      excerpt: "There's something magical about the anticipation of developing film. The uncertainty, the waiting, the moment when images emerge from chemicals...",
      content: "There's something magical about the anticipation of developing film. The uncertainty, the waiting, the moment when images emerge from chemicals...\n\nFilm photography teaches us patience and intentionality. Every frame matters when you have only 36 exposures. This constraint becomes liberating rather than limiting.\n\nIn the darkroom, time slows down. The process forces you to be present, to pay attention to each step. It's a meditation in itself."
    },
    {
      id: 2,
      title: "Finding Light in Unexpected Places",
      date: "December 10, 2024",
      timestamp: new Date("2024-12-10"),
      excerpt: "Sometimes the most beautiful photographs come from the most ordinary moments. A ray of light through a window, a reflection on water...",
      content: "Sometimes the most beautiful photographs come from the most ordinary moments. A ray of light through a window, a reflection on water...\n\nLight is the essence of photography. It shapes our subjects, creates mood, and tells stories. Learning to see light is learning to see the world differently.\n\nThe golden hour isn't just a time of day—it's a state of mind. It's about being ready to capture beauty when it appears."
    },
    {
      id: 3,
      title: "The Journey of a Ceramic Artist",
      date: "December 5, 2024",
      timestamp: new Date("2024-12-05"),
      excerpt: "From clay to kiln, every piece tells a story of transformation. The process is as important as the final result...",
      content: "From clay to kiln, every piece tells a story of transformation. The process is as important as the final result...\n\nWorking with clay is a meditation. Each piece is unique, bearing the marks of the maker's hands and the kiln's fire. There's beauty in imperfection.\n\nThe Japanese concept of wabi-sabi teaches us to embrace the beauty of things that are imperfect, impermanent, and incomplete."
    },
    {
    id: 4,
    title: "The Art of Film Photography",
    date: "December 15, 2024",
    timestamp: new Date("2024-12-15"),
    excerpt: "There's something magical about the anticipation of developing film. The uncertainty, the waiting, the moment when images emerge from chemicals...",
    content: "There's something magical about the anticipation of developing film. The uncertainty, the waiting, the moment when images emerge from chemicals...\n\nFilm photography teaches us patience and intentionality. Every frame matters when you have only 36 exposures. This constraint becomes liberating rather than limiting.\n\nIn the darkroom, time slows down. The process forces you to be present, to pay attention to each step. It's a meditation in itself."
  },
  {
    id: 5,
    title: "Finding Light in Unexpected Places",
    date: "December 10, 2024",
    timestamp: new Date("2024-12-10"),
    excerpt: "Sometimes the most beautiful photographs come from the most ordinary moments. A ray of light through a window, a reflection on water...",
    content: "Sometimes the most beautiful photographs come from the most ordinary moments. A ray of light through a window, a reflection on water...\n\nLight is the essence of photography. It shapes our subjects, creates mood, and tells stories. Learning to see light is learning to see the world differently.\n\nThe golden hour isn't just a time of day—it's a state of mind. It's about being ready to capture beauty when it appears."
  },
  {
    id: 6,
    title: "The Journey of a Ceramic Artist",
    date: "December 5, 2024",
    timestamp: new Date("2024-12-05"),
    excerpt: "From clay to kiln, every piece tells a story of transformation. The process is as important as the final result...",
    content: "From clay to kiln, every piece tells a story of transformation. The process is as important as the final result...\n\nWorking with clay is a meditation. Each piece is unique, bearing the marks of the maker's hands and the kiln's fire. There's beauty in imperfection.\n\nThe Japanese concept of wabi-sabi teaches us to embrace the beauty of things that are imperfect, impermanent, and incomplete."
  },
  {
    id: 7,
    title: "Finding Light in Unexpected Places",
    date: "December 10, 2024",
    timestamp: new Date("2024-12-10"),
    excerpt: "Sometimes the most beautiful photographs come from the most ordinary moments. A ray of light through a window, a reflection on water...",
    content: "Sometimes the most beautiful photographs come from the most ordinary moments. A ray of light through a window, a reflection on water...\n\nLight is the essence of photography. It shapes our subjects, creates mood, and tells stories. Learning to see light is learning to see the world differently.\n\nThe golden hour isn't just a time of day—it's a state of mind. It's about being ready to capture beauty when it appears."
  },
  {
    id: 8,
    title: "The Journey of a Ceramic Artist",
    date: "December 5, 2024",
    timestamp: new Date("2024-12-05"),
    excerpt: "From clay to kiln, every piece tells a story of transformation. The process is as important as the final result...",
    content: "From clay to kiln, every piece tells a story of transformation. The process is as important as the final result...\n\nWorking with clay is a meditation. Each piece is unique, bearing the marks of the maker's hands and the kiln's fire. There's beauty in imperfection.\n\nThe Japanese concept of wabi-sabi teaches us to embrace the beauty of things that are imperfect, impermanent, and incomplete."
  },
  {
    id: 9,
    title: "Finding Light in Unexpected Places",
    date: "December 10, 2024",
    timestamp: new Date("2024-12-10"),
    excerpt: "Sometimes the most beautiful photographs come from the most ordinary moments. A ray of light through a window, a reflection on water...",
    content: "Sometimes the most beautiful photographs come from the most ordinary moments. A ray of light through a window, a reflection on water...\n\nLight is the essence of photography. It shapes our subjects, creates mood, and tells stories. Learning to see light is learning to see the world differently.\n\nThe golden hour isn't just a time of day—it's a state of mind. It's about being ready to capture beauty when it appears."
  },
  {
    id: 10,
    title: "The Journey of a Ceramic Artist",
    date: "December 5, 2024",
    timestamp: new Date("2024-12-05"),
    excerpt: "From clay to kiln, every piece tells a story of transformation. The process is as important as the final result...",
    content: "From clay to kiln, every piece tells a story of transformation. The process is as important as the final result...\n\nWorking with clay is a meditation. Each piece is unique, bearing the marks of the maker's hands and the kiln's fire. There's beauty in imperfection.\n\nThe Japanese concept of wabi-sabi teaches us to embrace the beauty of things that are imperfect, impermanent, and incomplete."
  }
  ];

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
      style={{ fontFamily: '"Indie Flower", cursive' }}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
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
            src="/notebook_transparent.webm"
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
            <div className="space-y-3 pb-12" 
            style={{ 
              marginTop: '0rem',
              marginBottom: '0rem'
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
                   ...(readEntries.has(entry.id)
                     ? {
                         backgroundColor: 'transparent',
                         backgroundImage: 'url(/entry_bg.jpeg)',
                         backgroundSize: 'cover',
                         backgroundRepeat: 'no-repeat',
                         backgroundPosition: 'center'
                       }
                     : {
                         backgroundColor: 'transparent',
                         backgroundImage: 'url(/entry_bg.jpeg)',
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
                transform: `translateY(${textTranslateY}vh)`,
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
                    {/* Typed Content */}
                    {isTyping && (
                      <TextType
                        key={typeKey}
                        text={selectedEntry.content}
                        typingSpeed={5}
                        className="text-black"
                        style={{
                          fontSize: `${fontSize}rem`,
                          lineHeight: `${lineHeight}`
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
