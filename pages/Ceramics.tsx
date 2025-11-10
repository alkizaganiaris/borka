import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { PageHeader } from "../components/PageHeader";
import StaggeredMenu from "../components/StaggeredMenu";
import {
  CeramicProjectsGallery,
  CeramicProject
} from "../components/CeramicProjectsGallery";
import { getCeramicProjects } from "../src/lib/sanityQueries";

interface CeramicsProps {
  isDarkMode: boolean;
}

export function Ceramics({ isDarkMode }: CeramicsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ceramicProjects, setCeramicProjects] = useState<CeramicProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

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
