"use client";

import { usePathname } from "next/navigation";
import { SEO_STRINGS } from "@/constants/strings/seo";
import {
  buildBreadcrumbListJsonLd,
  buildTechArticleJsonLd,
} from "@/utils/structuredData";

type SeoStringKey = keyof typeof SEO_STRINGS;

const DOC_SLUG_TO_SEO_KEY: Record<string, SeoStringKey> = {
  "aggregate-functions": "aggregateFunctions",
  animations: "animations",
  "api-reference": "apiReference",
  "cell-clicking": "cellClicking",
  "cell-editing": "cellEditing",
  "cell-highlighting": "cellHighlighting",
  "cell-renderer": "cellRenderer",
  "collapsible-columns": "collapsibleColumns",
  "column-alignment": "columnAlignment",
  "column-editing": "columnEditing",
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
  "quick-filter": "quickFilter",
  "quick-start": "quickStart",
  "row-grouping": "rowGrouping",
  "row-height": "rowHeight",
  "row-selection": "rowSelection",
  "table-height": "tableHeight",
  themes: "themes",
  tooltips: "tooltips",
  "value-formatter": "valueFormatter",
};

interface SeoStringEntry {
  title: string;
  description: string;
}

function getDocSeoEntry(slug: string): SeoStringEntry | null {
  const key = DOC_SLUG_TO_SEO_KEY[slug];
  if (!key) return null;
  const value = SEO_STRINGS[key] as SeoStringEntry | undefined;
  if (!value || typeof value !== "object" || !("title" in value)) return null;
  return value;
}

export default function DocsJsonLd() {
  const pathname = usePathname();
  const slug = pathname.replace(/^\/?docs\/?/, "").split("/")[0] ?? "";
  if (!slug) return null;

  const entry = getDocSeoEntry(slug);
  if (!entry) return null;

  const today = new Date().toISOString().slice(0, 10);
  const article = buildTechArticleJsonLd({
    title: entry.title,
    description: entry.description,
    canonicalPath: `/docs/${slug}`,
    datePublished: "2025-01-01",
    dateModified: today,
  });
  const breadcrumbs = buildBreadcrumbListJsonLd([
    { name: "Home", url: "/" },
    { name: "Docs", url: "/docs/quick-start" },
    { name: entry.title, url: `/docs/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}
