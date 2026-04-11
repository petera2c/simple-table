"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import RowSelectionDemo from "@/components/demos/RowSelectionDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { ROW_SELECTION_CHANGE_PROPS } from "@/constants/propDefinitions";

const ROW_SELECTION_PROPS: PropInfo[] = [
  {
    key: "enableRowSelection",
    name: "enableRowSelection",
    required: false,
    description:
      "Enable row selection functionality. When enabled, users can select individual rows or all rows using checkboxes.",
    type: "boolean",
    example: `<SimpleTable
  enableRowSelection={true}
  // ... other props
/>`,
  },
  {
    key: "onRowSelectionChange",
    name: "onRowSelectionChange",
    required: false,
    description:
      "Callback function triggered when row selection changes. Receives information about the selected row and current selection state.",
    type: "(props: RowSelectionChangeProps) => void",
    example: `<SimpleTable
  onRowSelectionChange={({ row, isSelected, selectedRows }) => {
    console.log('Row selection changed:', { row, isSelected, selectedRows });
  }}
  // ... other props
/>`,
  },
];

const RowSelectionContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faCheckSquare} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Row Selection</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Row selection enables users to select one or multiple rows in your table for bulk
        operations, data export, or interactive workflows. This feature includes checkboxes in each
        row and a header checkbox for select-all functionality.
      </motion.p>

      {/* Demo Section */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="row-selection"
          height="500px"
          Preview={RowSelectionDemo}
        />
      </motion.div>

      {/* Basic Row Selection Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Basic Row Selection
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Enable row selection by adding the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            enableRowSelection
          </code>{" "}
          prop to your SimpleTable component. This adds checkboxes to each row and the header for
          easy selection management.
        </p>

        <PropTable props={ROW_SELECTION_PROPS} title="Row Selection Properties" />
      </motion.div>

      {/* Selection Behavior Section */}
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
          When row selection is enabled, users can:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Click individual row checkboxes to select/deselect specific rows</li>
          <li>Click the header checkbox to select or deselect all rows at once</li>
          <li>Use keyboard navigation to interact with checkboxes</li>
          <li>Maintain selection state during sorting, filtering, and pagination</li>
        </ul>
      </motion.div>

      {/* Callback Function Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Handling Selection Changes
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Use the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            onRowSelectionChange
          </code>{" "}
          callback to respond to selection changes and implement your business logic:
        </p>

        <PropTable props={ROW_SELECTION_CHANGE_PROPS} title="RowSelectionChangeProps" />

      </motion.div>

      {/* Use Cases Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        Common Use Cases
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Row selection is essential for many interactive table scenarios:
        </p>

        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
          <li>
            <strong>Bulk Operations:</strong> Delete, update, or process multiple records
            simultaneously
          </li>
          <li>
            <strong>Data Export:</strong> Allow users to select specific rows for export to CSV,
            Excel, or other formats
          </li>
          <li>
            <strong>Batch Actions:</strong> Apply actions like status changes, category assignments,
            or approvals to multiple items
          </li>
          <li>
            <strong>Comparison Views:</strong> Select multiple items to compare their properties
            side-by-side
          </li>
          <li>
            <strong>Workflow Management:</strong> Move selected items through different stages of a
            process
          </li>
        </ul>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">Performance Tip</h4>
          <p className="text-gray-700 dark:text-gray-300">
            The{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              selectedRows
            </code>{" "}
            parameter uses a Set for optimal performance when dealing with large datasets. Convert
            to an Array only when needed for your specific operations.
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 rounded-lg shadow-sm">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">Accessibility Note</h4>
          <p className="text-gray-700 dark:text-gray-300">
            Row selection checkboxes are fully accessible with proper ARIA labels and keyboard
            navigation support. Users can navigate using Tab/Shift+Tab and select/deselect using
            Space or Enter keys.
          </p>
        </div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default RowSelectionContent;
