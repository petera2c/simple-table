import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableVsSvarDatagridPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableVsSvarDatagridPost.title,
  description: simpleTableVsSvarDatagridPost.description,
  keywords:
    "svar datagrid alternative, svar svelte alternative, sveltekit data grid, svelte 5 table, simple table svelte, mit svelte table",
  openGraph: {
    title: simpleTableVsSvarDatagridPost.title,
    description: simpleTableVsSvarDatagridPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableVsSvarDatagridPost.title,
    description: simpleTableVsSvarDatagridPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableVsSvarDatagridPost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableVsSvarDatagridPost.slug}
      title={simpleTableVsSvarDatagridPost.title}
      subtitle="SVAR DataGrid is feature-rich for Svelte but assumes you're adopting SVAR's component ecosystem. Simple Table for Svelte is a focused, standalone MIT alternative—virtualization, pinning, grouping, and editing in one package."
      competitorName="SVAR DataGrid"
      framework="svelte"
      heroBadges={["Comparison", "Decision Guide", "Svelte 5 Ready"]}
      datePublished={simpleTableVsSvarDatagridPost.createdAt}
      dateModified={simpleTableVsSvarDatagridPost.updatedAt}
      introParagraphs={[
        "SVAR (Webix) ships a polished suite of Svelte components, of which DataGrid is the flagship. It's feature-rich and well-supported, but adopting it tends to mean adopting the rest of SVAR's ecosystem and styling conventions.",
        "Simple Table for Svelte is a focused alternative: an MIT-licensed Svelte data grid that doesn't assume any larger design system, ships virtualization and grouping built in, and works on Svelte 4 today and Svelte 5 with runes ready.",
        "This article compares both on bundle, virtualization, grouping, editing, and standalone fit.",
      ]}
      comparisonRows={[
        { feature: "License (DataGrid)", competitor: { value: "MIT", tone: "good" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Standalone usage", competitor: { value: "Assumes SVAR ecosystem", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Svelte 4 support", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Svelte 5 / runes support", competitor: { value: "Mixed / evolving", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "100–200+ kB (suite)", tone: "neutral" }, simpleTable: { value: "~70 kB", tone: "good" } },
        { feature: "Built-in row virtualization", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Column pinning", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row grouping + aggregations", competitor: { value: "Yes (suite-tied)", tone: "good" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Built-in", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Stay with SVAR DataGrid when…",
          items: [
            "You're adopting the SVAR component suite broadly.",
            "Your team is familiar with SVAR's styling conventions and skin system.",
            "You want a vendor-coordinated set of Svelte components.",
          ],
        },
        simpleTable: {
          title: "Switch to Simple Table for Svelte when…",
          items: [
            "You want a standalone, focused MIT data grid without a suite.",
            "You're targeting Svelte 5 / runes today.",
            "You also build React / Vue / Angular / Solid surfaces and want one engine.",
            "Bundle size matters and you don't want SVAR's runtime if you only need the grid.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🧰",
          title: "All-in on SVAR's suite",
          body: "Using SVAR's calendars, charts, and forms across the app.",
          recommendation: "competitor",
          recommendationLabel: "Stay with SVAR DataGrid—the suite stays coherent.",
        },
        {
          emoji: "🎯",
          title: "Just need a focused data grid",
          body: "Tailwind for design, tested forms, only need the grid.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table—skip the suite tax.",
        },
        {
          emoji: "🚀",
          title: "Greenfield Svelte 5 SvelteKit app",
          body: "Want runes-friendly bindings now.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick Simple Table—runes-ready today.",
        },
      ]}
      faqs={[
        { question: "Is SVAR DataGrid free?", answer: "The Svelte DataGrid is open source under MIT. Some SVAR products (calendars, scheduler) have commercial editions; check each component's license." },
        { question: "How big is the migration?", answer: "Hours per table. Map column definitions to HeaderObject entries and convert custom cell render functions to Svelte cellRenderer components." },
        { question: "Does Simple Table support tree data?", answer: "Yes—expandable / nested rows with virtualization are first-class." },
      ]}
      conclusionParagraphs={[
        "If SVAR's ecosystem fits your team, SVAR DataGrid is solid. If you want a standalone, runes-ready, lightweight MIT alternative, Simple Table for Svelte is the focused choice.",
        "Both are MIT and Svelte-native. The choice is suite vs focused, and runes maturity.",
      ]}
      relatedLinks={[
        { href: "/blog/sveltekit-data-table-simple-table", label: "Pillar guide: the best free SvelteKit data table in 2026" },
        { href: "/blog/best-free-svelte-data-grid-2026", label: "Best free Svelte data grids in 2026" },
        { href: "/frameworks/svelte", label: "Svelte integration hub" },
      ]}
      ctaTitle="Want a focused Svelte data grid?"
      ctaDescription="Simple Table for Svelte ships virtualization, pinning, grouping, and editing in one MIT package—runes-ready, ~70 kB gzipped."
    />
  );
}
