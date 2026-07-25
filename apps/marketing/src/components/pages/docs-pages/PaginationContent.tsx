"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPager } from "@fortawesome/free-solid-svg-icons";
import PaginationDemo from "@/components/demos/PaginationDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import {
  serverSidePaginationSnippets,
  tableSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type PaginationPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const PAGINATION_PATTERNS: PaginationPattern[] = [
  {
    title: "Enable pagination",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">enablePagination</code>{" "}
        and optionally{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rowsPerPage</code>{" "}
        (default 10). The table slices{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rows</code> client-side
        and shows the default footer.
      </>
    ),
    codeByFramework: tableSnippets({ enablePagination: true, rowsPerPage: 20 }),
  },
  {
    title: "Server-side pagination",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          serverSidePagination
        </code>{" "}
        so the table does not slice{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rows</code>. Pass{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">totalRowCount</code> and
        load each page in{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onPageChange</code>. Pair
        with{" "}
        <Link
          href="/docs/loading-state"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          isLoading
        </Link>{" "}
        while fetching.
      </>
    ),
    codeByFramework: serverSidePaginationSnippets(),
  },
];

const PAGINATION_PROPS: PropInfo[] = [
  {
    key: "enablePagination",
    name: "enablePagination",
    required: false,
    description: "Enables pagination and shows the default footer controls.",
    type: "boolean",
    example: `enablePagination={true}`,
  },
  {
    key: "rowsPerPage",
    name: "rowsPerPage",
    required: false,
    description: "Rows per page. Defaults to 10.",
    type: "number",
    example: `rowsPerPage={20}`,
  },
  {
    key: "serverSidePagination",
    name: "serverSidePagination",
    required: false,
    description:
      "When true, disables internal slicing — supply the current page of rows yourself.",
    type: "boolean",
    example: `serverSidePagination={true}`,
  },
  {
    key: "totalRowCount",
    name: "totalRowCount",
    required: false,
    description: "Total rows on the server (used with serverSidePagination to compute pages).",
    type: "number",
    example: `totalRowCount={1000}`,
  },
  {
    key: "onPageChange",
    name: "onPageChange",
    required: false,
    description: "Fires when the page changes. Use to fetch the next page for server-side mode.",
    type: "(page: number) => void | Promise<void>",
    example: `onPageChange={async (page) => setRows(await fetchPage(page))}`,
  },
  {
    key: "isLoading",
    name: "isLoading",
    required: false,
    description: "Show loading skeletons while page data is fetching.",
    type: "boolean",
    example: `isLoading={isLoading}`,
  },
];

const PaginationContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faPager} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Pagination</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Split large datasets into pages with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">enablePagination</code>.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {PAGINATION_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pattern.body}</p>
            <CodeBlock codeByFramework={pattern.codeByFramework} showLineNumbers={false} />
          </section>
        ))}
      </motion.div>

      <motion.div
        className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">
          Custom footer
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Replace the default pagination UI with{" "}
          <Link
            href="/docs/footer-renderer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Footer Renderer
          </Link>
          .
        </p>
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
        Client-side pagination with the default footer. Use Code or StackBlitz for the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="pagination" height="400px" Preview={PaginationDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={PAGINATION_PROPS} title="Pagination Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default PaginationContent;
