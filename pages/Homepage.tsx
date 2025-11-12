import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";

interface HomepageProps {
  isDarkMode: boolean;
}

export function Homepage({ isDarkMode }: HomepageProps) {
  return (
    <div className="min-h-screen">
      <PageHeader title="Home" isDarkMode={isDarkMode} />
      
      <div className="flex flex-col items-center justify-center px-8 py-16">
      {/* Hero Section */}
      <motion.div 
        className="text-center max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={`text-6xl md:text-8xl font-bold mb-6 transition-colors duration-500 ${
          isDarkMode ? 'text-white' : 'text-black'
        }`}>
          BORKA
        </h1>
        
        <p className={`text-xl md:text-2xl mb-12 transition-colors duration-500 ${
          isDarkMode ? 'text-zinc-300' : 'text-zinc-600'
        }`}>
          Photography • Journal • Ceramics
        </p>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <Link to="/photography">
            <motion.div 
              className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                isDarkMode 
                  ? 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-500' 
                  : 'bg-white/50 border-zinc-200 hover:border-zinc-400'
              }`}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-4">📸</div>
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                Photography
              </h3>
              <p className={`text-sm transition-colors duration-500 ${
                isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                Film galleries and visual stories
              </p>
            </motion.div>
          </Link>

          <Link to="/journal">
            <motion.div 
              className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                isDarkMode 
                  ? 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-500' 
                  : 'bg-white/50 border-zinc-200 hover:border-zinc-400'
              }`}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-4">📝</div>
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                Journal
              </h3>
              <p className={`text-sm transition-colors duration-500 ${
                isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                Thoughts, stories, and reflections
              </p>
            </motion.div>
          </Link>

          <Link to="/ceramics">
            <motion.div 
              className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                isDarkMode 
                  ? 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-500' 
                  : 'bg-white/50 border-zinc-200 hoverborder-zinc-400'
              }`}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-4">🏺</div>
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                Ceramics
              </h3>
              <p className={`text-sm transition-colors duration-500 ${
                isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                Handcrafted pottery and art
              </p>
            </motion.div>
          </Link>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
