import type { Metadata } from "next";
import { faBolt, faDollarSign, faPalette, faTrophy } from "@fortawesome/free-solid-svg-icons";
import FrameworkVsCompetitorLayout from "@/components/comparisons/FrameworkVsCompetitorLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "Simple Table vs PrimeVue DataTable: Vue 3 Data Grid Comparison";
const DESCRIPTION =
  "Compare @simple-table/vue against PrimeVue DataTable for Vue 3 / Nuxt: features, virtualization, bundle size, theming, and migration path. Pick the right Vue data grid in 2026.";
const CANONICAL = "/comparisons/simple-table-vs-primevue-datatable";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "simple-table vs primevue datatable, primevue datatable alternative, primefaces vue alternative, vue 3 data grid, vue 3 data table, nuxt 3 data grid, prime vue alternative",
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", images: [SEO_STRINGS.site.ogImage], siteName: SEO_STRINGS.site.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SEO_STRINGS.site.creator, images: SEO_STRINGS.site.ogImage.url },
  alternates: { canonical: CANONICAL },
};

export default function SimpleTableVsPrimeVueDataTablePage() {
  return (
    <FrameworkVsCompetitorLayout
      title={TITLE}
      subtitle="PrimeVue DataTable is the Vue counterpart to PrimeNG Table. Simple Table for Vue wins when you don't want to adopt PrimeVue or Aura/Lara theming just to get a feature-rich data grid."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-04-26"
      framework="vue"
      competitorName="PrimeVue DataTable"
      competitorPackage="primevue-datatable"
      heroBadges={[
        { icon: faTrophy, label: "Smaller bundle" },
        { icon: faBolt, label: "1M+ rows virtualization" },
        { icon: faDollarSign, label: "Free under MIT" },
        { icon: faPalette, label: "Theme via CSS variables" },
      ]}
      introParagraphs={[
        "PrimeVue's DataTable is the de facto component table for teams already on PrimeVue. It works, but it inherits PrimeVue's runtime, PrimeIcons, theming primitives, and Sass overrides—even when all you want is a single grid.",
        "Simple Table for Vue is a focused, MIT-licensed Vue 3 data grid in @simple-table/vue. It runs in Composition API, <script setup>, Nuxt 3/4, and any Vite-powered Vue app, and ships virtualization, pinning, grouping, and inline editing out of the box.",
        "If you've been pulling in PrimeVue just for the table, this comparison helps you decide whether a slimmer dedicated grid would be the better choice.",
      ]}
      whyChooseSimpleTable={[
        "You don't already use PrimeVue and don't want to pull it in for one table.",
        "You want a smaller bundle, no PrimeIcons, no theme runtime.",
        "You need real virtualization for 100k+ rows; PrimeVue's virtualScrollerOptions is workable but adds complexity.",
        "You want grouping with aggregations + inline editing without reaching for slot gymnastics.",
        "You also build Angular/React/Svelte/Solid apps and want a single shared engine.",
      ]}
      whyChooseCompetitor={[
        "PrimeVue is already your design system and you use other PrimeVue components widely.",
        "You're standardized on Aura, Lara, or PrimeVue Material themes across the app.",
        "You rely on PrimeVue-specific TreeTable, OrderList, or PickList patterns.",
      ]}
      featureRows={[
        { feature: "Vue 3 + <script setup> + TypeScript", simpleTable: { verdict: "yes" }, competitor: { verdict: "yes" } },
        { feature: "Bundle size (gzipped)", simpleTable: { verdict: "yes", note: "~70 kB total." }, competitor: { verdict: "partial", note: "DataTable requires PrimeVue runtime + theme + PrimeIcons." } },
        { feature: "Row + column virtualization (1M+ rows)", simpleTable: { verdict: "yes", note: "Built-in." }, competitor: { verdict: "partial", note: "virtualScrollerOptions; configurable but more wiring." } },
        { feature: "Column pinning (left / right)", simpleTable: { verdict: "yes", note: "Built-in." }, competitor: { verdict: "yes", note: "frozenColumns supported." } },
        { feature: "Row grouping with aggregations", simpleTable: { verdict: "yes", note: "Built-in." }, competitor: { verdict: "partial", note: "rowGroupMode='subheader' available; manual aggregations." } },
        { feature: "Inline cell editing", simpleTable: { verdict: "yes" }, competitor: { verdict: "yes", note: "Editor templates." } },
        { feature: "Custom cell / header / footer renderers", simpleTable: { verdict: "yes", note: "Vue components." }, competitor: { verdict: "yes", note: "Slot templates." } },
        { feature: "Theme via CSS variables", simpleTable: { verdict: "yes", note: "Bring-your-own theme." }, competitor: { verdict: "partial", note: "PrimeVue themes (Aura, Lara, Material)." } },
        { feature: "License", simpleTable: { verdict: "yes", note: "MIT." }, competitor: { verdict: "yes", note: "MIT." } },
      ]}
      bundleSizeNote={<>PrimeVue DataTable is bundled inside primevue. Including the table + a theme + PrimeIcons typically adds 200–400 kB gzipped. Simple Table for Vue is ~70 kB gzipped with no extra design system.</>}
      installCommand="npm install @simple-table/vue"
      migrationCallout={<>PrimeVue&apos;s <code>:value</code> and <code>&lt;Column&gt;</code> children map to Simple Table&apos;s <code>:rows</code> + <code>:default-headers</code>. Body templates become Vue components passed as renderers.</>}
      faqs={[
        { question: "Should I drop PrimeVue entirely?", answer: "Not necessarily. Many teams keep PrimeVue for forms and dialogs while migrating the data grid to Simple Table for tighter bundles and grouping/editing in one library." },
        { question: "Does Simple Table support Nuxt 3/4?", answer: "Yes. @simple-table/vue works in Nuxt 3 and Nuxt 4 with auto-imports and SSR." },
      ]}
      conclusion={
        <>
          <p>If PrimeVue is core to your design system, DataTable will probably stay. If your only PrimeVue usage is the table, Simple Table for Vue gives you a focused, smaller, idiomatic Vue 3 data grid.</p>
        </>
      }
      relatedLinks={[
        { href: "/blog/vue-nuxt-data-grid-simple-table", label: "Pillar guide: the best free Vue / Nuxt data grid in 2026" },
        { href: "/comparisons/simple-table-vs-vuetify", label: "Simple Table vs Vuetify v-data-table" },
        { href: "/frameworks/vue", label: "Vue integration hub" },
      ]}
    />
  );
}
