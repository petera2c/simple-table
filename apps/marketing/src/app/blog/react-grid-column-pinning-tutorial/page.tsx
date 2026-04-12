import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbtack,
  faCheckCircle,
  faLightbulb,
  faCode,
  faExclamationTriangle,
  faRocket,
  faBolt,
  faTable,
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
  title: SEO_STRINGS.blogPosts.columnPinningTutorial.title,
  description: SEO_STRINGS.blogPosts.columnPinningTutorial.description,
  keywords: SEO_STRINGS.blogPosts.columnPinningTutorial.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.columnPinningTutorial.title,
    description: SEO_STRINGS.blogPosts.columnPinningTutorial.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.columnPinningTutorial.title,
    description: SEO_STRINGS.blogPosts.columnPinningTutorial.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/react-grid-column-pinning-tutorial",
  },
};

export default function ReactGridColumnPinningPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          React Grid Column Pinning: Implementation Guide & Best Practices
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faThumbtack} />
            Column Pinning
          </span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            Tutorial
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faRocket} />
            Best Practices
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Keep critical columns visible while users scroll through wide datasets. Learn how to
          implement column pinning in React data grids with practical examples and implementation
          patterns.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8 mb-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You're reviewing sales data from the past quarter. There are 30+ columns of
                metrics—conversion rates, revenue per channel, customer acquisition costs, regional
                breakdowns. You scroll right to see Q3 data, and suddenly you've lost context. Which
                customer is this row about? What's the deal ID?
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                This is why <strong>column pinning</strong> (also called "freezing" or "sticky
                columns") exists. It keeps key columns—like IDs, names, or action buttons—fixed in
                place while the rest of the table scrolls horizontally. Users never lose context, no
                matter how wide your data gets.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                In this guide, we'll cover how to implement column pinning in React data grids,
                common pitfalls to avoid, and best practices for deciding what to pin. Whether
                you're building financial dashboards, CRM tools, or admin panels, column pinning is
                essential for working with wide datasets.
              </p>
            </div>
          </div>
        </section>

        {/* Why Column Pinning Matters */}
        <section id="why-column-pinning">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              Why Column Pinning Matters
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Wide tables are everywhere in business software. Financial reports span quarters.
                Product catalogs have dozens of specs. User tables track countless attributes.
                Without column pinning, users face a frustrating choice: sacrifice screen space to
                see everything, or lose context when scrolling.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Common Use Cases
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faTable} className="text-blue-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Financial Dashboards
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Pin the account name and ID while scrolling through quarterly revenue, expenses,
                    and profit across multiple periods.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faTable} className="text-green-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      CRM & Sales Tools
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Keep contact name and company visible while viewing deal stage, value,
                    probability, and activity history across wide tables.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faTable} className="text-purple-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      E-Commerce Admin
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Pin product name and SKU while managing inventory, pricing, variants, and
                    shipping details across multiple warehouses.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faTable} className="text-red-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Action Columns</h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Pin action buttons (Edit, Delete, View) to the right edge so they're always
                    accessible, no matter where users scroll.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Implementation Challenge */}
        <section id="implementation-challenge">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500" />
              The Implementation Challenge
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Column pinning <em>sounds</em> simple: just add{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  position: sticky
                </code>{" "}
                to some columns, right? Unfortunately, the CSS-only approach falls apart quickly.
                This is why{" "}
                <Link
                  href="/comparisons/simple-table-vs-ag-grid"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  professional data grids like AG Grid and Simple Table
                </Link>{" "}
                handle it for you:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-red-700 dark:text-red-400">
                    <FontAwesomeIcon icon={faThumbsDown} />
                    CSS-Only Approach Problems
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-amber-500 mt-1 shrink-0"
                      />
                      <span>
                        <strong>Stacking context issues:</strong> Z-index wars with other sticky
                        elements like headers or filters
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-amber-500 mt-1 shrink-0"
                      />
                      <span>
                        <strong>Shadow/border gaps:</strong> Visual artifacts where pinned columns
                        meet scrolling content
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-amber-500 mt-1 shrink-0"
                      />
                      <span>
                        <strong>Browser inconsistencies:</strong> Different rendering behavior
                        across Chrome, Firefox, Safari
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-amber-500 mt-1 shrink-0"
                      />
                      <span>
                        <strong>Touch device quirks:</strong> Sticky columns behave unpredictably on
                        mobile/tablet
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-400">
                    <FontAwesomeIcon icon={faThumbsUp} />
                    Library-Based Solution Benefits
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 shrink-0"
                      />
                      <span>
                        <strong>Tested across browsers:</strong> Works consistently in all modern
                        browsers
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 shrink-0"
                      />
                      <span>
                        <strong>Handles edge cases:</strong> Column resizing, reordering, and
                        dynamic visibility all work together
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 shrink-0"
                      />
                      <span>
                        <strong>Proper shadows/borders:</strong> Visual indicators show where pinned
                        columns end
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 shrink-0"
                      />
                      <span>
                        <strong>Mobile-optimized:</strong> Touch-friendly behavior on all devices
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Table Implementation */}
        <section id="simple-table-implementation">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-blue-500" />
              How to Implement Column Pinning in Simple Table
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                With Simple Table, column pinning is refreshingly simple. Add a{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">pinned</code>{" "}
                property to any column header, and it stays fixed while the rest scrolls.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Basic Example: CRM Dashboard
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
    pinned: "left", // Pin to the left
    isSortable: true,
    type: "number",
  },
  {
    accessor: "name",
    label: "Contact Name",
    width: 200,
    pinned: "left", // Also pin to the left
    isSortable: true,
    type: "string",
  },
  {
    accessor: "company",
    label: "Company",
    width: 180,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "dealStage",
    label: "Deal Stage",
    width: 150,
    isSortable: true,
    type: "string",
  },
  {
    accessor: "dealValue",
    label: "Deal Value",
    width: 120,
    isSortable: true,
    type: "number",
    align: "right",
    valueFormatter: ({ value }) => 
      new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      }).format(value as number),
  },
  {
    accessor: "probability",
    label: "Probability",
    width: 100,
    isSortable: true,
    type: "number",
    align: "right",
  },
  {
    accessor: "lastContact",
    label: "Last Contact",
    width: 140,
    isSortable: true,
    type: "date",
  },
  {
    accessor: "actions",
    label: "Actions",
    width: 120,
    pinned: "right", // Pin to the right
    align: "center",
    cellRenderer: ({ row }) => (
      <div className="flex gap-2 justify-center">
        <button className="text-blue-600 hover:text-blue-800">Edit</button>
        <button className="text-green-600 hover:text-green-800">View</button>
      </div>
    ),
  },
];

export default function CRMTable({ data }) {
  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={data}
      
      height="500px"
      theme="modern-light"
    />
  );
}`}
              />

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>That's it!</strong> The ID, Contact Name, and Actions columns stay fixed.
                  Users can scroll through all the deal details while always knowing which contact
                  they're looking at and having quick access to actions.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Key Points
              </h3>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Left pinning:</strong> Use{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      pinned: "left"
                    </code>{" "}
                    for identity columns (ID, name, title)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Right pinning:</strong> Use{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      pinned: "right"
                    </code>{" "}
                    for action columns (Edit, Delete, View)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Multiple columns:</strong> You can pin multiple columns to the same
                    side—they stack in order
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Works with other features:</strong> Pinned columns support{" "}
                    <Link
                      href="/docs/column-sorting"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      sorting
                    </Link>
                    ,{" "}
                    <Link
                      href="/docs/column-filtering"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      filtering
                    </Link>
                    , custom renderers, and all other column features
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              Column Pinning Best Practices
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                What to Pin
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Good Candidates for Pinning
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      • <strong>Identity columns:</strong> ID, name, title, email
                    </li>
                    <li>
                      • <strong>Primary context:</strong> Customer name, account ID, order number
                    </li>
                    <li>
                      • <strong>Action buttons:</strong> Edit, Delete, View, More
                    </li>
                    <li>
                      • <strong>Status indicators:</strong> Active/Inactive, Deal Stage, Priority
                    </li>
                    <li>
                      • <strong>Selection checkboxes:</strong> For bulk operations
                    </li>
                  </ul>
                </div>

                <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    Avoid Pinning These
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      • <strong>Wide columns:</strong> Long descriptions or multi-paragraph content
                    </li>
                    <li>
                      • <strong>Optional metadata:</strong> Created date, last updated, internal
                      notes
                    </li>
                    <li>
                      • <strong>Too many columns:</strong> Don't pin more than 2-3 on each side
                    </li>
                    <li>
                      • <strong>Columns users rarely need:</strong> Advanced technical details
                    </li>
                    <li>
                      • <strong>Redundant information:</strong> If it's also in a detail view
                    </li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Performance & UX Guidelines
              </h3>

              <div className="space-y-4 mb-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    📏 Keep Pinned Columns Narrow
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Pinned columns consume valuable horizontal space. Aim for 200-300px total for
                    left-pinned columns, 120-150px for right-pinned actions. Users should see
                    unpinned content without scrolling.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🎯 Pin What's Essential, Not Everything
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    If you pin 10 columns, users can't see any scrolling content. Pin only what
                    provides context or critical actions. Aim for 1-3 pinned columns max per side.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    📱 Test on Mobile & Tablets
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    On small screens, pinned columns consume a larger percentage of viewport width.
                    Consider conditionally disabling pinning on mobile, or only pin 1 column instead
                    of 2-3.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    💡 Use Visual Indicators
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Simple Table automatically adds shadows where pinned columns meet scrolling
                    content, helping users understand the layout. Don't remove these—they're
                    critical for usability.
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
              Advanced Patterns
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Conditional Pinning (Mobile-Responsive)
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You can conditionally pin columns based on screen size using responsive header
                configuration:
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { useMediaQuery } from "react-responsive";

export default function ResponsiveTable({ data }) {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const headers: HeaderObject[] = [
    {
      accessor: "id",
      label: "ID",
      width: 60,
      pinned: isMobile ? undefined : "left", // Only pin on desktop
    },
    {
      accessor: "name",
      label: "Name",
      width: 180,
      pinned: "left", // Always pinned
    },
    // ... other columns
    {
      accessor: "actions",
      label: "Actions",
      width: 100,
      pinned: isMobile ? undefined : "right", // Only pin on desktop
    },
  ];

  return <SimpleTable defaultHeaders={headers} rows={data} />;
}`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                User-Configurable Pinning
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                For power users, let them choose which columns to pin:
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { useState } from "react";

export default function ConfigurableTable({ data }) {
  const [pinnedColumns, setPinnedColumns] = useState<string[]>(["id", "name"]);

  const headers: HeaderObject[] = [
    {
      accessor: "id",
      label: "ID",
      width: 60,
      pinned: pinnedColumns.includes("id") ? "left" : undefined,
    },
    {
      accessor: "name",
      label: "Name",
      width: 180,
      pinned: pinnedColumns.includes("name") ? "left" : undefined,
    },
    // ... other columns
  ];

  const togglePin = (accessor: string) => {
    setPinnedColumns((prev) =>
      prev.includes(accessor)
        ? prev.filter((col) => col !== accessor)
        : [...prev, accessor]
    );
  };

  return (
    <div>
      <div className="mb-4">
        <strong>Pin/Unpin Columns:</strong>
        <button onClick={() => togglePin("id")}>
          {pinnedColumns.includes("id") ? "Unpin" : "Pin"} ID
        </button>
        <button onClick={() => togglePin("name")}>
          {pinnedColumns.includes("name") ? "Unpin" : "Pin"} Name
        </button>
      </div>
      <SimpleTable defaultHeaders={headers} rows={data} />
    </div>
  );
}`}
              />
            </div>
          </div>
        </section>

        {/* Library Comparison */}
        <section id="library-comparison">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faTable} className="text-blue-500" />
              Column Pinning Across React Libraries
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                How does column pinning compare across popular React data grid libraries?
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Library
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        Pinning Support
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        API Complexity
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Simple Table
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Built-in
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-green-600 dark:text-green-400">
                        Simple (1 prop)
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-green-600 dark:text-green-400">
                        Free
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        AG Grid Community
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-red-600 dark:text-red-400">
                        ✗ Enterprise Only
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        N/A
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-red-600 dark:text-red-400">
                        $999+/dev/year
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        TanStack Table
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-amber-600 dark:text-amber-400">
                        ⚡ Headless
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-amber-600 dark:text-amber-400">
                        Complex (build UI)
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-green-600 dark:text-green-400">
                        Free
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Ant Design Table
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Built-in (fixed)
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-green-600 dark:text-green-400">
                        Simple
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-green-600 dark:text-green-400">
                        Free
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Material React Table
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-green-600 dark:text-green-400">
                        ✓ Built-in
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-amber-600 dark:text-amber-400">
                        Medium (config)
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-green-600 dark:text-green-400">
                        Free
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              Wrap Up: Column Pinning Done Right
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Column pinning is essential for working with wide datasets. It keeps users oriented,
                reduces cognitive load, and makes action buttons always accessible. The
                implementation doesn't have to be complex—with the right library, it's as simple as
                adding{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  pinned: "left"
                </code>{" "}
                or{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  pinned: "right"
                </code>
                .
              </p>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Pin identity columns</strong> (ID, name) to the left
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Pin action buttons</strong> to the right for easy access
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Keep pinned columns narrow</strong> (200-300px total)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Test on mobile</strong> and adjust pinning for small screens
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Don't over-pin</strong>—aim for 1-3 columns per side maximum
                  </span>
                </li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300">
                Whether you're building financial dashboards, CRM tools, or e-commerce admin panels,
                column pinning improves UX dramatically. With Simple Table, you get production-ready
                pinning without the complexity—just one prop and you're done.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Ready to add column pinning to your React app?"
        description="Simple Table makes column pinning effortless with one simple prop. No CSS hacks, no browser inconsistencies, no complexity. Just production-ready pinning that works everywhere."
        primaryButton={{
          text: "View Column Pinning Docs",
          href: "/docs/column-pinning",
        }}
        secondaryButton={{
          text: "Try Live Demo",
          href: "/docs/column-pinning",
        }}
      />
    </BlogLayout>
  );
}
