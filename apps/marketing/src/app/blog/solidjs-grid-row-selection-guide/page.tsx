import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { solidGridRowSelectionPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: solidGridRowSelectionPost.title,
  description: solidGridRowSelectionPost.description,
  keywords:
    "solidjs row selection, solid table checkbox selection, tanstack solid table selection, simple table solid, signals data grid",
  openGraph: {
    title: solidGridRowSelectionPost.title,
    description: solidGridRowSelectionPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: solidGridRowSelectionPost.title,
    description: solidGridRowSelectionPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${solidGridRowSelectionPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={solidGridRowSelectionPost.slug}
      title={solidGridRowSelectionPost.title}
      subtitle="Single, multi, and checkbox row selection for SolidJS data grids—signals-native examples for Simple Table for Solid and a comparison to TanStack Solid Table."
      framework="solid"
      heroBadges={["SolidJS", "Tutorial", "Row Selection"]}
      datePublished={solidGridRowSelectionPost.createdAt}
      dateModified={solidGridRowSelectionPost.updatedAt}
      introParagraphs={[
        "Row selection drives bulk actions: delete, archive, export, assign. Get it wrong and users misclick or struggle on touch screens.",
        "This tutorial walks through single, multi, and checkbox selection patterns for SolidJS data grids and shows the Simple Table for Solid setup with signals.",
        "If you also need pinning, virtualization, and grouping with aggregations alongside selection, Simple Table for Solid is the focused MIT pick.",
      ]}
      whyItMatters={[
        { title: "Bulk actions", body: "Selection enables archive, delete, export, assign, etc. Without it, users repeat per-row actions." },
        { title: "Keyboard ergonomics", body: "Shift-click range, Ctrl-click toggle, and Space-to-select are expected by power users." },
        { title: "Cross-page persistence", body: "When users paginate, their selection should survive the navigation." },
        { title: "Accessibility", body: "Screen readers and keyboard users need aria-selected and focus-visible states." },
      ]}
      libraryRows={[
        { library: "Simple Table for Solid", support: { value: "Built-in (single / multi / checkbox)", tone: "good" }, notes: "selectableCells=\"row\" + onRowSelect callback." },
        { library: "TanStack Solid Table", support: { value: "Headless", tone: "neutral" }, notes: "row-selection feature; you render checkboxes and bind events yourself." },
        { library: "Kobalte primitives", support: { value: "Not applicable", tone: "neutral" }, notes: "Kobalte is a primitives library, not a data-grid solution." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Solid",
        intro: "Enable selection with selectableCells, listen for onRowSelect, and combine with sorting / filtering / pinning without extra config.",
                notes: <>Use a stable identifier (database id, GUID) when tracking selection across pagination. Indexes break when filters or sorts change.</>,
      }}
      pitfalls={[
        { title: "Tracking by index breaks", problem: "When users sort or filter, the same index points to a different row.", solution: "Always key selection by a stable identifier (id / uuid)." },
        { title: "Tiny touch targets", problem: "Checkboxes are too small on phones.", solution: "Provide at least 44x44px touch targets. Simple Table's checkbox column does this." },
        { title: "Unintended row toggles on cell click", problem: "Clicking a button inside a row also selects the row.", solution: "Stop propagation on clickable cell renderers, or use selectableCells=\"row\" with a dedicated checkbox column." },
        { title: "Lost selection on data refetch", problem: "After polling refresh, selection clears.", solution: "Reapply your stable-id Set after data refresh; createStore preserves identity better than replacing rows wholesale." },
      ]}
      faqs={[
        { question: "Can I support Shift-click range selection?", answer: "Yes—Simple Table handles range selection out of the box for selectableCells=\"row\"." },
        { question: "Does it work with createStore?", answer: "Yes. Selection state can live in a store; Solid's fine-grained reactivity makes updates smooth." },
        { question: "Is selection accessible?", answer: "Yes. Simple Table sets aria-selected on rows and supports keyboard navigation." },
      ]}
      conclusionParagraphs={[
        "Row selection in SolidJS is a single prop and callback in Simple Table. TanStack Solid Table is headless—you wire checkboxes manually.",
        "Always key selection by stable identifier and provide proper touch targets. Combine with virtualization and pinning for large datasets.",
      ]}
      relatedLinks={[
        { href: "/blog/solidjs-data-grid-simple-table", label: "Pillar guide: best free SolidJS data grid in 2026" },
        { href: "/docs/row-selection", label: "Row selection documentation" },
        { href: "/frameworks/solid", label: "Solid integration hub" },
      ]}
      ctaTitle="Add row selection to your Solid grid"
      ctaDescription="Simple Table for Solid ships single, multi, and checkbox selection in one MIT package—~70 kB gzipped, signals-native."
      docsHref="/docs/row-selection"
    />
  );
}
