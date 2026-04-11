"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import CellRendererDemo from "@/components/demos/CellRendererDemo";
import PageWrapper from "@/components/PageWrapper";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { CELL_RENDERER_PROPS as CELL_RENDERER_PARAMS_PROPS } from "@/constants/propDefinitions";

const CELL_RENDERER_PROPS: PropInfo[] = [
  {
    key: "cellRenderer",
    name: "HeaderObject.cellRenderer",
    required: false,
    description:
      "Custom function to render cell content with React components. Receives cell information and returns either a ReactNode or string for display. For simple text formatting (currency, dates, percentages), use valueFormatter instead for better performance.",
    type: "(params: CellRendererParams) => ReactNode | string",
    example: `{
  accessor: "status",
  label: "Status",
  cellRenderer: ({ row, accessor }) => {
    const status = row[accessor];
    return (
      <span className={\`badge \${status === 'active' ? 'badge-green' : 'badge-red'}\`}>
        {status}
      </span>
    );
  }
}`,
  },
];

// Note: CELL_RENDERER_PARAMS_PROPS is imported from @/constants/propDefinitions
// and contains: accessor, colIndex, row, theme, value, formattedValue

const CellRendererContent = () => {
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Cell Renderer</h1>
      </motion.div>

      {/* Demo Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="cell-renderer"
          height="400px"
          Preview={CellRendererDemo}
        />
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Cell renderers give you complete control over how data is displayed in your table cells.
        Using custom renderers, you can create rich, interactive elements like buttons, badges,
        progress bars, and more. With the expanded CellValue type supporting arrays and objects, you
        can now render complex data structures like tag lists, team member arrays, and nested object
        data.
      </motion.p>

      <motion.div
        className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-2">💡 When to Use</h3>
        <p className="text-gray-700 dark:text-gray-300">
          For simple text formatting (currency, dates, percentages), consider using{" "}
          <a
            href="/docs/value-formatter"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            valueFormatter
          </a>{" "}
          instead. It's more performant and easier to implement. Use{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            cellRenderer
          </code>{" "}
          when you need React components, custom styling, or interactive elements.
        </p>
      </motion.div>

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
            cellRenderer
          </code>{" "}
          function. This function receives information about the cell and returns either a ReactNode
          or a string to be rendered in the cell.
        </p>

        <PropTable props={CELL_RENDERER_PROPS} title="Cell Renderer Configuration" />

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-6">
          Cell Renderer Parameters
        </h3>

        <PropTable props={CELL_RENDERER_PARAMS_PROPS} title="CellRendererParams Interface" />

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">💡 Pro Tips</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              Use{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                value
              </code>{" "}
              for quick access to the current cell's raw value (same as{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                row[accessor]
              </code>
              )
            </li>
            <li>
              Use{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                formattedValue
              </code>{" "}
              to access the valueFormatter output if one is defined, making it easy to wrap
              formatted text in custom components
            </li>
            <li>
              Use{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                row
              </code>{" "}
              to access any data from the current row, not just the current cell - perfect for
              renderers that depend on multiple column values
            </li>
            <li>
              <span className="text-green-600 dark:text-green-400 font-semibold">
                New in v1.9.7:
              </span>{" "}
              Use{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                rowPath
              </code>{" "}
              to access the path through nested data structures (e.g., [0, "teams", 1] for
              rows[0].teams[1])
            </li>
            <li>
              <span className="text-green-600 dark:text-green-400 font-semibold">
                New in v1.9.7:
              </span>{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                formattedValue
              </code>{" "}
              now supports string[], number[], and boolean types for more flexible formatting
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Row Object Structure */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Row Object Structure
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            row
          </code>{" "}
          parameter passed to your cell renderer is a flat object containing all the row's data:
        </p>


        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To access a specific cell value, use{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            row[accessor]
          </code>{" "}
          directly. The row object is flat and contains all the data for that row.
        </p>
      </motion.div>

      {/* Return Types */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Return Types
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Your{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            cellRenderer
          </code>{" "}
          function should return one of the following:
        </p>

        <ul className="list-disc pl-5 mt-2 space-y-3 text-gray-700 dark:text-gray-300 mb-6">
          <li>
            <strong>String</strong>: A simple text value to display in the cell
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
              <code className="text-gray-800 dark:text-gray-200">return "Hello, world!";</code>
            </div>
          </li>
          <li>
            <strong>ReactNode</strong>: A React component for custom rendering
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
              <code className="text-gray-800 dark:text-gray-200">
                return &lt;div className="flex items-center"&gt;&lt;span
                className="mr-2"&gt;⭐&lt;/span&gt; Custom Content&lt;/div&gt;;
              </code>
            </div>
          </li>
        </ul>

        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Important Notes</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Each column can have its own unique renderer</li>
            <li>Columns without a cellRenderer will display their values as plain text</li>
            <li>Avoid expensive operations in cell renderers as they run frequently</li>
            <li>Consider memoizing complex components to improve performance</li>
            <li>
              For simple text formatting, use{" "}
              <a
                href="/docs/value-formatter"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                valueFormatter
              </a>{" "}
              instead for better performance
            </li>
          </ul>
        </div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default CellRendererContent;
