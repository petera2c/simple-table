import { Select } from "antd";
import type { Theme } from "@simple-table/react";
import { useThemeContext } from "@/providers/ThemeProvider";

const THEME_OPTIONS: Theme[] = [
  "modern-light",
  "modern-dark",
  "light",
  "dark",
  "sky",
  "violet",
  "neutral",
];

const DEFAULT_THEME_LABELS: Record<string, string> = {
  "modern-light": "Modern Light",
  "modern-dark": "Modern Dark",
  light: "Light",
  dark: "Dark",
  sky: "Sky",
  violet: "Violet",
  neutral: "Neutral",
};

const ThemeSelector = ({
  currentTheme,
  setCurrentTheme,
  restrictedThemes,
  themeLabels,
}: {
  currentTheme?: Theme;
  setCurrentTheme: (theme: Theme) => void;
  restrictedThemes?: Theme[];
  themeLabels?: Record<string, string>;
}) => {
  const { theme: websiteTheme } = useThemeContext();

  // Default to modern-dark if website theme is dark, otherwise modern-light
  const defaultTheme = websiteTheme === "dark" ? "modern-dark" : "modern-light";
  const effectiveTheme = currentTheme || defaultTheme;

  const availableThemes = restrictedThemes || THEME_OPTIONS;
  const labels = { ...DEFAULT_THEME_LABELS, ...themeLabels };

  return (
    <Select
      placeholder="Select a theme"
      style={{ width: 200 }}
      onChange={(value) => setCurrentTheme(value as Theme)}
      options={availableThemes.map((theme) => ({
        value: theme,
        label: labels[theme] || theme.charAt(0).toUpperCase() + theme.slice(1),
      }))}
      value={effectiveTheme}
    />
  );
};

export default ThemeSelector;
