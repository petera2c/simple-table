"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import NestedHeadersDemo from "@/components/demos/NestedHeadersDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const NESTED_HEADERS_PROPS: PropInfo[] = [
  {
    key: "children",
    name: "HeaderObject.children",
    required: false,
    description:
      "Array of child column definitions that will be grouped under this parent header. Creates a hierarchical column structure.",
    type: "HeaderObject[]",
    link: "/docs/api-reference#header-object",
    example: `// Parent header with child columns
{
  label: "Test Scores",
  children: [
    { 
      accessor: "math", 
      label: "Math", 
      width: 80,
      type: "number" 
    },
    { 
      accessor: "science", 
      label: "Science", 
      width: 80,
      type: "number" 
    },
    { 
      accessor: "english", 
      label: "English", 
      width: 80,
      type: "number" 
    }
  ]
}`,
  },
];

export default function NestedHeadersContent() {
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Nested Headers</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Nested headers allow you to create hierarchical column structures by grouping related
        columns under a parent header, making complex data more organized and easier to understand.
      </motion.p>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="nested-headers"
          height="400px"
          Preview={NestedHeadersDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Implementation
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To create nested headers, add a{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            children
          </code>{" "}
          array to your parent header object, containing the child column definitions:
        </p>

        <PropTable props={NESTED_HEADERS_PROPS} title="Nested Headers Configuration" />

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6 mt-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">
            Key Points About Nested Headers
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Parent headers serve as container columns and typically don't display cell data</li>
            <li>
              Child columns can have all the same properties as regular columns (sorting, filtering,
              custom renderers, etc.)
            </li>
            <li>You can have multiple levels of nesting by adding children to child columns</li>
            <li>Width of the parent column will automatically adjust to fit all child columns</li>
          </ul>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Common Use Cases
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Grouped Data Categories:</strong> Organize related columns like "Personal
            Information", "Contact Details", etc.
          </li>
          <li>
            <strong>Time-based Data:</strong> Group columns by time periods (Q1, Q2, Q3, Q4) with
            child columns for specific metrics
          </li>
          <li>
            <strong>Financial Reports:</strong> Group columns for "Revenue", "Expenses", "Profit"
            with subcategories
          </li>
          <li>
            <strong>Test Scores:</strong> As shown in the example, group different subject scores
            under a single parent
          </li>
        </ul>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
}
