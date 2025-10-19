import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import StaggeredMenu from "./components/StaggeredMenu";
import { PageTransition } from "./components/PageTransition";
import { Homepage } from "./pages/Homepage";
import { Photography } from "./pages/Photography";
import { Journal } from "./pages/Journal";
import { Ceramics } from "./pages/Ceramics";
import { Typography } from "./pages/Typography";
import DotGrid from "./components/BlastBackground";
import { motion, AnimatePresence } from "motion/react";
import Magnet from "./components/MagnetButton";

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [wasCaught, setWasCaught] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  // Close menu when navigating to a different page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleDarkModeClick = () => {
    setIsDarkMode(!isDarkMode);
    if (isButtonHovered) {
      setWasCaught(true);
      // Hide "You got me!" after 1.5 seconds
      setTimeout(() => {
        setWasCaught(false);
      }, 1500);
    }
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
    <div 
      className="min-h-screen relative overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: isDarkMode ? '#a8b4d9' : '#fffef0'
      }}
    >
      {/* Back to Home arrow - shown on non-home pages */}
      {!isHomePage && (
        <motion.button
          onClick={() => navigate('/')}
          className="fixed left-8 top-8 z-50 p-3 rounded-full transition-all duration-300 pointer-events-auto"
          style={{
            background: isDarkMode 
              ? 'radial-gradient(circle, #3E4BAA 0%, #2a3577 70%, #1f2656 100%)'
              : 'radial-gradient(circle, #F4DE7C 0%, #e8cc5c 70%, #d4b84a 100%)',
            opacity: 0.7
          }}
          whileHover={{ 
            scale: 1.1,
            opacity: 1
          }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to home"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={isDarkMode ? "#ffffff" : "#1C1C1C"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </motion.button>
      )}

      {/* StaggeredMenu Navigation - only on home page */}
      {isHomePage && (
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
      )}

      {/* Dark mode toggle button with playful text */}
      <motion.div 
        className="fixed right-4 z-50"
        initial={{ opacity: 1, y: 0 }}
        animate={{ 
          top: "1rem",
          opacity: isMenuOpen ? 0 : 1,
          y: isMenuOpen ? -20 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ pointerEvents: isMenuOpen ? 'none' : 'auto' }}
      >
        <Magnet padding={50} magnetStrength={10}>
          <div className="relative">
            <motion.button
              onClick={handleDarkModeClick}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className="relative w-16 h-16 rounded-full transition-all duration-500 overflow-hidden"
              style={{
                background: isDarkMode 
                  ? 'radial-gradient(circle, #3E4BAA 0%, #2a3577 70%, #1f2656 100%)'
                  : 'radial-gradient(circle, #F4DE7C 0%, #e8cc5c 70%, #d4b84a 100%)'
              }}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: isButtonHovered ? 1 : 0.5 }}
              whileHover={{ 
                scale: 1.05,
                rotate: isDarkMode ? -5 : 5
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle dark mode"
            >
              {/* Background stars/rays effect */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  rotate: isDarkMode ? 360 : 0,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {isDarkMode ? (
                  // Stars for dark mode
                  <>
                    <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full opacity-60" />
                    <div className="absolute top-4 right-3 w-1 h-1 bg-white rounded-full opacity-80" />
                    <div className="absolute bottom-3 left-4 w-0.5 h-0.5 bg-white rounded-full opacity-70" />
                    <div className="absolute bottom-4 right-2 w-1 h-1 bg-white rounded-full opacity-50" />
                  </>
                ) : (
                  // Sun rays for light mode
                  <div className="absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-0.5 h-3 bg-yellow-200/40 origin-top"
                        style={{
                          transform: `rotate(${i * 45}deg) translateX(-50%)`
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Icon */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center text-2xl"
                animate={{
                  rotate: isDarkMode ? 0 : 360,
                  scale: wasCaught ? [1, 1.2, 1] : 1
                }}
                transition={{
                  rotate: { duration: 0.6, ease: "easeInOut" },
                  scale: { duration: 0.5 }
                }}
              >
                {isDarkMode ? '🌙' : '☀️'}
              </motion.div>
            </motion.button>
            
            {/* Playful text */}
            <motion.div
              className={`absolute right-full mr-4 top-1/3 -translate-y-1/2 font-mono text-xs whitespace-nowrap ${
                isDarkMode ? 'text-black' : 'text-zinc-700'
              }`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ 
                opacity: (isButtonHovered || wasCaught) ? 1 : 0,
                x: (isButtonHovered || wasCaught) ? 0 : 10,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {wasCaught 
                ? "'click'" 
                : isButtonHovered && !wasCaught
                  ? location.pathname === '/journal'
                    ? (isDarkMode ? "Grab a coffee while you're at it" : "Stop doomscrolling!")
                    : (isDarkMode ? "Lights on?" : "Lights off?")
                  : ""}
            </motion.div>
          </div>
        </Magnet>
      </motion.div>

        {/* Interactive dot grid background */}
        <div className="fixed inset-0 z-0">
          <DotGrid 
            dotSize={2}
            gap={15}
            baseColor={isDarkMode ? "#FFFFFF" : "#D3D3D3"}
            activeColor={isDarkMode ? "#FFFFFF" : "#A0A0A0"}
            proximity={60}
          />
        </div>
        
        {/* Subtle neutral vignette */}
        <div 
          className="fixed inset-0 z-[1] pointer-events-none transition-colors duration-500"
          style={{
            background: isDarkMode 
              ? 'radial-gradient(circle, transparent 0%, rgba(168, 180, 217, 0.6) 50%, #a8b4d9 100%)'
              : 'radial-gradient(circle, transparent 0%, rgba(255, 254, 240, 0.6) 50%, #fffef0 100%)'
          }}
        />

        {/* Main content */}
        <motion.div 
          className="relative z-10"
          animate={{
            marginLeft: isHomePage && isMenuOpen ? "35vw" : "0vw", // Move content to start after menu
            width: isHomePage && isMenuOpen ? "65vw" : "100vw", // Constrain width to remaining viewport
            borderLeft: isHomePage && isMenuOpen ? "4px solid #1C1C1C" : "0px solid transparent"
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Center content horizontally within the container
            justifyContent: "flex-start", // Align content to top
          }}
        >
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <PageTransition>
                  <Homepage isDarkMode={isDarkMode} />
                </PageTransition>
              } />
              <Route path="/photography" element={
                <PageTransition>
                  <Photography isDarkMode={isDarkMode} />
                </PageTransition>
              } />
              <Route path="/journal" element={
                <PageTransition>
                  <Journal isDarkMode={isDarkMode} />
                </PageTransition>
              } />
              <Route path="/ceramics" element={
                <PageTransition>
                  <Ceramics isDarkMode={isDarkMode} />
                </PageTransition>
              } />
              <Route path="/typography" element={
                <PageTransition>
                  <Typography isDarkMode={isDarkMode} />
                </PageTransition>
              } />
            </Routes>
          </AnimatePresence>
        </motion.div>
      </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}