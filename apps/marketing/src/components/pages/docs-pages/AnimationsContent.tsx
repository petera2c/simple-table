"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import AnimationsDemo from "@/components/demos/AnimationsDemo";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import PageWrapper from "@/components/PageWrapper";
import CodeBlock from "@/components/CodeBlock";
import LivePreview from "@/components/LivePreview";
import PropTable, { type PropInfo } from "@/components/PropTable";
import { ANIMATIONS_CONFIG_PROPS } from "@/constants/propDefinitions";
import { animationsSnippets, type CodeByFramework } from "@/constants/docsSnippets";

type AnimationPattern = {
  title: string;
  body: ReactNode;
  codeByFramework: CodeByFramework;
};

const ANIMATION_PATTERNS: AnimationPattern[] = [
  {
    title: "Disable animations",
    body: (
      <>
        Animations are on by default. Set{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">enabled: false</code>{" "}
        when you want cells to snap instantly.
      </>
    ),
    codeByFramework: animationsSnippets({ enabled: false }),
  },
  {
    title: "Custom timing",
    body: (
      <>
        Override the default{" "}
        <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">240</code> ms duration
        and easing to match your product motion.
      </>
    ),
    codeByFramework: animationsSnippets({
      duration: 320,
      easing: "ease-out",
    }),
  },
];

const ANIMATIONS_PROPS: PropInfo[] = [
  {
    key: "animations",
    name: "animations",
    required: false,
    description:
      "FLIP-style cell motion on sort, column reorder, and visibility changes. Enabled by default; respects prefers-reduced-motion.",
    type: "AnimationsConfig",
    link: "/docs/api-reference#animations-config",
    example: `animations={{ enabled: false }}
animations={{ duration: 320, easing: "ease-out" }}`,
  },
];

const AnimationsContent = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faWandMagicSparkles} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Animations</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Cells slide into place on sort, column reorder, and visibility changes. On by default — no
        prop required.
      </motion.p>

      <motion.div
        className="space-y-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {ANIMATION_PATTERNS.map((pattern) => (
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
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">What animates</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
          Sort, drag reorder (neighbors only), programmatic column order, and column visibility.
          Scroll and cell content updates do not animate. For value-change flashes, see{" "}
          <Link
            href="/docs/live-updates"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Live Updates
          </Link>{" "}
          (<code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">cellUpdateFlash</code>
          ).
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
            prefers-reduced-motion
          </code>{" "}
          disables motion automatically.
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
        Sort or drag a column to see cells slide. Use Code or StackBlitz for the full example.
      </motion.p>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <LivePreview demoId="animations" height="400px" Preview={AnimationsDemo} />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Props
      </motion.h2>

      <PropTable props={ANIMATIONS_PROPS} title="Animations Configuration" />

      <motion.h3
        className="text-xl font-semibold text-gray-800 dark:text-white mb-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
      >
        AnimationsConfig
      </motion.h3>
      <PropTable props={ANIMATIONS_CONFIG_PROPS} title="AnimationsConfig" />

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default AnimationsContent;
