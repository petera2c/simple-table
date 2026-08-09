import { FRAMEWORK_LABELS, type Framework } from "@/constants/frameworks";

/** Stylesheet import path from Quick Start — also the className source of truth. */
const STYLE_IMPORT_PATHS: Record<Framework, string> = {
  react: "@simple-table/react/styles.css",
  vue: "@simple-table/vue/styles.css",
  angular: "@simple-table/angular/styles.css",
  svelte: "@simple-table/svelte/styles.css",
  solid: "@simple-table/solid/styles.css",
  vanilla: "simple-table-core/styles.css",
};

/**
 * Paste-ready AI prompt for installing Simple Table and building a basic table.
 * Short prose style (TanStack-like): detect framework from the project, with the
 * site selector as a soft hint — not a hard assumption.
 */
export function getAiTablePrompt(framework: Framework): string {
  const label = FRAMEWORK_LABELS[framework];

  return `Build a Simple Table data grid for this TypeScript app. Detect the UI framework in the project (likely ${label}), install the official Simple Table adapter for it, import its styles, and show a basic table with sample columns and rows. Prefer https://www.simple-table.com/docs/quick-start over inventing APIs.`;
}

/**
 * Paste-ready AI prompt for matching Simple Table to the host app's design system.
 * Points at Quick Start (install + styles import), the package styles.css for classNames,
 * and the custom theme docs for --st-* overrides.
 */
export function getAiThemePrompt(
  framework: Framework,
  options?: { currentThemeCss?: string }
): string {
  const label = FRAMEWORK_LABELS[framework];
  const stylesPath = STYLE_IMPORT_PATHS[framework];

  const base = `Match Simple Table to this app's design system so the grid looks native here.

If Simple Table is not installed yet, install it first and follow https://www.simple-table.com/docs/quick-start — including the required stylesheet import. Detect the UI framework in the project (likely ${label}).

Open the imported styles file (${stylesPath} in node_modules). That CSS is the up-to-date source of truth for every st-* className you may need.

Prefer CSS variable overrides on .theme-custom from https://www.simple-table.com/docs/custom-theme. Use class selectors from that styles.css only when a --st-* variable is not enough. Deep-analyze this repository's tokens, colors, radii, borders, typography, and surfaces, then return a complete .theme-custom CSS block (and customTheme rowHeight/headerHeight if the virtualizer sizes need to change).`;

  const css = options?.currentThemeCss?.trim();
  if (!css) {
    return base;
  }

  return `${base}

Starting point from the Theme Builder (refine to match this app):

\`\`\`css
${css}
\`\`\``;
}
