import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableVsKendoGridAngularPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableVsKendoGridAngularPost.title,
  description: simpleTableVsKendoGridAngularPost.description,
  keywords:
    "kendo grid angular alternative, kendo ui angular replacement, telerik grid angular, free kendo angular alternative, angular data grid pricing, simple table angular, mit angular table",
  openGraph: {
    title: simpleTableVsKendoGridAngularPost.title,
    description: simpleTableVsKendoGridAngularPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableVsKendoGridAngularPost.title,
    description: simpleTableVsKendoGridAngularPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableVsKendoGridAngularPost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableVsKendoGridAngularPost.slug}
      title={simpleTableVsKendoGridAngularPost.title}
      subtitle="Kendo Grid for Angular costs $649+ per developer per year. Simple Table for Angular delivers virtualization, pinning, grouping, and editing free under MIT—no license keys, no commercial paperwork, no annual renewals."
      competitorName="Kendo Grid for Angular"
      framework="angular"
      heroBadges={["Comparison", "Pricing", "Decision Guide"]}
      datePublished={simpleTableVsKendoGridAngularPost.createdAt}
      dateModified={simpleTableVsKendoGridAngularPost.updatedAt}
      introParagraphs={[
        "Kendo UI for Angular's Grid is a feature-complete commercial component. It's stable, well-supported by Progress/Telerik, and trusted in countless enterprise apps. The price is the price: license fees start around $649/dev/year and scale with your headcount.",
        "Simple Table for Angular is the free MIT alternative built around modern Angular. @simple-table/angular ships virtualization for 1M+ rows, column pinning, row grouping with aggregations, and inline editing in the standard package—idiomatic for standalone components and signals.",
        "This article weighs the cost of Kendo Grid against the modern Angular ergonomics and zero-license-fee story of Simple Table for Angular.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "Commercial ($649+ /dev/year)", tone: "bad" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Annual renewal", competitor: { value: "Required", tone: "bad" }, simpleTable: { value: "None", tone: "good" } },
        { feature: "Bundle size (gzipped)", competitor: { value: "200–400+ kB (suite)", tone: "bad" }, simpleTable: { value: "~70 kB", tone: "good" } },
        { feature: "Standalone components", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "First-class", tone: "good" } },
        { feature: "Signals support", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes (idiomatic)", tone: "good" } },
        { feature: "Row virtualization", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes (built-in)", tone: "good" } },
        { feature: "Column pinning", competitor: { value: "Yes (locked columns)", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row grouping with aggregations", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes (built-in)", tone: "good" } },
        { feature: "Tree data", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes (built-in)", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Stay with Kendo Grid when…",
          items: [
            "You already have a Kendo subscription and the renewal is committed.",
            "Your team relies on Telerik's commercial support contract.",
            "You depend on Kendo-specific integrations (Reporting, Document Processing) across the suite.",
            "Your customers / industry require commercial vendor backing.",
          ],
        },
        simpleTable: {
          title: "Switch to Simple Table for Angular when…",
          items: [
            "You want to retire annual license renewals and free up the budget line item.",
            "Your needs are 'data grid' (virtualization, pinning, grouping, editing)—not the entire Kendo suite.",
            "You're starting fresh on Angular 17/18/19 and want lean defaults.",
            "You also build React / Vue / Svelte / Solid surfaces and want a shared engine.",
            "You're comfortable with community + GitHub support instead of a commercial contract.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "💸",
          title: "10-engineer Angular team, Kendo renewal due",
          body: "$6,490+/year just for grid licenses; you mainly use grid features (no Telerik Reporting).",
          recommendation: "simpleTable",
          recommendationLabel: "Migrate to Simple Table for Angular—you get the same features and recover the renewal budget.",
        },
        {
          emoji: "🏢",
          title: "Regulated enterprise with commercial-support requirement",
          body: "Procurement requires a commercial vendor contract for any production dependency.",
          recommendation: "competitor",
          recommendationLabel: "Stay with Kendo Grid—the commercial contract is the deliverable.",
        },
        {
          emoji: "🚀",
          title: "Startup picking a stack in 2026",
          body: "New Angular 19 SaaS, pre-revenue, doesn't want to pay for grid licenses.",
          recommendation: "simpleTable",
          recommendationLabel: "Pick Simple Table for Angular—free MIT and idiomatic for modern Angular.",
        },
        {
          emoji: "📚",
          title: "App tightly integrated with Kendo Reporting and PDF tools",
          body: "You use multiple Kendo libraries beyond the grid; renewing one means renewing the suite.",
          recommendation: "competitor",
          recommendationLabel: "Stay with Kendo if the suite is core; otherwise consider piecewise migration.",
        },
      ]}
      faqs={[
        { question: "Will I lose enterprise support switching to MIT?", answer: "You give up a commercial support contract. You gain GitHub Issues, Discord, and the ability to read / patch the source. Many teams find that's enough; some prefer the commercial backstop. It depends on your org." },
        { question: "Does Simple Table for Angular cover everything Kendo Grid does?", answer: "It covers the headline features: virtualization, pinning, grouping with aggregations, tree data, inline editing, custom cells, multi-column sort, filtering. Kendo's PDF / Excel export and Reporting integrations are Kendo-specific—you'd need a separate solution if you depend on those." },
        { question: "How long does the migration take?", answer: "Usually a few sprints depending on table count and customizations. The data shape is similar to Kendo's: column definitions become HeaderObjects, rows are adapted to Simple Table's row shape, and Kendo cell templates become Simple Table cellRenderers." },
        { question: "Can I run them side by side during migration?", answer: "Yes. Simple Table and Kendo Grid coexist fine in the same app—migrate one route at a time and remove Kendo when the last consumer is gone." },
      ]}
      conclusionParagraphs={[
        "Kendo Grid for Angular is excellent if you've made the commercial bet and use the suite broadly. If your usage is grid-centric and the annual license is showing up as a renewal you'd rather not pay, Simple Table for Angular delivers the same headline features under MIT.",
        "The math gets compelling fast: a 10-engineer team saves $6k+/year in licenses while shipping a smaller, signals-friendly grid. Pick the choice that fits your support and budget posture.",
      ]}
      relatedLinks={[
        { href: "/blog/angular-data-grid-simple-table", label: "Pillar guide: the best free Angular data grid in 2026" },
        { href: "/blog/ag-grid-alternatives-free-angular-data-grids-2026", label: "Best free Angular data grids in 2026" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
      ctaTitle="Drop the Kendo renewal, keep the data grid"
      ctaDescription="Simple Table for Angular ships virtualization, pinning, grouping, and editing in one MIT package—no license keys, ~70 kB gzipped, signals-native."
    />
  );
}
