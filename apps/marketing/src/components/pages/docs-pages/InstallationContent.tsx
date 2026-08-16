"use client";

import { useState } from "react";
import { Button, message } from "antd";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCopy, faDownload } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";
import PageWrapper from "@/components/PageWrapper";
import DocNavigationButtons from "@/components/DocNavigationButtons";
import { getAiSetupPrompt } from "@/constants/aiTablePrompt";
import { FRAMEWORK_INSTALL_COMMANDS, FRAMEWORK_REQUIREMENTS } from "@/constants/strings/technical";
import { trackCopyAiSetupPrompt } from "@/lib/analytics";
import { useFramework, FRAMEWORK_LABELS } from "@/providers/FrameworkProvider";

const InstallationContent = () => {
  const { framework } = useFramework();
  const commands = FRAMEWORK_INSTALL_COMMANDS[framework];
  const requirement = FRAMEWORK_REQUIREMENTS[framework];
  const label = FRAMEWORK_LABELS[framework];
  const [promptCopied, setPromptCopied] = useState(false);

  const copySetupPrompt = async () => {
    try {
      await navigator.clipboard.writeText(getAiSetupPrompt(framework));
      trackCopyAiSetupPrompt({ framework, location: "installation" });
      setPromptCopied(true);
      window.setTimeout(() => setPromptCopied(false), 2000);
      message.success("AI prompt copied to clipboard");
    } catch {
      message.error("Could not copy AI prompt");
    }
  };

  return (
    <PageWrapper>
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <FontAwesomeIcon icon={faDownload} className="text-blue-600 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Installation</h1>
      </motion.div>

      <motion.p
        className="text-gray-700 dark:text-gray-300 mb-4 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Getting started with Simple Table is easy. This guide will walk you through the installation
        process and help you set up the library in your {label} project.
      </motion.p>

      <motion.div
        className="flex flex-col gap-2 mb-8 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.22 }}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Or paste this into your AI coding tool to install, wire your data, and match your styles.
        </p>
        <Button
          type="primary"
          size="large"
          className="w-full"
          onClick={copySetupPrompt}
          icon={<FontAwesomeIcon icon={promptCopied ? faCheck : faCopy} />}
        >
          {promptCopied ? "Copied!" : "Copy AI prompt"}
        </Button>
      </motion.div>

      <CodeBlock className="mb-4" code={commands.npm} language="bash" />
      <CodeBlock className="mb-4" code={commands.yarn} language="bash" />
      <CodeBlock className="mb-8" code={commands.pnpm} language="bash" />

      <motion.h2
        className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Requirements
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Simple Table requires the following:
        </p>

        <ul className="list-disc pl-8 space-y-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <li>{requirement}</li>
        </ul>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <strong>Why Simple Table?</strong>
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Simple Table is a lightweight, feature-rich alternative to expensive enterprise solutions.
            See how we compare:{" "}
            <Link
              href="/comparisons/simple-table-vs-ag-grid"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              vs AG Grid
            </Link>
            {" \u2022 "}
            <Link
              href="/comparisons/simple-table-vs-tanstack"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              vs TanStack Table
            </Link>
          </p>
        </div>
      </motion.div>

      <DocNavigationButtons />
    </PageWrapper>
  );
};

export default InstallationContent;
