"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableCells } from "@fortawesome/free-solid-svg-icons";
import PivotDemo from "@/components/demos/PivotDemo";
import PageWrapper from "@/components/PageWrapper";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import DocsSteps, { type DocsStep } from "@/components/DocsSteps";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import {
  forAllFrameworks,
  PIVOT_FLAT_ROWS_SNIPPET,
  PIVOT_HEADERS_SNIPPETS,
  pivotSnippets,
  programmaticPivotSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type PivotPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const PIVOT_STEPS: DocsStep[] = [
  {
    title: "Define the field catalog",
    body: (
      <>
        Pass source fields in{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">columns</code> — labels,
        types, and formatters for the fact data. While pivot is active, the grid shows generated
        headers instead of this catalog as columns.
      </>
    ),
    codeByFramework: PIVOT_HEADERS_SNIPPETS,
    language: "typescript",
  },
  {
    title: "Provide flat rows",
    body: "Use a flat fact table — one object per measure row, not a pre-nested tree.",
    codeByFramework: forAllFrameworks(PIVOT_FLAT_ROWS_SNIPPET),
    language: "typescript",
  },
  {
    title: "Set pivot",
    body: (
      <>
        Configure{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">pivot</code> with row
        dims, column dims, and at least one value. Consumer{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rowGrouping</code> is
        ignored while pivot is on.
      </>
    ),
    codeByFramework: pivotSnippets(),
  },
];

const PIVOT_PATTERNS: PivotPattern[] = [
  {
    title: "Multiple row dimensions",
    body: (
      <>
        Multiple{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">pivot.rows</code> fields
        produce one flat row per combination (e.g. region × product), not an expand/collapse tree.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  rows: ["region", "product"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
}`),
    language: "typescript",
  },
  {
    title: "Pivot Panel (column editor)",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">enablePivotPanel</code>{" "}
        (with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">enableColumnEditor</code>
        ) to compose Available / Rows / Columns / Values in the side panel. The panel drives{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">setPivot</code> — pivot
        is active when Values has at least one measure.
      </>
    ),
    codeByFramework: forAllFrameworks(`enableColumnEditor: true,
enablePivotPanel: true,`),
    language: "typescript",
  },
  {
    title: "Multiple measures",
    body: (
      <>
        Add more entries to{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">values</code>. Optional{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">label</code> overrides
        the header. Aggregation types match{" "}
        <a
          href="/docs/aggregate-functions"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          aggregate functions
        </a>
        .
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  rows: ["channel"],
  columns: ["quarter"],
  values: [
    { accessor: "sales", aggregation: { type: "sum" }, label: "Sales" },
    { accessor: "units", aggregation: { type: "sum" }, label: "Units" },
  ],
}`),
    language: "typescript",
  },
  {
    title: "Values only (no column dims)",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">columns: []</code> to
        group and aggregate without a matrix of dynamic headers.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  rows: ["region", "category"],
  columns: [],
  values: [
    { accessor: "sales", aggregation: { type: "sum" } },
    { accessor: "cost", aggregation: { type: "sum" } },
  ],
}`),
    language: "typescript",
  },
  {
    title: "Totals",
    body: (
      <>
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">showRowTotals</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">showColumnTotals</code>
        , and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">showGrandTotal</code>{" "}
        default to true. Turn them off as needed.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  rows: ["country"],
  columns: ["category"],
  values: [{ accessor: "sales", aggregation: { type: "average" } }],
  showColumnTotals: false,
}`),
    language: "typescript",
  },
  {
    title: "Programmatic pivot",
    body: (
      <>
        Call{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">setPivot</code> to
        enable or update,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">getPivot</code> to read
        the active config, or pass{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">null</code> to return to
        the source grid.{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onPivotChange</code>{" "}
        fires for API-driven updates.
      </>
    ),
    codeByFramework: programmaticPivotSnippets(),
  },
];

const PIVOT_PROPS: PropInfo[] = [
  {
    key: "pivot",
    name: "pivot",
    required: false,
    description:
      "Matrix pivot config. When set, flat rows are reshaped into dynamic columns (one row per row-dimension combination). Pass null to disable. Consumer rowGrouping is off while active.",
    type: "PivotConfig | null",
    example: `pivot={{ rows: ["region"], columns: ["quarter"], values: [{ accessor: "sales", aggregation: { type: "sum" } }] }}`,
  },
  {
    key: "onPivotChange",
    name: "onPivotChange",
    required: false,
    description: "Fires when pivot changes via TableAPI.setPivot (not every prop sync from your app).",
    type: "(pivot: PivotConfig | null) => void",
    example: `onPivotChange={(pivot) => { /* ... */ }}`,
  },
  {
    key: "enablePivotPanel",
    name: "enablePivotPanel",
    required: false,
    description:
      "Adds a Pivot Panel to the column editor for placing fields into Rows / Columns / Values. Requires enableColumnEditor. Pivot activates when Values has ≥ 1 measure.",
    type: "boolean",
    example: `enableColumnEditor={true} enablePivotPanel={true}`,
  },
];

const PIVOT_CONFIG_PROPS: PropInfo[] = [
  {
    key: "rows",
    name: "PivotConfig.rows",
    required: true,
    description: "Row dimension accessors. Multiple fields → one flat row per combination.",
    type: "Accessor[]",
    example: `rows: ["region", "product"]`,
  },
  {
    key: "columns",
    name: "PivotConfig.columns",
    required: true,
    description: "Column dimension accessors. Distinct values become headers. Empty = values only.",
    type: "Accessor[]",
    example: `columns: ["quarter"]`,
  },
  {
    key: "values",
    name: "PivotConfig.values",
    required: true,
    description: "Measures to aggregate (at least one). Optional label overrides the header.",
    type: "PivotValueConfig[]",
    example: `values: [{ accessor: "sales", aggregation: { type: "sum" } }]`,
  },
  {
    key: "showRowTotals",
    name: "PivotConfig.showRowTotals",
    required: false,
    description: "Total column across column dims. Default true. Only when columns is non-empty.",
    type: "boolean",
    example: `showRowTotals: false`,
  },
  {
    key: "showColumnTotals",
    name: "PivotConfig.showColumnTotals",
    required: false,
    description: "Total row across row dims. Default true.",
    type: "boolean",
    example: `showColumnTotals: false`,
  },
  {
    key: "showGrandTotal",
    name: "PivotConfig.showGrandTotal",
    required: false,
    description: "Grand-total cells at the totals intersection. Default true.",
    type: "boolean",
    example: `showGrandTotal: false`,
  },
];

const TABLE_API_PROPS: PropInfo[] = [
  {
    key: "setPivot",
    name: "setPivot(config)",
    required: false,
    description: "Enable, update, or clear pivot. Pass null for the source grid.",
    type: "(config: PivotConfig | null) => void",
  },
  {
    key: "getPivot",
    name: "getPivot()",
    required: false,
    description: "Active pivot config, or null when off.",
    type: "() => PivotConfig | null",
  },
  {
    key: "getPivotHeaders",
    name: "getPivotHeaders()",
    required: false,
    description: "Generated headers while pivot is active.",
    type: "() => ColumnDef[]",
  },
  {
    key: "getPivotedRows",
    name: "getPivotedRows()",
    required: false,
    description: "Post-pivot rows while pivot is active (flat combination rows plus optional totals).",
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Pivot Tables</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Turn flat rows into a matrix — row fields on the left, column fields as dynamic headers,
        values aggregated in each cell.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <DocsSteps steps={PIVOT_STEPS} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        Patterns
      </motion.h2>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {PIVOT_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pattern.body}</p>
            <CodeBlock
              codeByFramework={pattern.codeByFramework}
              language={pattern.language}
              showLineNumbers={false}
            />
          </section>
        ))}
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        Example
      </motion.h2>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <LivePreview demoId="pivot" height="500px" demoHeight="500px" Preview={PivotDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        Props
      </motion.h2>

      <PropTable props={PIVOT_PROPS} title="Pivot props" />

      <div className="mt-8">
        <PropTable props={PIVOT_CONFIG_PROPS} title="PivotConfig" />
      </div>

      <div className="mt-8">
        <PropTable props={TABLE_API_PROPS} title="Pivot TableAPI methods" />
      </div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default PivotContent;
