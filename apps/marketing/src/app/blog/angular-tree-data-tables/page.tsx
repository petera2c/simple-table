import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { angularTreeDataTablesPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: angularTreeDataTablesPost.title,
  description: angularTreeDataTablesPost.description,
  keywords:
    "angular tree data table, hierarchical table angular, expand collapse rows angular, primeng treetable, ag grid angular tree data, simple table angular",
  openGraph: {
    title: angularTreeDataTablesPost.title,
    description: angularTreeDataTablesPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: angularTreeDataTablesPost.title,
    description: angularTreeDataTablesPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${angularTreeDataTablesPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={angularTreeDataTablesPost.slug}
      title={angularTreeDataTablesPost.title}
      subtitle="Render hierarchical / tree data in an Angular table with expand and collapse—idiomatic standalone-component examples for Simple Table for Angular and a comparison to PrimeNG TreeTable and AG Grid."
      framework="angular"
      heroBadges={["Angular", "Tutorial", "Tree Data"]}
      datePublished={angularTreeDataTablesPost.createdAt}
      dateModified={angularTreeDataTablesPost.updatedAt}
      introParagraphs={[
        "Org charts, file systems, BOMs, ledger structures—real-world data is rarely flat. Tree-data tables let users expand and collapse rows in place to drill down without losing context.",
        "This tutorial covers tree-data patterns in Angular: parent/child rendering, lazy loading children, and expand-all / collapse-all controls. We compare PrimeNG TreeTable, AG Grid (Enterprise) and Simple Table for Angular.",
        "Note: AG Grid Tree Data is an Enterprise-tier feature ($999+/dev/year). Simple Table for Angular ships tree data in MIT.",
      ]}
      whyItMatters={[
        { title: "Drill-down without losing context", body: "Users see parent and children in the same surface; no modal or detail-page round-trips." },
        { title: "Compact wide hierarchies", body: "Collapse low-level children; expand specific branches users care about." },
        { title: "Reusable for many domains", body: "Folders, regions, org charts, and chart-of-accounts all share the pattern." },
        { title: "Combinable with sort/filter", body: "Filter the leaves; the right ancestors stay visible to preserve context." },
      ]}
      libraryRows={[
        { library: "Simple Table for Angular", support: { value: "Built-in (MIT)", tone: "good" }, notes: "Hierarchical rows with built-in expand/collapse and chevron renderer." },
        { library: "AG Grid Angular", support: { value: "Enterprise only", tone: "bad" }, notes: "treeData: true; requires AG Grid Enterprise license." },
        { library: "PrimeNG TreeTable", support: { value: "Built-in", tone: "good" }, notes: "<p-treeTable> separate component from <p-table>; different API." },
        { library: "ngx-datatable", support: { value: "Manual", tone: "bad" }, notes: "No native tree—pre-flatten and render with row templates yourself." },
        { library: "Angular Material mat-tree", support: { value: "Native (separate component)", tone: "neutral" }, notes: "Different component; doesn't integrate with mat-table features." },
      ]}
      simpleTableSection={{
        headline: "Implementation: Simple Table for Angular",
        intro: "Provide hierarchical rows with depth and children information per the docs. Simple Table renders chevrons and handles expand/collapse state for you.",
                notes: (
          <>
            For very deep trees (10+ levels), consider adding a "collapse all" control above the grid. Combine with virtualization to keep performance flat for thousands of rows.
          </>
        ),
      }}
      pitfalls={[
        { title: "Performance on deep trees", problem: "Expanding a node with 10k descendants stalls the UI.", solution: "Lazy-load children on expand, and rely on built-in virtualization." },
        { title: "Filtering hides ancestors", problem: "Searching matches a leaf, but the tree breaks because parents are filtered out.", solution: "Filter while preserving ancestor rows. Simple Table supports this with includeAncestors filter mode." },
        { title: "Expanded state lost on refresh", problem: "Polling refresh closes every expanded branch.", solution: "Hold expanded state keyed by a stable id in a signal and reapply after refetch." },
        { title: "Indent ambiguity", problem: "Multiple columns indent independently; users can't tell where children belong.", solution: "Indent only the tree column (usually the first). Simple Table does this automatically when a column is marked expandable: true." },
      ]}
      faqs={[
        { question: "Does Simple Table for Angular have a separate TreeTable?", answer: "No—the same SimpleTable component handles flat and hierarchical data. Provide depth and children information per the nested tables docs to render a tree." },
        { question: "Can I use tree data with column pinning and grouping?", answer: "Yes. Tree data, pinning, virtualization, sorting, and filtering all combine in the same component." },
        { question: "How do I implement a 'select all descendants' checkbox?", answer: "Use selectableCells=\"row\" and listen for selection events. When the user toggles a parent, propagate to all descendants in your handler." },
      ]}
      conclusionParagraphs={[
        "Tree data in Angular is straightforward with Simple Table—provide hierarchy on each row and Simple Table handles the rest. AG Grid requires Enterprise; PrimeNG splits it into a separate TreeTable component; mat-table requires mat-tree (a different component).",
        "If you need hierarchical data alongside virtualization and pinning, Simple Table for Angular is the focused MIT pick.",
      ]}
      relatedLinks={[
        { href: "/blog/angular-data-grid-simple-table", label: "Pillar guide: best free Angular data grid in 2026" },
        { href: "/docs/nested-tables", label: "Nested / tree data documentation" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
      ctaTitle="Add tree data to your Angular grid"
      ctaDescription="Simple Table for Angular ships tree data, virtualization, pinning, and editing in one MIT package—~70 kB gzipped, signals-native."
      docsHref="/docs/nested-tables"
    />
  );
}
