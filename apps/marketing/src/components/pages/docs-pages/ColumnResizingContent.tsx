"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ColumnResizingDemo from "@/components/demos/ColumnResizingDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import { faLeftRight } from "@fortawesome/free-solid-svg-icons";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import {
  persistColumnWidthSnippets,
  tableSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type ResizePattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const RESIZE_PATTERNS: ResizePattern[] = [
  {
    title: "Enable resizing",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">columnResizing</code> to
        let users drag header dividers. Double-click a handle to auto-fit that column to its
        content.
      </>
    ),
    codeByFramework: tableSnippets({ height: "400px", columnResizing: true }),
  },
  {
    title: "Persist column widths",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          onColumnWidthChange
        </code>{" "}
        to save widths whenever the user resizes or auto-fits a column.
      </>
    ),
    codeByFramework: persistColumnWidthSnippets(),
  },
];

const COLUMN_RESIZING_PROPS: PropInfo[] = [
  {
    key: "columnResizing",
    name: "columnResizing",
    required: false,
    description:
      "Enables dragging header dividers to resize columns. Double-click a handle to auto-fit that column to its content.",
    type: "boolean",
    example: `columnResizing={true}`,
  },
  {
    key: "onColumnWidthChange",
    name: "onColumnWidthChange",
    required: false,
    description:
      "Fires after resize or double-click auto-size with the updated column defs. Use it to persist widths.",
    type: "(headers: ColumnDef[]) => void",
    link: "/docs/api-reference#simple-table-props",
    example: `onColumnWidthChange={(headers) => {
  localStorage.setItem(
    "columnWidths",
    JSON.stringify(
      Object.fromEntries(headers.map((h) => [h.accessor, h.width]))
    )
  );
}}`,
  },
];

const ColumnResizingContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faLeftRight} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Resizing</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Let users adjust column widths by dragging header dividers — or double-click to auto-fit.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {RESIZE_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pattern.body}</p>
            <CodeBlock codeByFramework={pattern.codeByFramework} showLineNumbers={false} />
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
        Drag dividers or double-click to auto-fit. This demo saves widths to localStorage.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="column-resizing" height="400px" Preview={ColumnResizingDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={COLUMN_RESIZING_PROPS} title="Column Resizing Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ColumnResizingContent;
