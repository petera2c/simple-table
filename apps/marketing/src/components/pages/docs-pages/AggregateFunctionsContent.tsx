"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AggregateFunctionsDemo from "@/components/demos/AggregateFunctionsDemo";
import PageWrapper from "@/components/PageWrapper";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const AGGREGATION_SETUP_PROPS: PropInfo[] = [
  {
    key: "aggregation",
    name: "HeaderObject.aggregation",
    required: false,
    description:
      "Configuration object for aggregation functions that automatically calculate summary values for grouped data. Supports built-in types (sum, average, count, min, max) and custom functions.",
    type: "AggregationConfig",
    link: "/docs/api-reference#aggregation-config",
    enumValues: ["sum", "average", "count", "min", "max", "custom"],
    example: `// Sum aggregation - totals all numeric values
{
  accessor: "budget",
  label: "Budget", 
  aggregation: { type: "sum" }
}

// Average aggregation - computes arithmetic mean
{
  accessor: "rating",
  label: "Rating", 
  aggregation: { type: "average" }
}

// Count aggregation - counts non-null values
{
  accessor: "projects",
  label: "Projects", 
  aggregation: { type: "count" }
}

// Min/Max aggregation - finds extremes
{
  accessor: "score",
  label: "Score", 
  aggregation: { type: "max" }
}

// Custom aggregation with value parsing
{
  accessor: "budget",
  label: "Budget", 
  aggregation: {
    type: "sum",
    parseValue: (val) => parseFloat(val.replace(/[^0-9.-]/g, '')),
    formatResult: (val) => '$' + val.toLocaleString()
  }
}

// Custom function aggregation
{
  accessor: "performance",
  label: "Performance", 
  aggregation: {
    type: "custom",
    customFn: (values) => {
      const sum = values.reduce((acc, val) => acc + parseFloat(val), 0);
      return Math.round((sum / values.length) * 10) / 10;
    }
  }
}`,
  },
];

const AggregateFunctionsContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-purple-100 rounded-lg">
          <FontAwesomeIcon icon={faCalculator} className="text-purple-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Aggregate Functions</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Aggregate functions automatically calculate summary values for grouped data in your tables.
        Simple Table supports built-in aggregations like sum, average, count, min, max, and custom
        functions to provide powerful data insights with automatic computation and formatting.
      </motion.p>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="aggregate-functions"
          height="500px"
          Preview={AggregateFunctionsDemo}
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
          Aggregate functions are configured by adding the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            aggregation
          </code>{" "}
          property to column headers. When data is grouped using row grouping, these functions
          automatically calculate summary values for each group level.
        </p>

        <PropTable props={AGGREGATION_SETUP_PROPS} title="Aggregation Configuration" />

        <motion.h2
          className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Aggregation Types
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Sum Aggregation</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Calculates the total of all numeric values in a group.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Perfect for totaling budgets, employee counts, or any cumulative metrics.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Average Aggregation</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Computes the arithmetic mean of all values in a group.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Ideal for ratings, performance scores, or any metric where the mean is meaningful.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Count Aggregation</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Counts the number of non-null values in a group.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Useful for counting projects, tasks, or any discrete items within groups.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Min/Max Aggregation</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Finds the minimum or maximum value in a group.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Great for finding ranges, extremes, or boundary values in your data.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-2">
              Advanced: Custom Aggregation & Value Parsing
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              For complex scenarios, you can define custom aggregation functions and parse string
              values before aggregation.
            </p>

          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-white mb-2">💡 Pro Tips</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>
                Combine aggregations with custom cell renderers to format results appropriately
              </li>
              <li>
                Use parseValue when your source data contains formatted strings like currencies
              </li>
              <li>
                Aggregations work at every level of row grouping, providing hierarchical summaries
              </li>
              <li>Custom aggregation functions receive all values in the group as an array</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        Related Features
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <a
              href="/docs/row-grouping"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Row Grouping
            </a>{" "}
            - Learn about organizing hierarchical data
          </li>
          <li>
            <a
              href="/docs/nested-tables"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Nested Tables
            </a>{" "}
            - Display different columns at each hierarchy level
          </li>
          <li>
            <a
              href="/docs/value-formatter"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Value Formatter
            </a>{" "}
            - Format aggregated values for display
          </li>
        </ul>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default AggregateFunctionsContent;
