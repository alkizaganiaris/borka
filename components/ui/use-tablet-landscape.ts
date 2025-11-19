import * as React from "react";

const TABLET_LANDSCAPE_QUERY = '(min-width: 768px) and (max-width: 1025px) and (orientation: landscape)';

export function useTabletLandscape() {
  const [isTabletLandscape, setIsTabletLandscape] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(TABLET_LANDSCAPE_QUERY);
    const onChange = () => {
      setIsTabletLandscape(mql.matches);
    };
    mql.addEventListener("change", onChange);
    setIsTabletLandscape(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isTabletLandscape;
}

