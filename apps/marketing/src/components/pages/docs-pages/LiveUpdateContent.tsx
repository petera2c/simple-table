"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import LiveUpdateDemo from "@/components/demos/LiveUpdateDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { liveUpdateSnippets, type CodeByFramework } from "@/constants/docsSnippets";

type LiveUpdatePattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const LIVE_UPDATE_PATTERNS: LiveUpdatePattern[] = [
  {
    title: "Update a cell",
    body: (
      <>
        Provide{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">getRowId</code>, then
        call{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">updateData</code> with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rowId</code> (preferred)
        or{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rowIndex</code> into your
        source{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rows</code> array. Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">cellUpdateFlash</code> to
        highlight the cell when it changes.
      </>
    ),
    codeByFramework: liveUpdateSnippets(),
  },
];

const LIVE_UPDATE_PROPS: PropInfo[] = [
  {
    key: "cellUpdateFlash",
    name: "cellUpdateFlash",
    required: false,
    description: "Flashes a cell when its value is updated via updateData.",
    type: "boolean",
    example: `cellUpdateFlash={true}`,
  },
];

const UPDATE_DATA_PARAMS_PROPS: PropInfo[] = [
  {
    key: "accessor",
    name: "accessor",
    required: true,
    description: "Column accessor for the cell to update.",
    type: "string",
    example: `accessor: "price"`,
  },
  {
    key: "rowId",
    name: "rowId",
    required: false,
    description:
      "Stable row id from getRowId. Preferred. Wins when both rowId and rowIndex are passed.",
    type: "string | number",
    example: `rowId: targetId`,
  },
  {
    key: "rowIndex",
    name: "rowIndex",
    required: false,
    description:
      "Zero-based index into your source rows array (not sorted/visible order). Use when you don't have a rowId.",
    type: "number",
    example: `rowIndex: 0`,
  },
  {
    key: "newValue",
    name: "newValue",
    required: true,
    description: "New cell value.",
    type: "any",
    example: `newValue: 29.99`,
  },
];

const LiveUpdateContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faBolt} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Live Updates</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Push cell changes in real time with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">updateData</code>.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {LIVE_UPDATE_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pattern.body}</p>
            <CodeBlock codeByFramework={pattern.codeByFramework} showLineNumbers={false} />
          </section>
        ))}
      </motion.div>

      <motion.div
        className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">Charts</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Chart columns accept array values the same way — update the series with{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">updateData</code>. See{" "}
          <Link
            href="/docs/chart-columns"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Chart Columns
          </Link>
          . For the full table API, see{" "}
          <Link
            href="/docs/programmatic-control"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Programmatic Control
          </Link>
          .
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
        Prices, stock, and chart series update on a timer. Use Code or StackBlitz for the full
        example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="live-update" height="400px" Preview={LiveUpdateDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={LIVE_UPDATE_PROPS} title="Live Update Configuration" />

      <motion.h3
        className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        updateData parameters
      </motion.h3>
      <PropTable props={UPDATE_DATA_PARAMS_PROPS} title="updateData" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default LiveUpdateContent;
