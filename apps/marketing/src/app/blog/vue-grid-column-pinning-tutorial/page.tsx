import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { vueGridColumnPinningPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: vueGridColumnPinningPost.title,
  description: vueGridColumnPinningPost.description,
  keywords:
    "vue 3 column pinning, freeze columns vue, sticky columns vue table, primevue frozen columns, element plus fixed columns, simple table vue",
  openGraph: {
    title: vueGridColumnPinningPost.title,
    description: vueGridColumnPinningPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: vueGridColumnPinningPost.title,
    description: vueGridColumnPinningPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${vueGridColumnPinningPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={vueGridColumnPinningPost.slug}
      title={vueGridColumnPinningPost.title}
      subtitle="Pin Vue 3 table columns to the left or right with sticky headers—idiomatic Composition API examples for Simple Table for Vue and a comparison to PrimeVue, Element Plus, and Vuetify."
      framework="vue"
      heroBadges={["Vue 3", "Tutorial", "Column Pinning"]}
      datePublished={vueGridColumnPinningPost.createdAt}
      dateModified={vueGridColumnPinningPost.updatedAt}
      introParagraphs={[
        "Wide tables with 20+ columns become unusable without pinning. Users lose context as they scroll horizontally—what row am I on? Pin the identifier column on the left and an actions column on the right and the UX clicks back into place.",
        "This tutorial walks through column pinning patterns for Vue 3 data grids and shows the Simple Table for Vue setup with the Composition API.",
        "If you also need virtualization, grouping with aggregations, and inline editing alongside pinning, Simple Table for Vue is the focused MIT pick.",
      ]}
      whyItMatters={[
        { title: "Context anchoring", body: "Users don't lose track of what row they're on as they scroll horizontally." },
        { title: "Action accessibility", body: "Pin Edit / Delete / Open buttons on the right so they're always within reach." },
        { title: "Wide-table support", body: "30+ columns become navigable when key columns stay sticky." },
        { title: "Excel-like ergonomics", body: "Power users expect Freeze Panes; pinning delivers the same affordance." },
      ]}
      libraryRows={[
        { library: "Simple Table for Vue", support: { value: "Built-in (left + right)", tone: "good" }, notes: "pinned: 'left' | 'right' on HeaderObject; sticky on horizontal scroll." },
        { library: "PrimeVue DataTable", support: { value: "Built-in", tone: "good" }, notes: "frozen prop on <Column>; alignFrozen='left'|'right'." },
        { library: "Element Plus el-table", support: { value: "Built-in", tone: "good" }, notes: "<el-table-column fixed=\"left\" /> or fixed=\"right\"." },
        { library: "Vuetify v-data-table", support: { value: "Manual", tone: "bad" }, notes: "No native sticky columns; use position: sticky CSS yourself." },
        { library: "Naive UI n-data-table", support: { value: "Built-in", tone: "good" }, notes: "fixed: 'left' | 'right' on column defs." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Vue",
        intro: "Set pinned: 'left' or pinned: 'right' on individual HeaderObjects. Simple Table handles z-index, sticky positioning, and shadow indicators automatically.",
                notes: <>Keep pinned columns narrow (under ~30% of viewport) so the scrolling area stays usable. Combine with <code>columnResizing</code> if users should be able to resize pinned columns.</>,
      }}
      pitfalls={[
        { title: "Too many pinned columns", problem: "Users pin 8 of 12 columns; the scrolling area becomes useless.", solution: "Cap pinned columns at 2-3 each side, or warn the user beyond a threshold." },
        { title: "Pinned column width mismatch", problem: "Resizing a pinned column doesn't update the sticky offset.", solution: "Pick a library that handles offset recalculation on resize. Simple Table does this automatically." },
        { title: "Z-index battles with editors / dropdowns", problem: "Cell editors render below the pinned column, getting clipped.", solution: "Render editors / popovers in a portal at the document root (use <Teleport to=\"body\">)." },
        { title: "Mobile horizontal scroll feels broken", problem: "Pinned columns over-fill the viewport on small screens.", solution: "Conditionally disable pinning at < 768px (use VueUse's useMediaQuery)." },
      ]}
      faqs={[
        { question: "Can users reorder pinned columns?", answer: "Yes—Simple Table supports column reordering, including across the pinned/unpinned boundary. Set columnReordering=\"true\"." },
        { question: "What about pinning rows (not just columns)?", answer: "Row pinning is on the roadmap. Until then, render pinned rows in a separate header / footer slot." },
        { question: "Does pinning work with virtualization?", answer: "Yes. The pinned columns are rendered separately from the virtualized scroll area; performance is unchanged for 1M rows." },
      ]}
      conclusionParagraphs={[
        "Column pinning in Vue 3 is a single property on Simple Table. PrimeVue, Element Plus, and Naive UI support it natively too; Vuetify requires manual sticky CSS.",
        "Cap the number of pinned columns and disable pinning on small viewports to keep the scrolling area usable.",
      ]}
      relatedLinks={[
        { href: "/blog/vue-nuxt-data-grid-simple-table", label: "Pillar guide: best free Vue / Nuxt data grid in 2026" },
        { href: "/docs/column-pinning", label: "Column pinning documentation" },
        { href: "/frameworks/vue", label: "Vue integration hub" },
      ]}
      ctaTitle="Add column pinning to your Vue 3 grid"
      ctaDescription="Simple Table for Vue ships left/right pinning, virtualization, and grouping in one MIT package—~70 kB gzipped, Composition-API-friendly."
      docsHref="/docs/column-pinning"
    />
  );
}
