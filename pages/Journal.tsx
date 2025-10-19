import { motion, AnimatePresence } from "motion/react";
import { PageHeader } from "../components/PageHeader";
import { useState, useRef, useEffect } from "react";
import TextType from "../components/TextType";
import "../styles/fonts.css";

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
      setIsTyping(false);
      setSelectedEntry(null);
      return;
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

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ fontFamily: '"Indie Flower", cursive' }}>
      <PageHeader title="Journal" isDarkMode={isDarkMode} />
      
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
            className="fixed left-0 h-screen overflow-y-auto px-8 z-10" 
            style={{ width: '24.5vw', top: '0', paddingTop: '8rem' }}
          >
            <h3 className="text-2xl font-bold mb-6 text-black">Random Thoughts ... </h3>
            <div className="space-y-3 pb-12">
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
                className={`w-full text-left p-4 rounded-xl ${
                  selectedEntry?.id === entry.id
                    ? 'bg-black text-white shadow-lg'
                    : 'text-black shadow-md'
                }`}
                style={{
                  backgroundColor: selectedEntry?.id === entry.id 
                    ? '#1C1C1C'
                    : '#F4DE7C',
                  border: '1px solid #1C1C1C',
                  transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
                  transform: hoveredEntryId === entry.id ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <h4 className="font-bold text-lg mb-1">{entry.title}</h4>
                <p className={`text-sm ${selectedEntry?.id === entry.id ? 'text-zinc-300' : 'text-zinc-600'}`}>
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
    </div>
  );
}
