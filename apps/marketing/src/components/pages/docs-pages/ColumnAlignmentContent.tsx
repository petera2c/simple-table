"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter } from "@fortawesome/free-solid-svg-icons";
import ColumnAlignmentDemo from "@/components/demos/ColumnAlignmentDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { forAllFrameworks, type CodeByFramework } from "@/constants/docsSnippets";

type AlignPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const ALIGN_PATTERNS: AlignPattern[] = [
  {
    title: "Left (default)",
    body: "Best for names, descriptions, and other text. Omit align or set it explicitly to left.",
    codeByFramework: forAllFrameworks(`{
  accessor: "name",
  label: "Full Name",
  width: "1fr",
  align: "left",
}`),
  },
  {
    title: "Center",
    body: "Use for status badges, icons, and other short indicators.",
    codeByFramework: forAllFrameworks(`{
  accessor: "status",
  label: "Status",
  width: 100,
  align: "center",
}`),
  },
  {
    title: "Right",
    body: "Use for numbers, currency, and percentages so values line up vertically.",
    codeByFramework: forAllFrameworks(`{
  accessor: "price",
  label: "Price",
  width: 120,
  type: "number",
  align: "right",
}`),
  },
];

const COLUMN_ALIGNMENT_PROPS: PropInfo[] = [
  {
    key: "align",
    name: "ColumnDef.align",
    required: false,
    description:
      "Horizontal alignment for header and cell content in the column. Defaults to left.",
    type: "enum",
    link: "/docs/api-reference#union-types",
    enumValues: ["left", "center", "right"],
    example: `align: "left"
align: "center"
align: "right"`,
  },
];

const ColumnAlignmentContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faAlignCenter} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Alignment</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Control horizontal alignment of header and cell content with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">align</code>.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {ALIGN_PATTERNS.map((pattern) => (
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
        <LivePreview demoId="column-alignment" height="400px" Preview={ColumnAlignmentDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={COLUMN_ALIGNMENT_PROPS} title="Column Alignment Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ColumnAlignmentContent;
