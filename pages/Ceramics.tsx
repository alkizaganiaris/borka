import { useState, useEffect } from "react";
import { motion } from "motion/react";
import clsx from "clsx";
import { PageHeader } from "../components/PageHeader";
import StaggeredMenu from "../components/StaggeredMenu";
import {
  CeramicProjectsGallery,
  CeramicProject
} from "../components/CeramicProjectsGallery";
import { getCeramicProjects } from "../src/lib/sanityQueries";
import { useIsMobile } from "../components/ui/use-mobile";

interface CeramicsProps {
  isDarkMode: boolean;
}

export function Ceramics({ isDarkMode }: CeramicsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ceramicProjects, setCeramicProjects] = useState<CeramicProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchCeramics() {
      try {
        const data = await getCeramicProjects();
        const mappedProjects: CeramicProject[] = data.map((project: any) => {
          const galleryImages =
            project.images?.map((image: any) => ({
              src: image?.url ?? "",
              alt: image?.alt ?? `${project.title} gallery image`,
              height: image?.height ?? undefined
            })) ?? [];

          const firstImage = galleryImages[0];
          const heroVideoUrl = project.heroVideo?.asset?.url;
          const statusRaw = (project.status ?? "available").toLowerCase();
          const normalizedStatus: AvailabilityStatus =
            statusRaw.includes("not") ? "notAvailable" :
            statusRaw.includes("commissioned") ? "commissioned" :
            statusRaw.includes("sold") ? "sold" :
            "available";

          type AvailabilityStatus = "available" | "commissioned" | "sold" | "notAvailable";

          const statusLabelMap: Record<AvailabilityStatus, { label: string; colorClass: string; status: AvailabilityStatus }> = {
            available: { label: "Available", colorClass: "bg-emerald-400", status: "available" },
            commissioned: { label: "Commissioned", colorClass: "bg-orange-400", status: "commissioned" },
            sold: { label: "Sold", colorClass: "bg-sky-400", status: "sold" },
            notAvailable: { label: "Not Available", colorClass: "bg-zinc-400", status: "notAvailable" }
          };

          const availabilityDetails = statusLabelMap[normalizedStatus];

          const availability: CeramicProject["availability"] = {
            label: availabilityDetails.label,
            price:
              typeof project.price === "number"
                ? `EUR ${project.price.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                  })}`
                : "Request price",
            colorClass: availabilityDetails.colorClass,
            status: availabilityDetails.status
          };

          return {
            id: project._id,
            title: project.title ?? "Untitled Project",
            subtitle: project.subtitle ?? "",
            description: project.description ?? "",
            heroImage: heroVideoUrl
              ? {
                  src: heroVideoUrl,
                  poster: firstImage?.src,
                  mediaType: "video" as const,
                  alt: `${project.title ?? "Ceramic project"} hero video`
                }
              : firstImage
                ? {
                    src: firstImage.src,
                    alt: firstImage.alt,
                    mediaType: "image" as const
                  }
                : {
                    src: "",
                    alt: `${project.title ?? "Ceramic project"}`
                  },
            availability,
            galleryImages,
            ctaLabel: project.ctaLabel ?? undefined,
            ctaHref: project.ctaHref ?? undefined
          } satisfies CeramicProject;
        });

        setCeramicProjects(mappedProjects);
      } catch (error) {
        console.error("Error fetching ceramic projects:", error);
        setProjectsError("Failed to load ceramic projects. Please try again later.");
      } finally {
        setIsLoadingProjects(false);
      }
    }

    fetchCeramics();
  }, []);

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
    <div style={{ 
      fontFamily: 'Montserrat, sans-serif',
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'visible'
    }}>
      <PageHeader title="Ceramics" isDarkMode={isDarkMode} />
      <div 
        className="w-full px-4"
        style={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: isDarkMode ? 'transparent' : 'transparent'
        }}
      >
        <p
          className={`mt-6 text-center tracking-tight transition-colors duration-500 ${
            isDarkMode ? 'text-white/80' : 'text-zinc-600'
          }`}
          style={{
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            maxWidth: 'min(90vw, 800px)',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: 'clamp(0.5rem, 3vw, 2rem)',
            paddingRight: 'clamp(0.5rem, 3vw, 2rem)',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            whiteSpace: 'normal',
            lineHeight: '1.5',
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
          }}
        >
          Every form holds a question. Every surface, a resistance. Every fire, a transformation that cannot be undone.
        </p>
      </div>
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
          className="fixed inset-0 pointer-events-none"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 35
          }}
        />
      )}
      
      <div 
        className={clsx("w-full py-8", isMobile ? "" : "px-10")}
        style={{
          width: '100%',
          maxWidth: '100vw',
          boxSizing: 'border-box',
          paddingLeft: isMobile ? '0' : undefined,
          paddingRight: isMobile ? '0' : undefined,
          touchAction: 'pan-y'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ touchAction: 'pan-y' }}
        >


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

        <div className="mb-24 w-full px-10" style={{ minHeight: isMobile ? '400px' : '600px' }}>
          {isLoadingProjects ? (
            <div className="flex flex-col items-center justify-center py-16 text-center" style={{ minHeight: isMobile ? '300px' : '500px' }}>
              <p className="text-xl font-semibold text-zinc-500">Loading projects…</p>
            </div>
          ) : projectsError ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-zinc-400/60 py-16 px-6 text-center">
              <p className="text-lg font-semibold text-zinc-600">{projectsError}</p>
              <p className="text-sm text-zinc-500">
                Refresh the page or check the Sanity Studio connection settings.
              </p>
            </div>
          ) : ceramicProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-400/60 py-16 px-6 text-center">
              <p className="text-xl font-semibold text-zinc-600">
                No ceramic projects found.
              </p>
              <p className="text-sm text-zinc-500">
                Head over to the Sanity Studio to add your first project.
              </p>
            </div>
          ) : (
            <CeramicProjectsGallery
              projects={ceramicProjects}
              isDarkMode={isDarkMode}
            />
          )}
        </div>

        {/* Contact Me CTA */}
        <motion.div
          className="flex justify-center items-center"
          style={{ marginTop: 40 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.a
            href="https://www.instagram.com/borbalakun/"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-3 ${
              isDarkMode 
                ? 'bg-zinc-700 text-white hover:bg-zinc-600' 
                : 'bg-zinc-200 text-black hover:bg-zinc-300'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span>Contact Me</span>
          </motion.a>
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
