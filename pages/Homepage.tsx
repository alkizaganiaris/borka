interface HomepageProps {
  isDarkMode: boolean;
}

export function Homepage({ isDarkMode: _isDarkMode }: HomepageProps) {
  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center">
      <img 
        src="/media/boku_home.svg" 
        alt="BOKU" 
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}
