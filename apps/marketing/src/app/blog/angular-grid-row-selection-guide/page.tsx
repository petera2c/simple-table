import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { angularGridRowSelectionPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: angularGridRowSelectionPost.title,
  description: angularGridRowSelectionPost.description,
  keywords:
    "angular row selection, angular table checkbox selection, angular data grid select rows, ag grid angular row selection, primeng table selection, simple table angular",
  openGraph: {
    title: angularGridRowSelectionPost.title,
    description: angularGridRowSelectionPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: angularGridRowSelectionPost.title,
    description: angularGridRowSelectionPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${angularGridRowSelectionPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={angularGridRowSelectionPost.slug}
      title={angularGridRowSelectionPost.title}
      subtitle="Single, multi, and checkbox row selection for Angular data grids—idiomatic standalone-component examples for Simple Table for Angular and a comparison to AG Grid Angular, ngx-datatable, and PrimeNG."
      framework="angular"
      heroBadges={["Angular", "Tutorial", "Row Selection"]}
      datePublished={angularGridRowSelectionPost.createdAt}
      dateModified={angularGridRowSelectionPost.updatedAt}
      introParagraphs={[
        "Row selection drives bulk actions: delete, archive, export, assign. Get it wrong and users misclick or struggle on touch screens.",
        "This tutorial walks through single, multi, and checkbox selection patterns for the Angular data grid landscape—and shows the Simple Table for Angular setup with signals.",
        "If you also need pinned columns, virtualization, and grouping with aggregations alongside selection, Simple Table for Angular is the focused MIT pick.",
      ]}
      whyItMatters={[
        { title: "Bulk actions", body: "Selection enables archive, delete, export, assign, etc. Without it, users repeat per-row actions." },
        { title: "Keyboard ergonomics", body: "Shift-click range, Ctrl-click toggle, and Space-to-select are expected by power users." },
        { title: "Cross-page persistence", body: "When users paginate, their selection should survive the navigation." },
        { title: "Accessibility", body: "Screen readers and keyboard users need aria-selected and focus-visible states." },
      ]}
      libraryRows={[
        { library: "Simple Table for Angular", support: { value: "Built-in (single / multi / checkbox)", tone: "good" }, notes: "[selectableCells]=\"'row'\" + onRowSelect / onSelectionChange outputs." },
        { library: "AG Grid Angular", support: { value: "Built-in", tone: "good" }, notes: "rowSelection: 'single' | 'multiple', checkboxSelection on column defs." },
        { library: "ngx-datatable", support: { value: "Built-in", tone: "good" }, notes: "[selectionType]=\"'single' | 'multi' | 'checkbox'\"; pairs with [selected] two-way binding." },
        { library: "PrimeNG Table", support: { value: "Built-in", tone: "good" }, notes: "[(selection)] + selectionMode='single'|'multiple', plus <p-tableCheckbox>." },
        { library: "Angular Material mat-table", support: { value: "Manual", tone: "neutral" }, notes: "Use SelectionModel + <mat-checkbox>; you wire the column yourself." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Angular",
        intro: "Enable selection with selectableCells, listen for selection changes, and combine with sorting / filtering / pinning without extra config.",
                notes: (
          <>
            Use a stable identifier (database id, GUID) when tracking selection across pagination. Indexes break when filters or sorts change.
          </>
        ),
      }}
      pitfalls={[
        { title: "Tracking by index breaks", problem: "When users sort or filter, the same index points to a different row.", solution: "Always key selection by a stable identifier (id / uuid)." },
        { title: "Tiny touch targets", problem: "Checkboxes are too small on phones, users miss-tap.", solution: "Provide at least 44x44px touch targets. Simple Table's checkbox column does this." },
        { title: "Unintended row toggles on cell click", problem: "Clicking a button inside a row also selects the row.", solution: "Stop propagation on clickable cell renderers, or use selectableCells=\"row\" with a dedicated checkbox column." },
        { title: "Lost selection on data refetch", problem: "After polling refresh, selection clears.", solution: "Reapply your stable-id Set after data refresh, or use immutable updates that preserve identity." },
      ]}
      faqs={[
        { question: "Can I support Shift-click range selection?", answer: "Yes—Simple Table handles range selection out of the box for selectableCells=\"row\". Shift-click selects the range from anchor to current row." },
        { question: "How do I select all rows on a page?", answer: "Add a checkbox in the header cell renderer that toggles every row currently in view. For \"select across all pages,\" you'll wire that yourself with a stored Set." },
        { question: "Is selection accessible?", answer: "Yes. Simple Table sets aria-selected on rows and supports keyboard navigation (Space to toggle, arrow keys to move focus)." },
      ]}
      conclusionParagraphs={[
        "Row selection in Angular is a one-line change in Simple Table. Other libraries also support it but with more wiring (mat-table requires DIY entirely).",
        "Always key selection by stable identifier and provide proper touch targets. Combine with virtualization and pinning if you're working with large datasets.",
      ]}
      relatedLinks={[
        { href: "/blog/angular-data-grid-simple-table", label: "Pillar guide: best free Angular data grid in 2026" },
        { href: "/docs/row-selection", label: "Row selection documentation" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
      ctaTitle="Add row selection to your Angular grid"
      ctaDescription="Simple Table for Angular ships single, multi, and checkbox selection in one MIT package—~70 kB gzipped, signals-native, accessible."
      docsHref="/docs/row-selection"
    />
  );
}
