"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const useHashNavigation = () => {
  const pathname = usePathname();

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        // Remove the # from the hash
        const elementId = hash.substring(1);
        const element = document.getElementById(elementId);

        if (element) {
          // Small delay to ensure content is fully rendered
          setTimeout(() => {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        }
      }
    };

    // Handle hash on initial load and pathname changes
    scrollToHash();

    // Listen for hash changes (when clicking internal links)
    const handleHashChange = () => {
      scrollToHash();
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);
};

export default useHashNavigation;
