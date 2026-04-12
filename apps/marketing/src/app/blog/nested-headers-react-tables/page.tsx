import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faTable,
  faCode,
  faLightbulb,
  faCheckCircle,
  faPaintBrush,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { nestedHeadersReactTablesPost } from "@/constants/blogPosts";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import { Button } from "antd";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.nestedHeadersReactTables.title,
  description: SEO_STRINGS.blogPosts.nestedHeadersReactTables.description,
  keywords: SEO_STRINGS.blogPosts.nestedHeadersReactTables.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.nestedHeadersReactTables.title,
    description: SEO_STRINGS.blogPosts.nestedHeadersReactTables.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.nestedHeadersReactTables.title,
    description: SEO_STRINGS.blogPosts.nestedHeadersReactTables.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/nested-headers-react-tables",
  },
};

export default function NestedHeadersReactTablesPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          {nestedHeadersReactTablesPost.title}
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faLayerGroup} />
            Nested Headers
          </span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faTable} />
            Complex Tables
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            React
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          {nestedHeadersReactTablesPost.description}
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8">
        {/* What Are Nested Headers Section */}
        <section id="what-are-nested-headers">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500" />
              What Are Nested Headers and Why Do You Need Them?
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Nested headers, also known as hierarchical or grouped headers, allow you to create
                multi-level column structures in your data tables. Instead of having a flat list of
                columns, you can group related columns under parent headers, creating a logical
                hierarchy that makes complex data easier to understand and navigate.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Imagine you're building a student grade tracking system. Instead of having columns
                like "Math Score", "Science Score", "History Score" scattered across your table, you
                can group them under a parent header called "Test Scores". This creates a cleaner,
                more organized view that users can quickly comprehend.
              </p>

              <h4 className="mb-2 text-gray-900 dark:text-gray-100 text-lg font-medium">
                Common Use Cases for Nested Headers:
              </h4>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li>
                  • <strong>Financial Reports:</strong> Group columns by quarters (Q1, Q2, Q3, Q4)
                  with subcategories for revenue, expenses, profit
                </li>
                <li>
                  • <strong>Analytics Dashboards:</strong> Organize metrics by time periods or data
                  sources
                </li>
                <li>
                  • <strong>Employee Management:</strong> Group personal information, contact
                  details, and performance metrics
                </li>
                <li>
                  • <strong>Product Catalogs:</strong> Organize specifications, pricing, and
                  availability data
                </li>
                <li>
                  • <strong>Survey Results:</strong> Group questions by categories or survey
                  sections
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* The Complexity Problem Section */}
        <section id="complexity-problem">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-red-500" />
              The Problem: Nested Headers Are Usually Complex to Implement
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Most React table libraries make implementing nested headers unnecessarily
                complicated. You often need to:
              </p>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li>• Write complex configuration objects with deeply nested structures</li>
                <li>• Manually calculate colspan and rowspan values for proper header rendering</li>
                <li>• Handle header-specific styling and event handling separately</li>
                <li>• Deal with complicated APIs that don't follow intuitive patterns</li>
                <li>
                  • Struggle with maintaining responsive behavior across different screen sizes
                </li>
              </ul>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-red-800 dark:text-red-200">
                    The Traditional Approach
                  </span>
                </div>
                <p className="text-red-700 dark:text-red-300">
                  Many developers avoid using nested headers altogether because the implementation
                  complexity outweighs the benefits, leaving users with harder-to-navigate flat
                  table structures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Table's Solution Section */}
        <section id="simple-table-solution">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
              Simple Table's Intuitive Approach
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table makes nested headers incredibly straightforward. The key insight is
                that nested headers should work exactly like you'd expect: just add a `children`
                array to any header object, and it becomes a parent header with child columns.
              </p>

              <h4 className="mb-3 text-gray-900 dark:text-gray-100 text-lg font-medium">
                Here's how simple it is:
              </h4>

              <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-auto mb-6 text-sm leading-relaxed">
                {`const headers = [
  {
    accessor: "name",
    label: "Name",
    width: "1fr",
    isSortable: true,
    type: "string",
  },
  {
    accessor: "score",
    label: "Test Scores", // This becomes the parent header
    width: 300,
    children: [ // Simply add children array
      {
        accessor: "mathScore",
        label: "Math",
        width: 100,
        isSortable: true,
        type: "number",
      },
      {
        accessor: "scienceScore",
        label: "Science",
        width: 100,
        isSortable: true,
        type: "number",
      },
      {
        accessor: "historyScore",
        label: "History",
        width: 100,
        isSortable: true,
        type: "number",
      },
    ],
  },
];`}
              </pre>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                  <span className="font-medium text-green-800 dark:text-green-200">That's It!</span>
                </div>
                <p className="text-green-700 dark:text-green-300">
                  No complex configuration, no manual colspan calculations, no special APIs to
                  learn. Child columns work exactly like regular columns - they can be sorted,
                  filtered, have custom renderers, and everything else you'd expect.
                </p>
              </div>

              <h4 className="mb-3 text-gray-900 dark:text-gray-100 text-lg font-medium">
                Key Benefits of Simple Table's Approach:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h5 className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Intuitive API
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300">
                    The children array pattern is immediately recognizable and follows React's
                    mental model for nested components.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h5 className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Full Feature Support
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300">
                    Child columns support all the same features as regular columns: sorting,
                    filtering, custom renderers, alignment, and more.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h5 className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Automatic Layout
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300">
                    Parent header width automatically adjusts to fit all child columns. No manual
                    calculations needed.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h5 className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Multi-Level Nesting
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300">
                    Support for multiple levels of nesting by adding children to child columns,
                    creating deep hierarchies when needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Example Section */}
        <section id="real-world-example">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faTable} className="text-blue-500" />
              Real-World Example: Student Grade Tracker
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Let's look at a complete example of a student grade tracking table with nested
                headers. This example shows how you can group test scores under a single parent
                header while maintaining full functionality for each individual score column.
              </p>

              <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-auto mb-6 text-sm leading-relaxed">
                {`import { SimpleTable, HeaderObject } from "@simple-table/react";
import "@simple-table/react/styles.css";

const headers: HeaderObject[] = [
  {
    accessor: "id",
    label: "ID",
    width: 80,
    isSortable: true,
    type: "number",
  },
  {
    accessor: "name",
    label: "Name",
    width: "1fr",
    isSortable: true,
    type: "string",
  },
  {
    accessor: "score",
    label: "Test Scores",
    width: 300,
    isSortable: false, // Parent headers typically don't sort
    type: "number",
    children: [
      {
        accessor: "mathScore",
        label: "Math",
        width: 100,
        isSortable: true,
        type: "number",
        align: "right",
        // Custom renderer to highlight high scores
        cellRenderer: ({ row, accessor }) => {
          const score = row[accessor] as number;
          return score >= 90 ? 
            <span className="text-green-600 font-bold">{score}</span> : 
            score;
        },
      },
      {
        accessor: "scienceScore",
        label: "Science",
        width: 100,
        isSortable: true,
        type: "number",
        align: "right",
        cellRenderer: ({ row, accessor }) => {
          const score = row[accessor] as number;
          return score >= 90 ? 
            <span className="text-green-600 font-bold">{score}</span> : 
            score;
        },
      },
      {
        accessor: "historyScore",
        label: "History",
        width: 100,
        isSortable: true,
        type: "number",
        align: "right",
        cellRenderer: ({ row, accessor }) => {
          const score = row[accessor] as number;
          return score >= 90 ? 
            <span className="text-green-600 font-bold">{score}</span> : 
            score;
        },
      },
    ],
  },
  {
    accessor: "grade",
    label: "Overall Grade",
    width: 120,
    isSortable: true,
    type: "string",
    align: "center",
  },
];

export default function StudentGradeTable() {
  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={studentData}
      theme="modern-light"
      height="400px"
      columnResizing
    />
  );
}`}
              </pre>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Notice how each child column (Math, Science, History) has its own custom renderer to
                highlight scores above 90 in green. This demonstrates that nested columns have full
                access to all the same features as regular columns.
              </p>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section id="best-practices">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              Best Practices for Nested Headers
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h4 className="mb-3 text-gray-900 dark:text-gray-100 text-lg font-medium">
                Design Guidelines:
              </h4>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li>
                  • <strong>Logical Grouping:</strong> Only group columns that are truly related -
                  users should immediately understand why columns are grouped together
                </li>
                <li>
                  • <strong>Parent Header Names:</strong> Use clear, descriptive names for parent
                  headers that accurately represent the grouped data
                </li>
                <li>
                  • <strong>Consistent Width:</strong> Ensure child column widths add up to make the
                  parent header look balanced
                </li>
                <li>
                  • <strong>Sorting Logic:</strong> Parent headers usually shouldn't be sortable
                  since they don't represent actual data
                </li>
              </ul>

              <h4 className="mb-3 text-gray-900 dark:text-gray-100 text-lg font-medium">
                Technical Considerations:
              </h4>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li>
                  • <strong>Performance:</strong> Nested headers don't impact performance - they're
                  just a display organization tool
                </li>
                <li>
                  • <strong>Responsive Design:</strong> Consider how nested headers will look on
                  mobile devices and smaller screens
                </li>
                <li>
                  • <strong>Accessibility:</strong> Screen readers will understand the hierarchical
                  structure automatically
                </li>
                <li>
                  • <strong>Styling:</strong> Parent and child headers can be styled independently
                  using CSS classes
                </li>
              </ul>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faPaintBrush} className="text-blue-500" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    Try the Theme Builder
                  </span>
                </div>
                <p className="text-blue-700 dark:text-blue-300 mb-3">
                  Want to see how nested headers look with different themes? Our Theme Builder lets
                  you customize the appearance of nested headers in real-time.
                </p>
                <Link href="/theme-builder">
                  <Button
                    type="primary"
                    size="large"
                    icon={<FontAwesomeIcon icon={faPaintBrush} />}
                    block
                  >
                    Open Theme Builder
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion Section */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
              Making Complex Tables Simple
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Nested headers don't have to be complicated. Simple Table's intuitive approach with
                the `children` array pattern makes it easy to create well-organized, hierarchical
                table structures that users can quickly understand and navigate.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Whether you're building financial dashboards, student management systems, or any
                application with complex data relationships, nested headers can significantly
                improve the user experience without adding development complexity.
              </p>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="mb-4 text-gray-900 dark:text-gray-100 text-lg font-medium">
                  Ready to organize your complex data?
                </h4>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/docs/nested-headers"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
                  >
                    View Nested Headers Docs
                  </Link>

                  <Link
                    href="/docs/custom-theme"
                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 px-6 py-3 rounded-lg font-medium transition-colors text-center"
                  >
                    Learn About Theming
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <CallToActionCard
          title="Build better tables with nested headers"
          description="Simple Table makes complex data organization simple with intuitive nested headers. No complex configuration required."
          primaryButton={{
            text: "View on NPM",
            href: "https://www.npmjs.com/package/@simple-table/react",
            external: true,
          }}
          secondaryButton={{
            text: "Back to Home",
            href: "/",
          }}
        />
      </article>
    </BlogLayout>
  );
}
