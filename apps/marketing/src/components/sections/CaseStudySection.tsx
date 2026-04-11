"use client";

import { motion } from "framer-motion";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function CaseStudySection() {
  const router = useRouter();

  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-8 md:p-12 border border-blue-100 dark:border-blue-800 shadow-lg">
        <div className="max-w-4xl mx-auto">
          {/* Quote Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faQuoteLeft} className="text-white text-xl" />
            </div>
          </div>

          {/* Main Quote */}
          <blockquote className="text-center mb-8">
            <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              "It's a great fit for table-heavy products like ours. It's affordable, lightweight,
              feature-rich, and easy to customize."
            </p>
            <footer className="text-gray-600 dark:text-gray-300">
              <div className="font-semibold">ChartMetric</div>
              <div className="text-sm">Music Analytics Platform</div>
            </footer>
          </blockquote>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                $19K+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                First-year savings vs AG Grid
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">99%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Customization needs met
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                Highly Responsive
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Support & bug fixes
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              type="primary"
              size="large"
              onClick={() => router.push("/case-studies/chartmetric")}
              className="hover:scale-105 transition-transform"
            >
              Read the Full Case Study
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
