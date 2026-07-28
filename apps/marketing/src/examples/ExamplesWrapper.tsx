"use client";
import React from "react";
import { useThemeContext } from "@/providers/ThemeProvider";
import { useSearchParams } from "next/navigation";
import { mapWebsiteThemeToTableTheme } from "@/utils/themeMapper";
import type { Theme } from "@simple-table/react";

const ExamplesWrapper = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const { theme: websiteMode } = useThemeContext();
  // Match ExamplesProvider: website "light"/"dark" map to modern-* table themes.
  const theme = (searchParams?.get("theme") as Theme) || mapWebsiteThemeToTableTheme(websiteMode);

  return (
    <>
      {React.isValidElement(children)
        ? React.cloneElement(children, { theme } as any)
        : children}
    </>
  );
};

export default ExamplesWrapper;
