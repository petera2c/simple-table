import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTable,
  faCheckCircle,
  faTimesCircle,
  faBalanceScale,
  faLightbulb,
  faBolt,
  faCode,
  faTrophy,
  faRocket,
  faPalette,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import { SIMPLE_TABLE_INFO, ANT_DESIGN_TABLE_INFO } from "@/constants/packageInfo";
import Link from "next/link";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.antDesignTableVsSimpleTable.title,
  description: SEO_STRINGS.blogPosts.antDesignTableVsSimpleTable.description,
  keywords: SEO_STRINGS.blogPosts.antDesignTableVsSimpleTable.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.antDesignTableVsSimpleTable.title,
    description: SEO_STRINGS.blogPosts.antDesignTableVsSimpleTable.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.antDesignTableVsSimpleTable.title,
    description: SEO_STRINGS.blogPosts.antDesignTableVsSimpleTable.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/ant-design-table-vs-simple-table",
  },
};

export default function AntDesignTableVsSimpleTablePage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Ant Design Table vs Simple Table: Component Library vs Lightweight Grid
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faBalanceScale} />
            Comparison
          </span>
          <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faBolt} />
            Performance
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faLightbulb} />
            Decision Guide
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Ant Design Table comes bundled with the popular Ant Design component library. Simple Table
          is a standalone, lightweight grid. Which should you choose? This comparison breaks down
          bundle size, features, and when to use each.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8 mb-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You're building a React app and need a data table. If you're already using Ant
                Design, the Table component seems like the obvious choice—it's right there, styled
                consistently, integrated with the design system. But if you're <em>not</em> using
                Ant Design, or if bundle size matters, pulling in the entire Ant Design library just
                for tables might be overkill.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>Ant Design Table</strong> is a full-featured table component that's part of
                the broader Ant Design ecosystem. It's opinionated about styling, works seamlessly
                with other Ant components, and handles most common table needs out of the box. But
                it comes with a significant bundle size cost.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>Simple Table</strong> is a standalone, lightweight React data grid with no
                dependencies on design systems. It's built specifically for React, highly
                performant, and gives you complete control over styling while keeping your bundle
                small.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                This isn't about "which is better"—they serve different needs. This comparison helps
                you understand the tradeoffs and choose the right tool for your specific situation.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Comparison */}
        <section id="quick-comparison">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faTrophy} className="text-gold-500" />
              Quick Comparison at a Glance
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      Criteria
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      Ant Design Table
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      Simple Table
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">License</td>
                    <td className="p-3 text-green-600 dark:text-green-400">MIT (Free)</td>
                    <td className="p-3 text-green-600 dark:text-green-400">MIT (Free)</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Bundle Size
                    </td>
                    <td className="p-3 text-red-600 dark:text-red-400">
                      {ANT_DESIGN_TABLE_INFO.bundleSizeMinGzip}*
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400 font-bold">
                      {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Dependencies
                    </td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">Requires Ant Design</td>
                    <td className="p-3 text-green-600 dark:text-green-400">Zero dependencies</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">Styling</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Ant Design theme</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">CSS variables/custom</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">Setup Time</td>
                    <td className="p-3 text-green-600 dark:text-green-400">Fast (if using Ant)</td>
                    <td className="p-3 text-green-600 dark:text-green-400">15 minutes</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Customization
                    </td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">
                      Within Ant Design system
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400">Completely flexible</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">Best For</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Ant Design apps</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">React apps (any style)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
              *Ant Design Table bundle size includes required Ant Design core dependencies
            </div>
          </div>
        </section>

        {/* Bundle Size Deep Dive */}
        <section id="bundle-size">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
              The Bundle Size Story: {ANT_DESIGN_TABLE_INFO.bundleSizeMinGzip} vs{" "}
              {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                This is where the decision becomes critical for many teams. Bundle size directly
                impacts load time, especially on mobile networks.
              </p>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border border-red-300 dark:border-red-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Ant Design Table: The Component Library Tax
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-red-200 dark:border-red-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Table Component Alone
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">~60KB</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-red-200 dark:border-red-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      With Required Ant Design Core
                    </div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {ANT_DESIGN_TABLE_INFO.bundleSizeMinGzip}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-4">
                  <strong>Important:</strong> If you're already using Ant Design for buttons, forms,
                  modals, etc., this cost is amortized across all components. But if you only need a
                  table, you're paying for the entire design system.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 border border-green-300 dark:border-green-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Simple Table: Lightweight by Design
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Complete Package (UI + Logic)
                  </div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✓ Includes virtualization, sorting, filtering, pagination, all features
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Real-World Impact
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  On a slow 3G connection, {ANT_DESIGN_TABLE_INFO.bundleSizeMinGzip} takes ~3-4
                  seconds to download. {SIMPLE_TABLE_INFO.bundleSizeMinGzip} takes ~0.4 seconds. For
                  customer-facing apps, mobile-first products, or emerging markets, this difference
                  matters.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section id="features">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faTable} className="text-blue-500" />
              Feature Comparison
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Feature
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Ant Design Table
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Simple Table
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Sorting</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Filtering</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Pagination</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Column Resizing</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Column Pinning</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ (fixed)
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Row Selection</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Column Reordering</td>
                      <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">
                        Column Visibility Toggle
                      </td>
                      <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Row Grouping</td>
                      <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">
                        Aggregation Functions
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Summary
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Built-in
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Virtualization</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Cell Editing</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Nested Headers</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">TypeScript</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓ Good</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Excellent
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Key insight:</strong> Ant Design Table covers basics well but lacks
                  advanced features like{" "}
                  <Link
                    href="/docs/column-reordering"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    column reordering
                  </Link>
                  , visibility toggles, and{" "}
                  <Link
                    href="/docs/row-grouping"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    row grouping
                  </Link>
                  . Simple Table is a standalone React library with more comprehensive features
                  built-in, at 1/4 the bundle size. See the{" "}
                  <Link
                    href="/comparisons/simple-table-vs-ant-design"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    full feature comparison
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Styling & Customization */}
        <section id="styling">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faPalette} className="text-purple-500" />
              Styling & Customization: Opinionated vs Flexible
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-blue-500" />
                    Ant Design Table
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Opinionated Styling:</strong> Follows Ant Design principles and theme
                    system.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>Matches other Ant Design components automatically</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>Theme customization via Less/CSS variables</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-red-500 mt-1 flex-shrink-0"
                      />
                      <span>Hard to break out of Ant Design aesthetic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-red-500 mt-1 flex-shrink-0"
                      />
                      <span>Requires understanding Ant Design's class structure</span>
                    </li>
                  </ul>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBolt} className="text-green-500" />
                    Simple Table
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Flexible Styling:</strong> CSS variables, themes, or bring your own
                    styles.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        Works with any CSS framework for React (Tailwind, CSS Modules, etc.)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>Simple CSS variable customization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>Custom renderers for complete control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>No design system lock-in</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  The Key Question: Are You Using Ant Design?
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  If yes → Ant Design Table makes sense for consistency. If no → pulling in the
                  entire Ant Design system just for tables is likely overkill. Simple Table gives
                  you table functionality without the component library overhead.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* When to Choose Each */}
        <section id="when-to-choose">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              When to Choose Each: Decision Framework
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="space-y-6">
                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-blue-500" />
                    Choose Ant Design Table When:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-blue-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        You're <strong>already using Ant Design</strong> for other components
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-blue-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        You want <strong>visual consistency</strong> with Ant Design ecosystem
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-blue-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        You're building an <strong>internal admin tool</strong> where bundle size
                        doesn't matter
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-blue-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        Your team is <strong>already familiar</strong> with Ant Design patterns
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBolt} className="text-green-500" />
                    Choose Simple Table When:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        You're <strong>not using Ant Design</strong> and don't want the overhead
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        <strong>Bundle size matters</strong> (customer-facing, mobile-first apps)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        You want <strong>complete styling freedom</strong> without design system
                        constraints
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        You need <strong>native features</strong> like aggregation and row grouping
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        You prefer a <strong>simple, focused API</strong> over ecosystem integration
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Scenarios */}
        <section id="scenarios">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-purple-500" />
              Real-World Scenarios
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🏢 Enterprise Admin Dashboard (Already Using Ant Design)
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    You're building an internal CRM using Ant Design forms, buttons, modals. Need
                    user and deal tables.
                  </p>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    ✅ Recommendation: <strong>Ant Design Table</strong> — Already committed to Ant
                    Design, maintain consistency
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🚀 SaaS Product (Customer-Facing)
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Building a project management tool. Not using any component library. Performance
                    and bundle size critical.
                  </p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    ✅ Recommendation: <strong>Simple Table</strong> — Lightweight, no design system
                    lock-in, full features
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    📱 Mobile-First Analytics App
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Need responsive data tables on mobile devices. Every KB counts for initial load
                    time.
                  </p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    ✅ Recommendation: <strong>Simple Table</strong> — Smallest bundle wins on
                    mobile networks
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🎨 Custom-Designed Dashboard
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Designer created a unique visual style that doesn't match Ant Design aesthetic.
                    Need complete styling control.
                  </p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    ✅ Recommendation: <strong>Simple Table</strong> — Easier to customize outside
                    component library constraints
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              The Verdict: Context Matters
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The decision between Ant Design Table and Simple Table isn't about quality—both are
                excellent. It's about <strong>context</strong>:
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  The Simple Question
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
                  <strong>Are you already using Ant Design?</strong>
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">YES:</span>
                    <span>Use Ant Design Table for consistency and integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">NO:</span>
                    <span>
                      Simple Table gives you all features without the ~60KB component library
                      overhead
                    </span>
                  </li>
                </ul>
              </div>

              <p className="text-gray-700 dark:text-gray-300">
                For most standalone React apps (especially customer-facing or mobile-first), Simple
                Table's lightweight approach and zero dependencies make it the practical choice. For
                Ant Design apps, stick with the ecosystem for consistency. Both libraries will serve
                you well within their intended contexts.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Build lightweight, feature-rich tables without design system overhead"
        description="Simple Table delivers complete data grid functionality in just 24KB—3× smaller than Ant Design Table with dependencies. Get sorting, filtering, pagination, grouping, and more without compromising on features."
        primaryButton={{
          text: "View Documentation",
          href: "/docs/installation",
        }}
        secondaryButton={{
          text: "See Full Comparison",
          href: "/comparisons/simple-table-vs-ant-design",
        }}
      />
    </BlogLayout>
  );
}
