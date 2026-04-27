import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { bestVanillaJsDataGridPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: bestVanillaJsDataGridPost.title,
  description: bestVanillaJsDataGridPost.description,
  keywords:
    "best vanilla js data grid, vanilla typescript data grid, framework agnostic data grid, tabulator alternative, jspreadsheet alternative, grid.js alternative, handsontable alternative, simple-table-core",
  openGraph: {
    title: bestVanillaJsDataGridPost.title,
    description: bestVanillaJsDataGridPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: bestVanillaJsDataGridPost.title,
    description: bestVanillaJsDataGridPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${bestVanillaJsDataGridPost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={bestVanillaJsDataGridPost.slug}
      title={bestVanillaJsDataGridPost.title}
      subtitle="The best free vanilla JavaScript and TypeScript data grids in 2026 compared: simple-table-core, Tabulator, Jspreadsheet, Grid.js, and Handsontable—bundle, TypeScript support, framework portability, and licensing."
      competitorName="Vanilla JS data grid landscape"
      framework="vanilla"
      heroBadges={["Roundup", "Decision Guide", "2026"]}
      datePublished={bestVanillaJsDataGridPost.createdAt}
      dateModified={bestVanillaJsDataGridPost.updatedAt}
      introParagraphs={[
        "Vanilla JavaScript still has a strong library ecosystem for data grids—especially if you want to stay framework-agnostic or you're targeting environments where React/Vue/Angular aren't an option.",
        "We'll compare the main free options in 2026: simple-table-core, Tabulator, Jspreadsheet, Grid.js, and Handsontable. Each has a sweet spot. The right pick depends on whether you need a data grid or a spreadsheet, your TypeScript appetite, and your licensing constraints.",
        "Quick takeaway: simple-table-core is the best free TypeScript-first option for most teams who want a data grid (not a spreadsheet) with the option to add framework adapters later.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "MIT (most options) / Non-commercial (Handsontable)", tone: "neutral" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Type of component", competitor: { value: "Data grid / spreadsheet / read-first", tone: "neutral" }, simpleTable: { value: "Data grid", tone: "good" } },
        { feature: "TypeScript-first", competitor: { value: "Mixed (definitions vs strict)", tone: "neutral" }, simpleTable: { value: "Yes (strict)", tone: "good" } },
        { feature: "ESM-first packaging", competitor: { value: "Mixed", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Framework portability", competitor: { value: "Standalone only (most)", tone: "neutral" }, simpleTable: { value: "5 framework adapters", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "25–200+ kB depending on choice", tone: "neutral" }, simpleTable: { value: "~50 kB", tone: "good" } },
        { feature: "Built-in row virtualization", competitor: { value: "Mixed", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Built-in grouping + aggregations", competitor: { value: "Mostly manual", tone: "bad" }, simpleTable: { value: "Yes (MIT)", tone: "good" } },
        { feature: "Built-in inline editing", competitor: { value: "Mixed", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Pick another option when…",
          items: [
            "You need an Excel-like spreadsheet UI: Jspreadsheet (MIT) or Handsontable (non-commercial).",
            "You're rendering small content tables: Grid.js is enough.",
            "Your team is already invested in Tabulator's API and patterns.",
            "Cell formulas and ranges are critical to the UX.",
          ],
        },
        simpleTable: {
          title: "Pick simple-table-core when…",
          items: [
            "You want a TypeScript-first vanilla data grid with strict types.",
            "You're using ESM packaging and modern bundlers (Vite, esbuild).",
            "You may add React / Vue / Angular / Svelte / Solid surfaces later and want one engine.",
            "Bundle size matters—~50 kB gzipped without losing virtualization or grouping.",
            "You need MIT licensing for any commercial context.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🏆",
          title: "Greenfield TypeScript project, Vite + esbuild",
          body: "ESM-first, strict typing, modern bundlers.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick simple-table-core—TypeScript-first by design.",
        },
        {
          emoji: "📊",
          title: "Excel-like spreadsheet UI",
          body: "Cell formulas, ranges, fill handle.",
          recommendation: "competitor",
          recommendationLabel: "Use Jspreadsheet (MIT) or Handsontable (commercial license).",
        },
        {
          emoji: "📰",
          title: "Static content table on a marketing site",
          body: "10–50 rows, content-driven, occasional sort.",
          recommendation: "competitor",
          recommendationLabel: "Use Grid.js—right tool for content tables.",
        },
        {
          emoji: "🧱",
          title: "Multi-stack platform (vanilla + a framework later)",
          body: "Want to keep the option open without changing engines.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick simple-table-core—framework adapters share the engine.",
        },
      ]}
      faqs={[
        { question: "What's the best free vanilla JavaScript data grid in 2026?", answer: "For most teams that want a data grid (not a spreadsheet), simple-table-core. It's MIT, TypeScript-first, ~50 kB gzipped, and the same engine ships in @simple-table/{react,vue,angular,svelte,solid}. Pick Tabulator if you're already invested in its API or need built-in PDF/CSV export breadth." },
        { question: "Is Handsontable free for commercial use?", answer: "No—Handsontable's non-commercial license restricts commercial use. You'd need a paid license for commercial products. simple-table-core is MIT for any context." },
        { question: "Which has the smallest bundle?", answer: "Grid.js (~25 kB) for read-first tables; simple-table-core (~50 kB) for full data grids; Tabulator (~80–120 kB) and Handsontable (~150–200 kB) for richer feature sets." },
      ]}
      conclusionParagraphs={[
        "Vanilla JS data grids are well-defined: data grid (Tabulator, simple-table-core), spreadsheet (Handsontable, Jspreadsheet), or read-first table (Grid.js). For most TypeScript-first data grid use cases, simple-table-core is the right pick.",
        "All MIT options are free for commercial use. Watch Handsontable's non-commercial license carefully if you're building anything for-profit.",
      ]}
      relatedLinks={[
        { href: "/blog/vanilla-typescript-data-grid-simple-table-core", label: "Pillar guide: the best vanilla TypeScript data grid" },
        { href: "/blog/simple-table-vs-tabulator-vanilla-js", label: "simple-table-core vs Tabulator" },
        { href: "/blog/simple-table-vs-jspreadsheet", label: "simple-table-core vs Jspreadsheet" },
        { href: "/blog/simple-table-vs-grid-js", label: "simple-table-core vs Grid.js" },
        { href: "/blog/simple-table-vs-handsontable-vanilla", label: "simple-table-core vs Handsontable" },
        { href: "/frameworks/vanilla", label: "Vanilla TypeScript hub" },
      ]}
      ctaTitle="Pick the right vanilla JS data grid for 2026"
      ctaDescription="simple-table-core ships virtualization, pinning, grouping, and editing in one MIT package—~50 kB gzipped, TypeScript-first, with framework adapters for React, Vue, Angular, Svelte, and Solid."
    />
  );
}
