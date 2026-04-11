import { DEFAULT_EXAMPLE_PATH } from "@/constants/global";

/**
 * Generates the appropriate URL for an example page with the correct theme parameter
 * @param examplePath - The path to the example (e.g., "/examples/crm")
 * @param currentTheme - The current theme ("light" or "dark")
 * @returns The example URL with the appropriate theme parameter
 */
export function getExampleUrl(examplePath: string, currentTheme: "light" | "dark"): string {
  // CRM example uses custom themes
  if (examplePath === "/examples/crm") {
    const crmTheme = currentTheme === "dark" ? "custom-dark" : "custom-light";
    return `${examplePath}?theme=${crmTheme}`;
  }
  // All other examples use standard themes
  return `${examplePath}?theme=${currentTheme}`;
}

/**
 * Generates the URL for the default example page (CRM) with the correct theme parameter
 * @param currentTheme - The current theme ("light" or "dark")
 * @returns The default example URL with the appropriate theme parameter
 */
export function getDefaultExampleUrl(currentTheme: "light" | "dark"): string {
  return getExampleUrl(DEFAULT_EXAMPLE_PATH, currentTheme);
}
