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
 * Paste-ready AI prompt: install Simple Table, wire real app data, and match styling.
 * Soft-hints the site framework selector; detect the real stack from the project.
 */
export function getAiSetupPrompt(framework: Framework): string {
  const label = FRAMEWORK_LABELS[framework];
  const stylesPath = STYLE_IMPORT_PATHS[framework];

  const angularHint =
    framework === "angular"
      ? `

For Angular, import SimpleTableImports (that brings in the table and template directives). Put custom cells and empty UI in the page with stCell and stEmpty. Bind events as (sortChange), (cellClick), and (rowSelectionChange). The older [onSortChange] inputs still work.`
      : "";

  return `Integrate Simple Table into this TypeScript app end-to-end. Detect the UI framework in the project (likely ${label}). Prefer https://www.simple-table.com/docs/quick-start and https://www.simple-table.com/docs/api-reference over inventing APIs.${angularHint}

1. Install. If Simple Table is not installed yet, install the official adapter with this project's package manager (prefer the lockfile / packageManager field: pnpm, yarn, or npm). Import its stylesheet (${stylesPath}). Do not skip that import. If install fails with a workspace:* resolution error, retry with pnpm. Only after install succeeds, open ${stylesPath} in node_modules; that CSS is the up-to-date source of truth for every st-* className.

2. Data. Deep-analyze this repository for domain types, API responses, fixtures, stores, or existing tables. Prefer those shapes over inventing sample data. Replace existing table UIs in place. Do not add a separate demo page. Produce typed column definitions (accessor, label, width, type) and row mapping from the real data. Keep existing display helpers (formatters, badges, stacked cells) via valueFormatter / cellRenderer when they already exist. Set getRowId from a stable unique field. Set height or maxHeight so the table owns scrolling (https://www.simple-table.com/docs/table-height). Prefer width: "auto" with a sensible maxWidth per column (https://www.simple-table.com/docs/column-width); use fixed px or 1fr only when auto clearly does not fit.

3. Interaction. Make the grid feel product-ready, not a bare static grid. Browse https://www.simple-table.com/docs for available features (sorting, filtering, resizing, reordering, selection, and similar). Look at this app's data shapes and UI, then enable what fits. For example sortable/filterable columns, enumOptions for enums/statuses, columnResizing, or column reordering. Prefer the official docs over inventing APIs; skip anything that clearly conflicts with the host UI.

4. Icons. If this app already uses an icon library (Lucide, Font Awesome, Heroicons, etc.), pass matching icons through the icons prop so sort, filter, expand, drag, and pagination controls match the host UI (https://www.simple-table.com/docs/custom-icons). Reuse the same library and stroke/weight conventions already in the app. Do not invent a new icon system; keep Simple Table defaults only when no icon library is present.

5. Style. Prefer CSS variable overrides on .theme-custom from https://www.simple-table.com/docs/custom-theme, and pass theme="custom" on the table. Use class selectors from the package styles.css only when a --st-* variable is not enough. Match this repository's tokens, colors, radii, borders, typography, and surfaces, and return a complete .theme-custom CSS block. If row or header height should differ from the defaults, also set customTheme={{ rowHeight, headerHeight }} in pixels. CSS alone cannot change those.`;
}

/**
 * Paste-ready AI prompt for matching Simple Table to the host app's design system.
 * Used by Theme Builder; optional currentThemeCss is appended as a starting point.
 */
export function getAiThemePrompt(
  framework: Framework,
  options?: { currentThemeCss?: string }
): string {
  const label = FRAMEWORK_LABELS[framework];
  const stylesPath = STYLE_IMPORT_PATHS[framework];

  const base = `Match Simple Table to this app's design system so the grid looks native here.

If Simple Table is not installed yet, install it with this project's package manager (prefer the lockfile / packageManager field). Import the stylesheet and follow https://www.simple-table.com/docs/quick-start. If install fails with a workspace:* resolution error, retry with pnpm. Detect the UI framework in the project (likely ${label}).

After install succeeds, open the imported styles file (${stylesPath} in node_modules). That CSS is the up-to-date source of truth for every st-* className you may need.

Prefer CSS variable overrides on .theme-custom from https://www.simple-table.com/docs/custom-theme, and pass theme="custom" on the table. Use class selectors from that styles.css only when a --st-* variable is not enough. Deep-analyze this repository's tokens, colors, radii, borders, typography, and surfaces, then return a complete .theme-custom CSS block. If row or header height should differ from the defaults, also set customTheme={{ rowHeight, headerHeight }} in pixels — CSS alone cannot change those.

Also set layout to fit this app: table height or maxHeight per https://www.simple-table.com/docs/table-height. Prefer width: "auto" with a sensible maxWidth per column (https://www.simple-table.com/docs/column-width); use fixed px or 1fr only when auto clearly does not fit.`;

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
