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
import { vanillaDataGridPillarPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.vanillaDataGridPillar.title,
  description: SEO_STRINGS.blogPosts.vanillaDataGridPillar.description,
  keywords: SEO_STRINGS.blogPosts.vanillaDataGridPillar.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.vanillaDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.vanillaDataGridPillar.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.vanillaDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.vanillaDataGridPillar.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/vanilla-typescript-data-grid-simple-table-core",
  },
};

export default function VanillaTypeScriptDataGridPillarPage() {
  return (
    <PillarPositioningArticle
      post={vanillaDataGridPillarPost}
      hubId="vanilla"
      heroBadges={[
        { icon: faTrophy, label: "Best for Vanilla TS", tone: "yellow" },
        { icon: faDollarSign, label: "100% Free, MIT", tone: "green" },
        { icon: faCode, label: "Framework Agnostic", tone: "blue" },
        { icon: faRocket, label: "Web Components Ready", tone: "purple" },
      ]}
      introHeading="The vanilla JavaScript / TypeScript data grid landscape in 2026"
      introParagraphs={[
        "Not every project lives inside a React, Vue, Angular, Svelte, or Solid tree. Plenty of teams ship admin tools, embedded dashboards, internal microsites, and side-rendered widgets in plain HTML/TypeScript or as web components. The free vanilla data grid options today are familiar—Tabulator, Grid.js, jSpreadsheet, Handsontable Community—and each makes its own trade-off between bundle size, license, and feature surface.",
        "simple-table-core is the headless engine behind every Simple Table framework adapter. It also ships a vanilla constructor (SimpleTableVanilla) you can drop into any HTML page or web component. Full sorting, filtering, virtualization, column pinning, row grouping, nested headers, and inline editing—free under MIT for individuals and zero-revenue companies, with simple per-product pricing for revenue-generating teams.",
        "This pillar guide covers when simple-table-core is the right vanilla data grid, how it compares with Tabulator, jSpreadsheet, Grid.js, and Handsontable, and exactly how to wire it up in a vanilla TypeScript project or a web component.",
      ]}
      whatYoullLearn={[
        "How simple-table-core compares with Tabulator, jSpreadsheet, Grid.js, and Handsontable Community",
        "Bundle size, performance, and licensing trade-offs for vanilla JS/TS data grids",
        "Step-by-step install for a vanilla TypeScript / Vite app",
        "When to pick simple-table-core over an embeddable spreadsheet vs another DOM grid",
      ]}
      whyHeading="Why vanilla TypeScript teams pick simple-table-core"
      whyIntro="simple-table-core is the engine—not a wrapper. Drop it into vanilla HTML, a web component, or a custom framework, and you get the full grid feature set without React, Vue, or Angular in your bundle."
      whyCards={[
        {
          icon: faRocket,
          title: "Framework agnostic by design",
          body: "No React. No Vue. No Angular. simple-table-core is plain TypeScript that mounts to any HTMLElement. Wire it into vanilla apps, web components, micro-frontends, or custom frameworks.",
          tone: "green",
        },
        {
          icon: faGears,
          title: "Same engine that powers six adapters",
          body: "If you ever ship a React, Vue, Angular, Svelte, or Solid version of the same UI later, the data, headers, and behaviors carry over—no rewrite, no second mental model.",
          tone: "blue",
        },
        {
          icon: faPalette,
          title: "Imperative API",
          body: "Use the TableAPI to set sort columns, filters, pagination, selection, and export imperatively. Subscribe to events, push row updates, or replay state—your code, your control flow.",
          tone: "purple",
        },
        {
          icon: faShieldHalved,
          title: "MIT for free, simple licensing for revenue",
          body: "Free for individuals and zero-revenue projects under MIT. Per-product Pro/Enterprise licensing for revenue-generating teams—no per-developer fees and no per-row pricing.",
          tone: "amber",
        },
      ]}
      comparisonHeading="How simple-table-core stacks up against vanilla incumbents"
      comparisonIntro="Below is how simple-table-core compares with the vanilla JS data grid libraries most teams evaluate. Feature support reflects what's available out-of-the-box at install time."
      competitors={["Tabulator", "Grid.js", "jSpreadsheet (CE)", "Handsontable (CE)"]}
      comparisonRows={[
        {
          feature: "Built-in UI (no styling required)",
          ours: { tone: "yes" },
          values: [{ tone: "yes" }, { tone: "yes" }, { tone: "yes" }, { tone: "yes" }],
        },
        {
          feature: "Row + column virtualization",
          ours: { tone: "yes" },
          values: [{ tone: "yes" }, { tone: "no" }, { tone: "partial" }, { tone: "yes" }],
        },
        {
          feature: "Inline cell editing",
          ours: { tone: "yes" },
          values: [{ tone: "yes" }, { tone: "no" }, { tone: "yes" }, { tone: "yes" }],
        },
        {
          feature: "Column pinning",
          ours: { tone: "yes" },
          values: [{ tone: "yes" }, { tone: "no" }, { tone: "yes" }, { tone: "yes" }],
        },
        {
          feature: "Row grouping + aggregation",
          ours: { tone: "yes" },
          values: [{ tone: "yes" }, { tone: "no" }, { tone: "partial" }, { tone: "partial" }],
        },
        {
          feature: "Framework-agnostic (no jQuery/legacy deps)",
          ours: { tone: "yes" },
          values: [{ tone: "yes" }, { tone: "yes" }, { tone: "yes" }, { tone: "partial" }],
        },
        {
          feature: "TypeScript-first types",
          ours: { tone: "yes" },
          values: [{ tone: "partial" }, { tone: "partial" }, { tone: "partial" }, { tone: "yes" }],
        },
        {
          feature: "License",
          ours: { tone: "neutral", label: "MIT / Pro" },
          values: [
            { tone: "neutral", label: "MIT" },
            { tone: "neutral", label: "MIT" },
            { tone: "neutral", label: "MIT (Pro paid)" },
            { tone: "neutral", label: "Non-commercial CE" },
          ],
        },
      ]}
      comparisonSummary="simple-table-core sits in a sweet spot: full grid features and TypeScript-first types under MIT, without the spreadsheet-style baggage of jSpreadsheet/Handsontable or the basic-table feel of Grid.js. Tabulator is the closest comparable—simple-table-core wins on TypeScript ergonomics and a cross-framework story (same engine in React/Vue/Angular/Svelte/Solid)."
      performance={{
        heading: "Performance built for embedded dashboards and web components",
        intro: "Internal benchmarks rendering 100,000 rows and 30 columns in a vanilla TypeScript / Vite app on a mid-range laptop:",
        numbers: [
          { name: "simple-table-core (vanilla)", value: "~140ms", caption: "Initial render", tone: "good" },
          { name: "Tabulator", value: "~350ms", caption: "Initial render", tone: "warn" },
          { name: "Grid.js", value: "~2.4s", caption: "Without virtualization", tone: "bad" },
        ],
        highlights: [
          "Row + column virtualization out-of-the-box—no plugins, no v-scroll setup",
          "60fps scrolling with 1M+ rows, including grouped and pinned configurations",
          "Memory profile stays flat as the dataset grows (only visible rows mounted)",
          "Tree-shakable: import only what you use; styles ship as a single CSS file",
        ],
      }}
      install={{
        heading: "Get up and running in vanilla TypeScript",
        intro: "Install the package, import the stylesheet from your entry (or via <link rel=\"stylesheet\">), and instantiate SimpleTableVanilla against an HTMLElement. Works in any bundler (Vite, esbuild, Webpack, Rollup) and inside a web component.",
        installCommand: "npm install simple-table-core",
      }}
      faqs={[
        {
          question: "Can I use simple-table-core inside a web component?",
          answer:
            "Yes. SimpleTableVanilla mounts to any HTMLElement. Pass a slotted host or shadow-root container and the grid renders inside it. Styles import works either as a side-effect or via a <link> in the shadow root.",
        },
        {
          question: "How does it compare with Tabulator?",
          answer:
            "Tabulator is the closest comparable—both ship full UIs, virtualization, editing, and grouping. simple-table-core wins on TypeScript ergonomics (TS-first types and APIs) and the cross-framework story (same engine across React/Vue/Angular/Svelte/Solid).",
        },
        {
          question: "How does it compare with Handsontable?",
          answer:
            "Handsontable Community is licensed for non-commercial use only; Handsontable Pro is paid. simple-table-core is MIT for individuals and zero-revenue projects, with simple per-product pricing for revenue-generating teams.",
        },
        {
          question: "How does it compare with jSpreadsheet?",
          answer:
            "jSpreadsheet leans into spreadsheet-style editing (formulas, copy/paste from Excel). simple-table-core is a data grid first; if you need true spreadsheet semantics (formulas, named ranges), jSpreadsheet may be a better fit.",
        },
        {
          question: "How does it compare with Grid.js?",
          answer:
            "Grid.js is small and friendly for read-only tables, but doesn't ship virtualization, editing, pinning, or grouping. If your dataset is small and you need a basic table, Grid.js is great. For anything beyond that, simple-table-core is a stronger fit.",
        },
      ]}
      conclusionHeading="The verdict for vanilla TypeScript teams"
      conclusionParagraphs={[
        "If you're building a vanilla TypeScript app, an embeddable widget, a web component, or a custom-framework UI that needs more than a basic table—simple-table-core is the strongest free choice in the vanilla JS/TS data grid space in 2026. It ships the same feature surface as Tabulator with stronger TypeScript ergonomics, and unlike Handsontable Community, the MIT terms are unambiguous for individuals and zero-revenue projects.",
        "Better still, simple-table-core is the engine behind every framework adapter Simple Table publishes. If you later ship a React, Vue, Angular, Svelte, or Solid version of the same UI, the data, headers, and behavior carry over—no rewrite, no second mental model.",
      ]}
      relatedBlogs={[
        { slug: "angular-data-grid-simple-table", title: "Angular data grid: Simple Table for standalone components" },
        { slug: "vue-nuxt-data-grid-simple-table", title: "Vue 3 & Nuxt data grid: Simple Table setup" },
        { slug: "sveltekit-data-table-simple-table", title: "Svelte & SvelteKit data table: Simple Table" },
        { slug: "solidjs-data-grid-simple-table", title: "Solid.js data grid: Simple Table with signals" },
        { slug: "tanstack-table-vs-simple-table-headless-batteries-included", title: "Headless vs batteries-included: TanStack Table vs Simple Table" },
      ]}
      cta={{
        title: "Ready to ship the vanilla TypeScript data grid users love?",
        description:
          "Install simple-table-core, mount SimpleTableVanilla against any HTMLElement, and ship sorting, filtering, virtualization, pinning, grouping, and editing in your next vanilla release.",
        primaryHref: "/frameworks/vanilla",
        primaryLabel: "Vanilla setup hub",
        secondaryHref: "/docs/installation",
        secondaryLabel: "Read the installation docs",
      }}
      extraSection={
        <section id="when-to-pick-simple-table-vanilla">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
              When simple-table-core is the right vanilla grid
            </h3>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                <strong>Pick simple-table-core if any of these apply:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                <li>You're shipping a vanilla TypeScript app or a web component</li>
                <li>You need row + column virtualization, pinning, grouping, or inline editing</li>
                <li>You want strict TypeScript types out-of-the-box</li>
                <li>You may later wrap the same engine in React/Vue/Angular/Svelte/Solid</li>
                <li>You want MIT-clean licensing for individuals and zero-revenue projects</li>
              </ul>
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                <strong>Pick something else if:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li>You need true spreadsheet semantics (formulas, named ranges)—jSpreadsheet is a better fit.</li>
                <li>You're rendering &lt;100 read-only rows—Grid.js or a plain &lt;table&gt; is enough.</li>
              </ul>
            </div>
          </div>
        </section>
      }
    />
  );
}
