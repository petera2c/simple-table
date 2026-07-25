"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette } from "@fortawesome/free-solid-svg-icons";
import type { Theme } from "@simple-table/react";
import ThemesDemo from "@/components/demos/ThemesDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import ThemeSelector from "@/components/ThemeSelector";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { useThemeContext } from "@/providers/ThemeProvider";
import {
  themeSnippets,
  themeStylingFlagsSnippets,
  type CodeByFramework,
} from "@/constants/docsSnippets";

type ThemePattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const THEME_PATTERNS: ThemePattern[] = [
  {
    title: "Apply a theme",
    body: (
      <>
        Pass{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">theme</code> with{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">light</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">dark</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">neutral</code>,{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">modern-light</code>, or{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">modern-dark</code>. Use{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">custom</code> with{" "}
        <Link
          href="/docs/custom-theme"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Custom Theme
        </Link>{" "}
        for your own tokens.
      </>
    ),
    codeByFramework: themeSnippets("modern-dark"),
  },
  {
    title: "Styling flags",
    body: (
      <>
        Toggle row hover, zebra striping, and borders.{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">hoverRowBackground</code>{" "}
        and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">oddEvenRowBackground</code>{" "}
        default to on;{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">columnBorders</code> and{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">oddColumnBackground</code>{" "}
        default to off.
      </>
    ),
    codeByFramework: themeStylingFlagsSnippets(),
  },
];

const THEME_PROPS: PropInfo[] = [
  {
    key: "theme",
    name: "theme",
    required: false,
    description: "Built-in theme for the table.",
    type: "Theme",
    link: "/docs/api-reference#union-types",
    enumValues: ["light", "dark", "neutral", "modern-light", "modern-dark", "custom"],
    example: `theme="modern-dark"`,
  },
  {
    key: "hoverRowBackground",
    name: "hoverRowBackground",
    required: false,
    description: "Highlight the row under the pointer. Defaults to true.",
    type: "boolean",
    example: `hoverRowBackground={true}`,
  },
  {
    key: "oddEvenRowBackground",
    name: "oddEvenRowBackground",
    required: false,
    description: "Alternate row background colors. Defaults to true.",
    type: "boolean",
    example: `oddEvenRowBackground={true}`,
  },
  {
    key: "oddColumnBackground",
    name: "oddColumnBackground",
    required: false,
    description: "Alternate column background colors. Defaults to false.",
    type: "boolean",
    example: `oddColumnBackground={true}`,
  },
  {
    key: "columnBorders",
    name: "columnBorders",
    required: false,
    description: "Show vertical borders between columns. Defaults to false.",
    type: "boolean",
    example: `columnBorders={true}`,
  },
];

export default function ThemesContent() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("light");
  const { theme } = useThemeContext();

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-purple-100 rounded-lg">
          <FontAwesomeIcon icon={faPalette} className="text-purple-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Themes</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Built-in themes and flags for table appearance.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {THEME_PATTERNS.map((pattern) => (
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
        Switch themes below. Code or StackBlitz has the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <div className="flex flex-col gap-4">
          <ThemeSelector currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
          <LivePreview
            demoId="themes"
            height="400px"
            Preview={({ height }) => <ThemesDemo height={height} theme={currentTheme} />}
          />
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={THEME_PROPS} title="Theme Configuration" />

      <DocNavigationButtons />
    </PageWrapper>
  );
}
