import { motion } from "motion/react";
import { PageHeader } from "../components/PageHeader";
import { useEffect, useState, useRef } from "react";
import "../styles/fonts.css";
import StaggeredMenu from "../components/StaggeredMenu";

interface TypographyProps {
  isDarkMode: boolean;
}

export function Typography({ isDarkMode }: TypographyProps) {
  const [loadedFonts, setLoadedFonts] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fontSamples = [
    // Custom handwritten fonts
    {
      name: "Caveat",
      family: "Caveat",
      fallback: "cursive",
      description: "Handwritten font with a casual, natural feel",
      webFont: null,
      isCustom: true
    },
    {
      name: "Indie Flower",
      family: "Indie Flower",
      fallback: "cursive",
      description: "Friendly handwritten font with a bouncy character",
      webFont: null,
      isCustom: true
    },
    {
      name: "Patrick Hand SC",
      family: "Patrick Hand SC",
      fallback: "cursive",
      description: "Clean handwritten font based on the designer's own handwriting",
      webFont: null,
      isCustom: true
    },
    {
      name: "Montserrat",
      family: "Montserrat",
      fallback: "sans-serif",
      description: "Modern sans-serif font with a clean, geometric design",
      webFont: null,
      isCustom: true
    },
    // Google Fonts - Monospace
    {
      name: "JetBrains Mono",
      family: "JetBrains Mono",
      fallback: "monospace",
      description: "Modern monospace font designed for developers",
      webFont: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
    },
    {
      name: "Fira Code",
      family: "Fira Code",
      fallback: "monospace",
      description: "Monospace font with programming ligatures",
      webFont: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap"
    },
    {
      name: "Source Code Pro",
      family: "Source Code Pro",
      fallback: "monospace",
      description: "Adobe's open source monospace font",
      webFont: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;700&display=swap"
    },
    {
      name: "Roboto Mono",
      family: "Roboto Mono",
      fallback: "monospace",
      description: "Google's monospace variant of Roboto",
      webFont: "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap"
    },
    {
      name: "Space Mono",
      family: "Space Mono",
      fallback: "monospace",
      description: "Geometric sans-serif monospace typeface",
      webFont: "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap"
    },
    {
      name: "Inconsolata",
      family: "Inconsolata",
      fallback: "monospace",
      description: "Humanist monospace font, highly readable",
      webFont: "https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;500;700&display=swap"
    },
    {
      name: "IBM Plex Mono",
      family: "IBM Plex Mono",
      fallback: "monospace",
      description: "IBM's open source monospace font family",
      webFont: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap"
    },
    {
      name: "Anonymous Pro",
      family: "Anonymous Pro",
      fallback: "monospace",
      description: "Fixed-width font designed with coding in mind",
      webFont: "https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&display=swap"
    },
    {
      name: "Courier Prime",
      family: "Courier Prime",
      fallback: "monospace",
      description: "A modern take on Courier",
      webFont: "https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap"
    },
    {
      name: "Ubuntu Mono",
      family: "Ubuntu Mono",
      fallback: "monospace",
      description: "Ubuntu's monospace font variant",
      webFont: "https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap"
    },
    {
      name: "Overpass Mono",
      family: "Overpass Mono",
      fallback: "monospace",
      description: "Open source monospace font inspired by Highway Gothic",
      webFont: "https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@400;600;700&display=swap"
    },
    {
      name: "Monaco",
      family: "Monaco",
      fallback: "monospace",
      description: "Classic Mac system monospace font",
      webFont: null
    },
    {
      name: "Consolas",
      family: "Consolas",
      fallback: "monospace",
      description: "Microsoft's monospace font",
      webFont: null
    },
    {
      name: "System Default",
      family: "ui-monospace",
      fallback: "monospace",
      description: "Default system monospace font stack",
      webFont: null
    }
  ];

  const sampleText = `ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz
0123456789 !@#$%^&*()_+-=[]{}|;':",.<>?

The quick brown fox jumps over the lazy dog
Pack my box with five dozen liquor jugs`;

  // Load web fonts dynamically
  useEffect(() => {
    const loadFont = (href: string) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      return link;
    };

    // Load all unique web fonts
    const webFonts = fontSamples
      .map(font => font.webFont)
      .filter((font, index, self) => font && self.indexOf(font) === index) as string[];

    const loadedLinks: HTMLLinkElement[] = [];
    
    webFonts.forEach(webFont => {
      if (webFont) {
        const link = loadFont(webFont);
        loadedLinks.push(link);
      }
    });

    // Use document.fonts.ready to wait for fonts to actually load
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        console.log('Fonts loaded!');
        setTimeout(() => {
          detectLoadedFonts();
          setIsLoading(false);
        }, 500);
      });
    } else {
      // Fallback for older browsers
      setTimeout(() => {
        detectLoadedFonts();
        setIsLoading(false);
      }, 3000);
    }

    return () => {
      // Cleanup: remove font links when component unmounts
      loadedLinks.forEach(link => {
        if (link && link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, []);

  const detectLoadedFonts = () => {
    const detected: { [key: string]: string } = {};
    
    fontSamples.forEach(font => {
      // Check if font is available using Font Loading API
      if (document.fonts && document.fonts.check) {
        const isAvailable = document.fonts.check(`16px "${font.family}"`);
        
        if (isAvailable) {
          detected[font.name] = font.family;
          console.log(`✓ ${font.family} is available`);
        } else {
          // Try to get computed font as fallback
          const testElement = document.createElement('span');
          testElement.style.fontFamily = `"${font.family}", ${font.fallback}`;
          testElement.style.position = 'absolute';
          testElement.style.left = '-9999px';
          testElement.style.fontSize = '16px';
          testElement.textContent = 'abcdefghijklmnopqrstuvwxyz';
          document.body.appendChild(testElement);

          const computedFont = window.getComputedStyle(testElement).fontFamily;
          const actualFont = computedFont.split(',')[0].replace(/['"]/g, '').trim();
          
          detected[font.name] = actualFont;
          console.log(`✗ ${font.family} not available, using: ${actualFont}`);
          
          document.body.removeChild(testElement);
        }
      } else {
        // Fallback for browsers without Font Loading API
        const testElement = document.createElement('span');
        testElement.style.fontFamily = `"${font.family}", ${font.fallback}`;
        testElement.style.position = 'absolute';
        testElement.style.left = '-9999px';
        testElement.textContent = 'abcdefghijklmnopqrstuvwxyz';
        document.body.appendChild(testElement);

        const computedFont = window.getComputedStyle(testElement).fontFamily;
        const actualFont = computedFont.split(',')[0].replace(/['"]/g, '').trim();
        
        detected[font.name] = actualFont;
        
        document.body.removeChild(testElement);
      }
    });

    setLoadedFonts(detected);
    console.log('Font detection complete:', detected);
  };

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Ceramics', ariaLabel: 'View ceramics', link: '/ceramics' },
    { label: 'Photography', ariaLabel: 'View photography', link: '/photography' },
    { label: 'Inspiration', ariaLabel: 'Read thoughts', link: '/inspiration' }
  ];

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/borbalakun/' }
  ];

  return (
    <div className="relative">
      <PageHeader title="Typography" isDarkMode={isDarkMode} />
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
      
      <div className="max-w-6xl mx-auto px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-black font-mono">
              Font Showcase
            </h2>
            <p className="text-lg text-zinc-600 max-w-3xl mx-auto mb-4">
              Explore different fonts. Custom fonts are loaded from the project, while others load from Google Fonts.
            </p>
            <div className="flex gap-4 justify-center items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 border border-purple-300 rounded-full text-xs">
                  ✨ Custom
                </span>
                <span className="text-zinc-500">= Your fonts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded-full text-xs">
                  🌐 Web Font
                </span>
                <span className="text-zinc-500">= Google Fonts</span>
              </div>
            </div>
            {isLoading && (
              <div className="mt-4 text-sm text-zinc-500">
                Loading fonts... ⏳
              </div>
            )}
            {!isLoading && Object.keys(loadedFonts).length > 0 && (
              <button
                onClick={() => detectLoadedFonts()}
                className="mt-4 px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-zinc-800 transition-colors"
              >
                Refresh Font Detection
              </button>
            )}
          </div>

          {/* Font Samples */}
          <div className="grid gap-6">
            {fontSamples.map((font, index) => {
              const actualFont = loadedFonts[font.name];
              const isLoaded = actualFont && actualFont.toLowerCase().includes(font.family.toLowerCase());
              
              return (
              <motion.div
                key={font.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="p-6 rounded-xl border-2 bg-white/50 border-zinc-200 hover:border-zinc-400 transition-all duration-300 hover:shadow-lg"
              >
                {/* Font Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-2xl font-bold text-black">
                        {font.name}
                      </h3>
                      {font.isCustom && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-300">
                          ✨ Custom
                        </span>
                      )}
                      {!font.isCustom && font.webFont && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                          🌐 Web Font
                        </span>
                      )}
                      {actualFont && (
                        <span className={`text-xs px-2 py-1 rounded-full font-mono ${
                          isLoaded 
                            ? 'bg-green-100 text-green-700 border border-green-300' 
                            : 'bg-orange-100 text-orange-700 border border-orange-300'
                        }`}>
                          {isLoaded ? '✓ Loaded' : `Fallback: ${actualFont}`}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-600 mb-2">
                      {font.description}
                    </p>
                    <code className="text-xs bg-zinc-100 px-2 py-1 rounded text-zinc-700">
                      font-family: "{font.family}", {font.fallback};
                    </code>
                  </div>
                </div>

                {/* Sample Text */}
                <div className="mt-4">
                  <div 
                    className="text-base leading-relaxed text-black p-6 bg-zinc-50 rounded-lg border border-zinc-200"
                    style={{ fontFamily: `"${font.family}", ${font.fallback}` }}
                  >
                    <pre className="whitespace-pre-wrap" style={{ fontFamily: `"${font.family}", ${font.fallback}` }}>{sampleText}</pre>
                  </div>
                </div>

                {/* Character showcase */}
                <div className="mt-4 flex gap-6 justify-center p-4 bg-zinc-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-black mb-1" style={{ fontFamily: `"${font.family}", ${font.fallback}` }}>Aa</div>
                    <div className="text-xs text-zinc-500">Mixed case</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-black mb-1" style={{ fontFamily: `"${font.family}", ${font.fallback}` }}>01</div>
                    <div className="text-xs text-zinc-500">Numbers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-black mb-1" style={{ fontFamily: `"${font.family}", ${font.fallback}` }}>!?</div>
                    <div className="text-xs text-zinc-500">Symbols</div>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
