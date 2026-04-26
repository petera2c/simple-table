import type { Metadata } from "next";
import FrameworkTutorialLayout from "@/components/blog/FrameworkTutorialLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { vanillaGridFilteringPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: vanillaGridFilteringPost.title,
  description: vanillaGridFilteringPost.description,
  keywords:
    "vanilla js grid filtering, typescript data grid filter, tabulator filter, grid.js filter, simple-table-core filter",
  openGraph: {
    title: vanillaGridFilteringPost.title,
    description: vanillaGridFilteringPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: vanillaGridFilteringPost.title,
    description: vanillaGridFilteringPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${vanillaGridFilteringPost.slug}` },
};

export default function Page() {
  return (
    <FrameworkTutorialLayout
      slug={vanillaGridFilteringPost.slug}
      title={vanillaGridFilteringPost.title}
      subtitle="Column filters, quick search, and custom predicates for vanilla TypeScript data grids—strict TypeScript examples for simple-table-core and a comparison to Tabulator, Grid.js, and Handsontable."
      framework="vanilla"
      heroBadges={["Vanilla TS", "Tutorial", "Filtering"]}
      datePublished={vanillaGridFilteringPost.createdAt}
      dateModified={vanillaGridFilteringPost.updatedAt}
      introParagraphs={[
        "Filtering is the bread-and-butter feature users hit before sorting or even rendering all rows. Get the typing wrong (string vs number vs date) and your filter UX feels broken.",
        "This tutorial walks through column filters, a global quick filter, and custom predicates for the vanilla JS / TS data grid landscape and shows the simple-table-core setup with strict TypeScript.",
        "If you want a framework-agnostic, MIT-licensed grid with built-in filtering, simple-table-core is ~70 kB gzipped and works in any host.",
      ]}
      whyItMatters={[
        { title: "Faster discovery", body: "Users find rows by typing or selecting; they don't scan thousands of rows visually." },
        { title: "Type-aware filtering", body: "Strings need contains/equals; numbers need >, <, between; dates need calendar pickers." },
        { title: "Combinable with sort/group", body: "Filter, then sort, then group. The order matters for performance and UX." },
        { title: "Server vs client", body: "Small datasets filter client-side; large ones round-trip to the server. Both are common." },
      ]}
      libraryRows={[
        { library: "simple-table-core", support: { value: "Built-in column filters + quick filter", tone: "good" }, notes: "filterable: true + type-aware predicates; quickFilter option for global search." },
        { library: "Tabulator", support: { value: "Built-in", tone: "good" }, notes: "headerFilter on column defs; advanced filters supported." },
        { library: "Grid.js", support: { value: "Plugin", tone: "neutral" }, notes: "Search plugin for global search; column filters require third-party." },
        { library: "Handsontable", support: { value: "Built-in (commercial)", tone: "neutral" }, notes: "Filters built-in but commercial license required." },
        { library: "jSpreadsheet", support: { value: "Built-in", tone: "good" }, notes: "Spreadsheet-style filters; less suited for typed data grids." },
      ]}
      simpleTableSection={{
        headline: "Implementation: simple-table-core",
        intro: "Set filterable: true globally or per-column for built-in filter chips. Add a quick-search input and bind it via the API. Plug in custom predicates for advanced cases.",
                notes: <>For 100k+ rows, debounce the quick-filter input by 150-250ms. Use <code>requestAnimationFrame</code> or a small debounce helper—no framework required.</>,
      }}
      pitfalls={[
        { title: "String filtering on numbers", problem: "Sorting and filtering treat \"10\" < \"2\" because they're strings.", solution: "Set the column type='number' so type-aware predicates kick in." },
        { title: "Memory leaks on SPA navigation", problem: "Filter listeners persist after the host element is removed.", solution: "Call table.dispose() on cleanup so listeners are removed." },
        { title: "Slow on every keystroke", problem: "Filtering 50k rows on every keystroke janks.", solution: "Debounce input by 150-250ms or filter server-side." },
        { title: "Date strings aren't filterable", problem: "ISO strings sort/filter alphabetically, which breaks for dates.", solution: "Set type='date' (or pass Date objects) so the grid knows to compare temporally." },
      ]}
      faqs={[
        { question: "Can I filter server-side?", answer: "Yes. Listen to your input, fetch filtered rows from the API, and call table.setRows(newRows)." },
        { question: "Does it work without a build step?", answer: "Yes. Import simple-table-core via esm.sh in a <script type=\"module\"> tag." },
        { question: "Does filtering combine with virtualization?", answer: "Yes. The filtered row set is what the virtualizer renders, so 1M-row datasets remain smooth after filtering." },
      ]}
      conclusionParagraphs={[
        "Filtering in vanilla JS / TS is a single option on simple-table-core. Tabulator covers it natively too; Grid.js requires plugins; Handsontable is commercial.",
        "Always set the right column type so type-aware predicates work, debounce on large datasets, and consider server-side filtering for 100k+ rows.",
      ]}
      relatedLinks={[
        { href: "/blog/vanilla-typescript-data-grid-simple-table-core", label: "Pillar guide: best free vanilla TypeScript data grid in 2026" },
        { href: "/docs/column-filtering", label: "Column filtering documentation" },
        { href: "/frameworks/vanilla", label: "Vanilla TS integration hub" },
      ]}
      ctaTitle="Add filtering to your vanilla TS grid"
      ctaDescription="simple-table-core ships column filters, quick filter, and custom predicates in one MIT package—~70 kB gzipped, strict TypeScript, ESM-first."
      docsHref="/docs/column-filtering"
    />
  );
}
