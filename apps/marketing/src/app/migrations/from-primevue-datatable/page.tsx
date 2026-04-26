import type { Metadata } from "next";
import FromCompetitorMigrationLayout from "@/components/migrations/FromCompetitorMigrationLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "Migrate from PrimeVue DataTable to Simple Table for Vue";
const DESCRIPTION =
  "Step-by-step migration guide from PrimeVue DataTable to @simple-table/vue: install, mapping cheat sheet, before/after snippets, and gotchas for Vue 3, Composition API, and Nuxt.";
const CANONICAL = "/migrations/from-primevue-datatable";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "migrate from primevue datatable, primevue datatable alternative, primevue replacement, vue 3 data grid migration, nuxt 3 data grid, prime vue alternative",
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", images: [SEO_STRINGS.site.ogImage], siteName: SEO_STRINGS.site.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SEO_STRINGS.site.creator, images: SEO_STRINGS.site.ogImage.url },
  alternates: { canonical: CANONICAL },
};

export default function FromPrimeVueDataTablePage() {
  return (
    <FromCompetitorMigrationLayout
      title={TITLE}
      subtitle="A practical migration guide from PrimeVue DataTable to Simple Table for Vue. Trim the PrimeVue runtime, theme, and PrimeIcons when all you need is a focused data grid."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-04-26"
      framework="vue"
      competitorName="PrimeVue DataTable"
      competitorPackage="primevue-datatable"
      introParagraphs={[
        "PrimeVue DataTable is a feature-rich grid for teams already on PrimeVue. The cost is that you carry the PrimeVue runtime, a theme (Aura, Lara, or Material), and PrimeIcons even when you only want a single table.",
        "Simple Table for Vue is an MIT-licensed Vue 3 data grid that runs in Composition API + <script setup>, Nuxt 3, and Nuxt 4 with no design-system dependencies. It ships virtualization, pinning, grouping, and editing in the box.",
        "This guide shows how to swap PrimeVue DataTable for @simple-table/vue without removing the rest of your PrimeVue components.",
      ]}
      whyMigrate={[
        "Drop the PrimeVue runtime + theme + PrimeIcons cost when DataTable is your only PrimeVue component.",
        "Get real virtualization for 100k+ rows without virtualScrollerOptions wiring.",
        "Use grouping with aggregations + inline editing without slot gymnastics.",
        "Same engine across React/Angular/Svelte/Solid/Vanilla if your stack expands.",
      ]}
      prerequisites={[
        "Vue 3.4+ and Vite or Nuxt 3 / Nuxt 4.",
        "Simple Table for Vue installed: npm install @simple-table/vue.",
        "TypeScript optional but recommended.",
      ]}
      installCommand="npm install @simple-table/vue"
      mappingRows={[
        { competitor: ":value", simpleTable: ":rows", notes: "See the Simple Table docs for the row shape." },
        { competitor: "<Column field='x' header='Y'>", simpleTable: ":default-headers entry", notes: "field → accessor; header → label." },
        { competitor: "rowGroupMode='subheader'", simpleTable: "Built-in row grouping + aggregations", notes: "No manual aggregator wiring needed." },
        { competitor: "frozenColumns", simpleTable: "HeaderObject.pinned", notes: "Same concept, declarative on the header." },
        { competitor: "virtualScrollerOptions", simpleTable: "Built-in virtualization", notes: "Set a height; row + column virtualization auto-engages." },
        { competitor: "Editor templates", simpleTable: "isEditable + cell editor renderer", notes: "Define editor renderers per column." },
        { competitor: "PrimeVue theme + PrimeIcons", simpleTable: "@simple-table/vue/styles.css", notes: "Theme via CSS variables." },
      ]}
      migrationSteps={[
        {
          title: "Install Simple Table for Vue",
          body: <p>Add @simple-table/vue alongside existing PrimeVue installations. You can keep PrimeVue for forms and dialogs.</p>,
          code: `npm install @simple-table/vue

// main.ts
import "@simple-table/vue/styles.css";`,
        },
        {
          title: "Convert Column children to header objects",
          body: <p>Replace <code>&lt;Column field=&quot;x&quot; header=&quot;Y&quot; /&gt;</code> with HeaderObject entries containing accessor + label + width.</p>,
        },
        {
          title: "Reshape rows",
          body: <p>Each Simple Table row needs a stable id. See the row shape in the Simple Table docs and adapt your existing items.</p>,
        },
        {
          title: "Port body templates to cell renderers",
          body: <p>PrimeVue uses <code>#body</code> slots for custom rendering. In Simple Table, pass a Vue component via HeaderObject.cellRenderer.</p>,
        },
        {
          title: "Adopt grouping + virtualization",
          body: <p>Replace virtualScrollerOptions with a fixed height and turn on row grouping with aggregations declaratively.</p>,
        },
      ]}
      gotchas={[
        { title: "Keep PrimeVue if other components rely on it", body: "You don't have to drop PrimeVue entirely. Many teams keep PrimeVue for forms / dialogs and switch only DataTable." },
        { title: "PrimeIcons", body: "If you used PrimeIcons exclusively for the table, you can pull in a different icon set or use the cell renderer to render anything you like." },
      ]}
      faqs={[
        { question: "Does Simple Table support Nuxt 3 and Nuxt 4?", answer: "Yes—@simple-table/vue is ESM, SSR-friendly, and ships TypeScript types." },
        { question: "What about PrimeVue's TreeTable?", answer: "Simple Table supports tree data and expandable rows. Most TreeTable use-cases port over with no functional regressions." },
      ]}
      relatedLinks={[
        { href: "/comparisons/simple-table-vs-primevue-datatable", label: "Comparison: Simple Table vs PrimeVue DataTable" },
        { href: "/blog/vue-nuxt-data-grid-simple-table", label: "Pillar guide: the best free Vue / Nuxt data grid in 2026" },
        { href: "/frameworks/vue", label: "Vue integration hub" },
      ]}
    />
  );
}
