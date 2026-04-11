"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import PropTable, { type PropInfo } from "@/components/PropTable";
import LivePreview from "@/components/LivePreview";
import EmptyStateDemo from "@/components/demos/EmptyStateDemo";

const EMPTY_STATE_PROPS: PropInfo[] = [
  {
    key: "tableEmptyStateRenderer",
    name: "tableEmptyStateRenderer",
    required: false,
    description:
      "Custom content to display in the table body when there are no rows to display. This can occur when filters return no results or when no data is provided.",
    type: "ReactNode",
    example: `<SimpleTable
  tableEmptyStateRenderer={
    <div className="flex flex-col items-center p-8">
      <span className="text-gray-500">No results found</span>
      <button onClick={clearFilters}>Clear filters</button>
    </div>
  }
  // ... other props
/>`,
  },
];

const EmptyStateContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-indigo-100 rounded-lg">
          <FontAwesomeIcon icon={faInbox} className="text-indigo-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Empty State</h1>
      </motion.div>

      {/* Demo Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="empty-state"
          height="450px"
          Preview={EmptyStateDemo}
        />
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Customize what users see when your table has no data to display. Whether it&apos;s an empty
        dataset, filtered results returning nothing, or data that hasn&apos;t loaded yet—provide
        helpful context instead of a blank table.
      </motion.p>

      {/* Basic Usage Section */}
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
          Pass any React component to{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            tableEmptyStateRenderer
          </code>{" "}
          to display custom content when the table has no rows:
        </p>

        <PropTable props={EMPTY_STATE_PROPS} title="Empty State Configuration" />
      </motion.div>

      {/* Use Cases Section */}
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
        <ul className="list-disc pl-5 space-y-3 text-gray-700 dark:text-gray-300 mb-6">
          <li>
            <strong>No search results</strong> — Show a &quot;No results found&quot; message with a
            button to clear filters
          </li>
          <li>
            <strong>Empty dataset</strong> — Display onboarding guidance like &quot;Add your first
            item&quot; with a call-to-action
          </li>
          <li>
            <strong>Permission restricted</strong> — Inform users they don&apos;t have access to
            view this data
          </li>
          <li>
            <strong>Error state</strong> — Show an error message with a retry button when data
            fetching fails
          </li>
        </ul>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">💡 Pro Tip</h3>
          <p className="text-gray-700 dark:text-gray-300">
            This prop only affects the table body when there are no rows. For loading states while
            data is being fetched, use the{" "}
            <a
              href="/docs/loading-state"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              isLoading
            </a>{" "}
            prop instead.
          </p>
        </div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default EmptyStateContent;
