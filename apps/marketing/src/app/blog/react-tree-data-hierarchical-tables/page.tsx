import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faCheckCircle,
  faLightbulb,
  faCode,
  faChartLine,
  faRocket,
  faBolt,
  faExclamationTriangle,
  faDatabase,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import CodeBlock from "@/components/CodeBlock";
import Link from "next/link";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.reactTreeDataHierarchical.title,
  description: SEO_STRINGS.blogPosts.reactTreeDataHierarchical.description,
  keywords: SEO_STRINGS.blogPosts.reactTreeDataHierarchical.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.reactTreeDataHierarchical.title,
    description: SEO_STRINGS.blogPosts.reactTreeDataHierarchical.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.reactTreeDataHierarchical.title,
    description: SEO_STRINGS.blogPosts.reactTreeDataHierarchical.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/react-tree-data-hierarchical-tables",
  },
};

export default function ReactTreeDataHierarchicalPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Tree Data in React Tables: The Complete Guide to Hierarchical Data Display
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faLayerGroup} />
            Tree Data
          </span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            Tutorial
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faSitemap} />
            Hierarchical Data
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Organization charts, file systems, project hierarchies—hierarchical data is everywhere.
          Learn how to display tree structures in React tables with expandable rows, lazy loading,
          and performance optimization.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8 mb-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You're building an org chart. Each company has divisions. Each division has
                departments. Each department has teams. Users need to drill down through this
                hierarchy, expanding and collapsing as they explore. Displaying this kind of nested,
                parent-child data in a table is called <strong>tree data</strong> or{" "}
                <strong>hierarchical data display</strong>.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Unlike flat tables where every row is independent, tree data requires understanding
                relationships: which rows are parents, which are children, how deep the nesting
                goes, and which branches are expanded or collapsed. Get it wrong, and you end up
                with a confusing mess. Get it right, and users can navigate complex data structures
                intuitively.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                In this guide, we'll cover how to implement tree data in React tables, common
                patterns for structuring hierarchical data, performance considerations for deep
                nesting, and advanced techniques like lazy loading child nodes on demand.
              </p>
            </div>
          </div>
        </section>

        {/* Why Tree Data Matters */}
        <section id="why-tree-data">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              Why Tree Data Matters
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Hierarchical data is everywhere in business applications:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faSitemap} className="text-blue-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Organization Charts
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Companies → Divisions → Departments → Teams → Employees. Multiple levels of
                    reporting structure need expandable visualization.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faChartLine} className="text-green-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Project Management
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Projects → Milestones → Tasks → Subtasks. Track progress across nested work
                    items with clear parent-child relationships.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faDatabase} className="text-purple-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Category Hierarchies
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Product catalogs, file systems, menu navigation—any data with categories,
                    subcategories, and items.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Financial Reporting
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Accounts → Sub-accounts → Transactions. Display nested financial data with
                    rollup totals at each level.
                  </p>
                </div>
              </div>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Without proper tree data support, developers resort to hacky workarounds: separate
                tables for each level, custom expand/collapse logic, manual indentation with CSS.
                These approaches break down with deep nesting or dynamic data. That's why{" "}
                <Link
                  href="/comparisons/simple-table-vs-tanstack"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  full-featured data grids
                </Link>{" "}
                include built-in row grouping.
              </p>
            </div>
          </div>
        </section>

        {/* Data Structure */}
        <section id="data-structure">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faDatabase} className="text-blue-500" />
              Understanding Tree Data Structure
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Tree data in React tables uses <strong>nested arrays</strong> to represent
                parent-child relationships. Each parent row contains an array of child rows, which
                can themselves contain arrays of grandchildren, and so on.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Simple Two-Level Example
              </h3>

              <CodeBlock
                className="mb-6"
                code={`// Companies → Departments (2 levels)
const data = [
  {
    id: "company-1",
    name: "TechCorp",
    employees: 250,
    revenue: "$25M",
    // Children stored in 'departments' array
    departments: [
      {
        id: "dept-1",
        name: "Engineering",
        employees: 120,
        revenue: "$15M",
      },
      {
        id: "dept-2",
        name: "Sales",
        employees: 80,
        revenue: "$8M",
      },
      {
        id: "dept-3",
        name: "Marketing",
        employees: 50,
        revenue: "$2M",
      },
    ],
  },
  {
    id: "company-2",
    name: "HealthPlus",
    employees: 180,
    revenue: "$18M",
    departments: [
      {
        id: "dept-4",
        name: "Medical",
        employees: 100,
        revenue: "$12M",
      },
      {
        id: "dept-5",
        name: "Research",
        employees: 80,
        revenue: "$6M",
      },
    ],
  },
];`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Multi-Level Deep Nesting
              </h3>

              <CodeBlock
                className="mb-6"
                code={`// Companies → Divisions → Departments → Teams (4 levels)
const data = [
  {
    id: "company-1",
    name: "TechCorp",
    employees: 500,
    // Level 1: Divisions
    divisions: [
      {
        id: "div-1",
        name: "Engineering Division",
        employees: 300,
        // Level 2: Departments
        departments: [
          {
            id: "dept-1",
            name: "Frontend Department",
            employees: 100,
            // Level 3: Teams
            teams: [
              {
                id: "team-1",
                name: "React Team",
                employees: 30,
              },
              {
                id: "team-2",
                name: "Vue Team",
                employees: 25,
              },
            ],
          },
          {
            id: "dept-2",
            name: "Backend Department",
            employees: 120,
            teams: [
              {
                id: "team-3",
                name: "API Team",
                employees: 40,
              },
              {
                id: "team-4",
                name: "Database Team",
                employees: 35,
              },
            ],
          },
        ],
      },
    ],
  },
];`}
              />

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Key Pattern</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Each level of the hierarchy uses a <strong>different array property name</strong>{" "}
                  (e.g.,{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">divisions</code>,{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">departments</code>,{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">teams</code>). This
                  tells the table which property contains the next level of children.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation with Simple Table */}
        <section id="implementation">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-green-500" />
              Implementation with Simple Table
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Step 1: Mark the Expandable Column
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                First, tell Simple Table which column should show the expand/collapse controls:
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable, HeaderObject } from "@simple-table/react";
import "@simple-table/react/styles.css";

const headers: HeaderObject[] = [
  {
    accessor: "name",
    label: "Organization Name",
    width: 250,
    expandable: true, // This column gets expand/collapse controls
    type: "string",
  },
  {
    accessor: "employees",
    label: "Employees",
    width: 120,
    type: "number",
  },
  {
    accessor: "revenue",
    label: "Revenue",
    width: 150,
    type: "string",
  },
];`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Step 2: Define the Hierarchy Levels
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Use the{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  rowGrouping
                </code>{" "}
                prop to specify the array property names for each nesting level:
              </p>

              <CodeBlock
                className="mb-6"
                code={`// Two levels: Companies → Departments
<SimpleTable
  defaultHeaders={headers}
  rows={data}
  
  rowGrouping={["departments"]} // Array property name for children
/>

// Three levels: Companies → Divisions → Departments
<SimpleTable
  defaultHeaders={headers}
  rows={data}
  
  rowGrouping={["divisions", "departments"]} // Order = nesting depth
/>

// Four levels: Companies → Divisions → Departments → Teams
<SimpleTable
  defaultHeaders={headers}
  rows={data}
  
  rowGrouping={["divisions", "departments", "teams"]}
/>`}
              />

              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  How it Works
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Simple Table reads the{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">rowGrouping</code>{" "}
                  array to understand your hierarchy:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                  <li>
                    First element (
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">"divisions"</code>)
                    = Level 1 children
                  </li>
                  <li>
                    Second element (
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">"departments"</code>
                    ) = Level 2 children
                  </li>
                  <li>
                    Third element (
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">"teams"</code>) =
                    Level 3 children
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Step 3: Control Initial Expand State
              </h3>

              <CodeBlock
                className="mb-6"
                code={`// Start with all rows collapsed
<SimpleTable
  expandAll={false}
  // ... other props
/>

// Start with all rows expanded (default)
<SimpleTable
  expandAll={true}
  // ... other props
/>`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Complete Example
              </h3>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable, HeaderObject } from "@simple-table/react";
import "@simple-table/react/styles.css";

const headers: HeaderObject[] = [
  { 
    accessor: "organization", 
    label: "Organization", 
    width: 200, 
    expandable: true,
    type: "string"
  },
  { accessor: "employees", label: "Employees", width: 100, type: "number" },
  { accessor: "budget", label: "Budget", width: 140, type: "string" },
  { accessor: "location", label: "Location", width: 130, type: "string" },
];

const data = [
  {
    id: "company-1",
    organization: "TechSolutions Inc.",
    employees: 137,
    budget: "$15.0M",
    location: "San Francisco",
    divisions: [
      {
        id: "div-100",
        organization: "Engineering Division",
        employees: 97,
        budget: "$10.6M",
        location: "Multiple",
        departments: [
          {
            id: "dept-1001",
            organization: "Frontend",
            employees: 28,
            budget: "$2.8M",
            location: "San Francisco",
          },
          {
            id: "dept-1002",
            organization: "Backend",
            employees: 32,
            budget: "$3.4M",
            location: "Seattle",
          },
        ],
      },
      {
        id: "div-101",
        organization: "Product Division",
        employees: 40,
        budget: "$4.4M",
        location: "Multiple",
        departments: [
          {
            id: "dept-1101",
            organization: "Design",
            employees: 17,
            budget: "$1.8M",
            location: "Portland",
          },
        ],
      },
    ],
  },
];

export default function OrgChartTable() {
  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={data}
      
      rowGrouping={["divisions", "departments"]}
      expandAll={false}
      height="600px"
    />
  );
}`}
              />
            </div>
          </div>
        </section>

        {/* Lazy Loading */}
        <section id="lazy-loading">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-purple-500" />
              Lazy Loading: Load Children On-Demand
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                For large hierarchies, loading all data upfront is slow and memory-intensive.
                Instead, load only top-level rows initially, then fetch children when users expand a
                parent. This pattern works especially well with{" "}
                <Link
                  href="/docs/pagination"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  pagination
                </Link>{" "}
                for even better performance.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Using onRowGroupExpand Callback
              </h3>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable, HeaderObject, OnRowGroupExpandProps } from "@simple-table/react";
import { useState } from "react";

export default function LazyTreeTable() {
  const [data, setData] = useState([
    // Initial data: only top-level rows, no children yet
    {
      id: "region-1",
      name: "North America",
      count: 150,
      // No 'stores' array yet - will be loaded on expand
    },
    {
      id: "region-2",
      name: "Europe",
      count: 200,
    },
  ]);

  const handleExpand = async ({
    row,
    depth,
    groupingKey,
    isExpanded,
    setLoading,
    setError,
    setEmpty,
    rowIndexPath,
  }: OnRowGroupExpandProps) => {
    // Only load when expanding (not collapsing)
    if (!isExpanded) return;

    // Set loading state in the UI
    setLoading(true);

    try {
      const response = await fetch(\`/api/tree-data?parent=\${row.id}&level=\${groupingKey}\`);
      const children = await response.json();

      setLoading(false);

      if (children.length === 0) {
        setEmpty(true, "No items found");
        return;
      }

      // Update data with children
      setData((prevData) => {
        const newData = [...prevData];
        // rowIndexPath provides exact location: [0] means first row
        newData[rowIndexPath[0]][groupingKey] = children;
        return newData;
      });
    } catch (error) {
      setLoading(false);
      setError("Failed to load data");
    }
  };

  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={data}
      
      rowGrouping={["stores", "products"]}
      onRowGroupExpand={handleExpand}
      loadingStateRenderer="Loading..."
      errorStateRenderer="Failed to load"
      emptyStateRenderer="No data available"
    />
  );
}`}
              />

              <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-400 dark:border-purple-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Benefits of Lazy Loading
                </h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                  <li>
                    <strong>Faster Initial Load:</strong> Only fetch top-level data, not entire tree
                  </li>
                  <li>
                    <strong>Reduced Memory:</strong> Children only loaded when needed
                  </li>
                  <li>
                    <strong>Better Performance:</strong> Scales to massive hierarchies (1000s of
                    nodes)
                  </li>
                  <li>
                    <strong>Seamless UX:</strong> Loading states keep users informed
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                rowIndexPath: Simplified Updates
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  rowIndexPath
                </code>{" "}
                array tells you exactly where to insert children:
              </p>

              <CodeBlock
                className="mb-6"
                code={`// Example: Expanding "Backend" department (3rd item in divisions array)
// rowIndexPath = [0, "divisions", 2]
// Meaning: rows[0].divisions[2] = Backend department

// Update is simple:
setData(prev => {
  const newData = [...prev];
  newData[rowIndexPath[0]][groupingKey] = children;
  return newData;
});

// For deeper nesting, traverse the path:
// rowIndexPath = [0, "divisions", 1, "departments", 2]
// Meaning: rows[0].divisions[1].departments[2]

let target = newData[rowIndexPath[0]];
for (let i = 1; i < rowIndexPath.length - 1; i += 2) {
  const key = rowIndexPath[i];
  const index = rowIndexPath[i + 1];
  target = target[key][index];
}
target[groupingKey] = children;`}
              />
            </div>
          </div>
        </section>

        {/* Common Use Cases */}
        <section id="use-cases">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faSitemap} className="text-blue-500" />
              Common Use Cases & Patterns
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="space-y-6">
                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faSitemap} className="text-blue-500" />
                    Organization Chart
                  </h3>
                  <CodeBlock
                    className="mb-4"
                    code={`// Structure: Company → Divisions → Departments → Teams
rowGrouping={["divisions", "departments", "teams"]}

// Example Row
{
  id: "company-1",
  name: "TechCorp",
  headcount: 500,
  divisions: [
    {
      id: "div-1",
      name: "Engineering",
      headcount: 300,
      departments: [...]
    }
  ]
}`}
                  />
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faChartLine} className="text-green-500" />
                    Project Management
                  </h3>
                  <CodeBlock
                    className="mb-4"
                    code={`// Structure: Projects → Milestones → Tasks → Subtasks
rowGrouping={["milestones", "tasks", "subtasks"]}

// Example Row
{
  id: "project-1",
  name: "Website Redesign",
  status: "In Progress",
  milestones: [
    {
      id: "milestone-1",
      name: "Design Phase",
      progress: "80%",
      tasks: [
        {
          id: "task-1",
          name: "Create Wireframes",
          assignee: "Sarah",
          subtasks: [...]
        }
      ]
    }
  ]
}`}
                  />
                </div>

                <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-6 bg-purple-50 dark:bg-purple-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faDatabase} className="text-purple-500" />
                    Product Catalog
                  </h3>
                  <CodeBlock
                    className="mb-4"
                    code={`// Structure: Categories → Subcategories → Products
rowGrouping={["subcategories", "products"]}

// Example Row
{
  id: "cat-1",
  name: "Electronics",
  itemCount: 1250,
  subcategories: [
    {
      id: "subcat-1",
      name: "Laptops",
      itemCount: 145,
      products: [
        {
          id: "prod-1",
          name: "MacBook Pro 16",
          price: "$2,499",
          stock: 42
        }
      ]
    }
  ]
}`}
                  />
                </div>

                <div className="border border-amber-200 dark:border-amber-700 rounded-lg p-6 bg-amber-50 dark:bg-amber-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
                    Financial Accounts
                  </h3>
                  <CodeBlock
                    className="mb-4"
                    code={`// Structure: Accounts → Sub-accounts → Transactions
rowGrouping={["subaccounts", "transactions"]}

// Example Row
{
  id: "account-1",
  name: "Operating Account",
  balance: "$125,000",
  subaccounts: [
    {
      id: "subaccount-1",
      name: "Payroll",
      balance: "$85,000",
      transactions: [
        {
          id: "trans-1",
          date: "2025-12-01",
          description: "Employee Salaries",
          amount: "-$75,000"
        }
      ]
    }
  ]
}`}
                  />
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
              Performance Optimization Tips
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    ✅ Use Lazy Loading for Deep Hierarchies
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Don't load all 10,000 nodes upfront. Use{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                      onRowGroupExpand
                    </code>{" "}
                    to fetch children only when parents are expanded. Initial load stays fast even
                    with massive trees.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    ✅ Start Collapsed for Large Trees
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Set{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                      expandAll={false}
                    </code>{" "}
                    when you have 100+ top-level rows or deep nesting (4+ levels). Let users expand
                    what they need rather than rendering thousands of rows at once.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    ✅ Virtualization Is Built-In
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Simple Table's virtualization works with tree data. Even if you expand to 5,000
                    visible rows, only ~30 DOM nodes are rendered at any time. Scrolling remains
                    smooth.
                  </p>
                </div>

                <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />❌
                    Avoid: Loading Entire Tree Upfront
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Don't fetch all levels of a 10,000-node tree on page load. Use lazy loading.
                    Your backend should support{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                      /api/tree?parent=123
                    </code>{" "}
                    to fetch children on demand.
                  </p>
                </div>

                <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />❌
                    Avoid: Complex Transforms in Render
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Don't flatten/transform tree data inside your component render. Do it once when
                    data loads, then pass the structured tree to Simple Table. Repeating transforms
                    on every render tanks performance.
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
              Tree Data Made Simple
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Tree data doesn't have to be complicated. With the right structure—nested arrays
                with clear property names—and the right API—
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  expandable
                </code>{" "}
                columns and{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  rowGrouping
                </code>{" "}
                configuration—hierarchical data becomes as easy to display as flat tables.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">Key takeaways:</p>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Structure data with nested arrays</strong> using clear property names
                    for each hierarchy level
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Mark one column as expandable</strong> to show expand/collapse controls
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Define hierarchy with rowGrouping array</strong> to tell the table which
                    properties contain children
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Use lazy loading for large trees</strong> via{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      onRowGroupExpand
                    </code>{" "}
                    to load children on demand
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Start collapsed for deep hierarchies</strong> with{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      expandAll={false}
                    </code>
                  </span>
                </li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300">
                Whether you're building org charts, project trackers, file explorers, or financial
                reports, tree data is a fundamental pattern. With Simple Table's row grouping, you
                get expandable hierarchies out of the box—no custom logic, no complex state
                management, just structured data and clear configuration.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Ready to display hierarchical data?"
        description="Simple Table makes tree data intuitive with built-in row grouping, lazy loading, and expand/collapse controls. No custom state management required."
        primaryButton={{
          text: "View Row Grouping Docs",
          href: "/docs/row-grouping",
        }}
        secondaryButton={{
          text: "Try Live Demo",
          href: "/docs/row-grouping",
        }}
      />
    </BlogLayout>
  );
}
