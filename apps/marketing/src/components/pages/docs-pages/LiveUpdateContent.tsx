"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import LiveUpdateDemo from "@/components/demos/LiveUpdateDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const LIVE_UPDATE_PROPS: PropInfo[] = [
  {
    key: "ref",
    name: "ref",
    required: false,
    description:
      "React ref object that provides access to table methods for programmatic updates. Used to call updateData method.",
    type: "React.RefObject<TableAPI>",
    example: `const tableRef = useRef<TableAPI>(null);

<SimpleTable
  ref={tableRef}
  // ... other props
/>`,
  },
  {
    key: "cellUpdateFlash",
    name: "cellUpdateFlash",
    required: false,
    description:
      "Enables visual flash animation when cell values are updated programmatically. Provides user feedback for data changes.",
    type: "boolean",
    example: `<SimpleTable
  cellUpdateFlash={true}
  // ... other props
/>`,
  },
];

const UPDATE_DATA_PARAMS_PROPS: PropInfo[] = [
  {
    key: "accessor",
    name: "accessor",
    required: true,
    description: "The column accessor/key that identifies which column to update.",
    type: "string",
    example: `tableRef.current?.updateData({
  accessor: "price",
  rowIndex: 2,
  newValue: 29.99
});`,
  },
  {
    key: "rowIndex",
    name: "rowIndex",
    required: true,
    description: "The zero-based index of the row to update.",
    type: "number",
    example: `tableRef.current?.updateData({
  accessor: "status",
  rowIndex: 0,  // First row
  newValue: "active"
});`,
  },
  {
    key: "newValue",
    name: "newValue",
    required: true,
    description: "The new value to set in the specified cell.",
    type: "any",
    example: `// Update with string
tableRef.current?.updateData({
  accessor: "name",
  rowIndex: 1,
  newValue: "John Doe"
});

// Update with number
tableRef.current?.updateData({
  accessor: "count",
  rowIndex: 3,
  newValue: 42
});`,
  },
];

const LiveUpdateContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-indigo-100 rounded-lg">
          <FontAwesomeIcon icon={faBolt} className="text-indigo-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Live Updates</h1>
      </motion.div>

      {/* Demo Section */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="live-update"
          height="400px"
          Preview={LiveUpdateDemo}
        />
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        SimpleTable provides powerful tools for creating dynamic, real-time tables with data that
        updates on the fly. Using the{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
          tableRef
        </code>{" "}
        and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
          updateData
        </code>{" "}
        API, you can update individual cells with smooth visual feedback through the{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
          cellUpdateFlash
        </code>{" "}
        feature.
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
          To enable live updates in your table, follow these steps:
        </p>

        <ol className="list-decimal pl-5 mb-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Create a table reference</strong> - Create a ref using{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              useRef
            </code>
            and pass it to the{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              tableRef
            </code>{" "}
            prop
          </li>
          <li>
            <strong>Enable flash animation</strong> - Set the{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              cellUpdateFlash
            </code>{" "}
            prop to{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              true
            </code>{" "}
            to enable visual feedback on cell updates
          </li>
          <li>
            <strong>Update data</strong> - Call{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              tableRef.current.updateData()
            </code>
            with the appropriate parameters to update specific cells
          </li>
        </ol>

        <PropTable props={LIVE_UPDATE_PROPS} title="Live Update Configuration" />
      </motion.div>

      {/* TableRef Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        The TableRef Interface
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            TableAPI
          </code>{" "}
          provides methods to interact with the table. Currently, it offers the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            updateData
          </code>{" "}
          method:
        </p>

        <PropTable props={UPDATE_DATA_PARAMS_PROPS} title="updateData Method Parameters" />

      </motion.div>

      {/* Cell Update Flash Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Cell Update Flash Animation
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          When{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            cellUpdateFlash
          </code>{" "}
          is enabled, cells will momentarily highlight when their value changes, providing a subtle
          visual cue to users:
        </p>

        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Important Notes</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              When updating cells, remember to also update your local state to keep it in sync with
              the table
            </li>
            <li>
              The flash effect is subtle by design to avoid distracting users with too much motion
            </li>
            <li>
              Updates are best used for small, incremental changes rather than complete table
              refreshes
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Updating Charts Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 mt-8 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.85 }}
      >
        Live Updates with Charts
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.87 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Chart columns work seamlessly with live updates. You can update chart data in real-time
          while maintaining a fixed array length by adding new values and removing old ones. The
          demo above shows this in action with Stock Trend (line chart) and Sales Trend (bar chart)
          columns.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">💡 Pro Tip</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Use custom{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              chartOptions
            </code>{" "}
            colors (like green for stock and orange for sales) to make charts stand out against
            theme backgrounds. This is especially important for themes with blue row backgrounds
            where default blue chart colors would blend in. See the{" "}
            <a
              href="/docs/chart-columns"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Chart Columns documentation
            </a>{" "}
            for more details.
          </p>
        </div>
      </motion.div>

      {/* Real-world Use Cases */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        Real-world Use Cases
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Live updates are particularly valuable in these scenarios:
        </p>

        <ul className="list-disc pl-5 space-y-3 text-gray-700 dark:text-gray-300 mb-6">
          <li>
            <strong>Financial dashboards</strong> - Display real-time stock price changes and trades
          </li>
          <li>
            <strong>Inventory management</strong> - Show live updates as items are purchased or
            restocked
          </li>
          <li>
            <strong>Analytics dashboards</strong> - Present data metrics that update as new
            information arrives
          </li>
          <li>
            <strong>Sports statistics</strong> - Display live game scores and player statistics
          </li>
          <li>
            <strong>IoT monitoring</strong> - Show sensor readings that update in real-time
          </li>
        </ul>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default LiveUpdateContent;
