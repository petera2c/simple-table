import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableVsHandsontableVanillaPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableVsHandsontableVanillaPost.title,
  description: simpleTableVsHandsontableVanillaPost.description,
  keywords:
    "handsontable alternative, handsontable vanilla js alternative, mit data grid, typescript data grid, simple-table-core, free spreadsheet alternative",
  openGraph: {
    title: simpleTableVsHandsontableVanillaPost.title,
    description: simpleTableVsHandsontableVanillaPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableVsHandsontableVanillaPost.title,
    description: simpleTableVsHandsontableVanillaPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableVsHandsontableVanillaPost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableVsHandsontableVanillaPost.slug}
      title={simpleTableVsHandsontableVanillaPost.title}
      subtitle="Handsontable's non-commercial license blocks production SaaS use without a paid license. simple-table-core is MIT-licensed for any context and ships virtualization, pinning, grouping, and editing in vanilla TypeScript."
      competitorName="Handsontable (Vanilla JS)"
      framework="vanilla"
      heroBadges={["Comparison", "Licensing", "Decision Guide"]}
      datePublished={simpleTableVsHandsontableVanillaPost.createdAt}
      dateModified={simpleTableVsHandsontableVanillaPost.updatedAt}
      introParagraphs={[
        "Handsontable is a powerful spreadsheet-style component for vanilla JavaScript. It ships formulas, cell ranges, validators, fill handle—everything that makes it feel like Excel in the browser.",
        "The catch is licensing. Handsontable's non-commercial license restricts use in commercial products without a paid commercial license (priced per developer per year). For SaaS, internal tools at companies, or any context where you're earning revenue, that's a real cost.",
        "simple-table-core is MIT-licensed for any context—commercial, non-commercial, fork, redistribute. This article covers the licensing trade-off and how feature scope compares.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "Non-commercial / Commercial", tone: "bad" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Per-developer fees (commercial use)", competitor: { value: "$590+/dev/year", tone: "bad" }, simpleTable: { value: "$0", tone: "good" } },
        { feature: "Type of component", competitor: { value: "Spreadsheet UI", tone: "neutral" }, simpleTable: { value: "Data grid", tone: "good" } },
        { feature: "TypeScript-first", competitor: { value: "Definitions exist", tone: "neutral" }, simpleTable: { value: "Yes (strict)", tone: "good" } },
        { feature: "Cell formulas (=A1+B1)", competitor: { value: "Yes (HyperFormula)", tone: "good" }, simpleTable: { value: "No", tone: "neutral" } },
        { feature: "Built-in row virtualization", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Column pinning", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row grouping + aggregations", competitor: { value: "Manual", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "Yes (full spreadsheet)", tone: "good" }, simpleTable: { value: "Per-column", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Stay with Handsontable when…",
          items: [
            "You need an Excel-like spreadsheet UI (formulas, ranges, fill handle).",
            "You've already paid for the commercial license.",
            "Your use case is non-commercial (open source, internal academic, etc.).",
            "Pro features (HyperFormula, advanced formats) align with your roadmap.",
          ],
        },
        simpleTable: {
          title: "Switch to simple-table-core when…",
          items: [
            "You're building a commercial product and don't want to pay license fees.",
            "Your UX is closer to a data grid than a spreadsheet.",
            "You want MIT licensing for any context, including SaaS.",
            "Bundle size matters (~50 kB gzipped) and grouping with aggregations is a primary feature.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "📊",
          title: "User-facing budget spreadsheet with formulas",
          body: "Cells reference each other; users paste from Excel.",
          recommendation: "competitor",
          recommendationLabel: "Stay with Handsontable—or use a spreadsheet engine like Univer.",
        },
        {
          emoji: "💼",
          title: "SaaS dashboard table",
          body: "Display tabular data with sort, filter, virtualization, pinning.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to simple-table-core—MIT for any commercial context.",
        },
        {
          emoji: "📈",
          title: "Reporting view with grouping + aggregations",
          body: "Group by region, sum revenue, virtualize 100k rows.",
          recommendation: "simpleTable",
          recommendationLabel: "Switch to simple-table-core—aggregations are first-class.",
        },
      ]}
      faqs={[
        { question: "Can I use Handsontable's free version commercially?", answer: "Handsontable's non-commercial license is restrictive. Most SaaS or for-profit uses require a commercial license. Always check the current license text before relying on free terms." },
        { question: "How does simple-table-core compare to a real spreadsheet?", answer: "simple-table-core is a data grid, not a spreadsheet. If you need formulas and Excel-like cell mechanics, pair it with HyperFormula or use Handsontable. For tabular data with a column schema, simple-table-core is lighter and MIT." },
        { question: "How big is the migration?", answer: "Hours to a few days per table. Map columns to HeaderObjects; convert renderer / editor functions to cellRenderer / cellEditor; replace afterChange hooks with onCellEdit handlers." },
      ]}
      conclusionParagraphs={[
        "Handsontable is the right pick if you genuinely need a spreadsheet UI and either pay for the license or qualify as non-commercial. simple-table-core is the right pick for data grids and any context where MIT licensing matters.",
        "The license is the headline difference; feature scope is the second consideration.",
      ]}
      relatedLinks={[
        { href: "/blog/handsontable-alternatives-free-react", label: "Handsontable alternatives: free React data grids" },
        { href: "/blog/vanilla-typescript-data-grid-simple-table-core", label: "Pillar guide: the best vanilla TypeScript data grid" },
        { href: "/blog/best-vanilla-js-data-grid-2026", label: "Best vanilla JavaScript data grids in 2026" },
        { href: "/frameworks/vanilla", label: "Vanilla TypeScript hub" },
      ]}
      ctaTitle="Need a free MIT vanilla data grid?"
      ctaDescription="simple-table-core ships virtualization, pinning, grouping, and editing in one MIT package—~50 kB gzipped, TypeScript-first."
    />
  );
}
