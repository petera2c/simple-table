"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Private hook for internal use only - not exported
const useThemeImplementation = () => {
  const [theme, setTheme] = useState<Theme>("dark");

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;

    const defaultTheme: Theme = savedTheme ? savedTheme : prefersLight ? "light" : "dark";

    setTheme(defaultTheme);

    localStorage.setItem("theme", defaultTheme);

    // Apply theme to document
    document.documentElement.classList.toggle("dark", defaultTheme === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      return newTheme;
    });
  }, []);

  return { theme, toggleTheme };
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme, toggleTheme } = useThemeImplementation();
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  // Do not return anything other than children in this component.
  // If you do, it will break SEO metadata because all metadata will be added to js scripts instead of html tags.
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
