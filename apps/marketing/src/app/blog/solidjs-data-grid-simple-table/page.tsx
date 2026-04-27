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
import { solidjsDataGridPillarPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.solidjsDataGridPillar.title,
  description: SEO_STRINGS.blogPosts.solidjsDataGridPillar.description,
  keywords: SEO_STRINGS.blogPosts.solidjsDataGridPillar.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.solidjsDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.solidjsDataGridPillar.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.solidjsDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.solidjsDataGridPillar.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/solidjs-data-grid-simple-table",
  },
};

export default function SolidJsDataGridPillarPage() {
  return (
    <PillarPositioningArticle
      post={solidjsDataGridPillarPost}
      hubId="solid"
      heroBadges={[
        { icon: faTrophy, label: "Best for Solid 1+", tone: "yellow" },
        { icon: faDollarSign, label: "100% Free, MIT", tone: "green" },
        { icon: faCode, label: "Signals & TypeScript", tone: "blue" },
        { icon: faRocket, label: "Solid Start Ready", tone: "purple" },
      ]}
      introHeading="The Solid.js data grid landscape in 2026"
      introParagraphs={[
        "Solid is fast. Its fine-grained reactivity model and compile-time JSX deliver some of the best browser performance available—but the data grid ecosystem hasn't fully caught up. TanStack Solid Table is a port of the popular React headless library, Kobalte ships a low-level table primitive, and most Solid teams either render plain <table> tags or build their own grid on top of Solid signals.",
        "Simple Table for Solid plugs that gap. A single component drops into Solid 1+ projects (including Solid Start) with full sorting, filtering, virtualization, column pinning, row grouping, nested headers, cell editing, and theming—free under MIT for individuals and zero-revenue companies. It's powered by simple-table-core, the same vanilla TypeScript engine the React, Vue, Angular, Svelte, and vanilla adapters share, but with first-class signal-driven props on the Solid side.",
        "This pillar guide explains when Simple Table is the right Solid data grid, how it compares with TanStack Solid Table and Kobalte's table primitives, and exactly how to install and use it in a Solid Start app.",
      ]}
      whatYoullLearn={[
        "How Simple Table's Solid adapter compares with TanStack Solid Table and Kobalte",
        "Bundle size, performance, and licensing trade-offs for Solid data grids",
        "Step-by-step install for a Solid Start project",
        "Where to migrate from when leaving TanStack Solid Table or a hand-rolled <table>",
      ]}
      whyHeading="Why Solid teams pick Simple Table"
      whyIntro="Simple Table is built for Solid apps that need a real grid—virtualized, editable, themed—without writing it on top of a headless table library or porting React patterns."
      whyCards={[
        {
          icon: faRocket,
          title: "Signals-friendly",
          body: "Pass a signal getter or a plain array; Solid's fine-grained reactivity flows through to the grid without re-rendering the whole tree. Updates feel instant because they are.",
          tone: "green",
        },
        {
          icon: faGears,
          title: "Solid Start ready",
          body: "Drop the component into any Solid Start route. Works with Vite-based dev and prod builds—no special configuration required.",
          tone: "blue",
        },
        {
          icon: faPalette,
          title: "Batteries included",
          body: "Unlike TanStack Solid Table, you don't write your own header row, body, virtualization, or pagination UI. Drop the component in and customize what you need.",
          tone: "purple",
        },
        {
          icon: faShieldHalved,
          title: "MIT for free, simple licensing for revenue",
          body: "Free for individuals and zero-revenue projects under MIT. Per-product Pro/Enterprise licensing for revenue-generating teams—no per-developer fees.",
          tone: "amber",
        },
      ]}
      comparisonHeading="How Simple Table stacks up against Solid incumbents"
      comparisonIntro="Below is how Simple Table for Solid compares with the table libraries Solid teams most commonly evaluate. Feature support reflects what's available out-of-the-box."
      competitors={["TanStack Solid Table", "Kobalte (table primitive)", "Plain <table>"]}
      comparisonRows={[
        {
          feature: "Built-in UI (no styling required)",
          ours: { tone: "yes" },
          values: [{ tone: "no" }, { tone: "no" }, { tone: "no" }],
        },
        {
          feature: "Row + column virtualization",
          ours: { tone: "yes" },
          values: [{ tone: "partial", label: "@tanstack/solid-virtual" }, { tone: "no" }, { tone: "no" }],
        },
        {
          feature: "Inline cell editing",
          ours: { tone: "yes" },
          values: [{ tone: "no" }, { tone: "no" }, { tone: "no" }],
        },
        {
          feature: "Column pinning",
          ours: { tone: "yes" },
          values: [{ tone: "partial" }, { tone: "no" }, { tone: "no" }],
        },
        {
          feature: "Row grouping + aggregation",
          ours: { tone: "yes" },
          values: [{ tone: "partial" }, { tone: "no" }, { tone: "no" }],
        },
        {
          feature: "Signals-aware props",
          ours: { tone: "yes" },
          values: [{ tone: "yes" }, { tone: "yes" }, { tone: "neutral", label: "—" }],
        },
        {
          feature: "TypeScript-first types",
          ours: { tone: "yes" },
          values: [{ tone: "yes" }, { tone: "yes" }, { tone: "neutral", label: "—" }],
        },
        {
          feature: "License",
          ours: { tone: "neutral", label: "MIT / Pro" },
          values: [
            { tone: "neutral", label: "MIT" },
            { tone: "neutral", label: "MIT" },
            { tone: "neutral", label: "—" },
          ],
        },
      ]}
      comparisonSummary="Simple Table is the only batteries-included Solid data grid: virtualization, pinning, grouping, and inline editing without the headless wiring you'd do on top of TanStack Solid Table. Kobalte is excellent for accessible primitives but doesn't try to be a full grid."
      performance={{
        heading: "Performance built for Solid apps",
        intro: "Internal benchmarks rendering 100,000 rows and 30 columns in a Solid 1.8 / Vite app on a mid-range laptop:",
        numbers: [
          { name: "Simple Table for Solid", value: "~140ms", caption: "Initial render", tone: "good" },
          { name: "TanStack Solid Table + virtual", value: "~600ms", caption: "After plumbing virtualization", tone: "warn" },
          { name: "Plain <table> with all rows", value: "~3.0s", caption: "Browser layout struggles", tone: "bad" },
        ],
        highlights: [
          "Row + column virtualization out-of-the-box—no @tanstack/solid-virtual integration code",
          "60fps scrolling with 1M+ rows, including grouped and pinned configurations",
          "Fine-grained reactivity preserved: cell updates don't re-render unrelated rows",
          "Tree-shakable: bundle only includes the SimpleTable surface you import",
        ],
      }}
      install={{
        heading: "Get up and running in a Solid Start app",
        intro: "Install the package, import the stylesheet from any component or your root entry, and use <SimpleTable /> in any route or component.",
        installCommand: "npm install @simple-table/solid",
      }}
      faqs={[
        {
          question: "Does Simple Table for Solid work with Solid Start?",
          answer:
            "Yes. The package is Vite/ESM friendly and ships its own stylesheet. Drop the component in any Solid Start route or layout—no special build configuration required.",
        },
        {
          question: "Is the Solid adapter built on TanStack Solid Table?",
          answer:
            "No. @simple-table/solid wraps simple-table-core, the same vanilla TypeScript engine used by the React, Vue, Angular, Svelte, and vanilla adapters.",
        },
        {
          question: "Does it preserve Solid's fine-grained reactivity?",
          answer:
            "Yes. Pass signal getters or plain arrays for headers/rows. Cell updates flow through Solid's reactivity model without re-rendering unrelated rows.",
        },
        {
          question: "How does it compare with TanStack Solid Table?",
          answer:
            "TanStack Solid Table is a headless library; you build your own UI on top. Simple Table ships the UI, virtualization, pinning, grouping, and editing as a single component. Pick TanStack if you want full UI control; pick Simple Table if you want a working grid in minutes.",
        },
        {
          question: "How does it compare with Kobalte?",
          answer:
            "Kobalte is excellent for accessible primitives—the same way Radix is for React. It doesn't aim to be a full data grid. Simple Table covers the data-grid surface (virtualization, editing, grouping) that Kobalte intentionally leaves out.",
        },
      ]}
      conclusionHeading="The verdict for Solid teams"
      conclusionParagraphs={[
        "If you're building a Solid or Solid Start app that displays more than a few hundred rows, needs editing, virtualization, pinning, or grouping, and you don't want to write all the table UI yourself on top of a headless library—Simple Table is the strongest free choice in the Solid ecosystem in 2026.",
        "Simple Table for Solid ships as a single component, integrates cleanly with Solid signals and Solid Start, supports TypeScript strict mode, and shares its core with five other framework adapters—so a Solid + React or Solid + Vue org keeps a single grid mental model across stacks.",
      ]}
      relatedBlogs={[
        { slug: "sveltekit-data-table-simple-table", title: "Svelte & SvelteKit data table: Simple Table" },
        { slug: "angular-data-grid-simple-table", title: "Angular data grid: Simple Table for standalone components" },
        { slug: "vue-nuxt-data-grid-simple-table", title: "Vue 3 & Nuxt data grid: Simple Table setup" },
        { slug: "vanilla-typescript-data-grid-simple-table-core", title: "Vanilla TypeScript data grid with simple-table-core" },
        { slug: "tanstack-table-vs-simple-table-headless-batteries-included", title: "Headless vs batteries-included: TanStack Table vs Simple Table" },
      ]}
      cta={{
        title: "Ready to ship the Solid data grid users love?",
        description:
          "Install @simple-table/solid, drop <SimpleTable /> into any route, and ship sorting, filtering, virtualization, pinning, grouping, and editing in your next Solid release.",
        primaryHref: "/frameworks/solid",
        primaryLabel: "Solid setup hub",
        secondaryHref: "/docs/installation",
        secondaryLabel: "Read the installation docs",
      }}
      extraSection={
        <section id="when-to-pick-simple-table-solid">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
              When Simple Table is the right Solid grid
            </h3>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                <strong>Pick Simple Table for Solid if any of these apply:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                <li>You need a working grid quickly—virtualized, editable, themed</li>
                <li>You don't want to plumb @tanstack/solid-virtual on top of TanStack Solid Table</li>
                <li>You need pinning, grouping, aggregations, or inline editing</li>
                <li>You want signals-aware reactivity throughout the grid lifecycle</li>
                <li>You need a consistent grid across Solid and other frameworks (React/Vue/Angular/Svelte)</li>
              </ul>
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                <strong>Stay on what you have if:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li>You're using TanStack Solid Table specifically because you want full UI control.</li>
                <li>You're rendering &lt;100 rows with no advanced features—plain HTML is fine.</li>
              </ul>
            </div>
          </div>
        </section>
      }
    />
  );
}
