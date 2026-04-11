"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "@/components/PageWrapper";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PropTable, { type PropInfo } from "@/components/PropTable";
import ChartsDemo from "@/components/demos/ChartsDemo";
import LivePreview from "@/components/LivePreview";
import ExampleLink from "@/components/ExampleLink";

const CHART_COLUMN_PROPS: PropInfo[] = [
  {
    key: "type-lineAreaChart",
    name: 'HeaderObject.type = "lineAreaChart"',
    required: false,
    description:
      "Renders an inline line/area chart for visualizing trends over time. The cell value must be an array of numbers. Perfect for displaying time-series data like daily views, monthly sales, or historical metrics.",
    type: "ColumnType",
    link: "/docs/api-reference#column-type",
    example: `{
  accessor: "monthlySales",
  label: "Monthly Sales (12mo)",
  type: "lineAreaChart",
  width: 150,
  align: "center",
  tooltip: "Sales trend over the past 12 months"
}`,
  },
  {
    key: "type-barChart",
    name: 'HeaderObject.type = "barChart"',
    required: false,
    description:
      "Renders an inline bar chart for comparing values across categories. The cell value must be an array of numbers. Ideal for quarterly data, weekly metrics, or any discrete comparison data.",
    type: "ColumnType",
    link: "/docs/api-reference#column-type",
    example: `{
  accessor: "quarterlyRevenue",
  label: "Quarterly Revenue",
  type: "barChart",
  width: 140,
  align: "center",
  tooltip: "Revenue by quarter"
}`,
  },
  {
    key: "chartOptions",
    name: "HeaderObject.chartOptions",
    required: false,
    description:
      "Customize the appearance and behavior of chart columns (lineAreaChart and barChart). Configure dimensions, colors, scaling, and rendering options.",
    type: "ChartOptions",
    link: "/docs/api-reference#chart-options",
    example: `{
  accessor: "cpuHistory",
  label: "CPU Usage",
  type: "lineAreaChart",
  width: 150,
  chartOptions: {
    min: 0,
    max: 100,
    width: 120,
    height: 35,
    color: "#3b82f6",
    fillColor: "#93c5fd",
    fillOpacity: 0.3,
    strokeWidth: 2
  }
}

// Bar chart with custom styling
{
  accessor: "quarterlyData",
  label: "Quarterly",
  type: "barChart",
  width: 140,
  chartOptions: {
    color: "#10b981",
    gap: 3,
    height: 40
  }
}`,
  },
];

const ChartColumnsContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/30">
          <FontAwesomeIcon
            icon={faChartLine}
            className="text-purple-600 dark:text-purple-400 text-2xl"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Chart Columns</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Visualize array data directly in your table cells with built-in chart columns. Simple Table
        supports line/area charts and bar charts, making it easy to display trends, comparisons, and
        time-series data without external visualization libraries.
      </motion.p>

      <motion.div
        className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-2">✨ New in v1.8.1</h3>
        <p className="text-gray-700 dark:text-gray-300">
          Chart columns are a powerful new feature that lets you visualize numeric array data
          inline, with smart copy/paste functionality that works seamlessly with spreadsheet
          applications.
        </p>
      </motion.div>

      {/* Interactive Demo */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.18 }}
      >
        <div className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
          Try selecting and copying chart cells (Cmd/Ctrl + C), then paste them to see the
          comma-separated format.
        </div>
        <LivePreview
          demoId="charts"
          height="400px"
          Preview={ChartsDemo}
        />
      </motion.div>

      {/* Basic Usage Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Basic Usage
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To add chart columns to your table, simply set the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            type
          </code>{" "}
          property in your column definition to either{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            "lineAreaChart"
          </code>{" "}
          or{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            "barChart"
          </code>
          . The cell data should be an array of numbers.
        </p>

      </motion.div>

      {/* Chart Types Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 mt-8 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Chart Types
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
          Line/Area Chart
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Line and area charts are perfect for showing trends over time. They work best with
          continuous data like daily metrics, monthly sales, or historical performance data.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 mt-6">Bar Chart</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Bar charts excel at comparing discrete values across categories. They're ideal for
          quarterly data, weekly summaries, or any scenario where you need to compare distinct
          values.
        </p>

      </motion.div>

      {/* Copy-Paste Functionality Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 mt-8 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Smart Copy-Paste Functionality
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Chart columns include intelligent copy-paste behavior that makes working with array data
          seamless. Data is automatically formatted for human readability and spreadsheet
          compatibility.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
              ✅ Copy (Cmd/Ctrl + C)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              When copying chart columns, the array data is formatted as comma-separated values:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-2">
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400">Input:</span> [10, 15, 12, 18,
                25]
              </p>
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400">Copied as:</span> "10, 15, 12,
                18, 25"
              </p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              This format is human-readable and pastes perfectly into Excel, Google Sheets, or any
              text editor. Values are tab-separated between columns for standard clipboard
              compatibility.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
              ✅ Paste (Cmd/Ctrl + V)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              When pasting into chart columns, comma-separated values are automatically parsed back
              into number arrays:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-2">
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400">Paste:</span> "10, 15, 12, 18,
                25"
              </p>
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400">Parsed as:</span> [10, 15, 12,
                18, 25]
              </p>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
              <li>Non-numeric values are automatically converted to 0</li>
              <li>Works seamlessly when copy/pasting chart data within the table</li>
              <li>Paste data from external sources like Excel or CSV files</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
              ✅ Delete (Delete/Backspace)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              When deleting chart column cells, they're cleared to an empty array:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-2">
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400">After delete:</span> []
              </p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              The chart component handles empty arrays gracefully by rendering nothing, keeping your
              table clean and consistent.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Use Cases Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 mt-8 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Common Use Cases
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        <ul className="space-y-4 text-gray-700 dark:text-gray-300">
          <li>
            <strong className="text-gray-800 dark:text-white">E-commerce Analytics:</strong> Display
            monthly sales trends, daily page views, and quarterly revenue comparisons for products.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-white">Server Monitoring:</strong> Visualize
            CPU usage history, memory trends, and network traffic patterns over time.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-white">Financial Dashboards:</strong> Show
            stock price movements, portfolio performance, and quarterly earnings trends.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-white">Marketing Reports:</strong> Track
            campaign performance, conversion rates, and engagement metrics across time periods.
          </li>
          <li>
            <strong className="text-gray-800 dark:text-white">Operational Metrics:</strong> Monitor
            response times, request volumes, and error rates for microservices and APIs.
          </li>
        </ul>
      </motion.div>

      {/* Live Updates Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 mt-8 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Live Updates with Charts
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Chart columns work seamlessly with Simple Table's{" "}
          <a href="/docs/live-updates" className="text-blue-600 dark:text-blue-400 hover:underline">
            live update functionality
          </a>
          . You can update chart data in real-time while maintaining a fixed array length by adding
          new values and removing old ones.
        </p>

        <p className="text-gray-700 dark:text-gray-300 mt-4">
          Check out the{" "}
          <ExampleLink
            href="/examples/infrastructure"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Infrastructure Example
          </ExampleLink>{" "}
          to see live-updating CPU history charts in action.
        </p>
      </motion.div>

      {/* Customization Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 mt-8 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Chart Customization
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.75 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Use the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            chartOptions
          </code>{" "}
          property to customize the appearance and behavior of your chart columns. You can control
          dimensions, colors, scaling, and other visual aspects.
        </p>

        <div className="mt-4 space-y-3">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Available Options</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                min
              </code>{" "}
              - Custom minimum value for chart scaling
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                max
              </code>{" "}
              - Custom maximum value for chart scaling
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                width
              </code>{" "}
              - Custom chart width in pixels (default: 100)
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                height
              </code>{" "}
              - Custom chart height in pixels (default: 30)
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                color
              </code>{" "}
              - Custom chart color (overrides theme color)
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                fillColor
              </code>{" "}
              - Custom fill color for area charts (overrides theme color)
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                fillOpacity
              </code>{" "}
              - Fill opacity for area charts (default: 0.2)
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                strokeWidth
              </code>{" "}
              - Line stroke width (default: 2)
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                gap
              </code>{" "}
              - Gap between bars in bar charts (default: 2)
            </li>
          </ul>
        </div>

        <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">💡 Theme Colors</h4>
          <p className="text-gray-700 dark:text-gray-300">
            Charts use theme-specific colors by default. You can override them with custom colors in{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              chartOptions
            </code>
            . The default theme colors are controlled by{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              --st-chart-color
            </code>{" "}
            and{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              --st-chart-fill-color
            </code>{" "}
            CSS variables.
          </p>
        </div>
      </motion.div>

      {/* Best Practices Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 mt-8 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        Best Practices
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.85 }}
      >
        <ul className="list-disc pl-5 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Keep arrays consistent:</strong> Use the same array length across all rows in a
            chart column for uniform visualization.
          </li>
          <li>
            <strong>Choose appropriate widths:</strong> Set column widths between 120-180px for
            optimal chart visibility without overwhelming the table.
          </li>
          <li>
            <strong>Use tooltips:</strong> Add descriptive tooltips to help users understand what
            the chart data represents.
          </li>
          <li>
            <strong>Center alignment:</strong> Charts typically look best with{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              align: "center"
            </code>
            .
          </li>
          <li>
            <strong>Line charts for trends:</strong> Use lineAreaChart for continuous data where the
            trend matters more than individual points.
          </li>
          <li>
            <strong>Bar charts for comparisons:</strong> Use barChart for discrete periods or
            categories where comparing individual values is important.
          </li>
          <li>
            <strong>Maintain fixed length:</strong> When updating chart data in real-time, keep the
            array length constant by removing old values as you add new ones.
          </li>
        </ul>
      </motion.div>

      {/* API Reference Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 mt-8 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        API Reference
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.95 }}
      >
        <PropTable props={CHART_COLUMN_PROPS} title="Chart Column Properties" />
      </motion.div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <DocNavigationButtons />
      </motion.div>
    </PageWrapper>
  );
};

export default ChartColumnsContent;
