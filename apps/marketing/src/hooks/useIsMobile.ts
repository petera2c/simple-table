import { useState, useEffect } from "react";

export const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewportSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkViewportSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkViewportSize);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkViewportSize);
  }, [breakpoint]);

  return isMobile;
};
