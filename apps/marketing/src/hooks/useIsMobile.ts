import { useState, useLayoutEffect } from "react";

export const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const checkViewportSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkViewportSize();
    window.addEventListener("resize", checkViewportSize);
    return () => window.removeEventListener("resize", checkViewportSize);
  }, [breakpoint]);

  return isMobile;
};
