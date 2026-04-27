import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { vueGridRowSelectionPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: vueGridRowSelectionPost.title,
  description: vueGridRowSelectionPost.description,
  keywords:
    "vue 3 row selection, vue table checkbox selection, vuetify v-data-table selection, primevue selection, simple table vue, composition api",
  openGraph: {
    title: vueGridRowSelectionPost.title,
    description: vueGridRowSelectionPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: vueGridRowSelectionPost.title,
    description: vueGridRowSelectionPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${vueGridRowSelectionPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={vueGridRowSelectionPost.slug}
      title={vueGridRowSelectionPost.title}
      subtitle="Single, multi, and checkbox row selection for Vue 3 data grids—idiomatic Composition API examples for Simple Table for Vue and a comparison to PrimeVue, Vuetify, and Element Plus."
      framework="vue"
      heroBadges={["Vue 3", "Tutorial", "Row Selection"]}
      datePublished={vueGridRowSelectionPost.createdAt}
      dateModified={vueGridRowSelectionPost.updatedAt}
      introParagraphs={[
        "Row selection drives bulk actions: delete, archive, export, assign. Get it wrong and users misclick or struggle on touch screens.",
        "This tutorial walks through single, multi, and checkbox selection patterns for Vue 3 data grids and shows the Simple Table for Vue setup with the Composition API.",
        "If you also need pinning, virtualization, and grouping with aggregations alongside selection, Simple Table for Vue is the focused MIT pick.",
      ]}
      whyItMatters={[
        { title: "Bulk actions", body: "Selection enables archive, delete, export, assign, etc. Without it, users repeat per-row actions." },
        { title: "Keyboard ergonomics", body: "Shift-click range, Ctrl-click toggle, and Space-to-select are expected by power users." },
        { title: "Cross-page persistence", body: "When users paginate, their selection should survive the navigation." },
        { title: "Accessibility", body: "Screen readers and keyboard users need aria-selected and focus-visible states." },
      ]}
      libraryRows={[
        { library: "Simple Table for Vue", support: { value: "Built-in (single / multi / checkbox)", tone: "good" }, notes: ":selectable-cells=\"'row'\" + @row-select event." },
        { library: "PrimeVue DataTable", support: { value: "Built-in", tone: "good" }, notes: "v-model:selection + selectionMode='single'|'multiple'." },
        { library: "Vuetify v-data-table", support: { value: "Built-in", tone: "good" }, notes: "v-model + show-select prop." },
        { library: "Element Plus el-table", support: { value: "Built-in", tone: "good" }, notes: "<el-table-column type=\"selection\" /> + @selection-change." },
        { library: "Naive UI n-data-table", support: { value: "Built-in", tone: "good" }, notes: "rowKey + checkedRowKeys + on-update:checked-row-keys." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Vue",
        intro: "Enable selection with the selectableCells prop, listen for @row-select, and combine with sorting / filtering / pinning without extra config.",
                notes: <>Use a stable identifier (database id, GUID) when tracking selection across pagination. Indexes break when filters or sorts change.</>,
      }}
      pitfalls={[
        { title: "Tracking by index breaks", problem: "When users sort or filter, the same index points to a different row.", solution: "Always key selection by a stable identifier (id / uuid)." },
        { title: "Tiny touch targets", problem: "Checkboxes are too small on phones, users miss-tap.", solution: "Provide at least 44x44px touch targets. Simple Table's checkbox column does this." },
        { title: "Unintended row toggles on cell click", problem: "Clicking a button inside a row also selects the row.", solution: "Stop propagation on clickable cell renderers, or use selectableCells=\"row\" with a dedicated checkbox column." },
        { title: "Lost selection on data refetch", problem: "After polling refresh, selection clears.", solution: "Reapply your stable-id Set after data refresh, or use immutable updates." },
      ]}
      faqs={[
        { question: "Can I support Shift-click range selection?", answer: "Yes—Simple Table handles range selection out of the box. Shift-click selects the range from anchor to current row." },
        { question: "How do I select all rows on a page?", answer: "Add a checkbox in the header cell renderer that toggles every row currently in view." },
        { question: "Is selection accessible?", answer: "Yes. Simple Table sets aria-selected on rows and supports keyboard navigation (Space to toggle, arrow keys to move focus)." },
      ]}
      conclusionParagraphs={[
        "Row selection in Vue 3 is a single prop and event handler in Simple Table. PrimeVue and Vuetify also support it natively; Element Plus and Naive UI do too.",
        "Always key selection by stable identifier and provide proper touch targets. Combine with virtualization and pinning for large datasets.",
      ]}
      relatedLinks={[
        { href: "/blog/vue-nuxt-data-grid-simple-table", label: "Pillar guide: best free Vue / Nuxt data grid in 2026" },
        { href: "/docs/row-selection", label: "Row selection documentation" },
        { href: "/frameworks/vue", label: "Vue integration hub" },
      ]}
      ctaTitle="Add row selection to your Vue 3 grid"
      ctaDescription="Simple Table for Vue ships single, multi, and checkbox selection in one MIT package—~70 kB gzipped, Composition-API-friendly, Nuxt-ready."
      docsHref="/docs/row-selection"
    />
  );
}
