"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPager } from "@fortawesome/free-solid-svg-icons";
import PaginationDemo from "@/components/demos/PaginationDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const PAGINATION_PROPS: PropInfo[] = [
  {
    key: "shouldPaginate",
    name: "shouldPaginate",
    required: false,
    description:
      "Enables pagination functionality for the table. When true, the table will display pagination controls and divide data into pages.",
    type: "boolean",
    example: `<SimpleTable
  shouldPaginate={true}
  // ... other props
/>`,
  },
  {
    key: "rowsPerPage",
    name: "rowsPerPage",
    required: false,
    description: "Number of rows to display per page. Default is 10.",
    type: "number",
    example: `<SimpleTable
  shouldPaginate={true}
  rowsPerPage={20}
  // ... other props
/>`,
  },
  {
    key: "onPageChange",
    name: "onPageChange",
    required: false,
    description:
      "Callback function triggered when page changes, either through user interaction (clicking pagination buttons) or programmatically via tableRef.setPage(). Useful for server-side pagination to fetch data for the new page.",
    type: "(page: number) => void | Promise<void>",
    example: `<SimpleTable
  shouldPaginate={true}
  onPageChange={async (page) => {
    const data = await fetchPageData(page);
    setRows(data);
  }}
  // ... other props
/>`,
  },
  {
    key: "serverSidePagination",
    name: "serverSidePagination",
    required: false,
    description:
      "Flag to disable internal pagination slicing. When true, the table expects you to provide pre-paginated data via the rows prop.",
    type: "boolean",
    example: `<SimpleTable
  shouldPaginate={true}
  serverSidePagination={true}
  // ... other props
/>`,
  },
  {
    key: "totalRowCount",
    name: "totalRowCount",
    required: false,
    description:
      "Total number of rows available on the server (for server-side pagination). Used to calculate total pages.",
    type: "number",
    example: `<SimpleTable
  shouldPaginate={true}
  serverSidePagination={true}
  totalRowCount={1000}
  // ... other props
/>`,
  },
  {
    key: "onNextPage",
    name: "onNextPage",
    required: false,
    description: "Callback function triggered when user clicks the next page button.",
    type: "() => void",
    example: `const [currentPage, setCurrentPage] = useState(1);

<SimpleTable
  shouldPaginate={true}
  onNextPage={() => setCurrentPage(prev => prev + 1)}
  // ... other props
/>`,
  },
  {
    key: "isLoading",
    name: "isLoading",
    required: false,
    description:
      "Display skeleton loaders while fetching page data. Particularly useful with server-side pagination to show loading state during page transitions.",
    type: "boolean",
    example: `const [isLoading, setIsLoading] = useState(false);

<SimpleTable
  shouldPaginate={true}
  isLoading={isLoading}
  onPageChange={async (page) => {
    setIsLoading(true);
    const data = await fetchPageData(page);
    setRows(data);
    setIsLoading(false);
  }}
  // ... other props
/>`,
  },
];

const PaginationContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faPager} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Pagination</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Pagination helps manage large datasets by dividing the table data into manageable pages.
        This improves performance, reduces visual clutter, and provides a better user experience for
        navigating through extensive data collections.
      </motion.p>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="pagination"
          height="400px"
          Preview={PaginationDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Basic Pagination
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To enable pagination in Simple Table, you need to add the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            shouldPaginate
          </code>{" "}
          prop to your SimpleTable component. This will automatically handle pagination of your
          data.
        </p>

        <PropTable props={PAGINATION_PROPS} title="Pagination Configuration" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Pagination Features
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          When pagination is enabled, Simple Table provides:
        </p>
        <ul className="list-disc pl-8 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Automatic page navigation controls</li>
          <li>Page size selection</li>
          <li>Current page indicator</li>
          <li>Total pages display</li>
          <li>
            Smart page number display with first page button - when navigating to far pages, the
            footer shows the first page with ellipsis (e.g., &quot;1 ... 78 79 80&quot;) for quick
            access to the beginning
          </li>
        </ul>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Server-Side Pagination
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          For large datasets, you can implement server-side pagination where data is fetched from
          the server one page at a time. This improves performance by only loading the data needed
          for the current page.
        </p>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To enable server-side pagination, use these props:
        </p>

        <ul className="list-disc pl-8 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li>
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              serverSidePagination={"{true}"}
            </code>{" "}
            - Disables internal pagination slicing
          </li>
          <li>
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              totalRowCount={"{number}"}
            </code>{" "}
            - Total rows available on the server
          </li>
          <li>
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              onPageChange={`(page) => {...}`}
            </code>{" "}
            - Callback to fetch data for the new page
          </li>
        </ul>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">Pro Tip</h4>
          <p className="text-gray-700 dark:text-gray-300">
            When using server-side pagination, make sure to update your{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              rows
            </code>{" "}
            prop with the new page data inside your{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              onPageChange
            </code>{" "}
            callback. The table will display whatever data you provide in the{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              rows
            </code>{" "}
            prop.
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">
            💡 Loading States with Pagination
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            Combine pagination with the{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              isLoading
            </code>{" "}
            prop to show skeleton loaders while fetching new page data. This provides better user
            feedback during page transitions. See the{" "}
            <a
              href="/docs/loading-state"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Loading State
            </a>{" "}
            documentation for more details.
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">Overflow Behavior</h4>
          <p className="text-gray-700 dark:text-gray-300">
            When pagination is enabled without a specified height, the table will automatically
            adjust to show all rows on the current page with visible overflow (no internal
            scrolling). This provides a cleaner user experience for paginated data.
          </p>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        Customizing the Footer
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          While Simple Table provides a default pagination footer, you can completely customize its
          appearance and functionality using the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            footerRenderer
          </code>{" "}
          prop. This allows you to:
        </p>
        <ul className="list-disc pl-8 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li>Match your application&apos;s design system</li>
          <li>Add custom pagination controls and navigation</li>
          <li>Display summary statistics or totals</li>
          <li>Include action buttons or additional functionality</li>
        </ul>

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">
            💡 Advanced Customization
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Learn how to create custom pagination footers with complete control over appearance and
            behavior. Visit the{" "}
            <a
              href="/docs/footer-renderer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Footer Renderer
            </a>{" "}
            documentation for detailed examples and API reference.
          </p>
        </div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default PaginationContent;
