"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter } from "@fortawesome/free-solid-svg-icons";
import ColumnAlignmentDemo from "@/components/demos/ColumnAlignmentDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const COLUMN_ALIGNMENT_PROPS: PropInfo[] = [
  {
    key: "align",
    name: "HeaderObject.align",
    required: false,
    description:
      "Controls the horizontal alignment of content within the column for both header and cell content.",
    type: "enum",
    link: "/docs/api-reference#union-types",
    enumValues: ["left", "center", "right"],
    example: `// Left alignment (default)
{ 
  accessor: "name", 
  label: "Full Name", 
  align: "left" 
}

// Center alignment for status indicators
{ 
  accessor: "status", 
  label: "Status", 
  align: "center" 
}

// Right alignment for numeric values
{ 
  accessor: "price", 
  label: "Price", 
  align: "right" 
}`,
  },
];

const ColumnAlignmentContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faAlignCenter} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Alignment</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Column alignment allows you to control how content is positioned horizontally within each
        column, improving readability and visual organization of your data.
      </motion.p>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="column-alignment"
          height="400px"
          Preview={ColumnAlignmentDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Basic Usage
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Control column alignment by setting the <code>align</code> property in your header
          definitions:
        </p>

        <PropTable props={COLUMN_ALIGNMENT_PROPS} title="Column Alignment Configuration" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Best Practices
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Consider these guidelines for optimal column alignment:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Text Content</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Left-align text content such as names, descriptions, and other textual data for easier
              reading.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Numeric Values</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Right-align numbers, currencies, and percentages to make decimal points align
              vertically.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Headers</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Match the header alignment with its column content for consistency.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Status Indicators</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Center-align status badges, icons, and other indicator elements to create visual
              focus.
            </p>
          </div>
        </div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ColumnAlignmentContent;
