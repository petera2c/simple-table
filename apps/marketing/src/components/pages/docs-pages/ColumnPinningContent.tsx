"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
import ColumnPinningDemo from "@/components/demos/ColumnPinningDemo";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import {
  forAllFrameworks,
  pinnedStateSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type PinPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const PIN_PATTERNS: PinPattern[] = [
  {
    title: "Pin to the left",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">pinned: &quot;left&quot;</code>{" "}
        so the column stays visible while scrolling horizontally.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "id",
  label: "ID",
  width: 80,
  pinned: "left",
}`),
    language: "typescript",
  },
  {
    title: "Pin to the right",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          pinned: &quot;right&quot;
        </code>{" "}
        for actions or status columns that should stay on the trailing edge.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "actions",
  label: "Actions",
  width: 120,
  pinned: "right",
}`),
    language: "typescript",
  },
  {
    title: "Essential columns",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">essential: true</code> to
        prevent hide/unpin and keep the column in a fixed leading group within its pin section. See{" "}
        <Link
          href="/docs/api-reference#column-def"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ColumnDef
        </Link>
        .
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "name",
  label: "Name",
  width: "1fr",
  pinned: "left",
  essential: true,
}`),
    language: "typescript",
  },
  {
    title: "Save and restore pin layout",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">getPinnedState</code> and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">applyPinnedState</code> on{" "}
        <Link
          href="/docs/api-reference#table-api"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          TableAPI
        </Link>{" "}
        to read and restore left / main / right accessor lists.
      </>
    ),
    codeByFramework: pinnedStateSnippets(),
    language: "typescript",
  },
];

const COLUMN_PINNING_PROPS: PropInfo[] = [
  {
    key: "pinned",
    name: "ColumnDef.pinned",
    required: false,
    description:
      "Pins the column to the left or right edge so it stays visible during horizontal scroll.",
    type: "enum",
    link: "/docs/api-reference#union-types",
    enumValues: ["left", "right"],
    example: `pinned: "left"
pinned: "right"`,
  },
  {
    key: "essential",
    name: "ColumnDef.essential",
    required: false,
    description:
      "Locks the column against hide/unpin and keeps it in a fixed leading group within its pin section.",
    type: "boolean",
    link: "/docs/api-reference#column-def",
    example: `essential: true`,
  },
];

const ColumnPinningContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faThumbtack} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Pinning</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Keep important columns visible while scrolling wide tables horizontally.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {PIN_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pattern.body}</p>
            <CodeBlock
              codeByFramework={pattern.codeByFramework}
              language={pattern.language}
              showLineNumbers={false}
            />
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
        Scroll horizontally — left and right pinned columns stay in place.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="column-pinning" height="400px" Preview={ColumnPinningDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={COLUMN_PINNING_PROPS} title="Column Pinning Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ColumnPinningContent;
