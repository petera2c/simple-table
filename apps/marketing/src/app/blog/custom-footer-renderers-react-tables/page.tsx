import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faCheckCircle,
  faTimesCircle,
  faLightbulb,
  faRocket,
  faPalette,
  faWrench,
  faShieldAlt,
  faBolt,
  faArrowRight,
  faExclamationTriangle,
  faThumbsUp,
  faBalanceScale,
  faCog,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import CodeBlock from "@/components/CodeBlock";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.customFooterRenderers.title,
  description: SEO_STRINGS.blogPosts.customFooterRenderers.description,
  keywords: SEO_STRINGS.blogPosts.customFooterRenderers.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.customFooterRenderers.title,
    description: SEO_STRINGS.blogPosts.customFooterRenderers.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.customFooterRenderers.title,
    description: SEO_STRINGS.blogPosts.customFooterRenderers.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/custom-footer-renderers-react-tables",
  },
};

export default function CustomFooterRenderersPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Custom Footer Renderers: Why Full Control Beats Feature Flags in React Tables
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faPalette} />
            UI Control
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faBolt} />
            Developer Experience
          </span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faRocket} />
            Customization
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          The footer isn't an afterthought—it's where users navigate, understand their data, and
          control what they see. Yet most React table libraries trap you between rigid flags and
          rebuilding from scratch.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Picture this: You're building a data-heavy dashboard. Everything's going smooth—rows
                load fast, columns sort perfectly, filters feel snappy. Then comes the footer. Your
                designer hands you a mockup with custom pagination buttons, row counters with
                specific copy, and maybe a "rows per page" selector styled to match your brand.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You crack open your table library's docs. Option 1: A dozen boolean flags scattered
                across props—
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  showPagination
                </code>
                ,{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  paginationPosition
                </code>
                ,{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  paginationStyle
                </code>
                . You toggle them all, but the result? Close, but not quite right. The spacing's
                off, the icons don't match, and that "Showing X-Y of Z" text is hardcoded.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Option 2 (looking at you, TanStack): Rebuild the entire table UI from scratch,
                including headers, cells, and yes—footers. Sure, you get total control, but now
                you're maintaining layout logic, accessibility, and responsive behavior yourself.
                That "lightweight headless library" suddenly feels heavyweight.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                There's a better way: <strong>custom footer renderers</strong>. One prop. Full
                control. Zero compromises.
              </p>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section id="the-problem">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500" />
              The Problem: Footers Are Personal
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Table footers aren't generic. They're where your brand shows through, where your
                users interact with data navigation, and where you communicate important
                information. Every app has different needs:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faPalette} className="text-blue-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Design Requirements
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Your pagination needs to match your design system—specific colors, spacing,
                    icons, animations, and hover states that scream "this is our app."
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-green-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Feature Combinations
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Maybe you need row counts AND page numbers AND a "jump to page" input AND an
                    export button. Good luck finding flags for that exact combo.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faCog} className="text-purple-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Custom Interactions
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Want to track analytics when users change pages? Show loading states? Display
                    contextual help? These scenarios fall outside the flag-based model entirely.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-red-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Accessibility Needs
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Screen reader announcements, keyboard navigation patterns, ARIA labels—these
                    require direct access to the DOM and behavior, not just styling flags.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two Approaches Section */}
        <section id="two-approaches">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBalanceScale} className="text-blue-500" />
              Two Approaches to Footer Customization
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                When it comes to customizing table footers, libraries typically offer one of two
                paths. Let's break down the trade-offs:
              </p>

              {/* Approach 1: Feature Flags */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FontAwesomeIcon icon={faWrench} className="text-orange-500" />
                  Approach 1: The Feature Flag Maze
                </h3>

                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  This is the "configure your way there" approach. The library provides dozens of
                  boolean props and configuration options:
                </p>

                <CodeBlock
                  className="mb-4"
                  code={`<DataTable
  showPagination={true}
  paginationPosition="bottom"
  paginationAlign="right"
  showPageNumbers={true}
  showRowCount={true}
  rowCountFormat="Showing {start}-{end} of {total}"
  paginationSize="large"
  showFirstLastButtons={true}
  showPreviousNextButtons={true}
  pageNumbersToShow={5}
  // ... and 20 more pagination props
/>`}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-400">
                      <FontAwesomeIcon icon={faThumbsUp} />
                      The Good
                    </h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-green-500 mt-1 flex-shrink-0"
                        />
                        <span>
                          <strong>Quick starts:</strong> Toggle a few flags and you've got basic
                          pagination working
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-green-500 mt-1 flex-shrink-0"
                        />
                        <span>
                          <strong>Consistent styling:</strong> The library handles the basic look
                          and feel
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-green-500 mt-1 flex-shrink-0"
                        />
                        <span>
                          <strong>Less code:</strong> No need to write your own pagination logic
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-red-700 dark:text-red-400">
                      <FontAwesomeIcon icon={faExclamationTriangle} />
                      The Bad
                    </h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          className="text-red-500 mt-1 flex-shrink-0"
                        />
                        <span>
                          <strong>Limited combinations:</strong> Want that one specific layout? If
                          it's not in the flags, you're stuck
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          className="text-red-500 mt-1 flex-shrink-0"
                        />
                        <span>
                          <strong>Style surgery:</strong> Overriding the default styles often
                          requires !important wars and deep CSS selectors
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          className="text-red-500 mt-1 flex-shrink-0"
                        />
                        <span>
                          <strong>Prop explosion:</strong> More features = more flags = more
                          complexity in your component
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Approach 2: Build Everything */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCode} className="text-blue-500" />
                  Approach 2: The TanStack Way (Build Everything)
                </h3>

                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  TanStack Table takes a "headless" approach—it provides the logic and state
                  management, but you build <em>all</em> the UI yourself, including the entire table
                  structure:
                </p>

                <CodeBlock
                  className="mb-4"
                  code={`import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table'

function MyTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <>
      {/* Build entire table structure */}
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {/* Custom header rendering */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {/* Custom body rendering */}
        </tbody>
      </table>
      
      {/* Build your own footer from scratch */}
      <div className="pagination">
        <button 
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <button 
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </>
  )
}`}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-400">
                      <FontAwesomeIcon icon={faThumbsUp} />
                      The Good
                    </h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-green-500 mt-1 flex-shrink-0"
                        />
                        <span>
                          <strong>Ultimate control:</strong> Every pixel is yours to command
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-green-500 mt-1 flex-shrink-0"
                        />
                        <span>
                          <strong>Framework agnostic:</strong> Use any styling solution, any
                          component library
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-green-500 mt-1 flex-shrink-0"
                        />
                        <span>
                          <strong>Zero style conflicts:</strong> No library CSS to override
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-red-700 dark:text-red-400">
                      <FontAwesomeIcon icon={faExclamationTriangle} />
                      The Bad
                    </h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          className="text-red-500 mt-1 flex-shrink-0"
                        />
                        <span>
                          <strong>Build EVERYTHING:</strong> Table structure, headers, rows, cells,
                          footer—all on you
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          className="text-red-500 mt-1 flex-shrink-0"
                        />
                        <span>
                          <strong>Complexity creep:</strong> Simple tables turn into hundreds of
                          lines of UI code
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          className="text-red-500 mt-1 flex-shrink-0"
                        />
                        <span>
                          <strong>Maintenance burden:</strong> You're now maintaining table layout,
                          accessibility, responsive behavior, and more
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>The reality:</strong> TanStack is powerful, but overkill for most apps.
                    You wanted to customize the footer, not rebuild the entire table from scratch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Solution Section */}
        <section id="the-solution">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-green-500" />
              The Solution: Custom Footer Renderers
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Enter the <strong>footer renderer pattern</strong>—the sweet spot between flags and
                full control. Here's how it works in Simple Table:
              </p>

              <CodeBlock
                className="mb-6"
                code={`<SimpleTable
  defaultHeaders={headers}
  rows={data}
  
  shouldPaginate={true}
  rowsPerPage={10}
  footerRenderer={({
    currentPage,
    totalPages,
    startRow,
    endRow,
    totalRows,
    hasPrevPage,
    hasNextPage,
    onPrevPage,
    onNextPage,
    onPageChange,
  }) => (
    <div className="custom-footer">
      {/* Build exactly the footer YOU want */}
      <div className="row-info">
        Showing {startRow}-{endRow} of {totalRows} items
      </div>
      
      <div className="pagination-controls">
        <button 
          onClick={onPrevPage} 
          disabled={!hasPrevPage}
          className="nav-button"
        >
          ← Previous
        </button>
        
        {/* Render custom page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}
        
        <button 
          onClick={onNextPage} 
          disabled={!hasNextPage}
          className="nav-button"
        >
          Next →
        </button>
      </div>
    </div>
  )}
/>`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Why This Approach Wins
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faBolt} className="text-blue-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      One Prop
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    No flag maze. Just pass a render function to <code>footerRenderer</code> and
                    you're done.
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faRocket} className="text-green-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Full Control
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Build any footer design you want. Custom buttons, dropdowns, analytics—it's all
                    just JSX.
                  </p>
                </div>

                <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-purple-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Logic Handled
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Simple Table manages pagination state. You just render the UI with the data it
                    provides.
                  </p>
                </div>

                <div className="border border-amber-200 dark:border-amber-700 rounded-lg p-4 bg-amber-50 dark:bg-amber-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faPalette} className="text-amber-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Style Freedom
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Use CSS-in-JS, Tailwind, CSS Modules, or plain CSS. Your footer, your rules.
                  </p>
                </div>

                <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faWrench} className="text-red-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Easy Testing
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Footer logic is just a React component. Test it like any other component.
                  </p>
                </div>

                <div className="border border-indigo-200 dark:border-indigo-700 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faCode} className="text-indigo-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Scope Focused
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Unlike TanStack, you only customize what you need—the table itself still "just
                    works."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real World Examples Section */}
        <section id="real-world-examples">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLayerGroup} className="text-blue-500" />
              Real-World Footer Scenarios
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Let's look at some scenarios where custom footer renderers shine:
              </p>

              <div className="space-y-6">
                {/* Scenario 1 */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    📊 Analytics Dashboard
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <strong>Need:</strong> Show "Viewing X-Y of Z results" with an Export button and
                    a "Rows per page" dropdown.
                  </p>
                  <CodeBlock
                    code={`footerRenderer={({ startRow, endRow, totalRows, ...props }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
    <span>Viewing {startRow}-{endRow} of {totalRows} results</span>
    <div>
      <select onChange={handleRowsPerPageChange}>
        <option value="10">10 per page</option>
        <option value="25">25 per page</option>
        <option value="50">50 per page</option>
      </select>
      <button onClick={handleExport}>Export CSV</button>
    </div>
  </div>
)}`}
                  />
                </div>

                {/* Scenario 2 */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🛒 E-Commerce Admin
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <strong>Need:</strong> Compact pagination with tooltips and accessibility
                    labels.
                  </p>
                  <CodeBlock
                    code={`footerRenderer={({ currentPage, totalPages, onPageChange, ...props }) => (
  <nav aria-label="Product pagination">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        aria-current={currentPage === page ? 'page' : undefined}
        aria-label={\`Go to page \${page}\`}
        title={\`Page \${page} of \${totalPages}\`}
      >
        {page}
      </button>
    ))}
  </nav>
)}`}
                  />
                </div>

                {/* Scenario 3 */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    📱 Mobile-First App
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <strong>Need:</strong> Stacked layout on mobile, horizontal on desktop. Show
                    "Load More" instead of page numbers.
                  </p>
                  <CodeBlock
                    code={`footerRenderer={({ hasNextPage, onNextPage, startRow, endRow, totalRows }) => (
  <div className="footer-mobile-responsive">
    <div className="row-count">
      {startRow}-{endRow} of {totalRows}
    </div>
    {hasNextPage && (
      <button onClick={onNextPage} className="load-more">
        Load More Results
      </button>
    )}
  </div>
)}

// CSS
.footer-mobile-responsive {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (min-width: 768px) {
  .footer-mobile-responsive {
    flex-direction: row;
    justify-content: space-between;
  }
}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section id="comparison">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBalanceScale} className="text-purple-500" />
              The Verdict: Why Footer Renderers Win
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Let's put all three approaches side-by-side:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Criterion
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        Feature Flags
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        TanStack (Build All)
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-center bg-green-50 dark:bg-green-900/20">
                        Footer Renderer
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Setup Time
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        ⚡ Fast
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        🐌 Slow
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center bg-green-50 dark:bg-green-900/20">
                        ⚡ Fast
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Customization
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        ❌ Limited
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        ✅ Unlimited
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center bg-green-50 dark:bg-green-900/20">
                        ✅ Unlimited
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Code Complexity
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        📄 Low
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        📚 Very High
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center bg-green-50 dark:bg-green-900/20">
                        📄 Low-Medium
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Maintenance
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        ⚠️ Fight with flags
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        ⚠️ Own everything
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center bg-green-50 dark:bg-green-900/20">
                        ✅ Just the footer
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Table Features
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        ✅ Built-in
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        ❌ Build yourself
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center bg-green-50 dark:bg-green-900/20">
                        ✅ Built-in
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Best For
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        Simple needs only
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        Total control freaks
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center bg-green-50 dark:bg-green-900/20">
                        Most real-world apps
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section id="getting-started">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              Getting Started with Footer Renderers
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Ready to try footer renderers? Here's a complete working example:
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable } from "@simple-table/react";
import "@simple-table/react/styles.css";

const headers = [
  { accessor: "id", label: "ID", width: 60 },
  { accessor: "name", label: "Name", width: "1fr" },
  { accessor: "email", label: "Email", width: "1fr" },
];

const MyDataTable = ({ data }) => {
  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={data}
      
      shouldPaginate={true}
      rowsPerPage={10}
      footerRenderer={({
        currentPage,
        totalPages,
        startRow,
        endRow,
        totalRows,
        hasPrevPage,
        hasNextPage,
        onPrevPage,
        onNextPage,
        onPageChange,
      }) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          borderTop: '1px solid #e5e7eb',
        }}>
          {/* Row counter */}
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            Showing {startRow}-{endRow} of {totalRows} results
          </span>

          {/* Pagination controls */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onPrevPage}
              disabled={!hasPrevPage}
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                background: hasPrevPage ? 'white' : '#f3f4f6',
                cursor: hasPrevPage ? 'pointer' : 'not-allowed',
              }}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: currentPage === page ? '#3b82f6' : 'white',
                  color: currentPage === page ? 'white' : '#374151',
                  cursor: 'pointer',
                  fontWeight: currentPage === page ? '600' : '400',
                }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={onNextPage}
              disabled={!hasNextPage}
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                background: hasNextPage ? 'white' : '#f3f4f6',
                cursor: hasNextPage ? 'pointer' : 'not-allowed',
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    />
  );
};`}
              />

              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>That's it!</strong> Simple Table handles all the pagination logic, state
                  management, and data slicing. You just focus on rendering the UI you want.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion Section */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-blue-500" />
              The Bottom Line
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Building tables doesn't have to be a compromise between "limited customization" and
                "rebuild everything from scratch." Custom footer renderers give you the best of both
                worlds:
              </p>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Full design freedom</strong> without fighting with flags or overriding
                    styles
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Minimal code complexity</strong> compared to building tables from
                    scratch
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>All table features included</strong> (sorting, filtering, selection,
                    etc.)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Easy to maintain</strong> because you only own the footer, not the whole
                    table
                  </span>
                </li>
              </ul>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Footer UI is personal. It's where your brand shows, where your users navigate, and
                where design requirements get specific. Don't settle for close enough—take full
                control without the overhead.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Try it yourself:</strong> Simple Table's footer renderer gives you the
                  flexibility you need with none of the complexity you don't. One prop. Total
                  control. Zero compromises.
                </p>
              </div>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Ready to build tables with complete footer control?"
        description="Simple Table's footer renderer pattern combines the ease of use you expect with the customization power you need. Join developers who've ditched the flag maze and avoided TanStack complexity. Experience the perfect balance of control and simplicity."
        primaryButton={{
          text: "View Footer Renderer Docs",
          href: "/docs/footer-renderer",
        }}
        secondaryButton={{
          text: "Try Live Demo",
          href: "/docs/footer-renderer",
        }}
      />
    </BlogLayout>
  );
}
