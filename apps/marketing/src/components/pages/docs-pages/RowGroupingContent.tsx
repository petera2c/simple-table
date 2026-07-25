"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import RowGroupingDemo from "@/components/demos/RowGroupingDemo";
import DynamicRowLoadingDemo from "@/components/demos/DynamicRowLoadingDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import {
  forAllFrameworks,
  onRowGroupExpandSnippets,
  programmaticRowGroupingSnippets,
  rowGroupingSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type GroupingPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const GROUPING_PATTERNS: GroupingPattern[] = [
  {
    title: "Mark the expandable column",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">expandable: true</code>{" "}
        on the column that shows the hierarchy label (where the expand control appears).
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "organization",
  label: "Organization",
  width: 200,
  expandable: true,
}`),
    language: "typescript",
  },
  {
    title: "Set rowGrouping and nested data",
    body: (
      <>
        Pass{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rowGrouping</code> as the
        nested array property names (in depth order), and nest those arrays on each row. Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">getRowId</code> so
        expansion stays stable across sort and updates. Child rows share the same columns — for
        different columns per level, see{" "}
        <a href="/docs/nested-tables" className="text-blue-600 dark:text-blue-400 hover:underline">
          Nested Tables
        </a>
        .
      </>
    ),
    codeByFramework: rowGroupingSnippets(),
  },
  {
    title: "Data shape",
    body: (
      <>
        Each{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rowGrouping</code> key
        is an array of child rows on the parent object.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  id: "company-1",
  organization: "TechSolutions Inc.",
  divisions: [
    {
      id: "div-100",
      organization: "Engineering",
      departments: [
        { id: "dept-1", organization: "Frontend" },
        { id: "dept-2", organization: "Backend" },
      ],
    },
  ],
}`),
    language: "typescript",
  },
  {
    title: "Start expanded",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">expandAll</code> so
        grouped rows open on first load.
      </>
    ),
    codeByFramework: rowGroupingSnippets({ expandAll: true }),
  },
  {
    title: "Sticky parent rows",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          enableStickyParents
        </code>{" "}
        so parents stick while you scroll their children. Beta — defaults to off.
      </>
    ),
    codeByFramework: rowGroupingSnippets({ enableStickyParents: true }),
  },
  {
    title: "Lazy-load children",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onRowGroupExpand</code>{" "}
        to fetch children on expand. Helpers{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">setLoading</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">setError</code>, and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">setEmpty</code> drive
        row states;{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rowIndexPath</code>{" "}
        locates the nested row to update.
      </>
    ),
    codeByFramework: onRowGroupExpandSnippets(),
  },
  {
    title: "Programmatic expand / collapse",
    body: (
      <>
        Control expansion from the table API:{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">expandAll</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">collapseAll</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">expandDepth</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">setExpandedDepths</code>
        ,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">toggleDepth</code>.
      </>
    ),
    codeByFramework: programmaticRowGroupingSnippets(),
  },
];

const ROW_GROUPING_PROPS: PropInfo[] = [
  {
    key: "expandable",
    name: "ColumnDef.expandable",
    required: false,
    description: "Shows the expand/collapse control on this column for hierarchical rows.",
    type: "boolean",
    example: `expandable: true`,
  },
  {
    key: "rowGrouping",
    name: "rowGrouping",
    required: false,
    description: "Nested array property names that define hierarchy levels, in depth order.",
    type: "string[]",
    example: `rowGrouping={["divisions", "departments"]}`,
  },
  {
    key: "expandAll",
    name: "expandAll",
    required: false,
    description: "When true, grouped rows start expanded.",
    type: "boolean",
    example: `expandAll={true}`,
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
    description:
      "Fires on expand/collapse. Includes setLoading, setError, setEmpty, and rowIndexPath for lazy loading.",
    type: "(props: OnRowGroupExpandProps) => void | Promise<void>",
    link: "/docs/api-reference#on-row-group-expand-props",
    example: `onRowGroupExpand={async ({ isExpanded, setLoading }) => { /* ... */ }}`,
  },
  {
    key: "canExpandRowGroup",
    name: "canExpandRowGroup",
    required: false,
    description: "Return false to disable expand for a specific row.",
    type: "(row: Row) => boolean",
    example: `canExpandRowGroup={(row) => row.teams?.length > 0}`,
  },
  {
    key: "enableStickyParents",
    name: "enableStickyParents",
    required: false,
    description: "Beta: sticky parent rows while scrolling through children. Default false.",
    type: "boolean",
    example: `enableStickyParents={true}`,
  },
  {
    key: "loadingStateRenderer",
    name: "loadingStateRenderer",
    required: false,
    description: "Custom content for loading rows (from setLoading). Default skeleton if omitted.",
    type: "string | ReactNode",
    example: `loadingStateRenderer="Loading..."`,
  },
  {
    key: "errorStateRenderer",
    name: "errorStateRenderer",
    required: false,
    description: "Custom content for error rows (from setError).",
    type: "string | ReactNode",
    example: `errorStateRenderer="Failed to load"`,
  },
  {
    key: "emptyStateRenderer",
    name: "emptyStateRenderer",
    required: false,
    description: "Custom content for empty child rows (from setEmpty).",
    type: "string | ReactNode",
    example: `emptyStateRenderer="No data"`,
  },
];

const RowGroupingContent = () => {
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Row Grouping</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Organize rows into expandable hierarchies — load children upfront or on demand.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {GROUPING_PATTERNS.map((pattern) => (
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
          demoId="row-grouping"
          height="500px"
          demoHeight="428px"
          Preview={RowGroupingDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Dynamic loading example
      </motion.h2>
      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        Children load when a parent expands (regions → stores → products).
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <LivePreview
          demoId="dynamic-row-loading"
          height="400px"
          Preview={DynamicRowLoadingDemo}
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

      <PropTable props={ROW_GROUPING_PROPS} title="Row Grouping Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default RowGroupingContent;
