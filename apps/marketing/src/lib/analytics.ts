type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: Record<string, unknown>[];
};

function getAnalyticsWindow(): GtagWindow | null {
  if (typeof window === "undefined") return null;
  return window as GtagWindow;
}

/** Fire a GA4 / dataLayer event. Safe no-op on the server or when gtag is absent. */
export function trackEvent(eventName: string, params: Record<string, unknown> = {}): void {
  const w = getAnalyticsWindow();
  if (!w) return;

  if (typeof w.gtag === "function") {
    w.gtag("event", eventName, params);
  }

  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: eventName, ...params });
  }
}

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

  trackEvent("framework_selector_change", { framework });
}

export function trackCtaClick(params: {
  cta_id: string;
  cta_text: string;
  destination: string;
  location: string;
}): void {
  trackEvent("cta_click", params);
}

export function trackViewPricing(source: string = "pricing_page"): void {
  trackEvent("view_pricing", { source });
}

export function trackBeginCheckout(params: {
  plan: "pro" | "enterprise";
  billing: "monthly" | "annual";
}): void {
  trackEvent("begin_checkout", {
    currency: "USD",
    item_name: params.plan,
    billing: params.billing,
    plan: params.plan,
  });
}

export function trackContactSubmit(source: string = "contact_modal"): void {
  trackEvent("contact_submit", { source });
}

export function trackCopyInstallCommand(params: {
  package_manager: string;
  framework?: string;
  code_preview?: string;
}): void {
  trackEvent("copy_install_command", {
    package_manager: params.package_manager,
    framework: params.framework,
    code_preview: params.code_preview?.slice(0, 80),
  });
}

/** Fired on /checkout/success after Stripe Payment Link redirect. */
export function trackPurchaseComplete(params: {
  plan?: string;
  billing?: string;
} = {}): void {
  trackEvent("purchase", {
    currency: "USD",
    transaction_id: `stripe_${Date.now()}`,
    ...params,
  });
}
