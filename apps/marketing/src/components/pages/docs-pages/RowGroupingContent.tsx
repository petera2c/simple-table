"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import RowGroupingDemo from "@/components/demos/RowGroupingDemo";
import DynamicRowLoadingDemo from "@/components/demos/DynamicRowLoadingDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import { Button } from "antd";
import { useState } from "react";
import PropTable, { type PropInfo } from "@/components/PropTable";

const ROW_GROUPING_PROPS: PropInfo[] = [
  {
    key: "expandable",
    name: "HeaderObject.expandable",
    required: false,
    description:
      "Makes a column expandable for grouping. This allows users to expand/collapse hierarchical data in that column.",
    type: "boolean",
    example: `{ 
  accessor: "name", 
  label: "Company Name", 
  expandable: true 
}`,
  },
  {
    key: "rowGrouping",
    name: "rowGrouping",
    required: false,
    description:
      "Array of property names that define the hierarchy levels. The order determines the nesting depth (first element is level 1, second is level 2, etc.).",
    type: "string[]",
    example: `// Single level: projects → tasks
<SimpleTable
  rowGrouping={["tasks"]}
  // ... other props
/>

// Multi-level: projects → milestones → tasks  
<SimpleTable
  rowGrouping={["milestones", "tasks"]}
  // ... other props
/>`,
  },
  {
    key: "expandAll",
    name: "expandAll",
    required: false,
    description:
      "When true, all grouped rows are expanded by default on table load. When false, rows start collapsed.",
    type: "boolean",
    example: `<SimpleTable
  expandAll={false}  // Start with all rows collapsed
  // ... other props
/>`,
  },
  {
    key: "onRowGroupExpand",
    name: "onRowGroupExpand",
    required: false,
    description:
      "Callback function triggered when a grouped row is expanded or collapsed. Receives detailed information including helper functions for managing loading, error, and empty states. The rowIndexPath array (v2.2.9+: contains ONLY numeric indices) provides a direct path to update nested data. The optional rowIdPath (when getRowId is provided) offers stable ID-based navigation. Perfect for lazy-loading hierarchical data on demand.",
    type: "(props: OnRowGroupExpandProps) => void",
    link: "/docs/api-reference#on-row-group-expand-props",
    example: `<SimpleTable
  getRowId={({ row }) => row.id as string}  // Recommended for stable row identification
  onRowGroupExpand={async ({ 
    row, 
    depth, 
    groupingKey, 
    isExpanded,
    setLoading,
    setError,
    setEmpty,
    rowIndexPath,  // v2.2.9+: [0, 2, 5] (only numbers)
    rowIdPath      // ['REG-1', 'stores', 'STORE-101'] (when getRowId set)
  }) => {
    if (!isExpanded) return;
    
    // Set loading state
    setLoading(true);
    
    try {
      const children = await fetchChildrenData(row.id, groupingKey);
      setLoading(false);
      
      if (children.length === 0) {
        setEmpty(true, "No data available");
        return;
      }
      
      // Update using rowIndexPath (clean numeric path)
      // e.g., [0, 2] = rows[0].stores[2]
      setRows(prev => {
        const newRows = [...prev];
        newRows[rowIndexPath[0]][groupingKey] = children;
        return newRows;
      });
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }}
  // ... other props
/>`,
  },
  {
    key: "loadingStateRenderer",
    name: "loadingStateRenderer",
    required: false,
    description:
      "Custom content to render when a row is in loading state (set via setLoading helper in onRowGroupExpand). Can be a string or React component. If not provided, a default skeleton loading state will be shown automatically.",
    type: "string | ReactNode",
    example: `// If undefined, shows default skeleton loader
// Simple string
loadingStateRenderer="Loading..."

// Or React component
loadingStateRenderer={
  <div className="flex items-center gap-2">
    <Spinner /> Loading...
  </div>
}`,
  },
  {
    key: "errorStateRenderer",
    name: "errorStateRenderer",
    required: false,
    description:
      "Custom content to render when a row has an error state (set via setError helper in onRowGroupExpand). Can be a string or React component.",
    type: "string | ReactNode",
    example: `// Simple string
errorStateRenderer="Failed to load data"

// Or React component
errorStateRenderer={
  <div className="text-red-500">
    Failed to load data
  </div>
}`,
  },
  {
    key: "emptyStateRenderer",
    name: "emptyStateRenderer",
    required: false,
    description:
      "Custom content to render when a row has no children data (set via setEmpty helper in onRowGroupExpand). Can be a string or React component.",
    type: "string | ReactNode",
    example: `// Simple string
emptyStateRenderer="No data found"

// Or React component
emptyStateRenderer={
  <div className="text-gray-500">
    No data found
  </div>
}`,
  },
  {
    key: "canExpandRowGroup",
    name: "canExpandRowGroup",
    required: false,
    description:
      "Function to conditionally control whether a specific row group can be expanded. Return true to allow expansion, false to disable it. Useful for permission-based access, hiding empty groups, or business logic-based restrictions.",
    type: "(row: Row) => boolean",
    example: `// Prevent expansion of empty groups
<SimpleTable
  canExpandRowGroup={(row) => {
    return row.teams && row.teams.length > 0;
  }}
  // ... other props
/>

// Permission-based expansion
<SimpleTable
  canExpandRowGroup={(row) => {
    return currentUser.role === 'admin' || row.isPublic;
  }}
  // ... other props
/>`,
  },
  {
    key: "enableStickyParents",
    name: "enableStickyParents",
    required: false,
    description:
      "Beta feature: When enabled, parent rows with children will remain sticky at the top while scrolling down through their child rows. This helps maintain context when navigating deep hierarchical data. Defaults to false as this is still a beta feature.",
    type: "boolean",
    example: `<SimpleTable
  enableStickyParents={true}
  rowGrouping={["departments", "teams"]}
  // ... other props
/>`,
  },
];

const RowGroupingContent = () => {
  const [expandAll, setExpandAll] = useState(true);
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Row Grouping</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Row grouping allows you to organize your data into expandable hierarchical structures,
        making it easier to navigate large datasets with natural parent-child relationships.
      </motion.p>

      <motion.div
        className="flex flex-col gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="row-grouping"
          height="500px"
          demoHeight="428px"
          Preview={(props) => <RowGroupingDemo expandAll={expandAll} {...props} />}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Basic Setup
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To enable row grouping, add the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            expandable: true
          </code>{" "}
          property to your column header, structure your data with nested arrays, and specify the
          grouping hierarchy.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">💡 Use Cases</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Organize teams by department and show individual members</li>
            <li>Display projects with their milestones and tasks</li>
            <li>Show product categories with subcategories and items</li>
            <li>Group transactions by account, invoice, and line items</li>
          </ul>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">
            🔑 Recommended: Use getRowId
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            When using row grouping with external sorting or dynamic data, it's highly recommended
            to provide the{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">getRowId</code> prop.
            This ensures stable row identification across data updates:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Maintains correct expansion state when data is sorted or filtered</li>
            <li>
              Provides stable{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">rowIdPath</code> in
              onRowGroupExpand
            </li>
            <li>Prevents row group collapse when row order changes</li>
            <li>Essential for tables with external sorting enabled</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Example:{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              {"getRowId={({ row }) => row.id as string}"}
            </code>{" "}
            or{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              {"getRowId={({ row }) => row.uuid as string}"}
            </code>
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/30 border-l-4 border-purple-400 dark:border-purple-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">
            🎯 Need Different Columns at Each Level?
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            Row grouping shows child rows with the same columns as parent rows. If you need each
            level to have its own independent column structure (e.g., companies with 9 columns,
            divisions with 6 columns, teams with 19 columns), check out{" "}
            <a
              href="/docs/nested-tables"
              className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
            >
              Nested Tables
            </a>
            .
          </p>
        </div>

        <PropTable props={ROW_GROUPING_PROPS} title="Row Grouping Configuration" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Programmatic Control
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Version 2.1.0 introduces powerful programmatic control over row grouping expansion. You
          can now control which hierarchy levels are expanded or collapsed using the table ref API.
          These methods give you fine-grained control over the visibility of nested data.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">
            🎯 New Table API Methods (v2.1.0)
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">expandAll()</code>{" "}
              - Expand all rows at all depths
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                collapseAll()
              </code>{" "}
              - Collapse all rows at all depths
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                expandDepth(depth)
              </code>{" "}
              - Expand all rows at a specific depth (0-indexed)
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                collapseDepth(depth)
              </code>{" "}
              - Collapse all rows at a specific depth (0-indexed)
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                toggleDepth(depth)
              </code>{" "}
              - Toggle expansion for a specific depth
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                setExpandedDepths(depths)
              </code>{" "}
              - Set which depths are expanded (replaces current state)
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                getExpandedDepths()
              </code>{" "}
              - Get currently expanded depths as a Set
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                getGroupingProperty(depth)
              </code>{" "}
              - Get the grouping property name for a depth index
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                getGroupingDepth(property)
              </code>{" "}
              - Get the depth index for a grouping property name
            </li>
          </ul>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        Sticky Parent Rows (Beta)
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.66 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            enableStickyParents
          </code>{" "}
          prop is a beta feature that makes parent rows stick to the top while scrolling through
          their children. This helps maintain context when navigating deep hierarchical data
          structures.
        </p>

        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">⚠️ Beta Feature</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            This feature is currently in beta and defaults to{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">false</code>. While
            it works well in most scenarios, there may be edge cases that need refinement. Use with
            caution in production environments.
          </p>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Dynamic Row Loading
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          For large datasets, use the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            onRowGroupExpand
          </code>{" "}
          callback to load nested data on-demand. This example demonstrates a three-level hierarchy
          (Regions → Stores → Products) where child rows are fetched from an API only when their
          parent is expanded. The callback provides powerful helper functions like{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            setLoading
          </code>
          ,{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            setError
          </code>
          , and{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            setEmpty
          </code>{" "}
          for state management, plus{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            rowIndexPath
          </code>{" "}
          (v2.2.9+: contains only numeric indices) and{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            rowIdPath
          </code>{" "}
          (when getRowId is provided) for easy nested data updates.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">💡 Benefits</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Faster initial load - only top-level rows are fetched</li>
            <li>Reduced memory usage - child data loaded as needed</li>
            <li>Better performance with large hierarchical datasets</li>
            <li>Seamless integration with server-side APIs</li>
            <li>Built-in state management with setLoading, setError, and setEmpty helpers</li>
            <li>Simple nested data updates using rowIndexPath array</li>
          </ul>
        </div>

        <LivePreview
          demoId="dynamic-row-loading"
          height="400px"
          Preview={(props) => <DynamicRowLoadingDemo {...props} />}
        />
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default RowGroupingContent;
