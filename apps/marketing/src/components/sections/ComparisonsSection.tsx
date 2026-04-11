"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ComparisonsSection() {
  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">
        How We Compare
      </h2>

      <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
        See how Simple Table stacks up against other popular data grid solutions. We're the
        lightweight, free alternative to expensive enterprise solutions.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "vs AG Grid",
            description:
              "Compare our lightweight solution against AG Grid's enterprise features and pricing",
            link: "/comparisons/simple-table-vs-ag-grid",
            color: "from-blue-500 to-blue-600",
          },
          {
            title: "vs Handsontable",
            description: "See how we match up to Handsontable's spreadsheet-like functionality",
            link: "/comparisons/simple-table-vs-handsontable",
            color: "from-purple-500 to-purple-600",
          },
          {
            title: "vs Material-UI Table",
            description: "Discover the benefits over Material-UI's basic table component",
            link: "/comparisons/simple-table-vs-material-react",
            color: "from-pink-500 to-pink-600",
          },
          {
            title: "vs Ant Design Table",
            description: "Compare with Ant Design's table component for feature-rich applications",
            link: "/comparisons/simple-table-vs-ant-design",
            color: "from-orange-500 to-orange-600",
          },
          {
            title: "vs TanStack Table",
            description:
              "See how our ready-to-use solution compares to TanStack's headless approach",
            link: "/comparisons/simple-table-vs-tanstack",
            color: "from-green-500 to-green-600",
          },
        ].map((comparison, index) => (
          <Link key={index} href={comparison.link}>
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`h-2 bg-gradient-to-r ${comparison.color}`}></div>
              <div className="p-4 sm:p-5 lg:p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                  {comparison.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{comparison.description}</p>
                <div className="flex justify-end">
                  <span className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm">
                    Read comparison →
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
