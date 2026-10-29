import type { Metadata } from "next";
import CompetitorBlogLayout from "@/components/blog/CompetitorBlogLayout";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { bestAngularDataGrids2026Post } from "@/constants/blogPosts";
import { SIMPLE_TABLE_INFO } from "@/constants/packageInfo";

export const metadata: Metadata = {
  title: bestAngularDataGrids2026Post.title,
  description: bestAngularDataGrids2026Post.description,
  keywords:
    "best angular data grid, angular data grid, best angular grid, angular grid component free, angular data table, angular tree grid, ag grid angular, primeng table, ngx-datatable, kendo angular grid, devextreme angular data grid, simple table angular",
  openGraph: {
    title: bestAngularDataGrids2026Post.title,
    description: bestAngularDataGrids2026Post.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: bestAngularDataGrids2026Post.title,
    description: bestAngularDataGrids2026Post.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: { canonical: `/blog/${bestAngularDataGrids2026Post.slug}` },
};

const size = SIMPLE_TABLE_INFO.bundleSizeMinGzip;

export default function Page() {
  return (
    <CompetitorBlogLayout
      slug={bestAngularDataGrids2026Post.slug}
      title={bestAngularDataGrids2026Post.title}
      subtitle="Seven Angular data grids ranked for 2026, from full-featured commercial suites to lightweight MIT options. What each one costs, what it does well, and which kind of project it fits."
      competitorName="Other Angular grids"
      framework="angular"
      heroBadges={["Ranking", "Angular 17+", "2026"]}
      datePublished={bestAngularDataGrids2026Post.createdAt}
      dateModified={bestAngularDataGrids2026Post.updatedAt}
      introParagraphs={[
        "Picking an Angular data grid comes down to three questions: how much of the grid do you want built for you, which design system are you already on, and are you willing to pay per developer. Here is our 2026 ranking, with the license terms spelled out for each.",
        "1. Simple Table for Angular (MIT). A ready-made grid with virtualization, column pinning, row grouping, aggregation, pivoting, tree data, cell editing, and CSV export, all free. Works with standalone components and signals. " + size + " gzipped. Best for teams that want advanced features without a license. Disclosure: we build it.",
        "2. AG Grid (Community MIT, Enterprise commercial). The most feature-complete grid available. Community covers sorting, filtering, pinning, editing, and CSV export. Row grouping, aggregation, pivoting, tree data, master/detail, and Excel export need Enterprise, which lists at $999 per developer as a perpetual license. Best for spreadsheet-heavy enterprise apps with budget.",
        "3. PrimeNG Table (MIT). A capable table inside the PrimeNG component suite, with sorting, filtering, selection, frozen columns, virtual scroll, and row expansion. Best if PrimeNG is already your component library.",
        "4. Kendo UI for Angular Grid (commercial). A polished, fully supported grid in a large commercial suite. Best for teams that want vendor support and a single paid UI kit.",
        "5. DevExtreme DataGrid for Angular (commercial). Another mature commercial grid with grouping, summaries, editing, and export. Best when you already license DevExpress components.",
        "6. Angular Material mat-table (MIT). A lightweight, accessible table built on the CDK. Sorting and pagination come from companion modules. Grouping, pinning, and virtualization are mostly up to you. Best for simple tables that must match Material Design.",
        "7. ngx-datatable (MIT). A long-running open-source Angular table with virtual scrolling, row detail, and column resizing. Best for existing projects that already depend on it.",
      ]}
      comparisonRows={[
        { feature: "License", competitor: { value: "AG: MIT + Enterprise; PrimeNG, mat-table, ngx-datatable: MIT; Kendo, DevExtreme: commercial", tone: "neutral" }, simpleTable: { value: "MIT", tone: "good" } },
        { feature: "Row grouping and aggregation", competitor: { value: "AG: Enterprise only; Kendo, DevExtreme: yes; mat-table: build it yourself", tone: "neutral" }, simpleTable: { value: "Yes, free", tone: "good" } },
        { feature: "Pivoting", competitor: { value: "AG: Enterprise only; most others: no", tone: "bad" }, simpleTable: { value: "Yes, free", tone: "good" } },
        { feature: "Tree data", competitor: { value: "AG: Enterprise only; PrimeNG: TreeTable; others vary", tone: "neutral" }, simpleTable: { value: "Yes, free", tone: "good" } },
        { feature: "Virtualization", competitor: { value: "AG, PrimeNG, Kendo, DevExtreme, ngx-datatable: yes; mat-table: via CDK", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Column pinning", competitor: { value: "Most: yes; mat-table: sticky columns", tone: "neutral" }, simpleTable: { value: "Yes", tone: "good" } },
        { feature: "Excel export", competitor: { value: "AG: Enterprise; Kendo, DevExtreme: yes", tone: "neutral" }, simpleTable: { value: "CSV only", tone: "neutral" } },
        { feature: "Vendor support contract", competitor: { value: "AG Enterprise, Kendo, DevExtreme", tone: "good" }, simpleTable: { value: "Optional paid support", tone: "neutral" } },
      ]}
      whyChoose={{
        competitor: {
          title: "Pick another grid when...",
          items: [
            "You need Excel export, set filters, or AG Grid's tool panels (AG Grid Enterprise).",
            "Your app is already built on PrimeNG, Kendo, DevExtreme, or Angular Material and the grid should match.",
            "Your procurement process requires a commercial vendor contract.",
            "You only need a basic sortable table (mat-table is enough).",
          ],
        },
        simpleTable: {
          title: "Pick Simple Table for Angular when...",
          items: [
            "You want grouping, aggregation, pivoting, and tree data without paying per developer.",
            "You are on Angular 17+ with standalone components and signals.",
            "You want the same grid engine in Angular, React, Vue, Svelte, and Solid apps.",
            "You prefer an MIT license with no renewals to track.",
          ],
        },
      }}
      scenarios={[
        {
          emoji: "🏢",
          title: "Large financial app with Excel workflows",
          body: "Users export to Excel daily and need set filters and range selection.",
          recommendation: "competitor",
          recommendationLabel: "AG Grid Enterprise is the strongest fit here.",
        },
        {
          emoji: "🚀",
          title: "New SaaS dashboard on Angular 19",
          body: "Needs grouping with totals, pinned columns, and large datasets, on a startup budget.",
          recommendation: "simpleTable",
          recommendationLabel: "Simple Table for Angular covers this under MIT.",
        },
        {
          emoji: "🎨",
          title: "App already built with PrimeNG",
          body: "Dozens of PrimeNG components and a PrimeNG theme across the app.",
          recommendation: "competitor",
          recommendationLabel: "Stay on PrimeNG Table for visual consistency unless you hit a feature wall.",
        },
        {
          emoji: "📋",
          title: "Simple admin list",
          body: "Sort, paginate, and a few columns.",
          recommendation: "competitor",
          recommendationLabel: "mat-table is enough.",
        },
      ]}
      faqs={[
        { question: "What is the best Angular data grid in 2026?", answer: "It depends on budget and features. AG Grid Enterprise is the most complete paid option. For a free grid with advanced features like grouping, pivoting, and tree data, Simple Table for Angular is MIT licensed. PrimeNG Table is a good choice if you already use PrimeNG." },
        { question: "Is there a free Angular data grid with row grouping?", answer: "Yes. Simple Table for Angular includes row grouping and aggregation under MIT. AG Grid Community does not include row grouping; it is an Enterprise feature." },
        { question: "How much does AG Grid cost for Angular?", answer: "AG Grid Community is free under MIT. AG Grid Enterprise lists at $999 per developer as a perpetual license with one year of updates. See our AG Grid pricing breakdown for details." },
        { question: "Is Angular Material's table a data grid?", answer: "mat-table is a flexible table component rather than a full data grid. Features like grouping, pinning, and virtualization take extra work." },
      ]}
      conclusionParagraphs={[
        "If budget is not a constraint and you need every spreadsheet feature, AG Grid Enterprise is hard to beat. If you are already invested in a component suite, use its grid. If you want advanced grid features for free in a modern Angular app, try Simple Table for Angular.",
      ]}
      relatedLinks={[
        { href: "/blog/ag-grid-pricing-license-breakdown-2026", label: "AG Grid license and pricing 2026" },
        { href: "/blog/ag-grid-alternatives-free-angular-data-grids-2026", label: "Free AG Grid alternatives for Angular" },
        { href: "/blog/simple-table-vs-primeng-table", label: "Simple Table vs PrimeNG Table" },
        { href: "/blog/simple-table-vs-ngx-datatable", label: "Simple Table vs ngx-datatable" },
        { href: "/blog/simple-table-vs-kendo-grid-angular", label: "Simple Table vs Kendo Grid for Angular" },
        { href: "/frameworks/angular", label: "Angular integration hub" },
      ]}
      ctaTitle="Try Simple Table for Angular"
      ctaDescription="Virtualization, pinning, grouping, pivoting, tree data, and editing in one MIT licensed package."
    />
  );
}
