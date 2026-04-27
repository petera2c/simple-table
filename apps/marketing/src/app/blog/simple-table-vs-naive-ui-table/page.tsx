import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableVsNaiveUiTablePost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableVsNaiveUiTablePost.title,
  description: simpleTableVsNaiveUiTablePost.description,
  keywords:
    "naive ui alternative, naive ui data table alternative, n-data-table replacement, vue 3 data grid, simple table vue, mit vue table, composition api data grid",
  openGraph: {
    title: simpleTableVsNaiveUiTablePost.title,
    description: simpleTableVsNaiveUiTablePost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableVsNaiveUiTablePost.title,
    description: simpleTableVsNaiveUiTablePost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableVsNaiveUiTablePost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableVsNaiveUiTablePost.slug}
      title={simpleTableVsNaiveUiTablePost.title}
      subtitle="Naive UI's n-data-table is a polished, TypeScript-first Vue 3 component library grid. If you don't already use the rest of Naive UI, Simple Table for Vue is a focused MIT alternative—same virtualization, pinning, grouping, and editing without the design system."
      competitorName="Naive UI Data Table"
      framework="vue"
      heroBadges={["Comparison", "Bundle size", "Decision Guide"]}
      datePublished={simpleTableVsNaiveUiTablePost.createdAt}
      dateModified={simpleTableVsNaiveUiTablePost.updatedAt}
      introParagraphs={[
        "Naive UI is one of the most pleasant Vue 3 component libraries—TypeScript-first, themeable, well-designed. n-data-table is its grid component: feature-rich and idiomatic for Composition API.",
        "If Naive UI is already your design system, you'll keep n-data-table. If you're pulling Naive UI in for the table specifically, Simple Table for Vue is the focused alternative: an MIT-licensed Vue 3 data grid that runs in <script setup>, Nuxt 3, and Nuxt 4 without the rest of the suite.",
        "This article compares both on bundle, virtualization, grouping with aggregations, editing, and Vue 3 ergonomics.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "MIT", tone: "good" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Vue 3 + TypeScript", competitor: { value: "Yes (TS-first)", tone: "good" }, simpleTable: { value: "Yes (TS-first)", tone: "good" } },
        { feature: "Composition API + <script setup>", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes (idiomatic)", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "150–300 kB (suite + theme)", tone: "neutral" }, simpleTable: { value: "~70 kB", tone: "good" } },
        { feature: "Row virtualization", competitor: { value: "virtual-scroll prop", tone: "good" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Column pinning", competitor: { value: "fixed: 'left' / 'right'", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row grouping with aggregations", competitor: { value: "Tree mode (manual aggregations)", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "Slot-based", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Theming", competitor: { value: "Theme overrides API", tone: "good" }, simpleTable: { value: "CSS variables, BYO", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Stay with Naive UI when…",
          items: [
            "Naive UI is your design system across the app.",
            "Your team values the integrated theme overrides API.",
            "You use other Naive UI components heavily (forms, dialogs, layout).",
            "n-data-table's existing feature set covers your use cases.",
          ],
        },
        simpleTable: {
          title: "Switch to Simple Table for Vue when…",
          items: [
            "Naive UI is pulled in just for n-data-table.",
            "You want grouping with aggregations and inline editing as built-in primitives.",
            "You want a smaller bundle (~70 kB) without dropping virtualization.",
            "You also build React / Angular / Svelte / Solid surfaces and want a shared engine.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🎨",
          title: "Naive UI design system",
          body: "Naive UI provides forms, dialogs, layout, and the table.",
          recommendation: "competitor",
          recommendationLabel: "Stay with n-data-table—the suite's coherent.",
        },
        {
          emoji: "📦",
          title: "Just need the grid",
          body: "Naive UI was added for n-data-table; nothing else uses it heavily.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table—drop the suite.",
        },
        {
          emoji: "📈",
          title: "Reporting view with aggregations",
          body: "Group by region with sum/avg footers, virtualize 50k rows.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table—aggregations are first-class.",
        },
      ]}
      faqs={[
        { question: "Is Naive UI a good Vue library?", answer: "Yes—TypeScript-first, well-themed, and pleasant. The question isn't quality but scope: do you need the whole suite or just the grid?" },
        { question: "How big is the migration?", answer: "A few hours per table. Map column definitions to HeaderObjects and convert render functions to cellRenderers." },
        { question: "Does Simple Table support tree data?", answer: "Yes. Expandable / nested rows with virtualization are built in." },
      ]}
      conclusionParagraphs={[
        "Naive UI's n-data-table is excellent if you're using Naive UI broadly. Simple Table for Vue wins when the grid is what you actually need and the rest of the suite isn't pulling weight.",
        "Both are MIT, both are Vue 3-native, both are TypeScript-first. The choice is scope and feature set.",
      ]}
      relatedLinks={[
        { href: "/blog/vue-nuxt-data-grid-simple-table", label: "Pillar guide: the best free Vue / Nuxt data grid in 2026" },
        { href: "/blog/ag-grid-alternatives-free-vue-data-grids-2026", label: "Best free Vue 3 data grids in 2026" },
        { href: "/frameworks/vue", label: "Vue integration hub" },
      ]}
      ctaTitle="Need the grid, not the suite?"
      ctaDescription="Simple Table for Vue ships virtualization, pinning, grouping, and editing in one MIT package—~70 kB gzipped, idiomatic Vue 3."
    />
  );
}
