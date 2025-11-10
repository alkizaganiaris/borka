import clsx from "clsx";
import { motion } from "motion/react";
import Masonry from "./masonry";

type GalleryImage = {
  src: string;
  alt: string;
  link?: string;
  height?: number;
};

export type CeramicProject = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  heroImage: GalleryImage;
  galleryImages: GalleryImage[];
  ctaLabel?: string;
  ctaHref?: string;
};

type CeramicProjectsGalleryProps = {
  projects: CeramicProject[];
  isDarkMode?: boolean;
};

export function CeramicProjectsGallery({
  projects,
  isDarkMode = false
}: CeramicProjectsGalleryProps) {
  if (!projects?.length) return null;

  return (
    <div className="flex flex-col gap-28 md:gap-32 w-full mx-auto max-w-[1200px]">
      {projects.map((project, index) => (
        <ProjectRow
          key={project.id ?? index}
          project={project}
          index={index}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
}

type ProjectRowProps = {
  project: CeramicProject;
  index: number;
  isDarkMode: boolean;
};

function ProjectRow({ project, index, isDarkMode }: ProjectRowProps) {
  const isEven = index % 2 === 0;
  const textCardOrder = isEven ? "md:order-1" : "md:order-3";
  const mosaicOrder = "md:order-2";
  const heroOrder = isEven ? "md:order-3" : "md:order-1";
  const accentBorder = isDarkMode ? "border-zinc-600/60" : "border-zinc-300/80";
  const bgSurface = isDarkMode ? "bg-zinc-900/60" : "bg-white/80";
  const textPrimary = isDarkMode ? "text-zinc-50" : "text-zinc-900";
  const textSecondary = isDarkMode ? "text-zinc-400" : "text-zinc-600";

  const masonryItems = project.galleryImages.map((image, imageIndex) => ({
    id: `${project.id}-${imageIndex}`,
    img: image.src,
    url: image.link ?? image.src,
    height: image.height ?? 420
  }));

  return (
    <motion.section
      className="flex flex-col gap-10 md:gap-12"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={clsx(
          "flex flex-col gap-10 md:gap-12",
          "md:flex-row md:items-stretch"
        )}
      >
        {/* Hero image column */}
        <motion.figure
          className={clsx(
            "w-full md:w-[28%] lg:w-[40%] flex-shrink-0 rounded-[36px] overflow-hidden border relative shadow-xl shadow-black/5",
            accentBorder,
            heroOrder
          )}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
        >
          <img
            src={project.heroImage.src}
            alt={project.heroImage.alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-black/5" />
          <figcaption
            className={clsx(
              "absolute bottom-5 left-6 text-lg font-semibold tracking-wide drop-shadow-lg",
              "uppercase"
            )}
          >
            <span className={textPrimary}>{project.title}</span>
          </figcaption>
        </motion.figure>

        {/* Mosaic column */}
        <div
          className={clsx(
            "flex-1 md:max-w-[38%] lg:max-w-[32%]",
            "rounded-[32px] border relative overflow-hidden",
            accentBorder,
            mosaicOrder,
            isDarkMode ? "bg-zinc-900/30" : "bg-white/70"
          )}
        >
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-black/15 via-transparent to-black/10 pointer-events-none mix-blend-multiply" />
          <div className="relative h-full w-full p-4 md:p-5">
            <div className="relative w-full min-h-[360px] md:min-h-[440px]">
              <Masonry
                items={masonryItems}
                ease="power3.out"
                duration={0.6}
                stagger={0.05}
                animateFrom="bottom"
                scaleOnHover
                hoverScale={0.97}
                blurToFocus
                colorShiftOnHover={false}
                columnsOverride={2}
                maxRows={2}
                gap={20}
              />
            </div>
          </div>
        </div>

        {/* Text column */}
        <motion.div
          className={clsx(
            "w-full md:flex-1 rounded-[36px] border shadow-lg shadow-black/5 backdrop-blur-sm",
            accentBorder,
            bgSurface,
            "px-10 py-12 md:px-12 md:py-16 flex flex-col justify-between gap-8",
            textCardOrder
          )}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="space-y-4">
            {project.subtitle && (
              <p className={clsx("text-sm tracking-[0.4em] uppercase", textSecondary)}>
                {project.subtitle}
              </p>
            )}
            <h3
              className={clsx(
                "text-3xl md:text-4xl font-extrabold leading-tight",
                textPrimary
              )}
            >
              {project.title}
            </h3>
            <p className={clsx("text-base md:text-lg leading-relaxed", textSecondary)}>
              {project.description}
            </p>
          </div>
          {project.ctaLabel && project.ctaHref && (
            <motion.a
              href={project.ctaHref}
              className={clsx(
                "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors duration-300",
                isDarkMode
                  ? "bg-white text-zinc-900 hover:bg-zinc-200"
                  : "bg-zinc-900 text-white hover:bg-zinc-700"
              )}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              {project.ctaLabel}
            </motion.a>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}

