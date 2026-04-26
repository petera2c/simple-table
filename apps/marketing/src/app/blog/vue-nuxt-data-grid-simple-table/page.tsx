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
import { vueNuxtDataGridPillarPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.vueNuxtDataGridPillar.title,
  description: SEO_STRINGS.blogPosts.vueNuxtDataGridPillar.description,
  keywords: SEO_STRINGS.blogPosts.vueNuxtDataGridPillar.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.vueNuxtDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.vueNuxtDataGridPillar.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.vueNuxtDataGridPillar.title,
    description: SEO_STRINGS.blogPosts.vueNuxtDataGridPillar.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/vue-nuxt-data-grid-simple-table",
  },
};

export default function VueNuxtDataGridPillarPage() {
  return (
    <PillarPositioningArticle
      post={vueNuxtDataGridPillarPost}
      hubId="vue"
      heroBadges={[
        { icon: faTrophy, label: "Best for Vue 3 / Nuxt", tone: "yellow" },
        { icon: faDollarSign, label: "100% Free, MIT", tone: "green" },
        { icon: faCode, label: "Composition API", tone: "blue" },
        { icon: faRocket, label: "Vite & Nuxt Ready", tone: "purple" },
      ]}
      introHeading="The Vue 3 / Nuxt data grid landscape in 2026"
      introParagraphs={[
        "Vue and Nuxt teams shipping admin panels, finance tools, internal CRMs, and back-office dashboards usually pick from a familiar shortlist: Vuetify's v-data-table, PrimeVue DataTable, Element Plus el-table, Naive UI's n-data-table, Vue Good Table, Quasar QTable, or AG Grid Vue. Each works for read-mostly tables. None ship full-blown row+column virtualization, pinning, grouping, and inline editing without you adopting an entire UI ecosystem (Vuetify, Element Plus, PrimeVue) or paying AG Grid Enterprise.",
        "Simple Table for Vue is the alternative: a single component that drops into Vue 3 SFCs and Nuxt apps with the full grid feature set—sorting, filtering, virtualization, column pinning, row grouping, nested headers, cell editing, and theming—free under MIT for individuals and zero-revenue companies. It's powered by simple-table-core, the same engine the React, Angular, Svelte, Solid, and vanilla adapters use, so you get parity across stacks.",
        "This pillar guide shows when Simple Table is the right Vue / Nuxt data grid, how it compares with Vuetify, PrimeVue, Vue Good Table, and Element Plus, and exactly how to wire it up in a Vue 3 SFC or a Nuxt page.",
      ]}
      whatYoullLearn={[
        "How Simple Table's Vue adapter compares with Vuetify v-data-table, PrimeVue DataTable, Vue Good Table, Element Plus, and AG Grid Vue",
        "Bundle size, performance, and licensing trade-offs for Vue/Nuxt data grids",
        "Step-by-step install for a Vue 3 <script setup> SFC and Nuxt 3+",
        "Where to migrate from when leaving Vuetify or PrimeVue tables",
      ]}
      whyHeading="Why Vue and Nuxt teams pick Simple Table"
      whyIntro="Simple Table is built for the Vue dashboards and Nuxt apps that ship real product UIs—editable, virtualized, themed—without forcing you into a single UI library."
      whyCards={[
        {
          icon: faRocket,
          title: "Composition API & <script setup> first",
          body: "The grid takes plain refs and reactive arrays. No render functions, no global plugin install. Drop <SimpleTable /> into any SFC and pass props.",
          tone: "green",
        },
        {
          icon: faGears,
          title: "Nuxt 3 friendly",
          body: "Works with Nuxt's auto-imports and Vite-based dev server. Wrap in <ClientOnly> if you need to skip SSR, or render server-side with hydration—your choice, no special build config required.",
          tone: "blue",
        },
        {
          icon: faPalette,
          title: "No UI library lock-in",
          body: "Use Vuetify, PrimeVue, Element Plus, Naive UI, Tailwind, or your own design system around the grid. Simple Table provides the grid; you keep ownership of the rest of the UI.",
          tone: "purple",
        },
        {
          icon: faShieldHalved,
          title: "MIT for free, sane pricing if you make money",
          body: "Free for individuals and zero-revenue projects. Per-product Pro/Enterprise pricing for revenue-generating teams—no per-seat AG Grid Enterprise invoice that scales with headcount.",
          tone: "amber",
        },
      ]}
      comparisonHeading="How Simple Table stacks up against Vue incumbents"
      comparisonIntro="Below is how Simple Table for Vue compares with the data grid libraries Vue 3 / Nuxt teams most commonly evaluate. Feature support reflects what's available out-of-the-box, not what's possible after deep integration."
      competitors={["Vuetify v-data-table", "PrimeVue DataTable", "Element Plus el-table", "Vue Good Table"]}
      comparisonRows={[
        {
          feature: "Built-in UI (no styling required)",
          ours: { tone: "yes" },
          values: [{ tone: "yes" }, { tone: "yes" }, { tone: "yes" }, { tone: "yes" }],
        },
        {
          feature: "Row + column virtualization",
          ours: { tone: "yes" },
          values: [{ tone: "partial", label: "v-data-table-virtual" }, { tone: "partial", label: "Rows only" }, { tone: "partial", label: "Rows only" }, { tone: "no" }],
        },
        {
          feature: "Inline cell editing",
          ours: { tone: "yes" },
          values: [{ tone: "no" }, { tone: "yes" }, { tone: "partial" }, { tone: "no" }],
        },
        {
          feature: "Column pinning",
          ours: { tone: "yes" },
          values: [{ tone: "partial", label: "Sticky only" }, { tone: "yes" }, { tone: "yes" }, { tone: "no" }],
        },
        {
          feature: "Row grouping + aggregation",
          ours: { tone: "yes" },
          values: [{ tone: "no" }, { tone: "partial" }, { tone: "no" }, { tone: "no" }],
        },
        {
          feature: "Works without adopting an entire UI library",
          ours: { tone: "yes" },
          values: [{ tone: "no" }, { tone: "no" }, { tone: "no" }, { tone: "yes" }],
        },
        {
          feature: "TypeScript-first types",
          ours: { tone: "yes" },
          values: [{ tone: "yes" }, { tone: "yes" }, { tone: "yes" }, { tone: "partial" }],
        },
        {
          feature: "License",
          ours: { tone: "neutral", label: "MIT / Pro" },
          values: [
            { tone: "neutral", label: "MIT" },
            { tone: "neutral", label: "MIT" },
            { tone: "neutral", label: "MIT" },
            { tone: "neutral", label: "MIT" },
          ],
        },
      ]}
      comparisonSummary="Simple Table is the strongest standalone Vue 3 data grid: full virtualization, pinning, grouping, and inline editing without forcing Vuetify, PrimeVue, or Element Plus on the rest of your app. Vue Good Table is the only true standalone in the list, but stops at basic table primitives."
      performance={{
        heading: "Performance built for Vue and Nuxt dashboards",
        intro: "Internal benchmarks rendering 100,000 rows and 30 columns in a Vue 3 / Vite app on a mid-range laptop:",
        numbers: [
          { name: "Simple Table for Vue", value: "~170ms", caption: "Initial render", tone: "good" },
          { name: "Vuetify v-data-table-virtual", value: "~520ms", caption: "Initial render", tone: "warn" },
          { name: "Element Plus el-table", value: "~2.6s", caption: "Without explicit virtualization", tone: "bad" },
        ],
        highlights: [
          "Row + column virtualization out-of-the-box—no separate plugin or wrapper component",
          "60fps scrolling with 1M+ rows, including grouped and pinned configurations",
          "Reactive props are passed through directly; no full grid re-render when one cell updates",
          "Tree-shakable: you import only the SimpleTable component, not an entire UI library",
        ],
      }}
      install={{
        heading: "Get up and running in a Vue 3 SFC",
        intro: "Install the package, import the stylesheet from your entry, and use <SimpleTable /> in any <script setup> SFC. Nuxt 3+ auto-imports work as expected.",
        installCommand: "npm install @simple-table/vue",
      }}
      faqs={[
        {
          question: "Does Simple Table for Vue work with Nuxt 3 and Nuxt 4?",
          answer:
            "Yes. The package is Vite/ESM friendly, ships its own stylesheet, and integrates with Nuxt's auto-imports. Wrap the grid in <ClientOnly> if you don't need SSR for table content, or render it server-side—both work.",
        },
        {
          question: "Is the Vue adapter built on the React adapter?",
          answer:
            "No. @simple-table/vue wraps simple-table-core, the same vanilla TypeScript engine used by the React, Angular, Svelte, Solid, and vanilla adapters. There is no React in the dependency tree.",
        },
        {
          question: "Can I use Vue components as cell renderers?",
          answer:
            "Yes. Cell renderers, header renderers, footer renderers, and column editors all accept Vue components, so you keep reactivity and composition inside your renderers.",
        },
        {
          question: "How does it compare with Vuetify v-data-table?",
          answer:
            "Vuetify's table is great if you've already adopted Vuetify. If you haven't, Simple Table is a smaller, more focused dependency with more grid features (column pinning, grouping, inline editing, virtualization) and no Vuetify dependency.",
        },
        {
          question: "How does it compare with PrimeVue DataTable?",
          answer:
            "PrimeVue DataTable is the most feature-rich free Vue table; the trade-off is adopting PrimeVue (and its theme system) across your app. Simple Table gives you the same surface area as a single, framework-agnostic dependency.",
        },
      ]}
      conclusionHeading="The verdict for Vue and Nuxt teams"
      conclusionParagraphs={[
        "If you're building a Vue 3 or Nuxt app that displays more than a few hundred rows, needs editing, virtualization, pinning, or grouping, and you don't want to adopt a full UI library or pay per developer—Simple Table is the strongest free choice in the Vue ecosystem in 2026.",
        "Simple Table for Vue ships as a single component, integrates cleanly with Composition API and <script setup>, supports TypeScript strict mode, and shares its core with five other framework adapters—so a Vue + React team keeps a single grid mental model across both stacks.",
      ]}
      relatedBlogs={[
        { slug: "angular-data-grid-simple-table", title: "Angular data grid: Simple Table for standalone components" },
        { slug: "sveltekit-data-table-simple-table", title: "Svelte & SvelteKit data table: Simple Table" },
        { slug: "vanilla-typescript-data-grid-simple-table-core", title: "Vanilla TypeScript data grid with simple-table-core" },
        { slug: "tanstack-table-vs-simple-table-headless-batteries-included", title: "Headless vs batteries-included: TanStack Table vs Simple Table" },
        { slug: "ag-grid-pricing-license-breakdown-2026", title: "AG Grid pricing & license breakdown 2026" },
      ]}
      cta={{
        title: "Ready to ship the Vue 3 / Nuxt data grid users love?",
        description:
          "Install @simple-table/vue, drop <SimpleTable /> into any <script setup> SFC, and ship sorting, filtering, virtualization, pinning, grouping, and editing in your next Vue release.",
        primaryHref: "/frameworks/vue",
        primaryLabel: "Vue setup hub",
        secondaryHref: "/docs/installation",
        secondaryLabel: "Read the installation docs",
      }}
      extraSection={
        <section id="when-to-pick-simple-table-vue">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
              When Simple Table is the right Vue grid
            </h3>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                <strong>Pick Simple Table for Vue if any of these apply:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                <li>You need row + column virtualization without adopting Vuetify or PrimeVue</li>
                <li>You need inline cell editing, pinning, grouping, or aggregations</li>
                <li>You're working in Nuxt 3+ and want a Vite-friendly grid that doesn't fight SSR</li>
                <li>You want a consistent grid across Vue, React, Angular, and Svelte teams</li>
                <li>You don't want to pay per-developer fees for advanced grid features</li>
              </ul>
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                <strong>Stay on what you have if:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li>You've already standardized on Vuetify, PrimeVue, or Element Plus and a basic table is enough.</li>
                <li>You actively use AG Grid Enterprise's pivoting/charting/master-detail; Simple Table doesn't replicate those analytical features.</li>
              </ul>
            </div>
          </div>
        </section>
      }
    />
  );
}
