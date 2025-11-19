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
  const [showHoverIcon, setShowHoverIcon] = useState(false);
  const [hoverDisabled, setHoverDisabled] = useState(false);
  const [showBlastBackground, setShowBlastBackground] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(() => isHomePage);


  // Close menu when navigating away from the homepage
  useEffect(() => {
    if (location.pathname !== '/') {
      setIsMenuOpen(false);
    }
  }, [location.pathname]);


  const handleDarkModeClick = () => {
    setIsDarkMode(!isDarkMode);
    setHoverDisabled(true);
    setShowHoverIcon(false);
    if (isButtonHovered) {
      setWasCaught(true);
      // Hide "You got me!" after 1.5 seconds
      setTimeout(() => {
        setWasCaught(false);
      }, 1500);
    }
  };

  const handleMouseEnter = () => {
    if (!hoverDisabled) {
      setIsButtonHovered(true);
      setShowHoverIcon(true);
    }
  };

  const handleMouseLeave = () => {
    setIsButtonHovered(false);
    setShowHoverIcon(false);
    setHoverDisabled(false);
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
        backgroundColor: isDarkMode ? 'teal-dark' : '#fffef0'
      }}
    >


      {/* StaggeredMenu Navigation - only on home page */}
      {isHomePage && (
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
          defaultOpen={true}
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
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative w-16 h-16 rounded-full transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0.5 }}
              animate={{ 
                opacity: isButtonHovered ? 1 : 0.5,
                background: showHoverIcon
                  ? (isDarkMode 
                      ? 'radial-gradient(circle, #F4DE7C 0%, #e8cc5c 70%, #d4b84a 100%)'
                      : 'radial-gradient(circle, #3E4BAA 0%, #2a3577 70%, #1f2656 100%)')
                  : (isDarkMode 
                      ? 'radial-gradient(circle, #3E4BAA 0%, #2a3577 70%, #1f2656 100%)'
                      : 'radial-gradient(circle, #F4DE7C 0%, #e8cc5c 70%, #d4b84a 100%)')
              }}
              transition={{ 
                duration: 0.3, 
                ease: "easeInOut",
                background: { duration: 0.3 }
              }}
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
                <AnimatePresence mode="wait">
                  {showHoverIcon ? (
                    // Show opposite background effect on hover
                    <motion.div
                      key="hover-effect"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {isDarkMode ? (
                        // Sun rays for dark mode hover
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
                      ) : (
                        // Stars for light mode hover
                        <>
                          <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full opacity-60" />
                          <div className="absolute top-4 right-3 w-1 h-1 bg-white rounded-full opacity-80" />
                          <div className="absolute bottom-3 left-4 w-0.5 h-0.5 bg-white rounded-full opacity-70" />
                          <div className="absolute bottom-4 right-2 w-1 h-1 bg-white rounded-full opacity-50" />
                        </>
                      )}
                    </motion.div>
                  ) : (
                    // Normal background effect
                    <motion.div
                      key="normal-effect"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
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
                  )}
                </AnimatePresence>
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
                <AnimatePresence mode="wait">
                  {showHoverIcon ? (
                    <motion.span
                      key="hover"
                      initial={{ opacity: 0, scale: 0.5, rotate: 180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: -180 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {isDarkMode ? '☀️' : '🌙'}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="normal"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {isDarkMode ? '🌙' : '☀️'}
                    </motion.span>
                  )}
                </AnimatePresence>
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
                    ? (isDarkMode ? "Grab a coffee while you're at it" : "Stop doomscrolling! Read a journal entry instead")
                    : (isDarkMode ? "Lights on?" : "Lights off?")
                  : ""}
            </motion.div>
          </div>
        </Magnet>
      </motion.div>

        {/* Interactive dot grid background */}
        {showBlastBackground && (
          <div className="fixed inset-0 z-0">
            <DotGrid 
              dotSize={4}
              gap={40}
              baseColor={isDarkMode ? "#FFFFFF" : "#D3D3D3"}
              activeColor={isDarkMode ? "#FFFFFF" : "#A0A0A0"}
              proximity={50}
            />
          </div>
        )}
        
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
                <Journal isDarkMode={isDarkMode} />
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