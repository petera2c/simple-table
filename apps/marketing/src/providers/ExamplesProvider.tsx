"use client";

import { createContext, useContext, ReactNode, useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useThemeContext } from "@/providers/ThemeProvider";
import { IconLibrary } from "@/utils/getTableIcons";
import { useEffect } from "react";
import { mapWebsiteThemeToTableTheme } from "@/utils/themeMapper";
import type { Theme } from "@simple-table/react";

interface ExamplesContextType {
  currentTheme: Theme;
  currentIconLibrary: IconLibrary;
  currentExampleId: string;
  handleThemeChange: (theme: Theme) => void;
  handleIconLibraryChange: (iconLibrary: IconLibrary) => void;
  handleExampleChange: (examplePath: string) => void;
}

const ExamplesContext = createContext<ExamplesContextType | undefined>(undefined);

export function ExamplesProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useThemeContext();

  // Use URL param theme if set, otherwise use modern version of website theme
  const currentTheme = (searchParams?.get("theme") as any) || mapWebsiteThemeToTableTheme(theme);
  const currentIconLibrary = (searchParams?.get("icons") as IconLibrary) || "default";

  // Determine current example ID from pathname
  const currentExampleId = pathname?.split("/examples/")[1]?.split("/")[0] || "crm";

  const searchParamsString = searchParams?.toString() ?? "";

  const handleThemeChange = useCallback(
    (newTheme: Theme) => {
      const params = new URLSearchParams(searchParamsString);
      params.set("theme", newTheme);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParamsString],
  );

  const handleIconLibraryChange = useCallback(
    (iconLibrary: IconLibrary) => {
      const params = new URLSearchParams(searchParamsString);
      params.set("icons", iconLibrary);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParamsString],
  );

  const handleExampleChange = useCallback(
    (examplePath: string) => {
      const params = new URLSearchParams(searchParamsString);

      // Determine the target example from the path
      const targetExampleId = examplePath.split("/examples/")[1]?.split("/")[0];

      if (targetExampleId) {
        // Adjust theme before navigation to prevent flicker
        if (targetExampleId === "crm") {
          // CRM example needs custom themes
          if (currentTheme !== "custom-light" && currentTheme !== "custom-dark") {
            const newTheme = theme === "dark" ? "custom-dark" : "custom-light";
            params.set("theme", newTheme);
          }
        } else {
          // Non-CRM examples should not use custom themes
          if (currentTheme === "custom-light" || currentTheme === "custom-dark") {
            params.set("theme", mapWebsiteThemeToTableTheme(theme));
          }
        }
      }

      router.push(`${examplePath}?${params.toString()}`);
    },
    [currentTheme, pathname, router, searchParamsString, theme],
  );

  // If we are not on the CRM example, and the theme is custom-light or custom-dark, set the theme to modern version
  useEffect(() => {
    if (currentExampleId !== "crm") {
      if (currentTheme === "custom-light" || currentTheme === "custom-dark") {
        handleThemeChange(mapWebsiteThemeToTableTheme(theme));
      }
    } else {
      // CRM example
      const expectedTheme = theme === "dark" ? "custom-dark" : "custom-light";
      if (currentTheme !== "custom-light" && currentTheme !== "custom-dark") {
        handleThemeChange(expectedTheme as Theme);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExampleId]);

  const contextValue = useMemo(
    () => ({
      currentTheme,
      currentIconLibrary,
      currentExampleId,
      handleThemeChange,
      handleIconLibraryChange,
      handleExampleChange,
    }),
    [
      currentTheme,
      currentIconLibrary,
      currentExampleId,
      handleThemeChange,
      handleIconLibraryChange,
      handleExampleChange,
    ],
  );

  return <ExamplesContext.Provider value={contextValue}>{children}</ExamplesContext.Provider>;
}

export function useExamplesContext() {
  const context = useContext(ExamplesContext);
  if (context === undefined) {
    throw new Error("useExamplesContext must be used within an ExamplesProvider");
  }
  return context;
}
