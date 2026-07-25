"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import NestedTablesDemo from "@/components/demos/NestedTablesDemo";
import DynamicNestedTablesDemo from "@/components/demos/DynamicNestedTablesDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import DocsSteps, { type DocsStep } from "@/components/DocsSteps";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import {
  forAllFrameworks,
  nestedTablesSnippets,
  onRowGroupExpandSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type NestedPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const NESTED_STEPS: DocsStep[] = [
  {
    title: "Define child columns",
    body: (
      <>
        Unlike{" "}
        <a href="/docs/row-grouping" className="text-blue-600 dark:text-blue-400 hover:underline">
          row grouping
        </a>
        , each level can have its own column set.
      </>
    ),
    codeByFramework: forAllFrameworks(`const divisionColumns = [
  { accessor: "divisionId", label: "Division ID", width: 120 },
  { accessor: "revenue", label: "Revenue", width: 120, type: "number" },
  { accessor: "headcount", label: "Headcount", width: 110, type: "number" },
  { accessor: "location", label: "Location", width: "1fr" },
];`),
    language: "typescript",
  },
  {
    title: "Add nestedTable to an expandable column",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">expandable: true</code>{" "}
        and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">nestedTable</code> with
        those child columns.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "companyName",
  label: "Company",
  width: 200,
  expandable: true,
  nestedTable: {
    columns: divisionColumns,
  },
}`),
    language: "typescript",
  },
  {
    title: "Shape nested data",
    body: (
      <>
        Nest child arrays under the{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rowGrouping</code> keys.
        Child fields match the nested table columns.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  id: "co-1",
  companyName: "Acme Corp",
  divisions: [
    {
      divisionId: "D-1",
      revenue: 1200000,
      headcount: 42,
      location: "Austin",
    },
  ],
}`),
    language: "typescript",
  },
  {
    title: "Wire rowGrouping on the parent table",
    body: (
      <>
        Pass{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rowGrouping</code> and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">getRowId</code> so
        expansion stays stable.
      </>
    ),
    codeByFramework: nestedTablesSnippets(),
  },
];

const NESTED_PATTERNS: NestedPattern[] = [
  {
    title: "Configure the nested table",
    body: (
      <>
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">nestedTable</code>{" "}
        accepts most SimpleTable props (selection, resizing, theme, pagination, and more).{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rows</code> and state
        renderers come from the parent and are not set here.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "companyName",
  label: "Company",
  expandable: true,
  nestedTable: {
    columns: divisionColumns,
    enableRowSelection: true,
    columnResizing: true,
    autoExpandColumns: true,
  },
}`),
    language: "typescript",
  },
  {
    title: "Multi-level nesting",
    body: (
      <>
        Add{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">nestedTable</code> on a
        column inside the child columns, and extend{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rowGrouping</code>{" "}
        accordingly.
      </>
    ),
    codeByFramework: forAllFrameworks(`// Parent column
{
  accessor: "companyName",
  expandable: true,
  nestedTable: {
    columns: [
      {
        accessor: "divisionName",
        expandable: true,
        nestedTable: { columns: teamColumns },
      },
      // ...
    ],
  },
}

// Parent table
rowGrouping: ["divisions", "teams"]`),
    language: "typescript",
  },
  {
    title: "Lazy-load nested rows",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onRowGroupExpand</code>{" "}
        on the parent (or on a nested level) to fetch children when a row expands — same helpers as
        row grouping (
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">setLoading</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">setError</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">setEmpty</code>).
      </>
    ),
    codeByFramework: onRowGroupExpandSnippets(),
  },
];

const NESTED_TABLE_PROPS: PropInfo[] = [
  {
    key: "nestedTable",
    name: "ColumnDef.nestedTable",
    required: false,
    description:
      "Renders an independent child table on expand. Requires expandable: true and matching rowGrouping.",
    type: "Omit<SimpleTableProps, inherited>",
    link: "/docs/api-reference#column-def",
    example: `nestedTable: { columns: divisionColumns }`,
  },
  {
    key: "columns",
    name: "nestedTable.columns",
    required: true,
    description: "Column defs for the nested table — can differ entirely from the parent.",
    type: "ColumnDef[]",
    link: "/docs/api-reference#column-def",
    example: `columns: divisionColumns`,
  },
  {
    key: "rowGrouping",
    name: "rowGrouping",
    required: false,
    description: "Nested array property names that define the hierarchy (same as row grouping).",
    type: "string[]",
    example: `rowGrouping={["divisions"]}`,
  },
  {
    key: "getRowId",
    name: "getRowId",
    required: false,
    description: "Stable row id so expansion survives sort and data updates.",
    type: "(props: { row: Row }) => string | number | null | undefined",
    example: `getRowId={({ row }) => String(row.id)}`,
  },
  {
    key: "onRowGroupExpand",
    name: "onRowGroupExpand",
    required: false,
    description: "Lazy-load children on expand. Can be set per nesting level.",
    type: "(props: OnRowGroupExpandProps) => void | Promise<void>",
    link: "/docs/api-reference#on-row-group-expand-props",
    example: `onRowGroupExpand={async ({ isExpanded, setLoading }) => { /* ... */ }}`,
  },
];

const NestedTablesContent = () => {
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Nested Tables</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Give each hierarchy level its own columns — expand a row to open a full child table.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <DocsSteps steps={NESTED_STEPS} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        Patterns
      </motion.h2>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {NESTED_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h3>
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
        transition={{ duration: 0.5, delay: 0.37 }}
      >
        Pre-loaded divisions under each company.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <LivePreview
          demoId="nested-tables"
          height="472px"
          demoHeight="460px"
          Preview={NestedTablesDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        Dynamic loading example
      </motion.h2>
      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.47 }}
      >
        Divisions load when a company row expands.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <LivePreview
          demoId="dynamic-nested-tables"
          height="472px"
          demoHeight="460px"
          Preview={DynamicNestedTablesDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        Props
      </motion.h2>

      <PropTable props={NESTED_TABLE_PROPS} title="Nested Tables Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default NestedTablesContent;
