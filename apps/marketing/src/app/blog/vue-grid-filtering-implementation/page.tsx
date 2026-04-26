import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { vueGridFilteringPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: vueGridFilteringPost.title,
  description: vueGridFilteringPost.description,
  keywords:
    "vue 3 grid filtering, vue table column filter, vuetify search, primevue filter, custom filter predicate vue, simple table vue, composition api",
  openGraph: {
    title: vueGridFilteringPost.title,
    description: vueGridFilteringPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: vueGridFilteringPost.title,
    description: vueGridFilteringPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${vueGridFilteringPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={vueGridFilteringPost.slug}
      title={vueGridFilteringPost.title}
      subtitle="Column filters, quick search, and custom predicates for Vue 3 data grids—idiomatic Composition API examples for Simple Table for Vue and a comparison to PrimeVue, Vuetify, and Element Plus."
      framework="vue"
      heroBadges={["Vue 3", "Tutorial", "Filtering"]}
      datePublished={vueGridFilteringPost.createdAt}
      dateModified={vueGridFilteringPost.updatedAt}
      introParagraphs={[
        "Filtering is the bread-and-butter feature users hit before sorting or even rendering all rows. Get the typing wrong (string vs number vs date) and your filter UX feels broken.",
        "This tutorial walks through column filters, a global quick filter, and custom predicates for Vue 3 data grids and shows the Simple Table for Vue setup with the Composition API.",
        "If you also need pinning, virtualization, and grouping with aggregations alongside filtering, Simple Table for Vue ships them all in one MIT package.",
      ]}
      whyItMatters={[
        { title: "Faster discovery", body: "Users find rows by typing or selecting; they don't scan thousands of rows visually." },
        { title: "Type-aware filtering", body: "Strings need contains/equals; numbers need >, <, between; dates need calendar pickers." },
        { title: "Combinable with sort/group", body: "Filter, then sort, then group. The order matters for performance and UX." },
        { title: "Server vs client", body: "Small datasets filter client-side; large ones round-trip to the server. Both are common." },
      ]}
      libraryRows={[
        { library: "Simple Table for Vue", support: { value: "Built-in column filters + quick filter", tone: "good" }, notes: ":filterable=\"true\" + type-aware predicates; :quick-filter for global search." },
        { library: "PrimeVue DataTable", support: { value: "Built-in", tone: "good" }, notes: ":filters=\"...\" with matchMode and <Column filter>." },
        { library: "Vuetify v-data-table", support: { value: "Built-in (basic)", tone: "neutral" }, notes: "v-model:search filters globally; per-column requires custom filter prop." },
        { library: "Element Plus el-table", support: { value: "Limited", tone: "neutral" }, notes: ":filters on columns; only enum-style filtering, no quick search." },
        { library: "Naive UI n-data-table", support: { value: "Built-in", tone: "good" }, notes: "filter / filterOptions per column." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Vue",
        intro: "Set filterable=\"true\" globally or per-column for built-in filter chips. Add a quick-search input and bind it via :quick-filter. Plug in custom predicates for advanced cases.",
                notes: <>For 100k+ rows, debounce the quick-filter input by 150-250ms (use <code>useDebounce</code> from VueUse), or filter server-side via a watcher.</>,
      }}
      pitfalls={[
        { title: "String filtering on numbers", problem: "Sorting and filtering treat \"10\" < \"2\" because they're strings.", solution: "Set the column type='number' so type-aware predicates kick in." },
        { title: "Filter resets on data refetch", problem: "Polling refresh wipes the user's filter input.", solution: "Hold the filter value in a ref at the parent, not inside the table; pass it back in via :quick-filter." },
        { title: "Slow on every keystroke", problem: "Filtering 50k rows on every keystroke janks.", solution: "Debounce input by 150-250ms or filter server-side." },
        { title: "Date strings aren't filterable", problem: "ISO strings sort/filter alphabetically, which breaks for dates.", solution: "Set type='date' (or pass Date objects) so the grid knows to compare temporally." },
      ]}
      faqs={[
        { question: "Can I filter server-side?", answer: "Yes. Watch the user's filter ref in your component, fetch filtered rows from the API, and pass the result back in." },
        { question: "What about advanced filters (between, OR, NOT)?", answer: "Render a filter UI above the grid for OR / multi-value cases and pre-filter rows in your component." },
        { question: "Does filtering combine with virtualization?", answer: "Yes. The filtered row set is what the virtualizer renders, so 1M-row datasets remain smooth after filtering." },
      ]}
      conclusionParagraphs={[
        "Filtering in Vue 3 is a single prop on Simple Table. PrimeVue and Naive UI cover it natively; Vuetify only does global search by default.",
        "Always set the right column type so type-aware predicates work, debounce on large datasets, and consider server-side filtering for 100k+ rows.",
      ]}
      relatedLinks={[
        { href: "/blog/vue-nuxt-data-grid-simple-table", label: "Pillar guide: best free Vue / Nuxt data grid in 2026" },
        { href: "/docs/column-filtering", label: "Column filtering documentation" },
        { href: "/frameworks/vue", label: "Vue integration hub" },
      ]}
      ctaTitle="Add filtering to your Vue 3 grid"
      ctaDescription="Simple Table for Vue ships column filters, quick filter, and custom predicates in one MIT package—~70 kB gzipped, Composition-API-friendly."
      docsHref="/docs/column-filtering"
    />
  );
}
