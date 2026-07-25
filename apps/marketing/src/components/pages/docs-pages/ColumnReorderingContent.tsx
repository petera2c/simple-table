"use client";

import type { ReactNode } from "react";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import ColumnReorderingDemo from "@/components/demos/ColumnReorderingDemo";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import {
  forAllFrameworks,
  persistColumnOrderSnippets,
  tableSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type ReorderPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const REORDER_PATTERNS: ReorderPattern[] = [
  {
    title: "Enable reordering",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">columnReordering</code>{" "}
        so users can drag column headers to rearrange them.
      </>
    ),
    codeByFramework: tableSnippets({ height: "400px", columnReordering: true }),
  },
  {
    title: "Handle order changes",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          onColumnOrderChange
        </code>{" "}
        to update your columns state (and optionally persist the new order).
      </>
    ),
    codeByFramework: persistColumnOrderSnippets(),
  },
  {
    title: "Lock a column",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">disableReorder</code> on
        a column def to keep it fixed while others move.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "id",
  label: "ID",
  width: 60,
  disableReorder: true,
}`),
    language: "typescript",
  },
];

const COLUMN_REORDERING_PROPS: PropInfo[] = [
  {
    key: "columnReordering",
    name: "columnReordering",
    required: false,
    description: "Enables drag-and-drop reordering of column headers.",
    type: "boolean",
    example: `columnReordering={true}`,
  },
  {
    key: "onColumnOrderChange",
    name: "onColumnOrderChange",
    required: false,
    description: "Fires with the updated column defs after the user reorders columns.",
    type: "(newHeaders: ColumnDef[]) => void",
    example: `onColumnOrderChange={(headers) => setColumns(headers)}`,
  },
  {
    key: "disableReorder",
    name: "ColumnDef.disableReorder",
    required: false,
    description: "Prevents this column from being reordered.",
    type: "boolean",
    example: `disableReorder: true`,
  },
];

export default function ColumnReorderingContent() {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faArrowRightArrowLeft} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Reordering</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Let users drag column headers to rearrange the table layout.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {REORDER_PATTERNS.map((pattern) => (
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
        Drag column headers to reorder them.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="column-reordering" height="400px" Preview={ColumnReorderingDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={COLUMN_REORDERING_PROPS} title="Column Reordering Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
}
