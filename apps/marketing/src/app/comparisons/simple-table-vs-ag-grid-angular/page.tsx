import type { Metadata } from "next";
import { faBolt, faDollarSign, faShieldHalved, faTrophy } from "@fortawesome/free-solid-svg-icons";
import FrameworkVsCompetitorLayout from "@/components/comparisons/FrameworkVsCompetitorLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "Simple Table vs AG Grid Angular: Free Angular Data Grid Comparison";
const DESCRIPTION =
  "Compare Simple Table for Angular against AG Grid Angular: features, pricing, bundle size, standalone-component support, and migration paths. The source-available alternative for Angular 17+ teams.";
const CANONICAL = "/comparisons/simple-table-vs-ag-grid-angular";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "simple-table vs ag-grid angular, ag-grid angular alternative, free angular data grid, angular 17 data grid, ag grid enterprise alternative angular, ngx datatable alternative, angular standalone data grid",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: CANONICAL },
};

export default function SimpleTableVsAgGridAngularPage() {
  return (
    <FrameworkVsCompetitorLayout
      title={TITLE}
      subtitle="A side-by-side comparison of @simple-table/angular and AG Grid Angular for teams choosing a data grid in 2026."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-04-26"
      framework="angular"
      competitorName="AG Grid Angular"
      competitorPackage="ag-grid-angular"
      heroBadges={[
        { icon: faTrophy, label: "Best for Angular 17+" },
        { icon: faBolt, label: "1M+ rows virtualization" },
        { icon: faDollarSign, label: "Free for pre-revenue teams" },
        { icon: faShieldHalved, label: "Standalone components" },
      ]}
      introParagraphs={[
        "AG Grid Angular is the de-facto enterprise data grid for Angular: deep feature surface, mature pivoting, and decades of refinement. It also hides the most-requested features—pinning, grouping, integrated charts, status bar, server-side row model—behind AG Grid Enterprise, a paid commercial license that scales per developer.",
        "Simple Table for Angular ships those same headline features (virtualization for 1M+ rows, pinning, row grouping with aggregations, inline cell editing, custom renderers, themes) under the Simple Table Community License, free for pre-revenue and bootstrapped teams. It's published as @simple-table/angular and supports Angular 17+ standalone components, signals, Ivy AOT, and TypeScript strict mode out of the box.",
        "If you're choosing an Angular data grid in 2026 without an enterprise budget, this comparison covers exactly when each library is the right call.",
      ]}
      whyChooseSimpleTable={[
        "You ship Angular 17+ standalone components and want a data grid that's a single import—no module wiring.",
        "You don't have an AG Grid Enterprise license and don't want the per-developer renewal.",
        "You need virtualization, pinning, grouping, and editing free for pre-revenue teams (source-available).",
        "You want a small bundle (~70 kB gzipped) instead of AG Grid Community + Enterprise (~1 MB total).",
        "You want a single library that also covers your React, Vue, Svelte, Solid, and vanilla TS apps via @simple-table adapters.",
      ]}
      whyChooseCompetitor={[
        "You already pay for AG Grid Enterprise and rely on pivoting, integrated charts, master/detail, or the server-side row model.",
        "You need AG Grid's specific status bar, sidebar tool panels, or context menu API.",
        "You have a deep AG Grid migration cost and your team is comfortable with its event/state model.",
        "You're standardizing on AG Grid across non-Angular stacks for consistency with existing internal tooling.",
      ]}
      featureRows={[
        {
          feature: "Standalone-component support (Angular 17+)",
          simpleTable: { verdict: "yes", note: "First-class. No NgModule required." },
          competitor: { verdict: "yes", note: "Supported, but more wiring than @simple-table/angular." },
        },
        {
          feature: "Row + column virtualization (1M+ rows)",
          simpleTable: { verdict: "yes", note: "Built-in, no flag." },
          competitor: { verdict: "yes", note: "Available in Community." },
        },
        {
          feature: "Column pinning (left / right)",
          simpleTable: { verdict: "yes", note: "Source-available, free for pre-revenue teams." },
          competitor: { verdict: "partial", note: "Community only allows basic pinning; advanced lock-position is Enterprise." },
        },
        {
          feature: "Row grouping with aggregations",
          simpleTable: { verdict: "yes", note: "Built-in (source-available)." },
          competitor: { verdict: "no", note: "Enterprise-only." },
        },
        {
          feature: "Inline cell editing + custom editors",
          simpleTable: { verdict: "yes", note: "Use Angular components as editors." },
          competitor: { verdict: "yes", note: "Community + custom editor framework." },
        },
        {
          feature: "Custom cell / header / footer renderers",
          simpleTable: { verdict: "yes", note: "Pass any Angular component." },
          competitor: { verdict: "yes", note: "Cell renderer framework." },
        },
        {
          feature: "Tree data / hierarchical rows",
          simpleTable: { verdict: "yes", note: "Built-in nested rows." },
          competitor: { verdict: "no", note: "Tree data is AG Grid Enterprise." },
        },
        {
          feature: "Pivoting",
          simpleTable: { verdict: "yes", note: "Declarative matrix pivot via props / TableAPI." },
          competitor: { verdict: "yes", note: "Pivot mode is Enterprise." },
        },
        {
          feature: "Integrated charts",
          simpleTable: { verdict: "no", note: "Use external charting (ngx-charts, ECharts)." },
          competitor: { verdict: "yes", note: "Integrated Charts is Enterprise." },
        },
        {
          feature: "TypeScript strict mode",
          simpleTable: { verdict: "yes", note: "First-class types." },
          competitor: { verdict: "yes", note: "Mature types." },
        },
        {
          feature: "License",
          simpleTable: { verdict: "yes", note: "Community License (free for pre-revenue). Pro / Enterprise tiers for revenue-generating teams." },
          competitor: { verdict: "partial", note: "AG Grid Community is MIT; AG Grid Enterprise is per-developer commercial." },
        },
      ]}
      pricingRows={[
        { tier: "Free / OSS", simpleTable: "Source-available, full feature surface", competitor: "Community only (no pinning lock, no grouping aggregations, no tree data, no pivoting, no charts)" },
        { tier: "Single dev / startup", simpleTable: "Free for pre-revenue teams", competitor: "AG Grid Enterprise: per-developer license" },
        { tier: "Team license", simpleTable: "Pro tier (predictable, team pricing)", competitor: "AG Grid Enterprise scales per dev" },
      ]}
      bundleSizeNote={
        <>
          Bundle: Simple Table for Angular ships ~70 kB gzipped including the engine and Angular bindings. AG Grid Community + Enterprise together is ~1 MB minified before gzip. For Angular apps where bundle budget matters (PWAs, SSR cold starts), the difference is meaningful.
        </>
      }
      installCommand="npm install @simple-table/angular"
      migrationCallout={
        <>
          The same data shape (<code>columns</code> / <code>rows</code>) replaces AG Grid&apos;s
          <code> columnDefs</code> / <code>rowData</code>. Inputs match AG Grid&apos;s <code>[gridOptions]</code> philosophy but in idiomatic Angular signals.
        </>
      }
      faqs={[
        {
          question: "Is Simple Table really a free alternative to AG Grid Angular?",
          answer:
            "Yes. Simple Table ships under the Simple Table Community License for pre-revenue and bootstrapped projects, and it includes column pinning, row grouping with aggregations, virtualization, and inline editing—features that require an AG Grid Enterprise license. There is a Pro/Enterprise tier for revenue-generating teams to support ongoing development, but it is per-team rather than per-developer.",
        },
        {
          question: "Does Simple Table support Angular 17+ standalone components?",
          answer:
            "Yes. @simple-table/angular ships SimpleTableComponent as a standalone component you import directly, so you don't need an NgModule wrapper.",
        },
        {
          question: "How big is the bundle compared to AG Grid Angular?",
          answer:
            "Simple Table for Angular is ~70 kB gzipped. AG Grid Community + AG Grid Enterprise add ~1 MB minified to your bundle.",
        },
        {
          question: "Can I migrate gradually from AG Grid to Simple Table?",
          answer:
            "Yes. The data shape (headers / rows) maps cleanly from AG Grid's columnDefs / rowData. You can swap one screen at a time and keep AG Grid where an interactive Pivot Panel or integrated charts are required.",
        },
        {
          question: "Does Simple Table support pivoting and integrated charts?",
          answer:
            "Simple Table includes declarative matrix pivoting (configure row/column/value fields via props or TableAPI). AG Grid Enterprise still leads today on interactive Pivot Panel UI and integrated charts; Simple Table’s drag-and-drop Pivot Panel is on the Enterprise roadmap.",
        },
      ]}
      conclusion={
        <>
          <p>
            For most Angular 17+ teams without a budget for AG Grid Enterprise, Simple Table for
            Angular delivers the headline features—virtualization, pinning, grouping, inline
            editing, custom renderers—source-available, with idiomatic standalone-component ergonomics
            and a fraction of the bundle.
          </p>
          <p>
            AG Grid Enterprise stays the right call today when you need its Pivot Panel UI immediately, integrated charts, master/detail,
            or the server-side row model are core to the product. For everything else, start with
            <code> @simple-table/angular</code> and keep your runtime cost predictable.
          </p>
        </>
      }
      relatedLinks={[
        { href: "/blog/angular-data-grid-simple-table", label: "Pillar guide: the best free Angular data grid in 2026" },
        { href: "/comparisons/simple-table-vs-ag-grid", label: "Simple Table vs AG Grid (cross-stack)" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
    />
  );
}
