"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import NestedHeadersDemo from "@/components/demos/NestedHeadersDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { forAllFrameworks, type CodeByFramework } from "@/constants/docsSnippets";

type NestedPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const NESTED_PATTERNS: NestedPattern[] = [
  {
    title: "Group columns with children",
    body: (
      <>
        Add a{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">children</code> array to
        a parent column. The parent is a header group (no cell data); leaf columns hold the values
        and can use sorting, filtering, and other column props as usual. Parent width spans its
        children.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  label: "Test Scores",
  children: [
    { accessor: "math", label: "Math", width: 80, type: "number" },
    { accessor: "science", label: "Science", width: 80, type: "number" },
    { accessor: "english", label: "English", width: 80, type: "number" },
  ],
}`),
  },
  {
    title: "Multiple levels",
    body: (
      <>
        Nest further by adding{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">children</code> on a
        child column.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  label: "Academics",
  children: [
    {
      label: "STEM",
      children: [
        { accessor: "math", label: "Math", width: 80, type: "number" },
        { accessor: "science", label: "Science", width: 80, type: "number" },
      ],
    },
    { accessor: "english", label: "English", width: 80, type: "number" },
  ],
}`),
  },
];

const NESTED_HEADERS_PROPS: PropInfo[] = [
  {
    key: "children",
    name: "ColumnDef.children",
    required: false,
    description:
      "Child columns grouped under this parent header. Creates a hierarchical header structure.",
    type: "ColumnDef[]",
    link: "/docs/api-reference#column-def",
    example: `children: [
  { accessor: "math", label: "Math", width: 80 },
  { accessor: "science", label: "Science", width: 80 },
]`,
  },
];

export default function NestedHeadersContent() {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faLayerGroup} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Nested Headers</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Group related columns under parent headers for clearer structure.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {NESTED_PATTERNS.map((pattern) => (
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
        <LivePreview demoId="nested-headers" height="400px" Preview={NestedHeadersDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={NESTED_HEADERS_PROPS} title="Nested Headers Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
}
