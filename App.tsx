import { useState, useEffect, useCallback } from "react";
import { FilmRollGallery } from "./components/FilmRollGallery";
import { BubbleVideo } from "./components/BubbleVideo";
import MagnetLines from "./components/magnets";
import DotGrid from "./components/BlastBackground";

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

export default function App() {
  const [openGalleryId, setOpenGalleryId] = useState<string | null>(null);
  const [previewPosition, setPreviewPosition] = useState({ top: 0, height: 0 });
  const [showBubbleVideoForGallery, setShowBubbleVideoForGallery] = useState(false);

  const handleGalleryToggle = (id: string, showBubbleVideo: boolean = true) => (isOpen: boolean) => {
    if (isOpen) {
      // Close any other open gallery and open this one
      setOpenGalleryId(id);
      setShowBubbleVideoForGallery(showBubbleVideo);
    } else {
      // Close this gallery
      setOpenGalleryId(null);
      setShowBubbleVideoForGallery(false);
    }
  };

  const handlePreviewPositionChange = useCallback((top: number, height: number) => {
    setPreviewPosition({ top, height });
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Interactive dot grid background */}
      <div className="fixed inset-0 z-0">
        <DotGrid 
          dotSize={2}
          gap={15}
          baseColor="#D3D3D3"
          activeColor="#A0A0A0"
          proximity={60}
        />
      </div>
      
      {/* Subtle neutral vignette */}
      <div className="fixed inset-0 z-[1] bg-gradient-radial from-transparent via-white/60 to-white pointer-events-none" />

      <div className="relative z-10">
        {/* Bubble video component */}
        <BubbleVideo 
          isVisible={!!openGalleryId && showBubbleVideoForGallery}
          previewPosition={previewPosition}
        />
        {/* Gallery Instances */}
        <FilmRollGallery 
          images={galleryImages} 
          title="Inspiration"
          subtitle="/ ˌɪn spəˈreɪ ʃən /"
          filmUsed="Kodak Portra 400"
          year="2023"
          //description="This collection captures the essence of urban exploration through the lens of vintage film photography, showcasing the beauty found in everyday moments and the poetry of city life."
          isOpen={openGalleryId === "inspiration"}
          onToggle={handleGalleryToggle("inspiration")}
          onPreviewPositionChange={handlePreviewPositionChange}
        />
        
        <FilmRollGallery 
          images={natureImages} 
          title="Nature Collection"
          subtitle="/ ˈneɪ tʃər kəˈlek ʃən /"
          filmUsed="Fujifilm Pro 400H"
          year="2024"
          //description="A journey through untouched landscapes and natural wonders, documenting the raw beauty of our planet through analog photography techniques."
          isOpen={openGalleryId === "nature"}
          onToggle={handleGalleryToggle("nature")}
          onPreviewPositionChange={handlePreviewPositionChange}
        />
        
        
        <FilmRollGallery 
          images={natureImages} 
          title="Enrico"
          subtitle="/ ˈenɪ ʃəə kə'w /"
          filmUsed="Ilford HP5 Plus"
          year="2022"
          //description="Personal portraits and intimate moments captured in black and white, exploring the depth of human emotion and connection."
          isOpen={openGalleryId === "enrico"}
          onToggle={handleGalleryToggle("enrico")}
          onPreviewPositionChange={handlePreviewPositionChange}
        />
        
        <FilmRollGallery 
          images={natureImages} 
          title="Alki"
          subtitle="/ ˈenɪ ʃəə kə'w /"
          filmUsed="Ilford HP5 Plus"
          year="2022"
          //description="This collection captures the essence of urban exploration through the lens of vintage film photography, showcasing the beauty found in everyday moments and the poetry of city life."
          isOpen={openGalleryId === "alki"}
          onToggle={handleGalleryToggle("alki")}
          onPreviewPositionChange={handlePreviewPositionChange}
        />        

        <FilmRollGallery 
          images={natureImages} 
          title="Silvia"
          subtitle="/ ˈenɪ ʃəə kə'w /"
          filmUsed="Ilford HP5 Plus"
          year="2022"
          //description="Personal portraits and intimate moments captured in black and white, exploring the depth of human emotion and connection."
          isOpen={openGalleryId === "silvia"}
          onToggle={handleGalleryToggle("silvia")}
          onPreviewPositionChange={handlePreviewPositionChange}
        />
        {/* Uncomment to add more instances:
        <FilmRollGallery 
          images={galleryImages} 
          title="Urban Life"
          showTitle={true}
          isOpen={openGalleryId === "urban"}
          onToggle={handleGalleryToggle("urban")}
        />
        */}
      </div>
    </div>
  );
}