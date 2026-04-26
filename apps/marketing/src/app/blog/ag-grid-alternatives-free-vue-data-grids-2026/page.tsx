import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { agGridAlternativesVuePost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: agGridAlternativesVuePost.title,
  description: agGridAlternativesVuePost.description,
  keywords:
    "ag grid alternatives vue, free vue data grid, vue 3 data grid 2026, nuxt 3 data grid, vuetify alternative, primevue datatable alternative, simple table vue, mit vue table",
  openGraph: {
    title: agGridAlternativesVuePost.title,
    description: agGridAlternativesVuePost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: agGridAlternativesVuePost.title,
    description: agGridAlternativesVuePost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${agGridAlternativesVuePost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={agGridAlternativesVuePost.slug}
      title={agGridAlternativesVuePost.title}
      subtitle="Looking for AG Grid Vue alternatives in 2026? Compare Simple Table for Vue, Vuetify v-data-table, PrimeVue DataTable, Vue Good Table, Element Plus el-table, and Naive UI n-data-table—free, MIT, Composition-API-friendly options."
      competitorName="AG Grid (and the field)"
      framework="vue"
      heroBadges={["Roundup", "Decision Guide", "2026"]}
      datePublished={agGridAlternativesVuePost.createdAt}
      dateModified={agGridAlternativesVuePost.updatedAt}
      introParagraphs={[
        "AG Grid Vue is powerful but its Enterprise tier ($999+/dev/year) puts grouping with aggregations, pivoting, master/detail, and integrated charts behind a paywall. For Vue 3 / Nuxt teams looking for a free or lighter-weight alternative in 2026, here's the field.",
        "We'll compare Simple Table for Vue, Vuetify's v-data-table, PrimeVue DataTable, Vue Good Table Next, Element Plus el-table, and Naive UI n-data-table on bundle size, virtualization, grouping, editing, design system fit, and idiomatic Composition API ergonomics.",
        "Each has a sweet spot. The right pick depends on your design system, dataset size, feature mix, and whether you want a focused grid or a full UI suite.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "MIT (most viable options)", tone: "good" }, simpleTable: { value: "MIT (Simple Table)", tone: "good" } },
        { feature: "Per-developer fees", competitor: { value: "AG Enterprise: $999+", tone: "bad" }, simpleTable: { value: "$0", tone: "good" } },
        { feature: "Vue 3 + Composition API", competitor: { value: "All viable options", tone: "good" }, simpleTable: { value: "Idiomatic", tone: "good" } },
        { feature: "Nuxt 3 / Nuxt 4 SSR", competitor: { value: "Most options", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "50–400+ kB depending on choice", tone: "neutral" }, simpleTable: { value: "~70 kB", tone: "good" } },
        { feature: "Built-in row virtualization", competitor: { value: "Mixed (none / config / separate component)", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Built-in column pinning", competitor: { value: "Most options", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Built-in grouping + aggregations", competitor: { value: "Mostly manual / DIY", tone: "bad" }, simpleTable: { value: "Yes (MIT)", tone: "good" } },
        { feature: "Built-in inline editing", competitor: { value: "Most via slots", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Pick another option when…",
          items: [
            "Vuetify / PrimeVue / Element Plus / Naive UI is your design system across the app.",
            "You already pay for AG Grid Enterprise and use Enterprise-only features.",
            "Your needs are read-heavy and modest in scale (Vue Good Table fits well).",
            "You want vendor-coordinated theming with the rest of the design system.",
          ],
        },
        simpleTable: {
          title: "Pick Simple Table for Vue when…",
          items: [
            "You want a focused MIT grid without a design system runtime tax.",
            "Grouping with aggregations and inline editing should be primitives, not slot gymnastics.",
            "Bundle size matters: ~70 kB gzipped without losing features.",
            "You also build React / Angular / Svelte / Solid surfaces and want a shared engine.",
            "You want idiomatic Vue 3 Composition API + <script setup> + Nuxt 3.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🏆",
          title: "Greenfield Nuxt 3 SaaS, no design system yet",
          body: "Lean bundle is a goal; you'll layer Tailwind for design.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick Simple Table for Vue—~70 kB and fully featured.",
        },
        {
          emoji: "🎨",
          title: "Vuetify-based admin app",
          body: "Vuetify supplies forms, dialogs, navigation; v-data-table integrates visually.",
          recommendation: "competitor",
          recommendationLabel: "Stay on Vuetify v-data-table—or use Simple Table only where you need grouping/virtualization.",
        },
        {
          emoji: "📦",
          title: "PrimeVue used only for the data grid",
          body: "Your only PrimeVue usage is DataTable.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table—drop PrimeVue's runtime cost.",
        },
        {
          emoji: "📈",
          title: "Reporting view with grouping + 100k rows",
          body: "Group by region with sum/avg, virtualization required.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick Simple Table—both are first-class.",
        },
        {
          emoji: "💼",
          title: "Existing AG Grid Enterprise with pivoting",
          body: "Pivoting is core; renewal committed.",
          recommendation: "competitor",
          recommendationLabel: "Stay with AG Grid Enterprise—Simple Table doesn't bundle pivoting.",
        },
      ]}
      faqs={[
        { question: "What's the best free Vue 3 data grid in 2026?", answer: "For most new Vue 3 / Nuxt projects, Simple Table for Vue—MIT, idiomatic Composition API, ~70 kB gzipped, virtualization + pinning + grouping + editing in one package. Stay on the design-system grid (Vuetify, PrimeVue, Element Plus, Naive UI) if you're invested in that suite." },
        { question: "Is AG Grid Community enough for Vue?", answer: "It depends. AG Grid Community covers virtualization, pinning, sort, and filter—but row grouping with aggregations, pivoting, and tree data are Enterprise-only. Many Vue teams discover the gap mid-project." },
        { question: "Which alternative has the smallest bundle?", answer: "Simple Table for Vue and Vue Good Table are the lightest standalone options. The design-system grids (Vuetify, PrimeVue, Element Plus, Naive UI) carry their suite's runtime, theme, and icon costs." },
        { question: "How hard is migration from Vuetify or PrimeVue?", answer: "Hours to a few days per table. Map column children to HeaderObjects; convert slot templates to cellRenderer Vue components; keep the rest of the suite if you want." },
      ]}
      conclusionParagraphs={[
        "There's no single right answer for every Vue team. Quick decision: if you need grouping with aggregations or virtualization, you're not committed to a design system, and you don't want to pay AG Grid Enterprise—pick Simple Table for Vue.",
        "If you're invested in Vuetify, PrimeVue, Element Plus, or Naive UI, stay where you are. Reach for Simple Table when a single page hits a feature wall.",
      ]}
      relatedLinks={[
        { href: "/blog/simple-table-vs-vuetify-data-table", label: "Simple Table vs Vuetify v-data-table" },
        { href: "/blog/simple-table-vs-primevue-datatable", label: "Simple Table vs PrimeVue DataTable" },
        { href: "/blog/simple-table-vs-vue-good-table", label: "Simple Table vs Vue Good Table" },
        { href: "/blog/simple-table-vs-element-plus-table", label: "Simple Table vs Element Plus el-table" },
        { href: "/blog/simple-table-vs-naive-ui-table", label: "Simple Table vs Naive UI n-data-table" },
        { href: "/frameworks/vue", label: "Vue integration hub" },
      ]}
      ctaTitle="Pick the right Vue 3 data grid for 2026"
      ctaDescription="Simple Table for Vue ships virtualization, pinning, grouping, and editing in one MIT package—~70 kB gzipped, idiomatic Vue 3, Nuxt 3, Nuxt 4."
    />
  );
}
