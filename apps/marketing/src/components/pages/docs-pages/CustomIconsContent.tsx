"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIcons } from "@fortawesome/free-solid-svg-icons";
import CustomIconsDemo from "@/components/demos/CustomIconsDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";

const CUSTOM_ICON_PROPS: PropInfo[] = [
  {
    key: "icons",
    name: "icons",
    required: false,
    description:
      "Unified object for configuring all table icons. Provides a cleaner, more organized API for icon customization.",
    type: "IconsConfig",
    example: `import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCaretUp, 
  faCaretDown, 
  faFilter,
  faChevronRight,
  faChevronDown,
  faAngleLeft,
  faAngleRight,
  faGripVertical,
  faThumbtack
} from "@fortawesome/free-solid-svg-icons";

<SimpleTable
  icons={{
    sortUp: <FontAwesomeIcon icon={faCaretUp} />,
    sortDown: <FontAwesomeIcon icon={faCaretDown} />,
    filter: <FontAwesomeIcon icon={faFilter} />,
    expand: <FontAwesomeIcon icon={faChevronRight} />,
    headerExpand: <FontAwesomeIcon icon={faChevronRight} />,
    headerCollapse: <FontAwesomeIcon icon={faChevronDown} />,
    prev: <FontAwesomeIcon icon={faAngleLeft} />,
    next: <FontAwesomeIcon icon={faAngleRight} />,
    drag: <FontAwesomeIcon icon={faGripVertical} />,
    pinnedLeftIcon: <FontAwesomeIcon icon={faThumbtack} />,
    pinnedRightIcon: <FontAwesomeIcon icon={faThumbtack} />,
  }}
  // ... other props
/>`,
  },
  {
    key: "icons.sortUp",
    name: "icons.sortUp",
    required: false,
    description: "Custom icon component for ascending sort indicator in column headers.",
    type: "React.ReactNode",
    example: `icons={{ sortUp: <FontAwesomeIcon icon={faCaretUp} /> }}`,
  },
  {
    key: "icons.sortDown",
    name: "icons.sortDown",
    required: false,
    description: "Custom icon component for descending sort indicator in column headers.",
    type: "React.ReactNode",
    example: `icons={{ sortDown: <FontAwesomeIcon icon={faCaretDown} /> }}`,
  },
  {
    key: "icons.filter",
    name: "icons.filter",
    required: false,
    description: "Custom icon component for the column filter button in filterable columns.",
    type: "React.ReactNode",
    example: `icons={{ filter: <FontAwesomeIcon icon={faFilter} /> }}`,
  },
  {
    key: "icons.expand",
    name: "icons.expand",
    required: false,
    description: "Custom icon component for collapsed row groups in hierarchical data display.",
    type: "React.ReactNode",
    example: `icons={{ expand: <FontAwesomeIcon icon={faChevronRight} /> }}`,
  },
  {
    key: "icons.headerExpand",
    name: "icons.headerExpand",
    required: false,
    description: "Custom icon component for the expand state of collapsible column headers.",
    type: "React.ReactNode",
    example: `icons={{ headerExpand: <FontAwesomeIcon icon={faChevronRight} /> }}`,
  },
  {
    key: "icons.headerCollapse",
    name: "icons.headerCollapse",
    required: false,
    description: "Custom icon component for the collapse state of collapsible column headers.",
    type: "React.ReactNode",
    example: `icons={{ headerCollapse: <FontAwesomeIcon icon={faChevronDown} /> }}`,
  },
  {
    key: "icons.prev",
    name: "icons.prev",
    required: false,
    description: "Custom icon component for pagination previous button.",
    type: "React.ReactNode",
    example: `icons={{ prev: <FontAwesomeIcon icon={faAngleLeft} /> }}`,
  },
  {
    key: "icons.next",
    name: "icons.next",
    required: false,
    description: "Custom icon component for pagination next button.",
    type: "React.ReactNode",
    example: `icons={{ next: <FontAwesomeIcon icon={faAngleRight} /> }}`,
  },
  {
    key: "icons.drag",
    name: "icons.drag",
    required: false,
    description:
      "Custom icon component for the drag handle in the column editor. Used for drag-and-drop column reordering.",
    type: "React.ReactNode",
    example: `icons={{ drag: <FontAwesomeIcon icon={faGripVertical} /> }}`,
  },
  {
    key: "icons.pinnedLeftIcon",
    name: "icons.pinnedLeftIcon",
    required: false,
    description: "Column editor icon for pinning a column to the left.",
    type: "React.ReactNode",
    example: `icons={{ pinnedLeftIcon: <FontAwesomeIcon icon={faThumbtack} /> }}`,
  },
  {
    key: "icons.pinnedRightIcon",
    name: "icons.pinnedRightIcon",
    required: false,
    description: "Column editor icon for pinning a column to the right.",
    type: "React.ReactNode",
    example: `icons={{ pinnedRightIcon: <FontAwesomeIcon icon={faThumbtack} /> }}`,
  },
];

export default function CustomIconsContent() {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faIcons} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Custom Icons</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Simple Table allows you to override the default icons used for sorting, pagination, row
        expansion, filtering, and drag-and-drop operations. Use the unified{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">
          icons
        </code>{" "}
        prop to customize all icons in one place, maintaining consistent branding across your
        application.
      </motion.p>

      <motion.div
        className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-2">New in v2.4.1</h3>
        <p className="text-gray-700 dark:text-gray-300">
          All icon props have been consolidated into a single{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">icons</code> object for
          better organization. The new{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">drag</code> icon is
          used for the drag handle in the column editor.
        </p>
      </motion.div>

      {/* Demo Section */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LivePreview
          demoId="custom-icons"
          height="400px"
          Preview={CustomIconsDemo}
        />
      </motion.div>

      {/* Basic Implementation Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Basic Implementation
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          To customize the icons in Simple Table, pass your custom icon components to the respective
          props. You can use any icon library like Font Awesome, Material Icons, or your own custom
          SVG icons.
        </p>

        <PropTable props={CUSTOM_ICON_PROPS} title="Available Icon Props" />
      </motion.div>

      {/* Best Practices Section */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        Best Practices
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Keep icon sizes consistent for a polished look</li>
          <li>Use colors that match your application's theme</li>
          <li>Ensure icons are clear and intuitive for their purpose</li>
          <li>
            For row grouping, choose expand icons that clearly indicate the expand/collapse state
          </li>
          <li>
            For drag handles, use icons like grip-vertical or drag indicators that suggest
            draggability
          </li>
          <li>Consider using the same icon family throughout your application</li>
          <li>Test your icons for visibility against different background colors</li>
          <li>
            Use the unified{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">icons</code> prop to
            keep all icon configurations in one place
          </li>
        </ul>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
}
