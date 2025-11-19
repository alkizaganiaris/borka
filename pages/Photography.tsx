import { useState, useEffect } from "react";
import { FilmRollGallery } from "../components/FilmRollGallery";
import { PageHeader } from "../components/PageHeader";
import StaggeredMenu from "../components/StaggeredMenu";
import { getPhotographyGalleries } from "../src/lib/sanityQueries";

interface PhotographyProps {
  isDarkMode: boolean;
}

export function Photography({ isDarkMode }: PhotographyProps) {
  const [openGalleryId, setOpenGalleryId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [galleries, setGalleries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch galleries from Sanity
  useEffect(() => {
    async function fetchGalleries() {
      try {
        const data = await getPhotographyGalleries();
        setGalleries(data);
      } catch (error) {
        console.error('Error fetching galleries:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGalleries();
  }, []);

  const handleGalleryToggle = (id: string) => (isOpen: boolean) => {
    if (isOpen) {
      setOpenGalleryId(id);
    } else {
      setOpenGalleryId(null);
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
    <div className="relative">
      <PageHeader title="Photography" isDarkMode={isDarkMode} />
      <p
        className={`mt-6 text-center text-base tracking-tight transition-colors duration-500 ${
          isDarkMode ? 'text-white/80' : 'text-zinc-700'
        }`}
        style={{
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
        }}
      >
        Every photograph is a question the world once asked of itself
      </p>
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
        onMenuOpen={() => setIsMenuOpen(true)}
        onMenuClose={() => setIsMenuOpen(false)}
      />
      
      {/* Viewfinder Overlay - Fixed on screen */}
      <img
        src="/media/viewfinder_transparent.png"
        alt=""
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ 
          zIndex: 0,
          transform: 'scale(1)',
          opacity: 0.1
        }}
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
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-xl">Loading galleries...</p>
        </div>
      ) : galleries.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-xl">No galleries found. Add some in Sanity Studio!</p>
        </div>
      ) : (
        /* Gallery Instances from Sanity */
        galleries.map((gallery) => (
          <FilmRollGallery 
            key={gallery._id}
            images={gallery.images.map((img: any) => img.asset.url)} 
            title={gallery.title}
            subtitle={gallery.subtitle || ''}
            filmUsed={gallery.filmUsed || ''}
            year={gallery.year || ''}
            description={gallery.description || ''}
            isOpen={openGalleryId === gallery._id}
            onToggle={handleGalleryToggle(gallery._id)}
            isDarkMode={isDarkMode}
          />
        ))
      )}
    </div>
  );
}
