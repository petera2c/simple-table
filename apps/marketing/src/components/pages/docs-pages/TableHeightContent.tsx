"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpDown } from "@fortawesome/free-solid-svg-icons";
import TableHeightDemo from "@/components/demos/TableHeightDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import Link from "next/link";

const TABLE_HEIGHT_PROPS: PropInfo[] = [
  {
    key: "height",
    name: "height",
    required: false,
    description:
      "Sets the height of the table container. When specified, Simple Table handles vertical scrolling internally. When omitted, the table expands to fit all rows and overflows the parent container. Note: If both height and maxHeight are defined, height will be ignored.",
    type: "string | number",
    example: `// Fixed pixel height
<SimpleTable
  height="400px"
  // ... other props
/>

// Viewport-relative height
<SimpleTable
  height="50vh"
  // ... other props
/>

// Percentage (parent must have defined height)
<SimpleTable
  height="100%"
  // ... other props
/>

// No height - table overflows parent
<SimpleTable
  // height prop omitted
  // ... other props
/>`,
  },
  {
    key: "maxHeight",
    name: "maxHeight",
    required: false,
    description:
      "Sets the maximum height of the table container with adaptive behavior. Works the same as height except that it will shrink if there are fewer rows. Enables virtualization while allowing the table to be smaller when content doesn't fill the maximum height. If both height and maxHeight are defined, height will be ignored.",
    type: "string | number",
    example: `// Adaptive height up to 600px
<SimpleTable
  maxHeight="600px"
  // ... other props
/>

// Shrinks with few rows, grows up to 80vh
<SimpleTable
  maxHeight="80vh"
  // ... other props
/>

// Adaptive with percentage
<SimpleTable
  maxHeight="100%"
  // ... other props
/>`,
  },
];

export default function TableHeightContent() {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faUpDown} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Table Height</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        The{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
          height
        </code>{" "}
        and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
          maxHeight
        </code>{" "}
        props control how Simple Table handles vertical overflow. Understanding these props is
        essential for building tables that integrate well with your layout.
      </motion.p>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="table-height"
          height="500px"
          Preview={TableHeightDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        How Height Works
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            height
          </code>{" "}
          and{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            maxHeight
          </code>{" "}
          props are optional and determine how the table handles vertical space:
        </p>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
              With height specified
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              Simple Table creates a scrollable container at the specified height. The header
              remains fixed while the body scrolls. This is ideal when you have many rows and want
              to keep the table contained within a specific area of your layout. The table will
              always be the specified height, even if there are few rows.
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded-r-lg">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
              With maxHeight specified (adaptive height)
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              Works the same as height except that the table will shrink if there are fewer rows.
              This provides adaptive behavior where the table grows up to the maximum height but
              remains compact when displaying less data. Virtualization is still enabled for
              performance. If both height and maxHeight are defined, height will be ignored.
            </p>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-lg">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
              Without height or maxHeight (table overflows parent)
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              When neither prop is specified, the table expands to show all rows and will overflow
              its parent container. This is useful when you want to handle scrolling yourself (e.g.,
              page-level scrolling) or when embedding the table in a container that manages its own
              overflow.
            </p>
          </div>
        </div>

        <PropTable props={TABLE_HEIGHT_PROPS} title="Height Configuration" />

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
            Advanced: customTheme.headerHeight and customTheme.footerHeight
          </h4>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            The{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              customTheme.headerHeight
            </code>{" "}
            and{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              customTheme.footerHeight
            </code>{" "}
            properties are rarely needed and should almost never be used. They are only useful for
            pagination tables with custom footers where the table needs to know the footer height
            before rendering to properly calculate when the body will scroll. In most cases, the
            table handles these calculations automatically. These are passed via the{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              customTheme
            </code>{" "}
            prop. For more details, see the{" "}
            <Link
              href="/docs/custom-theme"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Custom Theme
            </Link>{" "}
            documentation.
          </p>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Common Patterns
      </motion.h2>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Fixed Height Table
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The table has a fixed height and handles its own scrolling.
        </p>
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Adaptive Height Table (maxHeight)
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Use maxHeight when you want the table to shrink with fewer rows but grow up to a maximum
          height. Perfect for tables with variable data amounts.
        </p>
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Viewport-Relative Height
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Use viewport units for responsive heights that adapt to screen size.
        </p>
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Fill Parent Container
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Use percentage height when the parent container has a defined height.
        </p>
      </motion.div>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Parent-Controlled Overflow
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Omit height when you want the parent to handle scrolling.
        </p>
      </motion.div>

      <motion.div
        className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-2">Pro Tip</h3>
        <p className="text-gray-700 dark:text-gray-300">
          For most applications, specifying either{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            height
          </code>{" "}
          or{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            maxHeight
          </code>{" "}
          is recommended. Use{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            height
          </code>{" "}
          for consistent sizing or{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            maxHeight
          </code>{" "}
          for adaptive behavior. Both enable virtualization for large datasets and keep the header
          visible while scrolling through data.
        </p>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
}
