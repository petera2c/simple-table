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
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import { SIMPLE_TABLE_INFO, MANTINE_DATATABLE_INFO } from "@/constants/packageInfo";
import Link from "next/link";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.mantineDatatableVsSimpleTable.title,
  description: SEO_STRINGS.blogPosts.mantineDatatableVsSimpleTable.description,
  keywords: SEO_STRINGS.blogPosts.mantineDatatableVsSimpleTable.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.mantineDatatableVsSimpleTable.title,
    description: SEO_STRINGS.blogPosts.mantineDatatableVsSimpleTable.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.mantineDatatableVsSimpleTable.title,
    description: SEO_STRINGS.blogPosts.mantineDatatableVsSimpleTable.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/mantine-datatable-vs-simple-table",
  },
};

export default function MantineDatatableVsSimpleTablePage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Mantine DataTable vs Simple Table: Mantine UI Integration vs Standalone Grid
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faBalanceScale} />
            Comparison
          </span>
          <span className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faBolt} />
            Performance
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faLightbulb} />
            Decision Guide
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Mantine DataTable brings beautiful, dark-theme-aware tables to Mantine UI apps with
          extensive features. Simple Table offers standalone flexibility without framework lock-in.
          Both are MIT licensed—but which fits your project? This comparison covers bundle size,
          Mantine dependencies, and real-world use cases.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8 mb-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You're building a React app and need a data table. If you're already using{" "}
                <strong>Mantine UI</strong>, Mantine DataTable seems like the obvious
                choice—beautiful styling out of the box, dark theme support, perfect integration
                with your existing Mantine components. But is it always the right choice?
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>Mantine DataTable</strong> is a feature-rich table component built
                specifically for Mantine UI applications. It's lightweight within the Mantine
                ecosystem, dependency-free (except for Mantine itself), and brings desktop-grade
                features like Gmail-style batch row selection, context menus, and drag-and-drop
                support. Used by Microsoft, Namecheap, and thousands of developers worldwide.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>Simple Table</strong> is a standalone React data grid with zero dependencies
                on any UI framework. It's framework-agnostic, lighter, and highly performant. You
                get all the features without committing to Mantine UI or any design system. If
                you're evaluating alternatives,{" "}
                <Link
                  href="/blog/ag-grid-alternatives-free-react-data-grids"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  check out our comparison of free React data grids
                </Link>
                .
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                This comparison helps you understand when Mantine UI integration is worth the
                dependency cost, and when a lightweight standalone alternative makes more sense.
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
                      Mantine DataTable
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
                    <td className="p-3 text-amber-600 dark:text-amber-400">
                      {MANTINE_DATATABLE_INFO.bundleSizeMinGzip}*
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400 font-bold">
                      {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Dependencies
                    </td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">
                      Requires Mantine UI (core + hooks)
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400">Zero dependencies</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">Styling</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Mantine theme</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">CSS variables/custom</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">Dark Mode</td>
                    <td className="p-3 text-green-600 dark:text-green-400">
                      ✓ Automatic via Mantine
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400">✓ Built-in themes</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">Setup Time</td>
                    <td className="p-3 text-green-600 dark:text-green-400">
                      Fast (if using Mantine)
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400">15 minutes</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">Best For</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Mantine UI apps</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      Any React app (no framework required)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
              *Mantine DataTable bundle size excludes Mantine UI core dependencies (add ~100KB+ if
              not already using Mantine)
            </div>
          </div>
        </section>

        {/* Bundle Size Deep Dive */}
        <section id="bundle-size">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
              The Bundle Size Reality: What You Actually Ship
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Bundle size matters for load time, especially on mobile. Let's break down what
                you're actually shipping:
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Mantine DataTable: The Mantine UI Stack
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Mantine DataTable
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {MANTINE_DATATABLE_INFO.bundleSizeMinGzip}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      @mantine/core (peer)
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">~80KB</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      @mantine/hooks (peer)
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">~20KB</div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-blue-300 dark:border-blue-700">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Total (if not using Mantine)
                  </div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ~195KB min+gzip
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    If already using Mantine UI: ~{MANTINE_DATATABLE_INFO.bundleSizeMinGzip} only
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-4">
                  <strong>Key point:</strong> If you're already using Mantine UI for buttons, forms,
                  modals, etc., Mantine DataTable's cost is amortized. But if you're only adding
                  Mantine UI for tables, you're paying a steep price.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 border border-green-300 dark:border-green-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Simple Table: Complete Package
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Everything Included (UI + Logic + Features)
                  </div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✓ Virtualization, sorting, filtering, pagination, grouping, all features
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-4">
                  <strong>No hidden costs:</strong> What you see is what you get. No peer
                  dependencies, no UI framework requirements.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Real-World Impact
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  On a slow 3G connection: Mantine DataTable stack (~195KB for new Mantine apps)
                  takes ~5-6 seconds to download. Simple Table (
                  {SIMPLE_TABLE_INFO.bundleSizeMinGzip}) takes ~1.2 seconds. For mobile-first apps
                  or emerging markets, this is critical.
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
                Both libraries are feature-rich, but they take different approaches. Mantine
                DataTable includes some unique features, while Simple Table focuses on core data
                grid functionality.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Feature
                      </th>
                      <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Mantine DataTable
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
                      <td className="p-3 text-gray-700 dark:text-gray-300">Column Reordering</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Drag & drop
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Column Toggling</td>
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
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Gmail-style
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Row Grouping</td>
                      <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Row Expansion</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Nested tables
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Nested Tables</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Virtualization</td>
                      <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Built-in
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Context Menus</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Built-in
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Via renderers
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Row Dragging</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Via @hello-pangea/dnd
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Via callbacks
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Cell Editing</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Via custom
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-gray-700 dark:text-gray-300">Dark Mode</td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Automatic
                      </td>
                      <td className="p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Built-in
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
                  <strong>Feature parity with tradeoffs:</strong> Mantine DataTable includes
                  Gmail-style selection and built-in context menus. Simple Table adds{" "}
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
                  . The real difference is Mantine UI integration vs standalone flexibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Mantine UI Integration Story */}
        <section id="mantine-integration">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faPalette} className="text-purple-500" />
              The Mantine UI Integration Story
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Mantine DataTable's biggest selling point is seamless Mantine UI integration. But
                how much does that matter?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-blue-500" />
                    Mantine DataTable
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Opinionated Mantine Styling:</strong> Perfect integration with Mantine
                    UI theme system.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>Automatic dark theme via Mantine ColorScheme</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>Matches Mantine Button, TextInput, Select, etc.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>Inherits your Mantine theme automatically</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>Beautiful out-of-the-box design</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-red-500 mt-1 flex-shrink-0"
                      />
                      <span>Can't use without Mantine UI</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-red-500 mt-1 flex-shrink-0"
                      />
                      <span>Breaking out of Mantine styling is hard</span>
                    </li>
                  </ul>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBolt} className="text-green-500" />
                    Simple Table
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Framework-Agnostic Styling:</strong> Works with any design system.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>Works with Tailwind, CSS Modules, Styled Components, Mantine</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>CSS variable customization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>Custom renderers for any component library</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>Can integrate Mantine components if you want</span>
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
                  The Critical Question
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Are you already using Mantine UI?</strong> If yes, Mantine DataTable is a
                  natural fit. If no, ask yourself: "Am I willing to add 100KB+ of Mantine UI just
                  for tables?" For most projects, the answer is no.
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
                    Choose Mantine DataTable When:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-blue-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        You're <strong>already using Mantine UI extensively</strong> (forms,
                        buttons, modals, etc.)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-blue-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        <strong>Mantine design consistency</strong> is a hard requirement
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-blue-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        Your team is <strong>already familiar</strong> with Mantine UI patterns
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-blue-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        You want <strong>automatic dark mode</strong> via Mantine ColorScheme
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-blue-500 mt-1 flex-shrink-0"
                      />
                      <span>Bundle size isn't critical (internal tools, desktop-only apps)</span>
                    </li>
                  </ul>
                </div>

                <div className="border-2 border-green-300 dark:border-green-700 rounded-lg p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCrown} className="text-green-500" />
                    Choose Simple Table When:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        You're <strong>not using Mantine UI</strong> and don't want to add it just
                        for tables
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        <strong>Bundle size and performance</strong> are top priorities
                        (customer-facing, mobile-first)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        You want <strong>framework-agnostic tables</strong> that work with any CSS
                        solution
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        You need{" "}
                        <strong>
                          built-in virtualization for{" "}
                          <Link
                            href="/blog/handling-one-million-rows"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            large datasets
                          </Link>
                        </strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        You need <strong>row grouping and column pinning</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 flex-shrink-0"
                      />
                      <span>
                        You want <strong>zero dependencies</strong> and smallest possible bundle
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
                    🏢 Enterprise Dashboard (Mantine UI Design System)
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Building an internal analytics tool using Mantine UI for all components. Need
                    data tables that match the Mantine aesthetic perfectly.
                  </p>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    ✅ Recommendation: <strong>Mantine DataTable</strong> — Already invested in
                    Mantine, perfect integration
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🚀 SaaS Product (Custom Design)
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Building a customer-facing project management app with custom branding. Not
                    using any component library. Performance is critical.
                  </p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    ✅ Recommendation: <strong>Simple Table</strong> — No design system lock-in,
                    best performance
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    📱 Mobile-First Data App
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Building a mobile-optimized analytics app. Every KB counts for 3G users in
                    emerging markets. Need virtualization for large datasets.
                  </p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    ✅ Recommendation: <strong>Simple Table</strong> — 4× smaller bundle, built-in
                    virtualization
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🎨 Tailwind CSS App
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Building with Tailwind CSS. Want tables that match your utility-first approach,
                    not Mantine styling.
                  </p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    ✅ Recommendation: <strong>Simple Table</strong> — Works seamlessly with
                    Tailwind, no Mantine conflict
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🏗️ Migrating Away from Mantine UI
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Gradually moving away from Mantine UI to reduce bundle size. Don't want to add
                    Mantine dependencies for tables.
                  </p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    ✅ Recommendation: <strong>Simple Table</strong> — Helps you move away from
                    Mantine, not deeper into it
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
              The Verdict: Context Is Everything
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Both Mantine DataTable and Simple Table are excellent libraries with different
                strengths. The right choice depends entirely on your <strong>context</strong>:
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  The Simple Question
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
                  <strong>Are you already deeply invested in Mantine UI?</strong>
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">YES, using Mantine everywhere:</span>
                    <span>
                      Mantine DataTable is a natural fit. The ~95KB cost is amortized across your
                      existing Mantine investment.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">NO, not using Mantine:</span>
                    <span>
                      Simple Table gives you all features without 100KB+ of Mantine UI overhead.
                      It's 4× smaller and works with any CSS framework.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold">MAYBE, considering Mantine:</span>
                    <span>
                      Don't let tables be the reason you add Mantine UI. Simple Table is lighter and
                      more flexible.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Bundle Size Reality Check
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  For apps not using Mantine UI: Mantine DataTable stack = ~195KB. Simple Table ={" "}
                  {SIMPLE_TABLE_INFO.bundleSizeMinGzip}. That's a <strong>4× difference</strong>{" "}
                  that directly impacts load time, especially on mobile.
                </p>
              </div>

              <p className="text-gray-700 dark:text-gray-300">
                For standalone React apps, mobile-first products, or teams avoiding design system
                lock-in, Simple Table's lightweight approach wins. For Mantine UI apps where
                consistency trumps bundle size, Mantine DataTable is excellent. Both are MIT
                licensed and production-ready—choose based on your constraints, not arbitrary
                preferences. For more context on choosing the right table library,{" "}
                <Link
                  href="/blog/best-free-react-data-grid-2026"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  see our guide to the best free React data grids
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
                    href="/blog/ka-table-vs-simple-table"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    → ka-table vs Simple Table
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
        title="Build React tables without Mantine UI overhead"
        description={`Simple Table delivers complete data grid functionality in just ${SIMPLE_TABLE_INFO.bundleSizeMinGzip}—4× smaller than Mantine DataTable with dependencies. Get sorting, filtering, pagination, grouping, virtualization, and more without locking into Mantine UI.`}
        primaryButton={{
          text: "View Documentation",
          href: "/docs/installation",
        }}
        secondaryButton={{
          text: "See Live Examples",
          href: "/examples",
        }}
      />
    </BlogLayout>
  );
}
