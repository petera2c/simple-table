import type { Metadata } from "next";
import FromCompetitorMigrationLayout from "@/components/migrations/FromCompetitorMigrationLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "Migrate from svelte-headless-table to Simple Table for Svelte";
const DESCRIPTION =
  "Step-by-step migration guide from svelte-headless-table to @simple-table/svelte: install, mapping cheat sheet, before/after snippets, and gotchas for Svelte 4/5 and SvelteKit.";
const CANONICAL = "/migrations/from-svelte-headless-table";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "migrate from svelte-headless-table, svelte-headless-table alternative, sveltekit data grid, svelte 5 data table, svelte runes data grid",
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", images: [SEO_STRINGS.site.ogImage], siteName: SEO_STRINGS.site.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SEO_STRINGS.site.creator, images: SEO_STRINGS.site.ogImage.url },
  alternates: { canonical: CANONICAL },
};

export default function FromSvelteHeadlessTablePage() {
  return (
    <FromCompetitorMigrationLayout
      title={TITLE}
      subtitle="A practical migration guide from svelte-headless-table to Simple Table for Svelte. Trade headless table primitives for batteries-included virtualization, pinning, grouping, and editing."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-04-26"
      framework="svelte"
      competitorName="svelte-headless-table"
      competitorPackage="svelte-headless-table"
      introParagraphs={[
        "svelte-headless-table is a popular headless table builder—you compose plugins (sort, filter, group, paginate) and write the HTML yourself. It's powerful but you own all the wiring: virtualization, pinning, themes, accessibility.",
        "Simple Table for Svelte is an MIT-licensed Svelte 4 / Svelte 5 data grid that ships virtualization for 1M+ rows, column pinning, row grouping with aggregations, and inline editing in the box.",
        "This guide shows how to swap an existing svelte-headless-table view for @simple-table/svelte when your headless setup has grown more complex than you wanted.",
      ]}
      whyMigrate={[
        "You want a working grid in 5 minutes, not a half-day of plugin wiring.",
        "You need real virtualization for 100k+ rows without integrating a separate virtual list.",
        "You want column pinning, grouping with aggregations, and inline editing as built-in primitives.",
        "You ship Svelte 5 with runes and want a component that aligns with that reactivity model.",
      ]}
      prerequisites={[
        "SvelteKit / Svelte 4 or Svelte 5 project.",
        "Simple Table for Svelte installed: npm install @simple-table/svelte.",
      ]}
      installCommand="npm install @simple-table/svelte"
      mappingRows={[
        { competitor: "createTable + writable store", simpleTable: "$state with default headers + rows", notes: "Reactivity via runes (Svelte 5) or stores (Svelte 4)." },
        { competitor: "table.column({ accessor, header })", simpleTable: "HeaderObject (accessor, label, width)", notes: "Same fields, declared on a plain object." },
        { competitor: "addSortBy / addColumnFilters plugins", simpleTable: "Built-in sort + filter", notes: "No plugin wiring needed." },
        { competitor: "addGroupedRows", simpleTable: "Built-in row grouping + aggregations", notes: "Configure via HeaderObject + props." },
        { competitor: "Custom HTML composition", simpleTable: "<SimpleTable /> + cell renderer components", notes: "Pass renderers for custom cells/headers." },
        { competitor: "Bring-your-own virtualization", simpleTable: "Built-in (set height)", notes: "Row + column virtualization for 1M+ rows." },
      ]}
      migrationSteps={[
        {
          title: "Install Simple Table for Svelte",
          body: <p>Add @simple-table/svelte and its stylesheet. Remove svelte-headless-table once you've migrated all consumers.</p>,
          code: `npm install @simple-table/svelte
npm uninstall svelte-headless-table

// app.html or a global CSS file
import "@simple-table/svelte/styles.css";`,
        },
        {
          title: "Convert columns",
          body: <p>Replace <code>table.column({`{ accessor, header }`})</code> calls with HeaderObject entries containing accessor + label + width.</p>,
        },
        {
          title: "Replace stores with $state or stores",
          body: <p>In Svelte 5, use <code>$state</code>. In Svelte 4, keep using a writable store and pass it to <code>:rows</code>.</p>,
        },
        {
          title: "Drop the plugin pipeline",
          body: <p>Sort, filter, paginate, and group are built in—remove addSortBy / addPagination / addGroupedRows plugin code.</p>,
        },
        {
          title: "Move custom HTML to renderers",
          body: <p>Anywhere you used <code>&lt;Render of=… /&gt;</code> with custom JSX-ish projection, pass a Svelte component via HeaderObject.cellRenderer.</p>,
        },
      ]}
      gotchas={[
        { title: "Less low-level control", body: "You give up DOM-level control over <table>, <tr>, <td>. In return you get virtualization and pinning that's tedious to build by hand." },
        { title: "Plugin parity", body: "Most plugin features map 1:1 onto Simple Table props. The exception is exotic plugin compositions—open an issue if you have one and we'll point you at the equivalent prop." },
      ]}
      faqs={[
        { question: "Is Simple Table compatible with Svelte 5 runes?", answer: "Yes. @simple-table/svelte exposes idiomatic props that work with $state, $derived, and SvelteKit's data-loading patterns." },
        { question: "Can I keep svelte-headless-table for some views?", answer: "Yes. They can coexist during a migration. Remove svelte-headless-table once the last consumer is gone." },
      ]}
      relatedLinks={[
        { href: "/comparisons/simple-table-vs-svelte-headless-table", label: "Comparison: Simple Table vs svelte-headless-table" },
        { href: "/blog/sveltekit-data-table-simple-table", label: "Pillar guide: the best free SvelteKit data grid in 2026" },
        { href: "/frameworks/svelte", label: "Svelte integration hub" },
      ]}
    />
  );
}
