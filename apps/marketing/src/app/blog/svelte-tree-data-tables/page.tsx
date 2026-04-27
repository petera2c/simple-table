import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { svelteTreeDataTablesPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: svelteTreeDataTablesPost.title,
  description: svelteTreeDataTablesPost.description,
  keywords:
    "svelte tree data table, hierarchical table sveltekit, expand collapse rows svelte, svelte 5 runes data grid tree, svelte-headless-table tree, simple table svelte",
  openGraph: {
    title: svelteTreeDataTablesPost.title,
    description: svelteTreeDataTablesPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: svelteTreeDataTablesPost.title,
    description: svelteTreeDataTablesPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${svelteTreeDataTablesPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={svelteTreeDataTablesPost.slug}
      title={svelteTreeDataTablesPost.title}
      subtitle="Render hierarchical / tree data in a SvelteKit table with expand and collapse—idiomatic Svelte 5 / runes examples for Simple Table for Svelte and a comparison to svelte-headless-table, SVAR DataGrid, and Flowbite."
      framework="svelte"
      heroBadges={["Svelte", "Tutorial", "Tree Data"]}
      datePublished={svelteTreeDataTablesPost.createdAt}
      dateModified={svelteTreeDataTablesPost.updatedAt}
      introParagraphs={[
        "Org charts, file systems, BOMs, ledger structures—real-world data is rarely flat. Tree-data tables let users expand and collapse rows in place to drill down without losing context.",
        "This tutorial covers tree-data patterns in Svelte / SvelteKit: parent/child rendering, lazy loading children, and expand-all / collapse-all controls. We compare svelte-headless-table, SVAR DataGrid, Flowbite, and Simple Table for Svelte.",
        "Note: most Svelte data grids don't ship hierarchical data natively. Simple Table for Svelte uses the same SimpleTable component for flat and hierarchical data.",
      ]}
      whyItMatters={[
        { title: "Drill-down without losing context", body: "Users see parent and children in the same surface; no modal or detail-page round-trips." },
        { title: "Compact wide hierarchies", body: "Collapse low-level children; expand specific branches users care about." },
        { title: "Reusable for many domains", body: "Folders, regions, org charts, and chart-of-accounts all share the pattern." },
        { title: "Combinable with sort/filter", body: "Filter the leaves; the right ancestors stay visible to preserve context." },
      ]}
      libraryRows={[
        { library: "Simple Table for Svelte", support: { value: "Built-in (MIT)", tone: "good" }, notes: "Hierarchical rows with built-in expand/collapse and chevron renderer." },
        { library: "svelte-headless-table", support: { value: "Plugin (manual)", tone: "neutral" }, notes: "addExpandedRows; rendering and indent are DIY." },
        { library: "SVAR DataGrid (Svelte)", support: { value: "Built-in (commercial)", tone: "neutral" }, notes: "Tree built-in but commercial license required." },
        { library: "Flowbite Svelte Table", support: { value: "Manual", tone: "bad" }, notes: "Markup-only—pre-flatten and render hierarchy yourself." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Svelte",
        intro: "Provide hierarchical rows with depth per the docs. Simple Table renders chevrons and handles expand/collapse state for you.",
                notes: <>For very deep trees (10+ levels), consider adding a "collapse all" control above the grid. Combine with virtualization to keep performance flat for thousands of rows.</>,
      }}
      pitfalls={[
        { title: "Performance on deep trees", problem: "Expanding a node with 10k descendants stalls the UI.", solution: "Lazy-load children on expand, and rely on built-in virtualization." },
        { title: "Filtering hides ancestors", problem: "Searching matches a leaf, but the tree breaks because parents are filtered out.", solution: "Filter while preserving ancestor rows. Simple Table supports this with includeAncestors filter mode." },
        { title: "Expanded state lost on refresh", problem: "Polling refresh closes every expanded branch.", solution: "Hold isExpanded by stable rowId in $state and reapply after refetch." },
        { title: "Indent ambiguity", problem: "Multiple columns indent independently; users can't tell where children belong.", solution: "Indent only the tree column (usually the first). Simple Table does this automatically with expandable: true." },
      ]}
      faqs={[
        { question: "Does Simple Table for Svelte have a separate TreeTable?", answer: "No—the same SimpleTable component handles flat and hierarchical data. Provide depth and expansion information per the nested tables docs to render a tree." },
        { question: "Does this work with Svelte 4 stores?", answer: "Yes. Replace $state with writable() and the same patterns work." },
        { question: "Can I use tree data with column pinning and grouping?", answer: "Yes. Tree data, pinning, virtualization, sorting, and filtering all combine in the same component." },
      ]}
      conclusionParagraphs={[
        "Tree data in Svelte is straightforward with Simple Table—provide hierarchy on each row and Simple Table handles the rest. svelte-headless-table requires plugin wiring; SVAR ships it commercially; Flowbite is DIY.",
        "If you need hierarchical data alongside virtualization and pinning, Simple Table for Svelte is the focused MIT pick.",
      ]}
      relatedLinks={[
        { href: "/blog/sveltekit-data-table-simple-table", label: "Pillar guide: best free SvelteKit data table in 2026" },
        { href: "/docs/nested-tables", label: "Nested / tree data documentation" },
        { href: "/frameworks/svelte", label: "Svelte integration hub" },
      ]}
      ctaTitle="Add tree data to your Svelte grid"
      ctaDescription="Simple Table for Svelte ships tree data, virtualization, pinning, and editing in one MIT package—~70 kB gzipped, Svelte 5 runes ready."
      docsHref="/docs/nested-tables"
    />
  );
}
