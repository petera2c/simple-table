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
import { sveltekitDataTablePillarPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.sveltekitDataTablePillar.title,
  description: SEO_STRINGS.blogPosts.sveltekitDataTablePillar.description,
  keywords: SEO_STRINGS.blogPosts.sveltekitDataTablePillar.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.sveltekitDataTablePillar.title,
    description: SEO_STRINGS.blogPosts.sveltekitDataTablePillar.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.sveltekitDataTablePillar.title,
    description: SEO_STRINGS.blogPosts.sveltekitDataTablePillar.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/sveltekit-data-table-simple-table",
  },
};

export default function SvelteKitDataTablePillarPage() {
  return (
    <PillarPositioningArticle
      post={sveltekitDataTablePillarPost}
      hubId="svelte"
      heroBadges={[
        { icon: faTrophy, label: "Best for Svelte 5 / SvelteKit", tone: "yellow" },
        { icon: faDollarSign, label: "100% Free, MIT", tone: "green" },
        { icon: faCode, label: "Runes & TypeScript", tone: "blue" },
        { icon: faRocket, label: "SvelteKit Ready", tone: "purple" },
      ]}
      introHeading="The Svelte / SvelteKit data table landscape in 2026"
      introParagraphs={[
        "Svelte and SvelteKit teams ship admin tools, dashboards, and SaaS UIs that need real data tables—not just basic <table> tags. The choices today are limited: svelte-headless-table is great for headless logic but hands you no UI; SVAR DataGrid is a polished commercial option; Flowbite-Svelte and Skeleton ship table primitives without virtualization or grouping. There's no obvious 'free, batteries-included, virtualized, editable' Svelte data grid.",
        "Simple Table for Svelte fills that gap. A single Svelte component drops into Svelte 4, Svelte 5 (runes), and SvelteKit projects with full sorting, filtering, virtualization, column pinning, row grouping, nested headers, cell editing, and theming—free under MIT for individuals and zero-revenue companies. It's powered by simple-table-core, the same engine the React, Vue, Angular, Solid, and vanilla adapters share, so the API and behavior match across stacks.",
        "This pillar guide explains when Simple Table is the right Svelte data table, how it compares with svelte-headless-table, SVAR DataGrid, and Flowbite-Svelte, and exactly how to install and use it in a SvelteKit page.",
      ]}
      whatYoullLearn={[
        "How Simple Table's Svelte adapter compares with svelte-headless-table, SVAR DataGrid, and Flowbite-Svelte",
        "Bundle size, performance, and licensing trade-offs for Svelte / SvelteKit data tables",
        "Step-by-step install for a Svelte 5 component in SvelteKit",
        "Where to migrate from when leaving svelte-headless-table or a hand-rolled <table>",
      ]}
      whyHeading="Why Svelte and SvelteKit teams pick Simple Table"
      whyIntro="Simple Table is built for the Svelte apps that need a real grid—sorting, filtering, virtualization, editing—without writing all of that on top of a headless table library."
      whyCards={[
        {
          icon: faRocket,
          title: "Svelte 5 and runes friendly",
          body: "Works with Svelte 4 reactive declarations and Svelte 5 runes ($state, $derived). Pass plain arrays for headers/rows; the grid keeps itself in sync without you wiring up reactivity.",
          tone: "green",
        },
        {
          icon: faGears,
          title: "SvelteKit-ready",
          body: "Drop the component into any +page.svelte or +layout.svelte. Works with SvelteKit's server-side rendering and Vite dev server—no special build configuration required.",
          tone: "blue",
        },
        {
          icon: faPalette,
          title: "Batteries included, no headless wiring",
          body: "Unlike svelte-headless-table, you don't write your own header row, body, virtualization, or paging UI. Drop the component in and customize what you need.",
          tone: "purple",
        },
        {
          icon: faShieldHalved,
          title: "MIT for free, simple licensing for revenue",
          body: "Free for individuals and zero-revenue projects under MIT. Per-product Pro/Enterprise licensing for revenue-generating teams—no per-developer fees.",
          tone: "amber",
        },
      ]}
      comparisonHeading="How Simple Table stacks up against Svelte incumbents"
      comparisonIntro="Below is how Simple Table for Svelte compares with the table libraries Svelte / SvelteKit teams most commonly evaluate. Feature support reflects what's available out-of-the-box."
      competitors={["svelte-headless-table", "SVAR DataGrid", "Flowbite-Svelte Table"]}
      comparisonRows={[
        {
          feature: "Built-in UI (no styling required)",
          ours: { tone: "yes" },
          values: [{ tone: "no" }, { tone: "yes" }, { tone: "yes" }],
        },
        {
          feature: "Row + column virtualization",
          ours: { tone: "yes" },
          values: [{ tone: "no" }, { tone: "yes" }, { tone: "no" }],
        },
        {
          feature: "Inline cell editing",
          ours: { tone: "yes" },
          values: [{ tone: "no" }, { tone: "yes" }, { tone: "no" }],
        },
        {
          feature: "Column pinning",
          ours: { tone: "yes" },
          values: [{ tone: "no" }, { tone: "yes" }, { tone: "no" }],
        },
        {
          feature: "Row grouping + aggregation",
          ours: { tone: "yes" },
          values: [{ tone: "no" }, { tone: "yes" }, { tone: "no" }],
        },
        {
          feature: "Svelte 5 runes support",
          ours: { tone: "yes" },
          values: [{ tone: "partial" }, { tone: "yes" }, { tone: "yes" }],
        },
        {
          feature: "TypeScript-first types",
          ours: { tone: "yes" },
          values: [{ tone: "yes" }, { tone: "yes" }, { tone: "yes" }],
        },
        {
          feature: "License",
          ours: { tone: "neutral", label: "MIT / Pro" },
          values: [
            { tone: "neutral", label: "MIT" },
            { tone: "neutral", label: "Commercial" },
            { tone: "neutral", label: "MIT" },
          ],
        },
      ]}
      comparisonSummary="Simple Table is the only free Svelte data grid with virtualization, pinning, grouping, and inline editing out-of-the-box. svelte-headless-table is excellent for custom UIs but doesn't ship one. SVAR DataGrid is feature-rich but commercial."
      performance={{
        heading: "Performance built for SvelteKit dashboards",
        intro: "Internal benchmarks rendering 100,000 rows and 30 columns in a Svelte 5 / Vite app on a mid-range laptop:",
        numbers: [
          { name: "Simple Table for Svelte", value: "~160ms", caption: "Initial render", tone: "good" },
          { name: "svelte-headless-table + custom UI", value: "~900ms", caption: "Without virtualization", tone: "warn" },
          { name: "Plain <table> with all rows", value: "~3.0s", caption: "Browser layout struggles", tone: "bad" },
        ],
        highlights: [
          "Row + column virtualization out-of-the-box—no custom Svelte virtualization code",
          "60fps scrolling with 1M+ rows, including grouped and pinned configurations",
          "Compatible with $state, $derived, and store-based data flows",
          "Tree-shakable: bundle only includes the SimpleTable surface you import",
        ],
      }}
      install={{
        heading: "Get up and running in a SvelteKit page",
        intro: "Install the package, import the stylesheet from any component or your root +layout.svelte, and drop <SimpleTable /> into any +page.svelte. No special SvelteKit configuration required.",
        installCommand: "npm install @simple-table/svelte",
      }}
      faqs={[
        {
          question: "Does Simple Table for Svelte work with Svelte 5 and runes?",
          answer:
            "Yes. The adapter is built against Svelte 5 and works with $state, $derived, and store-based data sources. Svelte 4 is also supported as a peer (>=4.0.0).",
        },
        {
          question: "Is the Svelte adapter built on top of svelte-headless-table?",
          answer:
            "No. @simple-table/svelte wraps simple-table-core, the same vanilla TypeScript engine used by the React, Vue, Angular, Solid, and vanilla adapters.",
        },
        {
          question: "Can I use Svelte components as cell renderers?",
          answer:
            "Yes. Cell renderers, header renderers, footer renderers, and column editors all accept Svelte components, so you keep Svelte's reactivity and slots inside your renderers.",
        },
        {
          question: "How does it compare with svelte-headless-table?",
          answer:
            "svelte-headless-table is great if you want to build the UI yourself—it gives you headless table state and lets you render anything. Simple Table ships the UI, virtualization, pinning, grouping, and editing as a single component, so you get a working grid in minutes instead of days.",
        },
        {
          question: "How does it compare with SVAR DataGrid?",
          answer:
            "SVAR DataGrid is a polished, feature-rich commercial Svelte grid. Simple Table covers the same broad surface area (virtualization, pinning, grouping, editing) under MIT for individuals and zero-revenue projects, with simple per-product pricing for revenue-generating teams.",
        },
      ]}
      conclusionHeading="The verdict for Svelte and SvelteKit teams"
      conclusionParagraphs={[
        "If you're building a Svelte or SvelteKit app that displays more than a few hundred rows, needs editing, virtualization, pinning, or grouping, and you don't want to write all the table UI on top of a headless library—Simple Table is the strongest free choice in the Svelte ecosystem in 2026.",
        "Simple Table for Svelte ships as a single component, integrates cleanly with Svelte 5 runes, supports TypeScript strict mode, and shares its core with five other framework adapters—so a Svelte + React shop keeps a single grid mental model across both stacks.",
      ]}
      relatedBlogs={[
        { slug: "vue-nuxt-data-grid-simple-table", title: "Vue 3 & Nuxt data grid: Simple Table setup" },
        { slug: "angular-data-grid-simple-table", title: "Angular data grid: Simple Table for standalone components" },
        { slug: "solidjs-data-grid-simple-table", title: "Solid.js data grid: Simple Table with signals" },
        { slug: "vanilla-typescript-data-grid-simple-table-core", title: "Vanilla TypeScript data grid with simple-table-core" },
        { slug: "tanstack-table-vs-simple-table-headless-batteries-included", title: "Headless vs batteries-included: TanStack Table vs Simple Table" },
      ]}
      cta={{
        title: "Ready to ship the SvelteKit data table users love?",
        description:
          "Install @simple-table/svelte, drop <SimpleTable /> into your SvelteKit page, and ship sorting, filtering, virtualization, pinning, grouping, and editing in your next release.",
        primaryHref: "/frameworks/svelte",
        primaryLabel: "Svelte setup hub",
        secondaryHref: "/docs/installation",
        secondaryLabel: "Read the installation docs",
      }}
      extraSection={
        <section id="when-to-pick-simple-table-svelte">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
              When Simple Table is the right Svelte grid
            </h3>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                <strong>Pick Simple Table for Svelte if any of these apply:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                <li>You need a working data grid in minutes, not days of headless wiring</li>
                <li>You need row + column virtualization for tables with thousands to millions of rows</li>
                <li>You need pinning, nested headers, grouping, or inline editing</li>
                <li>You're on Svelte 5 with runes and want a grid that actually understands $state</li>
                <li>You want a consistent grid across Svelte, React, Vue, Angular, and Solid teams</li>
              </ul>
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                <strong>Stay on what you have if:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li>You want full UI control and svelte-headless-table is already wired into your design system.</li>
                <li>You're rendering &lt;100 rows with no editing or grouping—plain Tailwind/HTML is enough.</li>
              </ul>
            </div>
          </div>
        </section>
      }
    />
  );
}
