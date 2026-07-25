"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import EmptyStateDemo from "@/components/demos/EmptyStateDemo";
import { tableEmptyStateSnippets, type CodeByFramework } from "@/constants/docsSnippets";

type EmptyPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const EMPTY_PATTERNS: EmptyPattern[] = [
  {
    title: "Custom empty state",
    body: (
      <>
        Pass{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          tableEmptyStateRenderer
        </code>{" "}
        to replace the blank body when{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rows</code> is empty
        (no data or filters match nothing).
      </>
    ),
    codeByFramework: tableEmptyStateSnippets(),
  },
];

const EMPTY_STATE_PROPS: PropInfo[] = [
  {
    key: "tableEmptyStateRenderer",
    name: "tableEmptyStateRenderer",
    required: false,
    description:
      "Custom content shown in the table body when there are no rows. Framework adapters accept components or elements; vanilla accepts a string or DOM node.",
    type: "ReactNode | HTMLElement | string | null",
    example: `tableEmptyStateRenderer={<EmptyState />}`,
  },
];

const EmptyStateContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faInbox} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Empty State</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Customize what users see when the table has no rows with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          tableEmptyStateRenderer
        </code>
        .
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {EMPTY_PATTERNS.map((pattern) => (
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
          Loading vs empty
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          While fetching data, use{" "}
          <Link
            href="/docs/loading-state"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            isLoading
          </Link>{" "}
          instead — the empty renderer only applies when there are no rows and loading is off.
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
        An empty table with a custom message. Use Code or StackBlitz for the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="empty-state" height="400px" Preview={EmptyStateDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={EMPTY_STATE_PROPS} title="Empty State Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default EmptyStateContent;
