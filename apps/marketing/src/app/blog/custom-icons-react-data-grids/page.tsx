import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIcons,
  faCheckCircle,
  faLightbulb,
  faCode,
  faPalette,
  faRocket,
  faBolt,
  faWandMagicSparkles,
  faArrowsUpDown,
  faFilter,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import CodeBlock from "@/components/CodeBlock";
import Link from "next/link";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.customIconsReactGrids.title,
  description: SEO_STRINGS.blogPosts.customIconsReactGrids.description,
  keywords: SEO_STRINGS.blogPosts.customIconsReactGrids.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.customIconsReactGrids.title,
    description: SEO_STRINGS.blogPosts.customIconsReactGrids.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.customIconsReactGrids.title,
    description: SEO_STRINGS.blogPosts.customIconsReactGrids.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/custom-icons-react-data-grids",
  },
};

export default function CustomIconsReactGridsPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Custom Icons in React Data Grids: Complete Tutorial
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faIcons} />
            Custom Icons
          </span>
          <span className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faPalette} />
            Branding
          </span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            Tutorial
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Default table icons are fine... for prototypes. For production apps, custom icons match
          your design system, strengthen your brand, and create a cohesive user experience. Learn
          how to replace every icon in your React data grid.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8 mb-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You've spent weeks perfecting your app's design system. Every button, input, and
                dropdown uses icons from your custom set—maybe Font Awesome Pro with your brand
                colors, or a bespoke SVG collection your designer crafted. Then you add a data grid,
                and suddenly there are sort arrows and filter icons that look... off. They're
                generic, they clash with your aesthetic, and they scream "I'm using the default
                theme."
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Custom icons aren't just about vanity. They're about{" "}
                <strong>visual consistency</strong>, <strong>brand identity</strong>, and{" "}
                <strong>user confidence</strong>. When every UI element matches your design
                language, users trust the interface more. When one component stands out as
                "different," it erodes that trust.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                In this guide, we'll cover how to customize icons in React data grids, which icons
                to replace, and best practices for icon design. Whether you're using Font Awesome,
                Material Icons, Lucide, or custom SVGs, you'll learn how to make your tables truly
                yours.
              </p>
            </div>
          </div>
        </section>

        {/* Why Custom Icons Matter */}
        <section id="why-custom-icons">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              Why Custom Icons Matter
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faPalette} className="text-blue-500 text-xl" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Brand Consistency
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Your brand has a visual language—icon style, stroke weight, corner radius. When
                    table icons match, the entire app feels cohesive and professional.
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faBolt} className="text-green-500 text-xl" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Better UX</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Custom icons can be clearer, more descriptive, or better sized for your context.
                    A well-designed filter icon is instantly recognizable. Combined with{" "}
                    <Link
                      href="/docs/theming"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      custom theming
                    </Link>
                    , your table becomes truly yours.
                  </p>
                </div>

                <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon
                      icon={faWandMagicSparkles}
                      className="text-purple-500 text-xl"
                    />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Stand Out</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Default icons make your app look generic. Custom icons—especially unique
                    ones—signal attention to detail and quality craftsmanship.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Real-World Examples
              </h3>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>SaaS Dashboards:</strong> Match table icons to your sidebar navigation
                    icons for visual harmony
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Financial Tools:</strong> Use distinctive sort icons that match your
                    chart and graph visualizations
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>E-Commerce Admin:</strong> Align table icons with product card icons,
                    button icons, and status badges
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Enterprise Apps:</strong> Use corporate-approved icon sets that match
                    internal design guidelines
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* What Icons to Customize */}
        <section id="what-icons-to-customize">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faIcons} className="text-blue-500" />
              What Icons Can You Customize?
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Modern React data grids use icons in several places. Simple Table lets you customize
                all of them—no locked-in defaults. Here's what you can change:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faArrowsUpDown} className="text-blue-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Sorting Icons</h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Ascending, descending, and unsorted state indicators in column headers.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Typical props:</strong> <code>icons.sortUp</code>,{" "}
                    <code>icons.sortDown</code>
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faFilter} className="text-green-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Filter Icons</h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Button to open filter dropdowns or menus in column headers.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Typical props:</strong> <code>icons.filter</code>
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faChevronRight} className="text-purple-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Expand/Collapse Icons
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    For row grouping, hierarchical data, or collapsible column groups.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Typical props:</strong> <code>icons.expand</code>,{" "}
                    <code>icons.headerCollapse</code>
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-500 text-xl">◄ ►</span>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Pagination Icons
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    Previous, next, first, and last page navigation buttons in the footer.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Typical props:</strong> <code>icons.prev</code>,{" "}
                    <code>icons.next</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation with Simple Table */}
        <section id="implementation">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-blue-500" />
              How to Add Custom Icons in Simple Table
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table makes icon customization straightforward. Pass React components (or
                JSX) as props, and the table uses them everywhere that icon appears.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Example 1: Font Awesome Icons
              </h3>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable } from "@simple-table/react";
import "@simple-table/react/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortUp,
  faSortDown,
  faFilter,
  faChevronRight,
  faChevronDown,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

export default function CustomIconTable({ data, headers }) {
  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={data}
      height="500px"
      icons={{
        sortUp: <FontAwesomeIcon icon={faSortUp} className="text-blue-600" />,
        sortDown: <FontAwesomeIcon icon={faSortDown} className="text-blue-600" />,
        filter: <FontAwesomeIcon icon={faFilter} className="text-gray-600" />,
        expand: <FontAwesomeIcon icon={faChevronRight} className="text-gray-600" />,
        headerCollapse: <FontAwesomeIcon icon={faChevronDown} className="text-gray-600" />,
        prev: <FontAwesomeIcon icon={faAngleLeft} className="text-blue-600" />,
        next: <FontAwesomeIcon icon={faAngleRight} className="text-blue-600" />,
      }}
    />
  );
}`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Example 2: Custom SVG Icons
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                If you have custom SVG icons, wrap them in React components and pass them the same
                way:
              </p>

              <CodeBlock
                className="mb-6"
                code={`// Custom SVG icon components
const SortUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M6 2L11 8H1L6 2Z" />
  </svg>
);

const SortDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M6 10L1 4H11L6 10Z" />
  </svg>
);

const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
    <path d="M0 2h14v2H0zm2 4h10v2H2zm2 4h6v2H4z" />
  </svg>
);

export default function CustomSVGTable({ data, headers }) {
  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={data}
      icons={{
        sortUp: <SortUpIcon />,
        sortDown: <SortDownIcon />,
        filter: <FilterIcon />,
      }}
    />
  );
}`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Example 3: Lucide Icons (Popular Alternative)
              </h3>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable } from "@simple-table/react";
import "@simple-table/react/styles.css";
import {
  ChevronUp,
  ChevronDown,
  Filter,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export default function LucideIconTable({ data, headers }) {
  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={data}
      icons={{
        sortUp: <ChevronUp size={16} className="text-indigo-600" />,
        sortDown: <ChevronDown size={16} className="text-indigo-600" />,
        filter: <Filter size={14} className="text-gray-500" />,
        prev: <ChevronLeft size={18} className="text-indigo-600" />,
        next: <ChevronRight size={18} className="text-indigo-600" />,
      }}
    />
  );
}`}
              />

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Pro Tip:</strong> Icons are just React components or JSX. You can pass
                  inline SVGs, icon library components, or even custom React components with
                  animations or state.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              Custom Icon Best Practices
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Design Guidelines
              </h3>

              <div className="space-y-4 mb-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    📏 Consistent Size & Weight
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    All table icons should use the same visual weight (stroke thickness) and roughly
                    the same size. Sort icons at 16px and filter icons at 14px creates visual
                    imbalance.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🎨 Match Your Brand Colors
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Don't use default black/gray. If your primary color is blue, make sort and
                    filter icons blue. If you use purple accents, match those.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    ✨ Keep Icons Simple
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Table icons are small (12-16px). Intricate details get lost. Use clear,
                    high-contrast shapes that are recognizable at small sizes.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    ♿ Ensure Accessibility
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Icons must have sufficient color contrast (WCAG AA: 4.5:1). Don't rely on color
                    alone—use shapes that are distinguishable in grayscale.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    🧪 Test in Dark Mode
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    If you support dark mode, ensure icons are visible and meet contrast
                    requirements in both themes. You may need different color classes for light vs
                    dark.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Common Mistakes to Avoid
              </h3>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">❌</span>
                  <span>
                    <strong>Mixing icon styles:</strong> Using Font Awesome for some icons and
                    Material Icons for others—pick one set
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">❌</span>
                  <span>
                    <strong>Over-decorating:</strong> Adding gradients, shadows, or animations that
                    distract from data
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">❌</span>
                  <span>
                    <strong>Ignoring hover states:</strong> Icons should have visual feedback on
                    hover (color change, slight scale)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">❌</span>
                  <span>
                    <strong>Using text labels as icons:</strong> "Sort ↑" instead of a proper
                    icon—this breaks visual hierarchy
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Advanced Patterns */}
        <section id="advanced-patterns">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-purple-500" />
              Advanced Icon Patterns
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Animated Icons
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Add subtle animations to make interactions feel more responsive:
              </p>

              <CodeBlock
                className="mb-6"
                code={`// Animated sort icon component
const AnimatedSortIcon = ({ direction }: { direction: 'up' | 'down' }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    className="transition-transform duration-200 ease-in-out"
    style={{ transform: direction === 'down' ? 'rotate(180deg)' : 'rotate(0)' }}
  >
    <path d="M6 2L11 8H1L6 2Z" fill="currentColor" />
  </svg>
);

// Usage
<SimpleTable
  icons={{
    sortUp: <AnimatedSortIcon direction="up" />,
    sortDown: <AnimatedSortIcon direction="down" />,
  }}
  // ... other props
/>`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Dynamic Icon Colors Based on State
              </h3>

              <CodeBlock
                className="mb-6"
                code={`// Icon that changes color when filter is active
const FilterIconWithState = ({ isActive }: { isActive: boolean }) => (
  <FontAwesomeIcon
    icon={faFilter}
    className={\`transition-colors \${
      isActive ? 'text-blue-600' : 'text-gray-400'
    }\`}
  />
);`}
              />

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Icon Sets as a Theme
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Create reusable icon sets for different themes or contexts:
              </p>

              <CodeBlock
                className="mb-6"
                code={`// Icon theme configurations
const iconThemes = {
  modern: {
    sortUp: <ChevronUp size={14} className="text-indigo-500" />,
    sortDown: <ChevronDown size={14} className="text-indigo-500" />,
    filter: <Filter size={14} className="text-gray-500" />,
  },
  classic: {
    sortUp: <FontAwesomeIcon icon={faSortUp} className="text-gray-700" />,
    sortDown: <FontAwesomeIcon icon={faSortDown} className="text-gray-700" />,
    filter: <FontAwesomeIcon icon={faFilter} className="text-gray-700" />,
  },
};

// Usage
export default function ThemedTable({ theme = "modern", data, headers }) {
  return (
    <SimpleTable
      icons={iconThemes[theme]}
      defaultHeaders={headers}
      rows={data}
    />
  );
}`}
              />
            </div>
          </div>
        </section>

        {/* Popular Icon Libraries */}
        <section id="icon-libraries">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faIcons} className="text-pink-500" />
              Popular Icon Libraries for React
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Not sure which icon library to use? Here are the most popular choices:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Library
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        Icon Count
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        License
                      </th>
                      <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">
                        Best For
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Font Awesome (Free)
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        2,000+
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-green-600 dark:text-green-400">
                        Free
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        General-purpose apps, most popular
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Lucide
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        1,000+
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-green-600 dark:text-green-400">
                        MIT
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        Modern, clean design; Feather Icons fork
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        React Icons
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        10,000+
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-green-600 dark:text-green-400">
                        MIT
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        Multiple icon sets in one package
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Material Icons
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        2,000+
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-green-600 dark:text-green-400">
                        Apache 2.0
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        Material Design apps
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">
                        Heroicons
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center">
                        300+
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-green-600 dark:text-green-400">
                        MIT
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 p-3">
                        Tailwind CSS projects
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
              Make Your Tables Truly Yours
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Custom icons are a small detail that makes a big difference. They signal quality,
                strengthen your brand, and create visual consistency across your entire application.
                With Simple Table, customization is as simple as passing icon components as props—no
                wrestling with CSS overrides or complex configuration.
              </p>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Choose one icon library</strong> and use it consistently throughout your
                    app
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Match your brand colors</strong> and visual style
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Keep icons simple</strong> and high-contrast for small sizes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Test in both light and dark mode</strong> if you support themes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Consider subtle animations</strong> for better interaction feedback
                  </span>
                </li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300">
                Whether you're using Font Awesome, Lucide, Material Icons, or custom SVGs, Simple
                Table makes it trivial to replace default icons with your own. Pass components as
                props, and you're done. No complexity, no limitations, just tables that match your
                vision.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Ready to customize your React table icons?"
        description="Simple Table gives you complete control over every icon in your data grid. Just pass React components—Font Awesome, Lucide, custom SVGs, or anything else—and Simple Table does the rest."
        primaryButton={{
          text: "View Custom Icons Docs",
          href: "/docs/custom-icons",
        }}
        secondaryButton={{
          text: "Try Live Demo",
          href: "/docs/custom-icons",
        }}
      />
    </BlogLayout>
  );
}
