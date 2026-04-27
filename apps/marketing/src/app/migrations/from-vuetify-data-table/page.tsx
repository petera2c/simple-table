import type { Metadata } from "next";
import FromCompetitorMigrationLayout from "@/components/migrations/FromCompetitorMigrationLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "Migrate from Vuetify v-data-table to Simple Table for Vue";
const DESCRIPTION =
  "Step-by-step migration guide from Vuetify's v-data-table to @simple-table/vue: install, mapping cheat sheet, before/after snippets, and gotchas for Vue 3, Composition API, and Nuxt 3/4.";
const CANONICAL = "/migrations/from-vuetify-data-table";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "migrate from vuetify data table, v-data-table alternative, vuetify replacement vue grid, vue 3 data grid migration, nuxt 3 data grid, vuetify data grid alternative",
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", images: [SEO_STRINGS.site.ogImage], siteName: SEO_STRINGS.site.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SEO_STRINGS.site.creator, images: SEO_STRINGS.site.ogImage.url },
  alternates: { canonical: CANONICAL },
};

export default function FromVuetifyDataTablePage() {
  return (
    <FromCompetitorMigrationLayout
      title={TITLE}
      subtitle="A practical migration guide from Vuetify's v-data-table to Simple Table for Vue. Drop the Vuetify runtime when all you need is a focused, virtualized data grid."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-04-26"
      framework="vue"
      competitorName="Vuetify v-data-table"
      competitorPackage="vuetify-data-table"
      introParagraphs={[
        "Vuetify is a complete Material Design system, and v-data-table is a fine general-purpose grid inside that system. The trade-off: you ship the Vuetify runtime, theme, icons, and Sass even when you only want a single grid.",
        "Simple Table for Vue is an MIT-licensed Vue 3 data grid in @simple-table/vue. It works in Composition API + <script setup>, Nuxt 3 / Nuxt 4, and any Vite-based Vue app—with virtualization, pinning, grouping, and editing built in.",
        "This guide walks you through replacing v-data-table with Simple Table while keeping your Vuetify forms and dialogs in place if you still want them.",
      ]}
      whyMigrate={[
        "You don't want the full Vuetify runtime just for a data grid.",
        "You need real virtualization for 100k+ rows—v-data-table's virtual rendering is workable but not its strength.",
        "You want column pinning, grouping with aggregations, and inline editing as built-in primitives.",
        "You also build React/Angular/Svelte/Solid surfaces and want one shared engine.",
      ]}
      prerequisites={[
        "Vue 3.4+ and Vite or Nuxt 3 / Nuxt 4.",
        "Simple Table for Vue installed: npm install @simple-table/vue.",
        "TypeScript optional but recommended.",
      ]}
      installCommand="npm install @simple-table/vue"
      mappingRows={[
        { competitor: ":headers", simpleTable: ":default-headers", notes: "title → label; key → accessor." },
        { competitor: ":items", simpleTable: ":rows", notes: "See the Simple Table docs for the row shape." },
        { competitor: "items-per-page + pagination", simpleTable: "Built-in pagination + virtualization", notes: "Decide between paginated and virtualized rendering." },
        { competitor: "v-slot:item.<key>", simpleTable: "HeaderObject.cellRenderer", notes: "Pass a Vue component as the cell renderer." },
        { competitor: "fixed-header / fixed-footer", simpleTable: "Built-in", notes: "Headers and pinned columns are sticky by default." },
        { competitor: "loading + loading-text", simpleTable: "isLoading prop", notes: "Show a built-in loading state." },
        { competitor: "Sort-by + sort-desc", simpleTable: "HeaderObject.sortDirection", notes: "Initial sort lives on the header definition." },
      ]}
      migrationSteps={[
        {
          title: "Install Simple Table for Vue",
          body: <p>Add @simple-table/vue and its stylesheet. Keep Vuetify if other components still need it.</p>,
          code: `npm install @simple-table/vue

// main.ts
import "@simple-table/vue/styles.css";`,
        },
        {
          title: "Translate headers",
          body: <p>Convert Vuetify headers into Simple Table HeaderObjects. Keep widths explicit so the layout matches.</p>,
        },
        {
          title: "Reshape your rows",
          body: <p>Each row needs a stable id. Adapt your items to the row shape documented in the Simple Table docs.</p>,
        },
        {
          title: "Convert v-slot templates to renderers",
          body: <p>Each v-slot:item.&lt;key&gt; template becomes a Vue component referenced via HeaderObject.cellRenderer.</p>,
        },
        {
          title: "Adopt advanced features",
          body: <p>Turn on column pinning, row grouping with aggregations, and inline editing—no extra plugins to register.</p>,
        },
      ]}
      gotchas={[
        { title: "Removing Vuetify entirely", body: "Only remove Vuetify when no other component uses it. Many teams keep Vuetify for forms and overlays while migrating just the grid." },
        { title: "Density and theming", body: "v-data-table uses density='compact'. Mirror it with CSS variables on Simple Table to control row height." },
      ]}
      faqs={[
        { question: "Will Simple Table feel idiomatic in Nuxt 3?", answer: "Yes. @simple-table/vue is a Vue 3 component and ships ESM, so it works with Nuxt 3 and Nuxt 4 out of the box." },
        { question: "Can I keep Vuetify for the rest of the app?", answer: "Absolutely. Many teams swap only v-data-table while keeping Vuetify for forms and dialogs." },
      ]}
      relatedLinks={[
        { href: "/comparisons/simple-table-vs-vuetify", label: "Comparison: Simple Table vs Vuetify v-data-table" },
        { href: "/blog/vue-nuxt-data-grid-simple-table", label: "Pillar guide: the best free Vue / Nuxt data grid in 2026" },
        { href: "/frameworks/vue", label: "Vue integration hub" },
      ]}
    />
  );
}
