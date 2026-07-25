"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown } from "@fortawesome/free-solid-svg-icons";
import RowHeightDemo from "@/components/demos/RowHeightDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import Link from "next/link";
import { tableSnippets } from "@/constants/docsSnippets";

const ROW_HEIGHT_PROPS: PropInfo[] = [
  {
    key: "customTheme.rowHeight",
    name: "customTheme.rowHeight",
    required: false,
    description:
      "Height of every data row in pixels. Defaults to 32. Passed via customTheme — the virtualization engine uses this value for layout.",
    type: "number",
    example: `customTheme={{ rowHeight: 40 }}`,
  },
];

export default function RowHeightContent() {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faArrowsUpDown} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Row Height</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Set row height with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          customTheme.rowHeight
        </code>
        .
      </motion.p>

      <motion.div
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Set row height
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          Pass a pixel value via{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">customTheme</code>.
        </p>
        <CodeBlock
          codeByFramework={tableSnippets({ rowHeight: 40 })}
          showLineNumbers={false}
        />
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
        Compact rows (32px). Use Code or StackBlitz for the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="row-height" height="400px" Preview={RowHeightDemo} />
      </motion.div>

      <motion.div
        className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">
          Header and footer height
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Match header/footer sizing with{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
            customTheme.headerHeight
          </code>{" "}
          and{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
            customTheme.footerHeight
          </code>
          . Full list on{" "}
          <Link
            href="/docs/custom-theme"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Custom Theme
          </Link>
          .
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

      <PropTable props={ROW_HEIGHT_PROPS} title="Row Height Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
}
