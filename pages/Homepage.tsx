interface HomepageProps {
  isDarkMode: boolean;
}

export function Homepage({ isDarkMode }: HomepageProps) {
  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center">
      <img 
        src={isDarkMode ? "/media/boku_home_white.svg" : "/media/boku_home.svg"} 
        alt="BOKU" 
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}
