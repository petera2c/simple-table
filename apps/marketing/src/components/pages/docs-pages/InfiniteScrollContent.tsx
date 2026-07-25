"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfinity } from "@fortawesome/free-solid-svg-icons";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import InfiniteScrollDemo from "@/components/demos/InfiniteScrollDemo";
import {
  infiniteScrollSnippets,
  infiniteScrollWindowSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type InfiniteScrollPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const INFINITE_SCROLL_PATTERNS: InfiniteScrollPattern[] = [
  {
    title: "Load more on scroll",
    body: (
      <>
        Give the table a{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">height</code> so its body
        scrolls, then append rows in{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onLoadMore</code>. Pair
        with{" "}
        <Link
          href="/docs/loading-state"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          isLoading
        </Link>{" "}
        so skeleton rows append under existing data.
      </>
    ),
    codeByFramework: infiniteScrollSnippets(),
  },
  {
    title: "Page / external scroll",
    body: (
      <>
        Omit{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">height</code> /{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">maxHeight</code> and set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          scrollParent=&quot;window&quot;
        </code>{" "}
        (or a container / getter). The parent scroll drives virtualization and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onLoadMore</code>; the
        header sticks to the top of that viewport.
      </>
    ),
    codeByFramework: infiniteScrollWindowSnippets(),
  },
];

const INFINITE_SCROLL_PROPS: PropInfo[] = [
  {
    key: "onLoadMore",
    name: "onLoadMore",
    required: false,
    description: "Fires when the user scrolls near the bottom. Append the next batch of rows.",
    type: "() => void",
    example: `onLoadMore={handleLoadMore}`,
  },
  {
    key: "infiniteScrollThreshold",
    name: "infiniteScrollThreshold",
    required: false,
    description: "Pixels from the bottom at which onLoadMore fires. Defaults to 200.",
    type: "number",
    example: `infiniteScrollThreshold={400}`,
  },
  {
    key: "height",
    name: "height",
    required: false,
    description: "Fixed table height for inner scrolling. Use this or scrollParent.",
    type: "string | number",
    example: `height="400px"`,
  },
  {
    key: "scrollParent",
    name: "scrollParent",
    required: false,
    description:
      'External scroll container when height/maxHeight are unset. Accepts an element, "window", or a getter.',
    type: 'HTMLElement | "window" | (() => HTMLElement | null)',
    example: `scrollParent="window"`,
  },
  {
    key: "isLoading",
    name: "isLoading",
    required: false,
    description: "Appends skeleton rows under existing data while the next page loads.",
    type: "boolean",
    example: `isLoading={isLoading}`,
  },
];

const InfiniteScrollContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faInfinity} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Infinite Scroll</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Load more rows as the user scrolls with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onLoadMore</code>.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {INFINITE_SCROLL_PATTERNS.map((pattern) => (
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
          height vs scrollParent
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          If{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">height</code> or{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">maxHeight</code> is set,{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">scrollParent</code> is
          ignored. Without either, all rows render and{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onLoadMore</code> does
          not fire.
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
        Scroll to the bottom to load more batches. Use Code or StackBlitz for the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="infinite-scroll" height="400px" Preview={InfiniteScrollDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={INFINITE_SCROLL_PROPS} title="Infinite Scroll Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default InfiniteScrollContent;
