import { SEO_STRINGS } from "./strings/seo";

export type SeoStringKey = keyof typeof SEO_STRINGS;

/** Map docs URL slug → SEO_STRINGS key. Shared by DocsJsonLd and the search-index generator. */
export const DOC_SLUG_TO_SEO_KEY: Record<string, SeoStringKey> = {
  "aggregate-functions": "aggregateFunctions",
  pivot: "pivot",
  animations: "animations",
  "api-reference": "apiReference",
  "cell-clicking": "cellClicking",
  "cell-editing": "cellEditing",
  "cell-highlighting": "cellHighlighting",
  "cell-renderer": "cellRenderer",
  "chart-columns": "chartColumns",
  "collapsible-columns": "collapsibleColumns",
  "column-alignment": "columnAlignment",
  "column-filtering": "columnFiltering",
  "column-pinning": "columnPinning",
  "column-reordering": "columnReordering",
  "column-resizing": "columnResizing",
  "column-selection": "columnSelection",
  "column-sorting": "columnSorting",
  "column-visibility": "columnVisibility",
  "column-width": "columnWidth",
  "csv-export": "csvExport",
  "custom-icons": "customIcons",
  "custom-theme": "customTheme",
  "empty-state": "emptyState",
  "footer-renderer": "footerRenderer",
  "header-renderer": "headerRenderer",
  "infinite-scroll": "infiniteScroll",
  installation: "installation",
  "live-updates": "liveUpdates",
  "loading-state": "loadingState",
  "nested-headers": "nestedHeaders",
  "nested-tables": "nestedTables",
  pagination: "pagination",
  "programmatic-control": "programmaticControl",
  "quick-filter": "quickFilter",
  "quick-start": "quickStart",
  "row-grouping": "rowGrouping",
  "row-height": "rowHeight",
  "row-selection": "rowSelection",
  "table-height": "tableHeight",
  tdgp: "tdgp",
  themes: "themes",
  tooltips: "tooltips",
  "value-formatter": "valueFormatter",
};

export type DocSeoEntry = {
  title: string;
  description: string;
  keywords: string[];
};

function normalizeKeywords(keywords: unknown): string[] {
  if (Array.isArray(keywords)) {
    return keywords.map(String).filter(Boolean);
  }
  if (typeof keywords === "string") {
    return keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
  }
  return ["simple-table", "react-table", "documentation"];
}

/** Resolve SEO metadata for a docs slug. */
export function getDocSeoEntry(slug: string): DocSeoEntry | null {
  const key = DOC_SLUG_TO_SEO_KEY[slug];
  if (!key) return null;
  const value = SEO_STRINGS[key] as
    | { title?: string; description?: string; keywords?: string | string[] }
    | undefined;
  if (!value || typeof value !== "object" || typeof value.title !== "string") {
    return null;
  }
  return {
    title: value.title,
    description: typeof value.description === "string" ? value.description : "",
    keywords: normalizeKeywords(value.keywords),
  };
}
