"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import FooterRendererDemo from "@/components/demos/FooterRendererDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { FOOTER_RENDERER_PROPS as FOOTER_RENDERER_PARAMS_PROPS } from "@/constants/propDefinitions";
import {
  footerPositionSnippets,
  footerRendererSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type FooterPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const FOOTER_PATTERNS: FooterPattern[] = [
  {
    title: "Custom pagination footer",
    body: (
      <>
        Pass{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">footerRenderer</code>{" "}
        with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">enablePagination</code>.
        It replaces the default footer. Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">hasPrevPage</code> /{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">hasNextPage</code> to
        disable controls at the ends.
      </>
    ),
    codeByFramework: footerRendererSnippets(),
  },
  {
    title: "Footer above the table",
    body: (
      <>
        Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
          footerPosition=&quot;top&quot;
        </code>{" "}
        for the default or custom footer. Defaults to{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">&quot;bottom&quot;</code>.
      </>
    ),
    codeByFramework: footerPositionSnippets(),
  },
];

const FOOTER_RENDERER_PROPS: PropInfo[] = [
  {
    key: "footerRenderer",
    name: "footerRenderer",
    required: false,
    description:
      "Custom footer that replaces the default. Receives pagination state and navigation handlers.",
    type: "(props: FooterRendererProps) => …",
    link: "/docs/api-reference#footer-renderer-props",
    example: `footerRenderer={FooterBar}`,
  },
  {
    key: "footerPosition",
    name: "footerPosition",
    required: false,
    description: 'Place the footer above ("top") or below ("bottom", default) the table body.',
    type: '"top" | "bottom"',
    example: `footerPosition="top"`,
  },
  {
    key: "footerRenderKey",
    name: "footerRenderKey",
    required: false,
    description:
      "Cache key for custom footers that read external state. Change it when that state changes so the footer refreshes even if pagination inputs are unchanged.",
    type: "string | number",
    example: `footerRenderKey={isLoading ? "loading" : "ready"}`,
  },
];

const FooterRendererContent = () => {
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Footer Renderer</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Replace the default pagination footer with your own UI via{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">footerRenderer</code>.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {FOOTER_PATTERNS.map((pattern) => (
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
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">Notes</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Page numbers are 1-based.{" "}
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">onNextPage</code> is
          async. For pagination setup without a custom footer, see{" "}
          <Link
            href="/docs/pagination"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Pagination
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
        Custom footer with page info and navigation. Use Code or StackBlitz for the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="footer-renderer" height="400px" Preview={FooterRendererDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={FOOTER_RENDERER_PROPS} title="Footer Renderer Configuration" />

      <motion.h3
        className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        Renderer arguments
      </motion.h3>
      <PropTable props={FOOTER_RENDERER_PARAMS_PROPS} title="FooterRendererProps" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default FooterRendererContent;
