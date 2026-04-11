"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import ColumnVisibilityDemo from "@/components/demos/ColumnVisibilityDemo";
import ColumnEditorCustomRendererDemo from "@/components/demos/ColumnEditorCustomRendererDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import Link from "next/link";

const COLUMN_VISIBILITY_PROPS: PropInfo[] = [
  {
    key: "hide",
    name: "HeaderObject.hide",
    required: false,
    description:
      "Controls the initial visibility of the column. When true, the column will be hidden by default.",
    type: "boolean",
    example: `// Hidden by default
{ 
  accessor: "internalId", 
  label: "Internal ID", 
  hide: true 
}

// Visible by default (default behavior)
{ 
  accessor: "name", 
  label: "Name" 
}`,
  },
  {
    key: "editColumns",
    name: "editColumns",
    required: false,
    description:
      "Enables the column visibility controls, allowing users to show/hide columns through a UI panel.",
    type: "boolean",
    example: `<SimpleTable
  editColumns={true}
  // ... other props
/>`,
  },
  {
    key: "editColumnsInitOpen",
    name: "editColumnsInitOpen",
    required: false,
    description:
      "Opens the column visibility menu by default when the table loads. Requires editColumns to be true.",
    type: "boolean",
    example: `<SimpleTable
  editColumns={true}
  editColumnsInitOpen={true}
  // ... other props
/>`,
  },
  {
    key: "onColumnVisibilityChange",
    name: "onColumnVisibilityChange",
    required: false,
    description:
      "Callback triggered when column visibility changes. Receives a ColumnVisibilityState object mapping each column accessor to its visibility state (true = visible, false = hidden). Perfect for persisting user preferences or syncing visibility state with external storage.",
    type: "(visibilityState: ColumnVisibilityState) => void",
    example: `<SimpleTable
  editColumns={true}
  onColumnVisibilityChange={(visibilityState) => {
    console.log('Visibility changed:', visibilityState);
    // Example: { name: true, email: true, phone: false }
    
    // Save to localStorage
    localStorage.setItem(
      'tableColumnVisibility', 
      JSON.stringify(visibilityState)
    );
  }}
  // ... other props
/>`,
  },
  {
    key: "excludeFromRender",
    name: "HeaderObject.excludeFromRender",
    required: false,
    description:
      "When true, excludes the column from both the rendered table and the column editor. The column is still included in CSV exports. Useful for ID columns or metadata that should be exported but not displayed or toggled by users.",
    type: "boolean",
    example: `{
  accessor: "id",
  label: "ID",
  width: 80,
  excludeFromRender: true  // Hidden from table and visibility menu
}`,
  },
];

const ColumnVisibilityContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faEye} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Visibility</h1>
      </motion.div>
      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Column visibility lets users show or hide columns through the column editor. They can
        search, drag to reorder, and toggle which columns appear in the grid.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="column-visibility"
          height="400px"
          Preview={ColumnVisibilityDemo}
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
          Column visibility can be controlled using the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            hide
          </code>{" "}
          property in the header objects and the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            editColumns
          </code>{" "}
          prop on the SimpleTable component.
        </p>

        <PropTable props={COLUMN_VISIBILITY_PROPS} title="Column Visibility Configuration" />
      </motion.div>
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        id="custom-renderer"
      >
        Custom Column Editor Layout
      </motion.h2>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            customRenderer
          </code>{" "}
          replaces the default popout. When the table uses left and right pin regions, the built-in
          layout may show left-pinned, main, and right-pinned columns as separate lists. Set{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            allowColumnPinning: false
          </code>{" "}
          on{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            columnEditorConfig
          </code>{" "}
          to hide pin controls while keeping drag and visibility toggles (
          <Link
            href="/docs/api-reference#column-editor-config"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ColumnEditorConfig
          </Link>
          ). Besides{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            searchSection
          </code>
          ,{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            listSection
          </code>
          , and{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            resetColumns
          </code>
          , you can receive{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            pinnedLeftList
          </code>
          ,{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            unpinnedList
          </code>
          , and{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            pinnedRightList
          </code>{" "}
          when the UI is split by pin section.
        </p>

        <LivePreview
          demoId="column-editor-custom-renderer"
          height="300px"
          demoHeight="270px"
          Preview={ColumnEditorCustomRendererDemo}
        />
      </motion.div>
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        id="custom-row-renderer"
      >
        Custom Column Editor Row Layout
      </motion.h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            rowRenderer
          </code>{" "}
          controls each row’s layout; props include{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            panelSection
          </code>
          ,{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            isEssential
          </code>
          ,{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            canToggleVisibility
          </code>
          ,{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            allowColumnPinning
          </code>
          , and{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            pinControl
          </code>
          . See{" "}
          <Link
            href="/docs/api-reference#column-editor-row-renderer-props"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ColumnEditorRowRendererProps
          </Link>
          .
        </p>

      </motion.div>
      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ColumnVisibilityContent;
