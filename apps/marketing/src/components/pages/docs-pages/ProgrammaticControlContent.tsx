"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import ProgrammaticControlDemo from "@/components/demos/ProgrammaticControlDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable from "@/components/PropTable";
import { TABLE_REF_TYPE_METHODS } from "@/constants/propDefinitions";
import {
  tableApiAccessSnippets,
  tableApiControlSnippets,
  tableApiReadDataSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type ApiPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const withApiLinks = (keys: string[]) =>
  TABLE_REF_TYPE_METHODS.filter((method) => keys.includes(method.key)).map((method) => ({
    ...method,
    link: method.link ? `/docs/api-reference${method.link}` : undefined,
  }));

const API_PATTERNS: ApiPattern[] = [
  {
    title: "Access the API",
    body: (
      <>
        Keep a ref (or instance) to the table, then call methods on the{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">TableAPI</code>.
      </>
    ),
    codeByFramework: tableApiAccessSnippets(),
  },
  {
    title: "Read data",
    body: (
      <>
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">getVisibleRows</code>{" "}
        respects filters, sort, and the current page.{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">getAllRows</code> returns
        the full processed set.{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">getHeaders</code> returns
        the current column defs.
      </>
    ),
    codeByFramework: tableApiReadDataSnippets(),
  },
  {
    title: "Sort, filter, and paginate",
    body: (
      <>
        Drive UI state from your own controls with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">applySortState</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">applyFilter</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">setQuickFilter</code>, and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">setPage</code>.
      </>
    ),
    codeByFramework: tableApiControlSnippets(),
  },
];

const ProgrammaticControlContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-indigo-100 rounded-lg">
          <FontAwesomeIcon icon={faCode} className="text-indigo-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Programmatic Control</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Read and change table state from your code — sort, filter, paginate, export, and more.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {API_PATTERNS.map((pattern) => (
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
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Related APIs</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Feature-specific methods are covered on their docs pages:{" "}
          <Link
            href="/docs/live-updates"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            updateData
          </Link>
          ,{" "}
          <Link href="/docs/csv-export" className="text-blue-600 dark:text-blue-400 hover:underline">
            exportToCSV
          </Link>
          ,{" "}
          <Link
            href="/docs/row-selection"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            row selection
          </Link>
          ,{" "}
          <Link
            href="/docs/row-grouping"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            row grouping
          </Link>
          ,{" "}
          <Link href="/docs/pivot" className="text-blue-600 dark:text-blue-400 hover:underline">
            pivot
          </Link>
          ,{" "}
          <Link
            href="/docs/column-visibility"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            column visibility
          </Link>
          , and{" "}
          <Link
            href="/docs/column-pinning"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            pinning
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
        Use the buttons to sort, filter, and read table state. Code or StackBlitz has the full
        example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview
          demoId="programmatic-control"
          demoHeight={400}
          height={520}
          Preview={ProgrammaticControlDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        API methods
      </motion.h2>

      <PropTable
        props={withApiLinks(["updateData", "setHeaderRename"])}
        title="Data manipulation"
      />
      <PropTable
        props={withApiLinks(["getVisibleRows", "getAllRows", "getHeaders"])}
        title="Data access"
      />
      <PropTable props={withApiLinks(["exportToCSV"])} title="Export" />
      <PropTable
        props={withApiLinks([
          "getSortState",
          "applySortState",
          "getFilterState",
          "applyFilter",
          "clearFilter",
          "clearAllFilters",
          "setQuickFilter",
          "getCurrentPage",
          "setPage",
        ])}
        title="Sort, filter, and pagination"
      />
      <PropTable
        props={withApiLinks([
          "toggleColumnEditor",
          "applyColumnVisibility",
          "getPinnedState",
          "applyPinnedState",
        ])}
        title="Column editor and pinning"
      />
      <PropTable
        props={withApiLinks([
          "expandAll",
          "collapseAll",
          "expandDepth",
          "collapseDepth",
          "toggleDepth",
          "setExpandedDepths",
          "getExpandedDepths",
          "getGroupingProperty",
          "getGroupingDepth",
        ])}
        title="Row grouping"
      />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ProgrammaticControlContent;
