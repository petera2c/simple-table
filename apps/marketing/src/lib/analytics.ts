type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: Record<string, unknown>[];
};

const CHECKOUT_STARTED_KEY = "st_checkout_started";
const PURCHASE_TRACKED_PREFIX = "st_purchase_tracked_";

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

/** Primary conversion: user opens a Calendly booking link. */
export function trackBookACall(params: {
  cta_id: string;
  cta_text: string;
  location: string;
  destination: string;
}): void {
  trackEvent("book_a_call", params);
}

export function trackViewPricing(entryPoint: string = "pricing_page"): void {
  // Use entry_point — GA4 treats `source` as a reserved campaign attribution field.
  trackEvent("view_pricing", { entry_point: entryPoint });
}

export function trackBeginCheckout(params: {
  plan: "pro" | "enterprise";
  billing: "monthly" | "annual";
}): void {
  try {
    sessionStorage.setItem(
      CHECKOUT_STARTED_KEY,
      JSON.stringify({ plan: params.plan, billing: params.billing, at: Date.now() })
    );
  } catch {
    // Private mode / blocked storage — purchase gating may skip; still track begin.
  }

  trackEvent("begin_checkout", {
    currency: "USD",
    item_name: params.plan,
    billing: params.billing,
    plan: params.plan,
  });
}

export function trackContactSubmit(entryPoint: string = "contact_modal"): void {
  // Use entry_point — GA4 treats `source` as a reserved campaign attribution field.
  trackEvent("contact_submit", { entry_point: entryPoint });
}

/** Primary conversion: license quote form submitted successfully. */
export function trackLicenseQuoteSubmit(params: {
  plan_interest?: string;
  replacing_ag_grid?: boolean;
} = {}): void {
  trackEvent("license_quote_submit", {
    entry_point: "license_quote",
    ...params,
  });
}

/** Current path for the `location` param. Empty string on the server. */
export function getPageLocation(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname;
}

const INSTALL_COMMAND_PATTERN = /^(npm (install|i)|yarn (add|install)|pnpm (add|install|i)|bun (add|install))\b/i;

/** "npm" | "yarn" | "pnpm" | "bun" when the snippet is an install command, else null. */
export function detectPackageManager(code: string): string | null {
  const trimmed = code.trim();
  const match = trimmed.match(INSTALL_COMMAND_PATTERN);
  if (!match) return null;
  return match[1].split(" ")[0].toLowerCase();
}

/** Packages named in an install command, for example "@simple-table/react". */
export function parseInstallPackages(code: string): string {
  const firstLine = code.trim().split("\n")[0] ?? "";
  return firstLine
    .split(/\s+/)
    .slice(2)
    .filter((token) => token && !token.startsWith("-"))
    .join(" ");
}

export function trackCopyInstallCommand(params: {
  package_manager: string;
  framework?: string;
  code_preview?: string;
  location?: string;
}): void {
  trackEvent("copy_install_command", {
    package_manager: params.package_manager,
    framework: params.framework,
    package: params.code_preview ? parseInstallPackages(params.code_preview) : undefined,
    location: params.location ?? getPageLocation(),
    code_preview: params.code_preview?.slice(0, 80),
  });
}

/** Someone copied a code example (docs snippet, live demo source, blog example). */
export function trackCopyExampleCode(params: {
  framework?: string;
  demo_id?: string;
  language?: string;
  line_count?: number;
  location?: string;
}): void {
  trackEvent("copy_example_code", {
    framework: params.framework,
    demo_id: params.demo_id,
    language: params.language,
    line_count: params.line_count,
    location: params.location ?? getPageLocation(),
  });
}

export type OutboundTarget = "github" | "npm";

/** Classifies a link as a GitHub or npm destination. Returns null for anything else. */
export function classifyOutboundUrl(
  href: string,
): { target: OutboundTarget; package?: string } | null {
  let url: URL;
  try {
    url = new URL(href, "https://www.simple-table.com");
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  if (host === "github.com") {
    return { target: "github" };
  }
  if (host === "npmjs.com" || host === "npmjs.org") {
    const match = url.pathname.match(/^\/package\/((@[^/]+\/)?[^/]+)/);
    return { target: "npm", package: match ? decodeURIComponent(match[1]) : undefined };
  }
  return null;
}

/** Outbound click to GitHub (`github_click`) or npm (`npm_click`). */
export function trackOutboundClick(params: {
  target: OutboundTarget;
  link_url: string;
  link_text?: string;
  location?: string;
  package?: string;
}): void {
  trackEvent(params.target === "github" ? "github_click" : "npm_click", {
    link_url: params.link_url,
    link_text: params.link_text?.slice(0, 80),
    location: params.location ?? getPageLocation(),
    package: params.package,
  });
}

/** Reader reached the end of the Quick Start page. */
export function trackQuickStartComplete(params: { framework: string }): void {
  trackEvent("quick_start_complete", {
    framework: params.framework,
    location: "quick_start",
  });
}

/** Reader clicked the next step at the bottom of the Quick Start page. */
export function trackQuickStartNextStep(params: {
  framework?: string;
  destination: string;
}): void {
  trackEvent("quick_start_next_step", {
    framework: params.framework,
    destination: params.destination,
    location: "quick_start",
  });
}

/** Any plan button on /pricing (free install, Pro checkout, contact, book a call). */
export function trackPricingCtaClick(params: {
  plan: "free" | "pro" | "enterprise" | "unsure";
  cta_id: string;
  cta_text: string;
  destination: string;
}): void {
  trackEvent("pricing_cta_click", {
    plan: params.plan,
    cta_id: params.cta_id,
    cta_text: params.cta_text,
    destination: params.destination,
    location: "pricing_page",
  });
}

/** Unified install + data + style prompt (hero, quick start, installation). */
export function trackCopyAiSetupPrompt(params: {
  framework: string;
  location: string;
}): void {
  trackEvent("copy_ai_setup_prompt", {
    framework: params.framework,
    location: params.location,
  });
}

export function trackCopyAiThemePrompt(params: {
  framework: string;
  location: string;
  has_theme_css: boolean;
}): void {
  trackEvent("copy_ai_theme_prompt", {
    framework: params.framework,
    location: params.location,
    has_theme_css: params.has_theme_css,
  });
}

/**
 * Fired on /checkout/success only after a real checkout was started in this
 * browser (sessionStorage flag from trackBeginCheckout). Skips test visits to
 * the success URL and React Strict Mode double-mounts.
 */
export function trackPurchaseComplete(params: {
  plan?: string;
  billing?: string;
  session_id?: string | null;
} = {}): boolean {
  if (typeof window === "undefined") return false;

  let started: { plan?: string; billing?: string } | null = null;
  try {
    const raw = sessionStorage.getItem(CHECKOUT_STARTED_KEY);
    if (raw) {
      started = JSON.parse(raw) as { plan?: string; billing?: string };
    }
  } catch {
    started = null;
  }

  // Require either a Stripe session id or a prior begin_checkout in this tab.
  if (!params.session_id && !started) {
    return false;
  }

  const plan = params.plan ?? started?.plan;
  const billing = params.billing ?? started?.billing;
  const dedupeKey = `${PURCHASE_TRACKED_PREFIX}${params.session_id ?? `${plan ?? "unknown"}_${billing ?? "unknown"}`}`;

  try {
    if (sessionStorage.getItem(dedupeKey)) {
      return false;
    }
    sessionStorage.setItem(dedupeKey, "1");
    sessionStorage.removeItem(CHECKOUT_STARTED_KEY);
  } catch {
    // If storage fails, still fire once this call — caller should mount once.
  }

  trackEvent("purchase", {
    currency: "USD",
    transaction_id: params.session_id
      ? `stripe_${params.session_id}`
      : `stripe_${Date.now()}`,
    plan,
    billing,
  });
  return true;
}
