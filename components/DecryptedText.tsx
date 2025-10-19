import { useEffect, useRef, useState } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'hover' | 'view';
  revealDirection?: 'start' | 'end' | 'center';
}

const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 50,
  maxIterations = 10,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  revealDirection = 'start',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const elementRef = useRef<HTMLSpanElement>(null);

  const scrambleText = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const textArray = text.split('');
    let iteration = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        textArray
          .map((char, index) => {
            // Determine which characters should be revealed based on direction
            let shouldReveal = false;
            if (revealDirection === 'start') {
              shouldReveal = index < iteration;
            } else if (revealDirection === 'end') {
              shouldReveal = index >= textArray.length - iteration;
            } else if (revealDirection === 'center') {
              const center = Math.floor(textArray.length / 2);
              const distance = Math.abs(index - center);
              shouldReveal = distance < iteration / 2;
            }

            if (shouldReveal) {
              return char;
            }
            
            // Keep spaces as spaces
            if (char === ' ') return ' ';
            
            // Random character
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      iteration += 1;

      if (iteration > maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsAnimating(false);
        if (animateOn === 'view') {
          setHasAnimated(true);
        }
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'view' && !hasAnimated) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            scrambleText();
          }
        },
        { threshold: 0.1 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }
  }, [animateOn, hasAnimated]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      scrambleText();
    }
  };

  return (
    <span
      ref={elementRef}
      className={`${parentClassName} ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{ display: 'inline-block' }}
    >
      {displayText.split('').map((char, index) => (
        <span
          key={index}
          className={char !== text[index] ? encryptedClassName : ''}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default DecryptedText;
