"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import NestedTablesDemo from "@/components/demos/NestedTablesDemo";
import DynamicNestedTablesDemo from "@/components/demos/DynamicNestedTablesDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import Link from "next/link";

const NESTED_TABLE_PROPS: PropInfo[] = [
  {
    key: "nestedTable",
    name: "HeaderObject.nestedTable",
    required: false,
    description:
      "Configuration for nested tables that allows each level of row grouping to have its own independent grid structure with different columns and settings. When a row is expanded, its child data is displayed in a completely separate table with its own headers, column configuration, and features. The nested table config accepts all SimpleTable props, allowing complete customization at each nesting level.",
    type: "NestedTableConfig (extends all SimpleTable props)",
    example: `{
  accessor: "companyName",
  label: "Company",
  width: 200,
  expandable: true,
  nestedTable: {
    // Required: Column structure
    defaultHeaders: divisionHeaders,
    
    // Optional: Any SimpleTable props
    autoExpandColumns: true,
    enableRowSelection: true,
    columnResizing: false,
    theme: "modern-dark",
    shouldPaginate: true,
    pageSize: 10,
    // ... any other SimpleTable prop
  }
}`,
  },
  {
    key: "defaultHeaders",
    name: "NestedTableConfig.defaultHeaders",
    required: true,
    description:
      "Array of HeaderObject definitions that define the column structure for the nested table. This allows each nesting level to have completely different columns than its parent.",
    type: "HeaderObject[]",
    link: "/docs/api-reference#header-object",
    example: `// Parent level: 9 columns
const companyHeaders = [
    { accessor: "companyName", label: "Company", width: 200, expandable: true, nestedTable: {...} },
  { accessor: "industry", label: "Industry", width: 150 },
  // ... 7 more columns
];

// Child level: 6 columns (completely different structure)
const divisionHeaders = [
  { accessor: "divisionId", label: "Division ID", width: 120 },
  { accessor: "divisionName", label: "Division", width: 200 },
  { accessor: "revenue", label: "Revenue", width: 120 },
  { accessor: "profitMargin", label: "Profit Margin", width: 130 },
  { accessor: "headcount", label: "Headcount", width: 110 },
  { accessor: "location", label: "Location", width: 150 }
];`,
  },
  {
    key: "allSimpleTableProps",
    name: "NestedTableConfig.* (Most SimpleTable Props)",
    required: false,
    description:
      "In addition to defaultHeaders, the nestedTable config accepts most props from the SimpleTable component. This includes autoExpandColumns, enableRowSelection, columnResizing, theme, customTheme, shouldPaginate, pageSize, defaultSortConfig, enableColumnFiltering, onCellClick, onCellChange, onRowGroupExpand, and more. Note: Some props are automatically inherited from the parent table (rows, loadingStateRenderer, errorStateRenderer, emptyStateRenderer, tableEmptyStateRenderer, and icon props) and cannot be overridden in nested tables. Each nested table can be configured independently with its own settings. See the API Reference for the complete list of available props.",
    type: "Most SimpleTable props (excludes inherited props)",
    link: "/docs/api-reference#simple-table-props",
    example: `nestedTable: {
  defaultHeaders: divisionHeaders,
  
  // Examples of commonly used props:
  autoExpandColumns: true,
  enableRowSelection: true,
  columnResizing: false,
  theme: "dark",
  customTheme: { rowHeight: 32 },
  shouldPaginate: true,
  pageSize: 10,
  defaultSortConfig: { accessor: "revenue", direction: "desc" },
  enableColumnFiltering: true,
  onCellClick: (props) => console.log(props),
  onRowGroupExpand: handleDivisionExpand, // For dynamic loading
  // ... most other SimpleTable props
}`,
  },
];

const NestedTablesContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faLayerGroup} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Nested Tables</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Nested tables allow each level of hierarchical data to have its own independent grid
        structure with completely different columns, enabling you to display different information
        at each nesting level.
      </motion.p>

      <motion.div
        className="flex flex-col gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Static Nested Tables (Pre-loaded Data)
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This example demonstrates nested tables with all data pre-loaded. Expand companies to see
          their divisions with detailed metrics including revenue, profit margin, headcount, and
          location.
        </p>
        <LivePreview
          demoId="nested-tables"
          height="472px"
          demoHeight="460px"
          Preview={(props) => <NestedTablesDemo {...props} />}
        />
      </motion.div>

      <motion.div
        className="flex flex-col gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Dynamic Nested Tables (Lazy Loading)
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This example shows lazy-loading nested tables where divisions are fetched on-demand when
          you expand company rows. The{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onRowGroupExpand</code>{" "}
          handler manages dynamic data loading with built-in loading states.
        </p>
        <LivePreview
          demoId="dynamic-nested-tables"
          height="472px"
          demoHeight="460px"
          Preview={(props) => <DynamicNestedTablesDemo {...props} />}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        What Are Nested Tables?
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Nested tables extend the{" "}
          <a href="/docs/row-grouping" className="text-blue-600 dark:text-blue-400 hover:underline">
            row grouping
          </a>{" "}
          feature by allowing each level of your hierarchy to have its own independent table
          structure. While row grouping shows child rows with the same columns as the parent, nested
          tables let you define completely different columns for each level.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">
            Key Difference: Row Grouping vs Nested Tables
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Row Grouping:</strong> All levels share the same column structure. Child rows
              display the same columns as parent rows.
            </li>
            <li>
              <strong>Nested Tables:</strong> Each level has its own independent column structure.
              Parent and child levels can have completely different columns.
            </li>
          </ul>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Basic Setup
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To enable nested tables, add the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            nestedTable
          </code>{" "}
          property to your expandable column's HeaderObject. This property defines the column
          structure and configuration for the child table that appears when a row is expanded.
        </p>

        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">⚠️ Important</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              You must still use the{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rowGrouping</code>{" "}
              prop to define the hierarchy (e.g.,{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                {'rowGrouping={["divisions"]}'}
              </code>
              )
            </li>
            <li>
              The{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">expandable</code>{" "}
              property must be set to{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">true</code> on the
              column
            </li>
            <li>
              Each level can have its own{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">nestedTable</code>{" "}
              configuration for multi-level nesting
            </li>
            <li>
              <strong>Recommended:</strong> Use{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">getRowId</code>{" "}
              (e.g.,{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                {"getRowId={({ row }) => row.id as string}"}
              </code>
              ) for stable row identification, especially with sorting or dynamic data
            </li>
          </ul>
        </div>

        <PropTable props={NESTED_TABLE_PROPS} title="Nested Table Configuration" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Understanding the Hierarchy
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The demos above show a two-level nested table structure with completely different columns
          at each level:
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">
            Level 0: Companies (9 columns)
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            High-level company overview with industry, headquarters, market cap, CEO, revenue, and
            employee count.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">
            Level 1: Divisions (6 columns)
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Division-level details including division ID, division name, revenue, profit margin,
            headcount, and location.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">💡 Multi-Level Support</h4>
          <p className="text-gray-700 dark:text-gray-300">
            These demos show two levels of nesting, but nested tables support unlimited nesting
            depth. You can create three, four, or more levels by adding{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">nestedTable</code>{" "}
            configurations at each level (e.g., Companies → Divisions → Teams → Members → Projects).
          </p>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        Data Structure
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The data structure for nested tables is the same as row grouping - use nested arrays with
          property names matching your{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            rowGrouping
          </code>{" "}
          configuration:
        </p>

      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        Inherited Props
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          For consistency and convenience, certain props are automatically inherited from the parent
          table and cannot be overridden in nested tables. This ensures a unified experience across
          all nesting levels.
        </p>

        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">
            📋 Props Inherited from Parent
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            These props are automatically inherited and should <strong>not</strong> be specified in
            the{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">nestedTable</code>{" "}
            config:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rows</code> - Data
              is automatically provided from the parent row's nested array
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                loadingStateRenderer
              </code>
              ,{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                errorStateRenderer
              </code>
              ,{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                emptyStateRenderer
              </code>
              ,{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                tableEmptyStateRenderer
              </code>{" "}
              - State renderers are shared across all levels
            </li>
            <li>
              Icon props (
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">icons</code>{" "}
              (expand, filter, sortUp, sortDown, etc.) , etc.) - Icons are consistent across all
              nesting levels
            </li>
          </ul>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        Dynamic Nested Tables
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          As shown in the dynamic demo above, nested tables support lazy-loading at each level using
          the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onRowGroupExpand</code>{" "}
          callback. You can specify different handlers for each nesting level, allowing you to fetch
          data on demand when users expand rows.
        </p>

        <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">
            🚀 Benefits of Dynamic Loading
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Faster initial page load - only fetch top-level data</li>
            <li>Reduced memory usage - load child data only when needed</li>
            <li>Better performance with large hierarchical datasets</li>
            <li>Independent handlers for each nesting level</li>
            <li>Built-in loading, error, and empty state management</li>
          </ul>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/30 border-l-4 border-purple-400 dark:border-purple-700 p-4 rounded-lg shadow-sm">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">💡 Two Loading Patterns</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Static/Pre-loaded:</strong> All data is loaded upfront in the initial{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rows</code> prop.
              Best for smaller datasets or when all data is readily available. See the first demo
              above.
            </li>
            <li>
              <strong>Dynamic/Lazy-loaded:</strong> Child data is fetched on-demand when users
              expand rows using{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                onRowGroupExpand
              </code>{" "}
              handlers. Best for large datasets, API-driven data, or when initial load time matters.
              See the second demo above for implementation details.
            </li>
          </ul>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        Combining with Other Features
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.6 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Nested tables are fully-featured SimpleTable instances, meaning they can receive most of
          the same props and configuration options as a regular table (except for inherited props).
          Each nested table can be configured independently with its own settings:
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">
            🎯 Full SimpleTable API Support
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            The{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">nestedTable</code>{" "}
            config accepts any SimpleTable prop, allowing complete customization at each nesting
            level.
          </p>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          <strong>Common configurations include:</strong>
        </p>

        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li>
            <strong>Row Selection:</strong> Enable{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              enableRowSelection
            </code>{" "}
            to allow selection at that nesting level
          </li>
          <li>
            <strong>Column Resizing:</strong> Set{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">columnResizing</code>{" "}
            to enable/disable resizing independently
          </li>
          <li>
            <strong>Auto Expand Columns:</strong> Use{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              autoExpandColumns
            </code>{" "}
            to make columns fill available width
          </li>
          <li>
            <strong>Sorting & Filtering:</strong> Configure{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              defaultSortConfig
            </code>
            ,{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              enableColumnFiltering
            </code>
            , and other sorting/filtering options per level
          </li>
          <li>
            <strong>Themes:</strong> Apply different{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">theme</code> or{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">customTheme</code>{" "}
            settings to each nested table (see{" "}
            <Link
              href="/docs/custom-theme"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Custom Theme
            </Link>
            )
          </li>
          <li>
            <strong>Cell Renderers:</strong> Use custom{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">cellRenderer</code>,{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">valueFormatter</code>
            , and{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">headerRenderer</code>{" "}
            functions with level-specific logic
          </li>
          <li>
            <strong>Pagination:</strong> Enable{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">shouldPaginate</code>{" "}
            with custom{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">pageSize</code> for
            nested tables
          </li>
          <li>
            <strong>Callbacks:</strong> Add{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onCellClick</code>,{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onCellChange</code>,
            and other event handlers specific to that level
          </li>
          <li>
            <strong>And more:</strong> Any prop from the{" "}
            <a
              href="/docs/api-reference"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              API Reference
            </a>{" "}
            can be used in the nested table configuration
          </li>
        </ul>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          See the demos above for complete implementation examples of both static and dynamic nested
          tables.
        </p>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.7 }}
      >
        Related Features
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.8 }}
      >
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <a
              href="/docs/row-grouping"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Row Grouping
            </a>{" "}
            - Learn about the foundation of hierarchical data display
          </li>
          <li>
            <a
              href="/docs/aggregate-functions"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Aggregate Functions
            </a>{" "}
            - Calculate summaries for grouped data
          </li>
          <li>
            <a
              href="/docs/programmatic-control"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Programmatic Control
            </a>{" "}
            - Control expansion and collapse programmatically
          </li>
        </ul>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default NestedTablesContent;
