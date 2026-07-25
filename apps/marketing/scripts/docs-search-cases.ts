/**
 * Query → expected docs page. Kept separate from the runner so failures are easy to scan.
 * `expectTop` must be rank #1. Prefer user-facing phrases, not only prop names.
 */
export type DocsSearchCase = {
  query: string;
  expectTop: string;
  /** Optional note shown on failure */
  note?: string;
  /**
   * When set, the match-aware snippet for the #1 result must include this
   * substring (case-insensitive). Proves search surfaces visible page text.
   */
  expectSnippetIncludes?: string;
};

export const DOCS_SEARCH_CASES: DocsSearchCase[] = [
  // Infinite scroll / external scroll
  {
    query: "external scroll",
    expectTop: "infinite-scroll",
    expectSnippetIncludes: "external",
  },
  {
    // Visible heading on Table Height: "External / window scroll"
    query: "window scroll",
    expectTop: "table-height",
    expectSnippetIncludes: "window",
  },
  {
    query: "page scroll",
    expectTop: "infinite-scroll",
    expectSnippetIncludes: "page",
  },
  { query: "scrollParent", expectTop: "infinite-scroll", expectSnippetIncludes: "scrollParent" },
  { query: "onLoadMore", expectTop: "infinite-scroll", expectSnippetIncludes: "onLoadMore" },
  { query: "infinite scroll", expectTop: "infinite-scroll" },

  // CSV / programmatic / live updates
  { query: "export to csv", expectTop: "csv-export" },
  { query: "exportToCSV", expectTop: "csv-export" },
  { query: "access the api", expectTop: "programmatic-control" },
  { query: "programmatic control", expectTop: "programmatic-control" },
  { query: "updateData", expectTop: "live-updates" },
  { query: "live updates", expectTop: "live-updates" },
  { query: "cellUpdateFlash", expectTop: "live-updates" },

  // Themes / icons / custom theme
  {
    query: "override icons",
    expectTop: "custom-icons",
    expectSnippetIncludes: "override",
  },
  { query: "custom icons", expectTop: "custom-icons" },
  {
    query: "layout dimensions",
    expectTop: "custom-theme",
    expectSnippetIncludes: "layout",
  },
  { query: "custom theme", expectTop: "custom-theme" },
  { query: "theme-custom", expectTop: "custom-theme" },
  { query: "modern-dark", expectTop: "themes" },

  // Common feature phrases
  { query: "quick filter", expectTop: "quick-filter" },
  { query: "empty state", expectTop: "empty-state" },
  { query: "loading state", expectTop: "loading-state" },
  { query: "row selection", expectTop: "row-selection" },
  { query: "column pinning", expectTop: "column-pinning" },
  { query: "value formatter", expectTop: "value-formatter" },
  { query: "tooltips", expectTop: "tooltips" },
  { query: "table height", expectTop: "table-height" },
];
