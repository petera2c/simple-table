"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpDown } from "@fortawesome/free-solid-svg-icons";
import TableHeightDemo from "@/components/demos/TableHeightDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import Link from "next/link";
import { tableSnippets, type CodeByFramework, type TablePropOptions } from "@/constants/docsSnippets";

type HeightPattern = {
  title: string;
  body: ReactNode;
  options?: TablePropOptions;
  codeByFramework?: CodeByFramework;
};

const HEIGHT_PATTERNS: HeightPattern[] = [
  {
    title: "Fixed height",
    body: "Use a fixed height when the table should always occupy the same vertical space. The header stays visible while rows scroll.",
    options: { height: "400px" },
  },
  {
    title: "Adaptive height (maxHeight)",
    body: "Prefer maxHeight when row count varies — the table stays compact with few rows and grows up to the cap.",
    options: { maxHeight: "600px" },
  },
  {
    title: "Viewport or parent size",
    body: "Use vh/vw or % when the table should track the viewport or a parent with a defined height.",
    options: { height: "50vh" },
  },
  {
    title: "External / window scroll",
    body: (
      <>
        Omit{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">height</code> and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">maxHeight</code>, then
        set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">scrollParent</code> so
        the page (or a custom container) drives virtualization. The header pins to that scroll
        viewport. More detail on{" "}
        <Link
          href="/docs/infinite-scroll"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Infinite Scroll
        </Link>
        .
      </>
    ),
    options: { scrollParent: "window" },
  },
];

const TABLE_HEIGHT_PROPS: PropInfo[] = [
  {
    key: "height",
    name: "height",
    required: false,
    description:
      "Fixed height for the table container. The table scrolls internally with a sticky header. If both height and maxHeight are set, height is ignored.",
    type: "string | number",
    example: `height="400px"
height="50vh"
height="100%"`,
  },
  {
    key: "maxHeight",
    name: "maxHeight",
    required: false,
    description:
      "Maximum height with adaptive sizing — the table shrinks when there are fewer rows, and grows up to this cap. Virtualization stays enabled.",
    type: "string | number",
    example: `maxHeight="600px"
maxHeight="80vh"`,
  },
];

export default function TableHeightContent() {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faUpDown} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Table Height</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Control vertical overflow with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
          height
        </code>{" "}
        or{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
          maxHeight
        </code>
        . Most apps should set one of them.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {HEIGHT_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pattern.body}</p>
            <CodeBlock
              codeByFramework={
                pattern.codeByFramework ?? tableSnippets(pattern.options ?? {})
              }
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
      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.32 }}
      >
        Try different fixed heights below. Use Code or StackBlitz for the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="table-height" height="500px" Preview={TableHeightDemo} />
      </motion.div>

      <motion.div
        className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-1">height vs maxHeight</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">height</code> always
          fills the space you set.{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">maxHeight</code>{" "}
          shrinks with few rows. If both are set,{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">height</code> is
          ignored.
        </p>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        Props
      </motion.h2>

      <PropTable props={TABLE_HEIGHT_PROPS} title="Height Configuration" />

      <motion.div
        className="mt-6 mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">
          Rarely needed: customTheme header/footer height
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Only for pagination tables with custom footers that need measured layout before paint. See{" "}
          <Link
            href="/docs/custom-theme"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Custom Theme
          </Link>
          .
        </p>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
}
