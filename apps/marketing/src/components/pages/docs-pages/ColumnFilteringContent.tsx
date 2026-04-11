"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ColumnFilteringDemo from "@/components/demos/ColumnFilteringDemo";
import ExternalFilterDemo from "@/components/demos/ExternalFilterDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const COLUMN_FILTERING_PROPS: PropInfo[] = [
  {
    key: "filterable",
    name: "HeaderObject.filterable",
    required: false,
    description:
      "Enable filtering for a specific column. Each column can be independently configured for filtering based on its data type. Simple Table provides intelligent filtering with different operators for each data type.",
    type: "boolean",
    example: `// String column with filtering (8 operators)
{ 
  accessor: "name", 
  label: "Full Name", 
  type: "string",
  filterable: true 
}

// Number column with filtering (10 operators)
{ 
  accessor: "age", 
  label: "Age", 
  type: "number",
  filterable: true 
}

// Date column with filtering (8 operators)
{ 
  accessor: "birthDate", 
  label: "Birth Date", 
  type: "date",
  filterable: true 
}

// Boolean column with filtering (3 operators)
{ 
  accessor: "isActive", 
  label: "Active", 
  type: "boolean",
  filterable: true 
}

// Enum column with filtering (4 operators)
// When more than 10 options, search input appears automatically
{ 
  accessor: "status", 
  label: "Status", 
  type: "enum",
  filterable: true,
  enumOptions: [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Pending", value: "pending" },
    { label: "Suspended", value: "suspended" },
    { label: "Archived", value: "archived" },
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Under Review", value: "under_review" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Completed", value: "completed" }
  ]
}`,
  },
];

const EXTERNAL_FILTERING_PROPS: PropInfo[] = [
  {
    key: "onFilterChange",
    name: "onFilterChange",
    required: false,
    description:
      "Callback function triggered when filter configuration changes. Receives the current filter state with all active filters.",
    type: "(filters: TableFilterState) => void",
    link: "/docs/api-reference#table-filter-state",
    example: `onFilterChange={(filters) => {
  console.log('Active filters:', filters);
  // Make API call with filter parameters
  // filters is an object where keys are unique filter IDs
  // and values are FilterCondition objects
}}`,
  },
  {
    key: "externalFilterHandling",
    name: "externalFilterHandling",
    required: false,
    description:
      "When true, completely disables internal filtering logic. The table will not filter data internally - you must provide pre-filtered data via the rows prop.",
    type: "boolean",
    example: `externalFilterHandling={true}`,
  },
];

const ColumnFilteringContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-green-100 rounded-lg">
          <FontAwesomeIcon icon={faFilter} className="text-green-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Filtering</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Column filtering allows users to quickly find and display only the data that meets specific
        criteria. Simple Table provides intelligent filtering for different data types including
        text, numbers, dates, booleans, and enum values.
      </motion.p>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="column-filtering"
          height="400px"
          Preview={ColumnFilteringDemo}
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
          Column filtering is enabled by adding the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            filterable: true
          </code>{" "}
          property to individual column headers. Each column can be independently configured for
          filtering based on its data type.
        </p>

        <PropTable props={COLUMN_FILTERING_PROPS} title="Filter Configuration" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        External Filtering
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          For advanced use cases, you can handle filtering externally - perfect for server-side
          filtering, API integration, or custom filtering logic. This demo shows how to manage
          filtering completely outside the table component with diverse data types and locations.
        </p>

        <div className="mb-6">
          <LivePreview
            demoId="external-filter"
            height="400px"
            Preview={ExternalFilterDemo}
          />
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          External filtering provides two key benefits:
        </p>

        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
          <li>
            <strong>API Integration:</strong> Use{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              onFilterChange
            </code>{" "}
            to trigger server-side filtering while keeping the table's UI filter controls.
          </li>
          <li>
            <strong>Complete Control:</strong> Use{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              externalFilterHandling={true}
            </code>{" "}
            to disable all internal filtering and provide your own pre-filtered data.
          </li>
        </ul>

        <PropTable props={EXTERNAL_FILTERING_PROPS} title="External Filtering Configuration" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Enum Filter Search
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          For enum columns with more than 10 options, Simple Table automatically provides a search
          input to help users quickly find and select the desired enum values. This improves
          usability when dealing with large sets of enum options.
        </p>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ColumnFilteringContent;
