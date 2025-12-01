import { useState, useEffect } from "react";
import { FilmRollGallery } from "../components/FilmRollGallery";
import { PageHeader } from "../components/PageHeader";
import StaggeredMenu from "../components/StaggeredMenu";
import { getPhotographyGalleries } from "../src/lib/sanityQueries";
import { useTabletLandscape } from "../components/ui/use-tablet-landscape";
import { useIsMobile } from "../components/ui/use-mobile";

interface PhotographyProps {
  isDarkMode: boolean;
}

export function Photography({ isDarkMode }: PhotographyProps) {
  const [openGalleryId, setOpenGalleryId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [galleries, setGalleries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0); // For tablet landscape and mobile single gallery view
  const isTabletLandscape = useTabletLandscape();
  const isMobile = useIsMobile();

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
    { label: 'Ceramics', ariaLabel: 'View ceramics', link: '/ceramics' },
    { label: 'Photography', ariaLabel: 'View photography', link: '/photography' },
    { label: 'Thoughts', ariaLabel: 'Read thoughts', link: '/journal' }
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
        className={`mt-6 tablet-landscape:mt-8 text-center tracking-tight transition-colors duration-500 ${
          isDarkMode ? 'text-white/80' : 'text-zinc-700'
        }`}
        style={{
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
          fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)', // Responsive font size
          lineHeight: '1.5',
          maxWidth: 'min(90vw, 800px)',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(1rem, 5vw, 2rem)',
          paddingRight: 'clamp(1rem, 5vw, 2rem)',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
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
      
      {/* Opacity overlay when menu is open */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 pointer-events-auto"
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
      ) : isTabletLandscape || isMobile ? (
        /* Tablet Landscape or Mobile: Single gallery with swipe navigation */
        galleries.length > 0 && currentGalleryIndex < galleries.length && (
          <FilmRollGallery 
            key={galleries[currentGalleryIndex]._id}
            images={galleries[currentGalleryIndex].images.map((img: any) => img.asset.url)} 
            title={galleries[currentGalleryIndex].title}
            subtitle={galleries[currentGalleryIndex].subtitle || ''}
            filmUsed={galleries[currentGalleryIndex].filmUsed || ''}
            year={galleries[currentGalleryIndex].year || ''}
            description={galleries[currentGalleryIndex].description || ''}
            isOpen={openGalleryId === galleries[currentGalleryIndex]._id}
            onToggle={handleGalleryToggle(galleries[currentGalleryIndex]._id)}
            isDarkMode={isDarkMode}
            currentGalleryIndex={currentGalleryIndex}
            totalGalleries={galleries.length}
            onNavigateGallery={(direction: 'next' | 'prev') => {
              if (direction === 'next') {
                setCurrentGalleryIndex((prev) => (prev + 1) % galleries.length);
              } else {
                setCurrentGalleryIndex((prev) => (prev - 1 + galleries.length) % galleries.length);
              }
            }}
            isMenuOpen={isMenuOpen}
            isMobile={isMobile}
          />
        )
      ) : (
        /* Desktop: All galleries */
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
            isMenuOpen={isMenuOpen}
          />
        ))
      )}
    </div>
  );
}
