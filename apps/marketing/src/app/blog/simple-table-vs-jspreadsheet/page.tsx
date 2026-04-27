import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableVsJspreadsheetPost } from "@/constants/blogPosts";

export const metadata: Metadata = {
  title: simpleTableVsJspreadsheetPost.title,
  description: simpleTableVsJspreadsheetPost.description,
  keywords:
    "jspreadsheet alternative, vanilla js spreadsheet, vanilla js data grid, typescript data grid, simple-table-core, framework agnostic data grid",
  openGraph: {
    title: simpleTableVsJspreadsheetPost.title,
    description: simpleTableVsJspreadsheetPost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableVsJspreadsheetPost.title,
    description: simpleTableVsJspreadsheetPost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${simpleTableVsJspreadsheetPost.slug}` },
};

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={simpleTableVsJspreadsheetPost.slug}
      title={simpleTableVsJspreadsheetPost.title}
      subtitle="Jspreadsheet (formerly Jexcel) is a spreadsheet UI in JavaScript—formulas, cell ranges, copy/paste. simple-table-core is a TypeScript-first data grid focused on virtualization, pinning, grouping, and editing. Different tools for different jobs."
      competitorName="Jspreadsheet"
      framework="vanilla"
      heroBadges={["Comparison", "Decision Guide"]}
      datePublished={simpleTableVsJspreadsheetPost.createdAt}
      dateModified={simpleTableVsJspreadsheetPost.updatedAt}
      introParagraphs={[
        "Jspreadsheet (formerly Jexcel) is a spreadsheet UI library: cell ranges, formulas, copy/paste, formatting, named ranges. If you need an Excel-like editor in the browser, it's a strong choice.",
        "simple-table-core is a data grid: column-defined schema, virtualization for large datasets, pinning, grouping with aggregations, inline editing on a per-column basis. Different tool for different jobs.",
        "This article clarifies the difference and helps you pick the right one.",
      ]}
      comparisonRows={[
        { feature: "Type of component", competitor: { value: "Spreadsheet UI", tone: "neutral" }, simpleTable: { value: "Data grid", tone: "good" } },
        { feature: "License", competitor: { value: "MIT (CE) / Commercial (Pro)", tone: "neutral" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "TypeScript-first", competitor: { value: "Definitions exist", tone: "neutral" }, simpleTable: { value: "Yes (strict)", tone: "good" } },
        { feature: "Cell formulas (=A1+B1)", competitor: { value: "Yes", tone: "good" }, simpleTable: { value: "No", tone: "neutral" } },
        { feature: "Cell ranges + selection", competitor: { value: "Yes (Excel-like)", tone: "good" }, simpleTable: { value: "Range selection (basic)", tone: "neutral" } },
        { feature: "Built-in row virtualization", competitor: { value: "Limited", tone: "neutral" }, simpleTable: { value: "Yes (1M rows)", tone: "good" } },
        { feature: "Column pinning", competitor: { value: "Frozen columns", tone: "good" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Row grouping + aggregations", competitor: { value: "Manual", tone: "neutral" }, simpleTable: { value: "Built-in", tone: "good" } },
        { feature: "Inline cell editing", competitor: { value: "Yes (full spreadsheet)", tone: "good" }, simpleTable: { value: "Per-column", tone: "good" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Use Jspreadsheet when…",
          items: [
            "You need an Excel-like spreadsheet UI (formulas, ranges, copy/paste).",
            "Cell-level formatting (currency, percent) drives the UX.",
            "Users expect spreadsheet keyboard semantics (range selection, fill handle).",
            "Pro features (charts, formulas) align with your roadmap.",
          ],
        },
        simpleTable: {
          title: "Use simple-table-core when…",
          items: [
            "You're displaying tabular data with a defined column schema.",
            "Virtualization for thousands or millions of rows is critical.",
            "Row grouping with aggregations is a primary feature.",
            "You want TypeScript-first ergonomics and framework portability.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "📊",
          title: "User-facing budget spreadsheet with formulas",
          body: "Cells reference each other; users paste from Excel.",
          recommendation: "competitor",
          recommendationLabel: "Use Jspreadsheet—it's the right tool.",
        },
        {
          emoji: "📈",
          title: "Analytics dashboard with grouped sales data",
          body: "Group by region, sum revenue, virtualize 100k rows.",
          recommendation: "simpleTable",
          recommendationLabel: "Use simple-table-core—data grid is the right tool.",
        },
        {
          emoji: "🛠️",
          title: "Internal admin table with inline edits",
          body: "Column-typed inputs, validation, save on blur.",
          recommendation: "simpleTable",
          recommendationLabel: "Use simple-table-core—per-column editors fit perfectly.",
        },
      ]}
      faqs={[
        { question: "Are Jspreadsheet and simple-table-core competitors?", answer: "Not really—they solve different problems. Jspreadsheet is a spreadsheet; simple-table-core is a data grid. Some teams use both: Jspreadsheet for the spreadsheet view, simple-table-core for the data grid view." },
        { question: "Does simple-table-core support formulas?", answer: "Not natively. simple-table-core focuses on tabular data with a column schema. If you need cell formulas, use Jspreadsheet (or a real spreadsheet engine like HyperFormula)." },
        { question: "Can I copy/paste data into simple-table-core?", answer: "Range selection and copy are supported; full Excel-style paste is on the roadmap. For full spreadsheet semantics, use Jspreadsheet." },
      ]}
      conclusionParagraphs={[
        "Jspreadsheet and simple-table-core aren't really competitors. Jspreadsheet for spreadsheets; simple-table-core for data grids.",
        "If your UX is closer to Excel, pick Jspreadsheet. If you're displaying analytics or tabular data with a defined schema, pick simple-table-core.",
      ]}
      relatedLinks={[
        { href: "/blog/vanilla-typescript-data-grid-simple-table-core", label: "Pillar guide: the best vanilla TypeScript data grid" },
        { href: "/blog/best-vanilla-js-data-grid-2026", label: "Best vanilla JavaScript data grids in 2026" },
        { href: "/frameworks/vanilla", label: "Vanilla TypeScript hub" },
      ]}
      ctaTitle="Need a vanilla TypeScript data grid?"
      ctaDescription="simple-table-core ships virtualization, pinning, grouping, and editing in one MIT package—~50 kB gzipped, framework-agnostic."
    />
  );
}
