import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { vueTableColumnResizingPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: vueTableColumnResizingPost.title,
  description: vueTableColumnResizingPost.description,
  keywords:
    "vue 3 column resizing, vue table resizable columns, vuetify column resize, primevue column resize, simple table vue, composition api table",
  openGraph: {
    title: vueTableColumnResizingPost.title,
    description: vueTableColumnResizingPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: vueTableColumnResizingPost.title,
    description: vueTableColumnResizingPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${vueTableColumnResizingPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={vueTableColumnResizingPost.slug}
      title={vueTableColumnResizingPost.title}
      subtitle="Resizable columns are essential for data-heavy Vue 3 apps. This guide walks through implementation, library trade-offs, and pitfalls—with Composition API code samples for Simple Table for Vue and a comparison to Vuetify, PrimeVue, and Element Plus."
      framework="vue"
      heroBadges={["Vue 3", "Tutorial", "Column Resizing"]}
      datePublished={vueTableColumnResizingPost.createdAt}
      dateModified={vueTableColumnResizingPost.updatedAt}
      introParagraphs={[
        "Column resizing is one of those features users miss only when it's gone. The moment a content cell truncates with an ellipsis, somebody reaches for the column edge and tries to drag.",
        "This tutorial walks through column resizing patterns for the Vue 3 data grid landscape and shows the Simple Table for Vue setup with the Composition API.",
        "If you also need pinning, virtualization, and grouping with aggregations, Simple Table for Vue ships them all in one MIT package—~70 kB gzipped, Composition-API-friendly.",
      ]}
      whyItMatters={[
        { title: "Density vs scannability", body: "Users adjust columns to suit their screen and the row data they're scanning—you don't have to guess for them." },
        { title: "Excel-like ergonomics", body: "Power users expect drag-handle resizing on column edges; without it, the grid feels broken." },
        { title: "Pinned-column compatibility", body: "Resizing a pinned column has to recalc the sticky offset; a quality grid handles this for you." },
        { title: "Persisting widths", body: "Many teams need user-customized layouts persisted to localStorage or the server." },
      ]}
      libraryRows={[
        { library: "Simple Table for Vue", support: { value: "Built-in", tone: "good" }, notes: ":column-resizing=\"true\" + auto-expand keeps total width pinned." },
        { library: "Vuetify v-data-table", support: { value: "Manual", tone: "bad" }, notes: "No native resize—use v-resize directive or community plugins." },
        { library: "PrimeVue DataTable", support: { value: "Built-in", tone: "good" }, notes: ":resizableColumns=\"true\" + columnResizeMode=\"fit\" / \"expand\"." },
        { library: "Element Plus el-table", support: { value: "Limited", tone: "neutral" }, notes: "Only via :border=\"true\" with manual width tracking." },
        { library: "Naive UI n-data-table", support: { value: "Built-in", tone: "good" }, notes: ":resizable=\"true\" on individual columns." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Vue",
        intro: "Enable column resizing with a single prop on the <SimpleTable> component. Pair with auto-expand to keep total width pinned to the container.",
                notes: <>Combine <code>columnResizing</code> with <code>autoExpandColumns</code> to keep the table flush with the container; remove auto-expand to allow horizontal scrolling.</>,
      }}
      pitfalls={[
        { title: "Layout shift on resize", problem: "Content next to the table jumps as users resize.", solution: "Wrap the grid in a container with a fixed width or max-width." },
        { title: "Resize handles too narrow on touch", problem: "Mobile users can't grab the 4px column edge.", solution: "Use a library that auto-widens handles for touch (Simple Table does this)." },
        { title: "Resizing breaks pinned columns", problem: "Sticky offsets get out of sync.", solution: "Use a grid that recalculates pinned offsets on resize—Simple Table does this automatically." },
        { title: "Widths aren't persisted", problem: "User layouts vanish on refresh.", solution: "Watch headers for changes and store widths in localStorage or your user-prefs API." },
      ]}
      faqs={[
        { question: "Can I disable resizing per column?", answer: "Yes—set isResizable: false on individual HeaderObject entries." },
        { question: "Does it work with virtualization?", answer: "Yes. Virtualized 1M-row tables resize columns at 60fps." },
        { question: "How do I sync widths to the server?", answer: "Watch headers in your component and PATCH user preferences on debounce." },
      ]}
      conclusionParagraphs={[
        "Column resizing in Vue 3 is a one-line prop on Simple Table. PrimeVue and Naive UI ship it natively too; Vuetify and Element Plus require manual wiring.",
        "If you need resize alongside virtualization, pinning, and grouping, Simple Table for Vue is the focused MIT pick—~70 kB gzipped.",
      ]}
      relatedLinks={[
        { href: "/blog/vue-nuxt-data-grid-simple-table", label: "Pillar guide: best free Vue / Nuxt data grid in 2026" },
        { href: "/docs/column-resizing", label: "Column resizing documentation" },
        { href: "/frameworks/vue", label: "Vue integration hub" },
      ]}
      ctaTitle="Add column resizing to your Vue 3 grid"
      ctaDescription="Simple Table for Vue ships resize, pinning, grouping, and editing in one MIT package—~70 kB gzipped, Composition-API-friendly, Nuxt-ready."
      docsHref="/docs/column-resizing"
    />
  );
}
