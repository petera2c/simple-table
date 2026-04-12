"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ColumnResizingDemo from "@/components/demos/ColumnResizingDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import { faLeftRight } from "@fortawesome/free-solid-svg-icons";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const COLUMN_RESIZING_PROPS: PropInfo[] = [
  {
    key: "columnResizing",
    name: "columnResizing",
    required: false,
    description:
      "Enables column resizing functionality. When true, users can resize columns by dragging the column dividers in the header row. Users can also double-click resize handles to automatically fit columns to their content width.",
    type: "boolean",
    example: `<SimpleTable
  columnResizing={true}
  // ... other props
/>`,
  },
  {
    key: "onColumnWidthChange",
    name: "onColumnWidthChange",
    required: false,
    description:
      "Callback triggered when column widths change through user resizing or double-click auto-sizing. With `@simple-table/react`, receives `ReactHeaderObject[]`. Angular, Svelte, and Solid adapters use `AngularHeaderObject[]`, `SvelteHeaderObject[]`, and `SolidHeaderObject[]` respectively.",
    type: "(headers: ReactHeaderObject[]) => void",
    link: "/docs/api-reference#simple-table-props",
    example: `<SimpleTable
  columnResizing={true}
  onColumnWidthChange={(headers) => {
    // Save column widths to localStorage
    const widths = headers.reduce((acc, header) => {
      acc[header.accessor] = header.width;
      return acc;
    }, {});
    localStorage.setItem('columnWidths', JSON.stringify(widths));
  }}
  // ... other props
/>`,
  },
];

const ColumnResizingContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faLeftRight} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Resizing</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Column resizing allows users to adjust column widths to better view and interact with data
        according to their preferences.
      </motion.p>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-4">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Interactive Demo</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Try resizing columns by dragging the dividers or double-clicking them to auto-fit. Your
            column widths are automatically saved to localStorage and will persist when you refresh
            the page!
          </p>
        </div>
        <LivePreview
          demoId="column-resizing"
          height="400px"
          Preview={ColumnResizingDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Basic Implementation
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Column resizing is enabled by adding the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            columnResizing
          </code>{" "}
          prop to the SimpleTable component. Users can resize columns by dragging the column
          dividers in the header row.
        </p>

        <PropTable props={COLUMN_RESIZING_PROPS} title="Column Resizing Configuration" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Double-Click Auto-Size
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          When column resizing is enabled, users can double-click on any resize handle to
          automatically fit that column to its content width. This provides a quick way to optimize
          column sizes without manual dragging.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Tip</h3>
          <p className="text-gray-700 dark:text-gray-300">
            The auto-size feature calculates the optimal width based on the column's content,
            including both the header text and cell values. This is especially useful for columns
            with varying content lengths.
          </p>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Persisting Column Widths
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Use the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            onColumnWidthChange
          </code>{" "}
          callback to save user column width preferences. This callback is triggered whenever
          columns are resized (either by dragging or double-clicking) and receives the updated
          headers array with new width values.
        </p>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Note</h3>
          <p className="text-gray-700 dark:text-gray-300">
            When{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              autoExpandColumns
            </code>{" "}
            is enabled, the resize handle is removed from the last column since all columns scale
            proportionally to fill the container width.
          </p>
        </div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ColumnResizingContent;
