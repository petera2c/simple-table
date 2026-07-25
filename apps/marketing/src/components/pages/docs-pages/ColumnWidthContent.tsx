"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRulerHorizontal } from "@fortawesome/free-solid-svg-icons";
import ColumnWidthDemo from "@/components/demos/ColumnWidthDemo";
import CodeBlock from "@/components/CodeBlock";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import {
  forAllFrameworks,
  tableSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type WidthPattern = {
  id?: string;
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
  language?: string;
};

const WIDTH_PATTERNS: WidthPattern[] = [
  {
    id: "content-fit-auto",
    title: 'Content-fit ("auto")',
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">width: &quot;auto&quot;</code>{" "}
        to size from the header and sampled cell content. Cap growth with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">maxWidth</code> when you
        want truncation.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "email",
  label: "Email",
  width: "auto",
  maxWidth: 300,
}`),
    language: "typescript",
  },
  {
    title: "Fixed width",
    body: "Pass a number for a pixel width. Best for IDs, dates, and other short columns.",
    codeByFramework: forAllFrameworks(`{ accessor: "id", label: "ID", width: 60 }`),
    language: "typescript",
  },
  {
    title: 'Flexible width ("1fr")',
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">width: &quot;1fr&quot;</code>{" "}
        so the column shares leftover space with other flexible columns. Pair with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">minWidth</code> so it
        doesn&apos;t get too narrow.
      </>
    ),
    codeByFramework: forAllFrameworks(`{
  accessor: "name",
  label: "Name",
  width: "1fr",
  minWidth: 120,
}`),
    language: "typescript",
  },
  {
    title: "Fill the container",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          autoExpandColumns
        </code>{" "}
        to scale all column widths proportionally so the table fills its container with no
        horizontal scroll. Prefer{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">false</code> on small
        screens (&lt; 768px).
      </>
    ),
    codeByFramework: tableSnippets({ height: "400px", autoExpandColumns: true }),
  },
];

const COLUMN_WIDTH_PROPS: PropInfo[] = [
  {
    key: "width",
    name: "ColumnDef.width",
    required: true,
    description:
      "Column width: a pixel number, '1fr' to share leftover space, or 'auto' to fit content (clamped by minWidth/maxWidth).",
    type: "number | '1fr' | 'auto'",
    link: "/docs/api-reference#column-def",
    example: `width: 60
width: "1fr"
width: "auto"`,
  },
  {
    key: "minWidth",
    name: "ColumnDef.minWidth",
    required: false,
    description:
      "Minimum width for '1fr' and 'auto' columns. Not enforced during autoExpandColumns scaling.",
    type: "number",
    example: `minWidth: 120`,
  },
  {
    key: "maxWidth",
    name: "ColumnDef.maxWidth",
    required: false,
    description:
      "Maximum width. With width: 'auto', content past the cap truncates. Ignored when autoExpandColumns is enabled.",
    type: "number",
    example: `maxWidth: 300`,
  },
  {
    key: "autoExpandColumns",
    name: "autoExpandColumns",
    required: false,
    description:
      "Scale all column widths proportionally to fill the container. Recommended off on mobile (< 768px).",
    type: "boolean",
    link: "/docs/api-reference#simple-table-props",
    example: `autoExpandColumns={true}`,
  },
];

const ColumnWidthContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faRulerHorizontal} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Column Width</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Set each column&apos;s{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">width</code> to{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">&quot;auto&quot;</code>
        , a fixed size, or{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">&quot;1fr&quot;</code>
        . Optionally fill the container with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
          autoExpandColumns
        </code>
        .
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {WIDTH_PATTERNS.map((pattern) => (
          <section key={pattern.title} id={pattern.id} className={pattern.id ? "scroll-mt-24" : undefined}>
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
        Fixed, flexible, and auto columns together. On wider viewports the demo enables{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">autoExpandColumns</code>.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="column-width" height="400px" Preview={ColumnWidthDemo} />
      </motion.div>

      <motion.div
        className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-1">How &quot;1fr&quot; splits space</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Fixed columns take their pixels first. Remaining width is split equally among{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">1fr</code> columns. In a
          1000px table with fixed 100px + 150px and two{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">1fr</code> columns, each
          flexible column gets 375px.
        </p>
      </motion.div>

      <motion.div
        className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg shadow-sm mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-1">autoExpandColumns trade-offs</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Column{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">width</code> values are
          the scale base.{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">minWidth</code> /
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">maxWidth</code> are not
          enforced while scaling.
        </p>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        Props
      </motion.h2>

      <PropTable props={COLUMN_WIDTH_PROPS} title="Column Width Properties" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default ColumnWidthContent;
