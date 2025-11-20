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
                : "Price on request",
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

  const processSteps = [
    {
      title: 'Inspiration',
      description: 'Sketches, playlists, heirloom ceramics, and seaside walks fuel the idea pool.',
      accent: 'from-emerald-300 to-teal-500',
      icon: '✨'
    },
    {
      title: 'Material Play',
      description: 'Clay bodies get wedged with pigments, grog, and unexpected inclusions for texture.',
      accent: 'from-sky-300 to-indigo-500',
      icon: '🌀'
    },
    {
      title: 'Wheel Ritual',
      description: 'Slow throws, purposeful trimming, and rhythm loops keep forms loose and lyrical.',
      accent: 'from-amber-300 to-orange-500',
      icon: '🎶'
    },
    {
      title: 'Alchemy Lab',
      description: 'Test tiles, kiln gods, and layered glazes harmonise into luminous finishes.',
      accent: 'from-rose-300 to-fuchsia-500',
      icon: '🧪'
    },
    {
      title: 'Implementation',
      description: 'Pieces are fired, finished, documented, and invited into homes and galleries.',
      accent: 'from-lime-300 to-emerald-500',
      icon: '🌿'
    }
  ];

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <PageHeader title="Ceramics" isDarkMode={isDarkMode} />
      <div className="w-full px-4">
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
          Ceramics are not made; they are persuaded — a quiet negotiation between earth, water, and will.
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
          overflowX: 'hidden'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
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

        <div className="mb-24 w-full px-10">
          {isLoadingProjects ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
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

        {/* About Section */}
        <motion.div
          className={`p-8 rounded-2xl border transition-colors duration-500 ${
            isDarkMode 
              ? 'bg-zinc-800/30 border-zinc-700' 
              : 'bg-white/50 border-zinc-200'
          }`}
          style={{ marginTop: 40 }}
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

          <div className="mt-12 relative">
            <div
              className="relative overflow-x-auto py-4 px-2 bg-transparent"
              style={{ background: 'transparent' }}
            >
              <div className="absolute inset-y-0 left-0 right-0 pointer-events-none flex items-center">
                <motion.svg
                  className="h-16 w-full text-zinc-400/40"
                  viewBox="0 0 1200 160"
                  preserveAspectRatio="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <motion.path
                    d="M0 80 C 80 20, 200 140, 320 60 S 520 10, 640 100 S 880 140, 1020 60 S 1160 20, 1200 80"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray="10 14"
                    animate={{ strokeDashoffset: [0, -60] }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                  />
                </motion.svg>
              </div>
              <div className="relative flex gap-6 md:gap-8 min-w-max items-center">
                {processSteps.map((step, index) => (
                  <div key={step.title} className="relative flex items-center">
                    <motion.div
                      whileHover={{ y: -6, scale: 1.05, rotate: index % 2 === 0 ? -2 : 2 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                      className={`group relative flex h-[220px] w-[220px] flex-col items-center justify-center overflow-hidden rounded-full border-2 ${
                        isDarkMode ? 'border-zinc-300' : 'border-[#1E5A55]'
                      } shadow-[0_18px_36px_-24px_rgba(0,0,0,0.4)]`}
                      style={{ backgroundColor: isDarkMode ? '#1E5A55' : '#F4DE7C' }}
                    >
                       <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
                         <div className="flex flex-col items-center gap-2 py-2">
                           <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                             {step.title}
                           </h3>
                          <p className={`text-sm leading-relaxed max-w-[180px] ${
                            isDarkMode ? 'text-white' : 'text-zinc-900/85'
                          }`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {index < processSteps.length - 1 && (
                      <motion.div
                        className="relative flex h-[140px] w-[120px] items-center justify-center"
                        aria-hidden="true"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <motion.svg
                          className="absolute h-full w-full text-zinc-400/80"
                          viewBox="0 0 120 140"
                          preserveAspectRatio="none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        >
                          <motion.path
                            d="M10 70 C 45 20, 75 120, 110 70"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeDasharray="6 12"
                            animate={{ strokeDashoffset: [0, -24] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                          />
                          <motion.circle
                            cx="110"
                            cy="70"
                            r="4"
                            fill="currentColor"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                          />
                        </motion.svg>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleContact}
            className={`mt-6 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-zinc-700 text-white hover:bg-zinc-600' 
                : 'bg-zinc-200 text-black hover:bg-zinc-300'
            }`}
            style={{ marginTop: 20 }}
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
