import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { vanillaTreeDataTablesPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: vanillaTreeDataTablesPost.title,
  description: vanillaTreeDataTablesPost.description,
  keywords:
    "vanilla js tree data table, hierarchical table typescript, expand collapse rows vanilla, tabulator tree data, simple-table-core tree",
  openGraph: {
    title: vanillaTreeDataTablesPost.title,
    description: vanillaTreeDataTablesPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: vanillaTreeDataTablesPost.title,
    description: vanillaTreeDataTablesPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${vanillaTreeDataTablesPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={vanillaTreeDataTablesPost.slug}
      title={vanillaTreeDataTablesPost.title}
      subtitle="Render hierarchical / tree data in a vanilla TypeScript table with expand and collapse—strict TypeScript examples for simple-table-core and a comparison to Tabulator and Handsontable."
      framework="vanilla"
      heroBadges={["Vanilla TS", "Tutorial", "Tree Data"]}
      datePublished={vanillaTreeDataTablesPost.createdAt}
      dateModified={vanillaTreeDataTablesPost.updatedAt}
      introParagraphs={[
        "Org charts, file systems, BOMs, ledger structures—real-world data is rarely flat. Tree-data tables let users expand and collapse rows in place to drill down without losing context.",
        "This tutorial covers tree-data patterns in vanilla TypeScript: parent/child rendering, lazy loading children, and expand-all / collapse-all controls. We compare Tabulator, Grid.js, Handsontable, and simple-table-core.",
        "simple-table-core uses the same component for flat and hierarchical data—no separate TreeTable to learn, no plugin to install.",
      ]}
      whyItMatters={[
        { title: "Drill-down without losing context", body: "Users see parent and children in the same surface; no modal or detail-page round-trips." },
        { title: "Compact wide hierarchies", body: "Collapse low-level children; expand specific branches users care about." },
        { title: "Reusable for many domains", body: "Folders, regions, org charts, and chart-of-accounts all share the pattern." },
        { title: "Combinable with sort/filter", body: "Filter the leaves; the right ancestors stay visible to preserve context." },
      ]}
      libraryRows={[
        { library: "simple-table-core", support: { value: "Built-in (MIT)", tone: "good" }, notes: "Hierarchical rows with built-in expand/collapse and chevron renderer." },
        { library: "Tabulator", support: { value: "Built-in", tone: "good" }, notes: "dataTree: true; supports lazy loading via dataTreeChildField." },
        { library: "Grid.js", support: { value: "Manual", tone: "bad" }, notes: "No native tree—pre-flatten and render hierarchy yourself." },
        { library: "Handsontable", support: { value: "Built-in (commercial)", tone: "neutral" }, notes: "Tree built-in but commercial license required." },
        { library: "jSpreadsheet", support: { value: "Manual", tone: "bad" }, notes: "Spreadsheet-style; not designed for hierarchical data." },
      ]}
      simpleTableSection={{
        headline: "Implementation: simple-table-core",
        intro: "Provide hierarchical rows with depth per the docs. simple-table-core renders chevrons and handles expand/collapse state for you.",
                notes: <>For very deep trees (10+ levels), consider adding a "collapse all" control above the grid. Combine with virtualization to keep performance flat for thousands of rows.</>,
      }}
      pitfalls={[
        { title: "Performance on deep trees", problem: "Expanding a node with 10k descendants stalls the UI.", solution: "Lazy-load children on expand, and rely on built-in virtualization." },
        { title: "Filtering hides ancestors", problem: "Searching matches a leaf, but the tree breaks because parents are filtered out.", solution: "Filter while preserving ancestor rows. simple-table-core supports this with includeAncestors filter mode." },
        { title: "Memory leaks on SPA navigation", problem: "Listeners persist after the host element is removed.", solution: "Call table.dispose() on cleanup so listeners are removed." },
        { title: "Indent ambiguity", problem: "Multiple columns indent independently; users can't tell where children belong.", solution: "Indent only the tree column (usually the first). simple-table-core does this automatically with expandable: true." },
      ]}
      faqs={[
        { question: "Does simple-table-core have a separate TreeTable?", answer: "No—the same vanilla SimpleTable handles flat and hierarchical data. Provide depth and expansion information per the nested tables docs to render a tree." },
        { question: "Does it work in a web component?", answer: "Yes. Mount inside the shadow root: pass shadowRoot.querySelector('#host') as the element." },
        { question: "Can I use tree data with column pinning?", answer: "Yes. Tree data, pinning, virtualization, sorting, and filtering all combine." },
      ]}
      conclusionParagraphs={[
        "Tree data in vanilla JS / TS is straightforward with simple-table-core—provide hierarchy on each row and the grid handles the rest. Tabulator supports it natively too; Grid.js requires DIY; Handsontable is commercial.",
        "If you need hierarchical data alongside virtualization and pinning, simple-table-core is the focused MIT pick.",
      ]}
      relatedLinks={[
        { href: "/blog/vanilla-typescript-data-grid-simple-table-core", label: "Pillar guide: best free vanilla TypeScript data grid in 2026" },
        { href: "/docs/nested-tables", label: "Nested / tree data documentation" },
        { href: "/frameworks/vanilla", label: "Vanilla TS integration hub" },
      ]}
      ctaTitle="Add tree data to your vanilla TS grid"
      ctaDescription="simple-table-core ships tree data, virtualization, pinning, and editing in one MIT package—~70 kB gzipped, strict TypeScript, ESM-first."
      docsHref="/docs/nested-tables"
    />
  );
}
