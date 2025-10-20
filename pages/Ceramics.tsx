import { useState } from "react";
import { motion } from "motion/react";
import { PageHeader } from "../components/PageHeader";
import StaggeredMenu from "../components/StaggeredMenu";

interface CeramicsProps {
  isDarkMode: boolean;
}

export function Ceramics({ isDarkMode }: CeramicsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const ceramicPieces = [
    {
      id: 1,
      name: "Ocean Bowl",
      description: "Hand-thrown stoneware bowl with blue glaze",
      price: "$85",
      image: "🏺",
      available: true
    },
    {
      id: 2,
      name: "Forest Vase",
      description: "Tall ceramic vase with earthy green tones",
      price: "$120",
      image: "🫖",
      available: true
    },
    {
      id: 3,
      name: "Sunrise Plate Set",
      description: "Set of 4 dinner plates with warm gradient glaze",
      price: "$200",
      image: "🍽️",
      available: false
    },
    {
      id: 4,
      name: "Moonlight Mug",
      description: "Handcrafted coffee mug with speckled glaze",
      price: "$45",
      image: "☕",
      available: true
    },
    {
      id: 5,
      name: "Earth Pot",
      description: "Large planter with natural brown finish",
      price: "$95",
      image: "🪴",
      available: true
    },
    {
      id: 6,
      name: "Wind Chime Set",
      description: "Ceramic wind chimes with unique tones",
      price: "$75",
      image: "🎐",
      available: false
    }
  ];

  const handleContact = () => {
    // In a real app, this would open a contact form or email
    window.open('mailto:contact@borka.com?subject=Ceramics Inquiry', '_blank');
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
    <div>
      <PageHeader title="Ceramics" isDarkMode={isDarkMode} />
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
      
      <div className="max-w-6xl mx-auto px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <p className={`text-lg mb-8 transition-colors duration-500 ${
              isDarkMode ? 'text-zinc-300' : 'text-zinc-600'
            }`}>
              Handcrafted pottery and ceramic art, each piece unique and made with care.
            </p>

          <motion.button
            onClick={handleContact}
            className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-white text-black hover:bg-zinc-200' 
                : 'bg-black text-white hover:bg-zinc-800'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact for Custom Orders
          </motion.button>
        </div>

        {/* Ceramics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {ceramicPieces.map((piece, index) => (
            <motion.div
              key={piece.id}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                piece.available
                  ? isDarkMode 
                    ? 'bg-zinc-800/30 border-zinc-700 hover:border-zinc-500 hover:scale-105' 
                    : 'bg-white/50 border-zinc-200 hover:border-zinc-400 hover:scale-105'
                  : isDarkMode
                    ? 'bg-zinc-800/10 border-zinc-800 opacity-60'
                    : 'bg-zinc-50/30 border-zinc-200 opacity-60'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={piece.available ? { y: -5 } : {}}
            >
              <div className="text-6xl mb-4 text-center">
                {piece.image}
              </div>
              
              <h3 className={`text-xl font-bold mb-2 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                {piece.name}
              </h3>
              
              <p className={`text-sm mb-4 transition-colors duration-500 ${
                isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                {piece.description}
              </p>
              
              <div className="flex justify-between items-center">
                <span className={`text-lg font-semibold transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  {piece.price}
                </span>
                
                <span className={`text-xs px-3 py-1 rounded-full transition-colors duration-500 ${
                  piece.available
                    ? isDarkMode 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-green-100 text-green-700'
                    : isDarkMode
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-red-100 text-red-700'
                }`}>
                  {piece.available ? 'Available' : 'Sold'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* About Section */}
        <motion.div
          className={`p-8 rounded-2xl border transition-colors duration-500 ${
            isDarkMode 
              ? 'bg-zinc-800/30 border-zinc-700' 
              : 'bg-white/50 border-zinc-200'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className={`text-3xl font-bold mb-6 transition-colors duration-500 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            About the Process
          </h2>
          
          <div className={`space-y-4 text-lg leading-relaxed transition-colors duration-500 ${
            isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
          }`}>
            <p>
              Each ceramic piece is carefully handcrafted using traditional techniques passed down through generations. 
              From the initial throwing on the wheel to the final glaze firing, every step is done with intention and care.
            </p>
            
            <p>
              The glazes are mixed in-house using natural materials, creating unique colors and textures that can't be 
              replicated. Each piece is fired in a gas kiln, allowing for precise temperature control and consistent results.
            </p>
            
            <p>
              All pieces are food-safe and dishwasher-friendly, making them perfect for everyday use while maintaining 
              their artistic beauty.
            </p>
          </div>

          <motion.button
            onClick={handleContact}
            className={`mt-6 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-zinc-700 text-white hover:bg-zinc-600' 
                : 'bg-zinc-200 text-black hover:bg-zinc-300'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Inquire About Custom Work
          </motion.button>
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
