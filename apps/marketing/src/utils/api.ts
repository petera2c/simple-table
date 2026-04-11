/**
 * Gets the appropriate API URL based on the current environment.
 * Uses relative paths for local development to avoid CORS issues,
 * and full domain URLs for production/sandbox environments.
 *
 * @param endpoint - The API endpoint path (e.g., "/api/data/billing")
 * @returns The complete URL for the API request
 */
export function getApiUrl(endpoint: string): string {
  const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
  const baseUrl = isLocal ? "" : "https://www.simple-table.com";
  return `${baseUrl}${endpoint}`;
}
