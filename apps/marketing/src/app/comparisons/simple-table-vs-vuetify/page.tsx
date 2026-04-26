import type { Metadata } from "next";
import { faBolt, faDollarSign, faGears, faTrophy } from "@fortawesome/free-solid-svg-icons";
import FrameworkVsCompetitorLayout from "@/components/comparisons/FrameworkVsCompetitorLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "Simple Table vs Vuetify v-data-table: Vue 3 Data Grid Comparison";
const DESCRIPTION =
  "Compare @simple-table/vue against Vuetify's v-data-table for Vue 3 / Nuxt: features, virtualization, bundle size, theming, and migration path. Pick the right Vue data grid in 2026.";
const CANONICAL = "/comparisons/simple-table-vs-vuetify";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "simple-table vs vuetify, vuetify v-data-table alternative, v-data-table-virtual alternative, vue 3 data grid, vue 3 data table, nuxt 3 data grid, vue composition api table",
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", images: [SEO_STRINGS.site.ogImage], siteName: SEO_STRINGS.site.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SEO_STRINGS.site.creator, images: SEO_STRINGS.site.ogImage.url },
  alternates: { canonical: CANONICAL },
};

export default function SimpleTableVsVuetifyPage() {
  return (
    <FrameworkVsCompetitorLayout
      title={TITLE}
      subtitle="v-data-table is great when Vuetify is your design system. Simple Table for Vue wins when you want a serious data grid without buying into Material Design or Vuetify's full runtime."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-04-26"
      framework="vue"
      competitorName="Vuetify v-data-table"
      competitorPackage="vuetify"
      heroBadges={[
        { icon: faTrophy, label: "Built for Vue 3 / Nuxt" },
        { icon: faBolt, label: "1M+ rows virtualization" },
        { icon: faDollarSign, label: "Free under MIT" },
        { icon: faGears, label: "Composition API + <script setup>" },
      ]}
      introParagraphs={[
        "Vuetify's <v-data-table> is the most-used Vue 3 data table because Vuetify is a popular UI library—but the table inherits the entire Vuetify runtime, theming, and Material Design opinions. If you don't want Vuetify, you don't get v-data-table.",
        "Simple Table for Vue ships @simple-table/vue: a focused, MIT-licensed Vue 3 data grid that works in Composition API + <script setup>, Nuxt 3/4, and any Vite-powered Vue app. It includes virtualization for 1M+ rows, column pinning, row grouping with aggregations, and inline editing in ~70 kB gzipped.",
        "This comparison helps you decide whether you really want Vuetify for one component, or whether a slimmer dedicated data grid is the better fit.",
      ]}
      whyChooseSimpleTable={[
        "You don't already use Vuetify and don't want to pull it in for one table.",
        "You don't want Material Design opinions baked into your table styling.",
        "You need real virtualization for 100k+ rows beyond v-data-table-virtual's basic mode.",
        "You want grouping with aggregations + inline editing in one library.",
        "You ship Nuxt 3/4 and want a tree-shakable, SSR-friendly data grid with predictable bundle.",
      ]}
      whyChooseCompetitor={[
        "Vuetify is already your component library and you've adopted Material Design.",
        "You want the table to inherit Vuetify themes automatically.",
        "You rely on Vuetify-specific composables (useDisplay, useTheme) and want one vendor.",
        "Your team already knows Vuetify's slot pattern and props deeply.",
      ]}
      featureRows={[
        { feature: "Vue 3 + <script setup> + TypeScript", simpleTable: { verdict: "yes", note: "Idiomatic Composition API." }, competitor: { verdict: "yes", note: "Composition API." } },
        { feature: "Bundle size (gzipped)", simpleTable: { verdict: "yes", note: "~70 kB total." }, competitor: { verdict: "partial", note: "v-data-table requires Vuetify runtime; full bundle 200–400 kB depending on tree-shaking." } },
        { feature: "Row + column virtualization (1M+ rows)", simpleTable: { verdict: "yes", note: "Built-in." }, competitor: { verdict: "partial", note: "v-data-table-virtual offers row virtualization." } },
        { feature: "Column pinning (left / right)", simpleTable: { verdict: "yes", note: "Built-in." }, competitor: { verdict: "partial", note: "Sticky-column hacks; not first-class." } },
        { feature: "Row grouping with aggregations", simpleTable: { verdict: "yes", note: "Built-in." }, competitor: { verdict: "partial", note: "groupBy with custom slots; aggregations are manual." } },
        { feature: "Inline cell editing", simpleTable: { verdict: "yes", note: "Built-in." }, competitor: { verdict: "no", note: "Not provided; bring your own form layer." } },
        { feature: "Theme via CSS variables", simpleTable: { verdict: "yes", note: "Bring-your-own theme." }, competitor: { verdict: "partial", note: "Tied to Vuetify theming." } },
        { feature: "Nuxt 3 SSR support", simpleTable: { verdict: "yes", note: "SSR-friendly." }, competitor: { verdict: "yes", note: "@nuxtjs/vuetify or auto-imports." } },
        { feature: "License", simpleTable: { verdict: "yes", note: "MIT." }, competitor: { verdict: "yes", note: "MIT." } },
      ]}
      bundleSizeNote={<>v-data-table is bundled inside Vuetify; even with tree-shaking, expect 200–400 kB gzipped for a typical Vuetify install. Simple Table for Vue is ~70 kB gzipped, no extra design system.</>}
      installCommand="npm install @simple-table/vue"
      migrationCallout={<>Vuetify&apos;s <code>:headers</code> + <code>:items</code> map to Simple Table&apos;s <code>:default-headers</code> + <code>:rows</code>. Slot templates (<code>#item.column</code>) become Vue components passed as renderers.</>}
      faqs={[
        { question: "Can I migrate just my data tables to Simple Table while keeping Vuetify everywhere else?", answer: "Yes. Simple Table works fine alongside Vuetify. Many teams move heavy data-grid screens to @simple-table/vue while keeping Vuetify for forms, dialogs, and navigation." },
        { question: "Does Simple Table support Vue 3.x and Nuxt 3/4?", answer: "Yes. @simple-table/vue is built for Vue 3+ and works seamlessly in Nuxt 3 and Nuxt 4 with auto-imports." },
        { question: "How does virtualization compare to v-data-table-virtual?", answer: "Simple Table virtualizes both rows and columns out of the box and handles 1M+ rows in benchmarks. v-data-table-virtual virtualizes rows but not columns." },
      ]}
      conclusion={
        <>
          <p>If you&apos;re already on Vuetify, v-data-table is the path of least resistance. If you only need a data grid—or you want a tighter bundle, real virtualization, and grouping/editing in one library—Simple Table for Vue is the right MIT alternative.</p>
        </>
      }
      relatedLinks={[
        { href: "/blog/vue-nuxt-data-grid-simple-table", label: "Pillar guide: the best free Vue / Nuxt data grid in 2026" },
        { href: "/comparisons/simple-table-vs-primevue-datatable", label: "Simple Table vs PrimeVue DataTable" },
        { href: "/frameworks/vue", label: "Vue integration hub" },
      ]}
    />
  );
}
