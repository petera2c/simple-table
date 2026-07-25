"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderMinus } from "@fortawesome/free-solid-svg-icons";
import CollapsibleColumnsDemo from "@/components/demos/CollapsibleColumnsDemo";
import SingleRowChildrenDemo from "@/components/demos/SingleRowChildrenDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { forAllFrameworks, type CodeByFramework } from "@/constants/docsSnippets";

type CollapsePattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const COLLAPSE_PATTERNS: CollapsePattern[] = [
  {
    title: "Enable collapsible groups",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">collapsible: true</code>{" "}
        on a parent with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">children</code>. Users
        click the header arrow to hide or show the group.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "sales",
  label: "Sales",
  collapsible: true,
  children: [
    { accessor: "q1", label: "Q1", width: 90, type: "number" },
    { accessor: "q2", label: "Q2", width: 90, type: "number" },
    { accessor: "q3", label: "Q3", width: 90, type: "number" },
    { accessor: "q4", label: "Q4", width: 90, type: "number" },
  ],
}`),
    language: "typescript",
  },
  {
    title: "Start collapsed",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">collapseDefault</code> so
        the group loads collapsed — useful when details should stay optional.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "details",
  label: "Details",
  collapsible: true,
  collapseDefault: true,
  children: [
    { accessor: "note", label: "Note", width: 160 },
    { accessor: "owner", label: "Owner", width: 120 },
  ],
}`),
    language: "typescript",
  },
  {
    title: "Control child visibility",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">showWhen</code> on child
        columns:{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">parentExpanded</code>{" "}
        (default),{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">parentCollapsed</code>,
        or{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">always</code>. Common
        pattern: summary when collapsed, detail when expanded.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "sales",
  label: "Sales",
  collapsible: true,
  children: [
    { accessor: "total", label: "Total", showWhen: "parentCollapsed" },
    { accessor: "q1", label: "Q1", showWhen: "parentExpanded" },
    { accessor: "q2", label: "Q2", showWhen: "parentExpanded" },
  ],
}`),
    language: "typescript",
  },
  {
    title: "Single-row children",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          singleRowChildren: true
        </code>{" "}
        so the parent header sits beside its children (same row) instead of above them — the parent
        acts like a column that collapses its neighbors.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "personalInfo",
  label: "Personal Info",
  collapsible: true,
  singleRowChildren: true,
  children: [
    { accessor: "firstName", label: "First Name", width: 120 },
    { accessor: "lastName", label: "Last Name", width: 120 },
    { accessor: "email", label: "Email", width: 200 },
  ],
}`),
    language: "typescript",
  },
];

const COLLAPSIBLE_COLUMNS_PROPS: PropInfo[] = [
  {
    key: "collapsible",
    name: "ColumnDef.collapsible",
    required: false,
    description: "Enables expand/collapse on a parent column that has children.",
    type: "boolean",
    example: `collapsible: true`,
  },
  {
    key: "collapseDefault",
    name: "ColumnDef.collapseDefault",
    required: false,
    description: "Starts the group collapsed. Only applies when collapsible is true.",
    type: "boolean",
    example: `collapseDefault: true`,
  },
  {
    key: "showWhen",
    name: "ColumnDef.showWhen",
    required: false,
    description: "When a child column is visible relative to the parent's collapse state.",
    type: "enum",
    enumValues: ["parentExpanded", "parentCollapsed", "always"],
    example: `showWhen: "parentCollapsed"`,
  },
  {
    key: "singleRowChildren",
    name: "ColumnDef.singleRowChildren",
    required: false,
    description:
      "Renders the parent header beside its children in one row instead of nested above them.",
    type: "boolean",
    example: `singleRowChildren: true`,
  },
  {
    key: "icons.headerExpand",
    name: "icons.headerExpand",
    required: false,
    description: "Custom expand icon for collapsible headers.",
    type: "ReactNode",
    example: `icons={{ headerExpand: <ExpandIcon /> }}`,
  },
  {
    key: "icons.headerCollapse",
    name: "icons.headerCollapse",
    required: false,
    description: "Custom collapse icon for collapsible headers.",
    type: "ReactNode",
    example: `icons={{ headerCollapse: <CollapseIcon /> }}`,
  },
];

const CollapsibleColumnsContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faFolderMinus} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Collapsible Columns</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Hide and show column groups to save space — click the header arrow to collapse or expand.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {COLLAPSE_PATTERNS.map((pattern) => (
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
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview
          demoId="collapsible-columns"
          height="400px"
          Preview={CollapsibleColumnsDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Single-row children example
      </motion.h2>
      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        Parent header sits in the same row as its children.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <LivePreview
          demoId="single-row-children"
          height="400px"
          Preview={SingleRowChildrenDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Props
      </motion.h2>

      <PropTable props={COLLAPSIBLE_COLUMNS_PROPS} title="Collapsible Columns Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default CollapsibleColumnsContent;
