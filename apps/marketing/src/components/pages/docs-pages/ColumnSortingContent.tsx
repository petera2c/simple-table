"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import ColumnSortingDemo from "@/components/demos/ColumnSortingDemo";
import ExternalSortDemo from "@/components/demos/ExternalSortDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import {
  externalSortSnippets,
  forAllFrameworks,
  tableSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type SortPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const SORT_PATTERNS: SortPattern[] = [
  {
    title: "Enable sorting",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">sortable: true</code> on
        a column. Users click the header to cycle sort. Nested accessors like{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">albums[0].title</code>{" "}
        work too.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "name",
  label: "Full Name",
  width: "1fr",
  sortable: true,
}`),
    language: "typescript",
  },
  {
    title: "Custom sort cycle",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">sortingOrder</code> to
        change the click cycle. Default is{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          [&quot;asc&quot;, &quot;desc&quot;, null]
        </code>
        . Prefer desc-first for numbers and dates.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "revenue",
  label: "Revenue",
  width: 120,
  type: "number",
  sortable: true,
  sortingOrder: ["desc", "asc", null],
}`),
    language: "typescript",
  },
  {
    title: "Initial sort",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          initialSortColumn
        </code>{" "}
        and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          initialSortDirection
        </code>{" "}
        so the table loads already sorted.
      </>
    ),
    codeByFramework: tableSnippets({
      height: "400px",
      initialSortColumn: "revenue",
      initialSortDirection: "desc",
    }),
  },
  {
    title: "Custom comparator",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">comparator</code> when
        you need multi-field or domain-specific sort logic with both rows.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "priority",
  label: "Priority",
  sortable: true,
  comparator: ({ rowA, rowB, direction }) => {
    if (rowA.priority !== rowB.priority) {
      return direction === "asc"
        ? Number(rowA.priority) - Number(rowB.priority)
        : Number(rowB.priority) - Number(rowA.priority);
    }
    return Number(rowB.score) - Number(rowA.score);
  },
}`),
    language: "typescript",
  },
  {
    title: "Sort with valueGetter",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">valueGetter</code> when
        the sort value is nested or computed (instead of the raw accessor field).
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "seniority",
  label: "Seniority",
  sortable: true,
  valueGetter: ({ row }) => row.metadata?.seniorityLevel ?? 0,
}`),
    language: "typescript",
  },
  {
    title: "External / server sorting",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          externalSortHandling
        </code>{" "}
        and handle{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onSortChange</code> —
        the table keeps sort UI while you supply pre-sorted{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rows</code>.
      </>
    ),
    codeByFramework: externalSortSnippets(),
  },
];

const COLUMN_SORTING_PROPS: PropInfo[] = [
  {
    key: "sortable",
    name: "ColumnDef.sortable",
    required: false,
    description: "Enables header click sorting for the column.",
    type: "boolean",
    example: `sortable: true`,
  },
  {
    key: "sortingOrder",
    name: "ColumnDef.sortingOrder",
    required: false,
    description:
      "Sort state cycle on header click. Default: ['asc', 'desc', null]. Omit null to keep a sort always on.",
    type: "Array<'asc' | 'desc' | null>",
    example: `sortingOrder: ["desc", "asc", null]`,
  },
  {
    key: "comparator",
    name: "ColumnDef.comparator",
    required: false,
    description: "Custom compare using both rows and direction.",
    type: "(props: ComparatorProps) => number",
    link: "/docs/api-reference#comparator-props",
    example: `comparator: ({ rowA, rowB, direction }) => { /* ... */ }`,
  },
  {
    key: "valueGetter",
    name: "ColumnDef.valueGetter",
    required: false,
    description: "Extract or compute the value used for sorting (and often display).",
    type: "(props: ValueGetterProps) => CellValue",
    link: "/docs/api-reference#value-getter-props",
    example: `valueGetter: ({ row }) => row.metadata?.score ?? 0`,
  },
  {
    key: "initialSortColumn",
    name: "initialSortColumn",
    required: false,
    description: "Accessor to sort by on first load.",
    type: "string",
    example: `initialSortColumn="revenue"`,
  },
  {
    key: "initialSortDirection",
    name: "initialSortDirection",
    required: false,
    description: "Direction for the initial sort. Defaults to 'asc'.",
    type: '"asc" | "desc"',
    example: `initialSortDirection="desc"`,
  },
  {
    key: "onSortChange",
    name: "onSortChange",
    required: false,
    description: "Fires when sort config changes (or null when cleared).",
    type: "(sort: SortConfig | null) => void",
    link: "/docs/api-reference#sort-config",
    example: `onSortChange={(sort) => { /* ... */ }}`,
  },
  {
    key: "externalSortHandling",
    name: "externalSortHandling",
    required: false,
    description:
      "Disables internal sorting. Provide already-sorted rows (e.g. from your API).",
    type: "boolean",
    example: `externalSortHandling={true}`,
  },
];

const ColumnSortingContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faSort} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Sorting</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Let users sort columns ascending or descending — or drive sort from your server.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {SORT_PATTERNS.map((pattern) => (
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
        <LivePreview demoId="column-sorting" height="400px" Preview={ColumnSortingDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        External sorting example
      </motion.h2>
      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        Sort is handled outside the table; header indicators still update.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <LivePreview demoId="external-sort" height="400px" Preview={ExternalSortDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Props
      </motion.h2>

      <PropTable props={COLUMN_SORTING_PROPS} title="Column Sorting Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ColumnSortingContent;
