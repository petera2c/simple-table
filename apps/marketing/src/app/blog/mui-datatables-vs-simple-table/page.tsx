import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTable,
  faCheckCircle,
  faTimesCircle,
  faBalanceScale,
  faLightbulb,
  faTrophy,
  faRocket,
  faLayerGroup,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import { SIMPLE_TABLE_INFO, MUI_DATATABLES_INFO } from "@/constants/packageInfo";
import Link from "next/link";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.muiDatatablesVsSimpleTable.title,
  description: SEO_STRINGS.blogPosts.muiDatatablesVsSimpleTable.description,
  keywords: SEO_STRINGS.blogPosts.muiDatatablesVsSimpleTable.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.muiDatatablesVsSimpleTable.title,
    description: SEO_STRINGS.blogPosts.muiDatatablesVsSimpleTable.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.muiDatatablesVsSimpleTable.title,
    description: SEO_STRINGS.blogPosts.muiDatatablesVsSimpleTable.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/mui-datatables-vs-simple-table",
  },
};

export default function MuiDatatablesVsSimpleTablePage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900 dark:to-amber-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          MUI-Datatables vs Simple Table: Material-UI v4 Legacy vs Modern Standalone Grid
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faBalanceScale} />
            Comparison
          </span>
          <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Maintenance Warning
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faLightbulb} />
            Migration Guide
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          MUI-Datatables is a mature Material-UI table component with 2,700+ stars—but it hasn't
          been updated in 3 years and is stuck on Material-UI v4. Simple Table is actively
          maintained, modern, and standalone. This comparison helps you understand the risks and
          migration paths.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8 mb-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500" />
                  Maintenance Status Alert
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>MUI-Datatables last published: 3 years ago (2021).</strong> It only
                  supports Material-UI v4, which is no longer actively developed. Material-UI v5+
                  (now @mui/material) is the current standard. Consider this when choosing for new
                  projects or planning migrations.
                </p>
              </div>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You're evaluating data table options for a React app.{" "}
                <strong>MUI-Datatables</strong> appears in search results—it has 2,700+ GitHub
                stars, 40k weekly downloads, and comprehensive features. But there's a critical
                issue: it hasn't been updated since 2021 and only works with Material-UI v4.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>MUI-Datatables</strong> was once a popular choice for Material-UI
                applications. It offers filtering, resizable/draggable columns, search, CSV export,
                printing, selectable rows, expandable rows, pagination, and sorting. The codebase is
                mature and well-tested. However, it's effectively unmaintained and incompatible with
                modern Material-UI (v5+).
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>Simple Table</strong> is a standalone React data grid with zero dependencies
                on any UI framework. It's actively maintained, works with any React version, and has
                all modern features. If you're evaluating alternatives,{" "}
                <Link
                  href="/blog/ag-grid-alternatives-free-react-data-grids"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  check out our comparison of free React data grids
                </Link>
                .
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                This comparison helps you understand why MUI-Datatables is risky for new projects,
                and why Simple Table or{" "}
                <Link
                  href="/blog/material-react-table-vs-simple-table"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Material React Table
                </Link>{" "}
                (for MUI v5+) are better choices.
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
                      MUI-Datatables
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
                      Last Updated
                    </td>
                    <td className="p-3 text-red-600 dark:text-red-400 font-bold">
                      3 years ago (2021)
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400">Active (2026)</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Bundle Size (min+gzip)
                    </td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">
                      {MUI_DATATABLES_INFO.bundleSizeMinGzip}*
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400 font-bold">
                      {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Dependencies
                    </td>
                    <td className="p-3 text-red-600 dark:text-red-400">
                      Requires Material-UI v4 only
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400">Zero dependencies</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      MUI v5 Support
                    </td>
                    <td className="p-3 text-red-600 dark:text-red-400">✗ Not compatible</td>
                    <td className="p-3 text-green-600 dark:text-green-400">✓ Works anywhere</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Security Updates
                    </td>
                    <td className="p-3 text-red-600 dark:text-red-400">None (unmaintained)</td>
                    <td className="p-3 text-green-600 dark:text-green-400">Active</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">Best For</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      Legacy MUI v4 apps (not recommended)
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Any modern React app</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
              *MUI-Datatables bundle size excludes Material-UI v4 core dependencies (~150KB
              additional)
            </div>
          </div>
        </section>

        {/* The Maintenance Problem */}
        <section id="maintenance-problem">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500" />
              The Critical Maintenance Problem
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                MUI-Datatables' biggest issue isn't features or performance—it's that the project is
                effectively abandoned. Here's why this matters:
              </p>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border border-red-300 dark:border-red-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  MUI-Datatables: Stuck in 2021
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Last publish: 3 years ago (v4.3.0, 2021)</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Material-UI v4 only:</strong> No support for modern @mui/material
                      (v5+)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>No security updates:</strong> Vulnerable dependencies won't be patched
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>No bug fixes:</strong> Issues accumulate with no resolution
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>React 18+ issues:</strong> May have compatibility problems with modern
                      React
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Migration path unclear:</strong> No official successor or upgrade
                      guide
                    </span>
                  </li>
                </ul>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                  <strong>Important:</strong> Material-UI v4 entered maintenance mode in 2021. The
                  current version is @mui/material v6 (2024+). Using MUI-Datatables locks you into
                  an obsolete ecosystem.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 border border-green-300 dark:border-green-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Simple Table: Active Development
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Actively maintained:</strong> Regular updates and bug fixes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>React 18+ compatible:</strong> Works with latest React versions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Framework-agnostic:</strong> No Material-UI dependency
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Security updates:</strong> Dependencies kept current
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Community support:</strong> Active GitHub, Discord community
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Future-proof:</strong> Not tied to any framework version
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Real-World Impact
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Starting a new project with MUI-Datatables means:</strong> You're building
                  on a 3-year-old, unmaintained foundation that requires Material-UI v4 (also
                  obsolete). Security vulnerabilities won't be patched. Bugs won't be fixed. You'll
                  eventually need to migrate anyway—why not start with an active, modern solution?
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
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Despite maintenance issues, MUI-Datatables has comprehensive features. Here's how
                they compare:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Feature
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">
                        MUI-Datatables
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
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ 5 types
                      </td>
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
                      <td className="p-3 text-gray-700 dark:text-gray-300">Column Reordering</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Draggable
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Column Visibility</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Column Pinning</td>
                      <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Row Selection</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Row Grouping</td>
                      <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Expandable Rows</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Nested
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Virtualization</td>
                      <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Built-in
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Search</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Coming soon
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">CSV Export</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Built-in
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Via callback
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Print</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Built-in
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Via callback
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Responsive Modes</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ 3 modes
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Server-Side</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">TypeScript</td>
                      <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                        ✓ Basic
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
                  <strong>Feature parity with caveats:</strong> MUI-Datatables has solid features,
                  but they won't evolve. Simple Table adds{" "}
                  <Link
                    href="/docs/column-pinning"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    column pinning
                  </Link>
                  ,{" "}
                  <Link
                    href="/docs/row-grouping"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    row grouping
                  </Link>
                  , and{" "}
                  <Link
                    href="/blog/handling-one-million-rows"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    built-in virtualization
                  </Link>
                  , plus ongoing improvements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Migration Path */}
        <section id="migration">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-purple-500" />
              Migration Paths: Moving Away from MUI-Datatables
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                If you're using MUI-Datatables or considering it, here are your options:
              </p>

              <div className="space-y-6">
                <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    Option 1: Switch to Simple Table (Recommended)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Best for:</strong> Maximum flexibility, smallest bundle, no framework
                    lock-in
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="font-semibold">✓ Pros:</span>
                      <span>
                        No Material-UI dependency, 2× smaller bundle, actively maintained, works
                        with any CSS framework
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold">△ Migration:</span>
                      <span>
                        Moderate effort—API is different but concepts are similar. You'll need to
                        restyle to match your design system
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-blue-500" />
                    Option 2: Upgrade to Material React Table
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Best for:</strong> Staying in Material-UI ecosystem with modern MUI v5+
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="font-semibold">✓ Pros:</span>
                      <span>
                        Modern @mui/material support, actively maintained, similar feature set
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold">△ Migration:</span>
                      <span>
                        Requires upgrading Material-UI v4 → v5+ first (breaking changes), then
                        switching table library
                      </span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                    See our{" "}
                    <Link
                      href="/blog/material-react-table-vs-simple-table"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Material React Table comparison
                    </Link>{" "}
                    for details.
                  </p>
                </div>

                <div className="border border-red-200 dark:border-red-700 rounded-lg p-6 bg-red-50 dark:bg-red-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
                    Option 3: Stay on MUI-Datatables (Not Recommended)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Only for:</strong> Legacy apps with no migration budget
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="font-semibold">✗ Cons:</span>
                      <span>
                        No security updates, no bug fixes, stuck on Material-UI v4, eventual forced
                        migration
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold">⚠ Risk:</span>
                      <span>
                        Security vulnerabilities, incompatibility with future React versions,
                        dependency conflicts
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* When to Choose Each */}
        <section id="when-to-choose">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              Decision Framework: Should You Use MUI-Datatables?
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border-2 border-red-300 dark:border-red-700 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  The Simple Answer
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
                  <strong>Don't use MUI-Datatables for new projects.</strong>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  It's unmaintained, stuck on obsolete Material-UI v4, and has no security updates.
                  Choose Simple Table (standalone, modern, actively maintained) or Material React
                  Table (for MUI v5+ apps). The only exception: legacy maintenance where migration
                  isn't budgeted.
                </p>
              </div>

              <div className="border-2 border-green-300 dark:border-green-700 rounded-lg p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Choose Simple Table When:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      Starting a <strong>new project</strong> (any React version, any CSS framework)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      Want <strong>actively maintained</strong> code with regular updates
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      Need <strong>smallest bundle size</strong> (42KB vs 88KB)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      Want <strong>zero dependencies</strong> and framework flexibility
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      Need features MUI-Datatables lacks (virtualization, pinning, grouping)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              The Verdict: Choose Maintained, Modern Solutions
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                MUI-Datatables was once a solid choice, but three years without updates makes it
                unsuitable for production use in 2026. The risks outweigh any perceived benefits:
              </p>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Why MUI-Datatables is Risky
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>
                    <strong>Security:</strong> Vulnerabilities won't be patched
                  </li>
                  <li>
                    <strong>Compatibility:</strong> Stuck on Material-UI v4 (obsolete since 2021)
                  </li>
                  <li>
                    <strong>Future-proofing:</strong> No React 18+ guarantees, no modern features
                  </li>
                  <li>
                    <strong>Migration inevitability:</strong> You'll need to migrate eventually
                    anyway
                  </li>
                </ul>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>Simple Table</strong> offers everything MUI-Datatables has, plus:
              </p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-4">
                <li>✓ Active maintenance and security updates</li>
                <li>✓ 2× smaller bundle ({SIMPLE_TABLE_INFO.bundleSizeMinGzip} vs 88KB)</li>
                <li>✓ Works with any React version and CSS framework</li>
                <li>✓ Built-in virtualization, pinning, grouping</li>
                <li>✓ Modern TypeScript, React 18+ compatible</li>
                <li>✓ No framework lock-in</li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300">
                If you're using Material-UI v5+ and want design system integration,{" "}
                <Link
                  href="/blog/material-react-table-vs-simple-table"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Material React Table
                </Link>{" "}
                is the modern successor to MUI-Datatables. For standalone flexibility, Simple Table
                is your best choice. Both are actively maintained, MIT licensed, and
                production-ready. For more context,{" "}
                <Link
                  href="/blog/best-free-react-data-grid-2026"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  see our guide to the best free React data grids in 2026
                </Link>
                .
              </p>

              <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Related Comparisons:
                </p>
                <div className="flex gap-4 flex-wrap text-sm">
                  <Link
                    href="/blog/material-react-table-vs-simple-table"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    → Material-React-Table vs Simple Table
                  </Link>
                  <Link
                    href="/blog/mantine-datatable-vs-simple-table"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    → Mantine DataTable vs Simple Table
                  </Link>
                  <Link
                    href="/blog/react-data-grid-bundle-size-comparison"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    → Bundle size comparison
                  </Link>
                  <Link
                    href="/blog/best-react-table-libraries-2026"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    → Top React table libraries
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Choose actively maintained React tables"
        description={`Simple Table delivers complete data grid functionality in just ${SIMPLE_TABLE_INFO.bundleSizeMinGzip}—2× smaller than MUI-Datatables. Get sorting, filtering, pagination, grouping, virtualization, and more with active maintenance, security updates, and modern React 18+ support. No Material-UI dependency required.`}
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
