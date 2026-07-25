"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import AggregateFunctionsDemo from "@/components/demos/AggregateFunctionsDemo";
import PageWrapper from "@/components/PageWrapper";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { AGGREGATION_CONFIG_PROPS } from "@/constants/propDefinitions";
import { forAllFrameworks, type CodeByFramework } from "@/constants/docsSnippets";

type AggregationPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const AGGREGATION_PATTERNS: AggregationPattern[] = [
  {
    title: "Sum",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          aggregation: &#123; type: &quot;sum&quot; &#125;
        </code>{" "}
        on a column. Aggregations run on grouped rows — you need{" "}
        <a href="/docs/row-grouping" className="text-blue-600 dark:text-blue-400 hover:underline">
          row grouping
        </a>
        .
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "budget",
  label: "Budget",
  type: "number",
  aggregation: { type: "sum" },
}`),
  },
  {
    title: "Average",
    body: "Arithmetic mean of values in each group.",
    codeByFramework: forAllFrameworks(`{
  accessor: "rating",
  label: "Rating",
  type: "number",
  aggregation: { type: "average" },
}`),
  },
  {
    title: "Count",
    body: "Counts non-null values in each group.",
    codeByFramework: forAllFrameworks(`{
  accessor: "projects",
  label: "Projects",
  aggregation: { type: "count" },
}`),
  },
  {
    title: "Min / max",
    body: "Finds the minimum or maximum value in each group.",
    codeByFramework: forAllFrameworks(`{
  accessor: "score",
  label: "Score",
  type: "number",
  aggregation: { type: "max" },
}`),
  },
  {
    title: "Parse and format values",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">parseValue</code> when
        source data is formatted (e.g. currency strings), and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">formatResult</code> to
        display the aggregate.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "budget",
  label: "Budget",
  aggregation: {
    type: "sum",
    parseValue: (val) => parseFloat(String(val).replace(/[^0-9.-]/g, "")),
    formatResult: (val) => "$" + val.toLocaleString(),
  },
}`),
  },
  {
    title: "Custom aggregation",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">type: &quot;custom&quot;</code>{" "}
        and provide{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">customFn</code> — it
        receives all values in the group.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "performance",
  label: "Performance",
  aggregation: {
    type: "custom",
    customFn: (values) => {
      const nums = values.map((v) => Number(v)).filter((n) => !Number.isNaN(n));
      if (nums.length === 0) return 0;
      return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
    },
  },
}`),
  },
];

const AGGREGATION_COLUMN_PROPS: PropInfo[] = [
  {
    key: "aggregation",
    name: "ColumnDef.aggregation",
    required: false,
    description:
      "Aggregates child values into parent group rows. Requires rowGrouping. Built-ins: sum, average, count, min, max, or custom.",
    type: "AggregationConfig",
    link: "/docs/api-reference#aggregation-config",
    example: `aggregation: { type: "sum" }`,
  },
];

const AggregateFunctionsContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faCalculator} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Aggregate Functions</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Summarize grouped rows with sum, average, count, min, max, or a custom function.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {AGGREGATION_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pattern.body}</p>
            <CodeBlock
              codeByFramework={pattern.codeByFramework}
              language="typescript"
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
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview
          demoId="aggregate-functions"
          height="500px"
          Preview={AggregateFunctionsDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={AGGREGATION_COLUMN_PROPS} title="Aggregation Configuration" />

      <div className="mt-8">
        <PropTable props={AGGREGATION_CONFIG_PROPS} title="AggregationConfig" />
      </div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default AggregateFunctionsContent;
