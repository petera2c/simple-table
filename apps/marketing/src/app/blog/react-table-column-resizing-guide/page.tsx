import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeftRight,
  faCheckCircle,
  faTimesCircle,
  faBalanceScale,
  faLightbulb,
  faBolt,
  faCode,
  faTrophy,
  faRocket,
  faExpand,
  faCogs,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import CodeBlock from "@/components/CodeBlock";
import Link from "next/link";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.reactTableColumnResizingGuide.title,
  description: SEO_STRINGS.blogPosts.reactTableColumnResizingGuide.description,
  keywords: SEO_STRINGS.blogPosts.reactTableColumnResizingGuide.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.reactTableColumnResizingGuide.title,
    description: SEO_STRINGS.blogPosts.reactTableColumnResizingGuide.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.reactTableColumnResizingGuide.title,
    description: SEO_STRINGS.blogPosts.reactTableColumnResizingGuide.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/react-table-column-resizing-guide",
  },
};

export default function ReactTableColumnResizingGuidePage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          React Table Column Resizing: Implementation Guide & Best Libraries (2026)
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faLeftRight} />
            Column Resizing
          </span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            Tutorial
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faBalanceScale} />
            Comparison
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Column resizing is essential for data-heavy applications. Learn how to implement resizable
          columns in React tables, compare the best libraries, and discover why proper column
          resizing is harder than it looks.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8 mb-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You're building a React application with a data table. Your users are viewing
                financial data, customer information, or inventory records—datasets with varying
                column widths. The "Description" column is too narrow, cutting off important text.
                The "ID" column is too wide, wasting precious screen space.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>Column resizing</strong> solves this problem by letting users drag column
                borders to adjust widths according to their needs. It's a standard feature in Excel,
                Google Sheets, and professional data grids—and users expect it in modern web
                applications.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                But implementing column resizing properly is surprisingly complex. You need to
                handle mouse events, calculate new widths, respect minimum and maximum constraints,
                work with{" "}
                <Link
                  href="/blog/auto-expand-columns-react-tables"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  auto-expanding columns
                </Link>
                , support touch devices, and maintain performance with large datasets.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                This guide covers everything you need to know about column resizing in React tables:
                implementation approaches, library comparisons, and best practices for creating a
                smooth user experience.
              </p>
            </div>
          </div>
        </section>

        {/* Why Column Resizing Matters */}
        <section id="why-it-matters">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              Why Column Resizing Matters
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Column resizing isn't just a "nice-to-have" feature—it's critical for usability in
                data-intensive applications:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    User Control
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Every user has different needs. Some need to see full email addresses, others
                    prioritize status columns. Resizable columns give users control over their
                    workspace.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faExpand} className="text-blue-500" />
                    Screen Real Estate
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Different screens have different sizes. What works on a 27" monitor is cramped
                    on a laptop. Resizable columns adapt to any screen size.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBolt} className="text-purple-500" />
                    Data Visibility
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Long text gets truncated with ellipsis. Users shouldn't need to hover or click
                    to see full content—they can just widen the column.
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faTrophy} className="text-amber-500" />
                    Professional Feel
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Users expect Excel-like functionality in professional applications. Resizable
                    columns signal that your app is polished and production-ready.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">Real-World Impact</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                  In user testing, tables without column resizing consistently receive complaints:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                  <li>"I can't see the full customer name"</li>
                  <li>"The ID column is taking up too much space"</li>
                  <li>"Why can't I make this column wider?"</li>
                  <li>"This feels like a prototype, not a real tool"</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How Column Resizing Works */}
        <section id="how-it-works">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCogs} className="text-indigo-500" />
              How Column Resizing Works
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Column resizing involves several technical challenges that aren't immediately
                obvious:
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                1. The Resize Handle
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The first challenge is creating a draggable handle between columns. This is
                typically a thin vertical area (4-8px wide) that:
              </p>

              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                <li>Changes the cursor to indicate it's draggable (usually a resize cursor)</li>
                <li>Captures mouse/touch events without interfering with header clicks</li>
                <li>Provides visual feedback during the drag operation</li>
                <li>Works on both desktop (mouse) and mobile (touch) devices</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                2. Width Calculation
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                As the user drags, you need to calculate the new column width based on mouse
                position. This involves:
              </p>

              <CodeBlock
                className="mb-6"
                code={`// Simplified resize calculation
const handleMouseMove = (e: MouseEvent) => {
  const deltaX = e.clientX - startX;
  const newWidth = Math.max(
    minWidth,
    Math.min(maxWidth, initialWidth + deltaX)
  );
  
  // Update column width
  setColumnWidth(columnId, newWidth);
};`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                3. Constraint Handling
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Columns need constraints to prevent them from becoming unusably small or
                unnecessarily large:
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Width Constraints
                </h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                  <li>
                    <strong>minWidth:</strong> Prevents columns from becoming too narrow (typically
                    30-100px)
                  </li>
                  <li>
                    <strong>maxWidth:</strong> Prevents columns from dominating the table (optional)
                  </li>
                  <li>
                    <strong>Default width:</strong> Initial column width before user interaction
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                4. Auto-Expand Integration
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The most complex scenario is combining column resizing with{" "}
                <Link
                  href="/blog/auto-expand-columns-react-tables"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  auto-expanding columns
                </Link>
                . When a user resizes one column, what happens to the others?
              </p>

              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Two Common Approaches
                </h4>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">
                      Approach 1: Fixed Total Width
                    </strong>
                    <p className="mt-1">
                      When one column grows, adjacent columns shrink proportionally to maintain the
                      total table width. This is ideal for tables that should always fill their
                      container.
                    </p>
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">
                      Approach 2: Dynamic Total Width
                    </strong>
                    <p className="mt-1">
                      Resizing a column changes the total table width, potentially adding horizontal
                      scrolling. This gives users maximum control but can lead to awkward layouts.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                5. Performance Considerations
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Resizing triggers re-renders of potentially thousands of cells. Poor implementations
                cause laggy, janky dragging. Good implementations use:
              </p>

              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                <li>
                  <strong>Throttling/debouncing:</strong> Limit how often width updates occur during
                  dragging
                </li>
                <li>
                  <strong>CSS transforms:</strong> Use CSS for visual feedback before committing
                  width changes
                </li>
                <li>
                  <strong>Virtualization:</strong> Only render visible rows to minimize re-render
                  cost
                </li>
                <li>
                  <strong>Memoization:</strong> Prevent unnecessary re-renders of unchanged cells
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Library Comparison */}
        <section id="library-comparison">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faTrophy} className="text-gold-500" />
              React Table Libraries with Column Resizing
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Let's compare how popular React table libraries implement column resizing:
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Library
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Resizing Support
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Implementation
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                        Auto-Expand
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                        Simple Table
                      </td>
                      <td className="p-3 text-green-600 dark:text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Built-in
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">One prop</td>
                      <td className="p-3 text-green-600 dark:text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Yes
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                        TanStack Table
                      </td>
                      <td className="p-3 text-green-600 dark:text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Column Sizing API
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">
                        Headless (build your own UI)
                      </td>
                      <td className="p-3 text-amber-600 dark:text-amber-400">Manual</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 font-medium text-gray-900 dark:text-gray-100">AG Grid</td>
                      <td className="p-3 text-green-600 dark:text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Built-in
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">resizable: true</td>
                      <td className="p-3 text-green-600 dark:text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Yes
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                        Material React Table
                      </td>
                      <td className="p-3 text-green-600 dark:text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Built-in
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">enableColumnResizing</td>
                      <td className="p-3 text-green-600 dark:text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Yes
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                        Ant Design Table
                      </td>
                      <td className="p-3 text-green-600 dark:text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Built-in
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">resizable prop</td>
                      <td className="p-3 text-amber-600 dark:text-amber-400">Limited</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                        Tabulator
                      </td>
                      <td className="p-3 text-green-600 dark:text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Built-in
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">resizableColumns</td>
                      <td className="p-3 text-green-600 dark:text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Yes
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                        React Data Grid
                      </td>
                      <td className="p-3 text-green-600 dark:text-green-400">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Built-in
                      </td>
                      <td className="p-3 text-gray-700 dark:text-gray-300">
                        resizable column prop
                      </td>
                      <td className="p-3 text-amber-600 dark:text-amber-400">Limited</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">Key Takeaway</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Most modern React table libraries support column resizing. The difference is in
                  implementation complexity and integration with other features like auto-expanding
                  columns. Simple Table and AG Grid offer the smoothest out-of-the-box experience,
                  while TanStack Table requires more manual implementation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation: Simple Table */}
        <section id="simple-table-implementation">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-green-500" />
              Implementation: Simple Table
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table makes column resizing incredibly easy. Just add one prop:
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Basic Column Resizing
              </h3>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable, HeaderObject } from "@simple-table/react";
import "@simple-table/react/styles.css";

const headers: HeaderObject[] = [
  { 
    accessor: "id", 
    label: "ID", 
    width: 60, 
    type: "number" 
  },
  { 
    accessor: "name", 
    label: "Name", 
    width: "1fr", 
    minWidth: 100, 
    type: "string" 
  },
  { 
    accessor: "email", 
    label: "Email", 
    width: "1fr", 
    minWidth: 150, 
    type: "string" 
  },
  { 
    accessor: "role", 
    label: "Role", 
    width: 150, 
    type: "string" 
  },
];

export default function ResizableTable({ data }) {
  return (
    <SimpleTable
      columnResizing={true}  // That's it!
      defaultHeaders={headers}
      rows={data}
      
      height="500px"
    />
  );
}`}
              />

              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  What You Get
                </h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                  <li>Drag handles appear between columns</li>
                  <li>Smooth resize animation with visual feedback</li>
                  <li>Minimum width constraints are automatically respected</li>
                  <li>Works on both desktop (mouse) and mobile (touch)</li>
                  <li>Integrates seamlessly with sorting, filtering, and other features</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Column Resizing with Auto-Expand
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The real power comes when you combine column resizing with{" "}
                <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
                  autoExpandColumns
                </code>
                . This ensures your table always fills the container width, even after users resize
                columns:
              </p>

              <CodeBlock
                className="mb-6"
                code={`<SimpleTable
  columnResizing={true}
  autoExpandColumns={true}  // Columns always fill container
  defaultHeaders={headers}
  rows={data}
  
  height="500px"
/>

// What happens:
// 1. User drags a column border to resize
// 2. The target column changes width
// 3. Other columns automatically adjust proportionally
// 4. Table always fills 100% of container width
// 5. Minimum widths are respected (columns won't shrink below minWidth)`}
              />

              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  How Auto-Expand Works with Resizing
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  When you resize a column with <code>autoExpandColumns</code> enabled:
                </p>
                <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Simple Table calculates the width change (delta)</li>
                  <li>Adjacent columns compensate by shrinking/growing proportionally</li>
                  <li>The algorithm respects each column's minimum width constraint</li>
                  <li>The total table width remains constant (100% of container)</li>
                </ol>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-3">
                  Read our{" "}
                  <Link
                    href="/blog/auto-expand-columns-react-tables"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    deep dive on auto-expand columns
                  </Link>{" "}
                  to understand the sophisticated algorithm behind this feature.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Setting Width Constraints
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Control how much users can resize columns using <code>minWidth</code> and{" "}
                <code>maxWidth</code>:
              </p>

              <CodeBlock
                className="mb-6"
                code={`const headers: HeaderObject[] = [
  { 
    accessor: "id", 
    label: "ID", 
    width: 60,
    minWidth: 40,      // Can't shrink below 40px
    maxWidth: 100,     // Can't grow beyond 100px
    type: "number" 
  },
  { 
    accessor: "description", 
    label: "Description", 
    width: "1fr",
    minWidth: 200,     // Ensure readability
    type: "string" 
  },
  { 
    accessor: "status", 
    label: "Status", 
    width: 120,
    minWidth: 80,      // Prevent cramping
    maxWidth: 200,     // Don't let it dominate
    type: "string" 
  },
];`}
              />

              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg mb-6">
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">Best Practices</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                  <li>
                    <strong>Always set minWidth:</strong> Prevents columns from becoming unusably
                    narrow
                  </li>
                  <li>
                    <strong>Use maxWidth sparingly:</strong> Only when a column shouldn't dominate
                    the table
                  </li>
                  <li>
                    <strong>Consider content:</strong> Text columns need more width than icons or
                    numbers
                  </li>
                  <li>
                    <strong>Test on mobile:</strong> Minimum widths should work on small screens
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Responsive Column Resizing
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                On mobile devices, you might want to disable auto-expand to allow horizontal
                scrolling:
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { useState, useEffect } from "react";

export default function ResponsiveTable({ data }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <SimpleTable
      columnResizing={true}
      autoExpandColumns={!isMobile}  // Disable on mobile
      defaultHeaders={headers}
      rows={data}
      
      height="500px"
    />
  );
}`}
              />
            </div>
          </div>
        </section>

        {/* Implementation: TanStack Table */}
        <section id="tanstack-implementation">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-blue-500" />
              Implementation: TanStack Table
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                TanStack Table provides a Column Sizing API, but you need to build the UI yourself.
                Here's what that looks like:
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { useReactTable, getCoreRowModel, ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

export default function TanStackResizableTable({ data }) {
  const [columnSizing, setColumnSizing] = useState({});

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      size: 60,
      minSize: 40,
      maxSize: 100,
    },
    {
      accessorKey: "name",
      header: "Name",
      size: 200,
      minSize: 100,
    },
    // ... more columns
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    state: {
      columnSizing,
    },
    onColumnSizingChange: setColumnSizing,
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                style={{ width: header.getSize() }}
              >
                {header.column.columnDef.header}
                
                {/* YOU MUST BUILD THIS RESIZE HANDLE */}
                <div
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className="resizer"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    height: "100%",
                    width: "5px",
                    cursor: "col-resize",
                    userSelect: "none",
                    touchAction: "none",
                  }}
                />
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {/* ... tbody implementation ... */}
    </table>
  );
}`}
              />

              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg mb-6">
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                  TanStack Table Trade-offs
                </h4>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  <p>
                    <strong className="text-green-600 dark:text-green-400">Pros:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 mb-3">
                    <li>Complete control over UI and behavior</li>
                    <li>Powerful Column Sizing API with state management</li>
                    <li>Flexible integration with your design system</li>
                  </ul>
                  <p>
                    <strong className="text-red-600 dark:text-red-400">Cons:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Must build resize handles, styling, and interactions yourself</li>
                    <li>No built-in auto-expand logic (you implement it)</li>
                    <li>More code to write and maintain</li>
                    <li>Steeper learning curve</li>
                  </ul>
                </div>
              </div>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                For a detailed comparison of TanStack Table's headless approach vs Simple Table's
                batteries-included approach, read our{" "}
                <Link
                  href="/blog/tanstack-table-vs-simple-table-headless-batteries-included"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  TanStack Table vs Simple Table comparison
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Implementation: AG Grid */}
        <section id="ag-grid-implementation">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-purple-500" />
              Implementation: AG Grid
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                AG Grid offers powerful column resizing, but it comes with a hefty price tag for
                advanced features:
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function AGGridResizableTable({ data }) {
  const columnDefs = [
    { 
      field: "id", 
      headerName: "ID",
      width: 60,
      minWidth: 40,
      maxWidth: 100,
      resizable: true  // Enable per-column
    },
    { 
      field: "name", 
      headerName: "Name",
      width: 200,
      minWidth: 100,
      resizable: true,
      flex: 1  // Auto-expand behavior
    },
    // ... more columns
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={data}
        defaultColDef={{
          resizable: true  // Or enable globally
        }}
      />
    </div>
  );
}`}
              />

              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                  AG Grid Pricing Warning
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  While column resizing is free in AG Grid Community, many related features require
                  an Enterprise license:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                  <li>
                    <strong>$999/developer/year</strong> for AG Grid Enterprise
                  </li>
                  <li>Advanced column features (grouping, pivoting) are enterprise-only</li>
                  <li>
                    For a 5-developer team: <strong>$4,995/year</strong>
                  </li>
                </ul>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  Read our{" "}
                  <Link
                    href="/blog/ag-grid-pricing-license-breakdown-2026"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    complete AG Grid pricing breakdown
                  </Link>{" "}
                  to understand the full cost.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Common Pitfalls */}
        <section id="common-pitfalls">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500" />
              Common Pitfalls and Solutions
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Pitfall #1: Janky Resize Performance
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Problem:</strong> Dragging feels laggy because every mouse movement
                    triggers a full table re-render.
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Solution:</strong> Use throttling/debouncing or CSS transforms for
                    visual feedback before committing width changes. Good libraries handle this
                    automatically.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Pitfall #2: Columns Become Too Narrow
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Problem:</strong> Users can shrink columns to 10px, making content
                    unreadable.
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Solution:</strong> Always set reasonable <code>minWidth</code> values
                    (typically 50-100px for text columns, 30-50px for icons/numbers).
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Pitfall #3: Mobile Touch Not Working
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Problem:</strong> Column resizing works on desktop but not on mobile
                    devices.
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Solution:</strong> Ensure your resize handles support both{" "}
                    <code>onMouseDown</code> and <code>onTouchStart</code> events. Libraries like
                    Simple Table handle this automatically.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Pitfall #4: Auto-Expand Conflicts
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Problem:</strong> When using auto-expand, resizing one column causes
                    unexpected behavior in others.
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Solution:</strong> Use a library with built-in auto-expand support
                    (Simple Table, AG Grid) or implement sophisticated compensation logic yourself.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Pitfall #5: Resize Handle Too Small
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Problem:</strong> Users struggle to grab the resize handle because it's
                    only 1-2px wide.
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Solution:</strong> Make the interactive area 6-10px wide, even if the
                    visual indicator is thinner. This improves usability without cluttering the UI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-blue-500" />
              Best Practices for Column Resizing
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    Visual Feedback
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Show clear visual feedback during resizing: change cursor, highlight the column
                    border, or show a ghost column. Users should know exactly what's happening.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    Sensible Defaults
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Set default column widths that work for most users. They can adjust if needed,
                    but shouldn't have to resize every column just to see their data.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    Persist User Preferences
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Save column widths to localStorage or user preferences. Users shouldn't have to
                    resize columns every time they visit your app.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    Double-Click to Auto-Size
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Let users double-click a resize handle to auto-fit the column to its content.
                    This is an Excel convention that power users expect.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    Mobile Considerations
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    On small screens, consider disabling auto-expand and allowing horizontal
                    scrolling. Cramped columns are worse than scrolling on mobile.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    Accessibility
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Ensure resize handles are keyboard accessible. Users should be able to resize
                    columns using arrow keys, not just mouse/touch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Decision Guide */}
        <section id="decision-guide">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBalanceScale} className="text-indigo-500" />
              Which Library Should You Choose?
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Here's a quick decision guide based on your needs:
              </p>

              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Choose Simple Table if:
                  </h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                    <li>You want column resizing to work out-of-the-box with one prop</li>
                    <li>You need auto-expand columns that integrate seamlessly with resizing</li>
                    <li>You want zero dependencies and a tiny bundle size</li>
                    <li>You need a complete solution without building UI components</li>
                    <li>You want to ship fast without wrestling with configuration</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Choose TanStack Table if:
                  </h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                    <li>You need complete control over the resize UI and behavior</li>
                    <li>You're building a custom design system and want headless logic</li>
                    <li>You enjoy building UI components from scratch</li>
                    <li>You have time to implement auto-expand logic yourself</li>
                    <li>You need framework-agnostic table logic (React, Vue, Solid, etc.)</li>
                  </ul>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Choose AG Grid if:
                  </h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                    <li>You need enterprise features like pivoting and advanced grouping</li>
                    <li>Your company has budget for $999/developer/year licenses</li>
                    <li>You're building a complex financial or analytics dashboard</li>
                    <li>You need Excel-like functionality with enterprise support</li>
                  </ul>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    <strong>Note:</strong> If you don't need enterprise features, consider{" "}
                    <Link
                      href="/blog/ag-grid-alternatives-free-react-data-grids"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      free AG Grid alternatives
                    </Link>{" "}
                    that offer similar functionality without the cost.
                  </p>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Choose Material React Table if:
                  </h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                    <li>You're already using Material-UI in your app</li>
                    <li>You want TanStack Table power with pre-built Material Design components</li>
                    <li>You're okay with a larger bundle size for the convenience</li>
                    <li>You need your table to match Material-UI's design language</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion">
          <div className="bg-linear-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              Conclusion: Column Resizing Done Right
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Column resizing is a fundamental feature for data-heavy applications. Users expect
                it, and implementing it properly makes the difference between a frustrating
                experience and a professional, polished application.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                While the feature seems simple on the surface, proper implementation involves
                handling mouse/touch events, managing width constraints, integrating with
                auto-expand logic, and maintaining performance. The good news is that modern React
                table libraries handle most of this complexity for you.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>Simple Table</strong> offers the easiest path: enable column resizing with
                one prop, and it works seamlessly with auto-expanding columns, sorting, filtering,
                and all other features. No configuration, no UI building, no headaches.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Ready to add column resizing to your React app?{" "}
                <Link
                  href="/docs/column-resizing"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Check out Simple Table's column resizing documentation
                </Link>{" "}
                and see how easy it can be.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <CallToActionCard
          title="Ready to add column resizing to your React table?"
          description="Simple Table makes column resizing effortless with just one prop. Get drag-to-resize, auto-expand integration, and smooth performance out of the box. No configuration, no UI building, no headaches."
          primaryButton={{
            text: "View Column Resizing Docs",
            href: "/docs/column-resizing",
          }}
          secondaryButton={{
            text: "Try Live Demo",
            href: "/examples",
          }}
        />
      </article>
    </BlogLayout>
  );
}
