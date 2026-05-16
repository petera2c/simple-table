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
      "Height of the table container. Use this OR scrollParent to enable scroll detection. With a fixed height the table's own body scrolls; without height the table grows to fit and scrollParent drives the scroll.",
    type: "string",
    example: `<SimpleTable
  height="400px"
  onLoadMore={handleLoadMore}
  // ... other props
/>`,
  },
  {
    key: "infiniteScrollThreshold",
    name: "infiniteScrollThreshold",
    required: false,
    description:
      "Pixel distance from the bottom at which onLoadMore fires. Defaults to 200. Increase for earlier pre-fetching.",
    type: "number",
    example: `<SimpleTable
  onLoadMore={handleLoadMore}
  infiniteScrollThreshold={400}
  // ... other props
/>`,
  },
];

const WINDOW_SCROLL_PROPS: PropInfo[] = [
  {
    key: "scrollParent",
    name: "scrollParent",
    required: false,
    description:
      "Opts the table into window / external scroll mode. When set and neither height nor maxHeight is provided, the table grows to its natural size inside the parent and that parent's scroll position drives both row virtualization and onLoadMore. Accepts an element, the string \"window\", or a getter (useful for refs that resolve after first render). The header automatically pins to the top of the parent's scroll viewport.",
    type: 'HTMLElement | "window" | (() => HTMLElement | null)',
    example: `// Page-level scroll (most common in real apps)
<SimpleTable
  defaultHeaders={headers}
  rows={rows}
  scrollParent="window"
  onLoadMore={handleLoadMore}
/>

// Custom container (e.g. a side panel with overflow: auto)
<SimpleTable
  defaultHeaders={headers}
  rows={rows}
  scrollParent={() => containerRef.current}
  onLoadMore={handleLoadMore}
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
            when user scrolls within{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              infiniteScrollThreshold
            </code>{" "}
            pixels of the bottom (default 200px)
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

      {/* Window / External Scroll Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Window / External Scroll Mode
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Want the table to behave like a regular page section — growing to its natural height
          while the page (or a parent container) scrolls? Drop{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            height
          </code>{" "}
          /{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            maxHeight
          </code>{" "}
          and pass{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            scrollParent
          </code>
          . The table will:
        </p>

        <ul className="list-disc pl-5 space-y-3 text-gray-700 dark:text-gray-300 mb-6">
          <li>
            <strong>Virtualize against the parent</strong> - Only the rows visible inside the
            parent's viewport are rendered, even with tens of thousands of rows.
          </li>
          <li>
            <strong>Fire onLoadMore from the parent's scroll</strong> - The threshold check uses the
            parent's position relative to the table, not the table's own (non-existent) inner
            scroll.
          </li>
          <li>
            <strong>Pin the header automatically</strong> - The header sticks to the top of the
            parent's scroll viewport via CSS{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              position: sticky
            </code>{" "}
            so it stays visible as users scroll through the rows.
          </li>
          <li>
            <strong>Suppress overscroll bounce</strong> - Sets{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              overscroll-behavior-y: none
            </code>{" "}
            on the scroll parent so the rubber-band effect doesn't visually shift the sticky header
            off the viewport. Restored on unmount.
          </li>
        </ul>

        <PropTable props={WINDOW_SCROLL_PROPS} title="Window / External Scroll Props" />

        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6 mb-3">
          Precedence rules
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
          <li>
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              height
            </code>{" "}
            or{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              maxHeight
            </code>{" "}
            always win. If either is set,{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              scrollParent
            </code>{" "}
            is ignored and the table uses its own inner scroll.
          </li>
          <li>
            Without{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              scrollParent
            </code>{" "}
            and without{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              height
            </code>
            , all rows render (no virtualization, no infinite scroll).
          </li>
          <li>
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              enableStickyParents
            </code>{" "}
            (for grouped row parents) works in external scroll mode too — pinned parent rows
            stay just under the sticky header as you scroll past their children.
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6 mb-3">
          Padding on the scroll parent
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          If your scroll parent has{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            padding-top
          </code>
          , the table reads it and offsets the sticky header so it pins flush to the parent's outer
          top edge instead of sitting beneath the padding. No extra config required.
        </p>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default InfiniteScrollContent;
