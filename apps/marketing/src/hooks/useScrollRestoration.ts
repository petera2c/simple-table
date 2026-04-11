"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const useScrollRestoration = (disableScrollRestoration?: boolean) => {
  const pathname = usePathname();

  useEffect(() => {
    if (!disableScrollRestoration) {
      document.getElementById("main-scroll-container")?.scrollTo(0, 0);
    }
  }, [disableScrollRestoration, pathname]);
};

export default useScrollRestoration;
