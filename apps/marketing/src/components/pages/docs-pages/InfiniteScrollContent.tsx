"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfinity } from "@fortawesome/free-solid-svg-icons";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import InfiniteScrollDemo from "@/components/demos/InfiniteScrollDemo";

const INFINITE_SCROLL_PROPS: PropInfo[] = [
  {
    key: "onLoadMore",
    name: "onLoadMore",
    required: false,
    description:
      "Callback function triggered when user scrolls near the bottom of the table to load more data. Useful for implementing infinite scrolling or paginated data loading.",
    type: "() => void",
    example: `const handleLoadMore = () => {
  // Fetch more data from API
  fetchMoreData().then(newRows => {
    setRows(prevRows => [...prevRows, ...newRows]);
  });
};

<SimpleTable
  onLoadMore={handleLoadMore}
  // ... other props
/>`,
  },
  {
    key: "height",
    name: "height",
    required: false,
    description:
      "Height of the table container. Required for infinite scroll to work properly as it enables the scroll detection.",
    type: "string",
    example: `<SimpleTable
  height="400px"
  onLoadMore={handleLoadMore}
  // ... other props
/>`,
  },
];

const InfiniteScrollContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-purple-100 rounded-lg">
          <FontAwesomeIcon icon={faInfinity} className="text-purple-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Infinite Scroll</h1>
      </motion.div>

      {/* Demo Section */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="infinite-scroll"
          height="400px"
          Preview={InfiniteScrollDemo}
        />
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        SimpleTable provides built-in infinite scroll functionality that automatically loads more
        data as users scroll near the bottom of the table. This feature is perfect for handling
        large datasets without overwhelming the user or degrading performance.
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
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To enable infinite scroll in your table, follow these steps:
        </p>

        <ol className="list-decimal pl-5 mb-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Set a fixed height</strong> - Use the{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              height
            </code>{" "}
            prop to create a scrollable container
          </li>
          <li>
            <strong>Implement the callback</strong> - Create an{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              onLoadMore
            </code>{" "}
            function that fetches additional data
          </li>
          <li>
            <strong>Update state</strong> - Append new data to your existing rows array
          </li>
        </ol>

        <PropTable props={INFINITE_SCROLL_PROPS} title="Infinite Scroll Configuration" />
      </motion.div>

      {/* How it Works Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        How It Works
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          SimpleTable's infinite scroll implementation:
        </p>

        <ul className="list-disc pl-5 space-y-3 text-gray-700 dark:text-gray-300 mb-6">
          <li>
            <strong>Scroll Detection</strong> - Monitors scroll position within the table container
          </li>
          <li>
            <strong>Threshold Triggering</strong> - Calls{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              onLoadMore
            </code>{" "}
            when user scrolls near the bottom (typically 100px before the end)
          </li>
          <li>
            <strong>Debouncing</strong> - Prevents multiple simultaneous requests by debouncing the
            scroll event
          </li>
          <li>
            <strong>Smooth Integration</strong> - New data is seamlessly appended to the existing
            table
          </li>
        </ul>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default InfiniteScrollContent;
