import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faCheckCircle,
  faMousePointer,
  faKeyboard,
  faCode,
  faLightbulb,
  faBolt,
  faList,
  faTrophy,
  faRocket,
  faExclamationTriangle,
  faMagic,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import Link from "next/link";
import ExampleLink from "@/components/ExampleLink";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.reactTableRowSelection.title,
  description: SEO_STRINGS.blogPosts.reactTableRowSelection.description,
  keywords: SEO_STRINGS.blogPosts.reactTableRowSelection.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.reactTableRowSelection.title,
    description: SEO_STRINGS.blogPosts.reactTableRowSelection.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.reactTableRowSelection.title,
    description: SEO_STRINGS.blogPosts.reactTableRowSelection.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/react-table-row-selection-guide",
  },
};

export default function ReactTableRowSelectionPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          React Table Row Selection: Multi-Select, Single Select, and Checkbox Implementation
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckSquare} />
            Row Selection
          </span>
          <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            Tutorial
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faLightbulb} />
            Best Practices
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Master row selection in React data grids. Learn how to implement single-select,
          multi-select with checkboxes, keyboard navigation, shift-click ranges, select-all, and
          programmatic selection with production-ready code examples.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8 mb-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Row selection is one of the most common features in data grids—letting users select
                rows to perform bulk actions like delete, export, or edit. But implementing it
                properly with checkboxes, keyboard accessibility, and proper state management can be
                tricky.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                This comprehensive guide covers everything you need to know about row selection in
                React tables:
              </p>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                  <strong>Multi-select with checkboxes:</strong> Select multiple rows with
                  checkboxes
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                  <strong>Select-all functionality:</strong> Master checkbox with indeterminate
                  state
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                  <strong>Keyboard accessibility:</strong> Tab navigation and Space/Enter for
                  selection
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                  <strong>State management:</strong> Efficient Set-based selection tracking
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                  <strong>Bulk operations:</strong> Working with selected rows for actions
                </li>
              </ul>

              <p className="mt-4 text-gray-700 dark:text-gray-300">
                We'll compare Simple Table's batteries-included implementation with manual
                approaches. If you're comparing table libraries,{" "}
                <Link
                  href="/blog/best-react-table-libraries-2026"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  check out our guide to the top React table libraries for 2025
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* What is Row Selection */}
        <section id="what-is-row-selection">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCheckSquare} className="text-blue-500" />
              What is Row Selection?
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Row selection allows users to select multiple rows using checkboxes for bulk
                operations. It's the standard pattern you see in email clients, admin panels, and
                data management tools.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Multi-Select */}
                <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckSquare} className="text-green-500" />
                    Checkbox Selection
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Checkboxes in each row let users select multiple items independently.
                  </p>
                  <div className="bg-white dark:bg-gray-800 rounded p-3 border border-green-300 dark:border-green-700 mb-3">
                    <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Common Use Cases:
                    </div>
                    <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Bulk delete operations</li>
                      <li>• Export selected rows to CSV</li>
                      <li>• Batch status updates</li>
                      <li>• Mass email/notifications</li>
                    </ul>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 italic">
                    Example: Gmail - select emails to archive/delete
                  </div>
                </div>

                {/* Select All */}
                <div className="border border-indigo-200 dark:border-indigo-700 rounded-lg p-6 bg-indigo-50 dark:bg-indigo-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faTable} className="text-indigo-500" />
                    Select-All Checkbox
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Header checkbox for quickly selecting or deselecting all rows.
                  </p>
                  <div className="bg-white dark:bg-gray-800 rounded p-3 border border-indigo-300 dark:border-indigo-700 mb-3">
                    <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Checkbox States:
                    </div>
                    <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Unchecked: No rows selected</li>
                      <li>• Indeterminate: Some rows selected</li>
                      <li>• Checked: All rows selected</li>
                    </ul>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 italic">
                    Example: Admin panels - "Select all items"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation: Simple Table */}
        <section id="simple-table-implementation">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faMagic} className="text-green-500" />
              Quick Implementation: Simple Table (Batteries-Included)
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table provides row selection out of the box with minimal configuration. All
                patterns (checkboxes, keyboard navigation, select-all) work automatically. This is
                part of Simple Table's{" "}
                <Link
                  href="/blog/tanstack-table-vs-simple-table-headless-batteries-included"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  batteries-included approach
                </Link>
                .
              </p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Basic Row Selection Setup
                </h3>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Row selection in Simple Table requires just two props:
                </p>

                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                      enableRowSelection
                    </code>{" "}
                    - Enables checkboxes in rows and header
                  </li>
                  <li>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                      onRowSelectionChange
                    </code>{" "}
                    - Callback that receives selection changes
                  </li>
                </ul>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>📚 Complete implementation guide:</strong>
                  </p>
                  <Link
                    href="/docs/row-selection"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-lg"
                  >
                    → View Row Selection Documentation
                  </Link>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Includes live examples, API reference, and use cases
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  How Selection Works
                </h3>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  The{" "}
                  <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                    onRowSelectionChange
                  </code>{" "}
                  callback receives three parameters:
                </p>

                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                  <li>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                      row
                    </code>{" "}
                    - The row object that was just clicked
                  </li>
                  <li>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                      isSelected
                    </code>{" "}
                    - Boolean indicating if the row was selected or deselected
                  </li>
                  <li>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                      selectedRows
                    </code>{" "}
                    - Set containing all currently selected row objects
                  </li>
                </ul>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded p-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Note:</strong> Simple Table manages selection state internally. The
                    callback is for observing changes and implementing your business logic.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTrophy} className="text-green-500" />
                  Why Simple Table's Row Selection Wins
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>✓ Just 2 props: enableRowSelection and onRowSelectionChange</li>
                  <li>✓ Checkboxes in rows and header automatically rendered</li>
                  <li>✓ Select-all checkbox with proper indeterminate state</li>
                  <li>✓ Optimal performance with Set-based selection</li>
                  <li>
                    ✓{" "}
                    <Link
                      href="/blog/mit-licensed-react-tables-accessibility-keyboard-navigation"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Accessibility built-in
                    </Link>{" "}
                    (ARIA labels, keyboard support)
                  </li>
                  <li>
                    ✓ Selection persists across{" "}
                    <Link
                      href="/docs/pagination"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      pagination
                    </Link>
                    ,{" "}
                    <Link
                      href="/blog/react-grid-filtering-implementation"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      filtering
                    </Link>
                    , and{" "}
                    <Link
                      href="/docs/column-sorting"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      sorting
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Patterns */}
        <section id="advanced-patterns">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
              Advanced Patterns & Use Cases
            </h2>

            <div className="space-y-6">
              {/* Bulk Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  1. Bulk Actions with Selection
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Build a toolbar that appears when rows are selected.
                </p>

                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm mb-3">
                  <pre className="text-xs">
                    {`function UsersTable() {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const handleDelete = async () => {
    await deleteUsers(selectedRowIds);
    setSelectedRowIds([]); // Clear after action
  };

  const handleExport = () => {
    const selectedUsers = users.filter(u => selectedRowIds.includes(u.id));
    exportToCSV(selectedUsers);
  };

  const handleBulkEdit = () => {
    // Open modal with selected users
    openBulkEditModal(selectedRowIds);
  };

  return (
    <div>
      {/* Bulk actions toolbar */}
      {selectedRowIds.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded flex justify-between items-center">
          <span className="font-semibold">
            {selectedRowIds.length} row{selectedRowIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="space-x-2">
            <button onClick={handleExport} className="px-4 py-2 bg-blue-500 text-white rounded">
              Export
            </button>
            <button onClick={handleBulkEdit} className="px-4 py-2 bg-green-500 text-white rounded">
              Edit
            </button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">
              Delete
            </button>
          </div>
        </div>
      )}

      <SimpleTable
        rows={users}
        defaultHeaders={headers}
        
        rowSelection={{
          enabled: true,
          selectedRowIds,
          onSelectedRowsChange: setSelectedRowIds,
        }}
        height={400}
      />
    </div>
  );
}`}
                  </pre>
                </div>
              </div>

              {/* Select All with Confirmation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  4. Select-All with Large Datasets (Confirmation Pattern)
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  When dealing with thousands of rows, confirm before selecting all.
                </p>

                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm mb-3">
                  <pre className="text-xs">
                    {`function UsersTable({ totalUsers }: { totalUsers: number }) {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [showSelectAllConfirm, setShowSelectAllConfirm] = useState(false);

  const handleSelectAll = () => {
    if (totalUsers > 100) {
      // Show confirmation for large datasets
      setShowSelectAllConfirm(true);
    } else {
      // Select all immediately
      const allIds = users.map(u => u.id);
      setSelectedRowIds(allIds);
    }
  };

  return (
    <div>
      {/* Confirmation banner */}
      {showSelectAllConfirm && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-300 rounded">
          <p>
            You are about to select <strong>{totalUsers} rows</strong>. This may affect
            performance. Continue?
          </p>
          <button
            onClick={() => {
              const allIds = users.map(u => u.id);
              setSelectedRowIds(allIds);
              setShowSelectAllConfirm(false);
            }}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Yes, Select All
          </button>
          <button
            onClick={() => setShowSelectAllConfirm(false)}
            className="mt-2 ml-2 px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      )}

      <SimpleTable
        rows={users}
        defaultHeaders={headers}
        
        rowSelection={{
          enabled: true,
          selectedRowIds,
          onSelectedRowsChange: setSelectedRowIds,
        }}
        height={400}
      />
    </div>
  );
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Keyboard Accessibility */}
        <section id="keyboard-accessibility">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faKeyboard} className="text-purple-500" />
              Keyboard Accessibility
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Row selection in Simple Table is fully accessible with keyboard support:
              </p>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li>
                  <strong>Tab/Shift+Tab:</strong> Navigate to checkboxes
                </li>
                <li>
                  <strong>Space or Enter:</strong> Toggle checkbox selection
                </li>
                <li>
                  <strong>ARIA Labels:</strong> Proper labeling for screen readers
                </li>
                <li>
                  <strong>Focus Management:</strong> Clear visual focus indicators
                </li>
              </ul>

              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Accessibility Note
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Keyboard navigation isn't just for power users—it's essential for accessibility.
                  Screen reader users and people with motor impairments rely on keyboard support.
                  Simple Table implements proper ARIA roles and keyboard patterns by default. Learn
                  more in our{" "}
                  <Link
                    href="/blog/mit-licensed-react-tables-accessibility-keyboard-navigation"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                  >
                    comprehensive accessibility comparison
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Common Pitfalls */}
        <section id="common-pitfalls">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500" />
              Common Pitfalls When Implementing Row Selection
            </h2>

            <div className="space-y-6">
              {/* Pitfall 1 */}
              <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <span className="text-red-500">✗</span> Using Array Instead of Set
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  <strong>Problem:</strong> Arrays are O(n) for lookups and can have duplicates,
                  causing performance issues with large datasets
                </p>
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded p-3">
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-semibold mb-1">
                    <span className="text-green-500">✓</span> Solution: Use Set (O(1) lookups)
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Simple Table uses Set internally for optimal performance. Convert to Array only
                    when needed.
                  </p>
                </div>
              </div>

              {/* Pitfall 2 */}
              <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <span className="text-red-500">✗</span> Missing Indeterminate State
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  <strong>Problem:</strong> Header checkbox doesn't show "some selected" state,
                  confusing users
                </p>
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded p-3">
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-semibold mb-1">
                    <span className="text-green-500">✓</span> Solution: Implement Indeterminate
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Simple Table handles this automatically. Manual implementations need to set the
                    indeterminate attribute when 0 &lt; selected &lt; total.
                  </p>
                </div>
              </div>

              {/* Pitfall 3 */}
              <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <span className="text-red-500">✗</span> Poor Keyboard Accessibility
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  <strong>Problem:</strong> Checkboxes can't be accessed via keyboard, screen
                  readers don't announce selection state
                </p>
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded p-3">
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-semibold mb-1">
                    <span className="text-green-500">✓</span> Solution: Full Accessibility
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Simple Table provides Tab navigation, Space/Enter for toggling, and proper ARIA
                    labels. See{" "}
                    <Link
                      href="/blog/mit-licensed-react-tables-accessibility-keyboard-navigation"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      accessibility comparison
                    </Link>
                    .
                  </p>
                </div>
              </div>

              {/* Pitfall 4 */}
              <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <span className="text-red-500">✗</span> Not Persisting Selection Across Pagination
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  <strong>Problem:</strong> Selection clears when user navigates to another page
                </p>
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded p-3">
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-semibold mb-1">
                    <span className="text-green-500">✓</span> Solution: Stable Row Identifiers
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Simple Table maintains selection across pagination, filtering, and sorting
                    automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Manual Implementation Guide */}
        <section id="manual-implementation">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-indigo-500" />
              Manual Implementation (TanStack Table / Custom)
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                If you're not using Simple Table and need to implement row selection manually, be
                prepared for significant complexity:
              </p>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded p-4 mb-6">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500 mr-2" />
                  <strong>Warning:</strong> Manual implementation requires handling checkbox
                  rendering, state management, select-all logic, indeterminate state, keyboard
                  navigation, accessibility, and edge cases. Expect 100-200+ lines of code. See{" "}
                  <Link
                    href="/blog/tanstack-table-vs-simple-table-headless-batteries-included"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    our comparison of headless vs batteries-included approaches
                  </Link>
                  .
                </p>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                What You Need to Implement
              </h3>

              <ul className="space-y-3 text-gray-700 dark:text-gray-300 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">▸</span>
                  <span>
                    <strong>Checkbox rendering:</strong> Individual row checkboxes and header
                    select-all checkbox
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">▸</span>
                  <span>
                    <strong>State management:</strong> Track selected rows (preferably with Set for
                    performance)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">▸</span>
                  <span>
                    <strong>Select-all logic:</strong> Handle selecting/deselecting all rows
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">▸</span>
                  <span>
                    <strong>Indeterminate state:</strong> Show header checkbox as indeterminate when
                    some (but not all) rows selected
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">▸</span>
                  <span>
                    <strong>Keyboard accessibility:</strong> Tab navigation, Space/Enter for
                    toggling
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">▸</span>
                  <span>
                    <strong>ARIA labels:</strong> Proper labeling for screen readers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">▸</span>
                  <span>
                    <strong>Visual feedback:</strong> Highlight selected rows
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">▸</span>
                  <span>
                    <strong>Integration:</strong> Work correctly with pagination, filtering, sorting
                  </span>
                </li>
              </ul>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded p-4 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  The Reality Check
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  A complete, production-ready manual implementation requires 200-300+ lines of
                  code, extensive testing for edge cases, accessibility audits, and ongoing
                  maintenance. Most teams underestimate this complexity and end up with incomplete
                  or buggy implementations.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  The Better Alternative
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Simple Table handles all of this with 2 props. Save yourself weeks of development
                  and ongoing maintenance by using a battle-tested solution. See{" "}
                  <Link
                    href="/docs/row-selection"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    the documentation
                  </Link>{" "}
                  for examples.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faTrophy} className="text-green-500" />
              Best Practices: Production-Ready Row Selection
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border border-green-200 dark:border-green-700 rounded p-4 bg-green-50 dark:bg-green-900/20">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    ✓ Use Row IDs, Not Indexes
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    IDs remain stable across sorting, filtering, and pagination
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded p-4 bg-green-50 dark:bg-green-900/20">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    ✓ Provide Visual Feedback
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Highlight selected rows with background color and checked checkbox
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded p-4 bg-green-50 dark:bg-green-900/20">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    ✓ Support Keyboard Navigation
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Arrow keys, Space bar, Cmd/Ctrl-A for accessibility
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded p-4 bg-green-50 dark:bg-green-900/20">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    ✓ Implement Shift-Click Ranges
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Power users expect spreadsheet-like range selection
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-green-200 dark:border-green-700 rounded p-4 bg-green-50 dark:bg-green-900/20">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    ✓ Show Selection Count
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Display "X rows selected" for user confidence
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded p-4 bg-green-50 dark:bg-green-900/20">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    ✓ Clear Selection After Actions
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Reset selection state after delete, export, or bulk edit
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded p-4 bg-green-50 dark:bg-green-900/20">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    ✓ Persist Across Pages
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Keep selection when user navigates pagination
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded p-4 bg-green-50 dark:bg-green-900/20">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    ✓ Handle Edge Cases
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Empty states, single-row tables, disabled rows
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              Conclusion: Choose the Right Approach
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Row selection seems simple on the surface, but production-ready implementation
                requires careful attention to detail:
              </p>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li>• Rendering checkboxes in each row and header</li>
                <li>• Select-all checkbox with proper indeterminate state</li>
                <li>• Efficient state management (Set for O(1) lookups)</li>
                <li>• Keyboard accessibility (Tab, Space, Enter)</li>
                <li>• ARIA labels and roles for screen readers</li>
                <li>• Visual feedback for selected rows</li>
                <li>• Callback handling for bulk operations</li>
                <li>• Persistence across pagination, filtering, and sorting</li>
                <li>• Performance optimization for large datasets</li>
              </ul>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border-2 border-green-300 dark:border-green-700 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  The Pragmatic Choice: Use a Library
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Unless you have very specific requirements, use a library that handles row
                  selection for you. <strong>Simple Table</strong> provides all these features
                  out-of-the-box with just 2 props: <code>enableRowSelection</code> and{" "}
                  <code>onRowSelectionChange</code>.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Manual implementation:</strong> 200-300+ lines of code for checkbox
                  rendering, state management, indeterminate logic, accessibility, edge cases, and
                  testing.
                  <br />
                  <strong>Simple Table:</strong> 2 props, everything works.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Related Content
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">Documentation:</strong>
                    <div className="flex flex-col gap-1 mt-1">
                      <Link
                        href="/docs/row-selection"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        → Row Selection API
                      </Link>
                      <Link
                        href="/docs/pagination"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        → Pagination
                      </Link>
                      <Link
                        href="/docs/column-filtering"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        → Column Filtering
                      </Link>
                    </div>
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">Related Guides:</strong>
                    <div className="flex flex-col gap-1 mt-1">
                      <Link
                        href="/blog/react-grid-filtering-implementation"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        → Filtering Guide
                      </Link>
                      <Link
                        href="/blog/mit-licensed-react-tables-accessibility-keyboard-navigation"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        → Accessibility Comparison
                      </Link>
                      <ExampleLink
                        href="/examples/crm"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        → Live CRM Demo
                      </ExampleLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Row selection that just works—out of the box"
        description="Simple Table handles checkboxes, select-all with indeterminate state, keyboard accessibility, and ARIA labels automatically. No boilerplate, no edge cases to debug. Just set enableRowSelection and onRowSelectionChange."
        primaryButton={{
          text: "View Row Selection Docs",
          href: "/docs/row-selection",
        }}
        secondaryButton={{
          text: "See Live Demo",
          href: "/examples/crm",
        }}
      />
    </BlogLayout>
  );
}
