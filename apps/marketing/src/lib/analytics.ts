const EVENT_NAME = "framework_selector_change";

/**
 * Fires when the user picks a stack in the site header.
 * Pair with Google Search Console (queries landing on /frameworks/* and framework blogs)
 * to prioritize Svelte vs Solid vs vanilla depth.
 */
export function trackFrameworkSelection(framework: string): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("simple-table:framework-change", { detail: { framework } })
  );

  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  };

  if (typeof w.gtag === "function") {
    w.gtag("event", EVENT_NAME, { framework });
  }

  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: EVENT_NAME, framework });
  }
}
