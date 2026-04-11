"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faCode } from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useFramework, FRAMEWORK_LABELS } from "@/providers/FrameworkProvider";
import { FRAMEWORK_INSTALL_COMMANDS } from "@/constants/strings/technical";

export default function InstallationSection() {
  const router = useRouter();
  const { framework } = useFramework();
  const commands = FRAMEWORK_INSTALL_COMMANDS[framework];
  const label = FRAMEWORK_LABELS[framework];

  const handleDocumentationClick = () => {
    router.push("/docs/installation");
  };

  return (
    <motion.section
      className="mb-16 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 rounded-xl p-4 sm:p-6 lg:p-8 border border-indigo-100 dark:border-indigo-800"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <FontAwesomeIcon
            icon={faDownload}
            className="text-indigo-600 dark:text-indigo-400 text-2xl"
          />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          Get Full Integration In Minutes
        </h2>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Works with React, Vue, Angular, Svelte, Solid, and vanilla TypeScript. Simple Table fits
          right into your {label} project.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-900 dark:bg-gray-950 text-gray-100 dark:text-gray-100 p-3 sm:p-4 lg:p-6 rounded-lg mb-6 font-mono text-sm overflow-x-auto border border-gray-700 dark:border-gray-700">
          <div className="mb-4">
            <div className="text-gray-400 dark:text-gray-400 mb-1"># Install via npm</div>
            <code className="text-green-400 dark:text-green-400">{commands.npm}</code>
          </div>
          <div>
            <div className="text-gray-400 dark:text-gray-400 mb-1"># Or via yarn</div>
            <code className="text-green-400 dark:text-green-400">{commands.yarn}</code>
          </div>
        </div>

        <div className="text-center">
          <Button
            type="primary"
            size="large"
            onClick={handleDocumentationClick}
            className="hover:scale-105 transition-transform"
          >
            <FontAwesomeIcon icon={faCode} className="mr-2" />
            View Installation Guide
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
