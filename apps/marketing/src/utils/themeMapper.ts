import type { Theme } from "@simple-table/react";

/**
 * Maps website theme (from ThemeProvider) to default table theme.
 * This is used when no explicit theme is selected, to provide modern defaults.
 * - "light" → "modern-light"
 * - "dark" → "modern-black" (matches the marketing site dark tokens)
 *
 * @param websiteTheme - The theme from ThemeProvider ("light" or "dark")
 * @returns The default table theme
 */
export function mapWebsiteThemeToTableTheme(websiteTheme: "light" | "dark"): Theme {
  return websiteTheme === "light" ? "modern-light" : "modern-black";
}
