"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import CustomThemeDemo from "@/components/demos/custom-theme/CustomThemeDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import DocsSteps, { type DocsStep } from "@/components/DocsSteps";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { CUSTOM_THEME_PROPS } from "@/constants/propDefinitions";
import {
  customThemeCssSnippets,
  customThemeImportSnippets,
  customThemeLayoutSnippets,
  themeSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type LayoutPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const CSS_THEME_STEPS: DocsStep[] = [
  {
    title: "Define CSS variables",
    body: (
      <>
        Target{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">.theme-custom</code>{" "}
        with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">--st-*</code> variables
        for colors, fonts, and visual styling.
      </>
    ),
    codeByFramework: customThemeCssSnippets(),
    language: "css",
  },
  {
    title: "Import the stylesheet",
    body: <>Load your theme CSS in the app (or component) that renders the table.</>,
    codeByFramework: customThemeImportSnippets(),
  },
  {
    title: "Apply the theme",
    body: (
      <>
        Pass{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">theme=&quot;custom&quot;</code>
        . Built-in themes are covered on{" "}
        <Link href="/docs/themes" className="text-blue-600 dark:text-blue-400 hover:underline">
          Themes
        </Link>
        .
      </>
    ),
    codeByFramework: themeSnippets("custom"),
  },
];

const LAYOUT_PATTERNS: LayoutPattern[] = [
  {
    title: "Layout dimensions",
    body: (
      <>
        Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">customTheme</code> for
        heights and widths the virtualizer needs (row height, header height, nested-grid padding,
        etc.). These cannot be set via CSS alone.
      </>
    ),
    codeByFramework: customThemeLayoutSnippets(),
  },
];

const CSS_THEME_PROPS: PropInfo[] = [
  {
    key: "theme",
    name: "theme",
    required: false,
    description: 'Set to "custom" to use your .theme-custom CSS variables.',
    type: '"custom"',
    link: "/docs/api-reference#union-types",
    example: `theme="custom"`,
  },
];

export default function CustomThemeContent() {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-green-100 rounded-lg">
          <FontAwesomeIcon icon={faCode} className="text-green-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Custom Theme</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Style colors with CSS variables; set layout sizes with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">customTheme</code>. Use
        both together when you need full control.
      </motion.p>

      <motion.h2
        className="text-xl font-semibold text-gray-800 dark:text-white mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.22 }}
      >
        CSS theme
      </motion.h2>
      <DocsSteps steps={CSS_THEME_STEPS} />

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.28 }}
      >
        {LAYOUT_PATTERNS.map((pattern) => (
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
        A table using{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">theme=&quot;custom&quot;</code>
        . Code or StackBlitz has the full CSS.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="custom-theme" height="400px" Preview={CustomThemeDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={CSS_THEME_PROPS} title="CSS theme" />
      <PropTable props={CUSTOM_THEME_PROPS} title="customTheme" />

      <DocNavigationButtons />
    </PageWrapper>
  );
}
