"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faShieldAlt,
  faCodeBranch,
  faBook,
  faRocket,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export default function ProductionSection() {
  return (
    <motion.section
      className="mb-16 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">
        Built for Production Use
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
        We're developers who needed a professional data grid solution. That's why we built Simple
        Table to be flexible, reliable, and actually enjoyable to work with.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <FontAwesomeIcon icon={faCode} className="text-blue-600 dark:text-blue-400 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Flexible</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Work with TypeScript or JavaScript. Drop it in existing projects or start fresh with
            easy configuration.
          </p>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <FontAwesomeIcon
              icon={faShieldAlt}
              className="text-green-600 dark:text-green-400 text-2xl"
            />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Production-Ready</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Battle-tested with comprehensive examples for React, Vue, Angular, Svelte, Solid, and
            vanilla TypeScript so you can ship faster.
          </p>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
            <FontAwesomeIcon
              icon={faCodeBranch}
              className="text-purple-600 dark:text-purple-400 text-2xl"
            />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
            Browser Compatible
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Consistent performance across major browsers: Chrome, Firefox, Edge, Safari, and Opera.
          </p>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 mb-4">
            <FontAwesomeIcon
              icon={faBook}
              className="text-indigo-600 dark:text-indigo-400 text-2xl"
            />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
            Developer Friendly Docs
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Clear structure, detailed usage guides and interactive examples for easy copy-paste
            code.
          </p>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900 mb-4">
            <FontAwesomeIcon
              icon={faRocket}
              className="text-orange-600 dark:text-orange-400 text-2xl"
            />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
            Continuous Updates
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Regular updates with new features and enhancements to keep the library current and
            robust.
          </p>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <FontAwesomeIcon icon={faHeadset} className="text-red-600 dark:text-red-400 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
            Dedicated Support
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Your feedback is important to us. Get timely technical support for your use cases.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
