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
  faCubes,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import { SIMPLE_TABLE_FRAMEWORKS_SHORT } from "@/constants/frameworkIntegrationHub";
import { SIMPLE_TABLE_INFO, RSUITE_TABLE_INFO } from "@/constants/packageInfo";
import Link from "next/link";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.rsuiteTableVsSimpleTable.title,
  description: SEO_STRINGS.blogPosts.rsuiteTableVsSimpleTable.description,
  keywords: SEO_STRINGS.blogPosts.rsuiteTableVsSimpleTable.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.rsuiteTableVsSimpleTable.title,
    description: SEO_STRINGS.blogPosts.rsuiteTableVsSimpleTable.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.rsuiteTableVsSimpleTable.title,
    description: SEO_STRINGS.blogPosts.rsuiteTableVsSimpleTable.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/rsuite-table-vs-simple-table",
  },
};

export default function RsuiteTableVsSimpleTablePage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          RSuite Table vs Simple Table: Enterprise UI Suite vs Standalone Grid
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faBalanceScale} />
            Comparison
          </span>
          <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCubes} />
            UI Library vs Standalone
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          RSuite Table is part of the RSuite enterprise UI library with 102KB overhead and design
          system integration. Simple Table is framework-agnostic at 42KB. This comparison helps you
          choose between UI suite consistency and standalone flexibility.
        </p>
        <p className="text-base max-w-3xl mx-auto text-center text-gray-600 dark:text-gray-400 mt-4">
          Official adapters cover {SIMPLE_TABLE_FRAMEWORKS_SHORT}.{" "}
          <Link
            href="/frameworks"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Framework setup hub
          </Link>
          .
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8 mb-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCubes} className="text-blue-500" />
                  RSuite Ecosystem Context
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  RSuite Table is part of <strong>RSuite (React Suite)</strong>, a comprehensive UI
                  library with 50+ components for enterprise applications. If you're already using
                  RSuite, the table integrates seamlessly. If not, you're adding a large dependency
                  for one component.
                </p>
              </div>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You're evaluating React data grids and found <strong>RSuite Table</strong> (89k
                weekly downloads, 741 GitHub stars). It's the table component from the RSuite design
                system, offering virtualization, fixed columns, resizable columns, tree tables, and
                expandable rows. Published 8 months ago, it's actively maintained and MIT licensed.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>RSuite Table</strong> is designed for enterprise applications that value
                design consistency across all UI components. It follows RSuite's design language
                with built-in theming, RTL support, and accessibility features. The API is
                component-based (Table, Column, HeaderCell, Cell) with props for configuration.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>Simple Table</strong> is a standalone data grid with zero dependencies. It's
                not tied to any design system, giving you freedom to style it however you want.
                Despite being 2.4× smaller (42KB vs 102KB), it includes features RSuite Table
                lacks—like row grouping and column pinning. For more comparisons,{" "}
                <Link
                  href="/blog/ag-grid-alternatives-free-react-data-grids"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  see our guide to free React data grids
                </Link>
                .
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                This comparison explores when RSuite Table's design system integration is worth the
                bundle size, and when Simple Table's standalone approach offers better flexibility.
                We'll examine bundle size, features, ecosystem lock-in, and real-world scenarios.
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
                      RSuite Table
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
                      Bundle Size (min+gzip)
                    </td>
                    <td className="p-3 text-red-600 dark:text-red-400">
                      {RSUITE_TABLE_INFO.bundleSizeMinGzip}*
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400 font-bold">
                      {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Weekly Downloads
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">89k</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Growing</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      GitHub Stars
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">741</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Growing</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Last Updated
                    </td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">8 months ago</td>
                    <td className="p-3 text-green-600 dark:text-green-400">Active (2026)</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Dependencies
                    </td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">
                      Part of RSuite ecosystem
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400">Zero dependencies</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Design System
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400">RSuite (enterprise)</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">None (flexible)</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">Best For</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      RSuite users, design consistency
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      Standalone use, any design system
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
              *Estimated bundle size: 15% of unpacked size (678KB)
            </div>
          </div>
        </section>

        {/* Bundle Size Analysis */}
        <section id="bundle-size">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-yellow-500" />
              Bundle Size: Simple Table is 2.4× Smaller
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                RSuite Table weighs <strong>~102KB min+gzipped</strong>—the largest among free React
                table libraries we've compared. Simple Table is <strong>42KB</strong>, 2.4× smaller.
                This 60KB difference impacts initial page load significantly.
              </p>

              <div className="bg-linear-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-300 dark:border-orange-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Bundle Size Breakdown
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        RSuite Table
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">~102 KB</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                      <div
                        className="bg-linear-to-r from-orange-500 to-red-500 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ width: "100%" }}
                      >
                        100%
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        Simple Table
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">42 KB</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                      <div
                        className="bg-linear-to-r from-green-500 to-teal-500 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ width: "41%" }}
                      >
                        41%
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Size difference: 60 KB</strong> — RSuite Table's overhead is 143% of
                      Simple Table's entire bundle. On slower connections, this translates to 1-2
                      seconds longer load time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  RSuite Ecosystem Consideration
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  If you're already using RSuite components (Buttons, Forms, Modals, etc.), the
                  table fits seamlessly into your design system. However, if you're only using the
                  table, you're paying a 60KB premium for design system integration you don't fully
                  utilize.
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
              Feature Comparison: Design System vs Standalone Power
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                RSuite Table provides solid enterprise features. Simple Table matches most and adds
                features RSuite lacks:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Feature
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">
                        RSuite Table
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Simple Table
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/10">
                      <td
                        colSpan={3}
                        className="p-3 font-semibold text-gray-900 dark:text-gray-100"
                      >
                        Core Table Features
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Sorting</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Server-side
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Pagination</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ With RSuite Pagination
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Row Selection</td>
                      <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                        △ Via custom cells
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Built-in
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Expandable Rows</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Nested
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Tree Tables</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ isTree prop
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Nested rows
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/10">
                      <td
                        colSpan={3}
                        className="p-3 font-semibold text-gray-900 dark:text-gray-100"
                      >
                        Advanced Features
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Virtualization</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ virtualized prop
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Built-in
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Fixed Columns</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ left/right
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Pinning
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Column Resizing</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ resizable prop
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Column Reordering</td>
                      <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Row Grouping</td>
                      <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Column Grouping</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ ColumnGroup
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Nested headers
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Cell/Row Spanning</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ colSpan/rowSpan
                      </td>
                      <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                        △ Via custom cells
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Filtering</td>
                      <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                        △ Manual/server-side
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>

                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/10">
                      <td
                        colSpan={3}
                        className="p-3 font-semibold text-gray-900 dark:text-gray-100"
                      >
                        UI & Theming
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Design System</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ RSuite
                      </td>
                      <td className="p-3 text-center text-gray-700 dark:text-gray-300">
                        Framework-agnostic
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">RTL Support</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Built-in
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Custom Styling</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ LESS/CSS
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ CSS-in-JS
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">TypeScript</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Excellent
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Excellent
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Feature trade-offs:</strong> RSuite Table excels at cell/row spanning and
                  has built-in RTL. Simple Table adds row grouping, column reordering, and built-in
                  filtering. Both support virtualization and fixed columns well.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem Lock-in */}
        <section id="ecosystem">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCubes} className="text-orange-500" />
              Ecosystem Consideration: RSuite Lock-in vs Standalone Freedom
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Choosing RSuite Table means committing to the RSuite ecosystem. This has pros and
                cons:
              </p>

              <div className="bg-linear-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-300 dark:border-orange-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  RSuite Ecosystem: Design System Integration
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Consistent design:</strong> Table matches RSuite buttons, forms,
                      modals, etc.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Enterprise theming:</strong> Built-in light/dark themes, RTL support
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Full component suite:</strong> 50+ components for complete apps
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Framework lock-in:</strong> Hard to migrate away from RSuite design
                      language
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Bundle overhead:</strong> Each RSuite component adds to total bundle
                      size
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Styling constraints:</strong> Custom styling requires overriding
                      RSuite LESS/CSS
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-linear-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 border border-green-300 dark:border-green-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Simple Table: Framework-Agnostic Freedom
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Zero dependencies:</strong> No UI framework required
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Works with any design system:</strong> Material-UI, Chakra UI,
                      Tailwind, custom CSS
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Full styling control:</strong> CSS-in-JS via props, no framework to
                      fight
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Easy migration:</strong> Swap out for any other table library without
                      breaking your design
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>No pre-built themes:</strong> You style it from scratch (tradeoff for
                      flexibility)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  The Lock-in Question
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>RSuite Table:</strong> Great if you're all-in on RSuite. Risky if you're
                  only using the table—you're locked into their design language for one component.{" "}
                  <strong>Simple Table:</strong> Use any design system you want, switch anytime.
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
              Decision Framework: When to Choose Each Library
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-2 border-orange-300 dark:border-orange-700 rounded-lg p-6 bg-linear-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Choose RSuite Table When:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-orange-500 mt-1 shrink-0"
                      />
                      <span>
                        Already using <strong>RSuite components</strong> (buttons, forms, etc.)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-orange-500 mt-1 shrink-0"
                      />
                      <span>
                        Want <strong>design system consistency</strong> across all UI components
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-orange-500 mt-1 shrink-0"
                      />
                      <span>
                        Need <strong>cell/row spanning</strong> (colspan/rowspan) heavily
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-orange-500 mt-1 shrink-0"
                      />
                      <span>
                        Building <strong>enterprise apps</strong> with RTL/i18n requirements
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-orange-500 mt-1 shrink-0"
                      />
                      <span>Don't need row grouping or column reordering</span>
                    </li>
                  </ul>
                </div>

                <div className="border-2 border-green-300 dark:border-green-700 rounded-lg p-6 bg-linear-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Choose Simple Table When:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 shrink-0"
                      />
                      <span>
                        <strong>Not using RSuite</strong> (avoid 102KB for one component)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 shrink-0"
                      />
                      <span>
                        Want <strong>framework-agnostic</strong> solution (works with any design
                        system)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 shrink-0"
                      />
                      <span>
                        Need <strong>smallest bundle</strong> (42KB vs 102KB)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 shrink-0"
                      />
                      <span>
                        Require <strong>row grouping</strong> or <strong>column reordering</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 shrink-0"
                      />
                      <span>
                        Want <strong>built-in filtering</strong> and advanced features
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
              <FontAwesomeIcon icon={faLayerGroup} className="text-teal-500" />
              Real-World Scenarios
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="space-y-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900/30">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    Scenario 1: Enterprise Admin Panel (All RSuite)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Context:</strong> Building a full admin dashboard with RSuite buttons,
                    forms, navigation, modals, and data tables. Need consistent design.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">
                        RSuite Table
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Perfect fit.</strong> Already using RSuite everywhere—table
                        integrates seamlessly with same theming, RTL, and design language. Bundle
                        overhead is amortized across all components.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                        Simple Table
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Not ideal.</strong> Would require custom styling to match RSuite's
                        design. You'd lose design consistency across components.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900/30">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    Scenario 2: Standalone Product Catalog
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Context:</strong> Building a product listing page with custom Tailwind
                    design. No other UI framework used.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                        RSuite Table
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Overkill.</strong> Adding 102KB RSuite Table for one component is
                        wasteful. RSuite's design won't match your Tailwind custom design.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                        Simple Table
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Perfect fit.</strong> 42KB standalone, style with Tailwind CSS as
                        needed. No framework lock-in, no design system to fight.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900/30">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    Scenario 3: Financial Report with Row Grouping
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Context:</strong> Display transactions grouped by category, with summary
                    rows and 50k records virtualized.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                        RSuite Table
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Missing feature.</strong> No built-in row grouping. You'd need to
                        manually organize data into tree structure or build custom solution.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                        Simple Table
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Built-in support.</strong> Row grouping and virtualization included.
                        See our{" "}
                        <Link
                          href="/blog/handling-one-million-rows"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          1M row guide
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
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
              The Verdict: Ecosystem Commitment vs Standalone Flexibility
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                RSuite Table and Simple Table serve different needs. The decision hinges on whether
                you're already invested in the RSuite ecosystem:
              </p>

              <div className="bg-linear-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border-2 border-orange-300 dark:border-orange-700 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  RSuite Table: Design System Integration
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>✓ Perfect if using RSuite components across your app</li>
                  <li>✓ Consistent enterprise design language</li>
                  <li>✓ Built-in RTL, accessibility, and theming</li>
                  <li>✓ Excellent cell/row spanning support</li>
                  <li>✗ 102KB bundle (2.4× larger than Simple Table)</li>
                  <li>✗ Framework lock-in if only using table</li>
                  <li>✗ No row grouping or column reordering</li>
                </ul>
              </div>

              <div className="bg-linear-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 border-2 border-green-300 dark:border-green-700 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Simple Table: Framework-Agnostic Power
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>✓ 42KB—2.4× smaller than RSuite Table</li>
                  <li>✓ Zero dependencies, works with any design system</li>
                  <li>✓ Row grouping, column reordering built-in</li>
                  <li>✓ Actively maintained (2026)</li>
                  <li>✓ No framework lock-in</li>
                  <li>△ No pre-built RSuite theme (style from scratch)</li>
                </ul>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>Our recommendation:</strong> If you're building an enterprise app with
                RSuite components everywhere, RSuite Table is the natural choice—design consistency
                matters. But if you're not using RSuite, or only need the table, you're paying a
                60KB premium (143% overhead) for design system integration you don't use. Simple
                Table delivers more features in 2.4× less space with no framework lock-in.
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                For other UI library comparisons, see{" "}
                <Link
                  href="/blog/material-react-table-vs-simple-table"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Material React Table
                </Link>
                ,{" "}
                <Link
                  href="/blog/mantine-datatable-vs-simple-table"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Mantine DataTable
                </Link>
                , or our{" "}
                <Link
                  href="/blog/best-free-react-data-grid-2026"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  complete guide to free React data grids
                </Link>
                .
              </p>

              <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Related Comparisons:
                </p>
                <div className="flex gap-4 flex-wrap text-sm">
                  <Link
                    href="/blog/react-table-library-vs-simple-table"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    → React Table Library vs Simple Table
                  </Link>
                  <Link
                    href="/blog/ant-design-table-vs-simple-table"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    → Ant Design Table (another UI library)
                  </Link>
                  <Link
                    href="/blog/handling-one-million-rows"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    → Virtualization guide
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Get enterprise features without the ecosystem lock-in"
        description={`Simple Table delivers virtualization, row grouping, column pinning, and more in just ${SIMPLE_TABLE_INFO.bundleSizeMinGzip}—2.4× smaller than RSuite Table. Zero dependencies on RSuite; official adapters for ${SIMPLE_TABLE_FRAMEWORKS_SHORT}.`}
        primaryButton={{
          text: "View Documentation",
          href: "/docs/installation",
        }}
        secondaryButton={{
          text: "View Quick Start",
          href: "/docs/quick-start",
        }}
      />
    </BlogLayout>
  );
}
