"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import ColumnFilteringDemo from "@/components/demos/ColumnFilteringDemo";
import ExternalFilterDemo from "@/components/demos/ExternalFilterDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import {
  externalFilterSnippets,
  forAllFrameworks,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type FilterPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const FILTER_PATTERNS: FilterPattern[] = [
  {
    title: "Enable filtering",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">filterable: true</code>{" "}
        on a column. Operators follow the column{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">type</code> (string,
        number, date, boolean, or enum).
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "name",
  label: "Full Name",
  width: "1fr",
  type: "string",
  filterable: true,
}`),
    language: "typescript",
  },
  {
    title: "Limit filter operators",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">filterOperators</code> to
        show only the comparisons you want, in that order. Invalid operators for the column type are
        ignored. Has no effect on enum columns.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "name",
  label: "Full Name",
  type: "string",
  filterable: true,
  filterOperators: ["contains", "equals"],
}`),
    language: "typescript",
  },
  {
    title: "Enum filters",
    body: (
      <>
        Enum columns use a checkbox picker from{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">enumOptions</code>. With
        more than 10 options, a search input appears automatically.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "status",
  label: "Status",
  type: "enum",
  filterable: true,
  enumOptions: [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Pending", value: "pending" },
  ],
}`),
    language: "typescript",
  },
  {
    title: "External / server filtering",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          externalFilterHandling
        </code>{" "}
        and handle{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onFilterChange</code> —
        the table keeps filter UI while you supply pre-filtered{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rows</code>.
      </>
    ),
    codeByFramework: externalFilterSnippets(),
  },
];

const COLUMN_FILTERING_PROPS: PropInfo[] = [
  {
    key: "filterable",
    name: "ColumnDef.filterable",
    required: false,
    description:
      "Enables the header filter control for the column. Operators depend on column type.",
    type: "boolean",
    example: `filterable: true`,
  },
  {
    key: "filterOperators",
    name: "ColumnDef.filterOperators",
    required: false,
    description:
      "Restricts which operators appear (in this order). Only valid for the column type. No effect on enum columns.",
    type: "FilterOperator[]",
    example: `filterOperators: ["contains", "equals"]`,
  },
  {
    key: "onFilterChange",
    name: "onFilterChange",
    required: false,
    description: "Fires when active filters change. Keys are accessors; values are FilterCondition.",
    type: "(filters: TableFilterState) => void",
    link: "/docs/api-reference#table-filter-state",
    example: `onFilterChange={(filters) => { /* ... */ }}`,
  },
  {
    key: "externalFilterHandling",
    name: "externalFilterHandling",
    required: false,
    description:
      "Disables internal filtering. Provide already-filtered rows (e.g. from your API).",
    type: "boolean",
    example: `externalFilterHandling={true}`,
  },
];

const ColumnFilteringContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-green-100 rounded-lg">
          <FontAwesomeIcon icon={faFilter} className="text-green-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Filtering</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Let users filter columns by type — or drive filtering from your server.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {FILTER_PATTERNS.map((pattern) => (
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
        <LivePreview demoId="column-filtering" height="400px" Preview={ColumnFilteringDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        External filtering example
      </motion.h2>
      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        Filtering is handled outside the table; filter controls still update.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <LivePreview demoId="external-filter" height="400px" Preview={ExternalFilterDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Props
      </motion.h2>

      <PropTable props={COLUMN_FILTERING_PROPS} title="Column Filtering Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ColumnFilteringContent;
