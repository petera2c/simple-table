"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIcons } from "@fortawesome/free-solid-svg-icons";
import CustomIconsDemo from "@/components/demos/CustomIconsDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { customIconsSnippets, type CodeByFramework } from "@/constants/docsSnippets";

type IconsPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const ICONS_PATTERNS: IconsPattern[] = [
  {
    title: "Override icons",
    body: (
      <>
        Pass an{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">icons</code> object —
        only the keys you set replace the defaults. Values are framework nodes (JSX, VNodes,
        components, or DOM/SVG elements).
      </>
    ),
    codeByFramework: customIconsSnippets(),
  },
];

const CUSTOM_ICON_PROPS: PropInfo[] = [
  {
    key: "icons",
    name: "icons",
    required: false,
    description: "Partial icon map. Unset keys keep the built-in icons.",
    type: "IconsConfig",
    example: `icons={{ sortUp: <SortUpIcon />, filter: <FilterIcon /> }}`,
  },
  {
    key: "icons.sortUp",
    name: "icons.sortUp",
    required: false,
    description: "Ascending sort indicator in column headers.",
    type: "IconElement",
    example: `icons={{ sortUp: <SortUpIcon /> }}`,
  },
  {
    key: "icons.sortDown",
    name: "icons.sortDown",
    required: false,
    description: "Descending sort indicator in column headers.",
    type: "IconElement",
    example: `icons={{ sortDown: <SortDownIcon /> }}`,
  },
  {
    key: "icons.filter",
    name: "icons.filter",
    required: false,
    description: "Column filter button.",
    type: "IconElement",
    example: `icons={{ filter: <FilterIcon /> }}`,
  },
  {
    key: "icons.expand",
    name: "icons.expand",
    required: false,
    description: "Collapsed row-group expand control.",
    type: "IconElement",
    example: `icons={{ expand: <ExpandIcon /> }}`,
  },
  {
    key: "icons.headerExpand",
    name: "icons.headerExpand",
    required: false,
    description: "Collapsed nested column header.",
    type: "IconElement",
    example: `icons={{ headerExpand: <HeaderExpandIcon /> }}`,
  },
  {
    key: "icons.headerCollapse",
    name: "icons.headerCollapse",
    required: false,
    description: "Expanded nested column header.",
    type: "IconElement",
    example: `icons={{ headerCollapse: <HeaderCollapseIcon /> }}`,
  },
  {
    key: "icons.prev",
    name: "icons.prev",
    required: false,
    description: "Pagination previous button.",
    type: "IconElement",
    example: `icons={{ prev: <PrevIcon /> }}`,
  },
  {
    key: "icons.next",
    name: "icons.next",
    required: false,
    description: "Pagination next button.",
    type: "IconElement",
    example: `icons={{ next: <NextIcon /> }}`,
  },
  {
    key: "icons.drag",
    name: "icons.drag",
    required: false,
    description: "Column editor drag handle.",
    type: "IconElement",
    example: `icons={{ drag: <DragIcon /> }}`,
  },
  {
    key: "icons.pinnedLeftIcon",
    name: "icons.pinnedLeftIcon",
    required: false,
    description: "Column editor pin-left control.",
    type: "IconElement",
    example: `icons={{ pinnedLeftIcon: <PinLeftIcon /> }}`,
  },
  {
    key: "icons.pinnedRightIcon",
    name: "icons.pinnedRightIcon",
    required: false,
    description: "Column editor pin-right control.",
    type: "IconElement",
    example: `icons={{ pinnedRightIcon: <PinRightIcon /> }}`,
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
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Replace sort, filter, pagination, expand, and editor icons with the{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">icons</code> prop.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {ICONS_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pattern.body}</p>
            <CodeBlock codeByFramework={pattern.codeByFramework} showLineNumbers={false} />
          </section>
        ))}
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Example
      </motion.h2>
      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.32 }}
      >
        Sort and paginate to see the custom icons. Code or StackBlitz has the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview
          demoId="custom-icons"
          height="auto"
          demoHeight="auto"
          Preview={CustomIconsDemo}
        />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={CUSTOM_ICON_PROPS} title="Icons Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
}
