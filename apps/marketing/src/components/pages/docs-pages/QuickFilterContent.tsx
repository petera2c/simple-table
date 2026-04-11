"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import QuickFilterDemo from "@/components/demos/QuickFilterDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { Input, Radio, Checkbox, Space } from "antd";
import type { RadioChangeEvent } from "antd";
import type { QuickFilterMode } from "@simple-table/react";

const QUICK_FILTER_PROPS: PropInfo[] = [
  {
    key: "quickFilter",
    name: "quickFilter",
    required: false,
    description:
      "Enable global search/quick filter across all columns. Accepts a QuickFilterConfig object to control the search text, mode, case sensitivity, and which columns to search.",
    type: "QuickFilterConfig",
    link: "#quick-filter-config",
    example: `// Simple mode - basic text matching
<SimpleTable
  quickFilter={{
    text: searchText,
    mode: "simple",
  }}
  // ... other props
/>

// Smart mode - advanced search with operators
<SimpleTable
  quickFilter={{
    text: searchText,
    mode: "smart",
    caseSensitive: false,
    onChange: (text) => console.log("Filter changed:", text),
  }}
  // ... other props
/>`,
  },
];

const QUICK_FILTER_CONFIG_PROPS: PropInfo[] = [
  {
    key: "text",
    name: "text",
    required: true,
    description:
      "The search text to filter by. All columns will be searched for this text unless specific columns are configured.",
    type: "string",
    example: `quickFilter={{ text: "engineering" }}`,
  },
  {
    key: "mode",
    name: "mode",
    required: false,
    description:
      "Search mode: 'simple' for basic contains matching, or 'smart' for advanced search with multi-word AND logic, phrase search (quotes), negation (minus), and column-specific search (column:value). Defaults to 'simple'.",
    type: '"simple" | "smart"',
    example: `// Simple mode (default)
quickFilter={{ text: "alice", mode: "simple" }}

// Smart mode with advanced operators
quickFilter={{ text: "engineering -inactive", mode: "smart" }}`,
  },
  {
    key: "caseSensitive",
    name: "caseSensitive",
    required: false,
    description: "Whether the search should be case-sensitive. Defaults to false.",
    type: "boolean",
    example: `quickFilter={{ 
  text: "Alice", 
  caseSensitive: true 
}}`,
  },
  {
    key: "columns",
    name: "columns",
    required: false,
    description:
      "Array of column accessors to search. If not provided, all columns are searched (unless a column has quickFilterable: false).",
    type: "Accessor[]",
    example: `// Only search in name and email columns
quickFilter={{ 
  text: "alice", 
  columns: ["name", "email"] 
}}`,
  },
  {
    key: "useFormattedValue",
    name: "useFormattedValue",
    required: false,
    description:
      "Whether to search the formatted value (from valueFormatter) instead of the raw value. Defaults to false.",
    type: "boolean",
    example: `// Search formatted values like "$95,000" instead of raw 95000
quickFilter={{ 
  text: "$95", 
  useFormattedValue: true 
}}`,
  },
  {
    key: "onChange",
    name: "onChange",
    required: false,
    description:
      "Callback function triggered when the quick filter text changes. Useful for tracking search analytics or syncing with external state.",
    type: "(text: string) => void",
    example: `quickFilter={{ 
  text: searchText,
  onChange: (text) => {
    console.log("User searched for:", text);
    trackSearchAnalytics(text);
  }
}}`,
  },
];

const HEADER_OBJECT_QUICK_FILTER_PROPS: PropInfo[] = [
  {
    key: "quickFilterable",
    name: "HeaderObject.quickFilterable",
    required: false,
    description:
      "Controls whether this column should be included in quick filter searches. Set to false to exclude a column from global search. Defaults to true.",
    type: "boolean",
    example: `// Exclude ID column from quick filter
{ 
  accessor: "id", 
  label: "ID", 
  quickFilterable: false 
}

// Include in quick filter (default)
{ 
  accessor: "name", 
  label: "Name", 
  quickFilterable: true 
}`,
  },
  {
    key: "quickFilterGetter",
    name: "HeaderObject.quickFilterGetter",
    required: false,
    description:
      "Custom function to extract the searchable value for this column. Useful for complex data structures, computed values, or custom search logic. Receives the row and returns a string or string array to search.",
    type: "QuickFilterGetter",
    link: "#quick-filter-getter",
    example: `// Search nested object
{ 
  accessor: "user", 
  label: "User",
  quickFilterGetter: ({ row }) => row.user?.fullName || ""
}

// Search multiple fields
{ 
  accessor: "contact", 
  label: "Contact",
  quickFilterGetter: ({ row }) => [
    row.firstName,
    row.lastName,
    row.email
  ].filter(Boolean)
}

// Custom formatting for search
{ 
  accessor: "tags", 
  label: "Tags",
  quickFilterGetter: ({ row }) => 
    row.tags?.map(t => t.name).join(" ") || ""
}`,
  },
];

const QUICK_FILTER_GETTER_PROPS: PropInfo[] = [
  {
    key: "row",
    name: "row",
    required: true,
    description: "The row data object.",
    type: "Row",
    example: `quickFilterGetter: ({ row }) => row.customField`,
  },
  {
    key: "accessor",
    name: "accessor",
    required: true,
    description: "The column accessor.",
    type: "Accessor",
    example: `quickFilterGetter: ({ row, accessor }) => row[accessor]`,
  },
  {
    key: "formattedValue",
    name: "formattedValue",
    required: false,
    description: "The formatted value if a valueFormatter is defined.",
    type: "string | number | boolean | string[] | number[] | null | undefined",
    example: `quickFilterGetter: ({ formattedValue }) => 
  formattedValue?.toString() || ""`,
  },
];

const QuickFilterContent = () => {
  const [searchText, setSearchText] = useState("");
  const [filterMode, setFilterMode] = useState<QuickFilterMode>("simple");
  const [caseSensitive, setCaseSensitive] = useState(false);

  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-purple-100 rounded-lg">
          <FontAwesomeIcon icon={faSearch} className="text-purple-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Quick Filter / Global Search
        </h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Quick Filter provides powerful global search functionality that searches across all columns
        with a single input. Choose between simple text matching or smart search mode with advanced
        operators for complex queries.
      </motion.p>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%", marginBottom: "16px" }}>
          <Input
            placeholder="Search across all columns..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
            allowClear
          />

          <Space size="large" wrap>
            <Radio.Group
              value={filterMode}
              onChange={(e: RadioChangeEvent) => setFilterMode(e.target.value as QuickFilterMode)}
            >
              <Radio value="simple">Simple Mode</Radio>
              <Radio value="smart">Smart Mode</Radio>
            </Radio.Group>

            <Checkbox checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)}>
              Case Sensitive
            </Checkbox>
          </Space>
        </Space>

        <LivePreview
          demoId="quick-filter"
          height="400px"
          Preview={(props) => (
            <QuickFilterDemo
              {...props}
              searchText={searchText}
              filterMode={filterMode}
              caseSensitive={caseSensitive}
            />
          )}
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
          Enable quick filter by passing a{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            quickFilter
          </code>{" "}
          prop with a{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            QuickFilterConfig
          </code>{" "}
          object. The quick filter applies before column-specific filters in the filter chain.
        </p>

        <PropTable props={QUICK_FILTER_PROPS} title="Quick Filter Configuration" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        id="quick-filter-config"
      >
        QuickFilterConfig Properties
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <PropTable props={QUICK_FILTER_CONFIG_PROPS} title="QuickFilterConfig" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Search Modes
      </motion.h2>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Simple Mode</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Simple mode performs basic text matching using a "contains" search. It's straightforward
          and intuitive for users who want to quickly find data without learning special syntax.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <strong>Example:</strong> Searching for{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">engineering</code>{" "}
            will match any row containing "engineering" in any searchable column.
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Smart Mode</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Smart mode provides advanced search capabilities with multiple operators for power users:
        </p>

        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
          <li>
            <strong>Multi-word (AND logic):</strong>{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              alice engineering
            </code>{" "}
            → matches rows containing both "alice" AND "engineering"
          </li>
          <li>
            <strong>Phrase search:</strong>{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              "alice johnson"
            </code>{" "}
            → matches exact phrase "alice johnson"
          </li>
          <li>
            <strong>Negation:</strong>{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">-inactive</code> →
            excludes rows containing "inactive"
          </li>
          <li>
            <strong>Column-specific search:</strong>{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              department:engineering
            </code>{" "}
            → searches only in the department column
          </li>
          <li>
            <strong>Combine operators:</strong>{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
              engineering -inactive location:new
            </code>{" "}
            → complex queries with multiple conditions
          </li>
        </ul>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        Column Configuration
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Customize how individual columns behave in quick filter searches using these HeaderObject
          properties:
        </p>

        <PropTable props={HEADER_OBJECT_QUICK_FILTER_PROPS} title="Column Configuration" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        id="quick-filter-getter"
      >
        QuickFilterGetterProps
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            quickFilterGetter
          </code>{" "}
          function receives these properties:
        </p>

        <PropTable props={QUICK_FILTER_GETTER_PROPS} title="QuickFilterGetterProps" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        Programmatic Control
      </motion.h2>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Control the quick filter programmatically using the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            tableRef.setQuickFilter()
          </code>{" "}
          method. This is useful for implementing custom search UI, keyboard shortcuts, or
          integrating with external search components.
        </p>


        <p className="text-gray-700 dark:text-gray-300 mt-4">
          For more details, see the{" "}
          <a
            href="/docs/programmatic-control"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Programmatic Control
          </a>{" "}
          documentation.
        </p>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default QuickFilterContent;
