"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import ProgrammaticControlDemo from "@/components/demos/ProgrammaticControlDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable from "@/components/PropTable";
import { TABLE_REF_TYPE_METHODS } from "@/constants/propDefinitions";

const ProgrammaticControlContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-indigo-100 rounded-lg">
          <FontAwesomeIcon icon={faCode} className="text-indigo-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Programmatic Control API
        </h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Take full control of your table with the programmatic API. Using{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
          tableRef
        </code>
        , you can read and modify table state, apply filters and sorting, access data, and much more
        - all from your code. Perfect for building custom controls, implementing save/restore
        functionality, or creating advanced data workflows.
      </motion.p>

      {/* Demo Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="programmatic-control"
          demoHeight={400}
          height={520}
          Preview={ProgrammaticControlDemo}
        />
      </motion.div>

      {/* API Methods Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        API Methods
      </motion.h2>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        The following methods are available on the{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
          tableRef
        </code>{" "}
        for programmatic control of the table.
      </motion.p>

      {/* Data Manipulation Methods */}
      <PropTable
        props={TABLE_REF_TYPE_METHODS.filter((method) =>
          ["updateData", "setHeaderRename"].includes(method.key),
        ).map((method) => ({
          ...method,
          link: method.link ? `/docs/api-reference${method.link}` : undefined,
        }))}
        title="Data Manipulation Methods"
      />

      {/* Data Access Methods */}
      <PropTable
        props={TABLE_REF_TYPE_METHODS.filter((method) =>
          ["getVisibleRows", "getAllRows", "getHeaders"].includes(method.key),
        ).map((method) => ({
          ...method,
          link: method.link ? `/docs/api-reference${method.link}` : undefined,
        }))}
        title="Data Access Methods"
      />

      {/* Export Methods */}
      <PropTable
        props={TABLE_REF_TYPE_METHODS.filter((method) => ["exportToCSV"].includes(method.key)).map(
          (method) => ({
            ...method,
            link: method.link ? `/docs/api-reference${method.link}` : undefined,
          }),
        )}
        title="Export Methods"
      />

      {/* Sorting, Filtering, and Pagination Methods */}
      <PropTable
        props={TABLE_REF_TYPE_METHODS.filter((method) =>
          [
            "getSortState",
            "applySortState",
            "getFilterState",
            "applyFilter",
            "clearFilter",
            "clearAllFilters",
            "setQuickFilter",
            "getCurrentPage",
            "setPage",
          ].includes(method.key),
        ).map((method) => ({
          ...method,
          link: method.link ? `/docs/api-reference${method.link}` : undefined,
        }))}
        title="Sorting, Filtering, and Pagination Methods"
      />

      <PropTable
        props={TABLE_REF_TYPE_METHODS.filter((method) =>
          [
            "toggleColumnEditor",
            "applyColumnVisibility",
            "getPinnedState",
            "applyPinnedState",
          ].includes(method.key),
        ).map((method) => ({
          ...method,
          link: method.link ? `/docs/api-reference${method.link}` : undefined,
        }))}
        title="Column editor and pin layout"
      />

      {/* Row Grouping Control Methods */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-6">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">
            🎉 New in v2.1.0: Row Grouping Control
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            Programmatically control row grouping expansion with depth-based methods. Perfect for
            implementing custom expand/collapse controls, saving expansion state, or creating
            progressive disclosure patterns.
          </p>
        </div>

        <PropTable
          props={TABLE_REF_TYPE_METHODS.filter((method) =>
            [
              "expandAll",
              "collapseAll",
              "expandDepth",
              "collapseDepth",
              "toggleDepth",
              "setExpandedDepths",
              "getExpandedDepths",
              "getGroupingProperty",
              "getGroupingDepth",
            ].includes(method.key),
          ).map((method) => ({
            ...method,
            link: method.link ? `/docs/api-reference${method.link}` : undefined,
          }))}
          title="Row Grouping Control Methods (v2.1.0)"
        />
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ProgrammaticControlContent;
