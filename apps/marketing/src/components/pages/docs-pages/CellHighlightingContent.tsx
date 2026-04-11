"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import CellHighlightingDemo from "@/components/demos/CellHighlightingDemo";
import PageWrapper from "@/components/PageWrapper";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const CELL_HIGHLIGHTING_PROPS: PropInfo[] = [
  {
    key: "selectableCells",
    name: "selectableCells",
    required: false,
    description:
      "Enable selection of individual cells. When enabled, users can click on cells to select them and use keyboard shortcuts to copy the selected data.",
    type: "boolean",
    example: `<SimpleTable
  selectableCells={true}
  // ... other props
/>`,
  },
  {
    key: "selectableColumns",
    name: "selectableColumns",
    required: false,
    description:
      "Enable selection of entire columns. When enabled, users can click on column headers to select all cells in that column.",
    type: "boolean",
    example: `<SimpleTable
  selectableColumns={true}
  // ... other props
/>`,
  },
  {
    key: "copyHeadersToClipboard",
    name: "copyHeadersToClipboard",
    required: false,
    description:
      "When true, includes column headers as the first row when copying selected cells to clipboard. Defaults to false.",
    type: "boolean",
    example: `<SimpleTable
  selectableCells={true}
  copyHeadersToClipboard={true}  // Include headers when copying
  // ... other props
/>`,
  },
];

const CellHighlightingContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faCopy} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Cell Highlighting</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Cell highlighting allows users to select and visually emphasize specific cells or ranges of
        cells within your tables. This is especially useful for copy-paste operations, data
        analysis, and drawing attention to important values.
      </motion.p>

      {/* Demo Section */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="cell-highlighting"
          height="400px"
          Preview={CellHighlightingDemo}
        />
      </motion.div>

      {/* Basic Cell Selection Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Basic Cell Selection
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Enable cell selection by adding the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            selectableCells
          </code>{" "}
          and{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            selectableColumns
          </code>{" "}
          props to your SimpleTable component. This enables users to select individual cells and
          entire columns.
        </p>

        <PropTable props={CELL_HIGHLIGHTING_PROPS} title="Cell Highlighting Properties" />
      </motion.div>

      {/* Column Selection Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Selection Behavior
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          When selection is enabled, users can:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Click on individual cells to select them</li>
          <li>Click on column headers to select entire columns</li>
          <li>Use keyboard shortcuts (Ctrl+C/⌘+C) to copy selected data</li>
          <li>Paste the data into spreadsheet applications</li>
        </ul>
      </motion.div>

      {/* Keyboard Navigation Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        Keyboard Navigation
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.66 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Cell selection supports powerful keyboard shortcuts for efficient navigation and
          selection:
        </p>
        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-3">
              <div className="font-mono text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                Shift + Arrow Keys
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                Extend selection in the direction of the arrow
              </div>

              <div className="font-mono text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                Ctrl/⌘ + A
              </div>
              <div className="text-gray-700 dark:text-gray-300">Select all cells</div>

              <div className="font-mono text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                Ctrl/⌘ + Shift + Arrow Keys
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                Extend selection to edge of data region
              </div>

              <div className="font-mono text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                Home / End
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                Navigate to first/last column in current row
              </div>

              <div className="font-mono text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                Ctrl/⌘ + Home / End
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                Navigate to first/last cell in table
              </div>

              <div className="font-mono text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                Page Up / Page Down
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                Navigate up/down by visible page
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Copy-Paste Integration Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Copy-Paste Integration
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Cell highlighting works seamlessly with Simple Table's built-in copy-paste functionality:
        </p>

        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li>Copy selected cells or ranges to the clipboard using Ctrl+C/⌘+C</li>
          <li>Paste data from external sources using Ctrl+V/⌘+V</li>
          <li>
            Data formatting is preserved when copying between tables and spreadsheet applications
          </li>
          <li>Multi-cell selection enables efficient bulk copy operations</li>
        </ul>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">Paste Restrictions</h4>
          <p className="text-gray-700 dark:text-gray-300">
            When pasting data into your table, only columns marked with{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              isEditable: true
            </code>{" "}
            will accept the pasted values. Non-editable columns will be automatically skipped during
            paste operations, ensuring data integrity and preventing accidental modification of
            read-only fields like IDs or calculated values.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">Pro Tip</h4>
          <p className="text-gray-700 dark:text-gray-300">
            Combine cell highlighting with column editing capabilities to create powerful data entry
            workflows. Users can select ranges, copy from spreadsheets, and paste directly into
            editable columns for efficient bulk data operations.
          </p>
        </div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default CellHighlightingContent;
