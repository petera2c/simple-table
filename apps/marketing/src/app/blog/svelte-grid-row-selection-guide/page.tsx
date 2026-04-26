import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { svelteGridRowSelectionPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: svelteGridRowSelectionPost.title,
  description: svelteGridRowSelectionPost.description,
  keywords:
    "svelte row selection, sveltekit table checkbox selection, svelte 5 runes data grid, svelte-headless-table selection, simple table svelte",
  openGraph: {
    title: svelteGridRowSelectionPost.title,
    description: svelteGridRowSelectionPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: svelteGridRowSelectionPost.title,
    description: svelteGridRowSelectionPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${svelteGridRowSelectionPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={svelteGridRowSelectionPost.slug}
      title={svelteGridRowSelectionPost.title}
      subtitle="Single, multi, and checkbox row selection for Svelte data grids—idiomatic Svelte 5 / runes examples for Simple Table for Svelte and a comparison to svelte-headless-table, SVAR DataGrid, and Flowbite."
      framework="svelte"
      heroBadges={["Svelte", "Tutorial", "Row Selection"]}
      datePublished={svelteGridRowSelectionPost.createdAt}
      dateModified={svelteGridRowSelectionPost.updatedAt}
      introParagraphs={[
        "Row selection drives bulk actions: delete, archive, export, assign. Get it wrong and users misclick or struggle on touch screens.",
        "This tutorial walks through single, multi, and checkbox selection patterns for Svelte / SvelteKit and shows the Simple Table for Svelte setup with both Svelte 4 stores and Svelte 5 runes.",
        "If you also need pinning, virtualization, and grouping with aggregations alongside selection, Simple Table for Svelte is the focused MIT pick.",
      ]}
      whyItMatters={[
        { title: "Bulk actions", body: "Selection enables archive, delete, export, assign, etc. Without it, users repeat per-row actions." },
        { title: "Keyboard ergonomics", body: "Shift-click range, Ctrl-click toggle, and Space-to-select are expected by power users." },
        { title: "Cross-page persistence", body: "When users paginate, their selection should survive the navigation." },
        { title: "Accessibility", body: "Screen readers and keyboard users need aria-selected and focus-visible states." },
      ]}
      libraryRows={[
        { library: "Simple Table for Svelte", support: { value: "Built-in (single / multi / checkbox)", tone: "good" }, notes: "selectableCells=\"row\" + on:rowSelect dispatcher event." },
        { library: "svelte-headless-table", support: { value: "Plugin (manual)", tone: "neutral" }, notes: "addSelectedRows plugin gives state; rendering and toggling are DIY." },
        { library: "SVAR DataGrid (Svelte)", support: { value: "Built-in (commercial)", tone: "neutral" }, notes: "Selection built-in but commercial license required." },
        { library: "Flowbite Svelte Table", support: { value: "Manual", tone: "bad" }, notes: "Markup-only utilities—wire selection state yourself." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Svelte",
        intro: "Enable selection with selectableCells, listen for the rowSelect event, and combine with sorting / filtering / pinning without extra config.",
                notes: <>Use a stable identifier (database id, GUID) when tracking selection across pagination. Indexes break when filters or sorts change.</>,
      }}
      pitfalls={[
        { title: "Tracking by index breaks", problem: "When users sort or filter, the same index points to a different row.", solution: "Always key selection by a stable identifier (id / uuid)." },
        { title: "Tiny touch targets", problem: "Checkboxes are too small on phones, users miss-tap.", solution: "Provide at least 44x44px touch targets. Simple Table's checkbox column does this." },
        { title: "Unintended row toggles on cell click", problem: "Clicking a button inside a row also selects the row.", solution: "Stop propagation on clickable cell renderers, or use selectableCells=\"row\" with a dedicated checkbox column." },
        { title: "Lost selection on data refetch", problem: "After polling refresh, selection clears.", solution: "Reapply your stable-id Set after data refresh." },
      ]}
      faqs={[
        { question: "Does this work with Svelte 4 stores?", answer: "Yes. Replace $state with writable() and the event handler still works." },
        { question: "Can I support Shift-click range selection?", answer: "Yes—Simple Table handles range selection out of the box for selectableCells=\"row\"." },
        { question: "Is selection accessible?", answer: "Yes. Simple Table sets aria-selected on rows and supports keyboard navigation." },
      ]}
      conclusionParagraphs={[
        "Row selection in Svelte is a single prop and event handler in Simple Table. svelte-headless-table requires plugin wiring; SVAR ships it commercially; Flowbite is DIY.",
        "Always key selection by stable identifier and provide proper touch targets. Combine with virtualization and pinning for large datasets.",
      ]}
      relatedLinks={[
        { href: "/blog/sveltekit-data-table-simple-table", label: "Pillar guide: best free SvelteKit data table in 2026" },
        { href: "/docs/row-selection", label: "Row selection documentation" },
        { href: "/frameworks/svelte", label: "Svelte integration hub" },
      ]}
      ctaTitle="Add row selection to your Svelte grid"
      ctaDescription="Simple Table for Svelte ships single, multi, and checkbox selection in one MIT package—~70 kB gzipped, Svelte 5 runes ready."
      docsHref="/docs/row-selection"
    />
  );
}
