"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRocket,
  faTable,
  faDownload,
  faCode,
  faCodeBranch,
  faList,
  faGaugeHigh,
  faMobileAlt,
  faPalette,
  faCheck,
  faColumns,
  faPuzzlePiece,
  faShieldAlt,
  faHeadset,
  faBook,
  faArrowRightArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { motion } from "framer-motion";
import { SIMPLE_TABLE_FRAMEWORKS_SHORT } from "@/constants/frameworkIntegrationHub";
import { SIMPLE_TABLE_INFO, AG_GRID_TOTAL_SIZE } from "@/constants/packageInfo";
import { DEFAULT_EXAMPLE_PATH } from "@/constants/global";
import ExampleLink from "@/components/ExampleLink";

export default function FAQSection() {
  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">
        Frequently Asked Questions
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
        Everything you need to know about Simple Table
      </p>

      <div className="max-w-4xl mx-auto">
        {/* Getting Started Questions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faRocket} className="text-blue-600 dark:text-blue-400" />
            Getting Started
          </h3>
          <div className="space-y-3">
            {[
              {
                icon: faTable,
                question: "What is Simple Table?",
                answer: `Simple Table is a lightweight JavaScript data grid library (only ${SIMPLE_TABLE_INFO.bundleSizeMinGzip}) with adapters for React, Vue, Angular, Svelte, Solid, and vanilla TypeScript. It provides 30+ features including cell editing, column management, sorting, filtering, row grouping, and full TypeScript support. Perfect for dashboards, admin panels, and data-heavy applications in any framework.`,
              },
              {
                icon: faDownload,
                question: "How do I install and get started?",
                answer: (
                  <>
                    Install via npm with your framework adapter, e.g. 'npm install
                    @simple-table/react' (or @simple-table/vue, etc.). Define your columns and data,
                    and you're ready to go. Our{" "}
                    <Link
                      href="/docs/quick-start"
                      className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Quick Start guide
                    </Link>{" "}
                    has you up and running in any framework in under 5 minutes.
                  </>
                ),
              },
              {
                icon: faCode,
                question: "Does Simple Table support TypeScript?",
                answer:
                  "Yes! Simple Table is built with TypeScript and includes comprehensive type definitions out of the box. You get full autocomplete, type checking, and IntelliSense support, making development faster and reducing bugs.",
              },
              {
                icon: faCodeBranch,
                question: "Which frameworks and versions are supported?",
                answer:
                  "Simple Table supports React (16.8+, 18, 19), Vue 3, Angular 16+, Svelte 4+, Solid, and vanilla TypeScript. It works with Next.js, Nuxt, Analog, SvelteKit, SolidStart, and any modern bundler (Vite, Webpack, Rollup). You can also use it without a framework at all — just plain TypeScript or JavaScript.",
              },
            ].map((faq, index) => (
              <motion.details
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <summary className="p-3 sm:p-4 lg:p-5 cursor-pointer list-none flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <FontAwesomeIcon
                    icon={faq.icon}
                    className="text-blue-600 dark:text-blue-400 mt-1 shrink-0"
                  />
                  <span className="flex-1 font-semibold text-gray-800 dark:text-white">
                    {faq.question}
                  </span>
                  <FontAwesomeIcon
                    icon={faArrowRightArrowLeft}
                    className="text-gray-400 transform group-open:rotate-90 transition-transform shrink-0"
                  />
                </summary>
                <div className="px-3 pb-3 pl-8 sm:px-4 sm:pb-4 sm:pl-10 lg:px-5 lg:pb-5 lg:pl-11 text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.details>
            ))}
          </div>
        </div>

        {/* Features & Capabilities */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faPalette} className="text-purple-600 dark:text-purple-400" />
            Features & Capabilities
          </h3>
          <div className="space-y-3">
            {[
              {
                icon: faList,
                question: "What features does Simple Table include?",
                answer: (
                  <>
                    Simple Table includes 30+ features: cell editing with validation, column
                    resizing/reordering/pinning/filtering/sorting, row selection and grouping,
                    pagination and infinite scroll, nested headers, custom cell and header
                    renderers, live data updates, aggregate functions, keyboard navigation, multiple
                    built-in themes, and full customization via CSS variables. Check our{" "}
                    <Link
                      href="/docs/installation"
                      className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      documentation
                    </Link>{" "}
                    for the complete feature list.
                  </>
                ),
              },
              {
                icon: faGaugeHigh,
                question: "How does it perform with large datasets?",
                answer: `Simple Table uses virtual scrolling to render only visible rows, allowing smooth performance with 100,000+ rows. The tiny ${SIMPLE_TABLE_INFO.bundleSizeMinGzip} bundle size means fast initial load times. We've optimized rendering, sorting, and filtering to handle enterprise-scale data without lag or memory issues.`,
              },
              {
                icon: faMobileAlt,
                question: "Is it mobile responsive?",
                answer:
                  "Yes! Simple Table is fully responsive with mobile-first design. It automatically adapts to different screen sizes with touch-friendly interactions, horizontal scrolling for wide tables, and optimized rendering for mobile devices. Your data grids work seamlessly on desktop, tablet, and mobile.",
              },
              {
                icon: faPalette,
                question: "Can I customize the look and feel?",
                answer:
                  "Absolutely! Choose from multiple built-in themes (including dark mode), customize via CSS variables for colors/spacing/fonts, replace icons with your own, create custom cell and header renderers, or build a completely custom theme. We also provide a Theme Builder tool for visual customization.",
              },
            ].map((faq, index) => (
              <motion.details
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <summary className="p-3 sm:p-4 lg:p-5 cursor-pointer list-none flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <FontAwesomeIcon
                    icon={faq.icon}
                    className="text-purple-600 dark:text-purple-400 mt-1 shrink-0"
                  />
                  <span className="flex-1 font-semibold text-gray-800 dark:text-white">
                    {faq.question}
                  </span>
                  <FontAwesomeIcon
                    icon={faArrowRightArrowLeft}
                    className="text-gray-400 transform group-open:rotate-90 transition-transform shrink-0"
                  />
                </summary>
                <div className="px-3 pb-3 pl-8 sm:px-4 sm:pb-4 sm:pl-10 lg:px-5 lg:pb-5 lg:pl-11 text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.details>
            ))}
          </div>
        </div>

        {/* Comparisons & Alternatives */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faCheck} className="text-green-600 dark:text-green-400" />
            Comparisons & Migration
          </h3>
          <div className="space-y-3">
            {[
              {
                icon: faTable,
                question: "How does Simple Table compare to AG Grid?",
                answer: `Simple Table is much lighter (${SIMPLE_TABLE_INFO.bundleSizeMinGzip} vs ${AG_GRID_TOTAL_SIZE}) and completely free for most use cases. While AG Grid has more enterprise features, Simple Table provides all essential data grid functionality (editing, sorting, filtering, grouping, custom renderers) without licensing costs or bundle bloat. Perfect for teams who need 90% of the features at 1% of the size and cost.`,
              },
              {
                icon: faColumns,
                question: "How does it compare to TanStack Table?",
                answer:
                  "TanStack Table is a headless library requiring you to build the UI layer yourself. Simple Table is a complete, ready-to-use component with built-in styling, themes, and interactions. Both support multiple frameworks, but Simple Table ships a working grid out of the box. If you need a table running today (not in 2 weeks), Simple Table is the faster choice.",
              },
              {
                icon: faPuzzlePiece,
                question: "What about Material-UI or Ant Design tables?",
                answer: `Simple Table offers significantly more features than MUI or Ant Design's basic tables (column pinning, row grouping, inline editing, advanced filtering). Official adapters cover ${SIMPLE_TABLE_FRAMEWORKS_SHORT}, so the same grid can land in more than one frontend stack. Plus, our ${SIMPLE_TABLE_INFO.bundleSizeMinGzip} bundle won't add the overhead of entire UI libraries.`,
              },
              {
                icon: faRocket,
                question: "Can I migrate from another data grid library?",
                answer:
                  "Yes! Our API is intuitive and similar to other popular data grids. Most migrations take 1-2 hours. We provide migration guides for AG Grid, TanStack Table, and other common libraries. The column definition format is straightforward, making the switch smooth.",
              },
            ].map((faq, index) => (
              <motion.details
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-green-300 dark:hover:border-green-700 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <summary className="p-3 sm:p-4 lg:p-5 cursor-pointer list-none flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <FontAwesomeIcon
                    icon={faq.icon}
                    className="text-green-600 dark:text-green-400 mt-1 shrink-0"
                  />
                  <span className="flex-1 font-semibold text-gray-800 dark:text-white">
                    {faq.question}
                  </span>
                  <FontAwesomeIcon
                    icon={faArrowRightArrowLeft}
                    className="text-gray-400 transform group-open:rotate-90 transition-transform shrink-0"
                  />
                </summary>
                <div className="px-3 pb-3 pl-8 sm:px-4 sm:pb-4 sm:pl-10 lg:px-5 lg:pb-5 lg:pl-11 text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.details>
            ))}
          </div>
        </div>

        {/* Pricing & Support */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faHeadset} className="text-orange-600 dark:text-orange-400" />
            Pricing & Support
          </h3>
          <div className="space-y-3">
            {[
              {
                icon: faCheck,
                question: "Is Simple Table free to use?",
                answer:
                  "Yes! Simple Table is completely free for pre-revenue startups, side projects, and bootstrapped companies. For revenue-generating businesses, we offer affordable commercial licenses starting at just a fraction of AG Grid's enterprise pricing. Check our pricing page for details.",
              },
              {
                icon: faShieldAlt,
                question: "Is it production-ready and actively maintained?",
                answer:
                  "Absolutely! Simple Table is battle-tested in production by companies across multiple industries. We ship regular updates with new features, performance improvements, and bug fixes. The library is actively maintained with responsive support and a growing community.",
              },
              {
                icon: faHeadset,
                question: "What kind of support do you offer?",
                answer:
                  "We provide comprehensive documentation with interactive examples, GitHub discussions for community support, and dedicated email support for commercial license holders. Most questions are answered within 24 hours. We also take feature requests seriously and implement the most valuable ones.",
              },
              {
                icon: faBook,
                question: "Where can I find documentation and examples?",
                answer: (
                  <>
                    Our{" "}
                    <Link
                      href="/docs/installation"
                      className="text-orange-600 dark:text-orange-400 hover:underline cursor-pointer font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      documentation
                    </Link>{" "}
                    includes detailed guides for every feature, interactive live demos you can edit
                    in your browser, real-world{" "}
                    <ExampleLink
                      href={DEFAULT_EXAMPLE_PATH}
                      className="text-orange-600 dark:text-orange-400 hover:underline cursor-pointer font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      examples
                    </ExampleLink>{" "}
                    (billing, HR, infrastructure, manufacturing, sales), code snippets ready to
                    copy-paste, and a complete{" "}
                    <Link
                      href="/docs/api-reference"
                      className="text-orange-600 dark:text-orange-400 hover:underline cursor-pointer font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      API reference
                    </Link>
                    . Everything you need to succeed is here.
                  </>
                ),
              },
            ].map((faq, index) => (
              <motion.details
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-orange-300 dark:hover:border-orange-700 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <summary className="p-3 sm:p-4 lg:p-5 cursor-pointer list-none flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <FontAwesomeIcon
                    icon={faq.icon}
                    className="text-orange-600 dark:text-orange-400 mt-1 shrink-0"
                  />
                  <span className="flex-1 font-semibold text-gray-800 dark:text-white">
                    {faq.question}
                  </span>
                  <FontAwesomeIcon
                    icon={faArrowRightArrowLeft}
                    className="text-gray-400 transform group-open:rotate-90 transition-transform shrink-0"
                  />
                </summary>
                <div className="px-3 pb-3 pl-8 sm:px-4 sm:pb-4 sm:pl-10 lg:px-5 lg:pb-5 lg:pl-11 text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
