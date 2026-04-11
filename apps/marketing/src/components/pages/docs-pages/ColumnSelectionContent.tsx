"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMousePointer } from "@fortawesome/free-solid-svg-icons";
import ColumnSelectionDemo from "@/components/demos/ColumnSelectionDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const COLUMN_SELECTION_PROPS: PropInfo[] = [
  {
    key: "selectableColumns",
    name: "selectableColumns",
    required: false,
    description:
      "Enables column selection functionality. When true, users can click on column headers to select them.",
    type: "boolean",
    example: `<SimpleTable
  selectableColumns={true}
  onColumnSelect={handleColumnSelect}
  // ... other props
/>`,
  },
  {
    key: "onColumnSelect",
    name: "onColumnSelect",
    required: false,
    description:
      "Callback function triggered when a column is selected. Receives the HeaderObject of the selected column.",
    type: "(header: HeaderObject) => void",
    example: `const handleColumnSelect = (header: HeaderObject) => {
  console.log('Selected column:', header.label);
  console.log('Column accessor:', header.accessor);
  console.log('Column type:', header.type);
};

<SimpleTable
  onColumnSelect={handleColumnSelect}
  // ... other props
/>`,
  },
];

const ColumnSelectionContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faMousePointer} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Selection</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Column selection allows users to interact with table columns by clicking on their headers.
        This feature is useful for building interactive table interfaces where users need to select
        columns for operations like filtering, sorting, or data analysis.
      </motion.p>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="column-selection"
          height="400px"
          Preview={(props) => <ColumnSelectionDemo {...props} />}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Basic Column Selection
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To enable column selection in Simple Table, you need to:
        </p>

        <ol className="list-decimal pl-8 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
          <li>
            Set the{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              selectableColumns
            </code>{" "}
            prop to{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              true
            </code>
          </li>
          <li>
            Provide an{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              onColumnSelect
            </code>{" "}
            callback function to handle selection events
          </li>
        </ol>

        <PropTable props={COLUMN_SELECTION_PROPS} title="Column Selection Properties" />
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ColumnSelectionContent;
