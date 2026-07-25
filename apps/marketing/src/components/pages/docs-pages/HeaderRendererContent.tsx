"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import HeaderRendererDemo from "@/components/demos/HeaderRendererDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { HEADER_RENDERER_PROPS as HEADER_RENDERER_PARAMS_PROPS } from "@/constants/propDefinitions";
import {
  headerRendererComponentsSnippets,
  headerRendererSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type HeaderPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const HEADER_PATTERNS: HeaderPattern[] = [
  {
    title: "Add a header renderer",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">headerRenderer</code> on
        a column to customize the header cell. Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">header.label</code> and
        other column fields from the props.
      </>
    ),
    codeByFramework: headerRendererSnippets(),
  },
  {
    title: "Reuse built-in components",
    body: (
      <>
        Arrange{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">components</code> (
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">labelContent</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">sortIcon</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">filterIcon</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">collapseIcon</code>) so
        sort/filter keep working without reimplementing them.
      </>
    ),
    codeByFramework: headerRendererComponentsSnippets(),
  },
];

const HEADER_RENDERER_PROPS: PropInfo[] = [
  {
    key: "headerRenderer",
    name: "ColumnDef.headerRenderer",
    required: false,
    description:
      "Custom header content. Framework adapters accept components or render functions; vanilla returns a string or DOM node.",
    type: "(props: HeaderRendererProps) => …",
    link: "/docs/api-reference#header-renderer-props",
    example: `headerRenderer: StatusHeader`,
  },
];

const HeaderRendererContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faCode} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Header Renderer</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Customize column headers with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">headerRenderer</code>.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {HEADER_PATTERNS.map((pattern) => (
          <section key={pattern.title}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {pattern.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{pattern.body}</p>
            <CodeBlock
              codeByFramework={pattern.codeByFramework}
              showLineNumbers={false}
            />
          </section>
        ))}
      </motion.div>

      <motion.div
        className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">Hide all headers</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          To hide the header row entirely, set{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">hideHeader</code> on
          the table. See the{" "}
          <Link
            href="/docs/api-reference"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            API Reference
          </Link>
          .
        </p>
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
        Custom header controls with built-in sort/filter icons. Use Code or StackBlitz for the full
        example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="header-renderer" height="400px" Preview={HeaderRendererDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={HEADER_RENDERER_PROPS} title="Header Renderer Configuration" />

      <motion.h3
        className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        Renderer arguments
      </motion.h3>
      <PropTable props={HEADER_RENDERER_PARAMS_PROPS} title="HeaderRendererProps" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default HeaderRendererContent;
