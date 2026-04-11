import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faCheckCircle,
  faLightbulb,
  faCode,
  faExclamationTriangle,
  faRocket,
  faBolt,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import CodeBlock from "@/components/CodeBlock";
import Link from "next/link";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.autoExpandColumnsReactTables.title,
  description: SEO_STRINGS.blogPosts.autoExpandColumnsReactTables.description,
  keywords: SEO_STRINGS.blogPosts.autoExpandColumnsReactTables.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.autoExpandColumnsReactTables.title,
    description: SEO_STRINGS.blogPosts.autoExpandColumnsReactTables.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.autoExpandColumnsReactTables.title,
    description: SEO_STRINGS.blogPosts.autoExpandColumnsReactTables.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/auto-expand-columns-react-tables",
  },
};

export default function AutoExpandColumnsReactTablesPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Auto-Expand Columns in React Tables: The Hidden Complexity Behind Seamless UX
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faExpand} />
            Auto-Expand
          </span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            Tutorial
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCogs} />
            Advanced
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Making table columns automatically fill the screen seems simple—until users resize them.
          Discover the sophisticated algorithms behind auto-expanding columns and why this "simple"
          feature is one of the hardest problems in data grid engineering.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8 mb-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You're building a dashboard. The table has 5 columns, and you want them to fill the
                entire container width—no horizontal scrolling, no wasted space. Just columns that
                expand proportionally to use 100% of the available width. Sounds simple, right?
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Then a user resizes one column. Now what? If they make the "Name" column wider,
                which other columns should shrink? By how much? What if those columns hit their
                minimum width? What if you have{" "}
                <Link
                  href="/blog/react-grid-column-pinning-tutorial"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  pinned columns
                </Link>{" "}
                on the left and right? What if the user is on a phone where the sum of all minimum
                widths exceeds the screen size?
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Welcome to <strong>autoExpandColumns</strong>—one of the most deceptively complex
                features in modern data grids. What looks like "just scale everything
                proportionally" requires sophisticated algorithms handling multiple coordinate
                systems, proportional distribution, hierarchical structures, and countless edge
                cases—all to deliver an intuitive Excel-like experience where everything just works.
              </p>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section id="the-problem">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500" />
              Why Auto-Expand Columns Is Hard
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The challenge isn't the initial scaling—that's straightforward math. The real
                complexity emerges when users interact with the table:
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Challenge #1: Which Columns Compensate?
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                When a user makes one column wider, the total width must stay constant (to fill the
                container). Other columns need to shrink. But which ones?
              </p>

              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  The Directional Logic Problem
                </h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                  <li>
                    <strong>Leftmost column:</strong> Growing it should shrink columns to the{" "}
                    <em>right</em>
                  </li>
                  <li>
                    <strong>Rightmost column:</strong> Growing it should shrink columns to the{" "}
                    <em>left</em>
                  </li>
                  <li>
                    <strong>Middle columns:</strong> Which direction? Left or right?
                  </li>
                  <li>
                    <strong>Right-pinned columns:</strong> They grow <em>leftward</em> (opposite
                    mouse direction!)
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Challenge #2: Proportional Compensation
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You can't just shrink one column. That feels arbitrary and breaks user expectations.
                Instead, you need to distribute the space change <strong>proportionally</strong>{" "}
                across multiple columns based on their current widths.
              </p>

              <CodeBlock
                className="mb-6"
                code={`// Example: User grows "Name" column by 100px
// Container width: 1000px (must stay constant)
// Other columns: "Email" (300px), "Role" (200px), "Status" (100px)

// Naive approach: Shrink all equally by 33.3px each
// ❌ Problem: Status (100px) shrinks by 33%, but Email (300px) only shrinks by 11%
// This feels wrong—larger columns should absorb more change

// Proportional approach: Shrink based on current width
// Total width of other columns: 600px
// Email shrinks: 100px * (300/600) = 50px → new width: 250px
// Role shrinks: 100px * (200/600) = 33.3px → new width: 166.7px
// Status shrinks: 100px * (100/600) = 16.7px → new width: 83.3px
// ✅ Feels natural—larger columns absorb more change`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Challenge #3: Minimum Width Constraints
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Columns have minimum widths (typically 30px) to prevent them from becoming unusable.
                When a column hits its minimum during proportional shrinking, you need to:
              </p>

              <ol className="space-y-2 mb-6 text-gray-700 dark:text-gray-300 list-decimal list-inside">
                <li>Stop shrinking that column</li>
                <li>Redistribute its "share" of the shrinkage to other columns</li>
                <li>
                  Repeat iteratively until all columns are either at minimum or properly sized
                </li>
              </ol>

              <CodeBlock
                className="mb-6"
                code={`// Iterative algorithm for minimum width constraints
function distributeWidthChange(columns, totalChange) {
  let remainingChange = totalChange;
  let activeColumns = [...columns];
  
  while (remainingChange > 0 && activeColumns.length > 0) {
    // Calculate proportional share for each active column
    const totalActiveWidth = activeColumns.reduce((sum, col) => sum + col.width, 0);
    
    for (const column of activeColumns) {
      const proportionalChange = remainingChange * (column.width / totalActiveWidth);
      const newWidth = column.width - proportionalChange;
      
      if (newWidth < column.minWidth) {
        // Column hit minimum—lock it and redistribute its share
        const actualChange = column.width - column.minWidth;
        column.width = column.minWidth;
        remainingChange -= actualChange;
        activeColumns = activeColumns.filter(c => c !== column);
      } else {
        column.width = newWidth;
        remainingChange -= proportionalChange;
      }
    }
  }
}`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Challenge #4: Pinned Columns Create Isolated Sections
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                When you have{" "}
                <Link
                  href="/blog/react-grid-column-pinning-tutorial"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  pinned columns
                </Link>
                , the table splits into three independent sections: left-pinned, main (scrollable),
                and right-pinned. Resizing a column only affects other columns{" "}
                <strong>in the same section</strong>.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Section Isolation
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Each section maintains its own width constraints independently:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                  <li>
                    <strong>Left-pinned section:</strong> Fixed total width, columns compensate
                    within this section
                  </li>
                  <li>
                    <strong>Main section:</strong> Flexible width, fills remaining space
                  </li>
                  <li>
                    <strong>Right-pinned section:</strong> Fixed total width, columns compensate
                    within this section
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Challenge #5: Nested Headers
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                When you have{" "}
                <Link
                  href="/blog/nested-headers-react-tables"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  nested headers
                </Link>{" "}
                (parent headers spanning multiple child columns), resizing a parent should resize
                all its children proportionally. The system must:
              </p>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300 list-disc list-inside">
                <li>Always work with leaf headers (actual columns) as the source of truth</li>
                <li>Calculate scale factors to resize all children proportionally</li>
                <li>Determine compensation direction based on the children's position range</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Challenge #6: Mobile & Responsive Constraints
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                On small screens, the sum of column minimum widths might exceed the container width.
                What happens when it's mathematically impossible to fit all columns?
              </p>

              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  The Mobile Dilemma
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  On a 375px phone screen with 5 columns at 80px minimum each:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                  <li>Required width: 5 × 80px = 400px</li>
                  <li>Available width: 375px</li>
                  <li>Deficit: 25px</li>
                </ul>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  Solution: Pinned sections are limited to 30% (mobile), 40% (tablet), or 80%
                  (desktop) of container width, preventing them from dominating small screens.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCogs} className="text-blue-500" />
              How Auto-Expand Columns Works Internally
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Let's break down the sophisticated algorithm that makes auto-expanding columns feel
                seamless:
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Step 1: Initial Scaling on Mount
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                When the table first renders, it calculates a scale factor to fill the container:
              </p>

              <CodeBlock
                className="mb-6"
                code={`// Initial scaling algorithm
function scaleColumnsToFit(columns, containerWidth) {
  // Sum all column widths
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
  
  // Calculate scale factor
  const scaleFactor = containerWidth / totalWidth;
  
  // Apply scale to all columns proportionally
  return columns.map(col => ({
    ...col,
    width: col.width * scaleFactor
  }));
}

// Example:
// Container: 1000px
// Columns: [200px, 300px, 150px, 250px] = 900px total
// Scale factor: 1000 / 900 = 1.111
// New widths: [222px, 333px, 167px, 278px] = 1000px ✓`}
              />

              <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-400 dark:border-purple-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Important: minWidth NOT Enforced During Initial Scaling
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  During initial scaling, columns can be scaled below their{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">minWidth</code>. This
                  ensures the table always fills the container, even on small screens. The minWidth
                  is only enforced during <em>user resizing</em>.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Step 2: Capturing Initial Widths on Resize Start
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                When a user starts resizing, the system captures all current column widths. This
                prevents cascading rounding errors during the resize operation:
              </p>

              <CodeBlock
                className="mb-6"
                code={`// Capture widths at drag start
function onResizeStart(columnId) {
  // Store initial widths for all columns
  const initialWidths = columns.map(col => ({
    id: col.id,
    width: col.currentWidth // Current rendered width
  }));
  
  // Use these throughout the resize operation
  // This prevents: 100 → 99.7 → 99.4 → 99.1 (rounding drift)
  // Instead: Always calculate from original 100
}`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Step 3: Proportional Compensation Algorithm
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                As the user drags, the system calculates which columns should compensate and by how
                much:
              </p>

              <CodeBlock
                className="mb-6"
                code={`function compensateColumns(resizedColumn, widthDelta, allColumns) {
  // 1. Determine direction (left or right)
  const direction = getCompensationDirection(resizedColumn);
  
  // 2. Get columns that should compensate
  const columnsToCompensate = getColumnsInDirection(resizedColumn, direction);
  
  // 3. Calculate total width of compensating columns
  const totalCompensateWidth = columnsToCompensate.reduce(
    (sum, col) => sum + col.initialWidth, 
    0
  );
  
  // 4. Distribute change proportionally
  const newWidths = {};
  let remainingDelta = widthDelta;
  
  for (const column of columnsToCompensate) {
    // Proportional share based on initial width
    const proportion = column.initialWidth / totalCompensateWidth;
    const change = widthDelta * proportion;
    const newWidth = column.initialWidth - change; // Subtract (compensate)
    
    // Check minimum width constraint
    if (newWidth < column.minWidth) {
      newWidths[column.id] = column.minWidth;
      remainingDelta -= (column.initialWidth - column.minWidth);
    } else {
      newWidths[column.id] = newWidth;
      remainingDelta -= change;
    }
  }
  
  // 5. If columns hit minimum, redistribute remaining delta
  if (remainingDelta > 0) {
    redistributeRemaining(newWidths, remainingDelta, columnsToCompensate);
  }
  
  return newWidths;
}`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Step 4: Smart Directional Logic
              </h3>

              <CodeBlock
                className="mb-6"
                code={`function getCompensationDirection(column) {
  // Leftmost column in section → compensate right
  if (column.isLeftmost) {
    return 'right';
  }
  
  // Rightmost column in section → compensate left
  if (column.isRightmost) {
    return 'left';
  }
  
  // Right-pinned columns → compensate left (they grow leftward)
  if (column.section === 'right-pinned') {
    return 'left';
  }
  
  // Middle columns in main/left-pinned → compensate right
  return 'right';
}`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Step 5: Handling Right-Pinned Columns
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Right-pinned columns are tricky because they grow <em>leftward</em> (opposite to the
                mouse movement). The system inverts the mouse delta for these columns:
              </p>

              <CodeBlock
                className="mb-6"
                code={`function calculateWidthDelta(mouseDelta, column) {
  if (column.section === 'right-pinned') {
    // Right-pinned: growing right (positive mouse delta) 
    // means column should shrink (negative width delta)
    return -mouseDelta;
  }
  
  // Normal columns: positive mouse delta = grow
  return mouseDelta;
}`}
              />
            </div>
          </div>
        </section>

        {/* Implementation Section */}
        <section id="implementation">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-green-500" />
              How to Use Auto-Expand Columns in Simple Table
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Despite the complexity under the hood, using auto-expand columns is incredibly
                simple. Just add one prop:
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Basic Example
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
    type: "number",
  },
  {
    accessor: "name",
    label: "Name",
    width: 200,
    type: "string",
  },
  {
    accessor: "email",
    label: "Email",
    width: 250,
    type: "string",
  },
  {
    accessor: "role",
    label: "Role",
    width: 150,
    type: "string",
  },
  {
    accessor: "status",
    label: "Status",
    width: 120,
    type: "string",
  },
];

export default function AutoExpandTable({ data }) {
  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={data}
      
      autoExpandColumns={true} // That's it!
      height="500px"
    />
  );
}`}
              />

              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  What Happens
                </h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                  <li>
                    Columns scale proportionally to fill the container width (no horizontal scroll)
                  </li>
                  <li>
                    The <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">width</code>{" "}
                    values are used as the <em>base</em> for proportional distribution
                  </li>
                  <li>When users resize columns, other columns compensate automatically</li>
                  <li>All the complex algorithms run invisibly in the background</li>
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  📱 Mobile Recommendation
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  It's recommended to not use auto-expand columns on mobile devices. On small
                  screens, horizontal scrolling often provides a better user experience than
                  cramped, auto-scaled columns.
                </p>
                <CodeBlock
                  className="mb-0"
                  code={`const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };
  checkMobile();
  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);

<SimpleTable
  autoExpandColumns={!isMobile}
  defaultHeaders={headers}
  rows={data}
  
/>`}
                />
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                With Pinned Columns
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Auto-expand works seamlessly with{" "}
                <Link
                  href="/blog/react-grid-column-pinning-tutorial"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  pinned columns
                </Link>
                . Each section (left-pinned, main, right-pinned) maintains its own proportional
                scaling:
              </p>

              <CodeBlock
                className="mb-6"
                code={`const headers: HeaderObject[] = [
  {
    accessor: "id",
    label: "ID",
    width: 60,
    pinned: "left", // Left-pinned section
  },
  {
    accessor: "name",
    label: "Name",
    width: 180,
    pinned: "left", // Left-pinned section
  },
  {
    accessor: "email",
    label: "Email",
    width: 250, // Main section
  },
  {
    accessor: "department",
    label: "Department",
    width: 180, // Main section
  },
  {
    accessor: "salary",
    label: "Salary",
    width: 140, // Main section
  },
  {
    accessor: "actions",
    label: "Actions",
    width: 120,
    pinned: "right", // Right-pinned section
  },
];

<SimpleTable
  defaultHeaders={headers}
  rows={data}
  
  autoExpandColumns={true}
  height="500px"
/>`}
              />

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Section Behavior
                </h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
                  <li>
                    <strong>Left-pinned:</strong> ID + Name scale to fill their section
                  </li>
                  <li>
                    <strong>Main:</strong> Email + Department + Salary scale to fill remaining space
                  </li>
                  <li>
                    <strong>Right-pinned:</strong> Actions column maintains its width
                  </li>
                  <li>
                    Resizing a column only affects other columns <em>in the same section</em>
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                With Column Resizing
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Enable column resizing to let users adjust widths. Auto-expand ensures the table
                always fills the container:
              </p>

              <CodeBlock
                className="mb-6"
                code={`<SimpleTable
  defaultHeaders={headers}
  rows={data}
  
  autoExpandColumns={true}
  isColumnResizable={true} // Enable resizing
  height="500px"
/>

// Users can now:
// 1. Drag column borders to resize
// 2. Other columns automatically compensate
// 3. Table always fills 100% of container width
// 4. Minimum widths are respected (default 30px)`}
              />
            </div>
          </div>
        </section>

        {/* When to Use Section */}
        <section id="when-to-use">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              When to Use Auto-Expand Columns
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Perfect Use Cases
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      • <strong>Dashboards:</strong> Tables that should fill a card or panel
                      completely
                    </li>
                    <li>
                      • <strong>Reports:</strong> Financial or analytics tables where horizontal
                      scrolling is undesirable
                    </li>
                    <li>
                      • <strong>Admin panels:</strong> Full-width tables with 4-8 columns that fit
                      comfortably
                    </li>
                    <li>
                      • <strong>Responsive layouts:</strong> Tables that need to adapt to any
                      container size
                    </li>
                    <li>
                      • <strong>Fixed-height containers:</strong> When the table is the primary
                      content
                    </li>
                  </ul>
                </div>

                <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    When to Avoid
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      • <strong>Many columns (15+):</strong> Horizontal scrolling is more natural
                      than tiny columns
                    </li>
                    <li>
                      • <strong>Variable content width:</strong> When some columns need specific
                      widths (e.g., timestamps)
                    </li>
                    <li>
                      • <strong>Dense data:</strong> Spreadsheet-like tables where users expect to
                      scroll horizontally
                    </li>
                    <li>
                      • <strong>Mobile devices:</strong> On small screens (&lt; 768px), horizontal
                      scrolling provides better UX than cramped columns. Disable autoExpandColumns
                      on mobile.
                    </li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Auto-Expand vs. Fixed Width vs. "1fr"
              </h3>

              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Approach
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Behavior
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Best For
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                          autoExpandColumns
                        </code>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        All columns scale proportionally to fill container. User resizing adjusts
                        other columns.
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        Dashboards, reports, full-width layouts
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Fixed Width
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        Each column has exact pixel width. Horizontal scroll if total exceeds
                        container.
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        Dense data, many columns, precise control
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                          width: "1fr"
                        </code>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        Specific columns share available space equally. Mix with fixed-width
                        columns.
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm">
                        Hybrid layouts: some fixed, some flexible
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Mobile & Responsive Considerations
              </h3>

              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  📱 Recommended: Disable on Mobile
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  On mobile devices, it's recommended to set{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                    autoExpandColumns={false}
                  </code>
                  . Small screens benefit more from horizontal scrolling than cramped, auto-scaled
                  columns. This gives users better control and readability.
                </p>
                <CodeBlock
                  className="mb-0"
                  code={`const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };
  checkMobile();
  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);

<SimpleTable
  autoExpandColumns={!isMobile} // Disable on mobile
  defaultHeaders={headers}
  rows={data}
  
/>`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Performance Section */}
        <section id="performance">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-purple-500" />
              Performance Considerations
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Auto-expand columns require real-time calculations during user interactions. Here's
                how Simple Table keeps it performant:
              </p>

              <div className="space-y-4 mb-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    ⚡ Efficient Calculations
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Width calculations are O(n) where n = number of columns in the section. Even
                    with 50 columns, this is negligible. Calculations happen only during resize, not
                    on every render.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🎯 Paused During Active Resize
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    When a user is actively resizing, the initial scaling algorithm is paused to
                    avoid conflicts. It resumes after the resize completes.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🔢 No Cascading Rounding Errors
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    By capturing initial widths at drag start and always calculating from those
                    values, the system avoids cumulative rounding errors that would cause columns to
                    drift over time.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    📱 Responsive Constraints
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Pinned sections are automatically limited based on screen size: 30% (mobile),
                    40% (tablet), 80% (desktop). This prevents performance issues from excessive
                    pinning on small screens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion Section */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              The Beauty of Invisible Complexity
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Auto-expand columns is a perfect example of why building a production-ready data
                grid is so challenging. What seems like "just scale everything proportionally"
                actually requires:
              </p>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Sophisticated algorithms</strong> for proportional distribution with
                    minimum width constraints
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Section isolation</strong> for pinned columns with independent width
                    management
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Smart directional logic</strong> that feels natural for every column
                    position
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Hierarchical handling</strong> for nested headers with recursive scaling
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Responsive constraints</strong> that prevent layout breakage on mobile
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <span>
                    <strong>Performance optimization</strong> to keep interactions smooth
                  </span>
                </li>
              </ul>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The best UX is invisible. Users don't think about auto-expand columns—they just
                expect tables to fill the screen and resize naturally. With Simple Table, you add
                one prop (
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  autoExpandColumns={true}
                </code>
                ) and all this complexity runs invisibly in the background.
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                That's the power of a well-engineered data grid: sophisticated algorithms that
                deliver an Excel-like experience where everything just works.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Ready for tables that just work?"
        description="Simple Table's auto-expand columns deliver sophisticated proportional scaling with one prop. No complex configuration, no edge cases to handle—just tables that fill the screen beautifully."
        primaryButton={{
          text: "View Column Width Docs",
          href: "/docs/column-width",
        }}
        secondaryButton={{
          text: "Try Live Demo",
          href: "/docs/column-width",
        }}
      />
    </BlogLayout>
  );
}
