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

  // Debug controls
  const [showShapeDebug, setShowShapeDebug] = useState(false);
  
  // Shape configuration values
  const [circleX, setCircleX] = useState(21);
  const [circleY, setCircleY] = useState(30);
  const [circleZ, setCircleZ] = useState(5);
  const [circleSize, setCircleSize] = useState(28);
  const [circleRotation, setCircleRotation] = useState(0);
  
  const [rectX, setRectX] = useState(10);
  const [rectY, setRectY] = useState(85);
  const [rectZ, setRectZ] = useState(5);
  const [rectWidth, setRectWidth] = useState(30);
  const [rectHeight, setRectHeight] = useState(7);
  const [rectRotation, setRectRotation] = useState(360);
  
  const [triangleX, setTriangleX] = useState(29);
  const [triangleY, setTriangleY] = useState(9);
  const [triangleZ, setTriangleZ] = useState(6);
  const [triangleWidth, setTriangleWidth] = useState(12);
  const [triangleHeight, setTriangleHeight] = useState(10);
  const [triangleRotation, setTriangleRotation] = useState(90);

  // Close menu when navigating to a different page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Keyboard shortcut to toggle debug panel (Escape key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isHomePage && isMenuOpen) {
        setShowShapeDebug(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHomePage, isMenuOpen]);

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
      {/* Shape Debug Control Panel */}
      {showShapeDebug && isHomePage && isMenuOpen && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-[9999] bg-white/95 p-6 rounded-xl shadow-2xl border-2 border-black overflow-y-auto" style={{ width: '800px', maxHeight: '80vh' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-black font-mono">Shape Position Debug</h3>
              <p className="text-xs text-zinc-500 mt-1">Press ESC or click Hide to close</p>
            </div>
            <button 
              onClick={() => setShowShapeDebug(false)}
              className="text-sm bg-black text-white px-3 py-2 rounded hover:bg-zinc-700"
            >
              Hide
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Circle Controls */}
            <div className="border-2 border-blue-500 rounded-lg p-4">
              <h4 className="font-bold mb-3 text-blue-600">🔵 Circle</h4>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">X: <span className="text-blue-600">{circleX}%</span></label>
                <input type="range" min="0" max="100" step="1" value={circleX} onChange={(e) => setCircleX(Number(e.target.value))} className="w-full" />
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">Y: <span className="text-blue-600">{circleY}%</span></label>
                <input type="range" min="0" max="100" step="1" value={circleY} onChange={(e) => setCircleY(Number(e.target.value))} className="w-full" />
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">Z: <span className="text-blue-600">{circleZ}</span></label>
                <input type="range" min="0" max="20" step="1" value={circleZ} onChange={(e) => setCircleZ(Number(e.target.value))} className="w-full" />
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">Size: <span className="text-blue-600">{circleSize}vw</span></label>
                <input type="range" min="10" max="60" step="1" value={circleSize} onChange={(e) => setCircleSize(Number(e.target.value))} className="w-full" />
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">Rotation: <span className="text-blue-600">{circleRotation}°</span></label>
                <input type="range" min="0" max="360" step="5" value={circleRotation} onChange={(e) => setCircleRotation(Number(e.target.value))} className="w-full" />
              </div>
            </div>

            {/* Rectangle Controls */}
            <div className="border-2 border-pink-500 rounded-lg p-4">
              <h4 className="font-bold mb-3 text-pink-600">🟪 Rectangle</h4>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">X: <span className="text-pink-600">{rectX}%</span></label>
                <input type="range" min="0" max="100" step="1" value={rectX} onChange={(e) => setRectX(Number(e.target.value))} className="w-full" />
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">Y: <span className="text-pink-600">{rectY}%</span></label>
                <input type="range" min="0" max="100" step="1" value={rectY} onChange={(e) => setRectY(Number(e.target.value))} className="w-full" />
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">Z: <span className="text-pink-600">{rectZ}</span></label>
                <input type="range" min="0" max="20" step="1" value={rectZ} onChange={(e) => setRectZ(Number(e.target.value))} className="w-full" />
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">Width: <span className="text-pink-600">{rectWidth}vw</span></label>
                <input type="range" min="5" max="50" step="1" value={rectWidth} onChange={(e) => setRectWidth(Number(e.target.value))} className="w-full" />
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">Height: <span className="text-pink-600">{rectHeight}vw</span></label>
                <input type="range" min="5" max="40" step="1" value={rectHeight} onChange={(e) => setRectHeight(Number(e.target.value))} className="w-full" />
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">Rotation: <span className="text-pink-600">{rectRotation}°</span></label>
                <input type="range" min="0" max="360" step="5" value={rectRotation} onChange={(e) => setRectRotation(Number(e.target.value))} className="w-full" />
              </div>
            </div>

            {/* Triangle Controls */}
            <div className="border-2 border-zinc-700 rounded-lg p-4">
              <h4 className="font-bold mb-3">▲ Triangle</h4>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">X: <span className="text-zinc-700">{triangleX}%</span></label>
                <input type="range" min="0" max="100" step="1" value={triangleX} onChange={(e) => setTriangleX(Number(e.target.value))} className="w-full" />
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">Y: <span className="text-zinc-700">{triangleY}%</span></label>
                <input type="range" min="0" max="100" step="1" value={triangleY} onChange={(e) => setTriangleY(Number(e.target.value))} className="w-full" />
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">Z: <span className="text-zinc-700">{triangleZ}</span></label>
                <input type="range" min="0" max="20" step="1" value={triangleZ} onChange={(e) => setTriangleZ(Number(e.target.value))} className="w-full" />
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">Width: <span className="text-zinc-700">{triangleWidth}vw</span></label>
                <input type="range" min="5" max="50" step="1" value={triangleWidth} onChange={(e) => setTriangleWidth(Number(e.target.value))} className="w-full" />
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">Height: <span className="text-zinc-700">{triangleHeight}vw</span></label>
                <input type="range" min="5" max="40" step="1" value={triangleHeight} onChange={(e) => setTriangleHeight(Number(e.target.value))} className="w-full" />
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1">Rotation: <span className="text-zinc-700">{triangleRotation}°</span></label>
                <input type="range" min="0" max="360" step="5" value={triangleRotation} onChange={(e) => setTriangleRotation(Number(e.target.value))} className="w-full" />
              </div>
            </div>
          </div>

          {/* Copy Values Button */}
          <button
            onClick={() => {
              const values = `Circle: X=${circleX}%, Y=${circleY}%, Z=${circleZ}, Size=${circleSize}vw, Rotation=${circleRotation}°\nRectangle: X=${rectX}%, Y=${rectY}%, Z=${rectZ}, W=${rectWidth}vw, H=${rectHeight}vw, Rotation=${rectRotation}°\nTriangle: X=${triangleX}%, Y=${triangleY}%, Z=${triangleZ}, W=${triangleWidth}vw, H=${triangleHeight}vw, Rotation=${triangleRotation}°`;
              navigator.clipboard.writeText(values);
              alert('Values copied to clipboard!');
            }}
            className="w-full mt-4 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition-colors"
          >
            Copy All Values
          </button>
        </div>
      )}

      {/* Toggle Debug Button - Only visible when menu is open */}
      {!showShapeDebug && isHomePage && isMenuOpen && (
        <button
          onClick={() => setShowShapeDebug(true)}
          className="fixed left-1/2 -translate-x-1/2 bottom-8 z-[9999] bg-black text-white px-4 py-2 rounded-lg hover:bg-zinc-700 shadow-2xl font-mono text-sm"
        >
          Shape Debug 🎨
        </button>
      )}

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

      {/* Decorative Shapes - Behind Menu */}
      {isHomePage && (
        <>
          {/* Cobalt Blue Circle */}
          <div 
            className="fixed"
            style={{
              left: `${circleX}%`,
              top: `${circleY}%`,
              zIndex: circleZ
            }}
          >
            <Magnet magnetStrength={-10} padding={100}>
              <motion.div
                className="group"
                initial={{ x: '-200%', opacity: 0 }}
                animate={{
                  x: isMenuOpen ? '0%' : '-200%',
                  opacity: isMenuOpen ? 1 : 0,
                  rotate: circleRotation
                }}
                transition={{ 
                  duration: isMenuOpen ? 0.5 : 0.25,
                  ease: [0.4, 0, 0.2, 1],
                  delay: isMenuOpen ? 0 : 0
                }}
                style={{
                  transform: 'translate(-50%, -50%)',
                  width: `${circleSize}vw`,
                  height: `${circleSize}vw`,
                  borderRadius: '50%',
                  backgroundColor: '#3E4BAA',
                  border: '1px solid #1C1C1C',
                  pointerEvents: 'auto',
                  cursor: 'pointer'
                }}
                whileHover={{
                  borderColor: 'transparent'
                }}
              />
            </Magnet>
          </div>

          {/* Bubblegum Pink Rectangle */}
          <div 
            className="fixed"
            style={{
              left: `${rectX}%`,
              top: `${rectY}%`,
              zIndex: rectZ
            }}
          >
            <Magnet magnetStrength={10} padding={100}>
              <motion.div
                className="group"
                initial={{ x: '-200%', opacity: 0 }}
                animate={{
                  x: isMenuOpen ? '0%' : '-200%',
                  opacity: isMenuOpen ? 1 : 0,
                  rotate: rectRotation
                }}
                transition={{ 
                  duration: isMenuOpen ? 0.5 : 0.25,
                  ease: [0.4, 0, 0.2, 1],
                  delay: isMenuOpen ? 0.15 : 0
                }}
                style={{
                  transform: 'translate(-50%, -50%)',
                  width: `${rectWidth}vw`,
                  height: `${rectHeight}vw`,
                  borderRadius: '1rem',
                  backgroundColor: '#E875A8',
                  border: '1px solid #1C1C1C',
                  pointerEvents: 'auto',
                  cursor: 'pointer'
                }}
                whileHover={{
                  borderColor: 'transparent'
                }}
              />
            </Magnet>
          </div>

          {/* Black Triangle */}
          <div 
            className="fixed"
            style={{
              left: `${triangleX}%`,
              top: `${triangleY}%`,
              zIndex: triangleZ
            }}
          >
            <Magnet magnetStrength={-10} padding={100}>
              <motion.div
                initial={{ x: '-200%', opacity: 0 }}
                animate={{
                  x: isMenuOpen ? '0%' : '-200%',
                  opacity: isMenuOpen ? 1 : 0,
                  rotate: triangleRotation
                }}
                transition={{ 
                  duration: isMenuOpen ? 0.5 : 0.25,
                  ease: [0.4, 0, 0.2, 1],
                  delay: isMenuOpen ? 0.3 : 0
                }}
                style={{
                  transform: 'translate(-50%, 0)',
                  width: '0',
                  height: '0',
                  borderLeft: `${triangleWidth / 2}vw solid transparent`,
                  borderRight: `${triangleWidth / 2}vw solid transparent`,
                  borderBottom: `${triangleHeight}vw solid #1C1C1C`,
                  pointerEvents: 'auto',
                  cursor: 'pointer'
                }}
              />
            </Magnet>
          </div>
        </>
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