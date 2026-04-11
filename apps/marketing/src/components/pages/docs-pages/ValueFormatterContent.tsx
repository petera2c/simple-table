"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import PageWrapper from "@/components/PageWrapper";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PropTable, { type PropInfo } from "@/components/PropTable";
import LivePreview from "@/components/LivePreview";
import ValueFormatterDemo from "@/components/demos/ValueFormatterDemo";
import { VALUE_FORMATTER_PROPS as VALUE_FORMATTER_PARAMS_PROPS } from "@/constants/propDefinitions";

const VALUE_FORMATTER_PROPS: PropInfo[] = [
  {
    key: "valueFormatter",
    name: "HeaderObject.valueFormatter",
    required: false,
    description:
      "Function to format the cell value for display without affecting the underlying data. Returns a string or number that will be displayed in the cell. Useful for currency, dates, percentages, and other formatted text.",
    type: "(props: ValueFormatterProps) => string | number",
    link: "/docs/api-reference#value-formatter-props",
    example: `{
  accessor: "price",
  label: "Price",
  valueFormatter: ({ value }) => {
    return \`$\${(value as number).toFixed(2)}\`;
  }
}`,
  },
  {
    key: "useFormattedValueForClipboard",
    name: "HeaderObject.useFormattedValueForClipboard",
    required: false,
    description:
      "When true, cells copy the formatted value (with symbols, formatting) when users press Ctrl+C/Cmd+C. Defaults to true when valueFormatter exists (v1.8.6+), or false if no valueFormatter. Useful for copying currency with $ symbols, percentages with %, or formatted dates.",
    type: "boolean",
    example: `{
  accessor: "salary",
  label: "Salary",
  valueFormatter: ({ value }) => \`$\${value.toLocaleString()}\`,
  // useFormattedValueForClipboard: true  // Defaults to true since v1.8.6
  // Set to false to override: useFormattedValueForClipboard: false
}`,
  },
  {
    key: "useFormattedValueForCSV",
    name: "HeaderObject.useFormattedValueForCSV",
    required: false,
    description:
      "When true, CSV exports use the formatted value from valueFormatter instead of raw data. Defaults to true when valueFormatter exists (v1.8.6+), or false if no valueFormatter. Perfect for human-readable reports and spreadsheets. Note: exportValueGetter takes precedence if provided.",
    type: "boolean",
    example: `{
  accessor: "completionRate",
  label: "Completion Rate",
  valueFormatter: ({ value }) => \`\${(value * 100).toFixed(1)}%\`,
  // useFormattedValueForCSV: true  // Defaults to true since v1.8.6
  // Set to false to override: useFormattedValueForCSV: false
}`,
  },
  {
    key: "exportValueGetter",
    name: "HeaderObject.exportValueGetter",
    required: false,
    description:
      "Custom function to provide completely different values for CSV export. Takes precedence over useFormattedValueForCSV. Useful for adding codes, identifiers, or transforming data specifically for spreadsheet compatibility.",
    type: "(props: ExportValueProps) => string | number",
    link: "/docs/api-reference#export-value-props",
    example: `{
  accessor: "department",
  label: "Department",
  valueFormatter: ({ value }) => capitalize(value),
  exportValueGetter: ({ value }) => {
    const codes = { engineering: "ENG", sales: "SLS" };
    return \`\${capitalize(value)} (\${codes[value]})\`;
  }  // CSV exports: "Engineering (ENG)"
}`,
  },
];

const ValueFormatterContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faCode} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Value Formatter</h1>
      </motion.div>

      {/* Demo Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="value-formatter"
          height="400px"
          Preview={ValueFormatterDemo}
        />
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Value formatters provide a simple way to format cell values for display without changing the
        underlying data. Use them for currency, dates, percentages, and other formatted text. For
        complex rendering with React components, use{" "}
        <a href="/docs/cell-renderer" className="text-blue-600 hover:underline">
          cellRenderer
        </a>{" "}
        instead.
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
          Each column in your table can have its own{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            valueFormatter
          </code>{" "}
          function. This function receives information about the cell and returns a formatted string
          or number for display.
        </p>

        <PropTable props={VALUE_FORMATTER_PROPS} title="Value Formatter Configuration" />

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-6">
          Value Formatter Parameters
        </h3>

        <PropTable props={VALUE_FORMATTER_PARAMS_PROPS} title="ValueFormatterProps Interface" />

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">💡 Pro Tip</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Use{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              valueFormatter
            </code>{" "}
            for simple text formatting (currency, dates, percentages). Use{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              cellRenderer
            </code>{" "}
            when you need React components, custom styling, or interactive elements.
          </p>
        </div>
      </motion.div>

      {/* Common Use Cases */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Common Use Cases
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Currency Formatting
        </h3>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Format numeric values as currency with proper locale formatting.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8">
          Date Formatting
        </h3>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Format date strings or timestamps into readable dates.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8">
          Percentage Formatting
        </h3>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Display decimal values as percentages.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8">
          Conditional Formatting
        </h3>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Format values differently based on conditions.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8">
          Using Multiple Row Values
        </h3>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Access other column values from the same row for combined formatting.
        </p>
      </motion.div>

      {/* Clipboard and CSV Formatting */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Clipboard and CSV Formatting
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.75 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Control how formatted values are copied to clipboard and exported to CSV files. Starting
          in v1.8.6, both{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            useFormattedValueForClipboard
          </code>{" "}
          and{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            useFormattedValueForCSV
          </code>{" "}
          default to{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            true
          </code>{" "}
          when a{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            valueFormatter
          </code>{" "}
          exists, reducing boilerplate code.
        </p>

        <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">
            ✨ Auto-Default Behavior (v1.8.6+)
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            When you define a{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              valueFormatter
            </code>
            , formatted values are automatically used for clipboard copy and CSV exports. You no
            longer need to explicitly set these flags to{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              true
            </code>
            !
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            <strong>To use raw values:</strong> Explicitly set{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              useFormattedValueForClipboard: false
            </code>{" "}
            or{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              useFormattedValueForCSV: false
            </code>
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Formatted Clipboard Copy
        </h3>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          With a{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            valueFormatter
          </code>
          , formatted values are automatically copied when users press Ctrl+C or Cmd+C.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8">
          CSV Export Formatting
        </h3>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Control CSV export values with two options:
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-4 rounded-lg">
            <h4 className="font-bold text-gray-800 dark:text-white mb-2">
              Option 1: Automatic Formatting (v1.8.6+)
            </h4>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              When a valueFormatter is defined, CSV exports automatically use the formatted value.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-4 rounded-lg">
            <h4 className="font-bold text-gray-800 dark:text-white mb-2">
              Option 2: exportValueGetter (Higher Priority)
            </h4>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Provide completely custom values for CSV export.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg shadow-sm">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">Priority System</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Clipboard:</strong> useFormattedValueForClipboard + valueFormatter → Chart
              formatting (comma-separated) → Raw value
            </li>
            <li>
              <strong>CSV Export:</strong> exportValueGetter → useFormattedValueForCSV +
              valueFormatter → Raw value
            </li>
          </ul>
        </div>
      </motion.div>

      {/* When to Use Value Formatter vs Cell Renderer */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        When to Use Value Formatter vs Cell Renderer
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.85 }}
      >
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
            <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400">✓</span>
              Use valueFormatter for:
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Currency formatting ($1,234.56)</li>
              <li>Date formatting (Dec 25, 2024)</li>
              <li>Percentage display (15.5%)</li>
              <li>Number formatting (1,000,000)</li>
              <li>Simple text transformations</li>
              <li>Concatenating values from the same row</li>
              <li>Better performance for simple formatting</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg">
            <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">→</span>
              Use cellRenderer for:
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>React components (badges, buttons, icons)</li>
              <li>Custom styling and colors</li>
              <li>Interactive elements (clicks, hovers)</li>
              <li>Complex layouts (flexbox, grids)</li>
              <li>Images and media</li>
              <li>Progress bars, charts, visualizations</li>
              <li>Array or object data rendering</li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Important Notes</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                valueFormatter
              </code>{" "}
              only affects display - the underlying data remains unchanged
            </li>
            <li>
              If both{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                valueFormatter
              </code>{" "}
              and{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                cellRenderer
              </code>{" "}
              are provided,{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                cellRenderer
              </code>{" "}
              takes precedence
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                valueFormatter
              </code>{" "}
              is more performant for simple text formatting
            </li>
            <li>Return values must be strings or numbers, not React components</li>
          </ul>
        </div>
      </motion.div>

      {/* Examples Comparison */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        Examples Comparison
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.95 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Here's the same formatting task using both approaches:
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          Both approaches display the same text, but{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            cellRenderer
          </code>{" "}
          allows for custom styling and React components at the cost of slightly more complexity.
        </p>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ValueFormatterContent;
