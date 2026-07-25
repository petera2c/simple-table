"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import LoadingStateDemo from "@/components/demos/LoadingStateDemo";
import { isLoadingSnippets, type CodeByFramework } from "@/constants/docsSnippets";

type LoadingPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const LOADING_PATTERNS: LoadingPattern[] = [
  {
    title: "Show skeleton loaders",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">isLoading</code> while
        fetching. With no rows, the table fills with skeleton rows. Clear{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rows</code> when you want
        a full-table reload.
      </>
    ),
    codeByFramework: isLoadingSnippets(),
  },
];

const LOADING_STATE_PROPS: PropInfo[] = [
  {
    key: "isLoading",
    name: "isLoading",
    required: false,
    description:
      "When true with no rows, shows a full page of skeleton loaders. When true with existing rows, keeps that data visible and appends skeleton rows below. Clear rows for a full-table reload.",
    type: "boolean",
    example: `isLoading={isLoading}`,
  },
];

const LoadingStateContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faSpinner} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Loading State</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Show skeleton rows while data loads with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">isLoading</code>.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {LOADING_PATTERNS.map((pattern) => (
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
          Loading more rows
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          If rows are already loaded,{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">isLoading</code> keeps
          them visible and appends skeleton rows below — useful with{" "}
          <Link
            href="/docs/pagination"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Pagination
          </Link>{" "}
          and{" "}
          <Link
            href="/docs/infinite-scroll"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Infinite Scroll
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
        Scroll to load more and watch skeletons append under existing rows. Use Code or StackBlitz
        for the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="loading-state" height="400px" Preview={LoadingStateDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={LOADING_STATE_PROPS} title="Loading State Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default LoadingStateContent;
