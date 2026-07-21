"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PivotDemo from "@/components/demos/PivotDemo";
import PageWrapper from "@/components/PageWrapper";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import { faTableCells } from "@fortawesome/free-solid-svg-icons";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const PIVOT_PROPS: PropInfo[] = [
  {
    key: "pivot",
    name: "pivot",
    required: false,
    description:
      "Declarative matrix pivot. When set, flat source rows are reshaped into a matrix with dynamic columns. Pass null to disable. While active, consumer rowGrouping is ignored.",
    type: "PivotConfig | null",
    example: `pivot={{
  rows: ["region"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
}}`,
  },
  {
    key: "onPivotChange",
    name: "onPivotChange",
    required: false,
    description:
      "Fired when pivot config changes through TableAPI.setPivot (not on every prop sync from your app).",
    type: "(pivot: PivotConfig | null) => void",
  },
];

const PIVOT_CONFIG_PROPS: PropInfo[] = [
  {
    key: "rows",
    name: "PivotConfig.rows",
    required: true,
    description:
      "Row dimension accessors (0+). One field → flat rows. Multiple fields → expandable tree (region → product).",
    type: "Accessor[]",
    example: `rows: ["region"]
// or nested:
rows: ["region", "product"]`,
  },
  {
    key: "columns",
    name: "PivotConfig.columns",
    required: true,
    description:
      "Column dimension accessors (0+). Distinct values become dynamic headers. Empty array → value columns only (group + aggregate, no matrix).",
    type: "Accessor[]",
    example: `columns: ["quarter"]
// nested column groups:
columns: ["year", "quarter"]
// no column dims:
columns: []`,
  },
  {
    key: "values",
    name: "PivotConfig.values",
    required: true,
    description:
      "Measures to aggregate (at least one). Uses AggregationConfig: sum, average, count, min, max, or custom. Optional label overrides the header text.",
    type: "PivotValueConfig[]",
    example: `values: [
  { accessor: "sales", aggregation: { type: "sum" } },
  { accessor: "units", aggregation: { type: "average" }, label: "Avg Units" },
]`,
  },
  {
    key: "showRowTotals",
    name: "PivotConfig.showRowTotals",
    required: false,
    description:
      "When true (default), adds a Total column that aggregates across column dimensions. Only applies when columns is non-empty.",
    type: "boolean",
  },
  {
    key: "showColumnTotals",
    name: "PivotConfig.showColumnTotals",
    required: false,
    description: "When true (default), appends a Total row that aggregates across row dimensions.",
    type: "boolean",
  },
  {
    key: "showGrandTotal",
    name: "PivotConfig.showGrandTotal",
    required: false,
    description:
      "When true (default), fills the intersection of row totals and the column-totals row (grand total cells).",
    type: "boolean",
  },
];

const TABLE_API_PROPS: PropInfo[] = [
  {
    key: "setPivot",
    name: "setPivot(config)",
    required: false,
    description: "Enable, update, or clear pivot at runtime. Pass null to return to the source grid.",
    type: "(config: PivotConfig | null) => void",
  },
  {
    key: "getPivot",
    name: "getPivot()",
    required: false,
    description: "Returns the active pivot config, or null when pivot is off.",
    type: "() => PivotConfig | null",
  },
  {
    key: "getPivotHeaders",
    name: "getPivotHeaders()",
    required: false,
    description: "Generated headers while pivot is active; otherwise the current headers.",
    type: "() => ColumnDef[]",
  },
  {
    key: "getPivotedRows",
    name: "getPivotedRows()",
    required: false,
    description: "Post-pivot rows (before flatten/expand). Source rows when pivot is off.",
    type: "() => Row[]",
  },
];

const PivotContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faTableCells} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Pivot Tables: Matrix Aggregation in Your Data Grid
        </h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        Build <strong>matrix pivot tables</strong> with Simple Table: row fields stay on the left,
        column fields become dynamic headers, and values are aggregated into each cell. Works in
        React, Vue, Angular, Svelte, Solid, and vanilla TypeScript. Configure with a{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">pivot</code>{" "}
        prop or{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
          TableAPI.setPivot
        </code>
        —a practical AG Grid Enterprise pivot alternative for declarative analytics. An interactive
        drag-and-drop Pivot Panel is coming for Enterprise; until then, drive dimensions from your
        own UI or presets.
      </motion.p>

      <motion.p
        className="text-gray-600 dark:text-gray-400 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Try the presets below to see nested rows, multiple measures, and value-only layouts. For a
        step-by-step React walkthrough, see the{" "}
        <a href="/blog/react-pivot-table" className="text-blue-600 dark:text-blue-400 hover:underline">
          React pivot table tutorial
        </a>
        .
      </motion.p>

      <motion.div
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <LivePreview demoId="pivot" height="auto" demoHeight="auto" Preview={PivotDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Basic pivot table usage
      </motion.h2>

      <motion.div
        className="mb-8 space-y-4 text-gray-700 dark:text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <p>
          Pass <strong>flat</strong> rows and a field catalog in{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
            columns
          </code>
          . Headers supply labels, types, widths, and formatters for source fields. When pivot is
          active, the grid does not show that catalog as columns — it shows generated row-dimension
          columns plus dynamic value columns.
        </p>
        <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
{`<SimpleTable
  columns={headers} // field catalog
  rows={flatRows}
  pivot={{
    rows: ["region"],
    columns: ["quarter"],
    values: [{ accessor: "sales", aggregation: { type: "sum" } }],
  }}
/>`}
        </pre>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <PropTable props={PIVOT_PROPS} title="Pivot props" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        PivotConfig
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        <PropTable props={PIVOT_CONFIG_PROPS} title="PivotConfig" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        TableAPI
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        <PropTable props={TABLE_API_PROPS} title="Pivot TableAPI methods" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Pivot behavior notes
      </motion.h2>

      <motion.ul
        className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-8 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.75 }}
      >
        <li>
          <strong>Filters</strong> run on source rows (before pivot). Row-dimension columns keep
          their source accessors, so filtering by region still works. Generated measure columns are
          not filterable.
        </li>
        <li>
          <strong>Sort</strong> and <strong>quick filter</strong> apply to the pivoted view.
        </li>
        <li>
          <strong>rowGrouping</strong> from the consumer is ignored while pivot is on. Multi-level{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
            pivot.rows
          </code>{" "}
          builds its own expand/collapse tree instead.
        </li>
        <li>
          <strong>CSV export</strong> exports the pivoted matrix (visible headers and rows), not the
          original fact table.
        </li>
        <li>
          Pivoted measure cells are not meant for editing — they are aggregated summaries.
        </li>
        <li>
          High column cardinality (many distinct column-field values) creates many leaf columns.
          Keep that in mind for performance and horizontal scrolling.
        </li>
      </motion.ul>

      <motion.div
        className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-2">Related</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>
            <a
              href="/blog/react-pivot-table"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              React pivot table tutorial
            </a>{" "}
            — SEO guide with code examples and AG Grid comparison context.
          </li>
          <li>
            <a
              href="/examples/analytics"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Analytics pivot demo
            </a>{" "}
            — multi-dimension revenue presets.
          </li>
          <li>
            For pre-nested trees without pivoting columns, use{" "}
            <a href="/docs/row-grouping" className="text-blue-600 dark:text-blue-400 hover:underline">
              row grouping
            </a>
            .
          </li>
          <li>
            Aggregation types on{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">values</code>{" "}
            match{" "}
            <a
              href="/docs/aggregate-functions"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              aggregate functions
            </a>
            .
          </li>
        </ul>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default PivotContent;
