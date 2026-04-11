"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import LoadingStateDemo from "@/components/demos/LoadingStateDemo";

const LOADING_STATE_PROPS: PropInfo[] = [
  {
    key: "isLoading",
    name: "isLoading",
    required: false,
    description:
      "When set to true, all table cells will render skeleton loaders instead of actual data. This provides visual feedback to users while data is being fetched.",
    type: "boolean",
    example: `const [isLoading, setIsLoading] = useState(true);

<SimpleTable
  isLoading={isLoading}
  rows={data}
  // ... other props
/>`,
  },
];

const LoadingStateContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-indigo-100 rounded-lg">
          <FontAwesomeIcon icon={faSpinner} className="text-indigo-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Loading State</h1>
      </motion.div>

      {/* Demo Section */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="loading-state"
          height="450px"
          Preview={LoadingStateDemo}
        />
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Simple Table provides a built-in loading state that displays skeleton loaders for all cells
        while your data is being fetched. This gives users immediate visual feedback and improves
        the perceived performance of your application.
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
          To enable the loading state, simply pass the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            isLoading
          </code>{" "}
          prop and set it to{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            true
          </code>{" "}
          while your data is loading. When the data arrives, set it back to{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            false
          </code>
          .
        </p>

        <PropTable props={LOADING_STATE_PROPS} title="Loading State Configuration" />
      </motion.div>

      {/* Customization Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Customizing the Loading Skeleton
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          You can customize the appearance of the loading skeleton using CSS. The skeleton elements
          have the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            st-loading-skeleton
          </code>{" "}
          class which you can target in your CSS.
        </p>

        <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">
            CSS Variable for Customization
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            You can customize the skeleton background color using the CSS variable:
          </p>
          <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm text-gray-800 dark:text-gray-200">
            --st-loading-skeleton-bg-color
          </code>
          <p className="text-gray-700 dark:text-gray-300 mt-3 mb-3">
            Or target the skeleton elements directly using the{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              st-loading-skeleton
            </code>{" "}
            class:
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 rounded-lg shadow-sm">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">💡 Pro Tip</h4>
          <p className="text-gray-700 dark:text-gray-300">
            Combine the loading state with server-side pagination or infinite scroll to provide
            feedback during data fetches. See the{" "}
            <a
              href="/docs/pagination"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Pagination
            </a>{" "}
            documentation for an example of using{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
              isLoading
            </code>{" "}
            with page changes.
          </p>
        </div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default LoadingStateContent;
