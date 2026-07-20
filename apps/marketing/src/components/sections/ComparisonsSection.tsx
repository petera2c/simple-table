"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { SIMPLE_TABLE_FRAMEWORKS_SHORT } from "@/constants/frameworkIntegrationHub";
import {
  COMPARISON_ENTRIES,
  type ComparisonFrameworkTag,
} from "@/constants/comparisons";

const FRAMEWORK_FILTERS: { id: ComparisonFrameworkTag | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "react", label: "React" },
  { id: "vue", label: "Vue" },
  { id: "angular", label: "Angular" },
  { id: "svelte", label: "Svelte" },
  { id: "vanilla", label: "Vanilla" },
  { id: "multi", label: "Multi-framework" },
];

export default function ComparisonsSection() {
  const [filter, setFilter] = useState<ComparisonFrameworkTag | "all">("all");

  const visibleComparisons = useMemo(() => {
    if (filter === "all") return COMPARISON_ENTRIES;
    return COMPARISON_ENTRIES.filter(
      (entry) => entry.framework === filter || entry.framework === "multi",
    );
  }, [filter]);

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

      <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
        See how Simple Table stacks up against other popular data grid solutions. Free for startups
        and side projects, a fraction of enterprise pricing for everyone else, with official
        adapters for {SIMPLE_TABLE_FRAMEWORKS_SHORT}.
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {FRAMEWORK_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === item.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleComparisons.map((comparison, index) => (
          <Link key={comparison.link} href={comparison.link}>
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index, 8) * 0.05 }}
              viewport={{ once: true }}
            >
              <div className="h-2 bg-linear-to-r from-blue-500 to-indigo-600"></div>
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
