"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CollapsibleColumnsDemo from "@/components/demos/CollapsibleColumnsDemo";
import SingleRowChildrenDemo from "@/components/demos/SingleRowChildrenDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import { faFolderMinus } from "@fortawesome/free-solid-svg-icons";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const COLLAPSIBLE_COLUMNS_PROPS: PropInfo[] = [
  {
    key: "collapsible",
    name: "collapsible",
    required: false,
    description:
      "Enables collapsible functionality for a column group. When true, users can click the collapse arrow in the header to hide/show child columns.",
    type: "boolean",
    example: `<SimpleTable
  defaultHeaders={[
    {
      accessor: "groupName",
      label: "Group Header",
      collapsible: true,
      children: [
        { accessor: "child1", label: "Child 1" },
        { accessor: "child2", label: "Child 2" }
      ]
    }
  ]}
  // ... other props
/>`,
  },
  {
    key: "collapseDefault",
    name: "collapseDefault",
    required: false,
    description:
      "When true, the collapsible column starts in a collapsed state on initial load. Only applies to columns with collapsible: true. Perfect for showing summary data first while keeping details available.",
    type: "boolean",
    example: `{
  accessor: "details",
  label: "Detailed Info",
  collapsible: true,
  collapseDefault: true,  // Starts collapsed
  children: [
    { accessor: "detail1", label: "Detail 1" },
    { accessor: "detail2", label: "Detail 2" }
  ]
}`,
  },
  {
    key: "singleRowChildren",
    name: "singleRowChildren",
    required: false,
    description:
      "When true, the parent header appears horizontally beside its child headers (in the same row) instead of above them. This makes the parent act like a regular column that can collapse its sibling columns, rather than appearing as a nested group header. Only applies to collapsible columns.",
    type: "boolean",
    example: `{
  accessor: "personalInfo",
  label: "Personal Info",
  collapsible: true,
  singleRowChildren: true, // Parent header appears beside children (not above)
  children: [
    { accessor: "firstName", label: "First Name", width: 120 },
    { accessor: "lastName", label: "Last Name", width: 120 },
    { accessor: "email", label: "Email", width: 200 }
  ]
}
// With singleRowChildren: true
//   Headers: [Personal Info] [First Name] [Last Name] [Email] (side-by-side)
// Without singleRowChildren (default nested structure)
//   Headers:         [Personal Info spanning full width]
//           [First Name] [Last Name] [Email] (children below parent)`,
  },
  {
    key: "showWhen",
    name: "showWhen",
    required: false,
    description:
      'Controls when a child column is visible in collapsible groups. Can be "parentCollapsed" (only visible when collapsed), "parentExpanded" (only visible when expanded), or "always" (visible in both states). Note: This is an alternative approach to singleRowChildren.',
    type: 'ShowWhen ("parentCollapsed" | "parentExpanded" | "always")',
    example: `{
  accessor: "groupName",
  label: "Group Header",
  collapsible: true,
  children: [
    {
      accessor: "alwaysVisible",
      label: "Always Visible",
      showWhen: "always" // Visible in both states
    },
    {
      accessor: "summary",
      label: "Summary",
      showWhen: "parentCollapsed" // Only when collapsed
    },
    {
      accessor: "details",
      label: "Details",
      showWhen: "parentExpanded" // Only when expanded
    }
  ]
}`,
  },
  {
    key: "icons.headerExpand",
    name: "icons.headerExpand",
    required: false,
    description:
      "Custom icon component for the expand state of collapsible column headers. Shows when a column group can be expanded to reveal child columns.",
    type: "ReactNode",
    example: `import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

<SimpleTable
  icons={{
    headerExpand: <FontAwesomeIcon icon={faChevronRight} className="text-blue-600" />
  }}
  // ... other props
/>`,
  },
  {
    key: "icons.headerCollapse",
    name: "icons.headerCollapse",
    required: false,
    description:
      "Custom icon component for the collapse state of collapsible column headers. Shows when a column group can be collapsed to hide child columns.",
    type: "ReactNode",
    example: `import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

<SimpleTable
  icons={{
    headerCollapse: <FontAwesomeIcon icon={faChevronDown} className="text-blue-600" />
  }}
  // ... other props
/>`,
  },
];

const CollapsibleColumnsContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faFolderMinus} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Collapsible Columns</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Collapsible columns allow users to dynamically hide and show grouped columns to optimize
        screen space and focus on relevant data. Click the arrow icons in column headers to collapse
        entire column groups while keeping important columns visible.
      </motion.p>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="collapsible-columns"
          height="400px"
          Preview={CollapsibleColumnsDemo}
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
          Collapsible columns are created by adding the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            collapsible: true
          </code>{" "}
          property to a parent column with{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            children
          </code>{" "}
          columns. Users can click the arrow icon in the header to collapse the column group.
        </p>

        <PropTable props={COLLAPSIBLE_COLUMNS_PROPS} title="Collapsible Columns Configuration" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Collapse Behaviors
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-6"
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Collapsible columns support different behaviors when collapsed:
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Visibility Control
          </h3>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-sm">
              Control when child columns are visible using the{" "}
              <code className="bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded">showWhen</code>{" "}
              attribute:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">
                  showWhen: "parentExpanded"
                </code>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  - Visible when parent is expanded
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">
                  showWhen: "parentCollapsed"
                </code>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  - Visible when parent is collapsed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">
                  showWhen: "always"
                </code>
                <span className="text-sm text-gray-600 dark:text-gray-400">- Always visible</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Single Row Children
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mb-6"
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          By default, collapsible columns create a nested header structure where the parent header
          appears above its children. Using{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            singleRowChildren: true
          </code>
          , you can display the parent header beside its children in the same row, making it appear
          as a regular column that collapses adjacent columns.
        </p>

        <LivePreview
          demoId="single-row-children"
          height="400px"
          Preview={SingleRowChildrenDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        Custom Styling
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          You can customize the appearance of collapsible columns using CSS classes and variables.
          This allows you to style sub-headers and sub-cells differently from regular columns.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">CSS Classes</h3>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Sub-Header Styling
              </h4>
              <code className="block bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm text-gray-800 dark:text-gray-200 mb-2">
                .st-header-cell.st-sub-header
              </code>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Targets child header cells within collapsible column groups.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Sub-Cell Styling
              </h4>
              <code className="block bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm text-gray-800 dark:text-gray-200 mb-2">
                .st-cell.st-sub-cell
              </code>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Targets body cells within collapsible column groups.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            CSS Variables
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Use these CSS variables to customize the background colors of sub-headers and sub-cells.
            See the{" "}
            <a
              href="/docs/custom-theme"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Custom Theme
            </a>{" "}
            documentation for more details.
          </p>
          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
              <code className="text-sm text-gray-800 dark:text-gray-200">
                --st-sub-header-background-color
              </code>
            </div>
            <div className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
              <code className="text-sm text-gray-800 dark:text-gray-200">
                --st-sub-cell-background-color
              </code>
            </div>
            <div className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
              <code className="text-sm text-gray-800 dark:text-gray-200">
                --st-sub-cell-hover-background-color
              </code>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                New in v1.8.6: Controls hover state for sub-cells
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
              <code className="text-sm text-gray-800 dark:text-gray-200">
                --st-dragging-sub-header-background-color
              </code>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                New in v1.8.6: Controls background color when dragging sub-headers
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
              <code className="text-sm text-gray-800 dark:text-gray-200">
                --st-selected-sub-cell-background-color
              </code>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                New in v1.8.6: Controls background color for selected sub-cells
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
              <code className="text-sm text-gray-800 dark:text-gray-200">
                --st-selected-sub-cell-color
              </code>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                New in v1.8.6: Controls text color for selected sub-cells
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default CollapsibleColumnsContent;
