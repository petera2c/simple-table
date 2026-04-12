"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageWrapper from "@/components/PageWrapper";
import {
  faPalette,
  faCode,
  faSwatchbook,
  faWandMagicSparkles,
  faCheckCircle,
  faLightbulb,
  faRocket,
  faPaintBrush,
  faTable,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { customizingReactTableLookPost } from "@/constants/blogPosts";
import CallToActionCard from "@/components/CallToActionCard";
import { Button } from "antd";
import CustomThemeDemo from "@/components/demos/custom-theme/CustomThemeDemo";
import ThemesDemo from "@/components/demos/ThemesDemo";
import HeaderRendererDemo from "@/components/demos/HeaderRendererDemo";
import CellRendererDemo from "@/components/demos/CellRendererDemo";
import CodeBlock from "../CodeBlock";

export default function CustomizingReactTableThemesContent() {
  const [selectedTheme, setSelectedTheme] = useState<
    "light" | "dark" | "sky" | "violet" | "neutral"
  >("light");
  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          {customizingReactTableLookPost.title}
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faPalette} />
            Themes
          </span>
          <span className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faSwatchbook} />
            CSS Variables
          </span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            Custom Renderers
          </span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faRocket} />
            Easy Styling
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          {customizingReactTableLookPost.description}
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500" />
              The Styling Challenge in React Tables
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Let's be honest—customizing the look of React data tables has traditionally been a
                nightmare. You've probably experienced the frustration of trying to override deeply
                nested CSS, fighting with `!important` declarations, or dealing with component
                libraries that make simple styling changes feel impossible.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table changes this completely. Built from the ground up with customization in
                mind, it provides multiple powerful ways to make your tables look exactly how you
                want them to look, without the usual headaches.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    What Makes Simple Table Different
                  </span>
                </div>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                  <li>
                    • <strong>CSS Variables:</strong> Complete control with modern CSS custom
                    properties
                  </li>
                  <li>
                    • <strong>Unique Class Names:</strong> Every HTML element has a specific,
                    targetable class
                  </li>
                  <li>
                    • <strong>Built-in Themes:</strong> Professional themes ready to use out of the
                    box
                  </li>
                  <li>
                    • <strong>Custom Renderers:</strong> Complete control over how cells and headers
                    look
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Built-in Themes Section */}
        <section id="built-in-themes">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faPalette} className="text-purple-500" />
              Built-in Themes: Professional Looks in Seconds
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Simple Table comes with 5 carefully crafted themes that you can apply instantly. Each
              theme is designed to work well in different contexts and design systems. Click on any
              theme below to see it in action:
            </p>

            <div className="mb-6">
              <ThemesDemo height="400px" theme={selectedTheme} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div
                className={`rounded-lg p-4 border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTheme === "light"
                    ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 ring-2 ring-blue-400"
                    : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setSelectedTheme("light")}
              >
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Light Theme</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Clean, minimal design perfect for most applications. Great contrast and
                  readability.
                </p>
              </div>
              <div
                className={`rounded-lg p-4 border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTheme === "dark"
                    ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 ring-2 ring-blue-400"
                    : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setSelectedTheme("dark")}
              >
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Dark Theme</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Modern dark interface, easy on the eyes for extended use or night mode
                  applications.
                </p>
              </div>
              <div
                className={`rounded-lg p-4 border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTheme === "sky"
                    ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 ring-2 ring-blue-400"
                    : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setSelectedTheme("sky")}
              >
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Sky Theme</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Crisp blue accents perfect for business applications and dashboards.
                </p>
              </div>
              <div
                className={`rounded-lg p-4 border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTheme === "violet"
                    ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 ring-2 ring-blue-400"
                    : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setSelectedTheme("violet")}
              >
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Violet Theme
                </h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Vibrant purple gradients for creative applications and modern interfaces.
                </p>
              </div>
              <div
                className={`rounded-lg p-4 border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTheme === "neutral"
                    ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 ring-2 ring-blue-400"
                    : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setSelectedTheme("neutral")}
              >
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Neutral Theme
                </h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Subtle, professional styling that blends seamlessly with any design system.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CSS Variables Section */}
        <section id="css-variables">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faSwatchbook} className="text-blue-500" />
              CSS Variables: Total Customization Control
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Simple Table uses CSS custom properties (variables) for all styling, giving you
              unprecedented control over appearance. You can override any aspect of the table's look
              by simply defining new values for these variables.
            </p>

            <div className="mb-6">
              <CustomThemeDemo height="400px" />
            </div>

            <h4 className="mb-3 text-gray-900 dark:text-gray-100 text-lg font-medium">
              Create Your Own Custom Theme
            </h4>

            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Here's how easy it is to create a completely custom theme using CSS variables:
            </p>

            <CodeBlock
              className="mb-4"
              code={`/* Define your custom theme */
.theme-custom {
/* Primary Colors */
--st-primary-color: #8b5cf6;
--st-secondary-color: #a78bfa;
--st-accent-color: #c4b5fd;

/* Background Colors */
--st-background-color: #faf5ff;
--st-header-background-color: linear-gradient(135deg, #8b5cf6, #a855f7);
--st-row-background-color: #ffffff;
--st-odd-row-background-color: #f8fafc;
--st-hover-row-background-color: #ede9fe;

/* Text Colors */
--st-text-color: #374151;
--st-header-text-color: #ffffff;
--st-muted-text-color: #6b7280;

/* Border and Effects */
--st-border-color: #e5e7eb;
--st-selected-cell-background-color: #a855f7;
--st-selected-cell-border-color: #7c3aed;

/* Interactive Elements */
--st-scrollbar-thumb-color: #8b5cf6;
--st-resize-handle-color: #a855f7;
}`}
            />

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faWandMagicSparkles} className="text-green-500" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Pro Tip: Live Theme Development
                </span>
              </div>

              <p className="text-green-700 dark:text-green-300 mb-3">
                Want to experiment with themes visually? Try our interactive Theme Builder to create
                and preview custom themes in real-time:
              </p>
              <Link href="/theme-builder">
                <Button type="primary" size="small">
                  Open Theme Builder
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Unique Class Names Section */}
        <section id="unique-class-names">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faGear} className="text-gray-500" />
              Unique Class Names: Precision Styling
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Every HTML element in Simple Table has a unique, semantic class name. This means you
              can target any specific part of the table with surgical precision—no more fighting
              with overly specific selectors or hunting through component internals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Table Structure Classes
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      .simple-table
                    </code>{" "}
                    - Main table container
                  </li>
                  <li>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      .simple-table-header
                    </code>{" "}
                    - Header row
                  </li>
                  <li>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      .simple-table-header-cell
                    </code>{" "}
                    - Individual header cells
                  </li>
                  <li>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      .simple-table-body
                    </code>{" "}
                    - Table body
                  </li>
                  <li>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      .simple-table-row
                    </code>{" "}
                    - Data rows
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Cell and State Classes
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      .simple-table-cell
                    </code>{" "}
                    - Individual data cells
                  </li>
                  <li>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      .selected
                    </code>{" "}
                    - Selected cells/rows
                  </li>
                  <li>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      .sortable
                    </code>{" "}
                    - Sortable headers
                  </li>
                  <li>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      .resizing
                    </code>{" "}
                    - Columns being resized
                  </li>
                  <li>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      .pinned-left
                    </code>{" "}
                    - Left-pinned columns
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cell Renderers Section */}
        <section id="cell-renderers">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faTable} className="text-indigo-500" />
              Cell Renderers: Complete Control Over Cell Content
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Sometimes CSS isn't enough—you need complete control over how cells are rendered.
              Simple Table's cell renderers let you replace the default cell content with any React
              component, giving you unlimited flexibility.
            </p>

            <div className="mb-6">
              <CellRendererDemo height="400px" theme="modern-light" />
            </div>

            <h4 className="mb-3 text-gray-900 dark:text-gray-100 text-lg font-medium">
              Creating Custom Cell Renderers
            </h4>

            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Cell renderers are React components that receive the cell data and can render anything
              you want:
            </p>

            <CodeBlock
              className="mb-4"
              code={`const headers = [
{
accessor: "email",
label: "Email",
width: 200,
type: "string",
cellRenderer: ({ row }) => (
  <div className="flex items-center">
    <span className="text-gray-400 mr-2">✉</span>
    <a href={\`mailto:\${row.email}\`} className="text-blue-600 hover:underline">
      {row.email}
    </a>
  </div>
),
},
{
accessor: "status",
label: "Status",
width: 120,
type: "string",
cellRenderer: ({ row }) => {
  const status = row.status;
  const color = status === "active" ? "green" : 
               status === "inactive" ? "red" : "yellow";
  const icon = status === "active" ? "✓" : 
              status === "inactive" ? "✕" : "!";

  return (
    <div className={\`flex items-center text-\${color}-500 capitalize\`}>
      <span className="mr-1 font-bold">{icon}</span>
      {status}
    </div>
  );
},
},
{
accessor: "progress",
label: "Progress",
width: 150,
type: "number",
cellRenderer: ({ row }) => {
  const progress = row.progress;
  const color = progress < 30 ? "red" : 
               progress < 70 ? "yellow" : "green";

  return (
    <div className="min-w-0 flex-1 w-full">
      <div className="text-xs mb-1">{progress}%</div>
      <div className="min-w-0 w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={\`bg-\${color}-500 h-2.5 rounded-full\`}
          style={{ width: \`\${progress}%\` }}
        />
      </div>
    </div>
  );
},
},
];`}
            />

            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faRocket} className="text-indigo-500" />
                <span className="font-medium text-indigo-800 dark:text-indigo-200">
                  Cell Renderer Use Cases
                </span>
              </div>
              <ul className="text-indigo-700 dark:text-indigo-300 space-y-1 mb-3">
                <li>• Interactive buttons and controls</li>
                <li>• Progress bars and data visualizations</li>
                <li>• Status badges and icons</li>
                <li>• Formatted numbers and dates</li>
                <li>• Links and clickable elements</li>
                <li>• Rich content with images and media</li>
              </ul>
              <Link href="/docs/cell-renderer">
                <Button size="small">Learn More About Cell Renderers</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Header Renderers Section */}
        <section id="header-renderers">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faPaintBrush} className="text-orange-500" />
              Header Renderers: Interactive and Beautiful Headers
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Just like cell renderers, header renderers give you complete control over how column
              headers look and behave. Create interactive headers with custom sorting indicators,
              filters, or any other functionality you need.
            </p>

            <div className="mb-6">
              <HeaderRendererDemo height="400px" theme="modern-light" />
            </div>

            <h4 className="mb-3 text-gray-900 dark:text-gray-100 text-lg font-medium">
              Building Interactive Headers
            </h4>

            <p className="mb-4 text-gray-700 dark:text-gray-300">
              The demo above shows interactive headers with custom sorting indicators and hover
              effects:
            </p>

            <CodeBlock
              className="mb-4"
              code={`const createHeaderRenderer = (key, label) => {
return ({ header }) => (
<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    padding: "4px 0",
    transition: "all 0.2s ease",
  }}
  onClick={() => handleSort(key)}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = "#6366f1";
    e.currentTarget.style.transform = "translateY(-1px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.color = "#374151";
    e.currentTarget.style.transform = "translateY(0)";
  }}
>
  <span>{label}</span>
  <span style={{ fontSize: "12px", opacity: 0.7 }}>
    {getSortIndicator(key)}
  </span>
</div>
);
};

const headers = [
{
accessor: "name",
label: "Star Name",
width: 200,
type: "string",
headerRenderer: createHeaderRenderer("name", "Star Name"),
},
// ... more headers
];`}
            />

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faWandMagicSparkles} className="text-orange-500" />
                <span className="font-medium text-orange-800 dark:text-orange-200">
                  Header Renderer Ideas
                </span>
              </div>
              <ul className="text-orange-700 dark:text-orange-300 space-y-1 mb-3">
                <li>• Custom sorting indicators with animations</li>
                <li>• Inline filter inputs and dropdowns</li>
                <li>• Column-specific action buttons</li>
                <li>• Help tooltips and documentation links</li>
                <li>• Data type indicators and formatting hints</li>
                <li>• Responsive headers that adapt to screen size</li>
              </ul>
              <Link href="/docs/header-renderer">
                <Button size="small">Learn More About Header Renderers</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section id="best-practices">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
              Best Practices for Table Customization
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Styling Strategy</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Start with built-in themes, then customize with CSS variables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Use unique class names for precise targeting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Test your styles across different screen sizes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Consider accessibility and color contrast</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Custom Renderers</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Keep renderers lightweight for better performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Use memo for complex renderers to prevent re-renders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Maintain consistent styling across custom components</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Handle loading and error states gracefully</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion Section */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-blue-500" />
              Make Your Tables Truly Yours
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table's approach to customization represents a fundamental shift in how React
                data grids should work. Instead of fighting against the library to achieve your
                desired look, you get powerful, intuitive tools that make customization a joy rather
                than a chore.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Whether you need a quick theme change, precise CSS control, or completely custom
                cell rendering, Simple Table has you covered. The combination of CSS variables,
                unique class names, and custom renderers gives you the flexibility to create tables
                that perfectly match your application's design—without sacrificing performance or
                functionality.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <CallToActionCard
          title="Ready to Transform Your React Tables?"
          description="Start building beautiful, customizable tables with Simple Table's powerful theming system. Join thousands of developers already using Simple Table."
          primaryButton={{
            text: "Get Started",
            href: "/docs/quick-start",
          }}
          secondaryButton={{
            text: "View on NPM",
            href: "https://www.npmjs.com/package/@simple-table/react",
            external: true,
          }}
        />
      </article>
    </PageWrapper>
  );
}
