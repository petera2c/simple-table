import type { Metadata } from "next";
import FromCompetitorMigrationLayout from "@/components/migrations/FromCompetitorMigrationLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "Migrate from Tabulator to simple-table-core (vanilla TypeScript)";
const DESCRIPTION =
  "Step-by-step migration guide from Tabulator to simple-table-core: install, mapping cheat sheet, before/after snippets, and gotchas for vanilla TypeScript / web components.";
const CANONICAL = "/migrations/from-tabulator";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "migrate from tabulator, tabulator alternative, vanilla js data grid migration, vanilla typescript data grid, framework agnostic data grid, web component data grid",
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", images: [SEO_STRINGS.site.ogImage], siteName: SEO_STRINGS.site.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SEO_STRINGS.site.creator, images: SEO_STRINGS.site.ogImage.url },
  alternates: { canonical: CANONICAL },
};

export default function FromTabulatorPage() {
  return (
    <FromCompetitorMigrationLayout
      title={TITLE}
      subtitle="A practical migration guide from Tabulator to simple-table-core. Modern TypeScript-first packaging, the same data shape across frameworks, and a tighter bundle."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-04-26"
      framework="vanilla"
      competitorName="Tabulator"
      competitorPackage="tabulator"
      introParagraphs={[
        "Tabulator has been a workhorse vanilla-JS data grid for a decade. Its API is imperative, its TypeScript types are community-maintained, and its CSS / theme story is its own world.",
        "simple-table-core is the framework-agnostic engine that powers all @simple-table/* adapters. It's authored in TypeScript (strict), ships ESM-first packaging, and exposes the same data shape that React / Vue / Angular / Svelte / Solid adapters use.",
        "This guide walks you through swapping Tabulator for simple-table-core in a vanilla TS / web-component app.",
      ]}
      whyMigrate={[
        "Strict TypeScript types out of the box—no community defs.",
        "Modern ESM-first packaging for Vite / esbuild / Rollup pipelines.",
        "Lighter bundle and predictable styling via CSS variables.",
        "Same engine and data shape across React / Vue / Angular / Svelte / Solid if you adopt a framework later.",
      ]}
      prerequisites={[
        "A bundler that supports ESM (Vite, esbuild, Rollup, Webpack 5).",
        "simple-table-core installed: npm install simple-table-core.",
        "TypeScript ≥ 5.0 recommended.",
      ]}
      installCommand="npm install simple-table-core"
      mappingRows={[
        { competitor: "new Tabulator(el, opts)", simpleTable: "new SimpleTableVanilla(el, opts)", notes: "Constructor signature is similar." },
        { competitor: "data: Record<string, unknown>[]", simpleTable: "rows: Row[]", notes: "See the Simple Table docs for the row shape." },
        { competitor: "columns[]", simpleTable: "defaultHeaders[]", notes: "title → label; field → accessor; width unchanged." },
        { competitor: "frozen: true", simpleTable: "HeaderObject.pinned", notes: "Built-in pinning, declarative on the header." },
        { competitor: "groupBy + groupHeader", simpleTable: "Row grouping + aggregations", notes: "Built-in MIT grouping with aggregators." },
        { competitor: "formatter / mutator", simpleTable: "cellRenderer", notes: "Return a DOM node or a string from a render function." },
        { competitor: "Tabulator theme CSS", simpleTable: "simple-table-core/styles.css", notes: "Theme via CSS variables." },
      ]}
      migrationSteps={[
        {
          title: "Install simple-table-core",
          body: <p>Add simple-table-core to your bundler entry point. Remove tabulator-tables when the last consumer is gone.</p>,
          code: `npm install simple-table-core
npm uninstall tabulator-tables

// main.ts
import "simple-table-core/styles.css";`,
        },
        {
          title: "Update the constructor",
          body: <p>Replace <code>new Tabulator(el, opts)</code> with <code>new SimpleTableVanilla(el, opts)</code>. The mount-point semantics are the same.</p>,
        },
        {
          title: "Translate column definitions",
          body: <p>Map each Tabulator column to a HeaderObject. <code>title → label</code>, <code>field → accessor</code>, widths and pinning carry over directly.</p>,
        },
        {
          title: "Reshape rows",
          body: <p>Each row needs a stable id. See the row shape in the Simple Table docs and adapt your existing data.</p>,
        },
        {
          title: "Port formatters and mutators",
          body: <p>Tabulator's <code>formatter</code> functions become Simple Table cellRenderers. Return a DOM Node, an HTMLElement, or a string—whatever fits.</p>,
        },
      ]}
      gotchas={[
        { title: "Imperative vs declarative", body: "Tabulator leans imperative (table.setData, table.replaceData). Simple Table is declarative—you update the rows array on your side and the grid re-renders." },
        { title: "Niche Tabulator features", body: "Print previews and built-in chart integration are Tabulator-specific. For most data-grid use cases, Simple Table covers the equivalent ground via cell renderers + grouping." },
      ]}
      faqs={[
        { question: "Is the migration usually 1:1?", answer: "For typical data-grid use cases (sort, filter, paginate, group, custom cells, virtualization), yes. Edge-case features (Tabulator's print API, ajaxConfig) need a small custom layer if you depend on them." },
        { question: "Can I keep my existing CSS theme?", answer: "You'll re-skin via CSS variables. Tabulator-specific class names won't carry over, but the visual outcome (compact rows, alternating stripes, sticky headers) is straightforward to replicate." },
      ]}
      relatedLinks={[
        { href: "/comparisons/simple-table-vs-tabulator-vanilla", label: "Comparison: simple-table-core vs Tabulator (vanilla)" },
        { href: "/blog/vanilla-typescript-data-grid-simple-table-core", label: "Pillar guide: the best free vanilla TS data grid in 2026" },
        { href: "/frameworks/vanilla", label: "Vanilla TypeScript integration hub" },
      ]}
    />
  );
}
