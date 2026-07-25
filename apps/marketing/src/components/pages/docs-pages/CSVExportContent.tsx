"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import CSVExportDemo from "@/components/demos/CSVExportDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { EXPORT_TO_CSV_PROPS } from "@/constants/propDefinitions";
import {
  exportToCSVSnippets,
  forAllFrameworks,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type CSVPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const OMIT_HEADERS_SNIPPETS: CodeByFramework = {
  react: `<SimpleTable
  columns={columns}
  rows={rows}
  includeHeadersInCSVExport={false}
/>`,
  solid: `<SimpleTable
  columns={columns}
  rows={rows()}
  includeHeadersInCSVExport={false}
/>`,
  vue: `<SimpleTable
  :columns="columns"
  :rows="rows"
  :include-headers-in-csv-export="false"
/>`,
  angular: `<simple-table
  [columns]="columns"
  [rows]="rows"
  [includeHeadersInCSVExport]="false"
></simple-table>`,
  svelte: `<SimpleTable
  {columns}
  {rows}
  includeHeadersInCSVExport={false}
/>`,
  vanilla: `new SimpleTableVanilla(container, {
  columns,
  rows,
  includeHeadersInCSVExport: false,
});`,
};

const CSV_PATTERNS: CSVPattern[] = [
  {
    title: "Export to CSV",
    body: (
      <>
        Get the table API and call{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">exportToCSV</code>.
        Optional{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">filename</code> defaults
        to{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">table-export.csv</code>.
        Exports all rows (every page when paginated), respecting active filters and sort.
      </>
    ),
    codeByFramework: exportToCSVSnippets(),
  },
  {
    title: "Omit header row",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          includeHeadersInCSVExport
        </code>{" "}
        to{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">false</code> to export
        data rows only.
      </>
    ),
    codeByFramework: OMIT_HEADERS_SNIPPETS,
  },
  {
    title: "Control which columns export",
    body: (
      <>
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">excludeFromCsv</code>{" "}
        keeps a column in the UI but out of the file.{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">excludeFromRender</code>{" "}
        hides it in the table (and column editor) but still includes it in the CSV.
      </>
    ),
    language: "typescript",
    codeByFramework: forAllFrameworks(`{
  accessor: "actions",
  label: "Actions",
  excludeFromCsv: true,
}

{
  accessor: "internalId",
  label: "Internal ID",
  excludeFromRender: true,
}`),
  },
];

const CSV_EXPORT_PROPS: PropInfo[] = [
  {
    key: "includeHeadersInCSVExport",
    name: "includeHeadersInCSVExport",
    required: false,
    description: "Include column labels as the first CSV row. Defaults to true.",
    type: "boolean",
    example: `includeHeadersInCSVExport={false}`,
  },
  {
    key: "excludeFromCsv",
    name: "ColumnDef.excludeFromCsv",
    required: false,
    description: "Show the column in the table but omit it from CSV export.",
    type: "boolean",
    example: `excludeFromCsv: true`,
  },
  {
    key: "excludeFromRender",
    name: "ColumnDef.excludeFromRender",
    required: false,
    description: "Hide the column in the table/editor while still exporting it to CSV.",
    type: "boolean",
    example: `excludeFromRender: true`,
  },
];

const CSVExportContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faDownload} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">CSV Export</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Download table data with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">exportToCSV</code>.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {CSV_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pattern.body}</p>
            <CodeBlock
              codeByFramework={pattern.codeByFramework}
              language={pattern.language}
              showLineNumbers={false}
            />
          </section>
        ))}
      </motion.div>

      <motion.p
        className="text-sm text-gray-700 dark:text-gray-300 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        Columns with a{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">valueFormatter</code>{" "}
        export the formatted text by default. Override with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          useFormattedValueForCSV
        </code>{" "}
        or{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">exportValueGetter</code>
        — see{" "}
        <Link
          href="/docs/value-formatter"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Value Formatter
        </Link>
        .
      </motion.p>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Example
      </motion.h2>
      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.32 }}
      >
        Use the export button in the demo. Code or StackBlitz has the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="csv-export" height={500} Preview={CSVExportDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={CSV_EXPORT_PROPS} title="CSV Export Configuration" />

      <motion.h3
        className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        exportToCSV options
      </motion.h3>
      <PropTable props={EXPORT_TO_CSV_PROPS} title="ExportToCSVProps" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default CSVExportContent;
