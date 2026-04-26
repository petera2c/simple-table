import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableCoreVsTabulatorPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableCoreVsTabulatorPost.title,
  description: simpleTableCoreVsTabulatorPost.description,
  keywords:
    "tabulator alternative, vanilla js data grid, typescript data grid, simple-table-core, framework agnostic data grid, esm data grid",
  openGraph: {
    title: simpleTableCoreVsTabulatorPost.title,
    description: simpleTableCoreVsTabulatorPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableCoreVsTabulatorPost.title,
    description: simpleTableCoreVsTabulatorPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableCoreVsTabulatorPost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableCoreVsTabulatorPost.slug}
      title={simpleTableCoreVsTabulatorPost.title}
      subtitle="Tabulator is the workhorse vanilla JS data grid—battle-tested and feature-rich. simple-table-core is the modern TypeScript-first alternative: strict types, ESM-first packaging, and the same engine that powers React, Vue, Angular, Svelte, and Solid."
      competitorName="Tabulator"
      framework="vanilla"
      heroBadges={["Comparison", "TypeScript-First", "Decision Guide"]}
      datePublished={simpleTableCoreVsTabulatorPost.createdAt}
      dateModified={simpleTableCoreVsTabulatorPost.updatedAt}
      introParagraphs={[
        "Tabulator has been the go-to vanilla JS data grid for years. It's MIT-licensed, deeply featured, and ships with everything from CSV export to remote data sources. If you've ever needed a data grid in plain JavaScript, Tabulator was probably your first stop.",
        "simple-table-core is the modern TypeScript-first alternative. It's the same engine that powers @simple-table/react, @simple-table/vue, @simple-table/angular, @simple-table/svelte, and @simple-table/solid—available standalone for vanilla TypeScript projects.",
        "This article compares the two on TypeScript ergonomics, ESM packaging, framework portability, bundle size, and feature scope.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "MIT", tone: "good" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "TypeScript", competitor: { value: "Definitions exist", tone: "neutral" }, simpleTable: { value: "First-class (strict)", tone: "good" } },
        { feature: "ESM-first packaging", competitor: { value: "Mixed", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Framework portability", competitor: { value: "Standalone only", tone: "neutral" }, simpleTable: { value: "Same engine, 5 framework adapters", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "~80–120 kB", tone: "good" }, simpleTable: { value: "~50 kB", tone: "good" } },
        { feature: "Built-in row virtualization", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Column pinning", competitor: { value: "Yes (frozen columns)", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row grouping + aggregations", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "API style", competitor: { value: "Imperative options bag (mature)", tone: "neutral" }, simpleTable: { value: "Modern declarative TypeScript", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Stay with Tabulator when…",
          items: [
            "Your existing codebase is heavily invested in Tabulator's API.",
            "You depend on Tabulator-specific features (built-in CSV/PDF export, etc.).",
            "Your team prefers an imperative options-bag style API.",
            "You don't need TypeScript ergonomics or framework portability.",
          ],
        },
        simpleTable: {
          title: "Switch to simple-table-core when…",
          items: [
            "You want TypeScript-first ergonomics with strict types.",
            "You're using ESM packaging, modern bundlers (Vite, esbuild), and tree-shaking.",
            "You may add React / Vue / Angular / Svelte / Solid surfaces later and want one engine.",
            "Bundle size matters: ~50 kB gzipped without losing virtualization or grouping.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🧰",
          title: "Existing Tabulator codebase, basic CRUD",
          body: "Three internal tables, no plans to add features.",
          recommendation: "competitor",
          recommendationLabel: "Stay on Tabulator—the migration cost isn't worth it.",
        },
        {
          emoji: "🚀",
          title: "Greenfield TypeScript project, Vite + esbuild",
          body: "ESM-first, strict typing, modern bundlers.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick simple-table-core—TypeScript-first by design.",
        },
        {
          emoji: "🧱",
          title: "Multi-stack platform (Vue + vanilla legacy)",
          body: "Want one engine and one mental model across both.",
          recommendation: "simpleTable",
          recommendationLabel: "Choose simple-table-core—same engine, framework adapters.",
        },
      ]}
      faqs={[
        { question: "Is Tabulator dead?", answer: "No—it's actively maintained and a fine choice for legacy and new projects alike. The trade-off is API style and TypeScript ergonomics, not maintenance." },
        { question: "How big is the migration?", answer: "Hours to a few days per table. Map columns array to HeaderObject entries; convert formatters / mutators to cellRenderer / valueGetter functions." },
        { question: "Can simple-table-core export to CSV?", answer: "Built-in CSV export ships with the core; PDF export is an opt-in adapter in roadmap. Tabulator has more file-format breadth out of the box today." },
      ]}
      conclusionParagraphs={[
        "Tabulator is a solid choice and we have nothing bad to say about it. simple-table-core wins when you want TypeScript-first ergonomics, ESM-first packaging, and the option to add framework adapters later without changing engines.",
        "Both are MIT and both are mature. Pick simple-table-core for greenfield TypeScript work; stay on Tabulator if your codebase is already deeply invested.",
      ]}
      relatedLinks={[
        { href: "/comparisons/simple-table-vs-tabulator-vanilla", label: "Detailed comparison: simple-table-core vs Tabulator" },
        { href: "/migrations/from-tabulator", label: "Migration guide: from Tabulator" },
        { href: "/blog/vanilla-typescript-data-grid-simple-table-core", label: "Pillar guide: the best vanilla TypeScript data grid" },
        { href: "/frameworks/vanilla", label: "Vanilla TypeScript hub" },
      ]}
      ctaTitle="Want a TypeScript-first vanilla data grid?"
      ctaDescription="simple-table-core ships virtualization, pinning, grouping, and editing in one MIT package—~50 kB gzipped, ESM-first, with framework adapters for React, Vue, Angular, Svelte, and Solid."
    />
  );
}
