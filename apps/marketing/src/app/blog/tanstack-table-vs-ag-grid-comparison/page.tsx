import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTable,
  faCode,
  faCheckCircle,
  faBalanceScale,
  faChartLine,
  faDollarSign,
  faLightbulb,
  faTrophy,
  faExclamationTriangle,
  faThumbsUp,
  faThumbsDown,
  faCrown,
  faBolt,
  faShieldAlt,
  faGraduationCap,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import {
  SIMPLE_TABLE_INFO,
  AG_GRID_COMMUNITY_INFO,
  TANSTACK_TABLE_INFO,
} from "@/constants/packageInfo";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.tanstackVsAgGrid.title,
  description: SEO_STRINGS.blogPosts.tanstackVsAgGrid.description,
  keywords: SEO_STRINGS.blogPosts.tanstackVsAgGrid.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.tanstackVsAgGrid.title,
    description: SEO_STRINGS.blogPosts.tanstackVsAgGrid.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.tanstackVsAgGrid.title,
    description: SEO_STRINGS.blogPosts.tanstackVsAgGrid.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/tanstack-table-vs-ag-grid-comparison",
  },
};

export default function TanStackVsAgGridPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          TanStack Table (React Table) vs AG Grid: Complete Comparison (2025)
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faBalanceScale} />
            Side-by-Side
          </span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faChartLine} />
            Data-Driven
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faLightbulb} />
            Honest Analysis
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          TanStack Table (formerly React Table) or AG Grid? We break down features, performance,
          pricing, and developer experience to help you choose the right React data grid.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                TanStack Table (formerly known as React Table, now at v8) and AG Grid represent two
                fundamentally different philosophies for building data grids in React. TanStack
                Table (React Table) is the minimalist's choice—a headless, logic-only library that
                gives you complete UI control. AG Grid is the maximalist's toolbox—a feature-packed,
                batteries-included solution with opinions about everything.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Both are excellent libraries backed by strong communities, but they serve different
                needs. This comprehensive comparison will help you understand which one fits your
                project, budget, and team—or whether there's a better alternative altogether.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                We'll cover licensing, bundle size, features, performance, developer experience, and
                real-world use cases. By the end, you'll know exactly which library (if either) is
                right for you.
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
                      TanStack Table (React Table)
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      AG Grid
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
                    <td className="p-3 text-red-600 dark:text-red-400">MIT + $999+/year</td>
                    <td className="p-3 text-green-600 dark:text-green-400">MIT (Free)</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Bundle Size
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {TANSTACK_TABLE_INFO.bundleSizeMinGzip}
                    </td>
                    <td className="p-3 text-red-600 dark:text-red-400">
                      {AG_GRID_COMMUNITY_INFO.bundleSizeMinGzip}
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400 font-bold">
                      {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      UI Included
                    </td>
                    <td className="p-3 text-red-600 dark:text-red-400">No (headless)</td>
                    <td className="p-3 text-green-600 dark:text-green-400">Yes</td>
                    <td className="p-3 text-green-600 dark:text-green-400">Yes</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Learning Curve
                    </td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">Steep</td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">Steep</td>
                    <td className="p-3 text-green-600 dark:text-green-400">Gentle</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Time to First Table
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">2-4 hours</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">1-2 hours</td>
                    <td className="p-3 text-green-600 dark:text-green-400 font-bold">15 minutes</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">TypeScript</td>
                    <td className="p-3 text-green-600 dark:text-green-400">Excellent</td>
                    <td className="p-3 text-green-600 dark:text-green-400">Good</td>
                    <td className="p-3 text-green-600 dark:text-green-400">Excellent</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">Best For</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Custom UIs</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Complex enterprise</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Quick setup</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Philosophy Differences */}
        <section id="philosophy">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-blue-500" />
              Core Philosophy: Headless vs Batteries-Included
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCode} className="text-blue-500" />
                  TanStack Table (React Table): Headless
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Philosophy:</strong> "We handle the logic, you handle the UI." (Formerly
                  React Table, now TanStack Table v8)
                </p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Provides hooks and utilities for table logic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Zero opinions about rendering or styling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>You build the table markup yourself</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Ultimate flexibility and control</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700">
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <strong>Result:</strong> You get exactly what you build—nothing more, nothing
                    less.
                  </p>
                </div>
              </div>

              <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-6 bg-purple-50 dark:bg-purple-900/20">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTable} className="text-purple-500" />
                  AG Grid: Batteries-Included
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Philosophy:</strong> "We provide everything. Just configure it."
                </p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Complete component with built-in UI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Strong opinions about rendering and behavior</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Pass configuration, get a working grid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Customization through APIs and CSS</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-purple-300 dark:border-purple-700">
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <strong>Result:</strong> Fast setup, but you work within AG Grid's framework.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* License & Pricing */}
        <section id="licensing">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faDollarSign} className="text-green-500" />
              License & Pricing: The $5,000/Year Difference
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-green-500" />
                  TanStack Table
                </h3>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    $0
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Forever. No catches.
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>MIT licensed—completely free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>All features included, no tiers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Commercial use allowed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>No per-developer fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>No deployment restrictions</span>
                  </li>
                </ul>
              </div>

              <div className="border border-red-200 dark:border-red-700 rounded-lg p-6 bg-red-50 dark:bg-red-900/20">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faDollarSign} className="text-red-500" />
                  AG Grid
                </h3>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Community (Free):
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">$0</div>
                  <div className="text-xs text-red-600 dark:text-red-400 mb-3">
                    ⚠️ Basic features only
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Enterprise:</div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">$999+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    per developer per year
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded p-3 border border-red-300 dark:border-red-700">
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                    <strong>For a team of 5:</strong>
                  </p>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    $5,000/year minimum
                  </p>
                </div>
                <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                  * Enterprise features: row grouping, aggregation, Excel export, master-detail,
                  etc.
                </div>
              </div>
            </div>

            <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    The License Trap
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Many teams start with AG Grid Community, then hit a paywall when they need
                    enterprise features. By then, they're locked in—migration becomes expensive and
                    time-consuming.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bundle Size & Performance */}
        <section id="performance">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
              Bundle Size & Performance
            </h2>

            <div className="space-y-4">
              <div className="bg-linear-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Bundle Size Comparison
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      TanStack Table
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {TANSTACK_TABLE_INFO.bundleSizeMinGzip}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Headless only
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-red-200 dark:border-red-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      AG Grid Community
                    </div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {AG_GRID_COMMUNITY_INFO.bundleSizeMinGzip}
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-400 mt-1">3x larger!</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Simple Table
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Smallest + UI!
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  What This Means in Practice
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>TanStack Table:</strong> Lightweight but you need to add UI code (adds
                      ~10-20KB) and virtualization libraries (~5-10KB). Real-world total: ~30KB.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>AG Grid:</strong> Heavy out of the box. Enterprise version adds even
                      more weight (~200KB+). Impacts mobile performance significantly.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Simple Table:</strong> Smallest complete solution. Includes UI,
                      virtualization, and all features in just {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
                      .
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section id="features">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faChartLine} className="text-blue-500" />
              Feature Comparison
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      Feature
                    </th>
                    <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">
                      TanStack
                    </th>
                    <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">
                      AG Grid Free
                    </th>
                    <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">
                      AG Grid Paid
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
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Filtering</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Pagination</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Virtualization</td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">Plugin</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">
                      ✓ Built-in
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Row Selection</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Column Resizing</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Column Pinning</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓ ($$$)</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓ Free</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Row Grouping</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓ ($$$)</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓ Free</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Aggregation</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓ ($$$)</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓ Free</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Cell Editing</td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">DIY</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Excel Export</td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">DIY</td>
                    <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓ ($$$)</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">CSV ✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">UI Included</td>
                    <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Key Insight:</strong> TanStack Table has the features but you build the UI.
                AG Grid Community lacks advanced features (paywall). Simple Table includes
                everything for free.
              </p>
            </div>
          </div>
        </section>

        {/* Developer Experience */}
        <section id="developer-experience">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faGraduationCap} className="text-purple-500" />
              Developer Experience & Learning Curve
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  TanStack Table
                </h3>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faClock} className="text-blue-500" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Time to First Table:
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    2-4 hours (with basic styling)
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2 text-sm">
                      <FontAwesomeIcon icon={faThumbsUp} />
                      Strengths
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Excellent TypeScript support</li>
                      <li>• Great documentation</li>
                      <li>• Active community</li>
                      <li>• Clean, React-idiomatic API</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2 text-sm">
                      <FontAwesomeIcon icon={faThumbsDown} />
                      Challenges
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Steep initial learning curve</li>
                      <li>• Must build UI from scratch</li>
                      <li>• Need separate virtualization library</li>
                      <li>• More code to write and maintain</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-6 bg-purple-50 dark:bg-purple-900/20">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">AG Grid</h3>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faClock} className="text-purple-500" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      Time to First Table:
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    1-2 hours (basic config)
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2 text-sm">
                      <FontAwesomeIcon icon={faThumbsUp} />
                      Strengths
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Comprehensive documentation</li>
                      <li>• Many examples and demos</li>
                      <li>• UI provided out of box</li>
                      <li>• Mature, stable codebase</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2 text-sm">
                      <FontAwesomeIcon icon={faThumbsDown} />
                      Challenges
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Massive API surface to learn</li>
                      <li>• Configuration can be overwhelming</li>
                      <li>• Customization requires CSS-in-depth</li>
                      <li>• Frequent paywall surprises</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-linear-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border border-green-300 dark:border-green-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faCrown} className="text-green-500" />
                Simple Table: The Middle Ground
              </h3>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faClock} className="text-green-500" />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Time to First Table:
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm font-bold">
                  15 minutes (production-ready)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    <span>Gentle learning curve</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    <span>Intuitive prop-based API</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    <span>UI included with customization</span>
                  </li>
                </ul>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    <span>Excellent TypeScript support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    <span>All features included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    <span>Clear, focused documentation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section id="use-cases">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              Which Should You Choose? Use Cases
            </h2>

            <div className="space-y-4">
              <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTrophy} className="text-green-500" />
                  Choose Simple Table When:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>You need to ship quickly without sacrificing features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Bundle size and performance are priorities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>You want all features free without license fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Your team prefers simple, intuitive APIs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>You're building customer-facing applications</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-green-300 dark:border-green-700">
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <strong>Best for:</strong> 90% of React applications needing data grids
                  </p>
                </div>
              </div>

              <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCode} className="text-blue-500" />
                  Choose TanStack Table When:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-blue-500 mt-1 shrink-0"
                    />
                    <span>You need absolute control over UI and rendering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-blue-500 mt-1 shrink-0"
                    />
                    <span>Your design is highly custom and non-standard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-blue-500 mt-1 shrink-0"
                    />
                    <span>You want complete control and don't mind building UI components</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-blue-500 mt-1 shrink-0"
                    />
                    <span>You might need to support multiple frameworks</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700">
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <strong>Best for:</strong> Projects needing highly customized table UIs
                  </p>
                </div>
              </div>

              <div className="border border-red-200 dark:border-red-700 rounded-lg p-6 bg-red-50 dark:bg-red-900/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faDollarSign} className="text-red-500" />
                  Choose AG Grid When:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>You have budget for enterprise licenses ($5K+/year)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>You need Excel-parity features (pivot tables, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>Internal enterprise tools where bundle size doesn't matter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>Your team is already trained on AG Grid</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-red-300 dark:border-red-700">
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <strong>Best for:</strong> Complex enterprise apps with large budgets
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final Verdict */}
        <section id="verdict">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCrown} className="text-gold-500" />
              The Verdict: There's a Better Option
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                TanStack Table and AG Grid are both excellent, well-maintained libraries with strong
                communities. Each has different tradeoffs:
              </p>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="text-amber-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>TanStack Table</strong> offers maximum flexibility and control, but
                    you'll need to build the UI layer yourself.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="text-amber-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>AG Grid</strong> provides a complete solution with advanced features,
                    but requires a paid license for enterprise functionality.
                  </span>
                </li>
              </ul>

              <div className="bg-linear-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border-2 border-green-300 dark:border-green-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTrophy} className="text-green-500" />
                  Simple Table: The Sweet Spot
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Simple Table bridges the gap</strong> between TanStack's "build
                  everything" approach and AG Grid's "pay everything" model. You get:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      <span>
                        <strong>Complete UI included</strong> (unlike TanStack)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      <span>
                        <strong>100% free forever</strong> (unlike AG Grid)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      <span>
                        <strong>Tiny bundle</strong> ({SIMPLE_TABLE_INFO.bundleSizeMinGzip})
                      </span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      <span>
                        <strong>All features included</strong>
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      <span>
                        <strong>Easy to learn</strong> (15 min to first table)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      <span>
                        <strong>Fully customizable</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg">
                For many projects, <strong>Simple Table offers a practical middle ground</strong>{" "}
                between TanStack's flexibility and AG Grid's completeness—providing the features you
                need without the complexity or cost.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Skip the tradeoffs. Choose Simple Table."
        description="Get TanStack Table's features with a built-in UI. Get AG Grid's completeness without the price tag. Simple Table delivers the best of both worlds in one lightweight, free package."
        primaryButton={{
          text: "Try Simple Table Free",
          href: "/docs/installation",
        }}
        secondaryButton={{
          text: "Compare All Features",
          href: "/comparisons/simple-table-vs-ag-grid",
        }}
      />
    </BlogLayout>
  );
}
