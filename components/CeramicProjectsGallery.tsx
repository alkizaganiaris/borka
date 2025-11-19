import clsx from "clsx";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

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
    <div className="flex flex-col gap-8 md:gap-10 w-full mx-auto max-w-[1200px]">
      <div
        className={clsx(
          "flex flex-col gap-3 rounded-2xl border px-5 py-4",
          isDarkMode
            ? "border-zinc-700/60 bg-zinc-900/70 text-zinc-100"
            : "border-zinc-200 bg-white text-zinc-800 shadow-sm"
        )}
        style={{ marginTop: 40 }}
      >
        <span className="text-sm font-semibold uppercase tracking-[0.4em]">
          Filter By Status
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleShowAll}
            className={clsx(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition border",
              isShowAllActive
                ? isDarkMode
                  ? "bg-zinc-800 border-zinc-600 text-zinc-100 shadow-inner"
                  : "bg-white border-zinc-300 text-zinc-800 shadow-sm"
                : isDarkMode
                  ? "bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  : "bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-white"
            )}
            aria-pressed={isShowAllActive}
          >
            Show All
          </button>
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

  const openHeroModal = useCallback(() => {
    if (project.heroImage.mediaType === "video") {
      stopModalHeroDirectionalSeek();
      setIsModalHeroVideoPlaying(false);
      const heroVideo = heroVideoRef.current;
      if (heroVideo) {
        heroVideo.pause();
        setIsHeroVideoPlaying(false);
      }
      setIsModalHeroVideoMuted(isHeroVideoMuted);
      setIsModalHeroVideo(true);
      const modalVideo = modalHeroVideoRef.current;
      if (modalVideo) {
        modalVideo.currentTime = 0;
        modalVideo.pause();
        modalVideo.muted = isHeroVideoMuted;
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
        "inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 border self-start",
        isDarkMode
          ? "bg-zinc-900/60 border-zinc-700/70 text-zinc-100"
          : "bg-white border-zinc-200 text-zinc-700 shadow-sm"
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
        document.body.style.removeProperty("overflow");
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

    window.addEventListener("keydown", handleKeyDown);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (typeof document !== "undefined") {
        document.body.style.removeProperty("overflow");
      }
      stopModalHeroDirectionalSeek();
    };
  }, [isModalOpen, isModalHeroVideo, handleModalNavigate, closeModal, stopModalHeroDirectionalSeek]);

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
          {/* Hero image column */}
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
            <div
              className={clsx(
                "relative rounded-[20px] border overflow-hidden flex flex-col md:flex-1",
                accentBorder,
                isDarkMode ? "bg-zinc-900/30" : "bg-white/70"
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
                          "absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full px-3 py-1.5 backdrop-blur-sm transition duration-200",
                          isDarkMode ? "bg-black/20" : "bg-white/60"
                        )}
                        initial={{ opacity: 0.6 }}
                        whileHover={{ opacity: 1 }}
                        onClick={(event) => event.stopPropagation()}
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
                            "text-xs font-semibold tracking-[0.3em] uppercase",
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
            </div>
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
                  "fixed inset-0 z-[2000] flex items-center justify-center px-4 sm:px-8 py-8",
                  "bg-black/50"
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeModal}
              >
                <motion.div
                  className={clsx(
                    "relative w-full max-w-5xl rounded-[28px] shadow-2xl",
                    isDarkMode ? "bg-zinc-900 border border-zinc-700/60" : "bg-white border border-white/60"
                  )}
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 10 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  role="dialog"
                  aria-modal="true"
                  aria-label={`${project.title} gallery`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={closeModal}
                    className={clsx(
                      "absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition",
                      isDarkMode
                        ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
                        : "border-black/10 bg-white text-zinc-800 hover:bg-zinc-100"
                    )}
                    aria-label="Close gallery modal"
                  >
                    ✕
                  </button>

                  <div className="flex flex-col gap-6 px-6 pb-8 pt-12 sm:px-8 sm:pt-14">
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
                      <div className="relative w-full max-h-[70vh] rounded-[20px] bg-zinc-950/50 flex items-center justify-center overflow-hidden">
                        {isModalHeroVideo && heroVideoUrl ? (
                          <>
                            <video
                              key={heroVideoUrl}
                              ref={modalHeroVideoRef}
                              src={heroVideoUrl}
                              poster={heroVideoPoster}
                              className="max-h-[70vh] w-full object-contain"
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
                                "absolute bottom-4 right-4 flex items-center gap-3 rounded-full px-4 py-2 backdrop-blur-sm border",
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
                          </>
                        ) : modalImage ? (
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.img
                              key={modalImage.src}
                              src={modalImage.src}
                              alt={modalImage.alt}
                              className="max-h-[70vh] w-full object-contain"
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
                      <div className="flex items-center justify-center gap-4">
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
                            "text-sm font-semibold tracking-[0.4em] uppercase",
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
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

