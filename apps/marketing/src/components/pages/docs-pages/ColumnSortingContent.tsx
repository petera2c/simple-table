"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import ColumnSortingDemo from "@/components/demos/ColumnSortingDemo";
import ExternalSortDemo from "@/components/demos/ExternalSortDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";


const COLUMN_SORTING_PROPS: PropInfo[] = [
  {
    key: "isSortable",
    name: "HeaderObject.isSortable",
    required: false,
    description:
      "Enables sorting functionality for the column. When true, users can click the column header to sort data.",
    type: "boolean",
    example: `{ 
  accessor: "name", 
  label: "Full Name", 
  isSortable: true 
}`,
  },
  {
    key: "sortingOrder",
    name: "HeaderObject.sortingOrder",
    required: false,
    description:
      "Custom sort order cycle for this column. Defines the sequence of sort states when clicking the column header. Default is ['asc', 'desc', null] which cycles through ascending → descending → no sort. Customize per column based on data type - use ['desc', 'asc', null] for numbers/dates where descending is more common.",
    type: "Array<'asc' | 'desc' | null>",
    example: `// Numbers/dates - descending first
{ 
  accessor: "revenue", 
  label: "Revenue", 
  isSortable: true,
  sortingOrder: ['desc', 'asc', null]
}

// Text - ascending first (default)
{ 
  accessor: "name", 
  label: "Name", 
  isSortable: true,
  sortingOrder: ['asc', 'desc', null]
}

// Always keep sort active (no null state)
{ 
  accessor: "priority", 
  label: "Priority", 
  isSortable: true,
  sortingOrder: ['asc', 'desc']
}`,
  },
  {
    key: "comparator",
    name: "HeaderObject.comparator",
    required: false,
    description:
      "Custom sorting function based on row-level metadata or complex logic. Receives full row objects and sort direction, allowing you to sort by multiple fields, nested properties, or domain-specific rules.",
    type: "(props: ComparatorProps) => number",
    link: "/docs/api-reference#comparator-props",
    example: `{
  accessor: "priority",
  label: "Priority",
  comparator: ({ rowA, rowB, direction }) => {
    // Sort by priority first, then by performance score
    if (rowA.priority !== rowB.priority) {
      return direction === "asc" 
        ? rowA.priority - rowB.priority 
        : rowB.priority - rowA.priority;
    }
    return rowB.metadata.score - rowA.metadata.score;
  }
}`,
  },
  {
    key: "valueGetter",
    name: "HeaderObject.valueGetter",
    required: false,
    description:
      "Function to extract values from nested objects or compute values dynamically for sorting operations. Useful when the displayed value differs from the sorting value, or when sorting by deeply nested properties.",
    type: "(props: ValueGetterProps) => CellValue",
    link: "/docs/api-reference#value-getter-props",
    example: `{
  accessor: "metadata",
  label: "Seniority Level",
  valueGetter: ({ row }) => row.metadata?.seniorityLevel || 0,
  valueFormatter: ({ row }) => {
    const level = row.metadata?.seniorityLevel || 0;
    return ["Intern", "Junior", "Mid", "Senior", "Lead"][level];
  }
}`,
  },
];

const EXTERNAL_SORTING_PROPS: PropInfo[] = [
  {
    key: "initialSortColumn",
    name: "initialSortColumn",
    required: false,
    description:
      "Sets the column to sort by on initial table load. Provide the accessor of the column you want to sort by default. Supports simple accessors, nested paths (dot notation), and array indices (v1.9.4+).",
    type: "string",
    example: `// Simple accessor
initialSortColumn="revenue"

// Nested accessor
initialSortColumn="user.profile.name"

// Array index accessor (v1.9.4+)
initialSortColumn="awards[0]"
initialSortColumn="albums[0].title"`,
  },
  {
    key: "initialSortDirection",
    name: "initialSortDirection",
    required: false,
    description:
      "Sets the sort direction for the initial sort. Defaults to 'asc' if not specified.",
    type: '"asc" | "desc"',
    example: `initialSortDirection="desc"`,
  },
  {
    key: "onSortChange",
    name: "onSortChange",
    required: false,
    description:
      "Callback function triggered when sort configuration changes. Receives the current sort configuration or null if no sorting is applied.",
    type: "(sort: SortConfig | null) => void",
    link: "/docs/api-reference#sort-config",
    example: `onSortChange={(sortConfig) => {
  if (sortConfig) {
    console.log(\`Sorting by \${sortConfig.key.accessor} (\${sortConfig.direction})\`);
    // Make API call with sort parameters
  }
}}`,
  },
  {
    key: "externalSortHandling",
    name: "externalSortHandling",
    required: false,
    description:
      "When true, completely disables internal sorting logic. The table will not sort data internally - you must provide pre-sorted data via the rows prop.",
    type: "boolean",
    example: `externalSortHandling={true}`,
  },
];

const ColumnSortingContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faSort} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Sorting</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Column sorting allows users to organize table data in ascending or descending order based on
        column values. This feature is essential for data analysis and quick information retrieval.
      </motion.p>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="column-sorting"
          height="400px"
          Preview={ColumnSortingDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Basic Sorting
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To enable sorting for a column, add the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            isSortable: true
          </code>{" "}
          property to your column definition.
        </p>

        <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">
            ✨ New in v1.9.4: Array Index Support
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Accessors now support nested array paths using bracket notation. This allows you to sort
            by specific array elements without writing custom logic.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">awards[0]</code> -
              Sort by first award
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                albums[0].title
              </code>{" "}
              - Sort by first album's title
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                releaseDate[0]
              </code>{" "}
              - Sort by first release date
            </li>
          </ul>
        </div>

        <PropTable props={COLUMN_SORTING_PROPS} title="Column Sorting Configuration" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.43 }}
      >
        Custom Sort Order
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.44 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Customize the sort cycle for individual columns using the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            sortingOrder
          </code>{" "}
          property. This allows different columns to have different sort behaviors based on their
          data type and expected user interaction patterns.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">💡 Common Patterns</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Numbers/Dates:</strong> Use{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                [&apos;desc&apos;, &apos;asc&apos;, null]
              </code>{" "}
              to show highest values or most recent dates first
            </li>
            <li>
              <strong>Text/Names:</strong> Use{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                [&apos;asc&apos;, &apos;desc&apos;, null]
              </code>{" "}
              (default) for alphabetical sorting
            </li>
            <li>
              <strong>Always Sorted:</strong> Use{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                [&apos;asc&apos;, &apos;desc&apos;]
              </code>{" "}
              to prevent removing sort (no null state)
            </li>
            <li>
              <strong>Single Direction:</strong> Use{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                [&apos;desc&apos;, null]
              </code>{" "}
              to toggle between descending and no sort
            </li>
          </ul>
        </div>

      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        Advanced Sorting
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          For complex sorting scenarios, Simple Table provides two powerful options:
        </p>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
          Custom Comparator
        </h3>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Use{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            comparator
          </code>{" "}
          when you need to sort based on multiple fields, row metadata, or custom business logic:
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">💡 Use Cases</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              Sort by multiple fields with priority (e.g., priority level + performance score)
            </li>
            <li>Access metadata or related fields not directly in the column</li>
            <li>Implement domain-specific sorting rules (e.g., custom status ordering)</li>
            <li>Sort by computed values derived from multiple row properties</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Value Getter</h3>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Use{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            valueGetter
          </code>{" "}
          to extract nested values or compute values for sorting, especially when displaying
          formatted text:
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">💡 Use Cases</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Sort by nested/computed values while displaying formatted text</li>
            <li>Access deeply nested properties (e.g., row.metadata.seniorityLevel)</li>
            <li>Calculate derived values for sorting operations</li>
            <li>Combine with valueFormatter to separate sorting logic from display</li>
          </ul>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg shadow-sm">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">
            🎯 Comparator vs ValueGetter
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            Use <strong>comparator</strong> when you need full control over the sorting logic with
            access to both rows. Use <strong>valueGetter</strong> when you want the default sorting
            behavior but need to extract or compute the value first.
          </p>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        Initial Sort State
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Set the table to load with a default sort applied using{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            initialSortColumn
          </code>{" "}
          and{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            initialSortDirection
          </code>
          . This is perfect for showing users the most relevant data first, like sorting by date
          (newest first) or revenue (highest first).
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">💡 Use Cases</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Sort by date to show newest records first</li>
            <li>Sort by revenue/sales to highlight top performers</li>
            <li>Sort by priority or status to show critical items first</li>
            <li>Provide a consistent, predictable initial view for users</li>
          </ul>
        </div>


        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The table will load with the sort applied, and users can still change the sort by clicking
          column headers.
        </p>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        External Sorting
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          For advanced use cases, you can handle sorting externally - perfect for server-side
          sorting, API integration, or custom sorting logic. This demo shows how to manage sorting
          completely outside the table component.
        </p>

        <div className="mb-6">
          <LivePreview
            demoId="external-sort"
            height="400px"
            Preview={ExternalSortDemo}
          />
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          External sorting provides two key benefits:
        </p>

        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
          <li>
            <strong>API Integration:</strong> Use{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              onSortChange
            </code>{" "}
            to trigger server-side sorting while keeping the table's UI sorting indicators.
          </li>
          <li>
            <strong>Complete Control:</strong> Use{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              externalSortHandling={true}
            </code>{" "}
            to disable all internal sorting and provide your own pre-sorted data.
          </li>
        </ul>

        <PropTable props={EXTERNAL_SORTING_PROPS} title="External Sorting Configuration" />
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ColumnSortingContent;
