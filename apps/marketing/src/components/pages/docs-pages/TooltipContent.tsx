"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import TooltipDemo from "@/components/demos/TooltipDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const TOOLTIP_PROPS: PropInfo[] = [
  {
    key: "tooltip",
    name: "HeaderObject.tooltip",
    required: false,
    description:
      "Tooltip text that appears when hovering over the column header. Provides helpful context about the column's purpose or data.",
    type: "string",
    example: `{ 
  accessor: "price", 
  label: "Price", 
  tooltip: "Current retail price in USD" 
}`,
  },
];

const TooltipContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faCommentAlt} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tooltips</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Tooltips provide helpful context when users hover over column headers. They're perfect for
        explaining data types, units, or providing additional information about what each column
        represents.
      </motion.p>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="tooltip"
          height="400px"
          Preview={TooltipDemo}
        />
      </motion.div>

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
          To add a tooltip to a column header, simply include the{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
            tooltip
          </code>{" "}
          property in your column definition. The tooltip will appear when users hover over the
          column header.
        </p>

        <PropTable props={TOOLTIP_PROPS} title="Tooltip Configuration" />
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default TooltipContent;
