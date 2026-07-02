import type { ReactNode } from "react";
import DemoCodeProvider from "@/providers/DemoCodeProvider";
import { loadDemoCodeMap } from "@/utils/loadDemoCode";

/**
 * Demo snippets rendered on each docs page. Keep in sync with the `demoId` props used in the
 * corresponding *Content components so every framework variant is server-rendered into the HTML.
 */
const DOCS_DEMO_IDS: Record<string, string[]> = {
  "aggregate-functions": ["aggregate-functions"],
  animations: ["animations"],
  "cell-clicking": ["cell-clicking"],
  "cell-editing": ["cell-editing"],
  "cell-highlighting": ["cell-highlighting"],
  "cell-renderer": ["cell-renderer"],
  "chart-columns": ["charts"],
  "collapsible-columns": ["collapsible-columns", "single-row-children"],
  "column-alignment": ["column-alignment"],
  "column-filtering": ["column-filtering", "external-filter"],
  "column-pinning": ["column-pinning"],
  "column-reordering": ["column-reordering"],
  "column-resizing": ["column-resizing"],
  "column-selection": ["column-selection"],
  "column-sorting": ["column-sorting", "external-sort"],
  "column-visibility": ["column-visibility", "column-editor-custom-renderer"],
  "column-width": ["column-width"],
  "csv-export": ["csv-export"],
  "custom-icons": ["custom-icons"],
  "custom-theme": ["custom-theme"],
  "empty-state": ["empty-state"],
  "footer-renderer": ["footer-renderer"],
  "header-renderer": ["header-renderer"],
  "infinite-scroll": ["infinite-scroll"],
  "live-updates": ["live-update"],
  "loading-state": ["loading-state"],
  "nested-headers": ["nested-headers"],
  "nested-tables": ["nested-tables", "dynamic-nested-tables"],
  pagination: ["pagination"],
  "programmatic-control": ["programmatic-control"],
  "quick-filter": ["quick-filter"],
  "quick-start": ["quick-start"],
  "row-grouping": ["row-grouping", "dynamic-row-loading"],
  "row-height": ["row-height"],
  "row-selection": ["row-selection"],
  "table-height": ["table-height"],
  themes: ["themes"],
  tooltips: ["tooltip"],
  "value-formatter": ["value-formatter"],
};

/**
 * Server component: preloads every framework variant of a docs page's demo snippets so they are
 * part of the server-rendered HTML (crawlers don't run the client-side fetch).
 */
export default function DocsDemoCode({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const demoIds = DOCS_DEMO_IDS[slug] ?? [];
  return <DemoCodeProvider codeMap={loadDemoCodeMap(demoIds)}>{children}</DemoCodeProvider>;
}
