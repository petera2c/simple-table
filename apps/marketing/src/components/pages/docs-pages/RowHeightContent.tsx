"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown } from "@fortawesome/free-solid-svg-icons";
import RowHeightDemo from "@/components/demos/RowHeightDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import Link from "next/link";

const ROW_HEIGHT_PROPS: PropInfo[] = [
  {
    key: "customTheme.rowHeight",
    name: "customTheme.rowHeight",
    required: false,
    description:
      "Sets the height of all rows in the table. Accepts a numeric value representing pixels. Passed via the customTheme prop.",
    type: "number",
    example: `// Standard row height
<SimpleTable
  customTheme={{
    rowHeight: 40,
  }}
  // ... other props
/>

// Compact rows
<SimpleTable
  customTheme={{
    rowHeight: 32,
  }}
  // ... other props
/>

// Large rows for better readability
<SimpleTable
  customTheme={{
    rowHeight: 56,
  }}
  // ... other props
/>`,
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
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        The Simple Table component allows you to customize the height of rows to accommodate
        different types of content and design requirements. This page explains how to configure and
        use the row height feature.
      </motion.p>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="row-height"
          height="400px"
          Preview={RowHeightDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Using Row Height
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          You can specify the height of rows in a Simple Table using the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            customTheme.rowHeight
          </code>{" "}
          property. This property accepts a numeric value representing the height in pixels and is passed via the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            customTheme
          </code>{" "}
          prop.
        </p>

        <PropTable props={ROW_HEIGHT_PROPS} title="Row Height Configuration" />

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mt-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Learn More</h3>
          <p className="text-gray-700 dark:text-gray-300">
            The <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">customTheme</code> prop controls layout dimensions that affect the table's virtualization engine. For a complete guide to all customTheme properties and how they work, see the{" "}
            <Link
              href="/docs/custom-theme"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Custom Theme
            </Link>{" "}
            documentation.
          </p>
        </div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
}
