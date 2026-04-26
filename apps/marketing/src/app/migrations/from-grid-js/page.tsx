import type { Metadata } from "next";
import FromCompetitorMigrationLayout from "@/components/migrations/FromCompetitorMigrationLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "Migrate from Grid.js to simple-table-core (vanilla TypeScript)";
const DESCRIPTION =
  "Step-by-step migration guide from Grid.js to simple-table-core: install, mapping cheat sheet, before/after snippets, and gotchas for vanilla TypeScript / web components.";
const CANONICAL = "/migrations/from-grid-js";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "migrate from grid.js, grid.js alternative, vanilla js data grid migration, vanilla typescript data grid, framework agnostic data grid",
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", images: [SEO_STRINGS.site.ogImage], siteName: SEO_STRINGS.site.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SEO_STRINGS.site.creator, images: SEO_STRINGS.site.ogImage.url },
  alternates: { canonical: CANONICAL },
};

export default function FromGridJsPage() {
  return (
    <FromCompetitorMigrationLayout
      title={TITLE}
      subtitle="A practical migration guide from Grid.js to simple-table-core. Move from a tuple-based read-only grid to a strict-typed, feature-rich engine that scales with your app."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-04-26"
      framework="vanilla"
      competitorName="Grid.js"
      competitorPackage="grid-js"
      introParagraphs={[
        "Grid.js is a small, friendly vanilla-JS grid—great for read-only tables. Once you start needing virtualization, pinning, grouping, or inline editing, you outgrow it quickly.",
        "simple-table-core is a TypeScript-first vanilla data grid that ships virtualization for 1M+ rows, column pinning, row grouping with aggregations, and inline editing in MIT.",
        "This guide walks you from a Grid.js setup to simple-table-core without changing your data layer.",
      ]}
      whyMigrate={[
        "Move beyond Grid.js's read-only ceiling—gain inline editing.",
        "Get virtualization for 100k+ rows out of the box.",
        "Add column pinning, row grouping with aggregations, and tree data.",
        "Get the same engine across React / Vue / Angular / Svelte / Solid if your app expands.",
      ]}
      prerequisites={[
        "A bundler that supports ESM (Vite, esbuild, Rollup, Webpack 5).",
        "simple-table-core installed: npm install simple-table-core.",
      ]}
      installCommand="npm install simple-table-core"
      mappingRows={[
        { competitor: "columns: ['Name', ...]", simpleTable: "defaultHeaders: HeaderObject[]", notes: "Move from tuple columns to declarative headers with accessor + label + width." },
        { competitor: "data: any[][]", simpleTable: "rows: Row[]", notes: "See the Simple Table docs for the row shape." },
        { competitor: "pagination: true", simpleTable: "Built-in pagination + virtualization", notes: "Choose paginated or virtualized rendering—both are first-class." },
        { competitor: "search: true", simpleTable: "Filtering / column filters", notes: "Built-in column filters; combine for global search if needed." },
        { competitor: "sort: true", simpleTable: "Built-in sort", notes: "Multi-column sort and per-column sort directions." },
        { competitor: "Grid.js theme CSS", simpleTable: "simple-table-core/styles.css", notes: "Theme via CSS variables." },
      ]}
      migrationSteps={[
        {
          title: "Install simple-table-core",
          body: <p>Add simple-table-core to your bundler entry. Remove gridjs once you've migrated all consumers.</p>,
          code: `npm install simple-table-core
npm uninstall gridjs

// main.ts
import "simple-table-core/styles.css";`,
        },
        {
          title: "Convert tuple columns to header objects",
          body: <p>Replace Grid.js's <code>columns: [&apos;Name&apos;, &apos;Email&apos;]</code> with HeaderObject entries containing accessor + label + width.</p>,
        },
        {
          title: "Convert tuple rows to objects",
          body: <p>Convert each row tuple into an object with the field names you'll reference in your column accessors. See the row shape in the Simple Table docs.</p>,
        },
        {
          title: "Replace pagination/search/sort flags",
          body: <p>Grid.js's boolean flags become explicit Simple Table props. Keep what you need; drop what you don't.</p>,
        },
        {
          title: "Add advanced features",
          body: <p>Once stable, layer on column pinning, row grouping with aggregations, and inline editing—they're built-in.</p>,
        },
      ]}
      gotchas={[
        { title: "Tuple → object data shape", body: "Grid.js accepts tuple data; simple-table-core uses object rows. The transform is straightforward but unavoidable." },
        { title: "Grid.js plugins", body: "Plugins like gridjs-selectable map onto Simple Table's selection props. Open an issue if you depend on a specific plugin and we'll point you at the equivalent." },
      ]}
      faqs={[
        { question: "Why move off Grid.js?", answer: "Grid.js is great for simple read-only tables. Most teams migrate when they need editing, virtualization for tens of thousands of rows, grouping, or tighter TypeScript types." },
        { question: "Does simple-table-core work with web components?", answer: "Yes. The vanilla engine has no peer dependencies and renders into any container element you provide." },
      ]}
      relatedLinks={[
        { href: "/comparisons/simple-table-vs-tabulator-vanilla", label: "Comparison: simple-table-core vs Tabulator (vanilla)" },
        { href: "/blog/vanilla-typescript-data-grid-simple-table-core", label: "Pillar guide: the best free vanilla TS data grid in 2026" },
        { href: "/frameworks/vanilla", label: "Vanilla TypeScript integration hub" },
      ]}
    />
  );
}
