"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ColumnEditingDemo from "@/components/demos/ColumnEditingDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import Link from "next/link";

const COLUMN_EDITING_PROPS: PropInfo[] = [
  {
    key: "selectableColumns",
    name: "selectableColumns",
    required: true,
    description:
      "Required for column editing to work. Enables column selection and interaction functionality that column editing depends on.",
    type: "boolean",
    example: `<SimpleTable
  selectableColumns={true}
  enableHeaderEditing={true}
  // ... other props
/>`,
  },
  {
    key: "enableHeaderEditing",
    name: "enableHeaderEditing",
    required: false,
    description:
      "Enables header editing functionality. When true, users can double-click on column headers to edit their labels.",
    type: "boolean",
    example: `<SimpleTable
  selectableColumns={true}
  enableHeaderEditing={true}
  onHeaderEdit={handleHeaderEdit}
  // ... other props
/>`,
  },
  {
    key: "onHeaderEdit",
    name: "onHeaderEdit",
    required: false,
    description:
      "Callback function triggered when a column header is edited. Receives the header index and new label value.",
    type: "(headerIndex: number, newLabel: string) => void",
    example: `const handleHeaderEdit = (headerIndex: number, newLabel: string) => {
  console.log('Header edited:', { headerIndex, newLabel });
  // Update your headers state here
};

<SimpleTable
  onHeaderEdit={handleHeaderEdit}
  // ... other props
/>`,
  },
  {
    key: "editColumns",
    name: "editColumns",
    required: false,
    description:
      "General prop that enables column editing capabilities. This can include adding, removing, or modifying columns.",
    type: "boolean",
    example: `<SimpleTable
  editColumns={true}
  // ... other props
/>`,
  },
  {
    key: "headerRenderer",
    name: "HeaderObject.headerRenderer",
    required: false,
    description:
      "Custom renderer for column headers. Can be used to add buttons, dropdowns, or other interactive elements to column headers.",
    type: "React.ComponentType<HeaderRendererProps>",
    example: `const headers = [
  {
    accessor: "actions",
    label: "Actions",
    headerRenderer: () => (
      <button onClick={addColumn}>
        + Add Column
      </button>
    )
  }
];`,
  },
];

const ColumnEditingContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faEdit} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Editing</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Column editing enables users to modify table structure dynamically by editing column names,
        reordering columns via drag-and-drop, searching for specific columns, and customizing the
        table layout. This feature is essential for building flexible data management interfaces.
      </motion.p>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="column-editing"
          height="400px"
          Preview={(props) => <ColumnEditingDemo {...props} />}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Basic Column Editing
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To enable column editing in Simple Table, you can use several approaches:
        </p>

        <ol className="list-decimal pl-8 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
          <li>
            <strong>Enable column selection</strong> with{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              selectableColumns={true}
            </code>{" "}
            (required for column editing to work)
          </li>
          <li>
            Enable the column editor with{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              editColumns={true}
            </code>{" "}
            to show/hide columns and reorder them via drag-and-drop
          </li>
          <li>
            Configure the column editor with{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              columnEditorConfig
            </code>{" "}
            to customize button text, enable search, and more
          </li>
          <li>
            Enable header editing with{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              enableHeaderEditing={true}
            </code>
          </li>
          <li>
            Provide an{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              onHeaderEdit
            </code>{" "}
            callback to handle header changes
          </li>
          <li>
            Use{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              headerRenderer
            </code>{" "}
            to add custom controls like "Add Column" buttons
          </li>
          <li>Manage column state dynamically to add or remove columns</li>
        </ol>

        <PropTable props={COLUMN_EDITING_PROPS} title="Column Editing Properties" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Column Editor Configuration
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            columnEditorConfig
          </code>{" "}
          prop covers search, optional pin controls, custom layout, and more — see{" "}
          <Link
            href="/docs/api-reference#column-editor-config"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ColumnEditorConfig
          </Link>{" "}
          in the API Reference.
        </p>


        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 mt-6">
          Column Search
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The column editor includes built-in search functionality that allows users to quickly find
          columns by typing in the search box. The search automatically expands nested headers to
          show matching columns.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong className="text-blue-700 dark:text-blue-400">Tip:</strong> Search is enabled by
            default. Set{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              searchEnabled: false
            </code>{" "}
            in{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              columnEditorConfig
            </code>{" "}
            to disable it.
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 mt-6">
          Drag and Drop Column Reordering
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Users can reorder columns by dragging them within the column editor. A visual separator
          line shows where the column will be dropped. This works alongside the existing header
          drag-and-drop functionality.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong className="text-green-700 dark:text-green-400">Note:</strong> Drag-and-drop in
            the column editor is automatically enabled when{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              editColumns={true}
            </code>
            . No additional configuration needed!
          </p>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Programmatic Column Visibility Control
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Simple Table provides powerful API methods for programmatically controlling column
          visibility and the column editor menu. These methods are available through the table ref
          and enable you to build custom column visibility controls, presets, and views.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 mt-6">
          toggleColumnEditor()
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Opens, closes, or toggles the column editor menu programmatically. This gives you full
          control over when the column editor UI is displayed.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 mt-6">
          applyColumnVisibility()
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Programmatically controls which columns are visible in the table. You can pass a partial
          or complete visibility state object to show or hide specific columns. This method is async
          and returns a Promise.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong className="text-blue-700 dark:text-blue-400">Tip:</strong> You can combine these
            methods to create powerful column visibility workflows. For example, open the column
            editor programmatically and apply a preset view at the same time.
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 mt-6">Use Cases</h3>
        <ul className="list-disc pl-8 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
          <li>
            <strong>View Presets:</strong> Create predefined column visibility configurations like
            "Basic Info", "Contact Details", "Financial View", etc.
          </li>
          <li>
            <strong>User Preferences:</strong> Save and restore user-specific column visibility
            preferences across sessions
          </li>
          <li>
            <strong>Responsive Layouts:</strong> Automatically hide less important columns on
            smaller screens
          </li>
          <li>
            <strong>Guided Tours:</strong> Control column visibility during onboarding or tutorial
            flows
          </li>
          <li>
            <strong>Context-Aware Views:</strong> Show different columns based on user role,
            permissions, or current workflow
          </li>
        </ul>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ColumnEditingContent;
