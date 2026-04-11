import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaintBrush,
  faCode,
  faMagic,
  faCheckCircle,
  faTable,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { customizingDataGridsStylingEasyPost } from "@/constants/blogPosts";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import { Button } from "antd";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.customizingDataGridsStylingEasy.title,
  description: SEO_STRINGS.blogPosts.customizingDataGridsStylingEasy.description,
  keywords: SEO_STRINGS.blogPosts.customizingDataGridsStylingEasy.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.customizingDataGridsStylingEasy.title,
    description: SEO_STRINGS.blogPosts.customizingDataGridsStylingEasy.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.customizingDataGridsStylingEasy.title,
    description: SEO_STRINGS.blogPosts.customizingDataGridsStylingEasy.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/customizing-data-grids-styling-easy",
  },
};

export default function CustomizingDataGridsStylingEasyPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          {customizingDataGridsStylingEasyPost.title}
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faPaintBrush} />
            Styling
          </span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            CSS
          </span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faTable} />
            Data Grids
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          {customizingDataGridsStylingEasyPost.description}
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faMagic} className="text-purple-500" />
              The Styling Challenge
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                One of the biggest frustrations when working with data grids is trying to customize
                their appearance. Most libraries either provide no styling at all, leaving you to
                build everything from scratch, or they come with such heavily opinionated styles
                that customizing them becomes a nightmare of CSS overrides and !important
                declarations.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table takes a different approach: it provides beautiful default styles that
                are easy to customize using standard CSS and Tailwind classes.
              </p>
            </div>
          </div>
        </section>

        {/* CSS Customization Section */}
        <section id="css-customization">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-blue-500" />
              CSS Customization Made Simple
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Here's how easy it is to customize Simple Table with regular CSS:
            </p>

            <h4 className="mb-3 text-gray-900 dark:text-gray-100 text-lg font-medium">
              1. Basic Table Styling
            </h4>

            <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-auto mb-6 text-sm leading-relaxed">
              {`/* Custom table styling */
.simple-table {
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Header styling */
.simple-table-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

/* Row styling */
.simple-table-row:nth-child(even) {
  background-color: #f8fafc;
}

.simple-table-row:hover {
  background-color: #e2e8f0;
  transform: scale(1.01);
  transition: all 0.2s ease;
}`}
            </pre>

            <h4 className="mb-3 text-gray-900 dark:text-gray-100 text-lg font-medium">
              2. Cell-Specific Styling
            </h4>

            <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-auto mb-6 text-sm leading-relaxed">
              {`/* Target specific columns */
.simple-table-cell[data-column="status"] {
  text-align: center;
  font-weight: bold;
}

.simple-table-cell[data-column="price"] {
  color: #059669;
  font-family: 'Monaco', monospace;
}

/* Selected cell styling */
.simple-table-cell.selected {
  background-color: #3b82f6;
  color: white;
  box-shadow: inset 0 0 0 2px #1d4ed8;
}`}
            </pre>

            <h4 className="mb-3 text-gray-900 dark:text-gray-100 text-lg font-medium">
              3. Dark Mode Support
            </h4>

            <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-auto mb-6 text-sm leading-relaxed">
              {`/* Dark mode styling */
@media (prefers-color-scheme: dark) {
  .simple-table {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .simple-table-row:nth-child(even) {
    background-color: #374151;
  }

  .simple-table-row:hover {
    background-color: #4b5563;
  }
}`}
            </pre>
          </div>
        </section>

        {/* Tailwind Integration Section */}
        <section id="tailwind-integration">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              Tailwind CSS Integration
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Simple Table works seamlessly with Tailwind CSS. You can apply utility classes
              directly to customize the appearance:
            </p>

            <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-auto mb-6 text-sm leading-relaxed">
              {`import { SimpleTable } from "@simple-table/react";

<SimpleTable
  defaultHeaders={headers}
  rows={data}
  className="rounded-xl shadow-2xl border-2 border-indigo-200"
  headerClassName="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
  rowClassName="hover:bg-blue-50 transition-colors duration-200"
  cellClassName="border-b border-gray-100 px-4 py-3"
  theme="modern-light"
/>`}
            </pre>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                <span className="font-medium text-green-800 dark:text-green-200">Pro Tip</span>
              </div>
              <p className="text-green-700 dark:text-green-300">
                You can mix and match CSS classes and Tailwind utilities for maximum flexibility.
                Simple Table's class-based approach means you have complete control over styling.
              </p>
            </div>
          </div>
        </section>

        {/* Why It Matters Section */}
        <section id="why-it-matters">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faPaintBrush} className="text-amber-500" />
              Why Easy Styling Matters
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                When data grid styling is easy, it means:
              </p>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li>• Faster development cycles with less time fighting CSS</li>
                <li>• Better consistency with your existing design system</li>
                <li>• More time to focus on functionality rather than appearance</li>
                <li>• Easier maintenance as your application evolves</li>
              </ul>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table's approach to styling reflects our core philosophy: powerful
                functionality should come with sensible defaults, and customization should feel
                natural, not like a battle.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faPaintBrush} className="text-blue-500" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    Try It Yourself
                  </span>
                </div>
                <p className="text-blue-700 dark:text-blue-300 mb-3">
                  Want to see how easy styling can be? Try our interactive Theme Builder to create
                  custom themes visually and see the results in real-time.
                </p>
                <Link href="/theme-builder">
                  <Button
                    type="primary"
                    size="large"
                    icon={<FontAwesomeIcon icon={faPaintBrush} />}
                    block
                  >
                    Open Theme Builder
                  </Button>
                </Link>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="mb-4 text-gray-900 dark:text-gray-100 text-lg font-medium">
                  Ready to style your data grids the easy way?
                </h4>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/docs/custom-theme"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
                  >
                    Custom Theme Guide
                  </Link>

                  <Link
                    href="/docs/custom-icons"
                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-500 hover:text-purple-600 px-6 py-3 rounded-lg font-medium transition-colors text-center"
                  >
                    Custom Icons Guide
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <CallToActionCard
          title="Experience the power of easy styling"
          description="Simple Table makes customizing data grids as easy as writing regular CSS. No complex overrides, no fighting with existing styles."
          primaryButton={{
            text: "View on NPM",
            href: "https://www.npmjs.com/package/@simple-table/react",
            external: true,
          }}
          secondaryButton={{
            text: "Back to Home",
            href: "/",
          }}
        />
      </article>
    </BlogLayout>
  );
}
