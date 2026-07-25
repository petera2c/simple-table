"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import CellRendererDemo from "@/components/demos/CellRendererDemo";
import PageWrapper from "@/components/PageWrapper";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { CELL_RENDERER_PROPS as CELL_RENDERER_PARAMS_PROPS } from "@/constants/propDefinitions";
import {
  cellRendererFormattedValueSnippets,
  cellRendererSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type RendererPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const RENDERER_PATTERNS: RendererPattern[] = [
  {
    title: "Add a cell renderer",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">cellRenderer</code> on a
        column. Return text, or framework UI (components / DOM nodes). Prefer{" "}
        <Link
          href="/docs/value-formatter"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          valueFormatter
        </Link>{" "}
        for plain text formatting.
      </>
    ),
    codeByFramework: cellRendererSnippets(),
  },
  {
    title: "Wrap formatted values",
    body: (
      <>
        Pair with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">valueFormatter</code>, then
        read{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">formattedValue</code> in
        the renderer when you only need custom chrome around already-formatted text.
      </>
    ),
    codeByFramework: cellRendererFormattedValueSnippets(),
    language: "typescript",
  },
];

const CELL_RENDERER_PROPS: PropInfo[] = [
  {
    key: "cellRenderer",
    name: "ColumnDef.cellRenderer",
    required: false,
    description:
      "Custom cell content. Framework adapters accept components or render functions; vanilla returns string/number/null or a DOM Node.",
    type: "(props: CellRendererProps) => …",
    link: "/docs/api-reference#cell-renderer-props",
    example: `cellRenderer: StatusCell`,
  },
];

const CellRendererContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faCode} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Cell Renderer</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Render custom cell UI — badges, links, progress bars, and other interactive content — with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">cellRenderer</code>.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {RENDERER_PATTERNS.map((pattern) => (
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
        Badges, links, progress, and more. Use Code or StackBlitz for the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.38 }}
      >
        <LivePreview demoId="cell-renderer" height="400px" Preview={CellRendererDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={CELL_RENDERER_PROPS} title="Cell Renderer Configuration" />

      <motion.h3
        className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        Renderer arguments
      </motion.h3>
      <PropTable props={CELL_RENDERER_PARAMS_PROPS} title="CellRendererProps" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default CellRendererContent;
