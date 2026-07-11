"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import RowSelectionDemo from "@/components/demos/RowSelectionDemo";
import {
  RowSelectionSingleDemo,
  RowSelectionClickDemo,
  RowSelectionApiDemo,
} from "@/components/demos/RowSelectionVariantsDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { ROW_SELECTION_CHANGE_PROPS } from "@/constants/propDefinitions";
import Link from "next/link";

const ROW_SELECTION_PROPS: PropInfo[] = [
  {
    key: "enableRowSelection",
    name: "enableRowSelection",
    required: false,
    description:
      "Enable row selection. When enabled, users can select rows via checkboxes (by default), click, keyboard, or the TableAPI.",
    type: "boolean",
    example: `<SimpleTable
  enableRowSelection={true}
  // ... other props
/>`,
  },
  {
    key: "rowSelectionMode",
    name: "rowSelectionMode",
    required: false,
    description:
      'Selection mode: `"multiple"` (default) allows any number of selected rows; `"single"` replaces the previous selection and hides the header select-all checkbox.',
    type: '"single" | "multiple"',
    example: `<SimpleTable
  enableRowSelection
  rowSelectionMode="single"
/>`,
  },
  {
    key: "selectRowOnClick",
    name: "selectRowOnClick",
    required: false,
    description:
      "When true, clicking a data cell selects the row (toggles in multiple mode, replaces in single mode). Prefer `selectableCells={false}` for a pure click-to-select UX.",
    type: "boolean",
    example: `<SimpleTable
  enableRowSelection
  selectRowOnClick
  selectableCells={false}
/>`,
  },
  {
    key: "showRowSelectionColumn",
    name: "showRowSelectionColumn",
    required: false,
    description:
      "When false, the checkbox column is hidden; selection still works via click, keyboard, or TableAPI. The column is still shown when `rowButtons` is set. Default true.",
    type: "boolean",
    example: `<SimpleTable
  enableRowSelection
  showRowSelectionColumn={false}
  selectRowOnClick
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
        operations, data export, or interactive workflows. Use checkboxes, click-to-select,
        keyboard navigation, or the TableAPI depending on your UX.
      </motion.p>

      <motion.div
        className="flex flex-col gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Checkbox selection (multiple)
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          The default experience: a pinned checkbox column with select-all in the header. Ideal for
          bulk actions.
        </p>
        <LivePreview demoId="row-selection" height="420px" demoHeight="320px" Preview={RowSelectionDemo} />
      </motion.div>

      <motion.div
        className="flex flex-col gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Single selection mode</h3>
        <p className="text-gray-700 dark:text-gray-300">
          Set{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
            rowSelectionMode=&quot;single&quot;
          </code>{" "}
          when only one row should be selected at a time. Selecting another row replaces the
          previous selection, and the header select-all control is hidden.
        </p>
        <LivePreview
          demoId="row-selection-single"
          height="340px"
          demoHeight="260px"
          Preview={RowSelectionSingleDemo}
        />
      </motion.div>

      <motion.div
        className="flex flex-col gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Click to select (no checkbox column)
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          Combine{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">selectRowOnClick</code>{" "}
          with{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
            showRowSelectionColumn=&#123;false&#125;
          </code>{" "}
          for a denser UI. Turn off{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">selectableCells</code>{" "}
          so clicks and arrow keys belong to row selection.
        </p>
        <LivePreview
          demoId="row-selection-click"
          height="340px"
          demoHeight="260px"
          Preview={RowSelectionClickDemo}
        />
      </motion.div>

      <motion.div
        className="flex flex-col gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Programmatic selection (TableAPI)
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          Use a table ref to call{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">selectRow</code>,{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
            toggleRowSelection
          </code>
          ,{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
            getSelectedRowsData
          </code>
          , and{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">clearRowSelection</code>
          . See also{" "}
          <Link
            href="/docs/programmatic-control"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Programmatic Control
          </Link>
          .
        </p>
        <LivePreview
          demoId="row-selection-api"
          height="400px"
          demoHeight="260px"
          Preview={RowSelectionApiDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Configuration
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Enable row selection with{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            enableRowSelection
          </code>
          , then tune mode, click behavior, and whether the checkbox column is shown:
        </p>

        <PropTable props={ROW_SELECTION_PROPS} title="Row Selection Properties" />
      </motion.div>

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
          <li>
            Click individual row checkboxes to select/deselect specific rows (when the column is
            shown)
          </li>
          <li>Click the header checkbox to select or deselect all rows (multiple mode only)</li>
          <li>
            Click a data cell to select a row when{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">selectRowOnClick</code>{" "}
            is enabled
          </li>
          <li>
            Use Space to toggle, and Arrow/Home/End (with Shift for ranges in multiple mode) when
            cell selection is off
          </li>
          <li>
            Call{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">selectRow</code>,{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">getSelectedRows</code>
            , and related methods on the TableAPI
          </li>
          <li>
            Maintain selection state during sorting, filtering, and pagination (with{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">getRowId</code>)
          </li>
        </ul>
      </motion.div>

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
          callback, or read the current selection from the table ref with{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
            getSelectedRowsData()
          </code>
          :
        </p>

        <PropTable props={ROW_SELECTION_CHANGE_PROPS} title="RowSelectionChangeProps" />
      </motion.div>

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
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
          <li>
            <strong>Bulk operations:</strong> Delete, update, or export multiple records with
            checkbox multi-select
          </li>
          <li>
            <strong>Detail panes:</strong> Use single selection so clicking a row drives a side
            panel
          </li>
          <li>
            <strong>Dense lists:</strong> Hide the checkbox column and select by clicking the row
          </li>
          <li>
            <strong>External controls:</strong> Select or clear rows from toolbar buttons via the
            TableAPI
          </li>
        </ul>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">Stable row IDs</h4>
          <p className="text-gray-700 dark:text-gray-300">
            Provide{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              getRowId
            </code>{" "}
            so selection survives sort, filter, and pagination. Prefer{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              getSelectedRowsData()
            </code>{" "}
            when you need the selected row objects rather than matching IDs yourself.
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 rounded-lg shadow-sm">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">Accessibility</h4>
          <p className="text-gray-700 dark:text-gray-300">
            Selected rows expose{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">aria-selected</code>.
            Multiple mode sets{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              aria-multiselectable=&quot;true&quot;
            </code>
            . Keyboard users can toggle with Space and move with Arrow/Home/End when cell selection
            is off.
          </p>
        </div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default RowSelectionContent;
