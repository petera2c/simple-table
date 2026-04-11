import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faCheckCircle,
  faLightbulb,
  faCode,
  faChartLine,
  faBolt,
  faExclamationTriangle,
  faSitemap,
  faCog,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import CodeBlock from "@/components/CodeBlock";
import Link from "next/link";
import NestedTablesDemoWrapper from "@/components/blog/NestedTablesDemoWrapper";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.nestedTablesReact.title,
  description: SEO_STRINGS.blogPosts.nestedTablesReact.description,
  keywords: SEO_STRINGS.blogPosts.nestedTablesReact.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.nestedTablesReact.title,
    description: SEO_STRINGS.blogPosts.nestedTablesReact.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.nestedTablesReact.title,
    description: SEO_STRINGS.blogPosts.nestedTablesReact.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/nested-tables-react-hierarchical-data",
  },
};

export default function NestedTablesReactPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Nested Tables in React: Beyond Row Grouping with Independent Grid Structures
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faLayerGroup} />
            Nested Tables
          </span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            Advanced Tutorial
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faSitemap} />
            Hierarchical Data
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Discover how nested tables revolutionize hierarchical data display by allowing each level
          to have completely different columns. Learn the architecture behind this powerful feature
          and when to use it over traditional row grouping.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8 mb-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You're building a corporate dashboard. The top level shows companies with 9
                columns—name, industry, CEO, revenue, market cap, and more. When users expand a
                company, they see divisions with 6 columns—division ID, name, revenue, profit
                margin, headcount, and location. Expand a division, and you get teams with 19
                detailed columns—manager, budget, headcount, skills, certifications, and everything
                else.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                This isn't traditional{" "}
                <Link
                  href="/blog/react-tree-data-hierarchical-tables"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  row grouping
                </Link>{" "}
                where all levels share the same columns. This is <strong>nested tables</strong>—a
                more powerful pattern where each hierarchical level gets its own completely
                independent table with different columns, configuration, and features.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                In this deep dive, we'll explore how nested tables work under the hood, the
                technical challenges they solve, and why implementing them correctly requires
                sophisticated architecture that most developers never see.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faTable} className="text-blue-500" />
              Interactive Demo: Corporate Hierarchy
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
              <p className="text-gray-700 dark:text-gray-300">
                Try expanding companies to see divisions with completely different columns. This
                interactive demo shows how nested tables allow each level to display exactly the
                data it needs. For complete implementation details and advanced features, check out
                the{" "}
                <Link
                  href="/docs/nested-tables"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  nested tables documentation
                </Link>
                .
              </p>
            </div>

            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <NestedTablesDemoWrapper height="500px" />
            </div>
          </div>
        </section>

        {/* Row Grouping vs Nested Tables */}
        <section id="comparison">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faTable} className="text-blue-500" />
              Row Grouping vs Nested Tables: Understanding the Difference
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Before diving into nested tables, it's crucial to understand how they differ from
                traditional row grouping:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faSitemap} className="text-blue-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Row Grouping</h4>
                  </div>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• All levels share the same column structure</li>
                    <li>• Child rows simply indent under parents</li>
                    <li>• Same headers visible at every depth</li>
                    <li>• Simpler implementation</li>
                    <li>• Best for homogeneous data</li>
                  </ul>
                </div>

                <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-purple-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Nested Tables</h4>
                  </div>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Each level has independent columns</li>
                    <li>• Full table rendered inside parent row</li>
                    <li>• Different headers at each depth</li>
                    <li>• Complex architecture required</li>
                    <li>• Best for heterogeneous hierarchies</li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  The Key Insight
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Nested tables render complete, independent SimpleTable instances inside parent
                  rows. Each nested table is a full-featured grid with its own headers, sorting,
                  filtering, pagination, and all other features—completely separate from its parent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Example */}
        <section id="example">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faChartLine} className="text-green-500" />
              Real-World Example: Corporate Hierarchy
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Let's look at a concrete example that demonstrates why nested tables are necessary.
                This three-level hierarchy shows companies, divisions, and teams—each with
                dramatically different data needs:
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Level 0: Companies (9 columns)
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    High-level overview: industry, headquarters, market cap, CEO, revenue, employees
                  </p>
                  <CodeBlock
                    code={`const companyHeaders: HeaderObject[] = [
  {
    accessor: "companyName",
    label: "Company",
    width: 200,
    expandable: true,
    nestedTable: {
      defaultHeaders: divisionHeaders,  // Different columns!
      autoExpandColumns: true,
      enableRowSelection: true,
    },
  },
  { accessor: "industry", label: "Industry", width: 150 },
  { accessor: "founded", label: "Founded", width: 100 },
  { accessor: "headquarters", label: "HQ", width: 180 },
  { accessor: "stockSymbol", label: "Symbol", width: 100 },
  { accessor: "marketCap", label: "Market Cap", width: 120 },
  { accessor: "ceo", label: "CEO", width: 150 },
  { accessor: "revenue", label: "Revenue", width: 120 },
  { accessor: "employees", label: "Employees", width: 120 },
];`}
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Level 1: Divisions (6 columns)
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Division-level details with financial metrics and operational data
                  </p>
                  <CodeBlock
                    code={`const divisionHeaders: HeaderObject[] = [
  { accessor: "divisionId", label: "Division ID", width: 120 },
  { accessor: "divisionName", label: "Division", width: 200 },
  { accessor: "revenue", label: "Revenue", width: 120 },
  { accessor: "profitMargin", label: "Profit Margin", width: 130 },
  { accessor: "headcount", label: "Headcount", width: 110, type: "number" },
  { accessor: "location", label: "Location", width: 150 },
];`}
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Level 2: Teams (19 columns)
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Detailed operational data: manager, budget, headcount, skills, certifications,
                    and more
                  </p>
                  <CodeBlock
                    code={`const teamHeaders: HeaderObject[] = [
  { accessor: "teamName", label: "Team", width: 200 },
  { accessor: "manager", label: "Manager", width: 150 },
  { accessor: "location", label: "Location", width: 130 },
  { accessor: "budget", label: "Budget", width: 100 },
  { accessor: "headcount", label: "Headcount", width: 110 },
  { accessor: "projects", label: "Projects", width: 100 },
  { accessor: "efficiency", label: "Efficiency", width: 100 },
  { accessor: "satisfaction", label: "Satisfaction", width: 110 },
  { accessor: "turnover", label: "Turnover", width: 100 },
  { accessor: "avgSalary", label: "Avg Salary", width: 110 },
  { accessor: "topSkill", label: "Top Skill", width: 150 },
  { accessor: "certifications", label: "Certs", width: 80 },
  { accessor: "remoteWorkers", label: "Remote", width: 90 },
  { accessor: "officeSpace", label: "Office Space", width: 120 },
  { accessor: "equipment", label: "Equipment", width: 110 },
  { accessor: "trainingHours", label: "Training Hrs", width: 110 },
  { accessor: "innovations", label: "Innovations", width: 110 },
  { accessor: "patents", label: "Patents", width: 90 },
  { accessor: "awards", label: "Awards", width: 180 },
];`}
                  />
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Why This Matters
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  With row grouping, you'd be forced to show all 34 columns at every level (9 + 6 +
                  19), or hide columns conditionally (messy). With nested tables, each level shows
                  exactly the data it needs—no more, no less. The parent shows strategic overview,
                  children show tactical details.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="architecture">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCog} className="text-purple-500" />
              How Nested Tables Work: The Architecture
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Implementing nested tables is deceptively complex. Here's what happens under the
                hood when you configure nested tables in Simple Table:
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                1. Configuration & Setup
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Nested tables are configured via the{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  nestedTable
                </code>{" "}
                property on a HeaderObject that has{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  expandable: true
                </code>
                :
              </p>

              <CodeBlock
                className="mb-6"
                code={`{
  accessor: "companyName",
  label: "Company",
  expandable: true,
  nestedTable: {
    defaultHeaders: divisionHeaders,  // Column structure for nested level
    autoExpandColumns: true,           // Any SimpleTableProps work here
    enableRowSelection: true,
    // ... any other SimpleTableProps except 'rows'
  }
}`}
              />

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  nestedTable
                </code>{" "}
                object accepts all SimpleTableProps except{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">rows</code>{" "}
                (which come from parent data). This means nested tables can have their own sorting,
                filtering, pagination, themes, and any other feature.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                2. Data Flow & Hierarchy
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You still use the{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  rowGrouping
                </code>{" "}
                prop to define the hierarchy path:
              </p>

              <CodeBlock
                className="mb-6"
                code={`<SimpleTable
  defaultHeaders={companyHeaders}
  rows={data}
  rowGrouping={["divisions", "teams"]}  // Hierarchy: companies → divisions → teams
  expandAll={false}
/>`}
              />

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                When the library processes this:
              </p>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>
                    It checks if the expandable header has a{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      nestedTable
                    </code>{" "}
                    configuration
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>
                    If yes, it creates a special "nested grid row" instead of rendering individual
                    child rows
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>
                    The nested grid row renders a full SimpleTable component with child data from
                    the parent row's{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      divisions
                    </code>{" "}
                    property
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>
                    If that nested table also has{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      nestedTable
                    </code>{" "}
                    config, the process repeats recursively
                  </span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                3. Row Flattening & Virtualization
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                For virtualization to work, the library must flatten the hierarchical data into a
                flat array. Here's where it gets interesting:
              </p>

              <CodeBlock
                className="mb-6"
                code={`// Flattened array for virtualization
[
  { type: "data", depth: 0, row: companyRow1, id: "0" },
  { type: "nested-table", depth: 1, parentRow: companyRow1, nestedConfig: {...}, id: "0-divisions" },
  { type: "data", depth: 0, row: companyRow2, id: "1" },
  // ... more rows
]`}
              />

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                When a row with{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  nestedTable
                </code>{" "}
                config is expanded, the library injects a special row with{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  type: "nested-table"
                </code>
                . This row:
              </p>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li>• Spans the full width of the parent table</li>
                <li>• Contains all information needed to render the nested SimpleTable</li>
                <li>• Has a calculated height based on child row count</li>
                <li>• Is treated as a single row by the virtualization system</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                4. Dynamic Height Calculation
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                One of the trickiest parts: calculating the exact height of nested tables for
                virtualization. The formula is:
              </p>

              <CodeBlock
                className="mb-6"
                code={`// Height calculation for nested table
const nestedTableHeight = 
  headerHeight + headerBorder +
  (childRowCount × (rowHeight + rowSeparator)) +
  topPadding + bottomPadding + tableBorder;

// Respect maximum height constraint
const finalHeight = Math.min(nestedTableHeight, maxNestedTableHeight);`}
              />

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                This calculation must be pixel-perfect. If it's off by even 1px, virtualization
                breaks—rows appear in wrong positions, scrolling stutters, and the entire table
                becomes unusable.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                5. Position Tracking & Stable IDs
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Each row needs a unique, stable ID for React reconciliation and state management:
              </p>

              <CodeBlock
                className="mb-6"
                code={`// Row ID format: "parentIndex-groupingKey-childIndex-groupingKey-grandchildIndex"
"0"                           // Company at index 0
"0-divisions-2"               // Division at index 2 in company 0
"0-divisions-2-teams-1"       // Team at index 1 in division 2 of company 0`}
              />

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                These IDs allow the library to:
              </p>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li>• Track expansion state across re-renders</li>
                <li>• Handle programmatic expand/collapse</li>
                <li>• Maintain selection state at any nesting level</li>
                <li>• Support animations and transitions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technical Challenges */}
        <section id="challenges">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500" />
              The Hidden Complexities
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Nested tables look simple from the API perspective, but implementing them correctly
                requires solving numerous challenging problems:
              </p>

              <div className="space-y-4">
                <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    1. Independent Grid State Management
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Each nested table is a complete SimpleTable instance with its own sorting,
                    filtering, pagination, and selection state. Managing state across multiple
                    independent tables while keeping them synchronized with parent data is complex.
                    Changes to parent data must cascade to nested tables without losing their
                    internal state.
                  </p>
                </div>

                <div className="border border-orange-200 dark:border-orange-700 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    2. Virtualization Integration
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Nested tables must integrate seamlessly with the parent's virtualization system.
                    Each nested table occupies a single position in the flattened array, but its
                    height varies based on child count. Height calculations must be exact, and
                    transform positioning must account for variable-height nested tables above the
                    current scroll position.
                  </p>
                </div>

                <div className="border border-amber-200 dark:border-amber-700 rounded-lg p-4 bg-amber-50 dark:bg-amber-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    3. Theme & Customization Inheritance
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Child tables inherit parent's{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      customTheme
                    </code>{" "}
                    by default, but can override specific properties. The merge strategy must be
                    smart:{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                      {"{ ...parentTheme, ...childTheme }"}
                    </code>
                    . This cascades through multiple levels, so a grandchild table might inherit
                    from parent, override some properties, and add its own.
                  </p>
                </div>

                <div className="border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    4. Recursive Row Grouping
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    When nesting multiple levels, each nested table receives the remaining{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      rowGrouping
                    </code>{" "}
                    array. If parent has{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                      ["divisions", "teams"]
                    </code>
                    , first nested level gets{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">["teams"]</code>.
                    This enables automatic multi-level nesting without manual configuration at each
                    level.
                  </p>
                </div>

                <div className="border border-lime-200 dark:border-lime-700 rounded-lg p-4 bg-lime-50 dark:bg-lime-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    5. Expansion State Tracking
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    The library must track which rows are expanded at each depth level. Uses{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      expandedDepths
                    </code>{" "}
                    Set for default expansion by depth, plus{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      expandedRows
                    </code>{" "}
                    and{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      collapsedRows
                    </code>{" "}
                    Maps for manual overrides. Row IDs must be stable across data updates to
                    maintain expansion state.
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    6. Selection & Interaction Independence
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Each nested table can have independent row selection. Parent and child
                    selections are managed separately. Callbacks receive context about which table
                    level triggered the event. This allows selecting a company without selecting its
                    divisions, or vice versa.
                  </p>
                </div>

                <div className="border border-teal-200 dark:border-teal-700 rounded-lg p-4 bg-teal-50 dark:bg-teal-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    7. Styling & Layout Coordination
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Nested tables span full parent width (
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      grid-column: 1 / -1
                    </code>
                    ). Padding and borders create visual separation. Must handle pinned columns,
                    scrolling, and responsive behavior. Column borders, hover effects, and themes
                    cascade to nested tables while maintaining visual hierarchy.
                  </p>
                </div>

                <div className="border border-cyan-200 dark:border-cyan-700 rounded-lg p-4 bg-cyan-50 dark:bg-cyan-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    8. Performance at Scale
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Each nested table is a full React component tree. Virtualization only renders
                    visible rows, including nested tables. Collapsed nested tables are not rendered
                    (zero performance cost). However, large datasets with many expanded nested
                    tables can impact performance—each visible nested table adds dozens of DOM nodes
                    and React components.
                  </p>
                </div>

                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    9. Data Access Patterns
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Uses dot notation and array bracket notation for nested data access. Examples:{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">"divisions"</code>,{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                      "divisions[0].name"
                    </code>
                    ,{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                      "latest.score"
                    </code>
                    . Recursive traversal to extract child data from parent rows. Must handle
                    missing data gracefully (undefined divisions array, null values, etc.).
                  </p>
                </div>

                <div className="border border-indigo-200 dark:border-indigo-700 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    10. Memory Management
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Nested tables increase memory usage when many are expanded. Each nested table
                    maintains its own state, event handlers, and React fiber tree. Proper cleanup on
                    collapse is essential. Memoization and React.memo help, but can't eliminate the
                    fundamental cost of rendering multiple independent tables.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Guide */}
        <section id="implementation">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-blue-500" />
              Implementation: Building Nested Tables
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Despite the complex architecture, using nested tables in Simple Table is
                straightforward. Here's a complete implementation:
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Step 1: Structure Your Data
              </h3>

              <CodeBlock
                className="mb-6"
                code={`const data = [
  {
    // Company level (Level 0)
    companyName: "TechCorp Global",
    industry: "Technology",
    founded: 2015,
    headquarters: "San Francisco, CA",
    stockSymbol: "TECH",
    marketCap: "$150B",
    ceo: "Jane Smith",
    revenue: "$45B",
    employees: 50000,
    
    // Child divisions (Level 1)
    divisions: [
      {
        divisionName: "Cloud Services",
        revenue: "$15B",
        profitMargin: "35%",
        
        // Child teams (Level 2)
        teams: [
          {
            teamName: "Infrastructure",
            manager: "John Doe",
            location: "Seattle",
            budget: "$2.8M",
            headcount: 28,
            projects: 12,
            efficiency: "92%",
            satisfaction: 4.5,
            // ... 11 more team fields
          },
          // ... more teams
        ]
      },
      // ... more divisions
    ]
  },
  // ... more companies
];`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Step 2: Define Headers for Each Level
              </h3>

              <CodeBlock
                className="mb-6"
                code={`// Level 2: Team headers (innermost level)
const teamHeaders: HeaderObject[] = [
  { accessor: "teamName", label: "Team", width: 200 },
  { accessor: "manager", label: "Manager", width: 150 },
  { accessor: "budget", label: "Budget", width: 100 },
  // ... 16 more columns
];

// Level 1: Division headers (middle level)
const divisionHeaders: HeaderObject[] = [
  {
    accessor: "divisionName",
    label: "Division",
    width: 250,
    expandable: true,
    nestedTable: {
      defaultHeaders: teamHeaders,  // Point to next level
      autoExpandColumns: true,
      enableRowSelection: true,
    },
  },
  { accessor: "revenue", label: "Revenue", width: 150 },
  { accessor: "profitMargin", label: "Profit Margin", width: 150 },
];

// Level 0: Company headers (top level)
const companyHeaders: HeaderObject[] = [
  {
    accessor: "companyName",
    label: "Company",
    width: 200,
    expandable: true,
    nestedTable: {
      defaultHeaders: divisionHeaders,  // Point to next level
      autoExpandColumns: true,
      enableRowSelection: true,
    },
  },
  { accessor: "industry", label: "Industry", width: 150 },
  { accessor: "founded", label: "Founded", width: 100 },
  // ... 6 more columns
];`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Step 3: Configure the Table
              </h3>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable } from "@simple-table/react";
import "@simple-table/react/styles.css";

function CorporateHierarchy() {
  return (
    <SimpleTable
      defaultHeaders={companyHeaders}
      rows={data}
      
      // Define the hierarchy path
      rowGrouping={["divisions", "teams"]}
      
      // Start collapsed for better performance
      expandAll={false}
      
      // Enable features
      columnResizing={true}
      enableRowSelection={true}
      
      // Set height
      height="600px"
      
      // Optional: Handle expansion events
      onRowGroupExpand={({ row, depth, groupingKey, isExpanded }) => {
        console.log(\`Expanded \${groupingKey} at depth \${depth}\`, row);
      }}
    />
  );
}`}
              />

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">That's It!</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  The library handles all the complexity: row flattening, height calculations,
                  virtualization integration, state management, theme inheritance, and recursive
                  nesting. You just define the structure and configuration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section id="use-cases">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              When to Use Nested Tables
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Nested tables are powerful but not always necessary. Here's when to use them versus
                traditional row grouping:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    Use Nested Tables When:
                  </h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li>
                      • Each hierarchy level needs <strong>different columns</strong>
                    </li>
                    <li>
                      • Parent shows overview, children show details (
                      <strong>different granularity</strong>)
                    </li>
                    <li>
                      • Child levels need <strong>independent features</strong> (sorting, filtering,
                      pagination)
                    </li>
                    <li>
                      • Data structure is <strong>heterogeneous</strong> (companies → divisions →
                      teams)
                    </li>
                    <li>
                      • You want <strong>visual separation</strong> between levels
                    </li>
                  </ul>
                </div>

                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <FontAwesomeIcon icon={faSitemap} className="text-blue-500" />
                    Use Row Grouping When:
                  </h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li>
                      • All levels share the <strong>same columns</strong>
                    </li>
                    <li>
                      • Simple indentation is sufficient (<strong>visual hierarchy only</strong>)
                    </li>
                    <li>
                      • Data structure is <strong>homogeneous</strong> (folders → subfolders →
                      files)
                    </li>
                    <li>
                      • You need <strong>aggregate functions</strong> (sum, count, avg) across
                      levels
                    </li>
                    <li>
                      • Performance is critical (<strong>lighter weight</strong>)
                    </li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Real-World Use Cases
              </h3>

              <div className="space-y-4">
                <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Corporate Hierarchy Dashboard
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Companies → Divisions → Teams:</strong> Show company overview (9
                    columns), division metrics (6 columns), and detailed team information (19
                    columns). Each level has completely different data needs.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Perfect for executive dashboards, organizational analytics, and strategic
                    planning tools.
                  </p>
                </div>

                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    E-commerce Order Management
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Orders → Line Items → Shipments:</strong> Display order summary
                    (customer, date, total), item details (product, quantity, price), and tracking
                    information (carrier, tracking number, status) with different columns at each
                    level.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Ideal for admin panels, customer service tools, and fulfillment systems.
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Project Management System
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Projects → Milestones → Tasks:</strong> Show project overview (name,
                    status, budget, timeline), milestone progress (name, completion, deadline), and
                    task details (assignee, priority, time tracking, dependencies).
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Great for project management tools, agile boards, and resource planning apps.
                  </p>
                </div>

                <div className="border border-amber-200 dark:border-amber-700 rounded-lg p-4 bg-amber-50 dark:bg-amber-900/20">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Financial Reporting
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Accounts → Sub-accounts → Transactions:</strong> Present account
                    summaries (type, balance, owner), sub-account details (name, balance, category),
                    and itemized transactions (date, description, amount, status).
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Perfect for accounting software, banking apps, and financial dashboards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Tips */}
        <section id="performance">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
              Performance Considerations
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Nested tables are more resource-intensive than row grouping. Here's how to optimize
                performance:
              </p>

              <div className="space-y-4">
                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    ✅ Start with expandAll={false}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Don't render all nested tables on initial load. Let users expand what they need.
                    This dramatically reduces initial render time and memory usage. Collapsed nested
                    tables have zero performance cost—they're not rendered at all.
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    ✅ Virtualization Works Automatically
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Simple Table's virtualization handles nested tables seamlessly. Even if you have
                    100 expanded nested tables, only the visible ones are rendered. Scrolling
                    remains smooth because DOM nodes are recycled.
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    ✅ Use Pagination for Deep Hierarchies
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    If you have 1000+ top-level rows, enable pagination. This limits the number of
                    rows that can be expanded simultaneously, keeping memory usage bounded. Combine
                    with virtualization for optimal performance.
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    ✅ Memoize Data Transformations
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    If you transform data before passing to the table, wrap it in{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      useMemo
                    </code>
                    . Don't recalculate the entire hierarchy on every render. This prevents
                    unnecessary re-renders of nested tables.
                  </p>
                </div>

                <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />❌
                    Avoid: Expanding Everything
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Don't use{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      expandAll={true}
                    </code>{" "}
                    with large datasets. If you have 100 companies with 5 divisions each, that's 500
                    nested tables rendered simultaneously. Memory usage explodes and performance
                    tanks.
                  </p>
                </div>

                <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />❌
                    Avoid: Complex Cell Renderers in Nested Tables
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Each nested table multiplies the cost of cell renderers. If your nested table
                    has 50 rows with complex custom renderers, and you have 10 expanded nested
                    tables, that's 500 complex components rendered. Keep nested table cell renderers
                    simple.
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
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
              The Power of Independent Grid Structures
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Nested tables represent a fundamental shift in how we think about hierarchical data
                display. Instead of forcing all levels to share the same column structure, they
                embrace the reality that different levels of a hierarchy often need completely
                different views of the data.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The architecture required to implement nested tables correctly is sophisticated:
                recursive row flattening, dynamic height calculation, virtualization integration,
                independent state management, and theme inheritance. But when done right, the API
                becomes simple—just add a{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  nestedTable
                </code>{" "}
                property to your expandable column.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">Key takeaways:</p>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Use nested tables when each level needs different columns</strong>—not
                    when all levels share the same structure
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Each nested table is a full SimpleTable instance</strong> with
                    independent features, state, and configuration
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>The architecture is complex</strong> but the API is simple—configure
                    once and the library handles the rest
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Start with expandAll={false}</strong> for better performance, let users
                    expand what they need
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Virtualization handles nested tables automatically</strong>—only visible
                    nested tables are rendered
                  </span>
                </li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300">
                Whether you're building corporate dashboards, e-commerce admin panels, project
                management tools, or financial reporting systems, nested tables provide the
                flexibility to display hierarchical data exactly how your users need to see it—with
                different columns, features, and configurations at each level of the hierarchy.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Ready to implement nested tables?"
        description="Simple Table makes complex hierarchical data display simple with nested tables that support independent grid structures at each level. No complex configuration required."
        primaryButton={{
          text: "View Nested Tables Docs",
          href: "/docs/nested-tables",
        }}
        secondaryButton={{
          text: "Try Live Demo",
          href: "/docs/nested-tables",
        }}
      />
    </BlogLayout>
  );
}
