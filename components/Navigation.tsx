import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

interface NavigationProps {
  isDarkMode: boolean;
  onVisibilityChange?: (visible: boolean) => void;
}

export function Navigation({ isDarkMode, onVisibilityChange }: NavigationProps) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/photography", label: "Photography", icon: "📸" },
    { path: "/journal", label: "Journal", icon: "📝" },
    { path: "/ceramics", label: "Ceramics", icon: "🏺" }
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Show navigation when mouse is above half the height of the dark mode button
      // Dark mode button is at 1rem (16px) from top when nav is hidden
      // Button is ~48px tall (p-3 padding + emoji), so half is ~24px
      // Show nav when mouse is above 16px + 24px = 40px
      const shouldBeVisible = e.clientY <= 20;
      setIsVisible(shouldBeVisible);
      onVisibilityChange?.(shouldBeVisible);
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    // Hide navigation after initial mount (2 seconds delay)
    const timeout = setTimeout(() => {
      setIsVisible(false);
      onVisibilityChange?.(false);
    }, 2000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [onVisibilityChange]);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800' 
          : 'bg-white/80 backdrop-blur-md border-b border-zinc-200'
      }`}
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="max-w-6xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              className="text-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              🎨
            </motion.div>
            <span className={`text-xl font-bold transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              BOKU
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <motion.div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive(item.path)
                      ? isDarkMode
                        ? 'bg-white/10 text-white'
                        : 'bg-black/10 text-black'
                      : isDarkMode
                        ? 'text-zinc-300 hover:bg-white/5 hover:text-white'
                        : 'text-zinc-600 hover:bg-black/5 hover:text-black'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-white hover:bg-white/10' 
                  : 'text-black hover:bg-black/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation (Hidden by default - can be expanded later) */}
        <div className="md:hidden mt-4 hidden">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? isDarkMode
                      ? 'bg-white/10 text-white'
                      : 'bg-black/10 text-black'
                    : isDarkMode
                      ? 'text-zinc-300 hover:bg-white/5'
                      : 'text-zinc-600 hover:bg-black/5'
                }`}>
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
