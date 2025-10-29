import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { PageHeader } from "../components/PageHeader";
import StaggeredMenu from "../components/StaggeredMenu";
import HorizontalPhotoRow from "../components/HorizontalPhotoRow";
import ScrollControlledVideo from "../components/ScrollControlledVideo";

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

  // Ceramic images - using placeholder images for now, you can replace with actual ceramic photos
  const ceramicImages = [
    { src: '/media/wooden_table_1.jpg', alt: 'Ocean Bowl - Hand-thrown stoneware bowl with blue glaze' },
    { src: '/media/wooden_table_2.jpg', alt: 'Forest Vase - Tall ceramic vase with earthy green tones' },
    { src: '/media/wooden_table_3.jpg', alt: 'Sunrise Plate Set - Set of 4 dinner plates with warm gradient glaze' },
    { src: '/media/wooden_table_4.jpg', alt: 'Moonlight Mug - Handcrafted coffee mug with speckled glaze' },
    { src: '/media/wooden_table.jpg', alt: 'Earth Pot - Large planter with natural brown finish' },
    { src: '/media/entry_bg.jpeg', alt: 'Wind Chime Set - Ceramic wind chimes with unique tones' },
    { src: '/media/pencil.png', alt: 'Mountain Mug - Rugged coffee mug with mountain landscape glaze' },
    { src: '/media/coffee.png', alt: 'Coral Teapot - Delicate teapot with coral-inspired design' },
    { src: '/media/tea.png', alt: 'Desert Wind Chime - Ceramic wind chime with desert-inspired tones' },
    { src: '/media/shavings_1.png', alt: 'River Stone Bowl - Small serving bowl with river stone texture' },
    { src: '/media/film-canister.png', alt: 'Sky Sculpture - Abstract ceramic sculpture with flowing lines' },
    { src: '/media/film-frame-bg.jpg', alt: 'Earth Pot - Large planter with natural brown finish' },
    { src: '/media/wooden_table_1.jpg', alt: 'Sunset Plate - Hand-painted dinner plate with sunset colors' },
    { src: '/media/wooden_table_2.jpg', alt: 'Forest Bowl - Wood-fired bowl with natural ash glaze' },
    { src: '/media/wooden_table_3.jpg', alt: 'Ocean Vase - Tall vase inspired by ocean waves' },
    { src: '/media/wooden_table_4.jpg', alt: 'Mountain Teacup - Small teacup with mountain silhouette' },
    { src: '/media/wooden_table.jpg', alt: 'Desert Jar - Storage jar with desert sand texture' },
    { src: '/media/entry_bg.jpeg', alt: 'Rainbow Mug - Colorful mug with rainbow glaze pattern' },
    { src: '/media/pencil.png', alt: 'Stone Plate - Natural stone-inspired serving plate' },
    { src: '/media/coffee.png', alt: 'Leaf Bowl - Organic bowl shaped like a large leaf' },
    { src: '/media/tea.png', alt: 'Fire Pot - Dramatic pot with flame-like glaze patterns' },
    { src: '/media/shavings_1.png', alt: 'Ice Vase - Cool-toned vase with crystalline texture' },
    { src: '/media/film-canister.png', alt: 'Wood Grain Plate - Plate with realistic wood grain pattern' },
    { src: '/media/film-frame-bg.jpg', alt: 'Cloud Sculpture - Abstract cloud-shaped ceramic piece' }
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

        {/* Scroll-Controlled Video */}
        <motion.div
          className="mb-16 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-6">
            <h2 className={`text-3xl font-bold transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              The Making Process
            </h2>
            <p className={`text-sm mt-2 transition-colors duration-500 ${
              isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              Hover and scroll to explore
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ maxWidth: '900px', margin: '0 auto', aspectRatio: '16/9' }}>
            <ScrollControlledVideo 
              videoSrc="/media/Claymotion.mp4"
              className="w-full h-full"
            />
          </div>
        </motion.div>

        {/* Ceramics Gallery - Multi-Row Auto-Scroll */}
        <div className="mb-16 relative z-10" style={{ minHeight: '100vh' }}>
          <div className="text-center p-4 text-black font-bold mb-12">
            Ceramics Gallery - Auto-Scrolling Display
          </div>
          
          {/* Row 1 - Scrolling Right */}
          <div className="h-[22vh] flex items-center" style={{ paddingBottom: '5rem' }}>
            <HorizontalPhotoRow
              images={ceramicImages.slice(0, 3)}
              imageSize={120}
              spacing={60}
              enableHover={true}
              autoScroll={true}
              scrollDirection="right"
              scrollSpeed={12}
              rowIndex={0}
              className="h-full"
            />
          </div>
          
          {/* Row 2 - Scrolling Left */}
          <div className="h-[22vh] flex items-center" style={{ paddingBottom: '5rem' }}>
            <HorizontalPhotoRow
              images={ceramicImages.slice(3, 6)}
              imageSize={120}
              spacing={60}
              enableHover={true}
              autoScroll={true}
              scrollDirection="left"
              scrollSpeed={12}
              rowIndex={1}
              className="h-full"
            />
          </div>
          
          {/* Row 3 - Scrolling Right */}
          <div className="h-[22vh] flex items-center" style={{ paddingBottom: '5rem' }}>
            <HorizontalPhotoRow
              images={ceramicImages.slice(6, 9)}
              imageSize={120}
              spacing={60}
              enableHover={true}
              autoScroll={true}
              scrollDirection="right"
              scrollSpeed={12}
              rowIndex={2}
              className="h-full"
            />
          </div>
          
          {/* Row 4 - Scrolling Left */}
          <div className="h-[22vh] flex items-center" style={{ paddingBottom: '5rem' }}>
            <HorizontalPhotoRow
              images={ceramicImages.slice(9, 12)}
              imageSize={120}
              spacing={60}
              enableHover={true}
              autoScroll={true}
              scrollDirection="left"
              scrollSpeed={12}
              rowIndex={3}
              className="h-full"
            />
          </div>
          
          {/* Info */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
            {ceramicImages.length} ceramic pieces • 4 rows scrolling in alternating directions
          </div>
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
