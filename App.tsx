import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Homepage } from "./pages/Homepage";
import { Photography } from "./pages/Photography";
import { Journal } from "./pages/Journal";
import { Ceramics } from "./pages/Ceramics";
import DotGrid from "./components/BlastBackground";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <Router>
      <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
        {/* Dark mode toggle button */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`fixed top-4 right-4 z-50 p-3 rounded-full transition-all duration-300 ${
            isDarkMode 
              ? 'bg-white/10 hover:bg-white/20 text-white' 
              : 'bg-black/10 hover:bg-black/20 text-black'
          }`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Navigation */}
        <Navigation isDarkMode={isDarkMode} />

        {/* Interactive dot grid background */}
        <div className="fixed inset-0 z-0">
          <DotGrid 
            dotSize={2}
            gap={15}
            baseColor={isDarkMode ? "#4A4A4A" : "#D3D3D3"}
            activeColor={isDarkMode ? "#6A6A6A" : "#A0A0A0"}
            proximity={60}
          />
        </div>
        
        {/* Subtle neutral vignette */}
        <div className={`fixed inset-0 z-[1] pointer-events-none transition-colors duration-500 ${
          isDarkMode 
            ? 'bg-gradient-radial from-transparent via-zinc-900/60 to-zinc-900'
            : 'bg-gradient-radial from-transparent via-white/60 to-white'
        }`} />

        {/* Main content with padding for navigation */}
        <div className="relative z-10 pt-20">
          <Routes>
            <Route path="/" element={<Homepage isDarkMode={isDarkMode} />} />
            <Route path="/photography" element={<Photography isDarkMode={isDarkMode} />} />
            <Route path="/journal" element={<Journal isDarkMode={isDarkMode} />} />
            <Route path="/ceramics" element={<Ceramics isDarkMode={isDarkMode} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}