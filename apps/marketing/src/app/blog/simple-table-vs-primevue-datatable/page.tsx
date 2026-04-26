import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableVsPrimeVueDatatablePost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableVsPrimeVueDatatablePost.title,
  description: simpleTableVsPrimeVueDatatablePost.description,
  keywords:
    "primevue datatable alternative, prime vue alternative, vue 3 data grid, nuxt 3 data grid, primevue vs simple table, simple table vue, mit vue table, composition api data grid",
  openGraph: {
    title: simpleTableVsPrimeVueDatatablePost.title,
    description: simpleTableVsPrimeVueDatatablePost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableVsPrimeVueDatatablePost.title,
    description: simpleTableVsPrimeVueDatatablePost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableVsPrimeVueDatatablePost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableVsPrimeVueDatatablePost.slug}
      title={simpleTableVsPrimeVueDatatablePost.title}
      subtitle="PrimeVue DataTable is a great component for teams already on PrimeVue. If your only PrimeVue usage is the data grid, Simple Table for Vue is a smaller, focused alternative—same virtualization, pinning, grouping, and editing in MIT."
      competitorName="PrimeVue DataTable"
      framework="vue"
      heroBadges={["Comparison", "Bundle size", "Decision Guide"]}
      datePublished={simpleTableVsPrimeVueDatatablePost.createdAt}
      dateModified={simpleTableVsPrimeVueDatatablePost.updatedAt}
      introParagraphs={[
        "PrimeVue is the Vue port of PrimeNG—and DataTable is its flagship grid. It's powerful, well-supported, and 'just works' if PrimeVue is already your design system.",
        "But many Vue 3 teams pull in PrimeVue specifically for DataTable and end up shipping the PrimeVue runtime, a theme (Aura, Lara, Material), and PrimeIcons along with it. Simple Table for Vue is the focused alternative: an MIT-licensed Vue 3 data grid that runs in Composition API, <script setup>, Nuxt 3, and Nuxt 4 without a design system tax.",
        "This article compares Simple Table for Vue against PrimeVue DataTable on bundle size, virtualization, grouping, editing, and developer experience—so you can decide if a focused grid is the better trade.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "MIT", tone: "good" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "200–400+ kB (suite + theme + icons)", tone: "bad" }, simpleTable: { value: "~70 kB", tone: "good" } },
        { feature: "Vue 3 + Composition API + <script setup>", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes (idiomatic)", tone: "good" } },
        { feature: "Nuxt 3 / Nuxt 4 SSR", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row virtualization", competitor: { value: "virtualScrollerOptions (config)", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Column virtualization", competitor: { value: "Partial", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Frozen columns / pinning", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row grouping with aggregations", competitor: { value: "rowGroupMode='subheader' + manual", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "Editor templates", tone: "good" }, simpleTable: { value: "Yes (built-in)", tone: "good" } },
        { feature: "Icon set", competitor: { value: "PrimeIcons required", tone: "neutral" }, simpleTable: { value: "BYO (Lucide / FA / SVG)", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Stay with PrimeVue DataTable when…",
          items: [
            "You already use PrimeVue widely (forms, dialogs, charts, menus).",
            "You've standardized on PrimeVue themes (Aura, Lara, Material) across your app.",
            "Your team is invested in PrimeVue slot patterns and PrimeIcons.",
            "You depend on PrimeVue-specific components like TreeTable, OrderList, or PickList.",
          ],
        },
        simpleTable: {
          title: "Switch to Simple Table for Vue when…",
          items: [
            "PrimeVue DataTable is your only PrimeVue component—you can drop the rest.",
            "You want true virtualization without virtualScrollerOptions wiring.",
            "You want grouping with aggregations and inline editing as built-in primitives, not slot gymnastics.",
            "Bundle size matters—target ~70 kB instead of 200–400+ kB.",
            "You also build React / Angular / Svelte / Solid surfaces and want a shared engine.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🎨",
          title: "PrimeVue Aura design system",
          body: "Your design system extends Aura across forms, dialogs, and DataTable.",
          recommendation: "competitor",
          recommendationLabel: "Stay with PrimeVue DataTable—the visual coherence wins.",
        },
        {
          emoji: "📦",
          title: "PrimeVue used only for the data grid",
          body: "You added PrimeVue specifically for DataTable, kept the rest minimal.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table—you'll cut 200–400 kB.",
        },
        {
          emoji: "🚀",
          title: "Greenfield Nuxt 3 / Nuxt 4 app",
          body: "New project, lean bundle, idiomatic Composition API.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick Simple Table for Vue—~70 kB gzipped, no design system tax.",
        },
        {
          emoji: "📈",
          title: "Reporting view with grouping + 100k rows",
          body: "Need grouping with aggregations and virtualization without manual wiring.",
          recommendation: "simpleTable",
          recommendationLabel: "Choose Simple Table—both are first-class.",
        },
      ]}
      faqs={[
        { question: "Can I keep PrimeVue for forms and switch only the table?", answer: "Yes. Many teams keep PrimeVue for forms / dialogs and switch only the data grid. They coexist fine." },
        { question: "Does Simple Table for Vue work in Nuxt 3 SSR?", answer: "Yes. @simple-table/vue is ESM and SSR-friendly. It works in Nuxt 3 and Nuxt 4 out of the box." },
        { question: "How big is the migration from DataTable?", answer: "Hours to a few days depending on customizations. Replace <Column field='x' header='Y' /> children with HeaderObject entries; convert #body slots to cellRenderer Vue components." },
        { question: "Will I lose PrimeVue's TreeTable?", answer: "Simple Table supports tree data and expandable rows natively. Most TreeTable use cases port over with no functional regressions." },
      ]}
      conclusionParagraphs={[
        "PrimeVue DataTable is the right call if PrimeVue is your design system. Simple Table for Vue wins when DataTable is the only PrimeVue piece you actually need.",
        "You keep your other PrimeVue components if you want, you cut the data grid down to ~70 kB, and you trade slot-template patterns for declarative props with cellRenderers.",
      ]}
      relatedLinks={[
        { href: "/comparisons/simple-table-vs-primevue-datatable", label: "Detailed comparison: Simple Table vs PrimeVue DataTable" },
        { href: "/migrations/from-primevue-datatable", label: "Migration guide: from PrimeVue DataTable" },
        { href: "/blog/vue-nuxt-data-grid-simple-table", label: "Pillar guide: the best free Vue / Nuxt data grid in 2026" },
        { href: "/frameworks/vue", label: "Vue integration hub" },
      ]}
      ctaTitle="Drop the PrimeVue runtime, keep the data grid"
      ctaDescription="Simple Table for Vue ships virtualization, pinning, grouping, and editing in one MIT package—~70 kB gzipped, idiomatic for Vue 3, Nuxt 3, and Nuxt 4."
    />
  );
}
