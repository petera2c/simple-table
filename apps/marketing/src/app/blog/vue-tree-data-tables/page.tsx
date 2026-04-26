import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { vueTreeDataTablesPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: vueTreeDataTablesPost.title,
  description: vueTreeDataTablesPost.description,
  keywords:
    "vue 3 tree data table, hierarchical table vue, expand collapse rows vue, primevue treetable, element plus tree, simple table vue",
  openGraph: {
    title: vueTreeDataTablesPost.title,
    description: vueTreeDataTablesPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: vueTreeDataTablesPost.title,
    description: vueTreeDataTablesPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${vueTreeDataTablesPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={vueTreeDataTablesPost.slug}
      title={vueTreeDataTablesPost.title}
      subtitle="Render hierarchical / tree data in a Vue 3 table with expand and collapse—idiomatic Composition API examples for Simple Table for Vue and a comparison to PrimeVue TreeTable, Element Plus, and Naive UI."
      framework="vue"
      heroBadges={["Vue 3", "Tutorial", "Tree Data"]}
      datePublished={vueTreeDataTablesPost.createdAt}
      dateModified={vueTreeDataTablesPost.updatedAt}
      introParagraphs={[
        "Org charts, file systems, BOMs, ledger structures—real-world data is rarely flat. Tree-data tables let users expand and collapse rows in place to drill down without losing context.",
        "This tutorial covers tree-data patterns in Vue 3: parent/child rendering, lazy loading children, and expand-all / collapse-all controls. We compare PrimeVue TreeTable, Element Plus, Naive UI, and Simple Table for Vue.",
        "Note: PrimeVue and Element Plus split tree data into separate components. Simple Table for Vue uses the same SimpleTable component for flat and hierarchical data.",
      ]}
      whyItMatters={[
        { title: "Drill-down without losing context", body: "Users see parent and children in the same surface; no modal or detail-page round-trips." },
        { title: "Compact wide hierarchies", body: "Collapse low-level children; expand specific branches users care about." },
        { title: "Reusable for many domains", body: "Folders, regions, org charts, and chart-of-accounts all share the pattern." },
        { title: "Combinable with sort/filter", body: "Filter the leaves; the right ancestors stay visible to preserve context." },
      ]}
      libraryRows={[
        { library: "Simple Table for Vue", support: { value: "Built-in (MIT)", tone: "good" }, notes: "Hierarchical rows with built-in expand/collapse and chevron renderer." },
        { library: "PrimeVue TreeTable", support: { value: "Built-in", tone: "good" }, notes: "<TreeTable> separate from <DataTable>; different API surface." },
        { library: "Element Plus el-table", support: { value: "Built-in", tone: "good" }, notes: "row-key + tree-props + lazy + load." },
        { library: "Vuetify v-data-table", support: { value: "Manual", tone: "bad" }, notes: "No native tree data—pre-flatten and render with row templates." },
        { library: "Naive UI n-data-table", support: { value: "Built-in", tone: "good" }, notes: "children key in row + indent rendering." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Vue",
        intro: "Provide hierarchical rows with depth per the docs. Simple Table renders chevrons and handles expand/collapse state for you.",
                notes: <>For very deep trees (10+ levels), consider adding a "collapse all" control above the grid. Combine with virtualization to keep performance flat for thousands of rows.</>,
      }}
      pitfalls={[
        { title: "Performance on deep trees", problem: "Expanding a node with 10k descendants stalls the UI.", solution: "Lazy-load children on expand, and rely on built-in virtualization." },
        { title: "Filtering hides ancestors", problem: "Searching matches a leaf, but the tree breaks because parents are filtered out.", solution: "Filter while preserving ancestor rows. Simple Table supports this with includeAncestors filter mode." },
        { title: "Expanded state lost on refresh", problem: "Polling refresh closes every expanded branch.", solution: "Hold isExpanded by stable rowId in a ref / store and reapply after refetch." },
        { title: "Indent ambiguity", problem: "Multiple columns indent independently; users can't tell where children belong.", solution: "Indent only the tree column (usually the first). Simple Table does this automatically with expandable: true." },
      ]}
      faqs={[
        { question: "Does Simple Table for Vue have a separate TreeTable?", answer: "No—the same SimpleTable component handles flat and hierarchical data. Provide depth and expansion information per the nested tables docs to render a tree." },
        { question: "Can I use tree data with column pinning and grouping?", answer: "Yes. Tree data, pinning, virtualization, sorting, and filtering all combine in the same component." },
        { question: "How do I implement a 'select all descendants' checkbox?", answer: "Use selectableCells=\"row\" and listen for selection events. When the user toggles a parent, propagate to all descendants in your handler." },
      ]}
      conclusionParagraphs={[
        "Tree data in Vue 3 is straightforward with Simple Table—provide hierarchy on each row and Simple Table handles the rest. PrimeVue and Element Plus support it but with separate components or props; Vuetify requires DIY.",
        "If you need hierarchical data alongside virtualization and pinning, Simple Table for Vue is the focused MIT pick.",
      ]}
      relatedLinks={[
        { href: "/blog/vue-nuxt-data-grid-simple-table", label: "Pillar guide: best free Vue / Nuxt data grid in 2026" },
        { href: "/docs/nested-tables", label: "Nested / tree data documentation" },
        { href: "/frameworks/vue", label: "Vue integration hub" },
      ]}
      ctaTitle="Add tree data to your Vue 3 grid"
      ctaDescription="Simple Table for Vue ships tree data, virtualization, pinning, and editing in one MIT package—~70 kB gzipped, Composition-API-friendly."
      docsHref="/docs/nested-tables"
    />
  );
}
