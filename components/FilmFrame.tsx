import { motion } from "motion/react";

interface FilmFrameProps {
  id: number;
  imageUrl: string;
  isSelected: boolean;
  onClick: () => void;
  delay: number; // kept for compatibility, no longer used
}

export function FilmFrame({
  id,
  imageUrl,
  isSelected,
  onClick,
}: FilmFrameProps) {
  return (
    <div className="film-frame-wrapper relative flex-shrink-0">
      {/* Film frame with background image */}
      <motion.button
        onClick={onClick}
        className={`
          relative w-[240px] h-[160px] transition-all duration-300
          ${
            isSelected
              ? "drop-shadow-[0_0_25px_rgba(225,29,72,0)]"
              : "drop-shadow-2xl"
          }
        `}
        // Hover = “lit” only, no movement
        whileHover={{ filter: "brightness(1.8)" }}
        whileTap={{ scale: 0.995 }}
      >
        {/* Film frame background with perforations */}
        <div className="absolute inset-0 bg-white">
          <img
            src="/film-frame-bg.jpg"
            alt="Film frame"
            className="w-full h-full object-fill scale-110"
          />
        </div>

        {/* Photo container - positioned in the center of the film frame */}
        <div className="absolute inset-0 flex items-center justify-center p-[10%]">
          <div className="relative w-full h-full overflow-hidden">
            {/* Actual photo */}
            <img
              src={imageUrl}
              alt={`Film frame ${id}`}
              className="w-[92%] h-full object-cover opacity-100 translate-x-[10px]"
              style={{
                filter:
                  "sepia(0.8) saturate(2.5) brightness(0.8) contrast(1)",
              }}
            />

            {/* Hover glow overlay (no movement) */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent"
              whileHover={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0))",
              }}
            />

            {/* Selected highlight overlay */}
            {isSelected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent pointer-events-none"
              />
            )}
          </div>
        </div>

        {/* Frame number indicator */}
        <div
          className="absolute bottom-2 right-3 text-[#FF8C00] tracking-wider"
          style={{ fontFamily: "monospace" }}
        >
          {id}
        </div>
      </motion.button>
    </div>
  );
}