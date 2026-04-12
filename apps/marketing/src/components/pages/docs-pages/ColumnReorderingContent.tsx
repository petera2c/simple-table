"use client";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import ColumnReorderingDemo from "@/components/demos/ColumnReorderingDemo";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const COLUMN_REORDERING_PROPS: PropInfo[] = [
  {
    key: "columnReordering",
    name: "columnReordering",
    required: false,
    description:
      "Enables drag-and-drop column reordering functionality. When true, users can drag column headers to rearrange them.",
    type: "boolean",
    example: `<SimpleTable
  columnReordering={true}
  // ... other props
/>`,
  },
  {
    key: "onColumnOrderChange",
    name: "onColumnOrderChange",
    required: false,
    description:
      "Callback function that fires when column order changes. With `@simple-table/react`, receives `ReactHeaderObject[]`. Angular, Svelte, and Solid adapters use `AngularHeaderObject[]`, `SvelteHeaderObject[]`, and `SolidHeaderObject[]` respectively.",
    type: "(newHeaders: ReactHeaderObject[]) => void",
    example: `<SimpleTable
  columnReordering={true}
  onColumnOrderChange={(newHeaders) => {
    console.log('New column order:', newHeaders);
    // Save to localStorage or backend
    localStorage.setItem('columnOrder', JSON.stringify(newHeaders));
  }}
  // ... other props
/>`,
  },
  {
    key: "disableReorder",
    name: "HeaderObject.disableReorder",
    required: false,
    description:
      "Prevents specific columns from being reordered. Set this on individual header objects to lock them in place.",
    type: "boolean",
    example: `// This column cannot be reordered
{ 
  accessor: "id", 
  label: "ID", 
  disableReorder: true 
}

// This column can be reordered normally
{ 
  accessor: "name", 
  label: "Name"
}`,
  },
];

export default function ColumnReorderingContent() {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faArrowRightArrowLeft} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Reordering</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Column reordering allows users to drag and drop columns to reorganize the table layout
        according to their preferences. Columns can be reordered by dragging column headers or
        through the column editor (when{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
          editColumns={true}
        </code>
        ).
      </motion.p>

      <motion.div
        className="flex flex-col gap-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="text-sm text-gray-600 dark:text-gray-400 italic">
          Try dragging column headers to reorder them.
        </div>
        <LivePreview
          demoId="column-reordering"
          height="400px"
          Preview={ColumnReorderingDemo}
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
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Column reordering is enabled by adding the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            columnReordering
          </code>{" "}
          prop to the SimpleTable component. Users can drag and drop column headers to rearrange
          them.
        </p>

        <PropTable props={COLUMN_REORDERING_PROPS} title="Column Reordering Configuration" />

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Tip</h3>
          <p className="text-gray-700 dark:text-gray-300">
            The{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              onColumnOrderChange
            </code>{" "}
            callback is useful for saving user preferences. You can store the new column order in
            localStorage or in your backend to persist the user's preferred layout across sessions.
          </p>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Usage with Other Features
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Column reordering works seamlessly with other Simple Table features. You can combine it
          with column resizing, column visibility, and pinned columns to create a highly
          customizable table experience.
        </p>

        <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Best Practice</h3>
          <p className="text-gray-700 dark:text-gray-300">
            When using column reordering with pinned columns, pinned columns will remain in their
            respective pinned areas (left or right) but can be reordered within those areas.
          </p>
        </div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
}
