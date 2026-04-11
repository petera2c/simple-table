"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faExclamationTriangle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import CodeBlock from "@/components/CodeBlock";
import PageWrapper from "@/components/PageWrapper";
import Link from "next/link";

export default function MigrationV2_4_1Content() {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faArrowRight} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Migration Guide: v2.4.1
        </h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        This guide will help you migrate from v2.4.0 to v2.4.1, which introduces enhanced column
        editor features, a unified icons API, and some breaking changes.
      </motion.p>

      {/* Overview Section */}
      <motion.div
        className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-6 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-xl">
          What's New in v2.4.1
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Drag & Drop Column Reordering</strong> - Reorder columns directly in the column
            editor
          </li>
          <li>
            <strong>Column Search</strong> - Built-in search functionality in the column editor
          </li>
          <li>
            <strong>Unified Icons API</strong> - New{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">icons</code> prop for
            cleaner icon configuration
          </li>
          <li>
            <strong>Enhanced Column Editor Config</strong> - New{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              columnEditorConfig
            </code>{" "}
            prop with comprehensive options
          </li>
        </ul>
      </motion.div>

      {/* Breaking Changes Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
        Breaking Changes
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">
            Removed: columnEditorPosition
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            The{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              columnEditorPosition
            </code>{" "}
            prop has been removed. The column editor now uses an optimized default position.
          </p>

          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              ❌ Before (v2.4.0):
            </p>
            <CodeBlock
              code={`<SimpleTable
  editColumns={true}
  columnEditorPosition="right"
  // ... other props
/>`}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              ✅ After (v2.4.1):
            </p>
            <CodeBlock
              code={`<SimpleTable
  editColumns={true}
  // columnEditorPosition removed - uses optimized default
  // ... other props
/>`}
            />
          </div>
        </div>
      </motion.div>

      {/* Deprecated Props Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <FontAwesomeIcon icon={faCheckCircle} className="text-yellow-500" />
        Deprecated Props (Still Work, But Update Recommended)
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The following props are deprecated and will show console warnings in development mode.
          They still work in v2.4.1 but will be removed in a future version.
        </p>

        {/* Column Editor Text Migration */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            1. columnEditorText → columnEditorConfig
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            The{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              columnEditorText
            </code>{" "}
            prop is now part of the more comprehensive{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              columnEditorConfig
            </code>{" "}
            object.
          </p>

          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              ❌ Before (Deprecated):
            </p>
            <CodeBlock
              code={`<SimpleTable
  editColumns={true}
  columnEditorText="Customize Columns"
  // ... other props
/>`}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              ✅ After (v2.4.1):
            </p>
            <CodeBlock
              code={`<SimpleTable
  editColumns={true}
  columnEditorConfig={{
    text: "Customize Columns",
    searchEnabled: true,                    // NEW: Enable search (default: true)
    searchPlaceholder: "Search columns...", // NEW: Custom placeholder
  }}
  // ... other props
/>`}
            />
          </div>
        </div>

        {/* Icons Migration */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            2. Individual Icon Props → icons Object
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            All individual icon props have been consolidated into a single{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">icons</code> object
            for better organization.
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Deprecated props:</strong> expandIcon, filterIcon, headerCollapseIcon,
              headerExpandIcon, nextIcon, prevIcon, sortDownIcon, sortUpIcon
            </p>
          </div>

          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              ❌ Before (Deprecated):
            </p>
            <CodeBlock
              code={`import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChevronRight, 
  faFilter, 
  faCaretUp, 
  faCaretDown,
  faAngleLeft,
  faAngleRight,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

<SimpleTable
  expandIcon={<FontAwesomeIcon icon={faChevronRight} />}
  filterIcon={<FontAwesomeIcon icon={faFilter} />}
  sortUpIcon={<FontAwesomeIcon icon={faCaretUp} />}
  sortDownIcon={<FontAwesomeIcon icon={faCaretDown} />}
  nextIcon={<FontAwesomeIcon icon={faAngleRight} />}
  prevIcon={<FontAwesomeIcon icon={faAngleLeft} />}
  headerExpandIcon={<FontAwesomeIcon icon={faChevronRight} />}
  headerCollapseIcon={<FontAwesomeIcon icon={faChevronDown} />}
  // ... other props
/>`}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              ✅ After (v2.4.1):
            </p>
            <CodeBlock
              code={`import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChevronRight, 
  faFilter, 
  faCaretUp, 
  faCaretDown,
  faAngleLeft,
  faAngleRight,
  faChevronDown,
  faGripVertical // NEW: For drag handle
} from "@fortawesome/free-solid-svg-icons";

<SimpleTable
  icons={{
    expand: <FontAwesomeIcon icon={faChevronRight} />,
    filter: <FontAwesomeIcon icon={faFilter} />,
    sortUp: <FontAwesomeIcon icon={faCaretUp} />,
    sortDown: <FontAwesomeIcon icon={faCaretDown} />,
    next: <FontAwesomeIcon icon={faAngleRight} />,
    prev: <FontAwesomeIcon icon={faAngleLeft} />,
    headerExpand: <FontAwesomeIcon icon={faChevronRight} />,
    headerCollapse: <FontAwesomeIcon icon={faChevronDown} />,
    drag: <FontAwesomeIcon icon={faGripVertical} />, // NEW!
  }}
  // ... other props
/>`}
            />
          </div>
        </div>
      </motion.div>

      {/* New Features Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        New Features
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        {/* Column Search */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            Column Search in Editor
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            The column editor now includes built-in search functionality. Users can quickly find
            columns by typing in the search box.
          </p>

          <CodeBlock
            code={`<SimpleTable
  editColumns={true}
  columnEditorConfig={{
    text: "Columns",
    searchEnabled: true,                      // Enable search (default: true)
    searchPlaceholder: "Find a column...",    // Custom placeholder
    searchFunction: (header, searchTerm) => { // Optional: custom search logic
      return header.label.toLowerCase().includes(searchTerm.toLowerCase());
    }
  }}
  // ... other props
/>`}
          />

          <p className="text-gray-700 dark:text-gray-300 mt-3">
            Learn more in the{" "}
            <Link
              href="/docs/column-editing"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Column Editing documentation
            </Link>
            .
          </p>
        </div>

        {/* Drag and Drop */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            Drag & Drop Column Reordering
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Users can now reorder columns by dragging them within the column editor. This works
            alongside the existing header drag-and-drop functionality.
          </p>

          <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>No configuration needed!</strong> Drag-and-drop in the column editor is
              automatically enabled when{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                editColumns={true}
              </code>
              .
            </p>
          </div>
        </div>

        {/* Custom Drag Icon */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            Custom Drag Icon
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Customize the drag handle icon in the column editor using the new{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">icons.drag</code>{" "}
            property.
          </p>

          <CodeBlock
            code={`import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";

<SimpleTable
  editColumns={true}
  icons={{
    drag: <FontAwesomeIcon icon={faGripVertical} className="text-gray-500" />,
  }}
  // ... other props
/>`}
          />
        </div>
      </motion.div>

      {/* Complete Migration Example */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        Complete Migration Example
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Here's a complete before and after example showing all the changes:
        </p>

        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            ❌ Before (v2.4.0):
          </p>
          <CodeBlock
            code={`import { SimpleTable } from "@simple-table/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChevronRight, 
  faFilter, 
  faCaretUp, 
  faCaretDown 
} from "@fortawesome/free-solid-svg-icons";

<SimpleTable
  defaultHeaders={headers}
  rows={data}
  editColumns={true}
  columnEditorText="Customize Columns"
  columnEditorPosition="right"
  expandIcon={<FontAwesomeIcon icon={faChevronRight} />}
  filterIcon={<FontAwesomeIcon icon={faFilter} />}
  sortUpIcon={<FontAwesomeIcon icon={faCaretUp} />}
  sortDownIcon={<FontAwesomeIcon icon={faCaretDown} />}
/>`}
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            ✅ After (v2.4.1):
          </p>
          <CodeBlock
            code={`import { SimpleTable } from "@simple-table/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChevronRight, 
  faFilter, 
  faCaretUp, 
  faCaretDown,
  faGripVertical
} from "@fortawesome/free-solid-svg-icons";

<SimpleTable
  defaultHeaders={headers}
  rows={data}
  editColumns={true}
  columnEditorConfig={{
    text: "Customize Columns",
    searchEnabled: true,
    searchPlaceholder: "Search columns...",
  }}
  icons={{
    expand: <FontAwesomeIcon icon={faChevronRight} />,
    filter: <FontAwesomeIcon icon={faFilter} />,
    sortUp: <FontAwesomeIcon icon={faCaretUp} />,
    sortDown: <FontAwesomeIcon icon={faCaretDown} />,
    drag: <FontAwesomeIcon icon={faGripVertical} />,
  }}
/>`}
          />
        </div>
      </motion.div>

      {/* CSS Changes Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        New CSS Classes and Variables
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          If you're using custom CSS, you can now style the new column editor features:
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">New CSS Classes:</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                .st-column-editor-search-wrapper
              </code>{" "}
              - Search input container
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                .st-column-editor-search
              </code>{" "}
              - Search input wrapper
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                .st-column-editor-list
              </code>{" "}
              - Column list container
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                .st-column-label-container
              </code>{" "}
              - Column label wrapper
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                .st-drag-icon-container
              </code>{" "}
              - Drag handle container
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                .st-column-editor-drag-separator
              </code>{" "}
              - Drag drop indicator line
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">New CSS Variables:</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                --st-drag-separator-color
              </code>{" "}
              - Color of the drag drop indicator (theme-specific)
            </li>
          </ul>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mt-4">
          Learn more in the{" "}
          <Link
            href="/docs/custom-theme"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Custom Theme documentation
          </Link>
          .
        </p>
      </motion.div>

      {/* Quick Checklist */}
      <motion.div
        className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-6 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-xl">
          Migration Checklist
        </h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">☐</span>
            <span>
              Remove{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                columnEditorPosition
              </code>{" "}
              prop
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">☐</span>
            <span>
              Replace{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                columnEditorText
              </code>{" "}
              with{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                columnEditorConfig
              </code>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">☐</span>
            <span>
              Consolidate individual icon props into{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">icons</code> object
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">☐</span>
            <span>Test column editor search functionality</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">☐</span>
            <span>Test drag-and-drop column reordering in column editor</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">☐</span>
            <span>Update custom CSS if using column editor styles</span>
          </li>
        </ul>
      </motion.div>

      {/* Need Help Section */}
      <motion.div
        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-xl">Need Help?</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          If you encounter any issues during migration, check out these resources:
        </p>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <Link
              href="/docs/column-editing"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Column Editing Documentation
            </Link>
          </li>
          <li>
            <Link
              href="/docs/custom-icons"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Custom Icons Documentation
            </Link>
          </li>
          <li>
            <Link
              href="/docs/api-reference"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              API Reference
            </Link>
          </li>
          <li>
            <Link
              href="/changelog"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Full Changelog
            </Link>
          </li>
        </ul>
      </motion.div>
    </PageWrapper>
  );
}
