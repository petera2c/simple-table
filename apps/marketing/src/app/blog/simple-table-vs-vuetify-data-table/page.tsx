import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableVsVuetifyDataTablePost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableVsVuetifyDataTablePost.title,
  description: simpleTableVsVuetifyDataTablePost.description,
  keywords:
    "vuetify data table alternative, v-data-table replacement, vue 3 data grid, nuxt 3 data grid, vuetify alternative, simple table vue, mit vue table, composition api data grid",
  openGraph: {
    title: simpleTableVsVuetifyDataTablePost.title,
    description: simpleTableVsVuetifyDataTablePost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableVsVuetifyDataTablePost.title,
    description: simpleTableVsVuetifyDataTablePost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableVsVuetifyDataTablePost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableVsVuetifyDataTablePost.slug}
      title={simpleTableVsVuetifyDataTablePost.title}
      subtitle="Vuetify v-data-table is fine if you live in Vuetify. Pulling in the entire Vuetify runtime, theme, and Sass for one data grid is a lot. Simple Table for Vue is a focused, MIT-licensed Vue 3 data grid that ships virtualization, pinning, grouping, and editing in ~70 kB."
      competitorName="Vuetify v-data-table"
      framework="vue"
      heroBadges={["Comparison", "Bundle size", "Decision Guide"]}
      datePublished={simpleTableVsVuetifyDataTablePost.createdAt}
      dateModified={simpleTableVsVuetifyDataTablePost.updatedAt}
      introParagraphs={[
        "Vuetify is a complete Material Design system for Vue 3, and v-data-table is its general-purpose grid. If your app is already on Vuetify—forms, dialogs, layout—the table 'just works.'",
        "But many Vue teams reach for Vuetify mainly for the data grid and end up shipping Material Design, Vuetify's theming runtime, and Material Design Icons along for the ride. Simple Table for Vue is the focused alternative: an MIT-licensed Vue 3 data grid in @simple-table/vue, runs in Composition API + <script setup>, Nuxt 3, and Nuxt 4 without a design system tax.",
        "This article compares the two head-to-head: bundle, virtualization, grouping, editing, and the migration path if you decide v-data-table no longer fits.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "MIT", tone: "good" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "200–400+ kB (suite + theme + icons)", tone: "bad" }, simpleTable: { value: "~70 kB", tone: "good" } },
        { feature: "Vue 3 + Composition API + <script setup>", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes (idiomatic)", tone: "good" } },
        { feature: "Nuxt 3 / Nuxt 4 SSR", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row + column virtualization", competitor: { value: "Partial (virtual mode)", tone: "neutral" }, simpleTable: { value: "Yes (built-in)", tone: "good" } },
        { feature: "Column pinning (left / right)", competitor: { value: "Manual / partial", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Row grouping with aggregations", competitor: { value: "Group by + manual aggregations", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "v-slot:item.<key>", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Theming", competitor: { value: "Vuetify theme system (Material)", tone: "neutral" }, simpleTable: { value: "CSS variables, BYO", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Stay with v-data-table when…",
          items: [
            "You use Vuetify widely (forms, dialogs, layout, charts).",
            "Material Design is the design system across your app.",
            "Your team is invested in Vuetify slot patterns and Material Design Icons.",
            "You need Vuetify-specific components (data iterator, expansion panels) tightly integrated with the table.",
          ],
        },
        simpleTable: {
          title: "Switch to Simple Table for Vue when…",
          items: [
            "You pulled in Vuetify mainly for v-data-table—you can drop the rest.",
            "You want true row + column virtualization for 100k+ rows.",
            "You want column pinning, grouping with aggregations, and inline editing as built-in primitives.",
            "Bundle size matters—target ~70 kB instead of 200–400+ kB.",
            "You also build React / Angular / Svelte / Solid surfaces and want a shared engine.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🎨",
          title: "Vuetify-first Material Design app",
          body: "Vuetify is the design system; data grid should match Material density and tokens natively.",
          recommendation: "competitor",
          recommendationLabel: "Stay with v-data-table—keep the Material coherence.",
        },
        {
          emoji: "📦",
          title: "Vuetify pulled in mainly for the table",
          body: "You added Vuetify specifically for v-data-table; the rest of the app is plain Vue + Tailwind.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table—you'll save 200–400 kB and simplify your build.",
        },
        {
          emoji: "🚀",
          title: "Greenfield Nuxt 3 / Nuxt 4 SaaS",
          body: "New Nuxt project, lean bundle is non-negotiable.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick Simple Table for Vue—idiomatic Composition API, ~70 kB gzipped.",
        },
        {
          emoji: "📈",
          title: "Reporting tool with grouping + aggregations across 100k rows",
          body: "Need expanded/collapsed groups with sum and avg footers, plus row virtualization.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table—grouping with aggregations is built-in alongside virtualization.",
        },
      ]}
      faqs={[
        { question: "Can I keep Vuetify for the rest of my app?", answer: "Yes. Many teams swap only v-data-table for Simple Table while keeping Vuetify for forms, dialogs, and layout. They coexist fine." },
        { question: "Does Simple Table support Nuxt SSR?", answer: "Yes. @simple-table/vue ships ESM and works with Nuxt 3 and Nuxt 4 out of the box, including SSR." },
        { question: "How big is the migration?", answer: "Usually a few hours to a few days. Map Vuetify headers to Simple Table HeaderObjects (title→label, key→accessor), adapt your items to Simple Table's row shape, and convert v-slot:item.<key> templates to cellRenderer Vue components." },
        { question: "Will I lose Material Design styling?", answer: "Not entirely. Theme Simple Table via CSS variables to match Material density and tokens. The visual outcome can be very close." },
      ]}
      conclusionParagraphs={[
        "Vuetify v-data-table is the right call when Vuetify is your design system. If v-data-table is the only Vuetify component you actually use, Simple Table for Vue gives you a focused, smaller, idiomatic Vue 3 data grid for the same MIT cost.",
        "Migrate one screen at a time, keep Vuetify for the rest of the app, and watch your bundle drop by 200–400 kB.",
      ]}
      relatedLinks={[
        { href: "/comparisons/simple-table-vs-vuetify", label: "Detailed comparison: Simple Table vs Vuetify v-data-table" },
        { href: "/migrations/from-vuetify-data-table", label: "Migration guide: from Vuetify v-data-table" },
        { href: "/blog/vue-nuxt-data-grid-simple-table", label: "Pillar guide: the best free Vue / Nuxt data grid in 2026" },
        { href: "/frameworks/vue", label: "Vue integration hub" },
      ]}
      ctaTitle="Drop the Vuetify runtime, keep the data grid"
      ctaDescription="Simple Table for Vue ships virtualization, pinning, grouping, and editing in one MIT package—~70 kB gzipped, idiomatic for Vue 3, Nuxt 3, and Nuxt 4."
    />
  );
}
