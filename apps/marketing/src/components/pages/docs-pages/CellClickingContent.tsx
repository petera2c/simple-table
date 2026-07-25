"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointer } from "@fortawesome/free-solid-svg-icons";
import CellClickingDemo from "@/components/demos/CellClickingDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { CELL_CLICK_PROPS } from "@/constants/propDefinitions";
import { onCellClickSnippets, type CodeByFramework } from "@/constants/docsSnippets";

type ClickPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const CLICK_PATTERNS: ClickPattern[] = [
  {
    title: "Handle cell clicks",
    body: (
      <>
        Pass{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onCellClick</code>. Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">accessor</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">value</code>, and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">row</code> for navigation,
        modals, or other actions.
      </>
    ),
    codeByFramework: onCellClickSnippets(),
  },
];

const CELL_CLICKING_PROPS: PropInfo[] = [
  {
    key: "onCellClick",
    name: "onCellClick",
    required: false,
    description: "Fires when a cell is clicked. Receives accessor, value, row, and indices.",
    type: "(props: CellClickProps) => void",
    link: "/docs/api-reference#cell-click-props",
    example: `onCellClick={({ accessor, value, row }) => {
  // ...
}}`,
  },
];

export default function CellClickingContent() {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faHandPointer} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Cell Clicking</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        React to cell clicks with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onCellClick</code>.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {CLICK_PATTERNS.map((pattern) => (
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
      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.32 }}
      >
        Click cells to filter, toggle status, or open details. Use Code or StackBlitz for the full
        example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="cell-clicking" height="400px" Preview={CellClickingDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={CELL_CLICKING_PROPS} title="Cell Clicking Configuration" />

      <motion.h3
        className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        Click arguments
      </motion.h3>
      <PropTable props={CELL_CLICK_PROPS} title="CellClickProps" />

      <DocNavigationButtons />
    </PageWrapper>
  );
}
