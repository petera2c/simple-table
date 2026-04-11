import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTable,
  faCode,
  faRocket,
  faCheckCircle,
  faBalanceScale,
  faStar,
  faChartLine,
  faDollarSign,
  faLightbulb,
  faCog,
  faBook,
  faTrophy,
  faExclamationTriangle,
  faThumbsUp,
  faThumbsDown,
  faFeather,
  faShieldAlt,
  faBolt,
  faHeart,
  faPalette,
  faLayerGroup,
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
} from "@/constants/packageInfo";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.agGridAlternatives.title,
  description: SEO_STRINGS.blogPosts.agGridAlternatives.description,
  keywords: SEO_STRINGS.blogPosts.agGridAlternatives.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.agGridAlternatives.title,
    description: SEO_STRINGS.blogPosts.agGridAlternatives.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.agGridAlternatives.title,
    description: SEO_STRINGS.blogPosts.agGridAlternatives.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/ag-grid-alternatives-free-react-data-grids",
  },
};

export default function AgGridAlternativesPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          AG Grid Alternatives: 7 Best Free React Data Grids (2025)
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faDollarSign} />
            100% Free
          </span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldAlt} />
            No Vendor Lock-in
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faRocket} />
            Production Ready
          </span>
          <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faTrophy} />
            MIT Licensed
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Looking for an AG Grid alternative? Discover 7 powerful, free React data grids that
          deliver enterprise features without the enterprise price tag.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                AG Grid is a powerful, mature library with an extensive feature set that can handle
                virtually any data grid use case. It's well-documented, actively maintained, and
                trusted by thousands of companies. However, advanced features like row grouping,
                aggregation, and Excel export require an Enterprise license starting at $999 per
                developer annually. See our{" "}
                <Link
                  href="/blog/ag-grid-pricing-license-breakdown-2026"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  complete AG Grid pricing breakdown
                </Link>{" "}
                for details.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                For projects with budget constraints or those that don't need the full enterprise
                feature set, you might be looking for alternatives. The good news? The React
                ecosystem offers several excellent options that are completely free and may better
                fit your specific needs.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                In this comprehensive guide, we'll explore 7 production-ready AG Grid alternatives
                that won't cost you a dime. Whether you need a lightweight solution or a
                feature-packed powerhouse, there's an option here that will fit your needs
                perfectly.
              </p>
            </div>
          </div>
        </section>

        {/* Why Look Beyond AG Grid Section */}
        <section id="why-look-beyond">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBalanceScale} className="text-purple-500" />
              Why Look Beyond AG Grid?
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                AG Grid is an excellent choice for many projects. However, developers often look for
                alternatives for these reasons:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faDollarSign} className="text-red-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Expensive Licensing
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Enterprise features start at $999 per developer annually. For a team of 5,
                    that's $5,000+ per year—forever.
                  </p>
                </div>

                <div className="border border-orange-200 dark:border-orange-700 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-orange-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Large Bundle Size
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    AG Grid Community is {AG_GRID_COMMUNITY_INFO.bundleSizeMinGzip}. Many
                    alternatives are significantly smaller and faster. See our{" "}
                    <Link
                      href="/blog/react-data-grid-bundle-size-comparison"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      bundle size comparison
                    </Link>
                    .
                  </p>
                </div>

                <div className="border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faCog} className="text-yellow-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Configuration Complexity
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    AG Grid's comprehensive API can have a learning curve. While powerful, it may be
                    more than needed for simpler use cases.
                  </p>
                </div>

                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-blue-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Vendor Lock-in
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Once you've built your app around AG Grid's API, migrating away becomes
                    increasingly difficult.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What to Look For Section */}
        <section id="what-to-look-for">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-blue-500" />
              What to Look For in an AG Grid Alternative
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                When evaluating AG Grid alternatives, keep these key criteria in mind:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">Core Features:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Sorting, filtering, pagination, column resizing, and row selection should be
                      built-in.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">Performance:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Virtualization for large datasets (10K+ rows) is essential for production
                      apps.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">
                      TypeScript Support:
                    </strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      First-class TypeScript support with proper type definitions is non-negotiable.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">Customization:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Custom cell renderers and styling options to match your design system.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">
                      Active Maintenance:
                    </strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Regular updates, bug fixes, and a responsive community or maintainer.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">License Freedom:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      MIT or similar permissive license with no hidden costs or restrictions.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Alternatives Section */}
        <section id="best-alternatives">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faTrophy} className="text-gold-500" />
              Top 7 AG Grid Alternatives for React
            </h2>
          </div>
        </section>

        {/* 1. Simple Table */}
        <section id="simple-table">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4 md:p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                #1 RECOMMENDED
              </span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Simple Table</h3>
            </div>

            <p className="mb-6 text-gray-700 dark:text-gray-300 text-lg">
              Simple Table is a great AG Grid alternative for teams who want a solid feature set
              without licensing costs. At {SIMPLE_TABLE_INFO.bundleSizeMinGzip}, it's one of the
              lightest full-featured React data grids available, offering the core features most
              applications need.
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
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Small footprint:</strong> {SIMPLE_TABLE_INFO.bundleSizeMinGzip} —
                      about 3x smaller than AG Grid Community
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Batteries included:</strong> Sorting, filtering, pagination,
                      virtualization, cell editing, row selection—all built-in
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Straightforward API:</strong> Intuitive prop-based configuration makes
                      getting started quick and easy
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Blazing performance:</strong> Handles 50K+ rows smoothly with built-in
                      virtualization
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Style freedom:</strong> Fully customizable with CSS variables, custom
                      renderers, and theme support
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>TypeScript-first:</strong> Comprehensive type definitions for a
                      superior DX
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>100% free:</strong> MIT licensed, no enterprise tier, no surprises
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
                    <FontAwesomeIcon icon={faStar} className="text-amber-500 mt-1 flex-shrink-0" />
                    <span>Startups and teams with budget constraints</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faStar} className="text-amber-500 mt-1 flex-shrink-0" />
                    <span>Projects prioritizing bundle size and performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faStar} className="text-amber-500 mt-1 flex-shrink-0" />
                    <span>Teams wanting quick setup without complexity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faStar} className="text-amber-500 mt-1 flex-shrink-0" />
                    <span>Apps needing advanced features without vendor lock-in</span>
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
                      MIT
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      TypeScript
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      ✓ Full Support
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border border-green-300 dark:border-green-700 rounded-lg p-6 text-center">
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Need a free AG Grid alternative?
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Simple Table offers the core features most projects need with an intuitive API and
                small bundle size—completely free.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/docs/installation">
                  <Button type="primary" size="large" icon={<FontAwesomeIcon icon={faRocket} />}>
                    Get Started Free →
                  </Button>
                </Link>
                <ExampleLink href={DEFAULT_EXAMPLE_PATH}>
                  <Button size="large" icon={<FontAwesomeIcon icon={faCode} />}>
                    View Examples
                  </Button>
                </ExampleLink>
              </div>
            </div>
          </div>
        </section>

        {/* 2. TanStack Table */}
        <section id="tanstack-table">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-blue-500" />
              2. TanStack Table (React Table v8)
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              TanStack Table is the headless table library that gives you complete control. It
              provides the logic and state management while you handle the rendering. Perfect for
              custom implementations where you need pixel-perfect control over every aspect.
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
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Headless architecture:</strong> Total control over markup and styling
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Framework agnostic:</strong> Works with React, Vue, Svelte, and more
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Powerful plugin system:</strong> Extensive ecosystem of plugins and
                      extensions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Excellent TypeScript:</strong> Rock-solid type inference
                    </span>
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
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>Steeper learning curve—you build everything from scratch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>No built-in UI means more development time upfront</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>Requires additional libraries for virtualization</span>
                  </li>
                </ul>

                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bundle Size
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {TANSTACK_TABLE_INFO.bundleSizeMinGzip}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      License
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      MIT
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Best For
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Custom UIs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Material React Table */}
        <section id="material-react-table">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faPalette} className="text-indigo-500" />
              3. Material React Table
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              If you're already using Material-UI (MUI), Material React Table is a fantastic choice.
              It wraps TanStack Table with beautiful Material Design components, giving you the best
              of both worlds.
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
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Material Design:</strong> Perfect integration with MUI projects
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Feature-rich:</strong> Pre-built UI for advanced features
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>TanStack foundation:</strong> Powered by TanStack Table's robust core
                    </span>
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
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>Requires Material-UI as a peer dependency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      Larger bundle size due to MUI: {MATERIAL_REACT_TABLE_INFO.bundleSizeMinGzip}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>Not ideal if you're not using Material Design</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. React Data Grid */}
        <section id="react-data-grid">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faTable} className="text-purple-500" />
              4. React Data Grid (by Adazzle)
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              A lightweight, Excel-like data grid with excellent performance and keyboard
              navigation. It's particularly good for spreadsheet-style interfaces.
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
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>Excel-like editing experience with keyboard support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>Built-in virtualization for excellent performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>Simple API with good defaults</span>
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
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>More focused on editing than display</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>Less flexible for custom layouts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 5. React Virtualized */}
        <section id="react-virtualized">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-yellow-500" />
              5. React Virtualized
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Not strictly a data grid, but React Virtualized provides the building blocks for
              creating performant tables with massive datasets. If you need to handle hundreds of
              thousands of rows, this is your tool.
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
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>Exceptional performance with infinite scroll</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>Battle-tested and widely used</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>Flexible primitives for custom implementations</span>
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
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>No table features—you build everything</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>Maintenance mode (consider react-window instead)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Ant Design Table */}
        <section id="ant-design-table">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faTable} className="text-blue-500" />
              6. Ant Design Table
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Part of the popular Ant Design system, this table component is feature-complete and
              production-ready with a clean, professional look.
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
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>Comprehensive feature set out of the box</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>Professional, polished UI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>Excellent documentation and examples</span>
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
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>Large bundle if you only need the table</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>Styling customization can be challenging</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 7. React Bootstrap Table */}
        <section id="react-bootstrap-table">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faTable} className="text-purple-500" />
              7. React Bootstrap Table Next
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              If you're working with Bootstrap, this library provides a familiar, Bootstrap-styled
              table component with solid features.
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
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>Perfect for Bootstrap projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>Good feature coverage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>Active community</span>
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
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>Limited to Bootstrap styling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="text-red-500 mt-1 flex-shrink-0"
                    />
                    <span>Performance can lag with very large datasets</span>
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
              Quick Comparison: AG Grid vs Alternatives
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
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
                      Best For
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Simple Table
                    </td>
                    <td className="p-3 text-green-600 dark:text-green-400 font-bold">
                      {SIMPLE_TABLE_INFO.bundleSizeMinGzip}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">MIT</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      Quick setup, full features
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">TanStack Table</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {TANSTACK_TABLE_INFO.bundleSizeMinGzip}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">MIT</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      Custom UIs, full control
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Material React Table</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {MATERIAL_REACT_TABLE_INFO.bundleSizeMinGzip}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">MIT</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Material-UI projects</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">AG Grid Community</td>
                    <td className="p-3 text-red-600 dark:text-red-400">
                      {AG_GRID_COMMUNITY_INFO.bundleSizeMinGzip}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">MIT</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">Basic features only</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">AG Grid Enterprise</td>
                    <td className="p-3 text-red-600 dark:text-red-400">~200KB+</td>
                    <td className="p-3 text-red-600 dark:text-red-400 font-bold">$999+/dev/year</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      Complex enterprise needs
                    </td>
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
              Migrating from AG Grid to Simple Table
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                If you're currently using AG Grid and want to switch to Simple Table, the migration
                is straightforward:
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
                    Replace AG Grid imports
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Swap out the AG Grid component for Simple Table's{" "}
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">
                      SimpleTable
                    </code>{" "}
                    component. See the{" "}
                    <Link
                      href="/docs/quick-start"
                      className="text-blue-600 dark:text-blue-400 underline font-medium"
                    >
                      quick start guide
                    </Link>{" "}
                    for the full setup.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      3
                    </span>
                    Update your component
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Simple Table uses a more intuitive prop-based API that's easier to understand
                    than AG Grid's configuration object.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faBook} className="text-blue-500 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Need help migrating?
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Check out our{" "}
                        <Link
                          href="/docs"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          complete documentation
                        </Link>{" "}
                        with migration guides and examples.
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
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faHeart} className="text-red-500" />
              Conclusion: Break Free from AG Grid's License Fees
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                AG Grid is an excellent, battle-tested library that serves many large organizations
                well. However, if its pricing doesn't fit your budget or you don't need its most
                advanced features, the alternatives we've covered are worth considering.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Each alternative has its strengths: TanStack Table for maximum customization, Simple
                Table for a balanced feature-to-size ratio, and Material React Table or Ant Design
                if you're already using those design systems.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>For most projects,</strong> we recommend starting with{" "}
                <strong>Simple Table</strong>
                —it provides a good balance of features, performance, and ease of use. But evaluate
                based on your specific needs: if you need ultra-custom UI, choose TanStack Table; if
                you have complex enterprise requirements and budget, AG Grid remains a solid choice.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                If you need absolute UI control, go with <strong>TanStack Table</strong>. If you're
                already invested in Material-UI or Ant Design, their respective table components
                will integrate seamlessly.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The React data grid ecosystem has matured significantly, offering quality free
                options alongside commercial ones. Evaluate your specific needs and choose the tool
                that best fits your project's requirements and constraints.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Ready to replace AG Grid with Simple Table?"
        description="Join thousands of developers who've ditched AG Grid's enterprise fees for Simple Table's powerful, free alternative. Get the same features without the vendor lock-in or price tag. Install in seconds, ship in minutes."
        primaryButton={{
          text: "Get Started Free",
          href: "/docs/installation",
        }}
        secondaryButton={{
          text: "See Live Examples",
          href: DEFAULT_EXAMPLE_PATH,
        }}
      />
    </BlogLayout>
  );
}
