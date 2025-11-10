import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { PageHeader } from "../components/PageHeader";
import StaggeredMenu from "../components/StaggeredMenu";
import ScrollControlledVideo from "../components/ScrollControlledVideo";
import {
  CeramicProjectsGallery,
  CeramicProject
} from "../components/CeramicProjectsGallery";

interface CeramicsProps {
  isDarkMode: boolean;
}

export function Ceramics({ isDarkMode }: CeramicsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const ceramicProjects: CeramicProject[] = [
    {
      id: "ocean-bowl",
      title: "Ocean Bowl Series",
      subtitle: "Wheel Thrown Stoneware",
      description:
        "A family of bowls that carry the movement of tides in layered celadon glazes. These pieces are burnished by hand, leaving slight variations that feel like shorelines.",
      heroImage: {
        src: "/media/ffout1.mp4",
        poster: "/media/wooden_table_1.jpg",
        mediaType: "video",
        alt: "Looping video of a ceramic bowl being shaped on a wheel"
      },
      galleryImages: [
        { src: "/media/wooden_table_2.jpg", alt: "Detail of layered blue glaze", height: 460 },
        { src: "/media/wooden_table_3.jpg", alt: "Stacked bowls from the Ocean series", height: 380 },
        { src: "/media/wooden_table_4.jpg", alt: "Footed bowl in turquoise glaze", height: 520 },
        { src: "/media/wooden_table.jpg", alt: "Throwing process of the Ocean Bowl", height: 410 }
      ],
      ctaLabel: "View Process Journal",
      ctaHref: "/journal"
    },
    {
      id: "forest-vessel",
      title: "Forest Vessel",
      subtitle: "Reduction Fired Porcelain",
      description:
        "Soft greens and charcoal washes build a canopy effect across the form. This vessel was fired over three days, picking up subtle atmospheric markings from the kiln.",
      heroImage: {
          src: "/media/ffout1.mp4",
          poster: "/media/wooden_table_1.jpg",
          mediaType: "video",
          alt: "Looping video of a ceramic bowl being shaped on a wheel"
        },
      galleryImages: [
        { src: "/media/pencil.png", alt: "Studio notes beside green test tiles", height: 360 },
        { src: "/media/coffee.png", alt: "Close-up of carved porcelain rim", height: 420 },
        { src: "/media/tea.png", alt: "Forest vessel drying on a wooden bat", height: 480 },
        { src: "/media/shavings_1.png", alt: "Trimming ribbons from porcelain base", height: 380 }
      ],
      ctaLabel: "Commission Similar Work",
      ctaHref: "mailto:contact@borka.com?subject=Forest%20Vessel%20Inquiry"
    },
    {
      id: "sunrise-tableware",
      title: "Sunrise Tableware",
      subtitle: "Hand Glazed Stoneware",
      description:
        "A table setting designed for long breakfasts. Warm gradients meet speckled clay bodies, transitioning from blush to amber. Each firing introduces new shifts in the palette.",
      heroImage: {
          src: "/media/ffout1.mp4",
          poster: "/media/wooden_table_1.jpg",
          mediaType: "video",
          alt: "Looping video of a ceramic bowl being shaped on a wheel"
        },
      galleryImages: [
        { src: "/media/film-frame-bg.jpg", alt: "Sunrise tableware styled on linen", height: 520 },
        { src: "/media/wooden_table_1.jpg", alt: "Detail of blush glaze pooling", height: 420 },
        { src: "/media/wooden_table_2.jpg", alt: "Cup and saucer from sunrise set", height: 360 },
        { src: "/media/wooden_table_3.jpg", alt: "Production line of gradient bowls", height: 480 }
      ],
      ctaLabel: "Shop Limited Release",
      ctaHref: "/shop"
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
      
      <div className="w-full px-10 py-8">
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

        {/* <motion.div
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
              videoSrc="/media/ffout1.mp4"
              className="w-full h-full"
            />
          </div>
        </motion.div> */}

        <div className="mb-24 w-full px-10">
          <CeramicProjectsGallery
            projects={ceramicProjects}
            isDarkMode={isDarkMode}
          />
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
