import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faTable, faDollarSign, faUser, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { freeAlternativeToAgGridPost } from "@/constants/blogPosts";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import { SIMPLE_TABLE_INFO } from "@/constants/packageInfo";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.freeAlternativeToAgGrid.title,
  description: SEO_STRINGS.blogPosts.freeAlternativeToAgGrid.description,
  keywords: SEO_STRINGS.blogPosts.freeAlternativeToAgGrid.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.freeAlternativeToAgGrid.title,
    description: SEO_STRINGS.blogPosts.freeAlternativeToAgGrid.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.freeAlternativeToAgGrid.title,
    description: SEO_STRINGS.blogPosts.freeAlternativeToAgGrid.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/free-alternative-to-ag-grid",
  },
};

export default function FreeAlternativeToAgGridPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          {freeAlternativeToAgGridPost.title}
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            React
          </span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faTable} />
            Data Grid
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faDollarSign} />
            Free Alternative
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          {freeAlternativeToAgGridPost.description}
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8">
        {/* My Story Section */}
        <section id="my-story">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faUser} className="text-blue-500" />
              My Story: From Frustration to Solution
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Hey everyone, I'm thrilled to share the story of a project I've worked hard on.
                While working on a React side project, I realized I needed a reliable data grid to
                bring my ideas to life, but with no budget to spend on expensive tools, I decided to
                build my own solution from scratch.
              </p>

              <h4 className="mb-2 text-gray-900 dark:text-gray-100 text-lg font-medium">
                The AG Grid Dream—and the Cost Barrier
              </h4>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                I really wanted to use AG Grid because it has all those fancy Enterprise features
                like cell selection and row grouping. But I'm pretty broke, and their pricing was
                impossible for me.
              </p>

              <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-amber-800 dark:text-amber-200">
                    AG Grid's Steep Price
                  </span>
                </div>
                <p className="text-amber-700 dark:text-amber-300 mb-3">
                  $1,000 per year per developer, plus $750 per license! That was way out of my
                  budget of $0.00.
                </p>
                <p className="text-amber-700 dark:text-amber-300">
                  Want to see a detailed cost breakdown? Check out our{" "}
                  <a
                    href="/comparisons/simple-table-vs-ag-grid"
                    className="font-medium text-amber-900 dark:text-amber-100 underline hover:no-underline"
                  >
                    comprehensive Simple Table vs AG Grid comparison
                  </a>{" "}
                  with real ROI calculations.
                </p>
              </div>

              <h4 className="mb-2 text-gray-900 dark:text-gray-100 text-lg font-medium">
                Why Alternatives Fell Short
              </h4>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                I looked at other options, hoping to find a free or affordable solution. Here's what
                I found—and why they didn't work for me:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h5 className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    TanStack Table
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300">
                    TanStack Table is lightweight and free, but it doesn't have a built-in UI. I
                    really needed cell selection without building the entire interface from scratch.
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h5 className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Handsontable
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300">
                    Handsontable seemed promising, but customizing its UI was impossible. I spent
                    hours fighting its styles, and it was so frustrating—I hope you never have to
                    deal with that!
                  </p>
                </div>
              </div>

              <h4 className="mb-2 mt-6 text-gray-900 dark:text-gray-100 text-lg font-medium">
                Enter Simple Table: My Solution
              </h4>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                So, I decided to build my own solution:{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">Simple Table</span>, a
                lightweight ({SIMPLE_TABLE_INFO.bundleSizeMinGzip}) React data grid that's free for
                everyone.
              </p>

              <p className="mb-2 text-gray-700 dark:text-gray-300">
                It's got all the basics a table needs, including:
              </p>

              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li>• Alignment, filters, and sorting for easy data management</li>
                <li>• Virtualization and infinite scroll for handling large datasets</li>
                <li>• Pagination and nested headers for better organization</li>
                <li>• Row grouping and cell selection for advanced functionality</li>
              </ul>

              <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.53 10.53a.75.75 0 00-1.06 1.061l2.03 2.03a.75.75 0 001.137-.089l3.857-5.401z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-green-800 dark:text-green-200">
                    Free and Lightweight
                  </span>
                </div>
                <p className="text-green-700 dark:text-green-300">
                  At just {SIMPLE_TABLE_INFO.bundleSizeMinGzip} and completely free, Simple Table is
                  designed to be accessible for developers like me who can't afford pricey
                  Enterprise licenses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion Section */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faHeart} className="text-red-500" />
              Wrapping Up: A Labor of Love
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Building Simple Table has been a true labor of love for me. As a full-time front-end
                developer, I've dedicated every weekend for months to create a tool that solves real
                problems for developers like us, especially those who can't afford expensive
                Enterprise licenses. I hope Simple Table can help make your React projects easier
                and more affordable.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                If you're currently evaluating AG Grid or considering alternatives, I've put
                together a{" "}
                <a
                  href="/comparisons/simple-table-vs-ag-grid"
                  className="font-medium text-blue-600 dark:text-blue-400 underline hover:no-underline"
                >
                  detailed feature-by-feature comparison
                </a>{" "}
                that includes cost analysis, bundle size impact, and enterprise feature breakdown.
                It might help you make the best decision for your project and budget.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <CallToActionCard
          title="Ready to try a free React data grid?"
          description="Simple Table is lightweight, free, and packed with features to make your React tables shine. I'd really appreciate it if you could check it out and share your feedback—it'd mean the world to me and help make this project even better."
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
