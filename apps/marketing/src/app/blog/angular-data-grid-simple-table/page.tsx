import { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCode,
  faDollarSign,
  faGears,
  faPalette,
  faRocket,
  faShieldHalved,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { SEO_STRINGS } from "@/constants/strings/seo";
import PillarPositioningArticle from "@/components/blog/PillarPositioningArticle";
import { angularDataGridPillarPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.angularDataGridPillar.title,
  description: SEO_STRINGS.blogPosts.angularDataGridPillar.description,
  keywords: SEO_STRINGS.blogPosts.angularDataGridPillar.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.angularDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.angularDataGridPillar.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.angularDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.angularDataGridPillar.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/angular-data-grid-simple-table",
  },
};

export default function AngularDataGridPillarPage() {
  return (
    <PillarPositioningArticle
      post={angularDataGridPillarPost}
      hubId="angular"
      heroBadges={[
        { icon: faTrophy, label: "Best for Angular 17+", tone: "yellow" },
        { icon: faDollarSign, label: "100% Free, MIT", tone: "green" },
        { icon: faCode, label: "Angular & TypeScript", tone: "blue" },
        { icon: faRocket, label: "Standalone-ready", tone: "purple" },
      ]}
      introHeading="The Angular data grid landscape in 2026"
      introParagraphs={[
        "Angular teams shipping internal tools, admin dashboards, fintech apps, and operations consoles all hit the same wall: most full-featured Angular data grids are either expensive (AG Grid Enterprise, Kendo UI for Angular, DevExtreme) or thin wrappers around table primitives (ngx-datatable, Angular Material's MatTable, PrimeNG Table). You either pay per-developer for features you barely use, or you assemble sorting, filtering, virtualization, pinning, and grouping by hand.",
        "Simple Table for Angular gives you a single standalone component that drops into Angular 17+ apps with full sorting, filtering, virtualization, column pinning, row grouping, nested headers, cell editing, and theming—free under MIT for individuals and zero-revenue companies. It's powered by simple-table-core (the same engine the React, Vue, Svelte, Solid, and vanilla adapters share), so you get the full feature set without an enterprise contract.",
        "This pillar guide covers when Simple Table is the right Angular data grid, how it compares with the popular incumbents, and exactly how to install and use it in a standalone Angular app.",
      ]}
      whatYoullLearn={[
        "How Simple Table's Angular adapter compares with AG Grid Angular, ngx-datatable, PrimeNG Table, and Angular Material",
        "Bundle size, performance, and licensing trade-offs for Angular data grids",
        "Step-by-step install for a standalone Angular component",
        "Where to migrate from when leaving ngx-datatable, MatTable, or AG Grid",
      ]}
      whyHeading="Why Angular teams pick Simple Table"
      whyIntro="Simple Table is built for the Angular workflows that produce real product UIs: data tables with editing, virtualization, custom renderers, and pixel-control over styling—without an enterprise license."
      whyCards={[
        {
          icon: faRocket,
          title: "Performance for big tables",
          body: "Virtualized rows and columns keep 100,000+ row Angular dashboards smooth at 60fps. No plugin assembly, no manual CDK virtual-scroll wiring, no rendering blocks at scroll.",
          tone: "green",
        },
        {
          icon: faGears,
          title: "Standalone-ready",
          body: "SimpleTableComponent is a standalone Angular component—drop it into the imports array of any Angular 17+ component. No NgModule rewrite, no providers tree to thread, no DI gymnastics.",
          tone: "blue",
        },
        {
          icon: faPalette,
          title: "Angular-native renderers",
          body: "Use real Angular components for cell renderers, headers, footers, and editors. Inputs and outputs work the way Angular developers expect; types ship from @simple-table/angular.",
          tone: "purple",
        },
        {
          icon: faShieldHalved,
          title: "Free for hobby and pre-revenue, friendly for everyone else",
          body: "MIT for individuals and zero-revenue projects, simple per-product Pro/Enterprise pricing for revenue-generating teams—no per-seat AG-Grid-style fees that scale with your engineering org.",
          tone: "amber",
        },
      ]}
      comparisonHeading="How Simple Table stacks up against Angular incumbents"
      comparisonIntro="Below is how Simple Table for Angular compares with the four data grid libraries Angular teams most commonly evaluate. Feature support reflects what's available out-of-the-box at install time, not what's possible with a few weeks of integration work."
      competitors={["AG Grid Angular (Community)", "ngx-datatable", "PrimeNG Table", "Angular Material MatTable"]}
      comparisonRows={[
        {
          feature: "Built-in UI (no styling required)",
          ours: { tone: "yes" },
          values: [{ tone: "yes" }, { tone: "partial" }, { tone: "yes" }, { tone: "partial" }],
        },
        {
          feature: "Row + column virtualization",
          ours: { tone: "yes" },
          values: [
            { tone: "partial", label: "Enterprise" },
            { tone: "partial", label: "Rows only" },
            { tone: "partial", label: "Rows only" },
            { tone: "partial", label: "Via CDK" },
          ],
        },
        {
          feature: "Inline cell editing",
          ours: { tone: "yes" },
          values: [{ tone: "partial", label: "Enterprise" }, { tone: "no" }, { tone: "yes" }, { tone: "no" }],
        },
        {
          feature: "Column pinning",
          ours: { tone: "yes" },
          values: [{ tone: "partial", label: "Enterprise" }, { tone: "no" }, { tone: "yes" }, { tone: "no" }],
        },
        {
          feature: "Row grouping + aggregation",
          ours: { tone: "yes" },
          values: [{ tone: "partial", label: "Enterprise" }, { tone: "no" }, { tone: "yes" }, { tone: "no" }],
        },
        {
          feature: "Standalone component support",
          ours: { tone: "yes" },
          values: [{ tone: "yes" }, { tone: "yes" }, { tone: "yes" }, { tone: "yes" }],
        },
        {
          feature: "TypeScript-first types",
          ours: { tone: "yes" },
          values: [{ tone: "yes" }, { tone: "partial" }, { tone: "yes" }, { tone: "yes" }],
        },
        {
          feature: "License",
          ours: { tone: "neutral", label: "MIT / Pro" },
          values: [
            { tone: "neutral", label: "MIT + paid Enterprise" },
            { tone: "neutral", label: "MIT" },
            { tone: "neutral", label: "MIT" },
            { tone: "neutral", label: "MIT" },
          ],
        },
      ]}
      comparisonSummary="Simple Table is the only Angular data grid that ships virtualization, pinning, grouping, and inline editing without a paid tier. ngx-datatable and Angular Material are free but stop at basic table primitives; AG Grid puts everything advanced behind Enterprise; PrimeNG is closest, but you take on the entire PrimeNG surface area."
      performance={{
        heading: "Performance built for Angular dashboards",
        intro: "Internal benchmarks rendering 100,000 rows and 30 columns in a standalone Angular 18 app on a mid-range laptop:",
        numbers: [
          { name: "Simple Table for Angular", value: "~180ms", caption: "Initial render", tone: "good" },
          { name: "ngx-datatable", value: "~700ms", caption: "Initial render", tone: "warn" },
          { name: "Angular Material MatTable", value: "~3.4s", caption: "Without CDK virtual scroll", tone: "bad" },
        ],
        highlights: [
          "Row + column virtualization out-of-the-box—no @angular/cdk virtual-scroll plumbing",
          "60fps scrolling with 1M+ rows, including grouped and pinned configurations",
          "Memory profile stays flat as the dataset grows (only visible rows mounted)",
          "Change detection stays cheap: the grid runs its own update cycle and avoids re-rendering siblings",
        ],
      }}
      install={{
        heading: "Get up and running in a standalone Angular component",
        intro: "Install the package, import the stylesheet from your global styles or main.ts, and add SimpleTableComponent to your standalone component's imports array. No NgModule edits required.",
        installCommand: "npm install @simple-table/angular",
      }}
      faqs={[
        {
          question: "Is Simple Table for Angular a wrapper around the React adapter?",
          answer:
            "No. @simple-table/angular wraps simple-table-core, the same vanilla TypeScript engine the React, Vue, Svelte, Solid, and vanilla adapters use. There is no React in the dependency tree.",
        },
        {
          question: "Which Angular versions are supported?",
          answer:
            "Angular 17, 18, 19, and 20 are supported as peers (>=17.0.0 <22.0.0). Standalone components are first-class; NgModules also work.",
        },
        {
          question: "Can I use Angular components as cell renderers?",
          answer:
            "Yes. Cell renderers, header renderers, footer renderers, and column editors all accept Angular components, so you keep dependency injection, change detection, and the Angular lifecycle inside your renderers.",
        },
        {
          question: "How does it compare with ngx-datatable?",
          answer:
            "ngx-datatable is great for read-heavy Angular tables, but lacks built-in column virtualization, pinning, row grouping, and inline editing. Simple Table includes all of those out-of-the-box and provides a stronger TypeScript surface.",
        },
        {
          question: "How does it compare with AG Grid Angular?",
          answer:
            "AG Grid Community covers a similar surface area for free; AG Grid Enterprise adds row grouping, aggregation, pivoting, and pinning behind a paid license. Simple Table includes those capabilities for individuals and zero-revenue projects under MIT, with simple per-product Pro/Enterprise pricing for revenue-generating teams.",
        },
      ]}
      conclusionHeading="The verdict for Angular teams"
      conclusionParagraphs={[
        "If you are building an Angular app that displays more than a few hundred rows, needs editing, virtualization, pinning, or grouping, and you don't want to negotiate per-developer licensing—Simple Table is the strongest free choice in the Angular ecosystem in 2026. It's the only library that gives you the AG-Grid-Enterprise feature surface without the AG-Grid-Enterprise invoice.",
        "Simple Table for Angular ships as a standalone component, integrates cleanly with Angular 17+, supports TypeScript strict mode, and shares its core with five other framework adapters—so a multi-framework org keeps a single grid mental model across its React, Vue, Angular, Svelte, Solid, and vanilla apps.",
      ]}
      relatedBlogs={[
        { slug: "vue-nuxt-data-grid-simple-table", title: "Vue 3 & Nuxt data grid: Simple Table setup" },
        { slug: "sveltekit-data-table-simple-table", title: "Svelte & SvelteKit data table: Simple Table" },
        { slug: "vanilla-typescript-data-grid-simple-table-core", title: "Vanilla TypeScript data grid with simple-table-core" },
        { slug: "tanstack-table-vs-simple-table-headless-batteries-included", title: "Headless vs batteries-included: TanStack Table vs Simple Table" },
        { slug: "ag-grid-pricing-license-breakdown-2026", title: "AG Grid pricing & license breakdown 2026" },
      ]}
      cta={{
        title: "Ready to ship the Angular data grid users love?",
        description:
          "Install @simple-table/angular, drop SimpleTableComponent into your standalone component, and ship sorting, filtering, virtualization, pinning, grouping, and editing in your next Angular release.",
        primaryHref: "/frameworks/angular",
        primaryLabel: "Angular setup hub",
        secondaryHref: "/docs/installation",
        secondaryLabel: "Read the installation docs",
      }}
      extraSection={
        <section id="when-to-pick-simple-table-angular">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
              When Simple Table is the right Angular grid
            </h3>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                <strong>Pick Simple Table for Angular if you need any of these and you don't want to pay per developer:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                <li>Row + column virtualization for tables with thousands to millions of rows</li>
                <li>Pinned columns, nested headers, or row grouping with aggregations</li>
                <li>Inline cell editing with Angular component editors</li>
                <li>A consistent grid component across Angular and other frameworks (React, Vue, Svelte, Solid)</li>
                <li>Strict TypeScript types for headers, rows, and the imperative TableAPI</li>
              </ul>
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                <strong>Stay on what you have if:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li>You're rendering &lt;100 rows with read-only cells and Angular Material's look already fits—MatTable is fine.</li>
                <li>Your team already pays for AG Grid Enterprise and uses pivoting, charting, or its master/detail; Simple Table doesn't try to replace AG Grid Enterprise's analytical surface.</li>
              </ul>
            </div>
          </div>
        </section>
      }
    />
  );
}
