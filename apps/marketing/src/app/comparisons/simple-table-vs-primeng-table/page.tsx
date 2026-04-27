import type { Metadata } from "next";
import { faBolt, faDollarSign, faPalette, faTrophy } from "@fortawesome/free-solid-svg-icons";
import FrameworkVsCompetitorLayout from "@/components/comparisons/FrameworkVsCompetitorLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";

const TITLE = "Simple Table vs PrimeNG Table: Standalone Angular Data Grid Comparison";
const DESCRIPTION =
  "Compare @simple-table/angular against PrimeNG Table (p-table) for Angular 17+: features, virtualization, bundle size, theming, and migration path. Pick the right Angular data grid in 2026.";
const CANONICAL = "/comparisons/simple-table-vs-primeng-table";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "simple-table vs primeng table, primeng table alternative, p-table alternative, primefaces angular alternative, angular standalone data grid, angular 17 data grid, angular data table comparison",
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", images: [SEO_STRINGS.site.ogImage], siteName: SEO_STRINGS.site.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, creator: SEO_STRINGS.site.creator, images: SEO_STRINGS.site.ogImage.url },
  alternates: { canonical: CANONICAL },
};

export default function SimpleTableVsPrimengTablePage() {
  return (
    <FrameworkVsCompetitorLayout
      title={TITLE}
      subtitle="PrimeNG Table is the default Angular table for teams already on PrimeNG. Simple Table for Angular wins when you don't want to adopt the whole PrimeNG ecosystem just to get a serious data grid."
      canonicalPath={CANONICAL}
      datePublished="2026-04-26"
      dateModified="2026-04-26"
      framework="angular"
      competitorName="PrimeNG Table"
      competitorPackage="primeng-table"
      heroBadges={[
        { icon: faTrophy, label: "Standalone-first" },
        { icon: faBolt, label: "Smaller bundle" },
        { icon: faDollarSign, label: "Free under MIT" },
        { icon: faPalette, label: "Themeable via CSS variables" },
      ]}
      introParagraphs={[
        "PrimeNG's <p-table> is the well-known Angular component table from PrimeFaces. It's full-featured, but it ships as part of a much larger UI library—pulling in PrimeNG runtime, theming primitives, and PrimeIcons. If you only need a data grid, that's a lot of dependencies for one component.",
        "Simple Table for Angular gives you a focused, MIT-licensed data grid that sits on Angular 17+ standalone components. It ships virtualization for 1M+ rows, column pinning, row grouping with aggregations, and inline editing in a single ~70 kB gzipped package.",
        "This comparison helps you decide whether to keep adding PrimeNG just for the table—or swap it for a slimmer, idiomatic Angular grid.",
      ]}
      whyChooseSimpleTable={[
        "You don't already use PrimeNG and don't want to pull it in just for one table component.",
        "You want a smaller bundle dedicated to the data grid use case.",
        "You need real virtualization for 100k+ rows; PrimeNG's virtualScroll mode is workable but adds complexity.",
        "You want row grouping with aggregations + inline editing in a single batteries-included grid.",
        "You also ship React/Vue/Svelte/Solid apps and want a single shared engine.",
      ]}
      whyChooseCompetitor={[
        "You already use PrimeNG broadly (forms, dialogs, charts, dropdowns).",
        "You're standardized on a PrimeNG theme (Aura, Lara, Material) across your app.",
        "You rely on PrimeNG-specific TreeTable, OrderList, or PickList patterns and want them all from one vendor.",
      ]}
      featureRows={[
        { feature: "Standalone-component support (Angular 17+)", simpleTable: { verdict: "yes", note: "Native standalone." }, competitor: { verdict: "yes", note: "Standalone provider available." } },
        { feature: "Bundle size (gzipped)", simpleTable: { verdict: "yes", note: "~70 kB total." }, competitor: { verdict: "partial", note: "Adds PrimeNG runtime + theme assets." } },
        { feature: "Row + column virtualization (1M+ rows)", simpleTable: { verdict: "yes", note: "Built-in." }, competitor: { verdict: "partial", note: "scrollable + virtualScroll mode; less robust at extremes." } },
        { feature: "Column pinning (left / right)", simpleTable: { verdict: "yes", note: "Built-in, runtime drag." }, competitor: { verdict: "partial", note: "frozenColumns supported; less ergonomic." } },
        { feature: "Row grouping with aggregations", simpleTable: { verdict: "yes", note: "Built-in." }, competitor: { verdict: "partial", note: "rowGroupMode='subheader' available; aggregations are manual." } },
        { feature: "Inline cell editing", simpleTable: { verdict: "yes", note: "Built-in." }, competitor: { verdict: "yes", note: "p-cellEditor template." } },
        { feature: "Custom cell / header / footer renderers", simpleTable: { verdict: "yes", note: "Any Angular component." }, competitor: { verdict: "yes", note: "ng-template directives." } },
        { feature: "Theming", simpleTable: { verdict: "yes", note: "CSS variables; bring-your-own theme." }, competitor: { verdict: "yes", note: "PrimeNG themes (Aura, Lara, Material)." } },
        { feature: "License", simpleTable: { verdict: "yes", note: "MIT." }, competitor: { verdict: "yes", note: "MIT." } },
      ]}
      bundleSizeNote={
        <>Bundle: Simple Table for Angular ships ~70 kB gzipped including the engine and Angular bindings. PrimeNG&apos;s @primeng/table requires the broader primeng package + theme assets, typically adding 200–400 kB depending on which theme is loaded.</>
      }
      installCommand="npm install @simple-table/angular"
      migrationCallout={<>PrimeNG&apos;s <code>columns</code> + <code>value</code> inputs map to Simple Table&apos;s <code>defaultHeaders</code> + <code>rows</code>. Cell templates with <code>pTemplate=&quot;body&quot;</code> become standalone components passed as renderers.</>}
      faqs={[
        { question: "Should I drop PrimeNG entirely if I move to Simple Table?", answer: "Not necessarily. Many teams keep PrimeNG for forms and dialogs while moving the data grid to Simple Table to reduce bundle and use a more modern, signal-friendly API. Both can coexist." },
        { question: "Does Simple Table for Angular support theming?", answer: "Yes—via CSS variables. You can match an existing PrimeNG theme by mapping CSS variables, or ship a custom theme without PrimeNG dependencies." },
        { question: "Can I edit cells inline like p-cellEditor?", answer: "Yes. Simple Table ships built-in inline cell editing with custom Angular component editors." },
      ]}
      conclusion={
        <>
          <p>If PrimeNG is core to your app, p-table will probably stay. If your only PrimeNG usage is the table, Simple Table for Angular gives you a focused, smaller, standalone-first grid with the same headline features.</p>
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
