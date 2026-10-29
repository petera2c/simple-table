import type { Metadata } from "next";
import FromCompetitorMigrationLayout from "@/components/migrations/FromCompetitorMigrationLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "How to Migrate from svelte-headless-table on Svelte 5";
const DESCRIPTION =
  "Upgrading to Svelte 5? svelte-headless-table 0.18.3 still declares a Svelte 4 peer. Move to @simple-table/svelte with a plugin-to-prop mapping table, code snippets, and gotchas for SvelteKit.";
const CANONICAL = "/migrations/from-svelte-headless-table";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "migrate from svelte-headless-table, svelte-headless-table svelte 5, replace svelte-headless-table, svelte 5 upgrade data table, sveltekit data grid migration",
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", images: [SEO_STRINGS.site.ogImage], siteName: SEO_STRINGS.site.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SEO_STRINGS.site.creator, images: SEO_STRINGS.site.ogImage.url },
  alternates: { canonical: CANONICAL },
};

export default function FromSvelteHeadlessTablePage() {
  return (
    <FromCompetitorMigrationLayout
      title={TITLE}
      subtitle="A practical, step-by-step guide for teams moving a SvelteKit app to Svelte 5 and replacing svelte-headless-table with Simple Table for Svelte, one table at a time."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-10-28"
      framework="svelte"
      competitorName="svelte-headless-table"
      competitorPackage="svelte-headless-table"
      introParagraphs={[
        "Most teams reach this page during a Svelte 5 upgrade. As of October 2026, the latest svelte-headless-table release on npm is 0.18.3 (October 28, 2024), and it declares svelte ^4.0.0 as its peer dependency, so a Svelte 5 install will warn or fail peer checks.",
        "Simple Table for Svelte (@simple-table/svelte 4.3.2) is an MIT-licensed data grid built for Svelte 5 (peer dependency svelte >=5.0.0). It ships virtualization for 1M+ rows, column pinning, row grouping with aggregations, and inline editing in the box.",
        "This guide maps each svelte-headless-table plugin to the matching Simple Table prop and walks through the swap. If you are still deciding, read the feature matrix first.",
      ]}
      whyMigrate={[
        "Your Svelte 5 upgrade is blocked or noisy because of the svelte ^4.0.0 peer dependency.",
        "Your plugin pipeline (addSortBy, addColumnFilters, addGroupedRows, addPagination) has grown into code you maintain yourself.",
        "You bolted on a separate virtual list and still fight scroll and sticky-header edge cases.",
        "You need column pinning or inline editing, which svelte-headless-table leaves to you.",
      ]}
      prerequisites={[
        "Svelte 5 project (SvelteKit or plain Svelte). Upgrade from Svelte 4 first: @simple-table/svelte requires svelte >=5.0.0.",
        "Simple Table for Svelte installed: npm install @simple-table/svelte.",
      ]}
      installCommand="npm install @simple-table/svelte"
      mappingRows={[
        { competitor: "createTable + writable store", simpleTable: "$state with default headers + rows", notes: "Reactivity via runes; Svelte 5 still accepts writable stores if you keep them." },
        { competitor: "table.column({ accessor, header })", simpleTable: "ColumnDef (accessor, label, width)", notes: "Same fields, declared on a plain object." },
        { competitor: "addSortBy / addColumnFilters plugins", simpleTable: "Built-in sort + filter", notes: "No plugin wiring needed." },
        { competitor: "addGroupedRows", simpleTable: "Built-in row grouping + aggregations", notes: "Configure via ColumnDef + props." },
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
          body: <p>Replace <code>table.column({`{ accessor, header }`})</code> calls with ColumnDef entries containing accessor + label + width.</p>,
        },
        {
          title: "Move table state to $state",
          body: <p>Hold rows and columns in <code>$state</code>. If the data already lives in a writable store, Svelte 5 still supports stores, so you can pass <code>$rows</code> to the grid and migrate the store later.</p>,
        },
        {
          title: "Drop the plugin pipeline",
          body: <p>Sort, filter, paginate, and group are built in. Remove addSortBy, addPagination, and addGroupedRows plugin code.</p>,
        },
        {
          title: "Move custom HTML to renderers",
          body: <p>Anywhere you used <code>&lt;Render of=… /&gt;</code> with custom JSX-ish projection, pass a Svelte component via ColumnDef.cellRenderer.</p>,
        },
      ]}
      gotchas={[
        { title: "Less low-level control", body: "You give up DOM-level control over <table>, <tr>, <td>. In return you get virtualization and pinning that's tedious to build by hand." },
        { title: "Svelte 4 apps must upgrade first", body: "@simple-table/svelte requires Svelte 5. If part of your app must stay on Svelte 4, keep svelte-headless-table there until that part is upgraded." },
        { title: "Plugin parity", body: "Most plugin features map 1:1 onto Simple Table props. The exception is exotic plugin compositions: open an issue if you have one and we'll point you at the equivalent prop." },
      ]}
      faqs={[
        { question: "Is Simple Table compatible with Svelte 5 runes?", answer: "Yes. @simple-table/svelte is built for Svelte 5 and works with $state, $derived, and SvelteKit's data-loading patterns. It does not support Svelte 4." },
        { question: "Does svelte-headless-table work with Svelte 5?", answer: "Its latest release, 0.18.3 from October 2024, declares svelte ^4.0.0 as its peer dependency. Check the project's GitHub for current status." },
        { question: "Can I keep svelte-headless-table for some views?", answer: "Yes. They can coexist during a migration. Remove svelte-headless-table once the last consumer is gone." },
      ]}
      relatedLinks={[
        { href: "/comparisons/simple-table-vs-svelte-headless-table", label: "Feature matrix: svelte-headless-table vs Simple Table" },
        { href: "/blog/simple-table-vs-svelte-headless-table", label: "Decision guide: headless vs batteries-included Svelte grids" },
        { href: "/blog/best-free-svelte-data-grid-2026", label: "Best free Svelte data grids in 2026" },
        { href: "/blog/sveltekit-data-table-simple-table", label: "Pillar guide: the best free SvelteKit data grid in 2026" },
        { href: "/frameworks/svelte", label: "Svelte integration hub" },
      ]}
    />
  );
}
