import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTableCells,
  faCheckCircle,
  faLightbulb,
  faCode,
  faRocket,
  faExclamationTriangle,
  faChartBar,
  faLayerGroup,
  faBolt,
  faListUl,
  faCircleQuestion,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import Link from "next/link";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { reactPivotTablePost } from "@/constants/blogPosts";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import CodeBlock from "@/components/CodeBlock";
import { buildFaqPageJsonLd } from "@/utils/structuredData";

const FAQS = [
  {
    question: "What is a React pivot table?",
    answer:
      "A React pivot table reshapes flat rows into a matrix: row dimensions stay on the left, column dimensions become dynamic headers, and value fields are aggregated (sum, average, count, min, max, or custom) into each cell.",
  },
  {
    question: "Is there a free alternative to AG Grid pivot mode?",
    answer:
      "Yes. Simple Table provides declarative matrix pivot without AG Grid Enterprise. You configure rows, columns, and values via props or TableAPI. An interactive drag-and-drop Pivot Panel is on the Simple Table Enterprise roadmap.",
  },
  {
    question: "When should I use pivot vs row grouping in a React data grid?",
    answer:
      "Use matrix pivot when you need cross-tab columns generated from data and aggregated cells. Use row grouping when you still need individual fact rows in an expand/collapse hierarchy with fixed columns.",
  },
  {
    question: "Does Simple Table include a drag-and-drop Pivot Panel?",
    answer:
      "Declarative pivot is available today. A first-party drag-and-drop Pivot Panel is coming for Simple Table Enterprise and will drive the same pivot config API.",
  },
  {
    question: "Can I update a React pivot table at runtime?",
    answer:
      "Yes. The analytics and docs demos swap a controlled pivot prop (and expandAll for nested row fields). You can also call TableAPI.setPivot to enable, change, or clear pivot imperatively. getPivot, getPivotHeaders, and getPivotedRows inspect the active matrix.",
  },
];

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.reactPivotTable.title,
  description: SEO_STRINGS.blogPosts.reactPivotTable.description,
  keywords: SEO_STRINGS.blogPosts.reactPivotTable.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.reactPivotTable.title,
    description: SEO_STRINGS.blogPosts.reactPivotTable.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.reactPivotTable.title,
    description: SEO_STRINGS.blogPosts.reactPivotTable.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/react-pivot-table",
  },
};

const TOC = [
  { href: "#what-is-a-react-pivot-table", label: "What is a React pivot table?" },
  { href: "#pivot-vs-row-grouping", label: "Pivot vs row grouping" },
  { href: "#how-to-build-a-react-pivot-table", label: "How to build a React pivot table" },
  { href: "#nested-dimensions-and-measures", label: "Nested dimensions & measures" },
  { href: "#runtime-control", label: "Runtime control with TableAPI" },
  { href: "#behavior-notes", label: "Behavior notes" },
  { href: "#faq", label: "FAQ" },
  { href: "#related-resources", label: "Related resources" },
];

export default function ReactPivotTablePage() {
  const faqLd = buildFaqPageJsonLd(FAQS);

  return (
    <BlogLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <section className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          {reactPivotTablePost.title}
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faTableCells} />
            React Pivot Table
          </span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            Tutorial
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faChartBar} />
            Analytics
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          {reactPivotTablePost.description}
        </p>
      </section>

      <article className="space-y-8 mb-8">
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You have flat sales rows: region, product, quarter, revenue. Stakeholders want a
                matrix—regions down the left, quarters across the top, summed revenue in every cell.
                That reshape is a <strong>React pivot table</strong>: row dimensions, column
                dimensions, and aggregated measures in a data grid.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                In many libraries, pivot mode is locked behind an Enterprise license.{" "}
                <Link
                  href="/blog/free-alternative-to-ag-grid"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  AG Grid&apos;s
                </Link>{" "}
                interactive Pivot Panel is powerful—and priced accordingly. Simple Table ships{" "}
                <strong>declarative matrix pivot today</strong> so you can build analytics views in
                code or your own UI. A drag-and-drop Pivot Panel is on the Enterprise roadmap.
              </p>

              <p className="mb-0 text-gray-700 dark:text-gray-300">
                This <strong>React pivot table tutorial</strong> covers how pivot tables work in a
                JavaScript data grid, when to choose pivot vs row grouping, and how to configure
                Simple Table for aggregations, nested dimensions, totals, and runtime updates.
              </p>
            </div>
          </div>
        </section>

        <section id="table-of-contents">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faListUl} className="text-blue-500" />
              In this guide
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
              {TOC.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="what-is-a-react-pivot-table">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              What Is a React Pivot Table?
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                A <strong>pivot table in React</strong> turns fact rows into a cross-tab matrix:
              </p>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li>
                  • <strong>Rows</strong> — fields that stay on the left (e.g. region, product)
                </li>
                <li>
                  • <strong>Columns</strong> — fields whose distinct values become dynamic headers
                  (e.g. quarter, channel)
                </li>
                <li>
                  • <strong>Values</strong> — measures aggregated into each cell (sum, average,
                  count, min, max, or custom)
                </li>
              </ul>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Flat input like{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  {"{ region: 'West', quarter: 'Q1', sales: 1200 }"}
                </code>{" "}
                becomes a West row with a Q1 sales cell. Multiple source rows that share the same
                dimensions collapse into one aggregated cell—classic spreadsheet-style pivoting
                inside your React data grid.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 mb-0">
                  <strong>Common use cases:</strong> revenue by region × quarter, units by product ×
                  channel, tickets by team × status, and any analytics dashboard where columns must
                  be generated from data—not hardcoded in your header config.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="pivot-vs-row-grouping">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLayerGroup} className="text-indigo-500" />
              Pivot Table vs Row Grouping in React
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    Use a matrix pivot table when…
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• You need dimensions as <strong>columns</strong> (quarters across the top)</li>
                    <li>• Cell values are <strong>aggregates</strong>, not detail rows</li>
                    <li>• Column headers should be generated from distinct field values</li>
                    <li>• You want row/column/grand totals in the matrix</li>
                  </ul>
                </div>

                <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-6 bg-purple-50 dark:bg-purple-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    Use row grouping when…
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• You still need to see <strong>individual fact rows</strong></li>
                    <li>• Hierarchy is expand/collapse down the left, not a cross-tab</li>
                    <li>• Columns stay fixed; you&apos;re organizing rows, not reshaping them</li>
                    <li>
                      • See the{" "}
                      <Link
                        href="/docs/row-grouping"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        row grouping docs
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/blog/react-tree-data-hierarchical-tables"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        tree data guide
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300">
                While pivot is active in Simple Table, consumer{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  rowGrouping
                </code>{" "}
                is ignored. Multi-level{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  pivot.rows
                </code>{" "}
                builds its own expandable tree (e.g. region → product).
              </p>
            </div>
          </div>
        </section>

        <section id="how-to-build-a-react-pivot-table">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-yellow-500" />
              How to Build a React Pivot Table (Declarative Config)
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table&apos;s matrix engine is declarative. Pass flat rows, a field catalog in{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  columns
                </code>
                , and a{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  pivot
                </code>{" "}
                config. Until the Enterprise Pivot Panel ships, your app owns the UI for choosing
                dimensions—presets, selects, analytics chrome, or{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  TableAPI.setPivot
                </code>
                .
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                That gives teams a practical{" "}
                <strong>AG Grid pivot alternative</strong>: matrix pivoting without Enterprise
                pricing today, with a first-party drag-and-drop panel coming for end-user field
                arrangement.
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable } from "@simple-table/react";
import type { ReactColumnDef, Row } from "@simple-table/react";
import "@simple-table/react/styles.css";

const headers: ReactColumnDef[] = [
  { accessor: "region", label: "Region", width: 110, type: "string" },
  { accessor: "quarter", label: "Quarter", width: 80, type: "string" },
  { accessor: "sales", label: "Sales", width: 100, type: "number", align: "right" },
];

const rows: Row[] = [
  { id: "r1", region: "West", quarter: "Q1", sales: 1200 },
  { id: "r2", region: "West", quarter: "Q2", sales: 1500 },
  { id: "r3", region: "East", quarter: "Q1", sales: 900 },
  { id: "r4", region: "East", quarter: "Q2", sales: 1100 },
];

export default function RevenuePivot() {
  return (
    <SimpleTable
      columns={headers}
      rows={rows}
      // Same shape as the docs / analytics "Region × Quarter" preset
      pivot={{
        rows: ["region"],
        columns: ["quarter"],
        values: [{ accessor: "sales", aggregation: { type: "sum" } }],
      }}
      columnResizing
      height="400px"
    />
  );
}`}
              />

              <p className="mb-0 text-gray-700 dark:text-gray-300">
                When pivot is active, the grid does not show the field catalog as columns. It shows
                generated row-dimension columns plus dynamic value columns from the pivot result.
                Full prop reference lives in the{" "}
                <Link
                  href="/docs/pivot"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  pivot table docs
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section id="nested-dimensions-and-measures">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-blue-500" />
              Nested Pivot Dimensions, Multiple Measures, and Totals
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Nested row fields
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                One row field renders a flat pivot. Multiple row fields build an expandable tree
                (docs/analytics &quot;Region → Product&quot; preset). Pass{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  expandAll
                </code>{" "}
                when you want nested levels open by default:
              </p>

              <CodeBlock
                className="mb-6"
                code={`<SimpleTable
  columns={headers}
  rows={rows}
  pivot={{
    rows: ["region", "product"],
    columns: ["quarter"],
    values: [{ accessor: "sales", aggregation: { type: "sum" } }],
  }}
  expandAll // demos set this when pivot.rows.length > 1
  height="400px"
/>`}
              />

              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Nested column groups
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Multiple column fields produce{" "}
                <Link
                  href="/blog/nested-headers-react-tables"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  nested headers
                </Link>{" "}
                (year → quarter):
              </p>

              <CodeBlock
                className="mb-6"
                code={`// Docs / analytics preset: "Category × Year → Quarter"
pivot={{
  rows: ["category"],
  columns: ["year", "quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
}}`}
              />

              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Multiple measures and totals
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Add more value fields for side-by-side metrics—same pattern as the docs/analytics
                &quot;Channel × Quarter&quot; preset. Aggregation types match Simple Table&apos;s{" "}
                <Link
                  href="/docs/aggregate-functions"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  aggregate functions
                </Link>
                . Totals (
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  showRowTotals
                </code>
                ,{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  showColumnTotals
                </code>
                ,{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  showGrandTotal
                </code>
                ) default to{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  true
                </code>
                :
              </p>

              <CodeBlock
                className="mb-6"
                code={`pivot={{
  rows: ["channel"],
  columns: ["quarter"],
  values: [
    { accessor: "sales", aggregation: { type: "sum" }, label: "Sales" },
    { accessor: "units", aggregation: { type: "sum" }, label: "Units" },
  ],
}}`}
              />

              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Value-only layout (no column dimensions)
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Pass an empty{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  columns
                </code>{" "}
                array to group and aggregate without generating a matrix of dynamic headers—same
                idea as the docs &quot;Values only&quot; preset:
              </p>

              <CodeBlock
                className="mb-0"
                code={`pivot={{
  rows: ["region", "category"],
  columns: [],
  values: [
    { accessor: "sales", aggregation: { type: "sum" } },
    { accessor: "cost", aggregation: { type: "sum" } },
  ],
}}`}
              />
            </div>
          </div>
        </section>

        <section id="runtime-control">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              Update a React Pivot Table at Runtime (TableAPI)
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The{" "}
                <Link
                  href="/examples/analytics"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  analytics demo
                </Link>{" "}
                and{" "}
                <Link
                  href="/docs/pivot"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  docs pivot demo
                </Link>{" "}
                swap presets by updating the controlled{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  pivot
                </code>{" "}
                prop (not{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  setPivot
                </code>
                ). Nested row presets also pass{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  expandAll
                </code>
                :
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { PivotConfig } from "@simple-table/react";

const presets: { id: string; label: string; pivot: PivotConfig | null }[] = [
  { id: "source", label: "Source data", pivot: null },
  {
    id: "region-quarter",
    label: "Region × Quarter",
    pivot: {
      rows: ["region"],
      columns: ["quarter"],
      values: [{ accessor: "sales", aggregation: { type: "sum" } }],
    },
  },
  {
    id: "nested-rows",
    label: "Region → Product",
    pivot: {
      rows: ["region", "product"],
      columns: ["quarter"],
      values: [{ accessor: "sales", aggregation: { type: "sum" } }],
    },
  },
];

export default function AnalyticsPivot() {
  const [activeId, setActiveId] = useState(presets[0].id);
  const active = presets.find((p) => p.id === activeId) ?? presets[0];
  const nestedRows = (active.pivot?.rows.length ?? 0) > 1;

  return (
    <>
      {presets.map((preset) => (
        <button key={preset.id} type="button" onClick={() => setActiveId(preset.id)}>
          {preset.label}
        </button>
      ))}
      <SimpleTable
        columns={headers}
        rows={rows}
        pivot={active.pivot}
        expandAll={nestedRows}
        height="480px"
      />
    </>
  );
}`}
              />

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Prefer imperative control?{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  TableAPI.setPivot
                </code>{" "}
                (documented on the{" "}
                <Link
                  href="/docs/pivot"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  pivot docs
                </Link>
                ) updates the same config without remounting:
              </p>

              <CodeBlock
                className="mb-6"
                code={`const tableRef = useRef<TableAPI>(null);

tableRef.current?.setPivot({
  rows: ["region"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
});
tableRef.current?.setPivot(null); // back to source rows`}
              />

              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-0">
                <li>
                  •{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                    setPivot(config | null)
                  </code>{" "}
                  — enable, update, or clear pivot
                </li>
                <li>
                  •{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                    getPivot()
                  </code>{" "}
                  — current config
                </li>
                <li>
                  •{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                    getPivotHeaders()
                  </code>{" "}
                  /{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                    getPivotedRows()
                  </code>{" "}
                  — inspect the generated matrix
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="behavior-notes">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500" />
              React Pivot Table Behavior Notes
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <ul className="space-y-3 text-gray-700 dark:text-gray-300 mb-6">
                <li>
                  <strong>Filters</strong> run on source rows before pivoting. Row-dimension columns
                  keep their source accessors, so filtering by region still works. Generated measure
                  columns are not filterable.
                </li>
                <li>
                  <strong>Sort</strong> and <strong>quick filter</strong> apply to the pivoted view.
                </li>
                <li>
                  <strong>CSV export</strong> exports the pivoted matrix, not the original fact
                  table.
                </li>
                <li>
                  Pivoted measure cells are aggregated summaries—not meant for cell editing.
                </li>
                <li>
                  High column cardinality (many distinct column-field values) creates many leaf
                  columns. Watch horizontal scroll and performance.
                </li>
              </ul>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 mb-0">
                  <strong>What&apos;s next:</strong> An interactive drag-and-drop Pivot Panel is
                  coming for Simple Table Enterprise—end users will arrange row, column, and value
                  fields without custom UI. Declarative{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                    pivot
                  </code>{" "}
                  stays the foundation; the panel will drive the same config.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCircleQuestion} className="text-purple-500" />
              React Pivot Table FAQ
            </h2>

            <div className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="related-resources">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLink} className="text-teal-500" />
              Related Pivot & Analytics Resources
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                •{" "}
                <Link
                  href="/docs/pivot"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Pivot tables documentation
                </Link>{" "}
                — props, PivotConfig, and TableAPI
              </li>
              <li>
                •{" "}
                <Link
                  href="/examples/analytics"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Analytics pivot table demo
                </Link>{" "}
                — multi-dimension revenue presets
              </li>
              <li>
                •{" "}
                <Link
                  href="/docs/aggregate-functions"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Aggregate functions
                </Link>{" "}
                — sum, average, count, and custom aggregations
              </li>
              <li>
                •{" "}
                <Link
                  href="/blog/free-alternative-to-ag-grid"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Free alternative to AG Grid
                </Link>{" "}
                — why teams leave per-seat Enterprise pricing
              </li>
              <li>
                •{" "}
                <Link
                  href="/blog/nested-headers-react-tables"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Nested headers in React tables
                </Link>{" "}
                — hierarchical column groups
              </li>
            </ul>
          </div>
        </section>

        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
              Ship a React Pivot Table Without Waiting on Enterprise
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You can ship a React pivot table today without AG Grid Enterprise or hand-rolled
                matrix math. With a declarative{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  pivot
                </code>{" "}
                config you get:
              </p>

              <ul className="space-y-2 mb-0 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Row / column / value</strong> dimensions with sum, average, count, and
                    more
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Nested dimensions</strong> and row/column/grand totals
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Runtime updates</strong> via TableAPI for analytics presets
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    A clear path to an <strong>Enterprise Pivot Panel</strong> on the same config
                    model
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </article>

      <CallToActionCard
        title="Ready to add a React pivot table to your data grid?"
        description="Simple Table ships declarative pivot with aggregations and totals today. Configure rows, columns, and values in TypeScript—and get ready for the upcoming Enterprise drag-and-drop Pivot Panel on the same API."
        primaryButton={{
          text: "View Pivot Docs",
          href: "/docs/pivot",
        }}
        secondaryButton={{
          text: "See Analytics Demo",
          href: "/examples/analytics",
        }}
      />
    </BlogLayout>
  );
}
