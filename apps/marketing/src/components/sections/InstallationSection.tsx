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
      className="mb-16 rounded-lg p-4 sm:p-6 lg:p-8 border border-line bg-surface"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <FontAwesomeIcon
            icon={faDownload}
            className="text-muted text-2xl"
          />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-ink">
          Get Full Integration In Minutes
        </h2>
        <p className="text-muted max-w-2xl mx-auto">
          Works with React, Vue, Angular, Svelte, Solid, and vanilla TypeScript. Simple Table fits
          right into your {label} project.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-footer text-footer-ink p-3 sm:p-4 lg:p-6 rounded-lg mb-6 font-mono text-sm overflow-x-auto">
          <div className="mb-4">
            <div className="text-footer-muted mb-1"># Install via npm</div>
            <code className="text-footer-ink">{commands.npm}</code>
          </div>
          <div>
            <div className="text-footer-muted mb-1"># Or via yarn</div>
            <code className="text-footer-ink">{commands.yarn}</code>
          </div>
        </div>

        <div className="text-center">
          <Button
            type="primary"
            size="large"
            onClick={handleDocumentationClick}
          >
            <FontAwesomeIcon icon={faCode} className="mr-2" />
            View Installation Guide
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
