import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMobileAlt,
  faHandPointer,
  faExpand,
  faCheckCircle,
  faTimesCircle,
  faThumbtack,
  faRocket,
  faLightbulb,
  faChartLine,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { mobileCompatibilityReactTablesPost } from "@/constants/blogPosts";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import { Button } from "antd";
import { DEFAULT_EXAMPLE_PATH } from "@/constants/global";
import ExampleLink from "@/components/ExampleLink";
import { SIMPLE_TABLE_INFO } from "@/constants/packageInfo";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.mobileCompatibilityReactTables.title,
  description: SEO_STRINGS.blogPosts.mobileCompatibilityReactTables.description,
  keywords: SEO_STRINGS.blogPosts.mobileCompatibilityReactTables.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.mobileCompatibilityReactTables.title,
    description: SEO_STRINGS.blogPosts.mobileCompatibilityReactTables.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.mobileCompatibilityReactTables.title,
    description: SEO_STRINGS.blogPosts.mobileCompatibilityReactTables.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/mobile-compatibility-react-tables",
  },
};

export default function MobileCompatibilityReactTablesPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          {mobileCompatibilityReactTablesPost.title}
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faMobileAlt} />
            Mobile-First
          </span>
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faHandPointer} />
            Touch-Friendly
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faExpand} />
            Responsive
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          {mobileCompatibilityReactTablesPost.description}
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faMobileAlt} className="text-blue-500" />
              The Mobile Challenge for Data Grids
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Mobile devices now account for over 60% of web traffic, yet many data grid libraries
                remain stubbornly desktop-focused. The result? Frustrated users struggling to
                interact with tiny icons, unresponsive pinned columns, and tables that feel cramped
                on smaller screens.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table was built with mobile compatibility as a core principle, not an
                afterthought. From touch-friendly interactions to intelligent column behavior on
                small screens, every feature is designed to work seamlessly across all device sizes.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faLightbulb} className="text-blue-500" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    What You'll Learn
                  </span>
                </div>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Why traditional data grids fail on mobile devices</li>
                  <li>• The pinned columns problem and how Simple Table solves it</li>
                  <li>• Touch-friendly design patterns that actually work</li>
                  <li>• Mobile performance optimization techniques</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why Grids Struggle Section */}
        <section id="why-grids-struggle">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-500" />
              Why Data Grids Struggle on Mobile
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Most React table libraries were designed for desktop-first experiences. Here are the
              common pain points that make them frustrating on mobile:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Tiny Touch Targets
                  </h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Interactive elements like resize handles, sort icons, and filter buttons are often
                  too small to tap accurately on touch screens. This leads to frustrating mis-clicks
                  and poor user experience.
                </p>
              </div>

              <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Pinned Column Problems
                  </h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Pinned columns take up precious screen real estate on mobile. When columns are
                  pinned at full desktop width, they can consume 80% of the viewport, leaving almost
                  no space for scrollable content.
                </p>
              </div>

              <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Horizontal Scroll Confusion
                  </h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Many tables don't clearly indicate that horizontal scrolling is available. Users
                  assume the visible columns are all the data, missing critical information hidden
                  off-screen.
                </p>
              </div>

              <div className="border border-red-200 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Performance Issues
                  </h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Heavy JavaScript bundles and inefficient rendering can cause lag and stuttering on
                  mobile devices with limited processing power, making interactions feel sluggish
                  and unresponsive.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pinned Columns Solution */}
        <section id="pinned-columns-solution">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faThumbtack} className="text-purple-500" />
              The Pinned Columns Problem: Solved in v1.5.0
            </h3>

            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Pinned columns are incredibly useful on desktop—they keep important data like IDs or
              names visible while users scroll through dozens of columns. But on mobile, traditional
              pinned columns become a major usability problem.
            </p>

            <div className="mb-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-500" />
                <span className="font-medium text-orange-800 dark:text-orange-200">
                  The Traditional Approach (Broken on Mobile)
                </span>
              </div>
              <p className="text-orange-700 dark:text-orange-300 mb-2">
                Most data grids treat pinned columns the same way on all screen sizes. A 300px
                pinned column on a 375px mobile screen leaves only 75px for scrollable content—
                that's barely enough for one additional column!
              </p>
            </div>

            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Simple Table's Solution (Version 1.5.0)
                </span>
              </div>
              <p className="text-green-700 dark:text-green-300 mb-3">
                Simple Table introduces intelligent mobile behavior for pinned columns:
              </p>
              <ul className="text-green-700 dark:text-green-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong>Limited Width on Mobile:</strong> Pinned columns automatically adapt to
                    a maximum width on mobile devices, ensuring they never dominate the viewport.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong>Scrollable Pinned Columns:</strong> When pinned content exceeds the
                    allocated width, it becomes horizontally scrollable—users can see all their
                    pinned data without sacrificing screen space.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong>Responsive Behavior:</strong> The table intelligently adjusts pinned
                    column width based on screen size, optimizing the balance between pinned and
                    scrollable content.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Touch-Friendly Design */}
        <section id="touch-friendly-design">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faHandPointer} className="text-green-500" />
              Touch-Friendly Design That Actually Works
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Beyond pinned columns, Simple Table implements several other mobile-first design
              patterns that make it a joy to use on touch devices:
            </p>

            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-300 font-bold">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Generous Touch Targets
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      All interactive elements in Simple Table have touch targets of at least 44x44
                      pixels—Apple's recommended minimum for touch interfaces. But here's the clever
                      part: while the resize icon or sort arrow might <em>look</em> small (16-20px),
                      the actual clickable area is much larger. This gives you clean visual design
                      without sacrificing usability.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-300 font-bold">2</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Visual Feedback
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Touch interactions provide immediate visual feedback. Tap a cell, resize a
                      column, or trigger a sort—you'll see clear visual indicators that your action
                      was registered. This reduces uncertainty and makes the interface feel
                      responsive.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-300 font-bold">3</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Touch Gesture Support
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Simple Table supports natural touch gestures like swipe-to-scroll and
                      pinch-to-zoom (when enabled). The table responds smoothly to finger movements,
                      making navigation intuitive for mobile users.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-300 font-bold">4</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Responsive Typography
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Text sizes automatically adjust for readability on smaller screens. Headers,
                      cell content, and interactive elements maintain optimal legibility without
                      requiring zoom.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Mobile Features */}
        <section id="additional-features">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-blue-500" />
              More Mobile Optimizations in Simple Table
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Simple Table's mobile-first approach extends beyond pinned columns and touch targets.
              Here are additional features that make it the best React table for mobile:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faChartLine} className="text-blue-500" />
                  Optimized Performance
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  At just {SIMPLE_TABLE_INFO.bundleSizeMinGzip}, Simple Table loads instantly even
                  on slower mobile connections. Virtual scrolling and efficient rendering ensure
                  smooth performance, even with thousands of rows on mid-range mobile devices.
                </p>
              </div>

              <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faExpand} className="text-green-500" />
                  Flexible Layouts
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Columns automatically adapt to available space. Use fractional units (1fr, 2fr)
                  for responsive column widths that grow and shrink based on viewport size, ensuring
                  optimal data visibility.
                </p>
              </div>

              <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faMobileAlt} className="text-purple-500" />
                  Scroll Indicators
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Visual cues indicate when more content is available off-screen. Users immediately
                  understand they can scroll horizontally to see additional columns, reducing
                  confusion and missed data.
                </p>
              </div>

              <div className="border border-amber-200 dark:border-amber-700 rounded-lg p-4 bg-amber-50 dark:bg-amber-900/20">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-amber-500" />
                  Mobile-Aware Features
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Features like column resizing and reordering detect touch input and adjust their
                  behavior accordingly. Drag handles become larger, feedback is more prominent, and
                  interactions feel native to the platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Example */}
        <section id="implementation">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              Getting Mobile Compatibility Out of the Box
            </h3>

            <p className="mb-4 text-gray-700 dark:text-gray-300">
              The best part? You don't need to do anything special to get mobile compatibility with
              Simple Table. All mobile optimizations work automatically:
            </p>

            <div>
              <h4 className="mb-2 text-gray-900 dark:text-gray-100 text-lg font-medium">
                Basic Setup (Works Perfectly on Mobile)
              </h4>
              <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-auto text-sm leading-relaxed">
                {`import React from "react";
import { SimpleTable } from "@simple-table/react";
import "@simple-table/react/styles.css";

const headers = [
  { 
    accessor: "id", 
    label: "ID", 
    width: 80, 
    type: "number",
    pinned: "left" // Automatically adapts on mobile!
  },
  { accessor: "name", label: "Name", width: "1fr", type: "string" },
  { accessor: "email", label: "Email", width: 200, type: "string" },
  { accessor: "status", label: "Status", width: 120, type: "string" },
  { accessor: "created", label: "Created", width: 150, type: "date" },
];

export default function MobileTable() {
  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={data}
      
    />
  );
}`}
              </pre>
            </div>

            <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Zero Configuration Required
                </span>
              </div>
              <p className="text-green-700 dark:text-green-300">
                The table in this example will automatically adapt to mobile devices with limited
                pinned column width, touch-friendly interactions, responsive typography, and smooth
                scrolling. No media queries, no special configuration, no extra code.
              </p>
            </div>
          </div>
        </section>

        {/* Conclusion Section */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-xl font-semibold">
              <FontAwesomeIcon icon={faMobileAlt} className="text-blue-500" />
              Mobile-First by Design, Not as an Afterthought
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                As mobile devices continue to dominate web traffic, having a truly mobile-compatible
                React table library isn't optional—it's essential. Simple Table was built from the
                ground up with mobile users in mind, ensuring that data grids are as usable on a
                smartphone as they are on a desktop.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Version 1.5.0's intelligent pinned column behavior represents our continued
                commitment to solving real-world mobile challenges. Combined with generous touch
                targets, optimized performance, and responsive layouts, Simple Table delivers the
                best mobile experience of any React data grid library.
              </p>

              <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    Ready to Build Mobile-First Data Grids?
                  </span>
                </div>
                <p className="text-blue-700 dark:text-blue-300 mb-3">
                  Stop fighting with desktop-only table libraries. Try Simple Table and experience
                  true mobile compatibility that works out of the box—no configuration required.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/docs/installation">
                    <Button type="primary" size="middle" block>
                      Get Started Now
                    </Button>
                  </Link>
                  <ExampleLink href={DEFAULT_EXAMPLE_PATH}>
                    <Button size="middle" block>
                      View Mobile Demo
                    </Button>
                  </ExampleLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Experience True Mobile Compatibility"
        description="Simple Table's mobile-first design ensures your data grids work flawlessly on all devices. With intelligent pinned columns, touch-friendly interactions, and zero configuration required, it's the best React table for mobile users. Try it today and see the difference."
        primaryButton={{
          text: "Get Started",
          href: "/docs/installation",
        }}
        secondaryButton={{
          text: "Explore Examples",
          href: DEFAULT_EXAMPLE_PATH,
        }}
      />
    </BlogLayout>
  );
}
