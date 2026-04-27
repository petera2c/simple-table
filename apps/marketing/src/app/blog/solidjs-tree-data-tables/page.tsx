import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { solidTreeDataTablesPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: solidTreeDataTablesPost.title,
  description: solidTreeDataTablesPost.description,
  keywords:
    "solidjs tree data table, hierarchical table solid, expand collapse rows solid, tanstack solid table tree, simple table solid",
  openGraph: {
    title: solidTreeDataTablesPost.title,
    description: solidTreeDataTablesPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: solidTreeDataTablesPost.title,
    description: solidTreeDataTablesPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${solidTreeDataTablesPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={solidTreeDataTablesPost.slug}
      title={solidTreeDataTablesPost.title}
      subtitle="Render hierarchical / tree data in a SolidJS table with expand and collapse—signals-native examples for Simple Table for Solid and a comparison to TanStack Solid Table."
      framework="solid"
      heroBadges={["SolidJS", "Tutorial", "Tree Data"]}
      datePublished={solidTreeDataTablesPost.createdAt}
      dateModified={solidTreeDataTablesPost.updatedAt}
      introParagraphs={[
        "Org charts, file systems, BOMs, ledger structures—real-world data is rarely flat. Tree-data tables let users expand and collapse rows in place to drill down without losing context.",
        "This tutorial covers tree-data patterns in SolidJS: parent/child rendering, lazy loading children, and expand-all / collapse-all controls. We compare TanStack Solid Table and Simple Table for Solid.",
        "Simple Table for Solid uses the same SimpleTable component for flat and hierarchical data—no separate TreeTable component to learn.",
      ]}
      whyItMatters={[
        { title: "Drill-down without losing context", body: "Users see parent and children in the same surface; no modal or detail-page round-trips." },
        { title: "Compact wide hierarchies", body: "Collapse low-level children; expand specific branches users care about." },
        { title: "Reusable for many domains", body: "Folders, regions, org charts, and chart-of-accounts all share the pattern." },
        { title: "Combinable with sort/filter", body: "Filter the leaves; the right ancestors stay visible to preserve context." },
      ]}
      libraryRows={[
        { library: "Simple Table for Solid", support: { value: "Built-in (MIT)", tone: "good" }, notes: "Hierarchical rows with built-in expand/collapse and chevron renderer." },
        { library: "TanStack Solid Table", support: { value: "Headless", tone: "neutral" }, notes: "expanding feature gives state; you render chevron + indent yourself." },
        { library: "Kobalte primitives", support: { value: "Not applicable", tone: "neutral" }, notes: "Kobalte is a primitives library, not a data-grid solution." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Solid",
        intro: "Provide hierarchical rows with depth per the docs. Simple Table renders chevrons and handles expand/collapse state for you.",
                notes: <>For very deep trees (10+ levels), consider adding a "collapse all" control above the grid. Combine with virtualization to keep performance flat for thousands of rows.</>,
      }}
      pitfalls={[
        { title: "Performance on deep trees", problem: "Expanding a node with 10k descendants stalls the UI.", solution: "Lazy-load children on expand, and rely on built-in virtualization." },
        { title: "Filtering hides ancestors", problem: "Searching matches a leaf, but the tree breaks because parents are filtered out.", solution: "Filter while preserving ancestor rows. Simple Table supports this with includeAncestors filter mode." },
        { title: "Expanded state lost on refresh", problem: "Polling refresh closes every expanded branch.", solution: "Hold isExpanded by stable rowId in a signal / store and reapply after refetch." },
        { title: "Indent ambiguity", problem: "Multiple columns indent independently; users can't tell where children belong.", solution: "Indent only the tree column (usually the first). Simple Table does this automatically with expandable: true." },
      ]}
      faqs={[
        { question: "Does Simple Table for Solid have a separate TreeTable?", answer: "No—the same SimpleTable component handles flat and hierarchical data. Provide depth and expansion information per the nested tables docs to render a tree." },
        { question: "Can I use tree data with column pinning and grouping?", answer: "Yes. Tree data, pinning, virtualization, sorting, and filtering all combine in the same component." },
        { question: "Does it pair with createStore?", answer: "Yes. Use createStore for granular updates (toggling isExpanded on a single row doesn't reflow all rows)." },
      ]}
      conclusionParagraphs={[
        "Tree data in SolidJS is straightforward with Simple Table—provide hierarchy on each row and Simple Table handles the rest. TanStack Solid Table is headless—you build chevron + indent yourself.",
        "If you need hierarchical data alongside virtualization and pinning, Simple Table for Solid is the focused MIT pick.",
      ]}
      relatedLinks={[
        { href: "/blog/solidjs-data-grid-simple-table", label: "Pillar guide: best free SolidJS data grid in 2026" },
        { href: "/docs/nested-tables", label: "Nested / tree data documentation" },
        { href: "/frameworks/solid", label: "Solid integration hub" },
      ]}
      ctaTitle="Add tree data to your Solid grid"
      ctaDescription="Simple Table for Solid ships tree data, virtualization, pinning, and editing in one MIT package—~70 kB gzipped, signals-native."
      docsHref="/docs/nested-tables"
    />
  );
}
