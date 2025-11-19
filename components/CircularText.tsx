import React, { useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import { motion, useAnimation, useMotionValue, MotionValue, Transition } from 'motion/react';

export interface CircularTextRef {
  slowDown: () => void;
  speedUp: () => void;
  pause: () => void;
  resume: () => void;
}

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: 'slowDown' | 'speedUp' | 'pause' | 'goBonkers';
  className?: string;
  size?: number; // Diameter in pixels
  fontSize?: string; // Tailwind font size class (e.g., 'text-2xl', 'text-5xl')
  fontFamily?: string; // Font family, defaults to Montserrat
}

const getRotationTransition = (duration: number, from: number, loop: boolean = true) => ({
  from,
  to: from + 360,
  ease: 'linear' as const,
  duration,
  type: 'tween' as const,
  repeat: loop ? Infinity : 0
});

const getTransition = (duration: number, from: number) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: 'spring' as const,
    damping: 20,
    stiffness: 300
  }
});

const CircularText = forwardRef<CircularTextRef, CircularTextProps>(({
  text,
  spinDuration = 20,
  onHover = 'speedUp',
  className = '',
  size = 200,
  fontSize = 'text-2xl',
  fontFamily = 'Montserrat'
}, ref) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation: MotionValue<number> = useMotionValue(0);
  
  // Calculate radius (half of diameter)
  const radius = useMemo(() => size / 2, [size]);
  
  // Extract size/width/height from className if provided (Tailwind classes)
  const sizeFromClass = useMemo(() => {
    const match = className.match(/w-\[(\d+)px\]|h-\[(\d+)px\]/);
    if (match) {
      return parseInt(match[1] || match[2] || '200');
    }
    return null;
  }, [className]);
  
  const effectiveSize = sizeFromClass || size;
  const effectiveRadius = effectiveSize / 2;
  
  // Extract font size from className if provided
  const fontSizeFromClass = useMemo(() => {
    const match = className.match(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/);
    return match ? match[0] : fontSize;
  }, [className, fontSize]);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    });
  }, [spinDuration, text, onHover, controls]);

  const handleHoverStart = () => {
    const start = rotation.get();

    if (!onHover) return;

    let transitionConfig: ReturnType<typeof getTransition> | Transition;
    let scaleVal = 1;

    switch (onHover) {
      case 'slowDown':
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case 'speedUp':
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case 'pause':
        transitionConfig = {
          rotate: { type: 'spring', damping: 20, stiffness: 300 },
          scale: { type: 'spring', damping: 20, stiffness: 300 }
        };
        break;
      case 'goBonkers':
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig
    });
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    });
  };

  // Expose methods for external control
  useImperativeHandle(ref, () => ({
    slowDown: () => {
      const start = rotation.get();
      controls.start({
        rotate: start + 360,
        scale: 1,
        transition: getTransition(spinDuration * 2, start)
      });
    },
    speedUp: () => {
      const start = rotation.get();
      controls.start({
        rotate: start + 360,
        scale: 1,
        transition: getTransition(spinDuration / 4, start)
      });
    },
    pause: () => {
      const start = rotation.get();
      controls.start({
        rotate: start,
        scale: 1,
        transition: {
          rotate: { type: 'spring', damping: 20, stiffness: 300 },
          scale: { type: 'spring', damping: 20, stiffness: 300 }
        }
      });
    },
    resume: () => {
      const start = rotation.get();
      controls.start({
        rotate: start + 360,
        scale: 1,
        transition: getTransition(spinDuration, start)
      });
    }
  }));

  // Remove size and font size classes from className to avoid duplication
  const cleanClassName = useMemo(() => {
    return className
      .replace(/w-\[(\d+)px\]|h-\[(\d+)px\]/g, '')
      .replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }, [className]);

  return (
    <motion.div
      className={`m-0 mx-auto rounded-full relative font-black text-center cursor-pointer origin-center ${cleanClassName}`}
      style={{ 
        rotate: rotation,
        width: `${effectiveSize}px`,
        height: `${effectiveSize}px`,
        fontFamily: fontFamily
      }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        // Calculate rotation for each letter (in degrees)
        const rotationDeg = (360 / letters.length) * i;
        
        // For circular text: rotate first, then translate outward by radius
        // Each letter is positioned at the top of the circle, then rotated to its position
        const transform = `rotate(${rotationDeg}deg) translateY(-${effectiveRadius}px)`;

        return (
          <span
            key={i}
            className={`absolute inline-block ${fontSizeFromClass} transition-all duration-500 ease-[cubic-bezier(0,0,0,1)]`}
            style={{ 
              transform,
              WebkitTransform: transform,
              left: '50%',
              top: '50%',
              transformOrigin: 'center',
              marginLeft: '-0.5em', // Center the letter horizontally
              marginTop: '-0.5em' // Center the letter vertically
            }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
});

CircularText.displayName = 'CircularText';

export default CircularText;
