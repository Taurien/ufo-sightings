import * as React from "react";

const useIsMobile = (mobileScreenSize = 768): boolean => {
  const [isMobile, setIsMobile] = React.useState(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return false;
    }
    return window.matchMedia(`(max-width: ${mobileScreenSize}px)`).matches;
  });

  React.useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mediaListener = window.matchMedia(
      `(max-width: ${mobileScreenSize}px)`
    );

    const checkIsMobile = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaListener.addEventListener("change", checkIsMobile);

    return () => {
      mediaListener.removeEventListener("change", checkIsMobile);
    };
  }, [mobileScreenSize]);

  return isMobile;
};

export default useIsMobile;
