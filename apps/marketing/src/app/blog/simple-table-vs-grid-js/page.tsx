import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableVsGridJsPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableVsGridJsPost.title,
  description: simpleTableVsGridJsPost.description,
  keywords:
    "grid.js alternative, vanilla js data grid, typescript data grid, simple-table-core, framework agnostic data grid, virtualized vanilla grid",
  openGraph: {
    title: simpleTableVsGridJsPost.title,
    description: simpleTableVsGridJsPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableVsGridJsPost.title,
    description: simpleTableVsGridJsPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableVsGridJsPost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableVsGridJsPost.slug}
      title={simpleTableVsGridJsPost.title}
      subtitle="Grid.js is a lightweight read-only-first table for vanilla JavaScript—great for content tables. simple-table-core is what you reach for when you need virtualization for 100k+ rows, column pinning, row grouping, and inline editing in TypeScript."
      competitorName="Grid.js"
      framework="vanilla"
      heroBadges={["Comparison", "Decision Guide"]}
      datePublished={simpleTableVsGridJsPost.createdAt}
      dateModified={simpleTableVsGridJsPost.updatedAt}
      introParagraphs={[
        "Grid.js is a small, easy-to-use vanilla JS table library. It does sorting, pagination, search, and basic styling out of the box and pairs well with content-heavy pages.",
        "simple-table-core covers a different scope: virtualization for hundreds of thousands of rows, column pinning, row grouping with aggregations, inline cell editing, all in TypeScript-first packaging.",
        "This article walks through when Grid.js is enough and when you've outgrown it.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "MIT", tone: "good" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Type of component", competitor: { value: "Read-first table", tone: "neutral" }, simpleTable: { value: "Full data grid", tone: "good" } },
        { feature: "TypeScript-first", competitor: { value: "Definitions exist", tone: "neutral" }, simpleTable: { value: "Yes (strict)", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "~25 kB", tone: "good" }, simpleTable: { value: "~50 kB", tone: "good" } },
        { feature: "Built-in row virtualization", competitor: { value: "No", tone: "bad" }, simpleTable: { value: "Yes (1M rows)", tone: "good" } },
        { feature: "Column pinning", competitor: { value: "No", tone: "bad" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row grouping + aggregations", competitor: { value: "No", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "Limited (read-first)", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Sorting / filtering / pagination", competitor: { value: "Built-in", tone: "good" }, simpleTable: { value: "Built-in", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Stick with Grid.js when…",
          items: [
            "You're rendering 100–500 rows and don't need virtualization.",
            "Reads dominate; writes / inline edits aren't part of the UX.",
            "You want a tiny dependency for content-style tables.",
            "Sorting + pagination + search is enough.",
          ],
        },
        simpleTable: {
          title: "Switch to simple-table-core when…",
          items: [
            "You need virtualization for 10k+ rows.",
            "You need column pinning, row grouping with aggregations, or inline editing.",
            "You want TypeScript-first ergonomics with strict types.",
            "You may add React / Vue / Angular / Svelte / Solid surfaces later.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "📰",
          title: "Marketing site comparison table",
          body: "10–50 rows, content-driven, occasional sort.",
          recommendation: "competitor",
          recommendationLabel: "Stick with Grid.js—it's the right tool.",
        },
        {
          emoji: "📊",
          title: "Internal dashboard with 100k rows",
          body: "Virtualization, pinned columns, sort + filter.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to simple-table-core—data grid territory.",
        },
        {
          emoji: "📈",
          title: "Reporting view with grouping + aggregations",
          body: "Group by region with sum and avg footers.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to simple-table-core—aggregations are first-class.",
        },
      ]}
      faqs={[
        { question: "Is Grid.js bad?", answer: "Not at all—it's a fine read-first table for content pages. It's the wrong tool for a data grid with virtualization, grouping, or inline editing." },
        { question: "How big is the migration?", answer: "Hours per table. Map columns to HeaderObjects; replace formatters with cellRenderers; convert search/sort/paginate options to Simple Table's pagination + sorting + filtering options." },
        { question: "Does simple-table-core have search?", answer: "Yes. Column filters are first-class; combine across columns for global-search-like behavior." },
      ]}
      conclusionParagraphs={[
        "Grid.js and simple-table-core aren't really competitors—they cover different scopes. Grid.js for read-first content tables; simple-table-core for data grids.",
        "If you've outgrown Grid.js, simple-table-core is the natural next step—same vanilla JS spirit, full data grid feature set.",
      ]}
      relatedLinks={[
        { href: "/migrations/from-grid-js", label: "Migration guide: from Grid.js" },
        { href: "/blog/vanilla-typescript-data-grid-simple-table-core", label: "Pillar guide: the best vanilla TypeScript data grid" },
        { href: "/blog/best-vanilla-js-data-grid-2026", label: "Best vanilla JavaScript data grids in 2026" },
        { href: "/frameworks/vanilla", label: "Vanilla TypeScript hub" },
      ]}
      ctaTitle="Outgrew Grid.js?"
      ctaDescription="simple-table-core ships virtualization, pinning, grouping, and editing in one MIT package—~50 kB gzipped, TypeScript-first, framework-agnostic."
    />
  );
}
