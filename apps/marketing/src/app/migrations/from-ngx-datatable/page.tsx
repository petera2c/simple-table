import type { Metadata } from "next";
import FromCompetitorMigrationLayout from "@/components/migrations/FromCompetitorMigrationLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "Migrate from ngx-datatable to Simple Table for Angular";
const DESCRIPTION =
  "Step-by-step migration guide from @swimlane/ngx-datatable to @simple-table/angular: install, mapping cheat sheet, before/after snippets, and gotchas for Angular 17/18/19.";
const CANONICAL = "/migrations/from-ngx-datatable";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "migrate from ngx-datatable, ngx-datatable alternative, swimlane datatable replacement, angular data grid migration, angular standalone data grid, angular 17 data grid",
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", images: [SEO_STRINGS.site.ogImage], siteName: SEO_STRINGS.site.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SEO_STRINGS.site.creator, images: SEO_STRINGS.site.ogImage.url },
  alternates: { canonical: CANONICAL },
};

export default function FromNgxDatatablePage() {
  return (
    <FromCompetitorMigrationLayout
      title={TITLE}
      subtitle="A practical migration guide from ngx-datatable to Simple Table for Angular. Move off an unmaintained legacy grid and onto a modern signals-friendly Angular table without giving up virtualization, pinning, or grouping."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-04-26"
      framework="angular"
      competitorName="ngx-datatable"
      competitorPackage="ngx-datatable"
      introParagraphs={[
        "@swimlane/ngx-datatable was a popular Angular data grid for years. Active maintenance has slowed and the API leans on NgModule patterns that feel awkward in standalone-component apps.",
        "Simple Table for Angular is an MIT-licensed alternative built around standalone components and signals. It ships virtualization, pinning, grouping with aggregations, and inline editing in the box.",
        "This guide walks an existing Angular app from ngx-datatable to @simple-table/angular without touching your data layer.",
      ]}
      whyMigrate={[
        "Active maintenance and Angular 17/18/19 standalone-components support.",
        "Built-in column pinning, grouping with aggregations, and inline editing.",
        "Smaller bundle and no NgModule boilerplate.",
        "Same engine across React/Vue/Svelte/Solid/Vanilla if your stack expands.",
      ]}
      prerequisites={[
        "Angular 17 or newer (standalone components recommended).",
        "Simple Table for Angular installed: npm install @simple-table/angular.",
        "TypeScript ≥ 5.2.",
      ]}
      installCommand="npm install @simple-table/angular"
      mappingRows={[
        { competitor: "[rows]", simpleTable: "[rows]", notes: "See the Simple Table docs for the row shape." },
        { competitor: "[columns]", simpleTable: "[defaultHeaders]", notes: "prop → accessor; name → label." },
        { competitor: "[columnMode]='force'", simpleTable: "Width-based layout", notes: "Set explicit widths or use 'minmax' helpers on Simple Table headers." },
        { competitor: "[scrollbarV]='true'", simpleTable: "height + virtualization (built-in)", notes: "Set a height; row virtualization kicks in automatically." },
        { competitor: "ngx-datatable-column", simpleTable: "HeaderObject.cellRenderer", notes: "Replace template-projection columns with renderer components." },
        { competitor: "[selected] / (select)", simpleTable: "selectableCells / selectableColumns", notes: "Configure on the table." },
        { competitor: "[sorts]", simpleTable: "Initial sort on HeaderObject", notes: "Set HeaderObject.sortDirection on the column you want sorted." },
        { competitor: "Theme classes (material/dark)", simpleTable: "@simple-table/angular/styles.css", notes: "Theme via CSS variables." },
      ]}
      migrationSteps={[
        {
          title: "Install and remove ngx-datatable",
          body: <p>Install @simple-table/angular and import its stylesheet. Remove @swimlane/ngx-datatable once you're done migrating.</p>,
          code: `npm install @simple-table/angular
npm uninstall @swimlane/ngx-datatable

// styles.scss or main.ts
import "@simple-table/angular/styles.css";`,
        },
        {
          title: "Convert columns",
          body: <p>Convert each ngx-datatable column to a HeaderObject. Replace template projection with cellRenderer components.</p>,
        },
        {
          title: "Reshape your row data",
          body: <p>Simple Table requires a stable id per row. Follow the row shape documented in the Simple Table docs.</p>,
        },
        {
          title: "Replace selection and sort handlers",
          body: <p>ngx-datatable's (select) and [sorts] hooks become Simple Table props that emit through Angular outputs.</p>,
        },
        {
          title: "Adopt new features",
          body: <p>Once the migration is stable, turn on column pinning, row grouping with aggregations, and inline editing—no extra modules required.</p>,
        },
      ]}
      gotchas={[
        { title: "Template projection columns", body: "ngx-datatable allowed inline <ng-template>. Simple Table uses cell renderer components instead—straightforward but requires a small refactor." },
      ]}
      faqs={[
        { question: "Is ngx-datatable still maintained?", answer: "Maintenance has slowed. Many production teams have moved to alternatives over the past two years for security patches and Angular 17+ compatibility." },
        { question: "Will I lose any features migrating?", answer: "Most ngx-datatable features (sort, paginate, virtual scroll, custom cells) are first-class in Simple Table for Angular. Niche features like exact tree-row keyboard parity may need small renderer tweaks." },
      ]}
      relatedLinks={[
        { href: "/comparisons/simple-table-vs-ngx-datatable", label: "Comparison: Simple Table vs ngx-datatable" },
        { href: "/blog/angular-data-grid-simple-table", label: "Pillar guide: the best free Angular data grid in 2026" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
    />
  );
}
