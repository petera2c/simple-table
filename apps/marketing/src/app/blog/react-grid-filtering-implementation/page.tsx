import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faCheckCircle,
  faLightbulb,
  faCode,
  faServer,
  faRocket,
  faBolt,
  faTable,
  faSearch,
  faExclamationTriangle,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import CodeBlock from "@/components/CodeBlock";
import Link from "next/link";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.reactGridFiltering.title,
  description: SEO_STRINGS.blogPosts.reactGridFiltering.description,
  keywords: SEO_STRINGS.blogPosts.reactGridFiltering.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.reactGridFiltering.title,
    description: SEO_STRINGS.blogPosts.reactGridFiltering.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.reactGridFiltering.title,
    description: SEO_STRINGS.blogPosts.reactGridFiltering.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/react-grid-filtering-implementation",
  },
};

export default function ReactGridFilteringPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          React Grid Filtering: Client-Side vs Server-Side Implementation
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faFilter} />
            Filtering
          </span>
          <span className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            Tutorial
          </span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faSearch} />
            Search
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Users need to find specific data fast. Learn how to implement powerful filtering in React
          data grids—from simple text search to advanced multi-column filters, with both client-side
          and server-side approaches.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8 mb-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You're staring at 10,000 customer records. Somewhere in there is "Sarah Martinez
                from Acme Corp who signed up in Q3 2024." Without filtering, you're scrolling
                forever or hoping pagination luck finds her on page 247. With filtering, you type
                "Sarah" in the name column, select "Acme" in the company filter, and boom—one row.
                Two seconds.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>
                  Filtering is the difference between usable data grids and frustrating ones.
                </strong>{" "}
                It transforms tables from static displays into powerful search and exploration
                tools. But implementation varies wildly depending on data size, backend
                capabilities, and user requirements.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                In this guide, we'll cover both client-side filtering (fast, simple, works offline)
                and server-side filtering (scales to millions of rows). You'll learn when to use
                each, how to implement them in React, and best practices for filter UX.
              </p>
            </div>
          </div>
        </section>

        {/* Client-Side vs Server-Side */}
        <section id="client-vs-server">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              Client-Side vs Server-Side: Which to Choose?
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBolt} className="text-blue-500" />
                    Client-Side Filtering
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Filter data <strong>in the browser</strong> using JavaScript. All data is loaded
                    upfront, filtering happens instantly.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faThumbsUp} />
                      Pros
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>
                        • <strong>Instant feedback:</strong> No network latency
                      </li>
                      <li>
                        • <strong>Simple to implement:</strong> Just filter an array
                      </li>
                      <li>
                        • <strong>Works offline:</strong> No server required
                      </li>
                      <li>
                        • <strong>Multi-column filtering:</strong> Easy to combine filters
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faThumbsDown} />
                      Cons
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>
                        • <strong>Limited scale:</strong> Only works for ~10K rows max
                      </li>
                      <li>
                        • <strong>Initial load time:</strong> Must fetch all data upfront
                      </li>
                      <li>
                        • <strong>Memory usage:</strong> Stores full dataset in browser
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-6 bg-purple-50 dark:bg-purple-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faServer} className="text-purple-500" />
                    Server-Side Filtering
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Filter data <strong>on the backend</strong>. Send filter criteria to server,
                    receive filtered results.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faThumbsUp} />
                      Pros
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>
                        • <strong>Scales infinitely:</strong> Works with millions of rows
                      </li>
                      <li>
                        • <strong>Fast initial load:</strong> Only fetch what's needed
                      </li>
                      <li>
                        • <strong>Low memory:</strong> Browser doesn't store full dataset
                      </li>
                      <li>
                        • <strong>Complex queries:</strong> Database-level filtering
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faThumbsDown} />
                      Cons
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>
                        • <strong>Network latency:</strong> Each filter triggers API call
                      </li>
                      <li>
                        • <strong>Backend work:</strong> Requires server-side implementation
                      </li>
                      <li>
                        • <strong>Requires internet:</strong> Doesn't work offline
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Rule of thumb:</strong> Use client-side filtering for &lt;10K rows. Use
                  server-side for larger datasets or when initial load time matters. Many apps use
                  client-side for simplicity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Client-Side Implementation */}
        <section id="client-side-implementation">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-blue-500" />
              Client-Side Filtering with Simple Table
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table has built-in client-side filtering. Just mark columns as filterable,
                and the table adds filter inputs automatically.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Basic Example: Customer Table
              </h3>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable, HeaderObject } from "@simple-table/react";
import "@simple-table/react/styles.css";

const headers: HeaderObject[] = [
  {
    accessor: "id",
    label: "ID",
    width: 80,
    isSortable: true,
    type: "number",
    filterable: true, // Enable filtering with 10 operators
  },
  {
    accessor: "name",
    label: "Customer Name",
    width: 200,
    isSortable: true,
    filterable: true, // Enable filtering with 8 string operators
    type: "string",
  },
  {
    accessor: "company",
    label: "Company",
    width: 180,
    isSortable: true,
    filterable: true,
    type: "string",
  },
  {
    accessor: "status",
    label: "Status",
    width: 120,
    isSortable: true,
    filterable: true, // Enable enum filtering with 4 operators
    type: "enum",
    enumOptions: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Pending", value: "pending" },
    ],
  },
  {
    accessor: "revenue",
    label: "Revenue",
    width: 120,
    isSortable: true,
    filterable: true, // Number filtering with 10 operators
    type: "number",
    align: "right",
    valueFormatter: ({ value }) => 
      new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      }).format(value as number),
  },
  {
    accessor: "signupDate",
    label: "Signup Date",
    width: 140,
    isSortable: true,
    filterable: true, // Date filtering with 8 operators
    type: "date",
  },
  {
    accessor: "isPremium",
    label: "Premium",
    width: 100,
    isSortable: true,
    filterable: true, // Boolean filtering with 3 operators
    type: "boolean",
  },
];

export default function CustomerTable({ data }) {
  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={data}
      
      height="600px"
      theme="modern-light"
    />
  );
}`}
              />

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>That's it!</strong> Users can now click the filter icon in any header to
                  filter that column. Simple Table provides intelligent filtering with different
                  operators for each data type—automatically.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Intelligent Type-Based Filtering
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table automatically provides appropriate filter operators based on column
                type. This works seamlessly with{" "}
                <Link
                  href="/docs/column-sorting"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  column sorting
                </Link>{" "}
                and{" "}
                <Link
                  href="/docs/pagination"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  pagination
                </Link>
                :
              </p>

              <div className="space-y-4 mb-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    📝 String Filtering (8 operators)
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Contains, Does not contain, Equals, Does not equal, Starts with, Ends with, Is
                    empty, Is not empty
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Case-insensitive by default. Perfect for names, emails, descriptions.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🔢 Number Filtering (10 operators)
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Equals, Does not equal, Greater than, Greater than or equal, Less than, Less
                    than or equal, Between, Not between, Is empty, Is not empty
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Perfect for prices, quantities, ages, scores.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    📅 Date Filtering (8 operators)
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Equals, Does not equal, Before, After, Between, Not between, Is empty, Is not
                    empty
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Date picker UI for easy date range selection.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    ✓ Boolean Filtering (3 operators)
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Is true, Is false, Is empty
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Simple true/false/null filtering for flags and toggles.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    📋 Enum Filtering (4 operators + search)
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Is one of, Is not one of, Is empty, Is not empty
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Multi-select from predefined options. Auto-adds search input when more than 10
                    options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Server-Side Implementation */}
        <section id="server-side-implementation">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faServer} className="text-purple-500" />
              Server-Side Filtering Implementation
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                For large datasets, you need to send filter criteria to your backend and fetch
                filtered results. Here's how to implement it:
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Using onFilterChange for Server-Side Filtering
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table provides built-in filter UI with intelligent operators. For server-side
                filtering, use `onFilterChange` to receive filter state and fetch filtered data from
                your API:
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable, HeaderObject, TableFilterState } from "@simple-table/react";
import { useState, useEffect } from "react";

export default function ServerSideFilterTable() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState<TableFilterState>({});
  const [loading, setLoading] = useState(false);

  const headers: HeaderObject[] = [
    {
      accessor: "name",
      label: "Customer Name",
      width: 200,
      filterable: true, // Keep filter UI
      type: "string",
    },
    {
      accessor: "status",
      label: "Status",
      width: 120,
      filterable: true,
      type: "enum",
      enumOptions: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
      ],
    },
    {
      accessor: "revenue",
      label: "Revenue",
      width: 120,
      filterable: true,
      type: "number",
    },
    // ... other columns
  ];

  // Fetch data whenever filters change
  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);
      
      // Convert filter state to API params
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([filterId, filter]) => {
        params.append(filterId, JSON.stringify(filter));
      });
      
      const response = await fetch(\`/api/customers?\${params}\`);
      const result = await response.json();
      
      setData(result);
      setLoading(false);
    };

    // Debounce API calls
    const timeoutId = setTimeout(fetchFilteredData, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  return (
    <div>
      {loading && <div className="mb-2">Loading filtered results...</div>}
      
      <SimpleTable
        defaultHeaders={headers}
        rows={data}
        
        height="600px"
        onFilterChange={(newFilters) => setFilters(newFilters)}
        externalFilterHandling={true} // Disable client-side filtering
      />
    </div>
  );
}`}
              />

              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Key points:</strong> Set `externalFilterHandling={true}` to disable
                  internal filtering. Simple Table still shows the filter UI with all operators, but
                  you handle the actual filtering via API. Users get the same great filter
                  experience while you control the backend logic.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Backend Implementation (Node.js Example)
              </h3>

              <CodeBlock
                className="mb-6"
                code={`// API route: /api/customers
app.get('/api/customers', async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  let query = db.select('*').from('customers');
  
  // Parse filter parameters
  Object.entries(req.query).forEach(([key, value]) => {
    if (key.startsWith('filter_')) {
      const filter = JSON.parse(value);
      const columnName = filter.column;
      const operator = filter.operator;
      const filterValue = filter.value;
      
      // Apply filter based on operator
      switch (operator) {
        case 'contains':
          query = query.where(columnName, 'like', \`%\${filterValue}%\`);
          break;
        case 'equals':
          query = query.where(columnName, '=', filterValue);
          break;
        case 'greaterThan':
          query = query.where(columnName, '>', filterValue);
          break;
        case 'lessThan':
          query = query.where(columnName, '<', filterValue);
          break;
        case 'between':
          query = query.whereBetween(columnName, [filterValue.min, filterValue.max]);
          break;
        case 'isOneOf':
          query = query.whereIn(columnName, filterValue);
          break;
        // ... handle other operators
      }
    }
  });
  
  // Add pagination
  const offset = (page - 1) * limit;
  query = query.limit(limit).offset(offset);
  
  const results = await query;
  res.json(results);
});`}
              />
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              Filter UX Best Practices
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="space-y-4 mb-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🎯 Show Active Filters Clearly
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Users should always know which filters are active. Use badges, highlights, or a
                    "Active Filters" summary above the table.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    ⚡ Debounce Text Input
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Wait 300-500ms after user stops typing before applying filters. Prevents
                    excessive API calls or re-renders while typing.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    💾 Persist Filter State
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Save filter criteria in URL query params or localStorage. Users expect filters
                    to persist when navigating away and returning.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🧹 "Clear All" Button
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Always provide a one-click way to clear all filters. Users get lost in filtered
                    views—give them an escape hatch.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    📊 Show Result Counts
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Display "Showing 47 of 10,000 results" so users understand the impact of their
                    filters. Empty results should explain why.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🚀 Loading States
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    For server-side filtering, show a loading indicator while fetching. Skeleton
                    rows or a spinner prevent confusion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Patterns */}
        <section id="advanced-patterns">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-purple-500" />
              Advanced Filtering Patterns
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Saved Filter Presets
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Let users save complex filter combinations for quick reuse:
              </p>

              <CodeBlock
                className="mb-6"
                code={`const [savedFilters, setSavedFilters] = useState([
  { name: "High Value Active", filters: { status: ["Active"], revenue: ">100000" } },
  { name: "Q4 Signups", filters: { signupDate: "2024-10-01,2024-12-31" } },
]);

// UI to apply saved filters
<select onChange={(e) => applyFilterPreset(e.target.value)}>
  <option>Select a preset...</option>
  {savedFilters.map(preset => (
    <option key={preset.name} value={preset.name}>
      {preset.name}
    </option>
  ))}
</select>`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Smart Filter Suggestions
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                As users type, suggest common values from the dataset:
              </p>

              <CodeBlock
                className="mb-6"
                code={`const [suggestions, setSuggestions] = useState([]);

const handleInputChange = (value: string) => {
  // Fetch suggestions from backend
  fetch(\`/api/suggestions?column=name&query=\${value}\`)
    .then(res => res.json())
    .then(data => setSuggestions(data));
};

// Render autocomplete dropdown
<input
  type="text"
  onChange={(e) => handleInputChange(e.target.value)}
  list="suggestions"
/>
<datalist id="suggestions">
  {suggestions.map(item => (
    <option key={item.value} value={item.value} />
  ))}
</datalist>`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Hybrid Approach: Client + Server
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Fetch first 10K rows, filter client-side. If user needs more, fetch from server:
              </p>

              <CodeBlock
                className="mb-6"
                code={`const [mode, setMode] = useState<'client' | 'server'>('client');
const [allData, setAllData] = useState([]);

useEffect(() => {
  // Initially fetch first 10K rows
  fetch('/api/customers?limit=10000')
    .then(res => res.json())
    .then(data => {
      setAllData(data);
      setMode('client');
    });
}, []);

const handleFilterChange = (filters) => {
  if (mode === 'client') {
    // Try client-side filtering first
    const filtered = allData.filter(row => matchesFilters(row, filters));
    
    if (filtered.length < 50 && allData.length === 10000) {
      // Might be more results on server
      setMode('server');
      fetchFromServer(filters);
    }
  } else {
    fetchFromServer(filters);
  }
};`}
              />
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              Filtering: Essential for Data Exploration
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Without filtering, data grids are just static displays. With filtering, they become
                powerful exploration tools. Whether you're building CRMs, admin panels, or analytics
                dashboards, filtering transforms how users interact with data.
              </p>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Use client-side filtering</strong> for datasets under 10K rows
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Use server-side filtering</strong> for large datasets or fast initial
                    load
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Debounce text inputs</strong> to avoid excessive API calls
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Show active filters clearly</strong> and provide a "Clear All" button
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Persist filter state</strong> in URL params for shareable filtered views
                  </span>
                </li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300">
                Simple Table makes client-side filtering trivial with built-in support. For
                server-side, you have full control to implement custom filter UI and integrate with
                your backend. Choose the approach that fits your data size and requirements.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Ready to add powerful filtering to your React tables?"
        description="Simple Table provides built-in client-side filtering for instant search, or gives you the flexibility to implement custom server-side filtering for massive datasets. Start building filterable tables in minutes."
        primaryButton={{
          text: "View Filtering Docs",
          href: "/docs/column-filtering",
        }}
        secondaryButton={{
          text: "Try Live Demo",
          href: "/docs/column-filtering",
        }}
      />
    </BlogLayout>
  );
}
