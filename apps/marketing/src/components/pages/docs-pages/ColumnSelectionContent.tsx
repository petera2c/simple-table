"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMousePointer } from "@fortawesome/free-solid-svg-icons";
import ColumnSelectionDemo from "@/components/demos/ColumnSelectionDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { columnSelectionSnippets, type CodeByFramework } from "@/constants/docsSnippets";

type SelectionPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const SELECTION_PATTERNS: SelectionPattern[] = [
  {
    title: "Enable column selection",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">selectableColumns</code>{" "}
        and handle{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onColumnSelect</code>.
        Click a header to select that column (highlights the column).
      </>
    ),
    codeByFramework: columnSelectionSnippets(),
  },
];

const COLUMN_SELECTION_PROPS: PropInfo[] = [
  {
    key: "selectableColumns",
    name: "selectableColumns",
    required: false,
    description: "Enables clicking column headers to select them.",
    type: "boolean",
    example: `selectableColumns={true}`,
  },
  {
    key: "onColumnSelect",
    name: "onColumnSelect",
    required: false,
    description:
      "Fires when a column header is selected. Receives the framework column def (e.g. ReactColumnDef).",
    type: "(header: ColumnDef) => void",
    example: `onColumnSelect={(column) => { /* ... */ }}`,
  },
];

const ColumnSelectionContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faMousePointer} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Selection</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Let users select columns by clicking headers — useful for analysis tools or column-scoped
        actions.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {SELECTION_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pattern.body}</p>
            <CodeBlock
              codeByFramework={pattern.codeByFramework}
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
        <LivePreview demoId="column-selection" height="400px" Preview={ColumnSelectionDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={COLUMN_SELECTION_PROPS} title="Column Selection Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ColumnSelectionContent;
