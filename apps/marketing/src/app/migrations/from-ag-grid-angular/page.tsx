import type { Metadata } from "next";
import FromCompetitorMigrationLayout from "@/components/migrations/FromCompetitorMigrationLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "Migrate from AG Grid Angular to Simple Table for Angular";
const DESCRIPTION =
  "Step-by-step migration guide from AG Grid Angular to @simple-table/angular: install, mapping cheat sheet, before/after snippets, and gotchas for Angular 17/18/19 standalone components.";
const CANONICAL = "/migrations/from-ag-grid-angular";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "migrate from ag grid angular, ag grid angular alternative, angular data grid migration, ag grid replacement angular, angular standalone data grid, angular 17 data grid, angular 18 data grid",
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", images: [SEO_STRINGS.site.ogImage], siteName: SEO_STRINGS.site.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SEO_STRINGS.site.creator, images: SEO_STRINGS.site.ogImage.url },
  alternates: { canonical: CANONICAL },
};

export default function FromAgGridAngularPage() {
  return (
    <FromCompetitorMigrationLayout
      title={TITLE}
      subtitle="A practical migration playbook from AG Grid Angular to Simple Table for Angular. Drop the Enterprise license fees and the heavy theme runtime—keep virtualization, pinning, grouping, and editing."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-04-26"
      framework="angular"
      competitorName="AG Grid Angular"
      competitorPackage="ag-grid-angular"
      introParagraphs={[
        "AG Grid Angular is a powerful data grid, but its bundle is large and many of the features Angular teams reach for live behind the Enterprise tier. Simple Table for Angular is an MIT-licensed alternative that ships virtualization for 1M+ rows, column pinning, row grouping with aggregations, and inline editing in the standard package.",
        "This guide assumes you have an existing Angular 17/18/19 standalone-components app using AG Grid Angular and you want to swap it for @simple-table/angular without rewriting your data layer.",
      ]}
      whyMigrate={[
        "All grouping, pinning, and editing features are MIT—no Enterprise license to renew.",
        "Smaller install: ~70 kB gzipped vs AG Grid's full theme + community runtime.",
        "Idiomatic Angular signals API; no zone tricks needed.",
        "Same engine across React/Vue/Svelte/Solid/Vanilla if your stack expands.",
      ]}
      prerequisites={[
        "Angular 17 or newer (standalone components recommended).",
        "Simple Table for Angular installed: npm install @simple-table/angular.",
        "TypeScript ≥ 5.2 (matches Angular 17+ baseline).",
        "Backup of any custom AG Grid cell renderers — you'll port them to Simple Table renderers.",
      ]}
      installCommand="npm install @simple-table/angular"
      mappingRows={[
        { competitor: "[rowData]", simpleTable: "[rows]", notes: "See the Simple Table docs for the row shape." },
        { competitor: "[columnDefs]", simpleTable: "[defaultHeaders]", notes: "field → accessor; headerName → label; width unchanged." },
        { competitor: "ColDef.cellRenderer", simpleTable: "HeaderObject.cellRenderer", notes: "Pass an Angular component or a function returning a TemplateRef." },
        { competitor: "rowSelection: 'multiple'", simpleTable: "selectableCells / selectableColumns", notes: "Configure on the table, not on each column." },
        { competitor: "pinned: 'left' | 'right'", simpleTable: "HeaderObject.pinned", notes: "Same values; pinning is built-in." },
        { competitor: "rowGroup + aggFunc (Enterprise)", simpleTable: "rowGrouping + aggregation", notes: "Free in Simple Table—no Enterprise license required." },
        { competitor: "valueFormatter", simpleTable: "Custom cell renderer", notes: "Format inside the renderer or pre-format your data." },
        { competitor: "domLayout: 'autoHeight'", simpleTable: "height='auto'", notes: "Or pass a fixed height like '480px'." },
        { competitor: "AG Grid theme CSS", simpleTable: "@simple-table/angular/styles.css", notes: "Theme via CSS variables on a wrapper element." },
      ]}
      migrationSteps={[
        {
          title: "Install Simple Table and remove AG Grid",
          body: <p>Add @simple-table/angular and import the stylesheet at the app root. Remove ag-grid-community and ag-grid-angular once the migration is complete.</p>,
          code: `npm install @simple-table/angular
npm uninstall ag-grid-angular ag-grid-community ag-grid-enterprise

// styles.scss or main.ts
import "@simple-table/angular/styles.css";`,
        },
        {
          title: "Convert column definitions",
          body: <p>Map each ColDef to a Simple Table HeaderObject. The shape is similar; field becomes accessor, headerName becomes label.</p>,
        },
        {
          title: "Reshape your row data",
          body: <p>Each row needs a stable id. Adapt your existing records to the row shape documented in the Simple Table docs.</p>,
        },
        {
          title: "Port cell renderers",
          body: <p>AG Grid component renderers map to Simple Table cell renderers. Replace AG Grid lifecycle hooks (agInit, refresh) with regular Angular component inputs.</p>,
        },
        {
          title: "Re-enable advanced features",
          body: <p>Pinning, grouping with aggregations, inline editing, and infinite scroll are all built-in in Simple Table—no extra modules to register.</p>,
        },
      ]}
      gotchas={[
        { title: "Stable row ids are required", body: "Simple Table needs a stable id per row. Use a database id or a generated uuid." },
        { title: "No CSR-specific zone tricks", body: "Simple Table for Angular plays well with the new signals API. If you used onGridReady or detectChanges hacks, you can usually delete them." },
        { title: "AG Grid Enterprise features", body: "Pivoting, master/detail, and integrated charts are AG-specific. Open an issue if you have one of these workflows—Simple Table covers grouping/aggregations and most reporting needs in MIT." },
      ]}
      faqs={[
        { question: "Does this work with Angular Material themes?", answer: "Yes. Simple Table doesn't ship its own design system—theme it via CSS variables to match Material, Tailwind, or your own design tokens." },
        { question: "How big is the bundle compared to AG Grid?", answer: "Roughly an order of magnitude smaller in typical apps: ~70 kB gzipped for Simple Table for Angular vs 200–400 kB+ for AG Grid Community + theme." },
        { question: "Can I migrate incrementally, route-by-route?", answer: "Yes. The two libraries can coexist—migrate one feature area at a time and remove ag-grid-* once the last consumer is gone." },
      ]}
      relatedLinks={[
        { href: "/comparisons/simple-table-vs-ag-grid-angular", label: "Comparison: Simple Table vs AG Grid Angular" },
        { href: "/blog/angular-data-grid-simple-table", label: "Pillar guide: the best free Angular data grid in 2026" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
    />
  );
}
