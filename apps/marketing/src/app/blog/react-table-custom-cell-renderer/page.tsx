import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaintbrush,
  faCheckCircle,
  faLightbulb,
  faCode,
  faRocket,
  faBolt,
  faTableCells,
  faGaugeHigh,
  faThumbsUp,
  faThumbsDown,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import CodeBlock from "@/components/CodeBlock";
import CellRendererDemoWrapper from "@/components/blog/CellRendererDemoWrapper";
import Link from "next/link";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.reactCustomCellRenderer.title,
  description: SEO_STRINGS.blogPosts.reactCustomCellRenderer.description,
  keywords: SEO_STRINGS.blogPosts.reactCustomCellRenderer.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.reactCustomCellRenderer.title,
    description: SEO_STRINGS.blogPosts.reactCustomCellRenderer.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.reactCustomCellRenderer.title,
    description: SEO_STRINGS.blogPosts.reactCustomCellRenderer.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/react-table-custom-cell-renderer",
  },
};

export default function ReactCustomCellRendererPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Custom Cell Renderers in React Tables
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faPaintbrush} />
            Cell Renderers
          </span>
          <span className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            Customization
          </span>
          <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            Tutorial
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Plain text in a data grid only goes so far. Learn how to render status badges, progress
          bars, avatars, and action buttons directly inside React table cells with Simple Table's{" "}
          <code>cellRenderer</code> API—plus when to reach for <code>valueFormatter</code> instead.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8 mb-8">
        {/* Introduction */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                A column of raw strings like <code>active</code>, <code>0.82</code>, or{" "}
                <code>https://…/avatar.png</code> tells users almost nothing at a glance. A green
                "Active" pill, an 82% progress bar, and a round avatar tell the whole story
                instantly. That transformation is what a cell renderer does: it takes the raw value
                and returns a React component to display instead.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>
                  Cell renderers are where a data grid stops looking like a spreadsheet and starts
                  looking like your product.
                </strong>{" "}
                In Simple Table, every column can define its own <code>cellRenderer</code>, giving
                you complete control over what each cell renders—badges, buttons, charts, links,
                anything React can produce.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                This guide covers the <code>cellRenderer</code> API and its parameters, when to use{" "}
                <Link
                  href="/docs/value-formatter"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  valueFormatter
                </Link>{" "}
                instead, copy-paste recipes for the most common patterns, and the performance rules
                that keep large grids fast.
              </p>
            </div>
          </div>
        </section>

        {/* cellRenderer vs valueFormatter */}
        <section id="renderer-vs-formatter">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              cellRenderer vs valueFormatter: Which One?
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table gives you two ways to change how a cell looks. Picking the right one
                matters for performance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faGaugeHigh} className="text-green-500" />
                    valueFormatter
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Returns a <strong>formatted string</strong>. Best for text transforms.
                  </p>
                  <div className="mb-2">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faThumbsUp} />
                      Use for
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Currency, dates, percentages</li>
                      <li>• Number/string formatting</li>
                      <li>• Anything that stays plain text</li>
                    </ul>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                    More performant—prefer it whenever the output is just text.
                  </p>
                </div>

                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faPaintbrush} className="text-blue-500" />
                    cellRenderer
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Returns a <strong>React node</strong>. Best for visual / interactive cells.
                  </p>
                  <div className="mb-2">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faThumbsUp} />
                      Use for
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Badges, pills, progress bars</li>
                      <li>• Avatars, icons, images, links</li>
                      <li>• Buttons and interactive controls</li>
                    </ul>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                    Runs frequently—keep it lightweight (see performance section).
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Rule of thumb:</strong> if the output is text, use{" "}
                  <code>valueFormatter</code>. If it needs markup, color, or interactivity, use{" "}
                  <code>cellRenderer</code>. You can even combine them—more on that below.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Basic usage */}
        <section id="basic-usage">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-blue-500" />
              Basic Usage: A Status Badge
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Add a <code>cellRenderer</code> function to any column in <code>defaultHeaders</code>
                . It receives the cell's data and returns a React node. In React, columns are typed{" "}
                <code>ReactHeaderObject</code>.
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, CellRendererProps } from "@simple-table/react";
import "@simple-table/react/styles.css";

const headers: ReactHeaderObject[] = [
  { accessor: "name", label: "Name", width: 200, type: "string" },
  {
    accessor: "status",
    label: "Status",
    width: 140,
    type: "string",
    cellRenderer: ({ value }: CellRendererProps) => {
      const isActive = value === "active";
      return (
        <span
          style={{
            padding: "2px 10px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: isActive ? "#DCFCE7" : "#FEE2E2",
            color: isActive ? "#166534" : "#991B1B",
          }}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
];

export default function UsersTable({ rows }) {
  return <SimpleTable defaultHeaders={headers} rows={rows} height="500px" />;
}`}
              />

              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                The CellRendererProps parameters
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Your renderer receives a single object with everything you need:
              </p>

              <div className="space-y-3 mb-2">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <code>value</code> — the raw cell value (same as <code>row[accessor]</code>).
                  </p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <code>row</code> — the full row object, so a renderer can depend on multiple
                    columns.
                  </p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <code>formattedValue</code> — the output of <code>valueFormatter</code> if the
                    column defines one, so you can wrap formatted text in custom markup.
                  </p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <code>accessor</code>, <code>colIndex</code>, <code>rowIndex</code>,{" "}
                    <code>theme</code>, and <code>rowPath</code> (the path through nested data, e.g.{" "}
                    <code>[0, "teams", 1]</code>).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live demo */}
        <section id="live-demo">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faTableCells} className="text-cyan-500" />
              See It In Action
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                The table below uses cell renderers for team-member avatars and progress bars—proof
                that "cells" can be full React components.
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <CellRendererDemoWrapper height="400px" />
            </div>
          </div>
        </section>

        {/* Recipes */}
        <section id="recipes">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="text-purple-500" />
              Copy-Paste Recipes
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Progress bar
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Turn a 0–1 (or 0–100) number into a visual bar:
              </p>
              <CodeBlock
                className="mb-6"
                code={`{
  accessor: "completion",
  label: "Progress",
  width: 160,
  type: "number",
  cellRenderer: ({ value }: CellRendererProps) => {
    const pct = Math.round(Number(value) * 100);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 8, borderRadius: 9999, background: "#E5E7EB" }}>
          <div
            style={{
              width: \`\${pct}%\`,
              height: 8,
              borderRadius: 9999,
              background: pct >= 80 ? "#16A34A" : pct >= 40 ? "#F59E0B" : "#EF4444",
            }}
          />
        </div>
        <span style={{ fontSize: 12, color: "#6B7280" }}>{pct}%</span>
      </div>
    );
  },
}`}
              />

              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Avatar with name
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Use <code>row</code> to combine multiple fields into one cell:
              </p>
              <CodeBlock
                className="mb-6"
                code={`{
  accessor: "name",
  label: "User",
  width: 220,
  type: "string",
  cellRenderer: ({ row }: CellRendererProps) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <img
        src={row.avatarUrl as string}
        alt=""
        style={{ width: 28, height: 28, borderRadius: "50%" }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontWeight: 600 }}>{row.name as string}</span>
        <span style={{ fontSize: 12, color: "#6B7280" }}>{row.email as string}</span>
      </div>
    </div>
  ),
}`}
              />

              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Action buttons
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Render interactive controls right in the grid:
              </p>
              <CodeBlock
                className="mb-6"
                code={`{
  accessor: "id",
  label: "Actions",
  width: 160,
  type: "string",
  cellRenderer: ({ row }: CellRendererProps) => (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={() => onEdit(row.id)} className="st-btn st-btn-secondary">
        Edit
      </button>
      <button onClick={() => onDelete(row.id)} className="st-btn st-btn-danger">
        Delete
      </button>
    </div>
  ),
}`}
              />

              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Conditional formatting from multiple columns
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Because <code>row</code> is the whole record, a cell can react to other fields—for
                example, flag a balance as overdue:
              </p>
              <CodeBlock
                className="mb-2"
                code={`{
  accessor: "balance",
  label: "Balance",
  width: 140,
  type: "number",
  align: "right",
  cellRenderer: ({ value, row }: CellRendererProps) => {
    const overdue = row.status === "overdue";
    return (
      <span style={{ color: overdue ? "#DC2626" : "#111827", fontWeight: overdue ? 700 : 400 }}>
        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
          Number(value)
        )}
      </span>
    );
  },
}`}
              />
            </div>
          </div>
        </section>

        {/* Combining with valueFormatter */}
        <section id="combine-formatter">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
              Wrapping Formatted Text with formattedValue
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You don't have to choose between the two. Define a <code>valueFormatter</code> for
                the text transform, then read <code>formattedValue</code> in your{" "}
                <code>cellRenderer</code> to wrap that formatted string in markup—no need to
                re-implement the formatting logic:
              </p>

              <CodeBlock
                className="mb-6"
                code={`{
  accessor: "revenue",
  label: "Revenue",
  width: 140,
  type: "number",
  align: "right",
  valueFormatter: ({ value }) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
      Number(value)
    ),
  cellRenderer: ({ value, formattedValue }: CellRendererProps) => (
    <span style={{ color: Number(value) > 0 ? "#16A34A" : "#DC2626" }}>
      {formattedValue}
    </span>
  ),
}`}
              />

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Bonus:</strong> the same idea applies to headers. Use{" "}
                  <code>headerRenderer</code> on a column to render custom header content (icons,
                  tooltips, multi-line labels) the same way <code>cellRenderer</code> handles cells.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Performance */}
        <section id="performance">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faGaugeHigh} className="text-green-500" />
              Performance Best Practices
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Cell renderers run often—on scroll, sort, and re-render—so a slow renderer multiplied
                across visible rows adds up. Keep them cheap:
              </p>
              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 shrink-0" />
                  <span>
                    <strong>Prefer <code>valueFormatter</code> for plain text</strong>—it's lighter
                    than a React node.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 shrink-0" />
                  <span>
                    <strong>Avoid expensive work inside the renderer</strong> (no heavy
                    computation, network calls, or large object creation per cell).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 shrink-0" />
                  <span>
                    <strong>Memoize complex components</strong> and hoist static styles/objects out
                    of the render path.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 shrink-0" />
                  <span>
                    <strong>Pair with virtualization</strong>—only visible rows render, so a tight
                    renderer scales to{" "}
                    <Link
                      href="/blog/handling-one-million-rows"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      a million rows
                    </Link>
                    .
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              Make Your Cells Tell the Story
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Cell renderers turn a generic grid into an interface that matches your product.
                Reach for <code>valueFormatter</code> when you only need formatted text, and{" "}
                <code>cellRenderer</code> when a cell needs color, layout, or interactivity—then
                keep both lean so the grid stays fast.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Want to see how far custom rendering can go? Check out how we{" "}
                <Link
                  href="/blog/replicating-gojiberry-ui-simple-table"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  replicated a full CRM UI
                </Link>{" "}
                with Simple Table, or learn the broader{" "}
                <Link
                  href="/blog/customizing-react-table-look-simple-table-themes"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  theming system
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Ready to build rich, interactive table cells?"
        description="Simple Table's cellRenderer gives you full React control over every cell—badges, charts, buttons, and more—for free. Start customizing your data grid in minutes."
        primaryButton={{
          text: "View Cell Renderer Docs",
          href: "/docs/cell-renderer",
        }}
        secondaryButton={{
          text: "Learn valueFormatter",
          href: "/docs/value-formatter",
        }}
      />
    </BlogLayout>
  );
}
