import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableVsTanstackSolidTablePost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableVsTanstackSolidTablePost.title,
  description: simpleTableVsTanstackSolidTablePost.description,
  keywords:
    "tanstack solid table alternative, solidjs data grid, solid-start data table, signals data grid, simple table solid, mit solid table, headless vs batteries-included solid",
  openGraph: {
    title: simpleTableVsTanstackSolidTablePost.title,
    description: simpleTableVsTanstackSolidTablePost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableVsTanstackSolidTablePost.title,
    description: simpleTableVsTanstackSolidTablePost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableVsTanstackSolidTablePost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableVsTanstackSolidTablePost.slug}
      title={simpleTableVsTanstackSolidTablePost.title}
      subtitle="TanStack Solid Table is headless—you bring the markup. Simple Table for Solid is batteries-included with virtualization, pinning, grouping with aggregations, and inline editing in one MIT package, built on Solid signals."
      competitorName="TanStack Solid Table"
      framework="solid"
      heroBadges={["Comparison", "Decision Guide", "Signals-Native"]}
      datePublished={simpleTableVsTanstackSolidTablePost.createdAt}
      dateModified={simpleTableVsTanstackSolidTablePost.updatedAt}
      introParagraphs={[
        "TanStack Solid Table is the Solid adapter of TanStack Table—headless primitives for state, sorting, filtering, and column models. You wire the UI yourself: every <td>, every interaction, every virtualization integration.",
        "Simple Table for Solid is batteries-included: virtualization, column pinning, row grouping with aggregations, and inline editing all ship in one MIT package, built on Solid's fine-grained reactivity.",
        "This article compares the two so you can pick the one that fits your team's appetite for building UI from primitives.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "MIT", tone: "good" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Approach", competitor: { value: "Headless (BYO UI)", tone: "neutral" }, simpleTable: { value: "Batteries-included", tone: "good" } },
        { feature: "Solid signals integration", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "First-class", tone: "good" } },
        { feature: "Solid-Start support", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "~14 kB core (UI not included)", tone: "neutral" }, simpleTable: { value: "~70 kB (full grid)", tone: "good" } },
        { feature: "Built-in row virtualization", competitor: { value: "No (BYO virtualizer)", tone: "bad" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Built-in column pinning", competitor: { value: "State only (BYO UI)", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row grouping + aggregations", competitor: { value: "State only (BYO UI)", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "BYO", tone: "bad" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Setup time to first table", competitor: { value: "Hours / days", tone: "neutral" }, simpleTable: { value: "Minutes", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Stay headless when…",
          items: [
            "You want pixel-level control over every <tr> and <td>.",
            "You're already shipping a custom virtualization layer (TanStack Virtual).",
            "Your design system has unique table layouts.",
            "You're standardized on TanStack across your stack and want consistency.",
          ],
        },
        simpleTable: {
          title: "Switch to Simple Table for Solid when…",
          items: [
            "You want virtualization, pinning, grouping with aggregations, and editing in one package.",
            "Your team is small and time-to-feature beats absolute UI control.",
            "You also build React / Vue / Angular / Svelte / Vanilla surfaces and want one engine.",
            "You want signal-based reactivity without writing the UI primitives.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🛠️",
          title: "Custom design system with unique row layouts",
          body: "Need full control over markup, styling, animations.",
          recommendation: "competitor",
          recommendationLabel: "Stay on TanStack Solid Table—you'll get exactly the markup you want.",
        },
        {
          emoji: "📊",
          title: "Reporting tool, 100k rows, grouping required",
          body: "Sum/avg footers, virtualization, time-to-feature matters.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to Simple Table for Solid—heavy lifting is built in.",
        },
        {
          emoji: "🚀",
          title: "Greenfield Solid-Start app",
          body: "Want signals-first data grid; team is small.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick Simple Table for Solid—batteries-included on Solid signals.",
        },
        {
          emoji: "🧱",
          title: "Multi-stack platform (React + Solid)",
          body: "Want one engine and one mental model across both.",
          recommendation: "simpleTable",
          recommendationLabel: "Choose Simple Table—same engine via @simple-table/react and @simple-table/solid.",
        },
      ]}
      faqs={[
        { question: "Is TanStack Solid Table dead?", answer: "No—it's actively maintained as part of the TanStack family. The trade-off vs Simple Table is headless vs batteries-included, not maintenance." },
        { question: "Can I migrate gradually?", answer: "Yes. Replace one table at a time. Map your column defs to HeaderObject entries; replace your TanStack Virtual integration with Simple Table's built-in virtualization; convert custom cell renderers to Simple Table cellRenderer Solid components." },
        { question: "Does Simple Table for Solid use signals?", answer: "Yes. Inputs accept signals or static values; updates flow through Solid's fine-grained reactivity." },
      ]}
      conclusionParagraphs={[
        "Both are MIT, both are Solid-native, and both are maintained. The choice is philosophy.",
        "If you want primitives and full UI control, stay on TanStack Solid Table. If you want virtualization, pinning, grouping with aggregations, and editing without building them, switch to Simple Table for Solid.",
      ]}
      relatedLinks={[
        { href: "/blog/solidjs-data-grid-simple-table", label: "Pillar guide: the best free SolidJS data grid in 2026" },
        { href: "/blog/best-solidjs-data-grid-2026", label: "Best free SolidJS data grids in 2026" },
        { href: "/frameworks/solid", label: "Solid integration hub" },
      ]}
      ctaTitle="Want a batteries-included Solid data grid?"
      ctaDescription="Simple Table for Solid ships virtualization, pinning, grouping, and editing in one MIT package—signals-native, ~70 kB gzipped."
    />
  );
}
