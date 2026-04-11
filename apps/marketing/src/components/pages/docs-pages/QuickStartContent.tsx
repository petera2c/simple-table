"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import QuickStartDemo from "@/components/demos/QuickStartDemo";
import PageWrapper from "@/components/PageWrapper";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import { UI_STRINGS } from "@/constants/strings/ui";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const TABLE_PROPS: PropInfo[] = [
  {
    key: "defaultHeaders",
    name: "defaultHeaders",
    required: true,
    description: "Array of column definitions that specify the structure of your table.",
    type: "HeaderObject[]",
    link: "/docs/api-reference#header-object",
    example: `const headers = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: "1fr", type: "string" }
];`,
  },
  {
    key: "rows",
    name: "rows",
    required: true,
    description: "Array of data objects to display in the table. Each object represents a row.",
    type: "Row[]",
    link: "/docs/api-reference#union-types",
    example: `const data = [
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Smith", age: 25 }
];`,
  },
  {
    key: "getRowId",
    name: "getRowId",
    required: false,
    description:
      "Optional but recommended: Function to generate unique identifiers for each row. Receives detailed context (row, depth, index, paths). Enables stable row identification across sorting and filtering. Highly recommended for tables with row grouping, external sorting, or dynamic data updates.",
    type: "(params: GetRowIdParams) => string | number",
    link: "/docs/api-reference#simple-table-props",
    example: `getRowId={({ row }) => row.id as string}
getRowId={({ row }) => row.uuid as string}`,
  },
  {
    key: "height",
    name: "height",
    required: false,
    description:
      "Height of the table container. When specified, Simple Table handles vertical scrolling internally with a fixed header. When omitted, the table expands to fit all rows and overflows the parent container. Most applications should specify a height.",
    type: "string",
    link: "/docs/table-height",
    example: `height="400px"
height="50vh"
height="100%"`,
  },
  {
    key: "customTheme",
    name: "customTheme",
    required: false,
    description:
      "Custom theme configuration for dimensions and spacing. Only specify the properties you want to customize.",
    type: "CustomTheme",
    link: "/docs/custom-theme",
    example: `customTheme={{
  rowHeight: 32,
  headerHeight: 32,
}}`,
  },
  {
    key: "editColumns",
    name: "editColumns",
    required: false,
    description: "Enable column reordering by drag and drop.",
    type: "boolean",
    example: `editColumns={true}`,
  },
  {
    key: "selectableCells",
    name: "selectableCells",
    required: false,
    description: "Enable cell selection functionality.",
    type: "boolean",
    example: `selectableCells={true}`,
  },
  {
    key: "theme",
    name: "theme",
    required: false,
    description: "Custom theme object to override default styling.",
    type: "Theme",
    link: "/docs/api-reference#union-types",
    example: `theme={{
  primaryColor: "#3b82f6",
  backgroundColor: "#ffffff"
}}`,
  },
];

const QuickStartContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faRocket} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Quick Start</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        This guide will help you quickly set up Simple Table in your project. In just a few minutes,
        you'll have a fully functional data table.
      </motion.p>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="quick-start"
          height="400px"
          Preview={QuickStartDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        SimpleTable Props
      </motion.h2>

      <PropTable props={TABLE_PROPS} title="Main Component Props" />

      <motion.div
        className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-xl">🔑</span> Understanding Accessor and Data Format
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          The{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            accessor
          </code>{" "}
          property in your column definitions creates a direct link between your data and what
          displays in each column. Here&apos;s how it works:
        </p>

        <div className="mb-3">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
            How Accessor Maps to Data
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Each{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              accessor
            </code>{" "}
            value must match a property name in your data objects:
          </p>
        </div>

        <div className="mb-3">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Expected Data Format</h4>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-2">
            <li>
              <strong>Data must be an array of objects</strong> - Each object represents one row
            </li>
            <li>
              <strong>Property names must match accessors exactly</strong> - Case-sensitive and must
              be valid JavaScript property names
            </li>
            <li>
              <strong>All rows should have the same structure</strong> - While missing properties
              won&apos;t break the table, they&apos;ll display as empty cells
            </li>
            <li>
              <strong>Nested properties are supported</strong> - Use dot notation like{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                &quot;user.name&quot;
              </code>{" "}
              or{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                &quot;address.city&quot;
              </code>
            </li>
          </ul>
        </div>

        <div className="mb-3">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
            Example with Nested Data
          </h4>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-700">
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            <strong>💡 Pro Tip:</strong> The{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              label
            </code>{" "}
            property in your column definition is what users see in the header, while{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              accessor
            </code>{" "}
            is the technical property name used to retrieve data. They can be completely different!
          </p>
        </div>
      </motion.div>

      <motion.div
        className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-2">
          Understanding the Height Prop
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          The{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            height
          </code>{" "}
          and{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            maxHeight
          </code>{" "}
          props determine how Simple Table handles vertical scrolling:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 mb-2">
          <li>
            <strong>With height:</strong> The table has a fixed height and handles scrolling
            internally. The header stays visible while scrolling through rows.
          </li>
          <li>
            <strong>With maxHeight:</strong> Works like height, but the table shrinks if there are
            fewer rows. Great for adaptive layouts.
          </li>
          <li>
            <strong>Without height:</strong> The table expands to show all rows and overflows its
            parent container. Use this when you want the parent or page to handle scrolling.
          </li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300">
          For most applications, specifying a height or maxHeight is recommended. Learn more in the{" "}
          <a href="/docs/table-height" className="text-blue-600 dark:text-blue-400 hover:underline">
            Table Height documentation
          </a>
          .
        </p>
      </motion.div>

      <motion.div
        className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-2">
          🔑 Optional but Recommended: getRowId
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          While not required, providing a{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            getRowId
          </code>{" "}
          function helps optimize your table by enabling stable row identification:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 mb-2">
          <li>
            <strong>What it does:</strong> Function that returns a unique identifier from your row
            data (like{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              row.id
            </code>{" "}
            or{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              row.uuid
            </code>
            )
          </li>
          <li>
            <strong>When to use:</strong> Especially important for tables with sorting, filtering,
            row grouping, or frequently changing data
          </li>
          <li>
            <strong>Benefits:</strong> Maintains row state (like expansion) across data updates and
            improves performance
          </li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300">
          Example:{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            {"getRowId={({ row }) => row.id as string}"}
          </code>
        </p>
      </motion.div>

      <motion.div
        className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-2">Auto-Expanding Columns</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          By default, Simple Table uses the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            width
          </code>{" "}
          values you specify for each column. For tables that should always fill their container
          width, use the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            autoExpandColumns
          </code>{" "}
          prop:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 mb-2">
          <li>
            All column widths are automatically scaled proportionally to fill the table container
          </li>
          <li>Your width values serve as the basis for proportional distribution</li>
          <li>Perfect for responsive tables that adapt to different screen sizes</li>
          <li>
            <strong>Recommended:</strong> Disable on mobile devices (&lt; 768px) for better UX
          </li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300">
          Learn more in the{" "}
          <a href="/docs/column-width" className="text-blue-600 dark:text-blue-400 hover:underline">
            Column Width documentation
          </a>
          .
        </p>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {UI_STRINGS.docs.cssSetup.title}
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {UI_STRINGS.docs.cssSetup.description}
        </p>

        <p className="text-gray-700 dark:text-gray-300">{UI_STRINGS.docs.cssSetup.note}</p>
      </motion.div>

      <motion.div
        className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-2">Pro Tip</h3>
        <p className="text-gray-700 dark:text-gray-300">
          Simple Table automatically handles the styling of alternating rows, borders, and hover
          states. You can customize these later with themes, but the defaults look great out of the
          box!
        </p>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default QuickStartContent;
