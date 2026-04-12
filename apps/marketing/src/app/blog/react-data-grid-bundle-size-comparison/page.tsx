import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWeightHanging,
  faRocket,
  faCheckCircle,
  faBalanceScale,
  faChartLine,
  faLightbulb,
  faTrophy,
  faExclamationTriangle,
  faFeather,
  faBolt,
  faGauge,
  faMobileAlt,
  faCode,
  faFire,
  faCloudDownloadAlt,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import { Button } from "antd";
import { DEFAULT_EXAMPLE_PATH } from "@/constants/global";
import ExampleLink from "@/components/ExampleLink";
import {
  SIMPLE_TABLE_INFO,
  AG_GRID_COMMUNITY_INFO,
  TANSTACK_TABLE_INFO,
  MATERIAL_REACT_TABLE_INFO,
  HANDSONTABLE_INFO,
  ANT_DESIGN_TABLE_INFO,
} from "@/constants/packageInfo";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.bundleSizeComparison.title,
  description: SEO_STRINGS.blogPosts.bundleSizeComparison.description,
  keywords: SEO_STRINGS.blogPosts.bundleSizeComparison.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.bundleSizeComparison.title,
    description: SEO_STRINGS.blogPosts.bundleSizeComparison.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.bundleSizeComparison.title,
    description: SEO_STRINGS.blogPosts.bundleSizeComparison.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/react-data-grid-bundle-size-comparison",
  },
};

export default function BundleSizeComparisonPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          React Data Grid Bundle Size Showdown: Finding the Lightest Solution (2025)
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faFeather} />
            Lightweight
          </span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faGauge} />
            Performance
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faChartLine} />
            Data-Driven
          </span>
          <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faMobileAlt} />
            Mobile-First
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          When memory footprint is critical, which free React data grid has the lightest bundle
          size? We measured them all so you don't have to.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Bundle size matters. Every kilobyte you add to your JavaScript bundle increases load
                times, impacts Core Web Vitals, and potentially costs you conversions. For users on
                slow connections or mobile devices, a bloated bundle isn't just inconvenient—it's a
                deal-breaker.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Yet when you search for "lightweight React data grid" or "smallest React table
                library," you'll find plenty of claims but few hard numbers. We decided to change
                that.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                In this comprehensive analysis, we've measured the actual bundle sizes of every
                major React data grid library—minified and gzipped, just like your users will
                download them. We're not just comparing raw numbers; we're examining what you get
                for those kilobytes and which libraries deliver the best performance-per-byte ratio.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon icon={faLightbulb} className="text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      TL;DR - The Winner
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <strong>Simple Table at {SIMPLE_TABLE_INFO.bundleSizeMinGzip}</strong> is one
                      of the lightest full-featured React data grids. It's about 3x smaller than AG
                      Grid while providing the core features most applications need.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Bundle Size Matters */}
        <section id="why-bundle-size-matters">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faGauge} className="text-red-500" />
              Why Bundle Size Matters More Than Ever
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Bundle size isn't just a vanity metric. It has real-world consequences:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faCloudDownloadAlt} className="text-red-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Load Time Impact
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    On a slow 3G connection (1.6 Mbps), every 100KB adds ~500ms to load time. A
                    150KB library vs 50KB is 500ms slower—before parsing and execution.
                  </p>
                </div>

                <div className="border border-orange-200 dark:border-orange-700 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faMobileAlt} className="text-orange-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Mobile Performance
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Mobile CPUs are 4-5x slower at parsing JavaScript. Large bundles can cause
                    multi-second delays on budget Android devices.
                  </p>
                </div>

                <div className="border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faChartLine} className="text-yellow-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      SEO & Core Web Vitals
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Google's Core Web Vitals directly affect your search rankings. Bundle size
                    impacts LCP (Largest Contentful Paint) and TBT (Total Blocking Time).
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faFire} className="text-green-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      User Experience
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Amazon found that every 100ms of latency costs them 1% in sales. Your users
                    won't wait for bloated libraries to load.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      The 100KB Budget
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Best practice recommends keeping your{" "}
                      <strong>total JavaScript bundle under 100-150KB (gzipped)</strong>. A single
                      data grid library shouldn't consume your entire budget.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testing Methodology */}
        <section id="methodology">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-blue-500" />
              Testing Methodology
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                To ensure accurate, real-world measurements:
              </p>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Fresh Create React App:</strong> Using Vite with production builds
                    (minified + tree-shaken)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Gzipped sizes:</strong> What users actually download (typical ~70%
                    compression)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Core package only:</strong> No optional plugins or dependencies unless
                    required
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Latest versions:</strong> As of January 2025
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Basic usage:</strong> Simple table with sorting and filtering enabled
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* The Results */}
        <section id="results">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faTrophy} className="text-gold-500" />
              The Results: Bundle Size Rankings
            </h2>

            <div className="space-y-4">
              {/* Winner - Simple Table */}
              <div className="bg-linear-to-br from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border-2 border-green-300 dark:border-green-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      🏆 #1 LIGHTEST
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Simple Table
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      minified + gzipped
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Minified Size
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Parse Time (mobile)
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">~50ms</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Download (3G)
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">~250ms</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    What You Get:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      <span>Sorting & Filtering</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      <span>Virtualization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      <span>Row Selection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      <span>Cell Editing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      <span>Column Resizing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      <span>Custom Renderers</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TanStack Table */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      #2
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      TanStack Table
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {TANSTACK_TABLE_INFO.bundleSizeMinGzip}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      minified + gzipped
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Note:</strong> Headless library—you provide the UI. Add ~10-20KB for
                  virtualization plugins.
                </p>
              </div>

              {/* Material React Table */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      #3
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Material React Table
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {MATERIAL_REACT_TABLE_INFO.bundleSizeMinGzip}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      minified + gzipped
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Note:</strong> Requires Material-UI (~80KB). Total impact is larger if not
                  already using MUI.
                </p>
              </div>

              {/* Ant Design Table */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      #4
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Ant Design Table
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {ANT_DESIGN_TABLE_INFO.bundleSizeMinGzip}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      minified + gzipped
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Note:</strong> Part of Ant Design ecosystem. Good if already using antd.
                </p>
              </div>

              {/* AG Grid Community */}
              <div className="border border-red-200 dark:border-red-700 rounded-lg p-6 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      #5
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      AG Grid Community
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {AG_GRID_COMMUNITY_INFO.bundleSizeMinGzip}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      minified + gzipped
                    </div>
                  </div>
                </div>
                <div className="bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded p-3">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    <strong>3x larger than Simple Table!</strong> AG Grid Enterprise adds even more
                    weight (~200KB+).
                  </p>
                </div>
              </div>

              {/* Handsontable */}
              <div className="border border-red-200 dark:border-red-700 rounded-lg p-6 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      #6
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Handsontable
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {HANDSONTABLE_INFO.bundleSizeMinGzip}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      minified + gzipped
                    </div>
                  </div>
                </div>
                <div className="bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded p-3">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    <strong>Heaviest option</strong> and requires a commercial license for most
                    uses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Chart */}
        <section id="comparison-chart">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBalanceScale} className="text-purple-500" />
              Side-by-Side Comparison
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      Library
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      Bundle (gzip)
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      3G Load
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      Mobile Parse
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      Features
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Simple Table
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400 font-bold">
                      {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">~250ms</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">~50ms</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Complete</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">TanStack Table</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {TANSTACK_TABLE_INFO.bundleSizeMinGzip}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">~320ms</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">~65ms</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Headless</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Material React Table</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {MATERIAL_REACT_TABLE_INFO.bundleSizeMinGzip}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">~400ms</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">~80ms</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Complete + MUI</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Ant Design Table</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {ANT_DESIGN_TABLE_INFO.bundleSizeMinGzip}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">~500ms</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">~100ms</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Complete + antd</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
                    <td className="p-3 text-gray-700 dark:text-gray-300">AG Grid Community</td>
                    <td className="p-3 text-red-600 dark:text-red-400 font-bold">
                      {AG_GRID_COMMUNITY_INFO.bundleSizeMinGzip}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">~750ms</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">~150ms</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Basic</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Handsontable</td>
                    <td className="p-3 text-red-600 dark:text-red-400 font-bold">
                      {HANDSONTABLE_INFO.bundleSizeMinGzip}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">~900ms</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">~180ms</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Spreadsheet</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
              * Load times based on typical 3G connection (1.6 Mbps). Parse times estimated for
              mid-range mobile devices.
            </div>
          </div>
        </section>

        {/* Real-World Impact */}
        <section id="real-world-impact">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faGauge} className="text-blue-500" />
              Real-World Impact: What This Means for Your Users
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Let's translate these numbers into actual user experience:
              </p>

              <div className="bg-linear-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Scenario: E-commerce Dashboard on Mobile 3G
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} />
                      With Simple Table ({SIMPLE_TABLE_INFO.bundleSizeMinGzip})
                    </h5>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Download: 250ms</li>
                      <li>• Parse + Execute: 50ms</li>
                      <li>
                        • <strong>First Interactive: ~300ms</strong>
                      </li>
                      <li className="text-green-600 dark:text-green-400 font-semibold">
                        ✓ Instant, smooth experience
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faExclamationTriangle} />
                      With AG Grid ({AG_GRID_COMMUNITY_INFO.bundleSizeMinGzip})
                    </h5>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Download: 750ms</li>
                      <li>• Parse + Execute: 150ms</li>
                      <li>
                        • <strong>First Interactive: ~900ms</strong>
                      </li>
                      <li className="text-red-600 dark:text-red-400 font-semibold">
                        ✗ Noticeable lag, frustration
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong className="text-blue-600 dark:text-blue-400">
                      Simple Table saves 600ms
                    </strong>{" "}
                    on mobile—enough to make the difference between users staying or bouncing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Beyond Bundle Size */}
        <section id="beyond-bundle-size">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
              Beyond Bundle Size: Runtime Performance
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Bundle size is just the start. Runtime performance matters too:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faRocket} className="text-green-500" />
                    Simple Table
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 shrink-0"
                      />
                      <span>Efficient virtual scrolling handles 50K+ rows</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 shrink-0"
                      />
                      <span>Minimal re-renders with optimized React patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 shrink-0"
                      />
                      <span>Small bundle = faster parse = quicker Time to Interactive</span>
                    </li>
                  </ul>
                </div>

                <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faWeightHanging} className="text-red-500" />
                    Heavier Libraries
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-red-500 mt-1 shrink-0"
                      />
                      <span>More code to parse and execute on every page load</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-red-500 mt-1 shrink-0"
                      />
                      <span>Larger memory footprint affects low-end devices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-red-500 mt-1 shrink-0"
                      />
                      <span>Complex feature sets can slow down simple use cases</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* When Bundle Size Doesn't Matter */}
        <section id="when-size-doesnt-matter">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              When Bundle Size Might Not Matter (As Much)
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                To be fair, there are scenarios where bundle size is less critical:
              </p>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-blue-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Internal enterprise tools</strong> where users have fast connections and
                    powerful devices
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-blue-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Desktop-only applications</strong> with no mobile users
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-blue-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Lazy-loaded routes</strong> where the grid isn't on the initial bundle
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-blue-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Extremely complex requirements</strong> that genuinely need a
                    heavyweight solution
                  </span>
                </li>
              </ul>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>That said:</strong> Even in these scenarios, a lighter library means
                  faster load times and better user experience. Why ship 150KB when 50KB does the
                  job?
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section id="recommendations">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faTrophy} className="text-green-500" />
              Our Recommendations by Use Case
            </h2>

            <div className="space-y-4">
              <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTrophy} className="text-green-500" />
                  Best Overall: Simple Table
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>When:</strong> You need full features with minimal bundle impact
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  At {SIMPLE_TABLE_INFO.bundleSizeMinGzip}, Simple Table offers core features like
                  sorting, filtering, virtualization, and editing in a small package—a good choice
                  for most use cases.
                </p>
              </div>

              <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCode} className="text-blue-500" />
                  For Custom UIs: TanStack Table
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>When:</strong> You need complete control over rendering
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  At {TANSTACK_TABLE_INFO.bundleSizeMinGzip}, TanStack Table is lightweight but
                  requires you to build the UI. Good if you have specific design requirements.
                </p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faPalette} className="text-purple-500" />
                  For Design Systems: Material React Table or Ant Design
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>When:</strong> You're already using MUI or antd
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Bundle size is higher, but if you're already using the parent library, the
                  incremental cost is acceptable.
                </p>
              </div>

              <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
                  Avoid for Bundle-Sensitive Apps: AG Grid, Handsontable
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  At {AG_GRID_COMMUNITY_INFO.bundleSizeMinGzip} and{" "}
                  {HANDSONTABLE_INFO.bundleSizeMinGzip} respectively, these are heavier options.
                  They're worth considering if you need their specific advanced features and bundle
                  size is less of a concern.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-blue-500" />
              Conclusion: Choose Lightweight, Ship Fast
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Bundle size matters. Your users are on mobile devices, slow connections, and budget
                hardware. Every kilobyte you add to your bundle is a millisecond of delay—and
                milliseconds add up to bounce rates.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                When bundle size is a priority,{" "}
                <strong>Simple Table at {SIMPLE_TABLE_INFO.bundleSizeMinGzip}</strong> offers an
                excellent balance of size and features. It's about 3x smaller than AG Grid while
                providing the core functionality most applications need—and it's completely free.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                For public-facing applications, mobile apps, or projects where performance is
                critical, choosing a lightweight data grid can significantly improve user
                experience. Evaluate your specific needs and choose accordingly—sometimes the
                lightest option isn't necessary, but when it matters, it really matters.
              </p>

              <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-6 text-center">
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Stop shipping bloated libraries
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Choose Simple Table: lightweight, powerful, and built for speed.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/docs/installation">
                    <Button type="primary" size="large" icon={<FontAwesomeIcon icon={faRocket} />}>
                      Start Building →
                    </Button>
                  </Link>
                  <ExampleLink href={DEFAULT_EXAMPLE_PATH}>
                    <Button size="large" icon={<FontAwesomeIcon icon={faGauge} />}>
                      See Performance Demos
                    </Button>
                  </ExampleLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Ready for a lightning-fast React data grid?"
        description={`At just ${SIMPLE_TABLE_INFO.bundleSizeMinGzip}, Simple Table is the lightest full-featured data grid for React. Get enterprise capabilities without the enterprise bundle size. Your users—and your Core Web Vitals—will thank you.`}
        primaryButton={{
          text: "Install Simple Table",
          href: "/docs/installation",
        }}
        secondaryButton={{
          text: "Compare Features",
          href: "/comparisons/simple-table-vs-ag-grid",
        }}
      />
    </BlogLayout>
  );
}
