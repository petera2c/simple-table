import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { vanillaGridRowSelectionPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: vanillaGridRowSelectionPost.title,
  description: vanillaGridRowSelectionPost.description,
  keywords:
    "vanilla js row selection, typescript data grid checkbox, tabulator row selection, grid.js selection, simple-table-core selection",
  openGraph: {
    title: vanillaGridRowSelectionPost.title,
    description: vanillaGridRowSelectionPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: vanillaGridRowSelectionPost.title,
    description: vanillaGridRowSelectionPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${vanillaGridRowSelectionPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={vanillaGridRowSelectionPost.slug}
      title={vanillaGridRowSelectionPost.title}
      subtitle="Single, multi, and checkbox row selection for vanilla TypeScript data grids—strict TypeScript examples for simple-table-core and a comparison to Tabulator, Grid.js, and Handsontable."
      framework="vanilla"
      heroBadges={["Vanilla TS", "Tutorial", "Row Selection"]}
      datePublished={vanillaGridRowSelectionPost.createdAt}
      dateModified={vanillaGridRowSelectionPost.updatedAt}
      introParagraphs={[
        "Row selection drives bulk actions: delete, archive, export, assign. Get it wrong and users misclick or struggle on touch screens.",
        "This tutorial walks through single, multi, and checkbox selection patterns for the vanilla JS / TS data grid landscape and shows the simple-table-core setup with strict TypeScript.",
        "If you want a framework-agnostic, strict-TypeScript core grid that works in any host (web component, micro-frontend, plain HTML), simple-table-core is ~70 kB gzipped and MIT-licensed.",
      ]}
      whyItMatters={[
        { title: "Bulk actions", body: "Selection enables archive, delete, export, assign, etc. Without it, users repeat per-row actions." },
        { title: "Keyboard ergonomics", body: "Shift-click range, Ctrl-click toggle, and Space-to-select are expected by power users." },
        { title: "Cross-page persistence", body: "When users paginate, their selection should survive the navigation." },
        { title: "Accessibility", body: "Screen readers and keyboard users need aria-selected and focus-visible states." },
      ]}
      libraryRows={[
        { library: "simple-table-core", support: { value: "Built-in (single / multi / checkbox)", tone: "good" }, notes: "selectableCells: 'row' + onRowSelect callback." },
        { library: "Tabulator", support: { value: "Built-in", tone: "good" }, notes: "selectable: true + selectableRangeMode + rowSelectionChanged event." },
        { library: "Grid.js", support: { value: "Plugin", tone: "neutral" }, notes: "Selection plugin; less polished than core grids." },
        { library: "Handsontable", support: { value: "Built-in (commercial)", tone: "neutral" }, notes: "Selection built-in but commercial license required." },
        { library: "jSpreadsheet", support: { value: "Spreadsheet-style", tone: "neutral" }, notes: "Cell-range selection; less suited for row-based UX." },
      ]}
      simpleTableSection={{
        headline: "Implementation: simple-table-core",
        intro: "Pass selectableCells: 'row' in options, listen for onRowSelect, and combine with sorting / filtering / pinning without extra config.",
                notes: <>Use a stable identifier (database id, GUID) when tracking selection across pagination. Indexes break when filters or sorts change.</>,
      }}
      pitfalls={[
        { title: "Tracking by index breaks", problem: "When users sort or filter, the same index points to a different row.", solution: "Always key selection by a stable identifier (id / uuid)." },
        { title: "Tiny touch targets", problem: "Checkboxes are too small on phones, users miss-tap.", solution: "Provide at least 44x44px touch targets. simple-table-core's checkbox column does this." },
        { title: "Memory leaks on SPA navigation", problem: "Listeners persist after the host element is removed.", solution: "Call table.dispose() on cleanup so listeners are removed." },
        { title: "Lost selection on data refetch", problem: "After polling refresh, selection clears.", solution: "Reapply your stable-id Set after data refresh by reusing each row's existing id." },
      ]}
      faqs={[
        { question: "Can I support Shift-click range selection?", answer: "Yes—simple-table-core handles range selection out of the box for selectableCells: 'row'." },
        { question: "Does it work in a web component?", answer: "Yes. Pass shadowRoot.querySelector('#host') as the element." },
        { question: "Is selection accessible?", answer: "Yes. simple-table-core sets aria-selected on rows and supports keyboard navigation (Space to toggle, arrow keys to move focus)." },
      ]}
      conclusionParagraphs={[
        "Row selection in vanilla JS / TS is a single option and callback in simple-table-core. Tabulator and Handsontable also ship it but at larger bundle sizes (Handsontable is commercial).",
        "Always key selection by stable identifier and provide proper touch targets. Combine with virtualization and pinning for large datasets.",
      ]}
      relatedLinks={[
        { href: "/blog/vanilla-typescript-data-grid-simple-table-core", label: "Pillar guide: best free vanilla TypeScript data grid in 2026" },
        { href: "/docs/row-selection", label: "Row selection documentation" },
        { href: "/frameworks/vanilla", label: "Vanilla TS integration hub" },
      ]}
      ctaTitle="Add row selection to your vanilla TS grid"
      ctaDescription="simple-table-core ships single, multi, and checkbox selection in one MIT package—~70 kB gzipped, strict TypeScript, ESM-first."
      docsHref="/docs/row-selection"
    />
  );
}
