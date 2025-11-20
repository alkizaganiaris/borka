import clsx from "clsx";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useIsMobile } from "./ui/use-mobile";

type GalleryImage = {
  src: string;
  alt: string;
  link?: string;
  height?: number;
  mediaType?: "image" | "video";
  poster?: string;
};

const AVAILABILITY_STATUS_COLOR_CLASSES: Record<string, string> = {
  available: "bg-emerald-400",
  commissioned: "bg-orange-400",
  sold: "bg-sky-400",
  notAvailable: "bg-zinc-400"
};

const STATUS_OPTIONS = [
  { key: "available", label: "Available", dotClass: AVAILABILITY_STATUS_COLOR_CLASSES.available },
  {
    key: "commissioned",
    label: "Commissioned",
    dotClass: AVAILABILITY_STATUS_COLOR_CLASSES.commissioned
  },
  { key: "sold", label: "Sold", dotClass: AVAILABILITY_STATUS_COLOR_CLASSES.sold },
  { key: "notAvailable", label: "Not Available", dotClass: AVAILABILITY_STATUS_COLOR_CLASSES.notAvailable }
] as const;

const ALL_STATUS_KEYS = STATUS_OPTIONS.map((option) => option.key);
const HERO_VIDEO_EVENT = "ceramic-hero-play";

export type CeramicProject = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  heroImage: GalleryImage;
  galleryImages: GalleryImage[];
  ctaLabel?: string;
  ctaHref?: string;
  availability?: {
    label: string;
    price: string;
    colorClass?: string;
    status?: "available" | "commissioned" | "sold" | "notAvailable";
  };
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

  const [activeStatuses, setActiveStatuses] = useState<string[]>(() => [...ALL_STATUS_KEYS]);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const toggleStatus = useCallback((statusKey: string) => {
    setActiveStatuses((prev) => {
      if (prev.includes(statusKey)) {
        const next = prev.filter((key) => key !== statusKey);
        return next;
      }
      return [...prev, statusKey];
    });
  }, []);

  const handleShowAll = useCallback(() => {
    setActiveStatuses(() => [...ALL_STATUS_KEYS]);
  }, []);

  const isShowAllActive = activeStatuses.length === ALL_STATUS_KEYS.length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileDropdownOpen(false);
      }
    };

    if (isMobileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileDropdownOpen]);

  const filteredProjects = useMemo(() => {
    if (!projects?.length) return [];
    if (!activeStatuses.length) return projects;

    return projects.filter((project) => {
      const statusKey =
        project.availability?.status ??
        project.availability?.label?.trim().toLowerCase() ??
        "available";
      const normalizedStatus = statusKey.replace(/\s+/g, "-");
      return activeStatuses.includes(normalizedStatus);
    });
  }, [projects, activeStatuses]);

  return (
    <div 
      className="flex flex-col gap-8 md:gap-10 mx-auto"
      style={{ 
        fontFamily: 'Montserrat, sans-serif',
        width: isMobile ? '100%' : '100%',
        maxWidth: isMobile ? '100%' : '1200px',
        paddingLeft: isMobile ? '1rem' : undefined,
        paddingRight: isMobile ? '1rem' : undefined,
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      <div
        className={clsx(
          "relative rounded-2xl border w-full",
          isMobile ? "px-3 py-3" : "px-5 py-4",
          isDarkMode
            ? "border-zinc-700/60 bg-zinc-900/70 text-zinc-100"
            : "border-zinc-200 bg-white text-zinc-800 shadow-sm"
        )}
        style={{ 
          marginTop: isMobile ? 16 : 40,
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'visible',
          zIndex: isMobile ? 100 : 'auto',
          position: 'relative'
        }}
      >
        {/* BOKU stamp on the right - hidden on mobile */}
        {!isMobile && (
          <img
            src={isDarkMode ? "/media/boku_home_white.svg" : "/media/boku_home.svg"}
            alt="BOKU"
            className="absolute top-1 right-1 pointer-events-none opacity-60"
            style={{
              width: '120px',
              height: 'auto',
            }}
          />
        )}
        
        {isMobile ? (
          /* Mobile Portrait: Simple Dropdown with Multi-select */
          <div 
            className="flex flex-col gap-2 relative" 
            ref={dropdownRef}
            style={{
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            <label className="text-xs font-semibold uppercase tracking-wider block">
              Filter By Status
            </label>
            
            {/* Dropdown trigger button */}
            <button
              type="button"
              onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
              className={clsx(
                "w-full flex items-center justify-between rounded-lg border py-2.5 px-3 text-sm font-medium transition",
                isDarkMode
                  ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                  : "bg-white border-zinc-300 text-zinc-800 shadow-sm"
              )}
              style={{
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}
            >
              <span className="text-left">
                {activeStatuses.length === ALL_STATUS_KEYS.length
                  ? "All Statuses" 
                  : activeStatuses.length === 1
                    ? STATUS_OPTIONS.find(opt => opt.key === activeStatuses[0])?.label || "Select"
                    : `${activeStatuses.length} selected`}
              </span>
              <span className={clsx(
                "text-lg transition-transform",
                isMobileDropdownOpen ? "rotate-180" : ""
              )}>▼</span>
            </button>
            
            {/* Dropdown menu with checkboxes */}
            <AnimatePresence>
              {isMobileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={clsx(
                    "absolute top-full left-0 mt-1 rounded-lg border shadow-lg",
                    isDarkMode
                      ? "bg-zinc-800 border-zinc-700"
                      : "bg-white border-zinc-300"
                  )}
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    maxHeight: 'min(280px, calc(100vh - 220px))',
                    boxSizing: 'border-box',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    zIndex: 100
                  }}
                >
                  <div className="p-2 space-y-1">
                    {/* Individual status options */}
                    {STATUS_OPTIONS.map((option) => {
                      const isSelected = activeStatuses.includes(option.key);
                      return (
                        <label
                          key={option.key}
                          className={clsx(
                            "flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition",
                            isSelected
                              ? isDarkMode
                                ? "bg-emerald-500/20 text-emerald-200"
                                : "bg-emerald-100 text-emerald-900"
                              : isDarkMode
                                ? "hover:bg-zinc-700 text-zinc-100"
                                : "hover:bg-zinc-100 text-zinc-800"
                          )}
                          onClick={() => {
                            toggleStatus(option.key);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              toggleStatus(option.key);
                            }}
                            className="w-4 h-4 rounded border-zinc-400"
                          />
                          <span className={clsx("h-2.5 w-2.5 rounded-full", option.dotClass)} />
                          <span className="text-sm font-medium">{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Desktop: Original Horizontal Layout */
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.4em]">
              Filter By Status
            </span>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => {
                const isSelected = activeStatuses.includes(option.key);
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => toggleStatus(option.key)}
                    className={clsx(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                      isSelected
                        ? isDarkMode
                          ? "bg-emerald-500/20 border border-emerald-500/60 text-emerald-200 shadow-inner"
                          : "bg-emerald-100 border border-emerald-400/60 text-emerald-900 shadow-sm"
                        : isDarkMode
                          ? "bg-zinc-800 border border-zinc-700 text-zinc-300"
                          : "bg-zinc-100 border border-zinc-200 text-zinc-600 hover:bg-white"
                    )}
                  >
                    <span className={clsx("h-2.5 w-2.5 rounded-full", option.dotClass)} />
                    {option.label}
                  </button>
                );
              })}
            </div>
            <p className={clsx("text-xs", isDarkMode ? "text-zinc-500" : "text-zinc-500")}>
              Select one or multiple statuses to refine the projects.
            </p>
          </div>
        )}
      </div>

      {!filteredProjects.length ? (
        <div
          className={clsx(
            "flex flex-col items-center justify-center gap-4 rounded-2xl border px-8 py-16 text-center",
            isDarkMode
              ? "border-zinc-700/60 bg-zinc-900/70 text-zinc-300"
              : "border-zinc-200 bg-white text-zinc-600 shadow-sm"
          )}
        >
          <span className="text-lg font-semibold tracking-wide">
            No projects match the selected filters.
          </span>
          <span className="text-sm">
            Try adjusting the status filters to explore more ceramics.
          </span>
        </div>
      ) : (
        filteredProjects.map((project, index) => (
        <Fragment key={project.id ?? index}>
          <ProjectRow project={project} index={index} isDarkMode={isDarkMode} />
          {index < filteredProjects.length - 1 && (
            <div className="flex justify-center">
              <div
                className={clsx(
                  "h-px w-full max-w-xl",
                  isDarkMode ? "bg-zinc-700/60" : "bg-zinc-200"
                )}
              />
            </div>
          )}
        </Fragment>
        ))
      )}
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
  const contentOrder = isEven ? "md:order-1" : "md:order-3";
  const heroOrder = isEven ? "md:order-3" : "md:order-1";
  const accentBorder = isDarkMode ? "border-zinc-600/60" : "border-zinc-300/80";
  const bgSurface = isDarkMode ? "bg-zinc-900/60" : "bg-white/80";
  const textPrimary = isDarkMode ? "text-zinc-50" : "text-zinc-900";
  const textSecondary = isDarkMode ? "text-zinc-400" : "text-zinc-600";

  const totalImages = project.galleryImages.length;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  
  const isMobile = useIsMobile();
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isHeroVideoPlaying, setIsHeroVideoPlaying] = useState(false);
  const [isHeroVideoMuted, setIsHeroVideoMuted] = useState(true);
  const heroMuteStateRef = useRef(isHeroVideoMuted);
  const heroDirectionalRafRef = useRef<number | null>(null);
  const heroDirectionalDirectionRef = useRef<"forward" | "backward" | null>(null);
  const [isModalHeroVideo, setIsModalHeroVideo] = useState(false);
  const modalHeroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isModalHeroVideoPlaying, setIsModalHeroVideoPlaying] = useState(false);
  const [isModalHeroVideoMuted, setIsModalHeroVideoMuted] = useState(true);
  const modalHeroMuteStateRef = useRef(isModalHeroVideoMuted);
  const modalHeroDirectionalRafRef = useRef<number | null>(null);
  const modalHeroDirectionalDirectionRef = useRef<"forward" | "backward" | null>(null);
  const heroVideoUrl = project.heroImage.mediaType === "video" ? project.heroImage.src : null;
  const heroVideoPoster =
    project.heroImage.mediaType === "video" ? project.heroImage.poster : undefined;

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project.id, totalImages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  // Detect mobile landscape mode
  useEffect(() => {
    const checkMobileLandscape = () => {
      // Check if device is mobile (either width or height <= 600px)
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobileDevice = width <= 600 || height <= 600;
      
      if (!isMobileDevice) {
        setIsMobileLandscape(false);
        return;
      }
      
      // Check if in landscape orientation
      const isLandscape = window.matchMedia('(orientation: landscape)').matches;
      setIsMobileLandscape(isLandscape);
    };

    // Initial check
    checkMobileLandscape();
    
    // Listen for orientation and resize changes
    const landscapeQuery = window.matchMedia('(orientation: landscape)');
    landscapeQuery.addEventListener('change', checkMobileLandscape);
    window.addEventListener('resize', checkMobileLandscape);
    window.addEventListener('orientationchange', checkMobileLandscape);

    return () => {
      landscapeQuery.removeEventListener('change', checkMobileLandscape);
      window.removeEventListener('resize', checkMobileLandscape);
      window.removeEventListener('orientationchange', checkMobileLandscape);
    };
  }, []); // Remove dependency on isMobile to avoid timing issues

  useEffect(() => {
    if (!totalImages) return;
    setModalImageIndex((prev) => {
      if (prev >= totalImages) return 0;
      return prev;
    });
  }, [totalImages]);
  useEffect(() => {
    if (project.heroImage.mediaType === "video") {
      const video = heroVideoRef.current;
      if (video) {
        setIsHeroVideoPlaying(!video.paused);
      } else {
        setIsHeroVideoPlaying(false);
      }
    } else {
      setIsHeroVideoPlaying(false);
    }
  }, [project.heroImage.mediaType, project.id]);

  const handleNavigate = useCallback(
    (direction: number) => {
      if (!totalImages) return;

      setActiveImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + direction + totalImages) % totalImages;
        return nextIndex;
      });
    },
    [totalImages]
  );

  const handleModalNavigate = useCallback(
    (direction: number) => {
      if (!totalImages) return;

      setModalImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + direction + totalImages) % totalImages;
        return nextIndex;
      });
    },
    [totalImages]
  );

  useEffect(() => {
    heroMuteStateRef.current = isHeroVideoMuted;
    const video = heroVideoRef.current;
    if (video) {
      video.muted = isHeroVideoMuted;
    }
  }, [isHeroVideoMuted]);

  useEffect(() => {
    modalHeroMuteStateRef.current = isModalHeroVideoMuted;
    const video = modalHeroVideoRef.current;
    if (video) {
      video.muted = isModalHeroVideoMuted;
    }
  }, [isModalHeroVideoMuted]);

  const handleHeroVideoLoaded = useCallback(() => {
    const video = heroVideoRef.current;
    if (video) {
      try {
        video.currentTime = 0;
      } catch {
        // ignore seek errors
      }
      video.pause();
      video.muted = heroMuteStateRef.current;
    }
  }, []);

  const handleModalHeroVideoLoaded = useCallback(() => {
    const video = modalHeroVideoRef.current;
    if (video) {
      try {
        video.currentTime = 0;
      } catch {
        // ignore seek errors
      }
      video.pause();
      video.muted = modalHeroMuteStateRef.current;
    }
  }, []);

  useEffect(() => {
    if (project.heroImage.mediaType === "video") {
      handleHeroVideoLoaded();
    }
  }, [project.heroImage.mediaType, project.heroImage.src, handleHeroVideoLoaded]);

  const stopHeroDirectionalSeek = useCallback(() => {
    heroDirectionalDirectionRef.current = null;
    if (heroDirectionalRafRef.current !== null) {
      cancelAnimationFrame(heroDirectionalRafRef.current);
      heroDirectionalRafRef.current = null;
    }
    const video = heroVideoRef.current;
    if (video) {
      video.muted = isHeroVideoMuted;
    }
  }, [isHeroVideoMuted]);

  const startHeroDirectionalSeek = useCallback(
    (direction: "forward" | "backward") => {
      const video = heroVideoRef.current;
      if (!video) return;

      video.pause();
      video.muted = true;
      setIsHeroVideoPlaying(false);
      heroDirectionalDirectionRef.current = direction;

      let previousTimestamp: number | null = null;

      const step = (timestamp: number) => {
        if (heroDirectionalDirectionRef.current !== direction) return;
        const currentVideo = heroVideoRef.current;
        if (!currentVideo) {
          stopHeroDirectionalSeek();
          return;
        }

        if (previousTimestamp === null) {
          previousTimestamp = timestamp;
        }

        const deltaSeconds = (timestamp - previousTimestamp) / 1000;
        previousTimestamp = timestamp;

        const duration = Number.isFinite(currentVideo.duration) ? currentVideo.duration : undefined;
        const nextTime =
          direction === "forward"
            ? currentVideo.currentTime + deltaSeconds
            : currentVideo.currentTime - deltaSeconds;

        const clampedTime =
          duration !== undefined
            ? Math.min(Math.max(0, nextTime), duration)
            : Math.max(0, nextTime);

        currentVideo.currentTime = clampedTime;

        if (
          (direction === "forward" && duration !== undefined && clampedTime >= duration) ||
          (direction === "backward" && clampedTime <= 0)
        ) {
          stopHeroDirectionalSeek();
          return;
        }

        heroDirectionalRafRef.current = requestAnimationFrame(step);
      };

      heroDirectionalRafRef.current = requestAnimationFrame(step);
    },
    [stopHeroDirectionalSeek]
  );

  const stopModalHeroDirectionalSeek = useCallback(() => {
    modalHeroDirectionalDirectionRef.current = null;
    if (modalHeroDirectionalRafRef.current !== null) {
      cancelAnimationFrame(modalHeroDirectionalRafRef.current);
      modalHeroDirectionalRafRef.current = null;
    }
    const video = modalHeroVideoRef.current;
    if (video) {
      video.muted = isModalHeroVideoMuted;
    }
  }, [isModalHeroVideoMuted]);

  const startModalHeroDirectionalSeek = useCallback(
    (direction: "forward" | "backward") => {
      const video = modalHeroVideoRef.current;
      if (!video) return;

      video.pause();
      video.muted = true;
      setIsModalHeroVideoPlaying(false);
      modalHeroDirectionalDirectionRef.current = direction;

      let previousTimestamp: number | null = null;

      const step = (timestamp: number) => {
        if (modalHeroDirectionalDirectionRef.current !== direction) return;
        const currentVideo = modalHeroVideoRef.current;
        if (!currentVideo) {
          stopModalHeroDirectionalSeek();
          return;
        }

        if (previousTimestamp === null) {
          previousTimestamp = timestamp;
        }

        const deltaSeconds = (timestamp - previousTimestamp) / 1000;
        previousTimestamp = timestamp;

        const duration = Number.isFinite(currentVideo.duration) ? currentVideo.duration : undefined;
        const nextTime =
          direction === "forward"
            ? currentVideo.currentTime + deltaSeconds
            : currentVideo.currentTime - deltaSeconds;

        const clampedTime =
          duration !== undefined
            ? Math.min(Math.max(0, nextTime), duration)
            : Math.max(0, nextTime);

        currentVideo.currentTime = clampedTime;

        if (
          (direction === "forward" && duration !== undefined && clampedTime >= duration) ||
          (direction === "backward" && clampedTime <= 0)
        ) {
          stopModalHeroDirectionalSeek();
          return;
        }

        modalHeroDirectionalRafRef.current = requestAnimationFrame(step);
      };

      modalHeroDirectionalRafRef.current = requestAnimationFrame(step);
    },
    [stopModalHeroDirectionalSeek]
  );

  const handleHeroPlayPause = useCallback(() => {
    stopHeroDirectionalSeek();
    const video = heroVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = isHeroVideoMuted;
      const playPromise = video.play();
      if (playPromise) {
        playPromise
          .then(() => {
            setIsHeroVideoPlaying(true);
            window.dispatchEvent(
              new CustomEvent(HERO_VIDEO_EVENT, {
                detail: { id: project.id, source: "hero" as const }
              })
            );
          })
          .catch(() => {
            setIsHeroVideoPlaying(false);
          });
      }
      if (!playPromise) {
        setIsHeroVideoPlaying(true);
        window.dispatchEvent(
          new CustomEvent(HERO_VIDEO_EVENT, {
            detail: { id: project.id, source: "hero" as const }
          })
        );
      }
    } else {
      video.pause();
      setIsHeroVideoPlaying(false);
    }
  }, [stopHeroDirectionalSeek, project.id, isHeroVideoMuted]);

  const handleModalHeroPlayPause = useCallback(() => {
    stopModalHeroDirectionalSeek();
    const video = modalHeroVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = isModalHeroVideoMuted;
      const playPromise = video.play();
      if (playPromise) {
        playPromise
          .then(() => {
            setIsModalHeroVideoPlaying(true);
            window.dispatchEvent(
              new CustomEvent(HERO_VIDEO_EVENT, {
                detail: { id: project.id, source: "modal" as const }
              })
            );
          })
          .catch(() => {
            setIsModalHeroVideoPlaying(false);
          });
      }
      if (!playPromise) {
        setIsModalHeroVideoPlaying(true);
        window.dispatchEvent(
          new CustomEvent(HERO_VIDEO_EVENT, {
            detail: { id: project.id, source: "modal" as const }
          })
        );
      }
    } else {
      video.pause();
      setIsModalHeroVideoPlaying(false);
    }
  }, [stopModalHeroDirectionalSeek, project.id, isModalHeroVideoMuted]);

  const openModal = useCallback((startIndex: number) => {
    setIsModalHeroVideo(false);
    setModalImageIndex(startIndex);
    setIsModalOpen(true);
  }, []);

  const openHeroModal = useCallback((withSound = false) => {
    if (project.heroImage.mediaType === "video") {
      stopModalHeroDirectionalSeek();
      setIsModalHeroVideoPlaying(false);
      const heroVideo = heroVideoRef.current;
      if (heroVideo) {
        heroVideo.pause();
        setIsHeroVideoPlaying(false);
      }
      const shouldUnmute = withSound || !isHeroVideoMuted;
      setIsModalHeroVideoMuted(!shouldUnmute ? isHeroVideoMuted : false);
      setIsHeroVideoMuted(!shouldUnmute ? isHeroVideoMuted : false);
      setIsModalHeroVideo(true);
      const modalVideo = modalHeroVideoRef.current;
      if (modalVideo) {
        modalVideo.currentTime = 0;
        modalVideo.pause();
        modalVideo.muted = !shouldUnmute ? isHeroVideoMuted : false;
      }
      setIsModalOpen(true);
    } else if (totalImages > 0) {
      setIsModalHeroVideo(false);
      setModalImageIndex(activeImageIndex);
      setIsModalOpen(true);
    }
  }, [
    project.heroImage.mediaType,
    totalImages,
    activeImageIndex,
    stopModalHeroDirectionalSeek,
    isHeroVideoMuted
  ]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setActiveImageIndex(modalImageIndex);
    setIsModalHeroVideo(false);
    setIsModalHeroVideoPlaying(false);
    stopModalHeroDirectionalSeek();
    const modalVideo = modalHeroVideoRef.current;
    if (modalVideo) {
      modalVideo.pause();
    }
  }, [modalImageIndex, stopModalHeroDirectionalSeek]);

  const controlStyles = clsx(
    "inline-flex h-11 w-11 items-center justify-center rounded-full border transition duration-200 backdrop-blur-md opacity-70 hover:opacity-100",
    isDarkMode
      ? "border-zinc-600/40 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800"
      : "border-zinc-200 bg-white/60 text-zinc-700 hover:bg-zinc-100"
  );

  const modalControlStyles = clsx(
    "inline-flex h-12 w-12 items-center justify-center rounded-full border transition duration-200 backdrop-blur-lg opacity-70 hover:opacity-100",
    "shadow-lg",
    isDarkMode
      ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
      : "border-black/10 bg-white/80 text-zinc-900 hover:bg-white"
  );

  const availabilityStatusKey = project.availability
    ? project.availability.status ?? project.availability.label.trim().toLowerCase()
    : null;
  const normalizedAvailabilityKey = availabilityStatusKey
    ? availabilityStatusKey.replace(/\s+/g, "-")
    : null;
  const availabilityDotClass =
    project.availability && normalizedAvailabilityKey
      ? project.availability.colorClass ??
        AVAILABILITY_STATUS_COLOR_CLASSES[normalizedAvailabilityKey] ??
        "bg-emerald-400"
      : project.availability?.colorClass ?? null;

  const availabilityPill = project.availability ? (
    <div
      className={clsx(
        "inline-flex items-center gap-3 rounded-full border self-start transition-colors duration-200",
        isMobileLandscape 
          ? "px-2.5 py-1.5 text-xs gap-2" 
          : "px-4 py-2 text-sm gap-3",
        isDarkMode
          ? "bg-zinc-900/60 border-zinc-700/70 text-zinc-100"
          : "bg-white border-zinc-200 text-zinc-700 shadow-sm"
      )}
    >
      <span
        className={clsx(
          "rounded-full",
          isMobileLandscape ? "h-1.5 w-1.5" : "h-2.5 w-2.5",
          availabilityDotClass ?? "bg-emerald-400"
        )}
        aria-hidden="true"
      />
      <span className={isMobileLandscape ? "text-xs" : ""}>{project.availability.label}</span>
      <span className={clsx(isDarkMode ? "text-zinc-500" : "text-zinc-400")}>—</span>
      <span className={isMobileLandscape ? "text-xs" : ""}>{project.availability.price}</span>
    </div>
  ) : null;

  const availabilityPillModal = project.availability ? (
    <div
      className={clsx(
        "inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 border",
        isDarkMode
          ? "bg-zinc-900/80 border-zinc-700/80 text-zinc-100"
          : "bg-white border-zinc-200 text-zinc-700 shadow"
      )}
    >
      <span
        className={clsx("h-2.5 w-2.5 rounded-full", availabilityDotClass ?? "bg-emerald-400")}
        aria-hidden="true"
      />
      <span>{project.availability.label}</span>
      <span className={clsx(isDarkMode ? "text-zinc-500" : "text-zinc-400")}>—</span>
      <span>{project.availability.price}</span>
    </div>
  ) : null;

  const decodedImagesRef = useRef<Map<string, boolean>>(new Map());

  const currentImage =
    totalImages > 0 ? project.galleryImages[activeImageIndex] : null;
  const isCurrentImageDecoded = currentImage
    ? decodedImagesRef.current.get(currentImage.src) ?? false
    : false;

  const modalImage =
    totalImages > 0 ? project.galleryImages[modalImageIndex] : null;
  const isModalImageDecoded = modalImage
    ? decodedImagesRef.current.get(modalImage.src) ?? false
    : false;

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    project.galleryImages.forEach((image) => {
      if (decodedImagesRef.current.has(image.src)) return;

      const preload = new window.Image();
      preload.decoding = "async";
      preload.src = image.src;

      const setDecoded = () => {
        if (!cancelled) {
          decodedImagesRef.current.set(image.src, true);
        }
      };

      if (preload.decode) {
        preload
          .decode()
          .then(setDecoded)
          .catch(() => {
            // Fallback to marking as decoded even if decode isn't supported
            setDecoded();
          });
      } else {
        preload.onload = setDecoded;
        preload.onerror = setDecoded;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [project.galleryImages, project.id]);

  useEffect(() => {
    if (!isModalOpen) {
      if (typeof document !== "undefined") {
        // Restore scroll position and remove lock
        const scrollY = document.body.style.top;
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("position");
        document.body.style.removeProperty("top");
        document.body.style.removeProperty("width");
        document.body.style.removeProperty("height");
        document.body.style.removeProperty("touch-action");
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
      stopModalHeroDirectionalSeek();
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      } else if (!isModalHeroVideo && event.key === "ArrowRight") {
        handleModalNavigate(1);
      } else if (!isModalHeroVideo && event.key === "ArrowLeft") {
        handleModalNavigate(-1);
      }
    };

    // Prevent scrolling when modal is open - especially important for hero video modal
    if (typeof document !== "undefined") {
      // Save scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      
      // Also prevent scrolling on html element
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.touchAction = "none";
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleScrollPrevent, { passive: false });
    window.addEventListener("touchmove", handleScrollPrevent, { passive: false });

    function handleScrollPrevent(e: Event) {
      if (isModalOpen) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleScrollPrevent);
      window.removeEventListener("touchmove", handleScrollPrevent);
      
      if (typeof document !== "undefined") {
        // Restore scroll position
        const scrollY = document.body.style.top;
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("position");
        document.body.style.removeProperty("top");
        document.body.style.removeProperty("width");
        document.body.style.removeProperty("height");
        document.body.style.removeProperty("touch-action");
        document.documentElement.style.removeProperty("overflow");
        document.documentElement.style.removeProperty("touch-action");
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
      stopModalHeroDirectionalSeek();
    };
  }, [isModalOpen, isModalHeroVideo, handleModalNavigate, closeModal, stopModalHeroDirectionalSeek]);

  // Add/remove body class when hero modal is open to hide UI elements in App.tsx
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isModalOpen && isModalHeroVideo) {
        document.body.classList.add("hero-modal-open");
      } else {
        document.body.classList.remove("hero-modal-open");
      }
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("hero-modal-open");
      }
    };
  }, [isModalOpen, isModalHeroVideo]);

  useEffect(() => {
    if (!isModalOpen || !isModalHeroVideo) return;

    const heroVideo = heroVideoRef.current;
    const modalVideo = modalHeroVideoRef.current;
    if (modalVideo) {
      if (heroVideo) {
        try {
          modalVideo.currentTime = heroVideo.currentTime;
        } catch {
          // ignore sync errors
        }
      }
      modalVideo.pause();
      modalVideo.loop = true;
    }
    setIsModalHeroVideoPlaying(false);
    stopModalHeroDirectionalSeek();
  }, [isModalOpen, isModalHeroVideo, stopModalHeroDirectionalSeek]);

  useEffect(() => {
    if (isModalOpen && !isModalHeroVideo) {
      setActiveImageIndex(modalImageIndex);
    }
  }, [isModalOpen, isModalHeroVideo, modalImageIndex]);

  useEffect(() => {
    return () => {
      stopHeroDirectionalSeek();
    };
  }, [stopHeroDirectionalSeek]);

  useEffect(() => {
    return () => {
      stopModalHeroDirectionalSeek();
    };
  }, [stopModalHeroDirectionalSeek]);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (video) {
      video.muted = isHeroVideoMuted;
    }
  }, [isHeroVideoMuted]);

  useEffect(() => {
    const video = modalHeroVideoRef.current;
    if (video) {
      video.muted = isModalHeroVideoMuted;
    }
  }, [isModalHeroVideoMuted]);

  useEffect(() => {
    const handleGlobalHeroPlay = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; source: "hero" | "modal" }>;
      const detail = customEvent.detail;
      if (!detail) return;
      const isSameProject = detail.id === project.id;

      if (!isSameProject || detail.source === "modal") {
        stopHeroDirectionalSeek();
        const heroVideo = heroVideoRef.current;
        if (heroVideo) {
          heroVideo.pause();
        }
        setIsHeroVideoPlaying(false);
      }

      if (!isSameProject) {
        stopModalHeroDirectionalSeek();
        const modalVideo = modalHeroVideoRef.current;
        if (modalVideo) {
          modalVideo.pause();
        }
        setIsModalHeroVideoPlaying(false);
      }
    };

    window.addEventListener(HERO_VIDEO_EVENT, handleGlobalHeroPlay);
    return () => {
      window.removeEventListener(HERO_VIDEO_EVENT, handleGlobalHeroPlay);
    };
  }, [
    project.id,
    stopHeroDirectionalSeek,
    stopModalHeroDirectionalSeek,
    setIsHeroVideoPlaying,
    setIsModalHeroVideoPlaying
  ]);

  return (
    <>
      <div
        className={clsx(
          "transition-opacity duration-200",
          isModalOpen && "opacity-10"
        )}
      >
        <motion.section
          className="flex flex-col gap-2 md:gap-2 md:h-[95vh] md:max-h-[95vh]"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
        <div
          className={clsx(
            "flex flex-col gap-2 md:gap-2",
            "md:flex-row md:items-stretch md:h-full"
          )}
        >
          {/* Hero image column - hidden on mobile */}
          {!isMobile && (
            <motion.figure
              className={clsx(
                "w-full h-[320px] md:h-full md:w-[40%] lg:w-[40%] flex-shrink-0 rounded-[20px] overflow-hidden border relative shadow-xl shadow-black/5 md:min-h-[360px]",
                accentBorder,
                heroOrder
              )}
              role={project.heroImage.mediaType === "video" ? "button" : undefined}
              tabIndex={project.heroImage.mediaType === "video" ? 0 : undefined}
              onClick={(event) => {
                if (project.heroImage.mediaType !== "video") return;
                const target = event.target as HTMLElement;
                if (target?.closest("[data-hero-control]")) return;
                openHeroModal();
              }}
              onKeyDown={(event) => {
                if (project.heroImage.mediaType !== "video") return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openHeroModal();
                }
              }}
            >
              {project.heroImage.mediaType === "video" ? (
                <>
                  <video
                    ref={heroVideoRef}
                    src={project.heroImage.src}
                    poster={project.heroImage.poster}
                    className="h-full w-full object-cover"
                    aria-label={project.heroImage.alt}
                    loop
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={handleHeroVideoLoaded}
                    onLoadedData={handleHeroVideoLoaded}
                    onPlay={() => setIsHeroVideoPlaying(true)}
                    onPause={() => setIsHeroVideoPlaying(false)}
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-black/5" />
                  {/* BOKU stamp in bottom left */}
                  <img
                    src={isDarkMode ? "/media/boku_home_white.svg" : "/media/boku_home.svg"}
                    alt="BOKU"
                    className="absolute bottom-1 left-1 pointer-events-none"
                    style={{
                      width: '120px',
                      height: 'auto',
                    }}
                  />
                  <div
                    className={clsx(
                      "absolute bottom-4 right-4 flex items-center gap-3 rounded-full px-4 py-2 backdrop-blur-sm border",
                      isDarkMode
                        ? "bg-black/50 border-white/10"
                        : "bg-white/80 border-black/10 shadow-lg"
                    )}
                  >
                    <button
                      type="button"
                      className={controlStyles}
                      data-hero-control="true"
                      onPointerDown={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        if (event.currentTarget.setPointerCapture) {
                          event.currentTarget.setPointerCapture(event.pointerId);
                        }
                        startHeroDirectionalSeek("backward");
                      }}
                      onPointerUp={(event) => {
                        event.stopPropagation();
                        if (event.currentTarget.releasePointerCapture) {
                          event.currentTarget.releasePointerCapture(event.pointerId);
                        }
                        stopHeroDirectionalSeek();
                      }}
                      onPointerLeave={(event) => {
                        if (event.currentTarget.releasePointerCapture) {
                          event.currentTarget.releasePointerCapture(event.pointerId);
                        }
                        stopHeroDirectionalSeek();
                      }}
                      onPointerCancel={(event) => {
                        if (event.currentTarget.releasePointerCapture) {
                          event.currentTarget.releasePointerCapture(event.pointerId);
                        }
                        stopHeroDirectionalSeek();
                      }}
                      aria-label="Rewind hero video"
                    >
                      ⏪
                    </button>
                    <button
                      type="button"
                      className={controlStyles}
                      data-hero-control="true"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleHeroPlayPause();
                      }}
                      aria-label="Play or pause hero video"
                    >
                      {isHeroVideoPlaying ? "⏸" : "▶"}
                    </button>
                    <button
                      type="button"
                      className={controlStyles}
                      data-hero-control="true"
                      onPointerDown={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        if (event.currentTarget.setPointerCapture) {
                          event.currentTarget.setPointerCapture(event.pointerId);
                        }
                        startHeroDirectionalSeek("forward");
                      }}
                      onPointerUp={(event) => {
                        event.stopPropagation();
                        if (event.currentTarget.releasePointerCapture) {
                          event.currentTarget.releasePointerCapture(event.pointerId);
                        }
                        stopHeroDirectionalSeek();
                      }}
                      onPointerLeave={(event) => {
                        if (event.currentTarget.releasePointerCapture) {
                          event.currentTarget.releasePointerCapture(event.pointerId);
                        }
                        stopHeroDirectionalSeek();
                      }}
                      onPointerCancel={(event) => {
                        if (event.currentTarget.releasePointerCapture) {
                          event.currentTarget.releasePointerCapture(event.pointerId);
                        }
                        stopHeroDirectionalSeek();
                      }}
                      aria-label="Fast forward hero video"
                    >
                      ⏩
                    </button>
                    <button
                      type="button"
                      className={controlStyles}
                      data-hero-control="true"
                      onClick={(event) => {
                        event.stopPropagation();
                        const video = heroVideoRef.current;
                        if (!video) {
                          const next = !isHeroVideoMuted;
                          heroMuteStateRef.current = next;
                          setIsHeroVideoMuted(next);
                          return;
                        }
                        const next = !isHeroVideoMuted;
                        heroMuteStateRef.current = next;
                        video.muted = next;
                        setIsHeroVideoMuted(next);
                      }}
                      aria-label={isHeroVideoMuted ? "Unmute hero video" : "Mute hero video"}
                    >
                      {isHeroVideoMuted ? "🔇" : "🔊"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={project.heroImage.src}
                    alt={project.heroImage.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-black/5" />
                </>
              )}
              <figcaption className="absolute top-4 left-4">
                <div
                  className={clsx(
                    "rounded-full px-4 py-2 text-sm font-semibold shadow-md border",
                    "bg-white text-zinc-900 border-black/10"
                  )}
                >
                  {project.title}
                </div>
              </figcaption>
            </motion.figure>
          )}

          {/* Content column */}
          <motion.div
            className={clsx(
              "w-full md:flex-1 rounded-[20px] border shadow-lg shadow-black/5 backdrop-blur-sm",
              accentBorder,
              bgSurface,
              "px-8 py-8 md:px-9 md:py-9 flex flex-col gap-8 md:h-full",
              contentOrder
            )}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
                <div className="space-y-3">
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
                </div>
                {availabilityPill}
              </div>
              <p className={clsx("text-base md:text-lg leading-relaxed", textSecondary)}>
                {project.description}
              </p>
            </div>
            {/* View Gallery button for mobile landscape */}
            {isMobileLandscape && totalImages > 0 && (
              <motion.button
                onClick={() => openModal(0)}
                className={clsx(
                  "self-start px-6 py-3 rounded-lg font-semibold text-sm transition-colors border mt-4",
                  isDarkMode
                    ? "bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700"
                    : "bg-black border-black text-white hover:bg-zinc-800"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                View Gallery
              </motion.button>
            )}
            {/* Hide gallery section on mobile landscape */}
            {!isMobileLandscape && (
              <div
                className={clsx(
                  "relative rounded-[20px] overflow-hidden flex flex-col md:flex-1",
                  accentBorder,
                  isDarkMode ? "bg-zinc-900/30" : "bg-white/70",
                  isMobile && project.heroImage.mediaType === "video" ? "border-b-0 rounded-b-none" : ""
                )}
              >
              <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-black/15 via-transparent to-black/10 mix-blend-multiply" />
              <div className="relative flex flex-col gap-5 p-0 md:p-0 md:flex-1 md:min-h-0 ">
                {currentImage ? (
                  <>
                    <div
                      className="relative w-full h-72 md:flex-1 md:min-h-[360px] md:h-full overflow-hidden rounded-[16px] bg-black/5 cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-zinc-400"
                      role="button"
                      tabIndex={0}
                      onClick={() => openModal(activeImageIndex)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openModal(activeImageIndex);
                        }
                      }}
                    >
                      <AnimatePresence mode="sync" initial={false}>
                        <motion.img
                          key={currentImage.src}
                          src={currentImage.src}
                          alt={currentImage.alt}
                          className="absolute inset-0 h-full w-full object-fill md:object-cover"
                          loading={isCurrentImageDecoded ? "eager" : "lazy"}
                          initial={{ opacity: isCurrentImageDecoded ? 0.4 : 0, scale: 1.01 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.995 }}
                          transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
                        />
                      </AnimatePresence>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" />
                      <motion.div
                        className={clsx(
                          "absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full backdrop-blur-sm transition duration-200",
                          isMobile ? "px-4 py-2" : "px-3 py-1.5",
                          isDarkMode ? "bg-black/20" : "bg-white/60"
                        )}
                        initial={{ opacity: 0.6 }}
                        whileHover={{ opacity: 1 }}
                        onClick={(event) => event.stopPropagation()}
                        style={{
                          minWidth: isMobile ? '140px' : 'auto'
                        }}
                      >
                        <motion.button
                          type="button"
                          className={controlStyles}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleNavigate(-1);
                          }}
                          aria-label="Previous gallery image"
                          initial={{ opacity: 0.7 }}
                          whileHover={{ opacity: 1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {"<"}
                        </motion.button>
                        <span
                          className={clsx(
                            "font-semibold uppercase whitespace-nowrap",
                            isMobile ? "text-sm" : "text-xs tracking-[0.3em]",
                            isDarkMode ? "text-zinc-100" : "text-zinc-700"
                          )}
                        >
                          {activeImageIndex + 1} / {totalImages}
                        </span>
                        <motion.button
                          type="button"
                          className={controlStyles}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleNavigate(1);
                          }}
                          aria-label="Next gallery image"
                          initial={{ opacity: 0.7 }}
                          whileHover={{ opacity: 1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {">"}
                        </motion.button>
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <p
                    className={clsx(
                      "text-center text-sm font-medium",
                      isDarkMode ? "text-zinc-400" : "text-zinc-500"
                    )}
                  >
                    Gallery coming soon.
                  </p>
                )}
              </div>
              {/* View in 3D button for mobile - separate component at bottom of preview card */}
              {isMobile && project.heroImage.mediaType === "video" && (
                <div className="pb-0 pt-4 mt-auto">
                  <motion.button
                    onClick={() => openHeroModal(true)}
                    className={clsx(
                      "w-full px-6 py-3 rounded-lg font-semibold text-sm transition-colors",
                      isDarkMode
                        ? "bg-zinc-700 text-zinc-100 hover:bg-zinc-600 border-2 border-white"
                        : "bg-zinc-200 text-black hover:bg-zinc-300"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      fontFamily: "Montserrat, sans-serif"
                    }}
                  >
                    View in 3D
                  </motion.button>
                </div>
              )}
              </div>
            )}
          </motion.div>
        </div>
        </motion.section>
      </div>

      {isMounted &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                className={clsx(
                  "fixed inset-0 z-[2000] flex items-center justify-center",
                  isModalHeroVideo ? "p-0 bg-white overflow-hidden" : "px-4 sm:px-8 py-8 bg-black/50"
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeModal}
                style={{
                  touchAction: isModalHeroVideo ? "none" : "auto",
                  overscrollBehavior: "none"
                }}
              >
                <motion.div
                  className={clsx(
                    "relative overflow-hidden flex flex-col",
                    isModalHeroVideo 
                      ? "w-full h-full rounded-none shadow-none bg-white overflow-hidden"
                      : "w-full max-w-5xl max-h-[95vh] rounded-[28px] shadow-2xl",
                    !isModalHeroVideo && (isDarkMode ? "bg-zinc-900 border border-zinc-700/60" : "bg-white border border-white/60")
                  )}
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 10 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  role="dialog"
                  aria-modal="true"
                  aria-label={`${project.title} gallery`}
                  onClick={(event) => event.stopPropagation()}
                  style={{
                    touchAction: isModalHeroVideo ? "none" : "auto",
                    overscrollBehavior: "none"
                  }}
                >
                  {/* Header (logo + title) in hero fullscreen */}
                  {isModalHeroVideo && (
                    <div className="absolute top-0 left-0 z-40 flex items-center gap-3">
                      <img
                        src={isDarkMode ? "/media/boku_home_white.svg" : "/media/boku_home.svg"}
                        alt="BOKU"
                        className="pointer-events-none"
                        style={{
                          width: isMobile && !isMobileLandscape ? '72px' : (isMobileLandscape ? '80px' : '120px'),
                          height: 'auto',
                        }}
                      />
                      <span
                        className={clsx(
                          "text-lg font-semibold",
                          isDarkMode ? "text-black" : "text-black"
                        )}
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {project.title}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={closeModal}
                    className={clsx(
                      "absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition z-30",
                      isDarkMode
                        ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
                        : "border-black/10 bg-white text-zinc-800 hover:bg-zinc-100"
                    )}
                    aria-label="Close gallery modal"
                  >
                    ✕
                  </button>

                  {isModalHeroVideo && heroVideoUrl ? (
                    /* Full screen hero video */
                    <div className="relative w-full h-full flex items-center justify-center bg-white">
                      <video
                        key={heroVideoUrl}
                        ref={modalHeroVideoRef}
                        src={heroVideoUrl}
                        poster={heroVideoPoster}
                        className="w-full h-full object-contain"
                        loop
                        playsInline
                        preload="metadata"
                        onLoadedMetadata={handleModalHeroVideoLoaded}
                        onLoadedData={handleModalHeroVideoLoaded}
                        onPlay={() => setIsModalHeroVideoPlaying(true)}
                        onPause={() => setIsModalHeroVideoPlaying(false)}
                      />
                      <div
                        className={clsx(
                          "absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full px-4 py-2 backdrop-blur-sm border z-40",
                          isDarkMode
                            ? "bg-black/60 border-white/10"
                            : "bg-white/80 border-black/10 shadow-lg"
                        )}
                      >
                              <button
                                type="button"
                                className={controlStyles}
                                data-hero-control="true"
                                onPointerDown={(event) => {
                                  event.stopPropagation();
                                  event.preventDefault();
                                  if (event.currentTarget.setPointerCapture) {
                                    event.currentTarget.setPointerCapture(event.pointerId);
                                  }
                                  startModalHeroDirectionalSeek("backward");
                                }}
                                onPointerUp={(event) => {
                                  event.stopPropagation();
                                  if (event.currentTarget.releasePointerCapture) {
                                    event.currentTarget.releasePointerCapture(event.pointerId);
                                  }
                                  stopModalHeroDirectionalSeek();
                                }}
                                onPointerLeave={(event) => {
                                  if (event.currentTarget.releasePointerCapture) {
                                    event.currentTarget.releasePointerCapture(event.pointerId);
                                  }
                                  stopModalHeroDirectionalSeek();
                                }}
                                onPointerCancel={(event) => {
                                  if (event.currentTarget.releasePointerCapture) {
                                    event.currentTarget.releasePointerCapture(event.pointerId);
                                  }
                                  stopModalHeroDirectionalSeek();
                                }}
                                aria-label="Rewind hero video"
                              >
                                ⏪
                              </button>
                              <button
                                type="button"
                                className={controlStyles}
                                data-hero-control="true"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleModalHeroPlayPause();
                                }}
                                aria-label="Play or pause hero video"
                              >
                                {isModalHeroVideoPlaying ? "⏸" : "▶"}
                              </button>
                              <button
                                type="button"
                                className={controlStyles}
                                data-hero-control="true"
                                onPointerDown={(event) => {
                                  event.stopPropagation();
                                  event.preventDefault();
                                  if (event.currentTarget.setPointerCapture) {
                                    event.currentTarget.setPointerCapture(event.pointerId);
                                  }
                                  startModalHeroDirectionalSeek("forward");
                                }}
                                onPointerUp={(event) => {
                                  event.stopPropagation();
                                  if (event.currentTarget.releasePointerCapture) {
                                    event.currentTarget.releasePointerCapture(event.pointerId);
                                  }
                                  stopModalHeroDirectionalSeek();
                                }}
                                onPointerLeave={(event) => {
                                  if (event.currentTarget.releasePointerCapture) {
                                    event.currentTarget.releasePointerCapture(event.pointerId);
                                  }
                                  stopModalHeroDirectionalSeek();
                                }}
                                onPointerCancel={(event) => {
                                  if (event.currentTarget.releasePointerCapture) {
                                    event.currentTarget.releasePointerCapture(event.pointerId);
                                  }
                                  stopModalHeroDirectionalSeek();
                                }}
                                aria-label="Fast forward hero video"
                              >
                                ⏩
                              </button>
                              <button
                                type="button"
                                className={controlStyles}
                                data-hero-control="true"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  const video = modalHeroVideoRef.current;
                                  if (!video) {
                                    const next = !isModalHeroVideoMuted;
                                    modalHeroMuteStateRef.current = next;
                                    setIsModalHeroVideoMuted(next);
                                    return;
                                  }
                                  const next = !isModalHeroVideoMuted;
                                  modalHeroMuteStateRef.current = next;
                                  video.muted = next;
                                  setIsModalHeroVideoMuted(next);
                                }}
                                aria-label={isModalHeroVideoMuted ? "Unmute hero video" : "Mute hero video"}
                              >
                                {isModalHeroVideoMuted ? "🔇" : "🔊"}
                              </button>
                            </div>
                      </div>
                    ) : (
                      /* Regular modal with title and images */
                      <>
                        {/* BOKU stamp in top left of modal - only for non-hero */}
                        <img
                          src={isDarkMode ? "/media/boku_home_white.svg" : "/media/boku_home.svg"}
                          alt="BOKU"
                          className="absolute top-4 left-4 pointer-events-none z-20"
                          style={{
                            width: isMobile && !isMobileLandscape ? '72px' : (isMobileLandscape ? '80px' : '120px'),
                            height: 'auto',
                          }}
                        />
                        <div className="flex flex-col gap-6 px-6 pb-4 pt-4 sm:px-8 sm:pt-4 overflow-y-auto min-h-0">
                          <div className="text-center">
                            <p
                              className={clsx(
                                "text-xs uppercase tracking-[0.4em] mb-2",
                                isDarkMode ? "text-zinc-400" : "text-zinc-500"
                              )}
                            >
                              {project.subtitle}
                            </p>
                            <h3
                              className={clsx(
                                "text-2xl sm:text-3xl font-bold",
                                isDarkMode ? "text-white" : "text-zinc-900"
                              )}
                            >
                              {project.title}
                            </h3>
                          </div>
                          {availabilityPillModal && (
                            <div className="flex justify-center">
                              <div className="mt-1">{availabilityPillModal}</div>
                            </div>
                          )}

                          <div className="relative flex items-center justify-center">
                            <div className="relative w-full max-h-[60vh] rounded-[20px] bg-zinc-950/50 flex items-center justify-center overflow-hidden">
                              {modalImage ? (
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.img
                              key={modalImage.src}
                              src={modalImage.src}
                              alt={modalImage.alt}
                              className="max-h-[60vh] w-full object-contain"
                              loading={isModalImageDecoded ? "eager" : "lazy"}
                              initial={{ opacity: isModalImageDecoded ? 0.3 : 0, scale: 0.99 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.01 }}
                              transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
                            />
                              </AnimatePresence>
                            ) : (
                              <p
                                className={clsx(
                                  "py-12 text-center text-sm",
                                  isDarkMode ? "text-zinc-500" : "text-zinc-600"
                                )}
                              >
                                No images available.
                              </p>
                            )}
                          </div>
                        </div>

                        {!isModalHeroVideo && (
                          <div 
                            className="flex items-center justify-center gap-4"
                            style={{
                              minWidth: isMobile ? '140px' : 'auto'
                            }}
                          >
                            <motion.button
                              type="button"
                              className={modalControlStyles}
                              onClick={() => handleModalNavigate(-1)}
                              aria-label="Previous image"
                              initial={{ opacity: 0.7 }}
                              whileHover={{ opacity: 1, scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {"<"}
                            </motion.button>
                            <span
                              className={clsx(
                                "font-semibold uppercase whitespace-nowrap",
                                isMobile ? "text-base" : "text-sm tracking-[0.4em]",
                                isDarkMode ? "text-zinc-200" : "text-zinc-700"
                              )}
                            >
                              {modalImageIndex + 1} / {totalImages}
                            </span>
                            <motion.button
                              type="button"
                              className={modalControlStyles}
                              onClick={() => handleModalNavigate(1)}
                              aria-label="Next image"
                              initial={{ opacity: 0.7 }}
                              whileHover={{ opacity: 1, scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {">"}
                            </motion.button>
                          </div>
                        )}
                        </div>
                      </>
                    )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

