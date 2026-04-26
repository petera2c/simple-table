import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableVsVueGoodTablePost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableVsVueGoodTablePost.title,
  description: simpleTableVsVueGoodTablePost.description,
  keywords:
    "vue good table alternative, vue good table next, vue 3 data grid, simple table vue, mit vue table, composition api data grid",
  openGraph: {
    title: simpleTableVsVueGoodTablePost.title,
    description: simpleTableVsVueGoodTablePost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableVsVueGoodTablePost.title,
    description: simpleTableVsVueGoodTablePost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableVsVueGoodTablePost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableVsVueGoodTablePost.slug}
      title={simpleTableVsVueGoodTablePost.title}
      subtitle="Vue Good Table is straightforward and works well for read-heavy tables. Once you need row virtualization, column pinning, or grouping with aggregations, Simple Table for Vue is the focused MIT alternative."
      competitorName="Vue Good Table Next"
      framework="vue"
      heroBadges={["Comparison", "Decision Guide"]}
      datePublished={simpleTableVsVueGoodTablePost.createdAt}
      dateModified={simpleTableVsVueGoodTablePost.updatedAt}
      introParagraphs={[
        "Vue Good Table (and its Vue 3 successor, vue-good-table-next) is a popular, friendly Vue table component. It's a sensible default when you want sort, paginate, search, and custom cells without much fuss.",
        "Where it shows its age: row virtualization, column pinning, and grouping with aggregations either aren't first-class or require a fair amount of manual work. Simple Table for Vue ships those features in one MIT-licensed Vue 3 package.",
        "This article compares the two on bundle, virtualization, grouping, editing, and idiomatic Vue 3 ergonomics so you can decide if Simple Table for Vue is the better fit.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "MIT", tone: "good" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Vue 3 support", competitor: { value: "Yes (vue-good-table-next)", tone: "good" }, simpleTable: { value: "Yes (idiomatic)", tone: "good" } },
        { feature: "Composition API + <script setup>", competitor: { value: "Workable", tone: "neutral" }, simpleTable: { value: "First-class", tone: "good" } },
        { feature: "Row virtualization", competitor: { value: "No", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Column virtualization", competitor: { value: "No", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Column pinning", competitor: { value: "No", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Row grouping with aggregations", competitor: { value: "Manual / DIY", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "Slot-based", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "~50 kB", tone: "good" }, simpleTable: { value: "~70 kB", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Stay with Vue Good Table when…",
          items: [
            "Your needs are read-heavy: sort, paginate, search, custom cells.",
            "Datasets are small (under a few thousand rows) and virtualization isn't needed.",
            "You don't need column pinning or grouping with aggregations.",
            "Your team prefers Vue Good Table's specific theming and slot patterns.",
          ],
        },
        simpleTable: {
          title: "Switch to Simple Table for Vue when…",
          items: [
            "You need row + column virtualization for 10k+ rows.",
            "You want column pinning, grouping with aggregations, and inline editing as built-in primitives.",
            "You want idiomatic Vue 3 Composition API + <script setup>.",
            "You also build React / Angular / Svelte / Solid surfaces and want a shared engine.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "📋",
          title: "Internal admin tables, ~500 rows each",
          body: "Sort, paginate, search, custom cells. No virtualization needed.",
          recommendation: "competitor",
          recommendationLabel: "Stay on Vue Good Table—it's well-suited for this scale.",
        },
        {
          emoji: "📊",
          title: "Reporting tool, 50k+ rows, grouping with aggregations",
          body: "Expanded/collapsed groups with sum and avg footers, virtualization required.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table—virtualization and grouping are built-in.",
        },
        {
          emoji: "🚀",
          title: "Greenfield Vue 3 SaaS",
          body: "New Vue 3 project, want a forward-looking grid that won't outgrow.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick Simple Table for Vue—it scales from 100 to 1M rows without changes.",
        },
        {
          emoji: "🧱",
          title: "Wide table with frozen first columns",
          body: "30+ columns, need to pin the first 2–3 columns.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table—pinning is first-class.",
        },
      ]}
      faqs={[
        { question: "Is Vue Good Table actively maintained?", answer: "vue-good-table-next is the Vue 3 successor; the original vue-good-table is largely Vue 2-era. Activity is moderate; complex use cases sometimes outpace it." },
        { question: "How big is the migration?", answer: "Usually a few hours per table. Map column definitions to HeaderObjects, adapt your rows to Simple Table's row shape, and convert slot-based templates to cellRenderer Vue components." },
        { question: "Does Simple Table support search and global filtering?", answer: "Yes. Column filters are first-class; combine them for global-search-like behavior, or pre-filter rows in your composable." },
      ]}
      conclusionParagraphs={[
        "Vue Good Table is fine for read-heavy admin views with modest row counts. The moment you need virtualization, pinning, or grouping with aggregations, Simple Table for Vue is the focused MIT upgrade.",
        "Both are MIT and Vue 3 compatible. The decision is about feature scope and dataset size, not licensing.",
      ]}
      relatedLinks={[
        { href: "/blog/vue-nuxt-data-grid-simple-table", label: "Pillar guide: the best free Vue / Nuxt data grid in 2026" },
        { href: "/blog/ag-grid-alternatives-free-vue-data-grids-2026", label: "Best free Vue 3 data grids in 2026" },
        { href: "/frameworks/vue", label: "Vue integration hub" },
      ]}
      ctaTitle="Outgrowing Vue Good Table?"
      ctaDescription="Simple Table for Vue ships virtualization, pinning, grouping, and editing in one MIT package—~70 kB gzipped, idiomatic Vue 3."
    />
  );
}
