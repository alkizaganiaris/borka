import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import StaggeredMenu from "./components/StaggeredMenu";
import { PageTransition } from "./components/PageTransition";
import { Homepage } from "./pages/Homepage";
import { Photography } from "./pages/Photography";
import { Journal } from "./pages/Journal";
import { Ceramics } from "./pages/Ceramics";
import { Typography } from "./pages/Typography";
import { PageHeader } from "./components/PageHeader";
import DotGrid from "./components/BlastBackground";
import { motion, AnimatePresence } from "motion/react";
import Magnet from "./components/MagnetButton";
import { useTabletOrientationLock } from "./components/ui/use-tablet-orientation-lock";
import { useIsMobile } from "./components/ui/use-mobile";

function AppContent() {
  // Lock tablet orientation to landscape
  const showOrientationMessage = useTabletOrientationLock();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [wasCaught, setWasCaught] = useState(false);
  const [showHoverIcon, setShowHoverIcon] = useState(false);
  const [hoverDisabled, setHoverDisabled] = useState(false);
  const [showBlastBackground, setShowBlastBackground] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const isHomePage = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);

  // Check for hero modal being open (via body class)
  useEffect(() => {
    const checkHeroModal = () => {
      setIsHeroModalOpen(document.body.classList.contains('hero-modal-open'));
    };
    
    // Check initially
    checkHeroModal();
    
    // Watch for class changes
    const observer = new MutationObserver(checkHeroModal);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Get page title based on current route
  const getPageTitle = () => {
    if (location.pathname === '/photography') return 'Photography';
    if (location.pathname === '/journal') return 'Journal';
    if (location.pathname === '/ceramics') return 'Ceramics';
    if (location.pathname === '/typography') return 'Typography';
    return null;
  };


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
      className="min-h-screen relative transition-colors duration-500"
      style={{
        backgroundColor: isDarkMode ? 'teal-dark' : '#fffef0',
        overflowX: 'hidden'
      }}
    >


      {/* StaggeredMenu Navigation - only on home page */}
      {isHomePage && !isHeroModalOpen && (
        <>
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
            defaultOpen={false}
            onMenuOpen={() => setIsMenuOpen(true)}
            onMenuClose={() => setIsMenuOpen(false)}
          />
          {/* Overlay to block interactions underneath when menu is open */}
          {isMenuOpen && (
            <div 
              className="fixed inset-0 z-[35] pointer-events-auto"
              style={{ 
                backgroundColor: 'transparent',
              }}
              onClick={() => {
                // Close menu when clicking outside (optional)
                // Can be removed if you don't want this behavior
              }}
            />
          )}
        </>
      )}

      {/* Dark mode toggle button with playful text - hide when orientation message is shown or hero modal is open */}
      {!showOrientationMessage && !isHeroModalOpen && (
        <motion.div 
          className="fixed right-[2em] z-50"
          initial={{ opacity: 1, y: 0 }}
          animate={{ 
            top: "2em",
            opacity: isMenuOpen ? 0 : 1,
            y: isMenuOpen ? -20 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ 
            pointerEvents: isMenuOpen ? 'none' : 'auto',
            position: 'fixed',
            top: '2em',
            right: '2em',
            willChange: 'transform'
          }}
        >
        <Magnet padding={50} magnetStrength={10}>
          <div className="relative">
            <motion.button
              onClick={handleDarkModeClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative w-11 h-11 rounded-full transition-all duration-500 overflow-hidden"
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
              className={`absolute right-full top-1/3 -translate-y-1/2 font-mono ${
                isMobile ? 'text-[10px] max-w-[120px] mr-2' : 'text-xs mr-6 whitespace-nowrap'
              } ${
                isDarkMode ? 'text-black' : 'text-zinc-700'
              }`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ 
                opacity: (isButtonHovered || wasCaught) ? 1 : 0,
                x: (isButtonHovered || wasCaught) ? 0 : 10,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                wordWrap: isMobile ? 'break-word' : 'normal',
                lineHeight: isMobile ? '1.2' : '1',
              }}
            >
              {wasCaught 
                ? "'click'" 
                : isButtonHovered && !wasCaught
                  ? location.pathname === '/journal'
                    ? (isDarkMode 
                        ? (isMobile ? "Grab a coffee!" : "Grab a coffee while you're at it")
                        : (isMobile ? "Stop doomscrolling!" : "Stop doomscrolling! Read a journal entry instead"))
                    : (isDarkMode ? "Lights on?" : "Lights off?")
                  : ""}
            </motion.div>
          </div>
        </Magnet>
      </motion.div>
      )}

      {/* PageHeader or Homepage logo - show when orientation message is shown (keep page title/image visible) */}
      {showOrientationMessage && (
        <>
          {isHomePage && (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[90] flex items-center justify-center">
              <img 
                src={isDarkMode ? "/media/boku_home_white.svg" : "/media/boku_home.svg"} 
                alt="BOKU" 
                className="max-h-[120px] max-w-[120px] object-contain"
              />
            </div>
          )}
          {!isHomePage && getPageTitle() && (
            <div className="relative z-[90]">
              <PageHeader title={getPageTitle()!} isDarkMode={isDarkMode} />
            </div>
          )}
        </>
      )}

      {/* Orientation message for tablets in portrait */}
      {showOrientationMessage && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
            className="fixed z-[100] px-8 py-4 rounded-lg shadow-2xl border border-black/20"
            style={{
              backgroundColor: '#F4DE7C', // Ochre yellow background
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
              top: '50%',
              left: '50%',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <p className="text-base font-semibold text-center m-0 text-black whitespace-nowrap">
              Please rotate your device to landscape mode
            </p>
          </motion.div>
        </AnimatePresence>
      )}

        {/* Interactive dot grid background - hide when orientation message is shown */}
        {showBlastBackground && !showOrientationMessage && (
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
        
        {/* Subtle neutral vignette - hide when orientation message is shown */}
        {!showOrientationMessage && (
          <div 
            className="fixed inset-0 z-[1] pointer-events-none transition-colors duration-500"
            style={{
              background: isDarkMode 
                ? 'radial-gradient(circle, transparent 0%, rgba(168, 180, 217, 0.6) 50%, #a8b4d9 100%)'
                : 'radial-gradient(circle, transparent 0%, rgba(255, 254, 240, 0.6) 50%, #fffef0 100%)'
            }}
          />
        )}

        {/* Main content - hide when orientation message is shown */}
        {!showOrientationMessage && (
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
              pointerEvents: isHomePage && isMenuOpen ? 'none' : 'auto', // Disable interactions when menu is open on homepage
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
        )}
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