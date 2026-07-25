"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "@/components/PageWrapper";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import CodeBlock from "@/components/CodeBlock";
import PropTable, { type PropInfo } from "@/components/PropTable";
import ChartsDemo from "@/components/demos/ChartsDemo";
import LivePreview from "@/components/LivePreview";
import { CHART_OPTIONS_PROPS } from "@/constants/propDefinitions";
import { forAllFrameworks, type CodeByFramework } from "@/constants/docsSnippets";

type ChartPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const CHART_PATTERNS: ChartPattern[] = [
  {
    title: "Line / area chart",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          type: &quot;lineAreaChart&quot;
        </code>
        . Cell values must be number arrays — good for trends over time.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "monthlySales",
  label: "Sales (12mo)",
  type: "lineAreaChart",
  width: 150,
  align: "center",
}`),
    language: "typescript",
  },
  {
    title: "Bar chart",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          type: &quot;barChart&quot;
        </code>{" "}
        for discrete comparisons (quarters, weeks, categories).
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "quarterlyRevenue",
  label: "Quarterly",
  type: "barChart",
  width: 140,
  align: "center",
}`),
    language: "typescript",
  },
  {
    title: "Customize with chartOptions",
    body: (
      <>
        Scale, size, and colors via{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">chartOptions</code>.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "cpuHistory",
  label: "CPU",
  type: "lineAreaChart",
  width: 150,
  chartOptions: {
    min: 0,
    max: 100,
    color: "#3b82f6",
    height: 35,
  },
}`),
    language: "typescript",
  },
];

const CHART_COLUMN_PROPS: PropInfo[] = [
  {
    key: "type",
    name: "ColumnDef.type",
    required: false,
    description:
      'Use "lineAreaChart" or "barChart". The cell value must be an array of numbers.',
    type: "ColumnType",
    link: "/docs/api-reference#column-type",
    enumValues: ["lineAreaChart", "barChart"],
    example: `type: "lineAreaChart"
type: "barChart"`,
  },
  {
    key: "chartOptions",
    name: "ColumnDef.chartOptions",
    required: false,
    description: "Appearance and scaling options for chart columns.",
    type: "ChartOptions",
    link: "/docs/api-reference#chart-options",
    example: `chartOptions: { min: 0, max: 100, color: "#3b82f6" }`,
  },
];

const ChartColumnsContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faChartLine} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Chart Columns</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Render number arrays as inline line/area or bar charts — no extra chart library required.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {CHART_PATTERNS.map((pattern) => (
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

      <motion.div
        className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">Copy and paste</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Copy produces comma-separated values (e.g.{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">10, 15, 12</code>
          ). Paste parses that format back into a number array. Empty cells clear to{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">[]</code>.
        </p>
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
        Select a chart cell and copy (Ctrl/⌘+C). Use Code or StackBlitz for the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="charts" height="400px" Preview={ChartsDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={CHART_COLUMN_PROPS} title="Chart Column Configuration" />

      <motion.h3
        className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        ChartOptions
      </motion.h3>
      <PropTable props={CHART_OPTIONS_PROPS} title="ChartOptions" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ChartColumnsContent;
