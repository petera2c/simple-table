"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import CellHighlightingDemo from "@/components/demos/CellHighlightingDemo";
import PageWrapper from "@/components/PageWrapper";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { tableSnippets, type TablePropOptions } from "@/constants/docsSnippets";

type HighlightPattern = {
  title: string;
  body: ReactNode;
  options: TablePropOptions;
};

const HIGHLIGHT_PATTERNS: HighlightPattern[] = [
  {
    title: "Enable cell selection",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">selectableCells</code>{" "}
        so users can click cells, drag or Shift+arrow to extend a range, and copy with Ctrl/⌘+C.
      </>
    ),
    options: { selectableCells: true },
  },
  {
    title: "Select columns from headers",
    body: (
      <>
        Add{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">selectableColumns</code>{" "}
        to select a whole column from the header. For{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onColumnSelect</code>{" "}
        and column-scoped actions, see{" "}
        <Link
          href="/docs/column-selection"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Column Selection
        </Link>
        .
      </>
    ),
    options: { selectableCells: true, selectableColumns: true },
  },
  {
    title: "Copy headers with cells",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          copyHeadersToClipboard
        </code>{" "}
        so the first pasted row is the column labels.
      </>
    ),
    options: { selectableCells: true, copyHeadersToClipboard: true },
  },
];

const KEYBOARD_SHORTCUTS: { keys: string; description: string }[] = [
  { keys: "Shift + Arrow", description: "Extend selection" },
  { keys: "Ctrl/⌘ + A", description: "Select all cells" },
  { keys: "Ctrl/⌘ + Shift + Arrow", description: "Extend to edge of data" },
  { keys: "Home / End", description: "First / last column in row" },
  { keys: "Ctrl/⌘ + Home / End", description: "First / last cell in table" },
  { keys: "Page Up / Page Down", description: "Move by visible page" },
];

const CELL_HIGHLIGHTING_PROPS: PropInfo[] = [
  {
    key: "selectableCells",
    name: "selectableCells",
    required: false,
    description: "Enables clicking and keyboard selection of cells and ranges for copy/paste.",
    type: "boolean",
    example: `selectableCells={true}`,
  },
  {
    key: "selectableColumns",
    name: "selectableColumns",
    required: false,
    description: "Enables selecting an entire column by clicking its header.",
    type: "boolean",
    example: `selectableColumns={true}`,
  },
  {
    key: "copyHeadersToClipboard",
    name: "copyHeadersToClipboard",
    required: false,
    description:
      "When true, includes column headers as the first row when copying selected cells. Defaults to false.",
    type: "boolean",
    example: `copyHeadersToClipboard={true}`,
  },
];

const CellHighlightingContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faCopy} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Cell Highlighting</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Select cells or ranges to highlight and copy. Useful for analysis and spreadsheet-style
        workflows.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {HIGHLIGHT_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pattern.body}</p>
            <CodeBlock
              codeByFramework={tableSnippets(pattern.options)}
              showLineNumbers={false}
            />
          </section>
        ))}
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        Keyboard
      </motion.h2>
      <motion.div
        className="mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          {KEYBOARD_SHORTCUTS.map((item) => (
            <div key={item.keys} className="contents">
              <code className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200 whitespace-nowrap">
                {item.keys}
              </code>
              <span className="text-gray-700 dark:text-gray-300 self-center">
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.32 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">Copy and paste</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Copy with Ctrl/⌘+C; paste with Ctrl/⌘+V. Only columns with{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">editable: true</code>{" "}
          accept paste — see{" "}
          <Link
            href="/docs/cell-editing"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Cell Editing
          </Link>
          .
        </p>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        Example
      </motion.h2>
      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.36 }}
      >
        Click a cell or drag to select a range. Use Code or StackBlitz for the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.38 }}
      >
        <LivePreview demoId="cell-highlighting" height="400px" Preview={CellHighlightingDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={CELL_HIGHLIGHTING_PROPS} title="Cell Highlighting Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default CellHighlightingContent;
