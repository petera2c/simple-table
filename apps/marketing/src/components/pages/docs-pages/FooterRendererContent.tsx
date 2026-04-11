"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFootballBall } from "@fortawesome/free-solid-svg-icons";
import FooterRendererDemo from "@/components/demos/FooterRendererDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { FOOTER_RENDERER_PROPS as FOOTER_RENDERER_PARAMS_PROPS } from "@/constants/propDefinitions";

const FOOTER_RENDERER_PROPS: PropInfo[] = [
  {
    key: "footerRenderer",
    name: "footerRenderer",
    required: false,
    description:
      "Custom function to render the table footer. Receives footer information including pagination state and returns a ReactNode for display. Completely replaces the default footer.",
    type: "(params: FooterRendererProps) => ReactNode",
    example: `<SimpleTable
  footerRenderer={({ currentPage, totalPages, startRow, endRow, totalRows }) => (
    <div>
      Page {currentPage} of {totalPages} 
      (Rows {startRow}-{endRow} of {totalRows})
    </div>
  )}
  // ... other props
/>`,
  },
];

// Note: FOOTER_RENDERER_PARAMS_PROPS is imported from @/constants/propDefinitions

const FooterRendererContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-indigo-100 rounded-lg">
          <FontAwesomeIcon icon={faFootballBall} className="text-indigo-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Footer Renderer</h1>
      </motion.div>

      {/* Demo Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="footer-renderer"
          height="400px"
          Preview={FooterRendererDemo}
        />
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Footer renderers allow you to completely customize the appearance and functionality of the
        table footer. Create custom pagination controls, add summary statistics, or build any footer
        UI that fits your application&apos;s design while maintaining full control over navigation
        and display logic.
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
          The{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            footerRenderer
          </code>{" "}
          prop accepts a function that receives pagination state and navigation handlers, returning
          a custom ReactNode to display in the footer area. This completely replaces the default
          footer.
        </p>

        <PropTable props={FOOTER_RENDERER_PROPS} title="Footer Renderer Configuration" />

        <PropTable props={FOOTER_RENDERER_PARAMS_PROPS} title="FooterRendererProps Interface" />

        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6 mt-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">💡 Pro Tip</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Use the{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              hasPrevPage
            </code>{" "}
            and{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              hasNextPage
            </code>{" "}
            properties to properly disable navigation buttons when users reach the first or last
            page. This provides better UX feedback and prevents unnecessary navigation attempts.
          </p>
        </div>
      </motion.div>

      {/* Use Cases Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Common Use Cases
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Footer renderers are ideal for various scenarios:
        </p>

        <ul className="list-disc pl-5 space-y-3 text-gray-700 dark:text-gray-300 mb-6">
          <li>
            <strong>Custom pagination styles</strong> - Match your application&apos;s design system
            with branded pagination controls
          </li>
          <li>
            <strong>Summary statistics</strong> - Display totals, averages, or other aggregated
            metrics alongside pagination
          </li>
          <li>
            <strong>Row info display</strong> - Show detailed information about visible rows and
            total dataset size
          </li>
          <li>
            <strong>Action buttons</strong> - Add export, refresh, or other bulk action buttons in
            the footer area
          </li>
          <li>
            <strong>Advanced navigation</strong> - Implement jump-to-page inputs, page size
            selectors, or other custom navigation controls
          </li>
        </ul>

        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Important Notes</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>The footer renderer completely replaces the default footer when provided</li>
            <li>Page numbers are 1-based (first page is 1, not 0)</li>
            <li>
              The{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                onNextPage
              </code>{" "}
              function is async and returns a Promise
            </li>
            <li>
              Make sure to handle the{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                hasPrevPage
              </code>{" "}
              and{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
                hasNextPage
              </code>{" "}
              flags to disable navigation when appropriate
            </li>
          </ul>
        </div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default FooterRendererContent;
