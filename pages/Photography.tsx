import { useState } from "react";
import { FilmRollGallery } from "../components/FilmRollGallery";
import { PageHeader } from "../components/PageHeader";
import StaggeredMenu from "../components/StaggeredMenu";

// ---------- Demo images ----------
const galleryImages = [
  "https://images.unsplash.com/photo-1496203695688-3b8985780d6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYwNzU3OTY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYwNzY0NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1487452066049-a710f7296400?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHN0cmVldHxlbnwxfHx8fDE3NjA2ODQzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1528543606781-2f6e6857f318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzYwNzMxOTUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1663940019982-c14294717dbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjA3MTkzMzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBvY2VhbnxlbnwxfHx8fDE3NjA3MDcxNzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHBlYWt8ZW58MXx8fHwxNzYwNzA0MzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbGlnaHRzfGVufDF8fHx8MTc2MDc3Njk5OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjB0cmVlc3xlbnwxfHx8fDE3NjA3NTMzMzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1599854100970-974129a5c8b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHdhdmVzfGVufDF8fHx8MTc2MDc3Njk5OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjB0cmVlc3xlbnwxfHx8fDE3NjA3NTMzMzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYwNzY0NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHBlYWt8ZW58MXx8fHwxNzYwNzA0MzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBvY2VhbnxlbnwxfHx8fDE3NjA3MDcxNzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1599854100970-974129a5c8b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHdhdmVzfGVufDF8fHx8MTc2MDc3Njk5OHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjB0cmVlc3xlbnwxfHx8fDE3NjA3NTMzMzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYwNzY0NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHBlYWt8ZW58MXx8fHwxNzYwNzA0MzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBvY2VhbnxlbnwxfHx8fDE3NjA3MDcxNzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1599854100970-974129a5c8b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHdhdmVzfGVufDF8fHx8MTc2MDc3Njk5OHww&ixlib=rb-4.1.0&q=80&w=1080",
];

// Additional image sets for demonstrating multiple instances
const natureImages = [
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjB0cmVlc3xlbnwxfHx8fDE3NjA3NTMzMzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzYwNzY0NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHBlYWt8ZW58MXx8fHwxNzYwNzA0MzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBvY2VhbnxlbnwxfHx8fDE3NjA3MDcxNzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1599854100970-974129a5c8b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHdhdmVzfGVufDF8fHx8MTc2MDc3Njk5OHww&ixlib=rb-4.1.0&q=80&w=1080",
];

interface PhotographyProps {
  isDarkMode: boolean;
}

export function Photography({ isDarkMode }: PhotographyProps) {
  const [openGalleryId, setOpenGalleryId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  console.log('Photography - isMenuOpen:', isMenuOpen);

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
      
      {/* Gallery Instances */}
      <FilmRollGallery 
        images={galleryImages} 
        title="Inspiration"
        subtitle="/ ˌɪn spəˈreɪ ʃən /"
        filmUsed="Kodak Portra 400"
        year="2023"
        description="A collection of inspiration images from the internet. Silvia is a friend of mine from college. We met in a photography class and became friends. She is a very talented photographer and I am always inspired by her work."
        isOpen={openGalleryId === "inspiration"}
        onToggle={handleGalleryToggle("inspiration")}
        isDarkMode={isDarkMode}
      />
      
      <FilmRollGallery 
        images={natureImages} 
        title="Nature Collection"
        subtitle="/ ˈneɪ tʃər kəˈlek ʃən /"
        filmUsed="Fujifilm Pro 400H"
        year="2024"
        description="A collection of inspiration images from the internet."
        isOpen={openGalleryId === "nature"}
        onToggle={handleGalleryToggle("nature")}
        isDarkMode={isDarkMode}
      />
      
      <FilmRollGallery 
        images={natureImages} 
        title="Enrico"
        subtitle="/ ˈenɪ ʃəə kə'w /"
        filmUsed="Ilford HP5 Plus"
        year="2022"
        description="A collection of inspiration images from the internet."
        isOpen={openGalleryId === "enrico"}
        onToggle={handleGalleryToggle("enrico")}
        isDarkMode={isDarkMode}
      />
      
      <FilmRollGallery 
        images={natureImages} 
        title="Alki"
        subtitle="/ ˈenɪ ʃəə kə'w /"
        filmUsed="Ilford HP5 Plus"
        year="2022"
        description="A collection of inspiration images from the internet."
        isOpen={openGalleryId === "alki"}
        onToggle={handleGalleryToggle("alki")}
        isDarkMode={isDarkMode}
      />        

      <FilmRollGallery 
        images={natureImages} 
        title="Silvia"
        subtitle="/ ˈenɪ ʃəə kə'w /"
        filmUsed="Ilford HP5 Plus"
        year="2022"
        description="A collection of inspiration images from the internet. Silvia is a friend of mine from college. We met in a photography class and became friends. She is a very talented photographer and I am always inspired by her work."
        isOpen={openGalleryId === "silvia"}
        onToggle={handleGalleryToggle("silvia")}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
