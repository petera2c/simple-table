import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTable,
  faCode,
  faRocket,
  faCheckCircle,
  faBalanceScale,
  faChartLine,
  faDollarSign,
  faLightbulb,
  faTrophy,
  faExclamationTriangle,
  faThumbsUp,
  faThumbsDown,
  faFeather,
  faShieldAlt,
  faBolt,
  faHeart,
  faGavel,
  faBan,
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
  HANDSONTABLE_INFO,
  TANSTACK_TABLE_INFO,
  AG_GRID_COMMUNITY_INFO,
} from "@/constants/packageInfo";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.handsontableAlternatives.title,
  description: SEO_STRINGS.blogPosts.handsontableAlternatives.description,
  keywords: SEO_STRINGS.blogPosts.handsontableAlternatives.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.handsontableAlternatives.title,
    description: SEO_STRINGS.blogPosts.handsontableAlternatives.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.handsontableAlternatives.title,
    description: SEO_STRINGS.blogPosts.handsontableAlternatives.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/handsontable-alternatives-free-react",
  },
};

export default function HandsontableAlternativesPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-orange-50 to-blue-50 dark:from-orange-900 dark:to-blue-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Handsontable Alternatives: Best Free Options for React (2025)
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faDollarSign} />
            100% Free
          </span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldAlt} />
            MIT Licensed
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faFeather} />
            Lightweight
          </span>
          <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faBan} />
            No License Fees
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Looking for Handsontable alternatives? Discover powerful, free React data grids that
          deliver spreadsheet-like features without the restrictive license or $1,000+ price tag.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Handsontable is a mature, feature-rich library that provides Excel-like spreadsheet
                functionality for web applications. It has a strong track record and handles complex
                data editing scenarios well. However, its licensing model requires payment for
                commercial use, with licenses starting at over $1,000 annually per developer.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                For projects with budget constraints or those that prefer permissive open-source
                licenses, you might be looking for alternatives. Additionally, Handsontable's bundle
                size ({HANDSONTABLE_INFO.bundleSizeMinGzip}) can impact performance, especially for
                mobile users.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The good news? The React ecosystem has excellent alternatives that offer similar
                spreadsheet functionality, better performance, smaller bundle sizes, and truly free
                licenses. In this guide, we'll explore the best Handsontable alternatives for React
                in 2025.
              </p>
            </div>
          </div>
        </section>

        {/* Why Leave Handsontable */}
        <section id="why-leave-handsontable">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faGavel} className="text-red-500" />
              Why Developers Are Leaving Handsontable
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faGavel} className="text-red-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Confusing License
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Non-commercial license with vague terms. Most real-world projects require a paid
                    commercial license, even for internal tools or startups.
                  </p>
                </div>

                <div className="border border-orange-200 dark:border-orange-700 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faDollarSign} className="text-orange-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Expensive Pricing
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Commercial licenses start at $1,090+ per developer annually. For a team of 5,
                    that's $5,000+ every year—forever.
                  </p>
                </div>

                <div className="border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faFeather} className="text-yellow-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Large Bundle Size
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    At {HANDSONTABLE_INFO.bundleSizeMinGzip}, Handsontable is one of the heaviest
                    data grid libraries. This significantly impacts page load times and mobile
                    performance.
                  </p>
                </div>

                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faBan} className="text-blue-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Vendor Lock-in
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Once you build around Handsontable's API, switching becomes difficult. The
                    longer you wait, the more expensive migration becomes.
                  </p>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      The License Minefield
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Handsontable's non-commercial license requires you to "not make any money"
                      from your project. This rules out:
                    </p>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 mt-2 ml-4 space-y-1">
                      <li>• Any commercial website or app</li>
                      <li>• Internal business tools</li>
                      <li>• Freelance or agency projects</li>
                      <li>• Open source projects with sponsors/donations</li>
                      <li>• Anything that could "indirectly" generate revenue</li>
                    </ul>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                      In practice, <strong>almost all real projects need a paid license</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What to Look For */}
        <section id="what-to-look-for">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-blue-500" />
              What to Look For in a Handsontable Alternative
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                When evaluating Handsontable alternatives, prioritize these features:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">
                      Spreadsheet Features:
                    </strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Cell editing, keyboard navigation, copy/paste, fill handle, and Excel-like
                      shortcuts.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">Data Grid Basics:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Sorting, filtering, pagination, column resizing, and row selection.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">Performance:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Virtualization for large datasets (1000+ rows) with smooth scrolling.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">
                      True Open Source License:
                    </strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      MIT or similar permissive license with no commercial restrictions.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">
                      Reasonable Bundle Size:
                    </strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Ideally under 100KB gzipped to maintain fast page loads.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">
                      Active Development:
                    </strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Regular updates, bug fixes, and responsive community or maintainer.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Alternatives */}
        <section id="best-alternatives">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faTrophy} className="text-gold-500" />
              Top Handsontable Alternatives for React
            </h2>
          </div>
        </section>

        {/* 1. Simple Table */}
        <section id="simple-table">
          <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4 md:p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                #1 BEST ALTERNATIVE
              </span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Simple Table</h3>
            </div>

            <p className="mb-6 text-gray-700 dark:text-gray-300 text-lg">
              Simple Table is a solid Handsontable alternative for teams who want spreadsheet-like
              functionality with a permissive license. At {SIMPLE_TABLE_INFO.bundleSizeMinGzip},
              it's about <strong>4x lighter than Handsontable</strong> while providing the core
              editing features most applications need—all under an MIT license.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-400">
                  <FontAwesomeIcon icon={faThumbsUp} />
                  Why Choose Simple Table
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Truly free:</strong> MIT licensed with no commercial restrictions or
                      hidden costs
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>4x lighter:</strong> {SIMPLE_TABLE_INFO.bundleSizeMinGzip} vs{" "}
                      {HANDSONTABLE_INFO.bundleSizeMinGzip} — significantly smaller bundle
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Excel-like editing:</strong> Click to edit cells, keyboard navigation,
                      copy/paste support
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Complete feature set:</strong> Sorting, filtering, virtualization, row
                      selection, custom renderers
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Quick setup:</strong> Get started in 15 minutes with intuitive API
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>TypeScript-first:</strong> Excellent type definitions and developer
                      experience
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>
                      <strong>Modern React:</strong> Built for React 18+ with hooks and best
                      practices
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-amber-700 dark:text-amber-400">
                  <FontAwesomeIcon icon={faLightbulb} />
                  Perfect For
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-amber-500 mt-1 shrink-0"
                    />
                    <span>Teams migrating away from Handsontable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-amber-500 mt-1 shrink-0"
                    />
                    <span>Commercial projects needing free licensing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-amber-500 mt-1 shrink-0"
                    />
                    <span>Apps prioritizing bundle size and performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-amber-500 mt-1 shrink-0"
                    />
                    <span>Data-heavy dashboards and admin tools</span>
                  </li>
                </ul>

                <div className="bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bundle Size
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      License
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      MIT (Free)
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cost
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      $0 Forever
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      TypeScript
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      ✓ Excellent
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison with Handsontable */}
            <div className="bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Simple Table vs Handsontable
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Bundle Size</span>
                    <div>
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2 text-xs">
                        vs {HANDSONTABLE_INFO.bundleSizeMinGzip}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Annual Cost (5 devs)</span>
                    <div>
                      <span className="text-green-600 dark:text-green-400 font-bold">$0</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2 text-xs">
                        vs $5,000+
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">License</span>
                    <div>
                      <span className="text-green-600 dark:text-green-400 font-bold">MIT</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2 text-xs">
                        vs Commercial
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Setup Time</span>
                    <div>
                      <span className="text-green-600 dark:text-green-400 font-bold">15 min</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2 text-xs">
                        vs 1-2 hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-linear-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border border-green-300 dark:border-green-700 rounded-lg p-6 text-center">
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Escape Handsontable's licensing nightmare
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Get comparable features with Simple Table's MIT license and{" "}
                {SIMPLE_TABLE_INFO.bundleSizeMinGzip} bundle. No fees, no restrictions, no regrets.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/docs/installation">
                  <Button type="primary" size="large" icon={<FontAwesomeIcon icon={faRocket} />}>
                    Get Started Free →
                  </Button>
                </Link>
                <ExampleLink href={DEFAULT_EXAMPLE_PATH}>
                  <Button size="large" icon={<FontAwesomeIcon icon={faCode} />}>
                    View Live Examples
                  </Button>
                </ExampleLink>
              </div>
            </div>
          </div>
        </section>

        {/* 2. React Data Grid */}
        <section id="react-data-grid">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faTable} className="text-purple-500" />
              2. React Data Grid (by Adazzle)
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              A lightweight Excel-like grid with built-in editing, keyboard navigation, and
              copy/paste. Good performance and MIT licensed.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-400">
                  <FontAwesomeIcon icon={faThumbsUp} />
                  Strengths
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>MIT licensed and completely free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Excel-like editing with keyboard support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Good performance with virtualization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Copy/paste functionality</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-red-700 dark:text-red-400">
                  <FontAwesomeIcon icon={faThumbsDown} />
                  Considerations
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>More focused on editing than general data display</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>Less flexible for custom layouts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>Smaller community than alternatives</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TanStack Table */}
        <section id="tanstack-table">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-blue-500" />
              3. TanStack Table + Custom UI
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              If you need complete control over the spreadsheet UI, TanStack Table provides the
              logic while you build the editing interface. Free and flexible but requires
              significant development time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-400">
                  <FontAwesomeIcon icon={faThumbsUp} />
                  Strengths
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>MIT licensed and free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Complete UI control</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Excellent TypeScript support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Lightweight core: {TANSTACK_TABLE_INFO.bundleSizeMinGzip}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-red-700 dark:text-red-400">
                  <FontAwesomeIcon icon={faThumbsDown} />
                  Considerations
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>Must build all UI from scratch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>No built-in editing or spreadsheet features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>Steep learning curve</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>High development time (days to weeks)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. AG Grid */}
        <section id="ag-grid">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faDollarSign} className="text-green-500" />
              4. AG Grid (Community Edition)
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              AG Grid Community offers basic spreadsheet functionality for free, but advanced
              editing features require a paid Enterprise license ($999+/year per developer).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-400">
                  <FontAwesomeIcon icon={faThumbsUp} />
                  Strengths
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Mature and well-documented</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Basic editing in Community edition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 shrink-0"
                    />
                    <span>Enterprise features available (if you pay)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-red-700 dark:text-red-400">
                  <FontAwesomeIcon icon={faThumbsDown} />
                  Considerations
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>Large bundle: {AG_GRID_COMMUNITY_INFO.bundleSizeMinGzip}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>Advanced features require $999+/year per dev</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 shrink-0"
                    />
                    <span>Replacing one paid solution with another</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section id="comparison">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBalanceScale} className="text-blue-500" />
              Handsontable vs Alternatives: Quick Comparison
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      Library
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      Bundle Size
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      License
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      Cost (5 devs)
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      Editing
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
                    <td className="p-3 text-green-600 dark:text-green-400">MIT</td>
                    <td className="p-3 text-green-600 dark:text-green-400 font-bold">$0</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">✓ Built-in</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">React Data Grid</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">~25KB</td>
                    <td className="p-3 text-green-600 dark:text-green-400">MIT</td>
                    <td className="p-3 text-green-600 dark:text-green-400">$0</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">✓ Excel-like</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">TanStack Table</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {TANSTACK_TABLE_INFO.bundleSizeMinGzip}
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400">MIT</td>
                    <td className="p-3 text-green-600 dark:text-green-400">$0</td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">DIY</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">AG Grid Community</td>
                    <td className="p-3 text-red-600 dark:text-red-400">
                      {AG_GRID_COMMUNITY_INFO.bundleSizeMinGzip}
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400">MIT</td>
                    <td className="p-3 text-green-600 dark:text-green-400">$0</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">✓ Basic</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">AG Grid Enterprise</td>
                    <td className="p-3 text-red-600 dark:text-red-400">~200KB+</td>
                    <td className="p-3 text-red-600 dark:text-red-400">Commercial</td>
                    <td className="p-3 text-red-600 dark:text-red-400 font-bold">$5,000+/yr</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">✓ Advanced</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
                    <td className="p-3 text-gray-700 dark:text-gray-300 font-medium">
                      Handsontable
                    </td>
                    <td className="p-3 text-red-600 dark:text-red-400 font-bold">
                      {HANDSONTABLE_INFO.bundleSizeMinGzip}
                    </td>
                    <td className="p-3 text-red-600 dark:text-red-400">Commercial</td>
                    <td className="p-3 text-red-600 dark:text-red-400 font-bold">$5,000+/yr</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">✓ Full</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Migration Guide */}
        <section id="migration">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              Migrating from Handsontable to Simple Table
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Switching from Handsontable to Simple Table is straightforward and can be completed
                in an afternoon:
              </p>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      1
                    </span>
                    Install Simple Table
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Follow the{" "}
                    <Link
                      href="/docs/installation"
                      className="text-blue-600 dark:text-blue-400 underline font-medium"
                    >
                      installation guide
                    </Link>{" "}
                    to add Simple Table to your project — it's a single npm install.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      2
                    </span>
                    Replace Handsontable component
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Simple Table's API is more intuitive than Handsontable's. Most features map
                    directly with clearer prop names.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      3
                    </span>
                    Update styling (optional)
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Simple Table's default styles are modern and clean. Customization is easier with
                    CSS variables.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Benefits You'll See Immediately
                      </h4>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• Page load time reduced by ~500ms (bundle size difference)</li>
                        <li>• No more license compliance worries</li>
                        <li>• Cleaner, more maintainable code</li>
                        <li>• Better TypeScript support and autocomplete</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faHeart} className="text-red-500" />
              Conclusion: Break Free from Handsontable
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Handsontable is a capable library that continues to serve many organizations well.
                However, if its licensing costs don't fit your budget or you prefer truly
                open-source solutions, the alternatives we've covered are worth considering.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>Simple Table</strong> is a practical alternative for many projects,
                offering:
              </p>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Freedom:</strong> MIT license with no commercial restrictions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Performance:</strong> About 4x smaller bundle (
                    {SIMPLE_TABLE_INFO.bundleSizeMinGzip} vs {HANDSONTABLE_INFO.bundleSizeMinGzip})
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Features:</strong> Everything you need for spreadsheet-like editing
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Developer Experience:</strong> Intuitive API, excellent TypeScript,
                    15-minute setup
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Cost:</strong> $0 forever—save $5,000+ per year
                  </span>
                </li>
              </ul>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Whether you're starting a new project or migrating from Handsontable, evaluate your
                specific needs. If Handsontable's advanced features justify the cost for your use
                case, it remains a solid choice. If not, Simple Table and other alternatives offer
                good functionality with permissive licenses.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Replace Handsontable with Simple Table today"
        description={`Escape license fees and bundle bloat. Simple Table gives you spreadsheet-like features in just ${SIMPLE_TABLE_INFO.bundleSizeMinGzip}—4x lighter than Handsontable—with a truly free MIT license. Join developers who've already made the switch.`}
        primaryButton={{
          text: "Get Started Free",
          href: "/docs/installation",
        }}
        secondaryButton={{
          text: "See Live Demos",
          href: DEFAULT_EXAMPLE_PATH,
        }}
      />
    </BlogLayout>
  );
}
