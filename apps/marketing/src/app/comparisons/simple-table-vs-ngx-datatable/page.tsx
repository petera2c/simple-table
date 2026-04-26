import type { Metadata } from "next";
import { faBolt, faDollarSign, faGears, faTrophy } from "@fortawesome/free-solid-svg-icons";
import FrameworkVsCompetitorLayout from "@/components/comparisons/FrameworkVsCompetitorLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "Simple Table vs ngx-datatable: Modern Angular Data Grid Comparison";
const DESCRIPTION =
  "Compare @simple-table/angular against ngx-datatable: features, virtualization, standalone-component support, maintenance, and migration path. Pick the right Angular data grid in 2026.";
const CANONICAL = "/comparisons/simple-table-vs-ngx-datatable";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "simple-table vs ngx-datatable, ngx-datatable alternative, swimlane datatable alternative, angular 17 data grid, angular standalone data grid, ngx-datatable virtualization, ngx-datatable replacement",
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

export default function SimpleTableVsNgxDatatablePage() {
  return (
    <FrameworkVsCompetitorLayout
      title={TITLE}
      subtitle="ngx-datatable kept Angular afloat through the AngularJS-to-Angular jump. In 2026, the maintenance signal and standalone-component ergonomics tell a different story."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-04-26"
      framework="angular"
      competitorName="ngx-datatable"
      competitorPackage="ngx-datatable"
      heroBadges={[
        { icon: faTrophy, label: "Built for Angular 17+" },
        { icon: faBolt, label: "Active maintenance" },
        { icon: faDollarSign, label: "Free under MIT" },
        { icon: faGears, label: "Standalone components" },
      ]}
      introParagraphs={[
        "ngx-datatable (Swimlane's open-source Angular data table) was the most-used free Angular grid for years. It still works, but maintenance has slowed: Angular 16/17/18/19 compatibility lands late, the API predates standalone components and signals, and key features like column pinning beyond the simple frozen-left model are missing.",
        "Simple Table for Angular targets the same niche—a free Angular data grid—but on Angular 17+ standalone-component primitives. It ships virtualization for 1M+ rows, column pinning, row grouping with aggregations, and inline editing under MIT.",
        "If you've been thinking 'I should probably move off ngx-datatable,' here's the side-by-side that justifies the move.",
      ]}
      whyChooseSimpleTable={[
        "You're on Angular 17+ and want first-class standalone-component support.",
        "You need real virtualization for 100k+ row datasets without ngx-datatable's well-known scroll glitches.",
        "You want column pinning, row grouping with aggregations, and inline editing in the same library—not glued together with workarounds.",
        "You want active maintenance with regular Angular major-version compatibility.",
        "You also build React/Vue/Svelte/Solid surfaces and want one shared engine.",
      ]}
      whyChooseCompetitor={[
        "You have a stable AngularJS-era app on Angular 14/15 and zero appetite to migrate.",
        "You only need a basic sortable/paginated table and don't care about pinning, grouping, or editing.",
        "You're already deeply integrated with @swimlane/ngx-datatable's row-detail and group-header API.",
      ]}
      featureRows={[
        {
          feature: "Standalone-component support (Angular 17+)",
          simpleTable: { verdict: "yes", note: "First-class import." },
          competitor: { verdict: "partial", note: "Module-based; requires NgModule wrapper." },
        },
        {
          feature: "Active major-version support cadence",
          simpleTable: { verdict: "yes", note: "Tracks Angular majors at release." },
          competitor: { verdict: "partial", note: "Lags Angular major releases by months." },
        },
        {
          feature: "Row + column virtualization",
          simpleTable: { verdict: "yes", note: "Engine virtualization for 1M+ rows." },
          competitor: { verdict: "partial", note: "Row virtualization only; known scroll-restoration bugs." },
        },
        {
          feature: "Column pinning (left / right)",
          simpleTable: { verdict: "yes", note: "Both sides, runtime drag." },
          competitor: { verdict: "partial", note: "Frozen-left/right via [frozenLeft]/[frozenRight], no runtime drag." },
        },
        {
          feature: "Row grouping with aggregations",
          simpleTable: { verdict: "yes", note: "Built-in tree + aggregations." },
          competitor: { verdict: "no", note: "Group headers only; no aggregation pipeline." },
        },
        {
          feature: "Inline cell editing",
          simpleTable: { verdict: "yes", note: "Built-in." },
          competitor: { verdict: "no", note: "Not provided; bring your own form layer." },
        },
        {
          feature: "Custom cell / header / footer renderers",
          simpleTable: { verdict: "yes", note: "Pass any Angular component." },
          competitor: { verdict: "yes", note: "Template directives." },
        },
        {
          feature: "TypeScript strict mode",
          simpleTable: { verdict: "yes", note: "Strict types." },
          competitor: { verdict: "partial", note: "Many `any` in older types." },
        },
        {
          feature: "License",
          simpleTable: { verdict: "yes", note: "MIT (free)." },
          competitor: { verdict: "yes", note: "MIT." },
        },
      ]}
      bundleSizeNote={
        <>
          Bundle: ~70 kB gzipped for @simple-table/angular vs. ~120 kB minified for @swimlane/ngx-datatable plus an Angular CDK Scrolling dependency.
        </>
      }
      installCommand="npm install @simple-table/angular"
      migrationCallout={
        <>
          ngx-datatable&apos;s <code>[columns]</code> + <code>[rows]</code> map to Simple Table&apos;s
          <code> defaultHeaders</code> + <code>rows</code>. Cell templates with{" "}
          <code>ng-template let-row</code> become standalone Angular components passed as renderers.
        </>
      }
      faqs={[
        {
          question: "Is ngx-datatable still maintained?",
          answer:
            "ngx-datatable receives occasional patches but lags Angular major releases by months and hasn't shipped major new features in years. Angular 17+ standalone-component patterns are not a first-class citizen.",
        },
        {
          question: "Does Simple Table support virtualization for hundreds of thousands of rows?",
          answer:
            "Yes. The shared simple-table-core engine handles row + column virtualization for 1M+ rows in benchmarks; ngx-datatable only virtualizes rows and has known scroll-restoration regressions.",
        },
        {
          question: "Can I migrate one screen at a time?",
          answer:
            "Yes. Both libraries are MIT and can coexist in the same Angular app. Migrate the highest-traffic screen first, then move the rest.",
        },
        {
          question: "Does Simple Table support row detail and group headers like ngx-datatable?",
          answer:
            "Yes. Simple Table provides nested rows, expandable detail rows, and group headers via row grouping with custom renderers.",
        },
      ]}
      conclusion={
        <>
          <p>
            ngx-datatable was great for its era. In 2026, with Angular 17+ standalone components, signals,
            and stricter bundle budgets, Simple Table for Angular delivers a more modern API, better
            virtualization, and active maintenance—still under MIT.
          </p>
        </>
      }
      relatedLinks={[
        { href: "/blog/angular-data-grid-simple-table", label: "Pillar guide: the best free Angular data grid in 2026" },
        { href: "/comparisons/simple-table-vs-ag-grid-angular", label: "Simple Table vs AG Grid Angular" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
    />
  );
}
