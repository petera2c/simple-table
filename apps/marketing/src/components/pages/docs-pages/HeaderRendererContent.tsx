"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush } from "@fortawesome/free-solid-svg-icons";
import HeaderRendererDemo from "@/components/demos/HeaderRendererDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const HEADER_RENDERER_PROPS: PropInfo[] = [
  {
    key: "headerRenderer",
    name: "HeaderObject.headerRenderer",
    required: false,
    description:
      "Custom function to render header content. Receives header information and returns either a ReactNode or string for display.",
    type: "(params: HeaderRendererParams) => ReactNode | string",
    example: `{
  accessor: "status",
  label: "Status",
  headerRenderer: ({ header, accessor }) => {
    return (
      <div style={{ 
        backgroundColor: '#4f46e5', 
        color: 'white', 
        padding: '8px',
        borderRadius: '4px' 
      }}>
        🌟 {header.label}
      </div>
    );
  }
}`,
  },
];

const HEADER_RENDERER_PARAMS_PROPS: PropInfo[] = [
  {
    key: "accessor",
    name: "accessor",
    required: true,
    description: "The column accessor string identifying which column this header belongs to.",
    type: "Accessor",
    link: "/docs/api-reference#union-types",
    example: `// In headerRenderer function
({ accessor }) => {
  console.log(accessor); // "firstName", "salary", etc.
}`,
  },
  {
    key: "colIndex",
    name: "colIndex",
    required: true,
    description: "The zero-based index of the column within the table.",
    type: "number",
    example: `// In headerRenderer function
({ colIndex }) => {
  console.log(colIndex); // 0, 1, 2, etc.
}`,
  },
  {
    key: "header",
    name: "header",
    required: true,
    description:
      "The complete HeaderObject containing all configuration for this column including label, width, and other properties.",
    type: "HeaderObject",
    link: "/docs/api-reference#header-object",
    example: `// In headerRenderer function
({ header }) => {
  console.log(header.label); // "Name", "Status", etc.
  console.log(header.width); // 150, "1fr", etc.
  return <div>{header.label}</div>;
}`,
  },
  {
    key: "components",
    name: "components",
    required: false,
    description:
      "Object containing pre-rendered header components (sortIcon, filterIcon, collapseIcon, labelContent) that can be positioned anywhere in your custom header renderer. This gives you complete control over the layout and order of header elements.",
    type: "HeaderRendererComponents",
    link: "/docs/api-reference#header-renderer-props",
    example: `// Reorder icons - put label first, then sort, then filter
headerRenderer: ({ components }) => (
  <>
    {components?.labelContent}
    {components?.sortIcon}
    {components?.filterIcon}
  </>
)

// Custom layout with flexbox
headerRenderer: ({ components }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <span>{components?.labelContent}</span>
    <div style={{ display: 'flex', gap: '4px' }}>
      {components?.filterIcon}
      {components?.sortIcon}
      {components?.collapseIcon}
    </div>
  </div>
)`,
  },
];

const HeaderRendererContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-purple-100 rounded-lg">
          <FontAwesomeIcon icon={faPaintBrush} className="text-purple-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Header Renderer</h1>
      </motion.div>

      {/* Demo Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="header-renderer"
          height="400px"
          Preview={HeaderRendererDemo}
        />
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Header renderers allow you to completely customize how column headers appear and behave in
        your table. Create clean, modern headers with subtle styling, custom onClick handlers, and
        interactive elements while maintaining a professional appearance that integrates seamlessly
        with your design.
      </motion.p>

      <motion.div
        className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 rounded-lg shadow-sm mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-2">💡 Need to Hide Headers?</h3>
        <p className="text-gray-700 dark:text-gray-300">
          If you want to hide the entire header row instead of customizing it, use the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            hideHeader
          </code>{" "}
          prop on the SimpleTable component. This is useful for creating cleaner data displays or
          implementing custom header implementations outside the table. See the{" "}
          <a
            href="/docs/api-reference"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            API Reference
          </a>{" "}
          for more details.
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
            headerRenderer
          </code>{" "}
          function. This function receives information about the header and returns either a
          ReactNode or a string to be rendered in the header cell.
        </p>

        <PropTable props={HEADER_RENDERER_PROPS} title="Header Renderer Configuration" />

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-6">
          Header Renderer Parameters
        </h3>

        <PropTable props={HEADER_RENDERER_PARAMS_PROPS} title="HeaderRendererParams Interface" />

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">💡 Pro Tip</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Use the{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              header
            </code>{" "}
            parameter to access all column configuration properties, including label, width,
            sortable status, and more. This allows you to create dynamic headers that adapt based on
            column settings.
          </p>
        </div>
      </motion.div>

      {/* Components Control Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Component Control (v2.0.7+)
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
            components
          </code>{" "}
          prop gives you complete control over the positioning of header elements. Instead of
          building everything from scratch, you can use the pre-rendered components and arrange them
          however you like.
        </p>

        <div className="bg-purple-50 dark:bg-purple-900/30 border-l-4 border-purple-400 dark:border-purple-700 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">🎨 Available Components</h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                sortIcon
              </code>{" "}
              - The sort indicator icon (when column is sortable)
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                filterIcon
              </code>{" "}
              - The filter icon (when column is filterable)
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                collapseIcon
              </code>{" "}
              - The collapse/expand icon (for collapsible columns)
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                labelContent
              </code>{" "}
              - The column label text
            </li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-6">
          Example: Custom Icon Positioning
        </h3>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Here's how you can reorder the header elements to put the label first, followed by the
          sort and filter icons:
        </p>


        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-6">
          Example: Custom Layout with Flexbox
        </h3>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          You can also create more complex layouts using CSS:
        </p>


        <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">✨ Why Use Components?</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Using the{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              components
            </code>{" "}
            prop has several advantages:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
            <li>All built-in functionality (sorting, filtering) works automatically</li>
            <li>Icons respect the table theme and styling</li>
            <li>No need to reimplement click handlers or state management</li>
            <li>Easy to reposition elements without losing functionality</li>
          </ul>
        </div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default HeaderRendererContent;
