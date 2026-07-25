"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush } from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "@/components/PageWrapper";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import CodeBlock from "@/components/CodeBlock";
import PropTable, { type PropInfo } from "@/components/PropTable";
import LivePreview from "@/components/LivePreview";
import ValueFormatterDemo from "@/components/demos/ValueFormatterDemo";
import { VALUE_FORMATTER_PROPS as VALUE_FORMATTER_PARAMS_PROPS } from "@/constants/propDefinitions";
import { forAllFrameworks, type CodeByFramework } from "@/constants/docsSnippets";

type FormatterPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const FORMATTER_PATTERNS: FormatterPattern[] = [
  {
    title: "Format display values",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">valueFormatter</code> on
        a column. It formats for display only — the underlying data stays unchanged. For custom UI,
        use{" "}
        <Link
          href="/docs/cell-renderer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          cellRenderer
        </Link>
        .
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "salary",
  label: "Salary",
  type: "number",
  valueFormatter: ({ value }) =>
    typeof value === "number" ? \`$\${value.toLocaleString()}\` : "",
}`),
    language: "typescript",
  },
  {
    title: "Use other row fields",
    body: (
      <>
        Read{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">row</code> when the
        display string needs more than the current cell.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "firstName",
  label: "Name",
  valueFormatter: ({ value, row }) => \`\${value} \${row.lastName ?? ""}\`.trim(),
}`),
    language: "typescript",
  },
  {
    title: "Copy and CSV",
    body: (
      <>
        With a{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">valueFormatter</code>,
        copy and CSV use the formatted value by default. Set the flags to{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">false</code> for raw
        values, or use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">exportValueGetter</code>{" "}
        for a CSV-only override.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "salary",
  label: "Salary",
  type: "number",
  valueFormatter: ({ value }) =>
    typeof value === "number" ? \`$\${value.toLocaleString()}\` : "",
  // useFormattedValueForClipboard: false, // copy raw number
  // useFormattedValueForCSV: false,       // export raw number
  exportValueGetter: ({ value }) =>
    typeof value === "number" ? value.toFixed(2) : "",
}`),
    language: "typescript",
  },
];

const VALUE_FORMATTER_PROPS: PropInfo[] = [
  {
    key: "valueFormatter",
    name: "ColumnDef.valueFormatter",
    required: false,
    description:
      "Formats the cell for display without changing the underlying data. Returns a string, number, or array of those.",
    type: "(props: ValueFormatterProps) => string | number | string[] | number[]",
    link: "/docs/api-reference#value-formatter-props",
    example: `valueFormatter: ({ value }) => \`$\${value}\``,
  },
  {
    key: "useFormattedValueForClipboard",
    name: "ColumnDef.useFormattedValueForClipboard",
    required: false,
    description:
      "When a valueFormatter exists, defaults to true (formatted on copy). Set false to copy the raw value.",
    type: "boolean",
    example: `useFormattedValueForClipboard: false`,
  },
  {
    key: "useFormattedValueForCSV",
    name: "ColumnDef.useFormattedValueForCSV",
    required: false,
    description:
      "When a valueFormatter exists, defaults to true (formatted in CSV). Set false for raw values. Ignored if exportValueGetter is set.",
    type: "boolean",
    example: `useFormattedValueForCSV: false`,
  },
  {
    key: "exportValueGetter",
    name: "ColumnDef.exportValueGetter",
    required: false,
    description: "Custom CSV export value. Takes precedence over useFormattedValueForCSV.",
    type: "(props: ExportValueProps) => string | number",
    link: "/docs/api-reference#export-value-props",
    example: `exportValueGetter: ({ value }) => String(value)`,
  },
];

const ValueFormatterContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faPaintBrush} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Value Formatter</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Format cell text for display — currency, dates, percentages — without changing the data.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {FORMATTER_PATTERNS.map((pattern) => (
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
        Currency, dates, percentages, and combined fields. Use Code or StackBlitz for the full
        example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="value-formatter" height="400px" Preview={ValueFormatterDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={VALUE_FORMATTER_PROPS} title="Value Formatter Configuration" />

      <motion.h3
        className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        Formatter arguments
      </motion.h3>
      <PropTable props={VALUE_FORMATTER_PARAMS_PROPS} title="ValueFormatterProps" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ValueFormatterContent;
