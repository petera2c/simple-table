import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUniversalAccess,
  faKeyboard,
  faCheckCircle,
  faBalanceScale,
  faLightbulb,
  faTrophy,
  faExclamationTriangle,
  faShieldAlt,
  faEye,
  faHandPointer,
  faMobileAlt,
  faGavel,
  faTimesCircle,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.mitLicensedAccessibility.title,
  description: SEO_STRINGS.blogPosts.mitLicensedAccessibility.description,
  keywords: SEO_STRINGS.blogPosts.mitLicensedAccessibility.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.mitLicensedAccessibility.title,
    description: SEO_STRINGS.blogPosts.mitLicensedAccessibility.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.mitLicensedAccessibility.title,
    description: SEO_STRINGS.blogPosts.mitLicensedAccessibility.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/mit-licensed-react-tables-accessibility-keyboard-navigation",
  },
};

export default function AccessibilityComparisonPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          MIT-Licensed React Tables: Accessibility & Keyboard Navigation Comparison
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faUniversalAccess} />
            Accessibility
          </span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faKeyboard} />
            Keyboard Nav
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldAlt} />
            MIT Licensed
          </span>
          <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faGavel} />
            WCAG 2.1
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Which free React data grids actually work for keyboard users and screen readers? A
          comprehensive comparison of accessibility features across MIT-licensed table libraries.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8">
        {/* Introduction */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Accessibility isn't optional—it's a legal requirement in many jurisdictions (ADA,
                WCAG 2.1 AA, Section 508) and a moral imperative. Yet when{" "}
                <Link
                  href="/blog/best-react-table-libraries-2026"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  comparing React data grids
                </Link>
                , accessibility is often the last thing developers consider. Most comparison
                articles focus on features, bundle size, and pricing, while ignoring the question:{" "}
                <strong>"Can everyone actually use this?"</strong>
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                This guide evaluates MIT-licensed React data grids through the lens of accessibility
                and keyboard navigation. We'll test real-world scenarios: Can blind users navigate
                with screen readers? Can keyboard-only users sort and filter? Are focus indicators
                visible? Do touch targets meet minimum size requirements?
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <FontAwesomeIcon icon={faLightbulb} className="text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Why This Matters
                    </h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>
                        • <strong>15% of the global population</strong> has some form of disability
                      </li>
                      <li>
                        • <strong>Legal compliance:</strong> ADA lawsuits cost companies an average
                        of $20K-$50K to settle
                      </li>
                      <li>
                        • <strong>SEO benefits:</strong> Accessible sites rank better in search
                        results
                      </li>
                      <li>
                        • <strong>Better UX for everyone:</strong> Keyboard navigation helps power
                        users too
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Fundamentals */}
        <section id="fundamentals">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faUniversalAccess} className="text-green-500" />
              What Makes a Data Grid Accessible?
            </h2>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              An accessible data grid must meet WCAG 2.1 Level AA standards. Here's what that means
              in practice:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Keyboard Navigation */}
              <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faKeyboard} className="text-blue-500" />
                  Keyboard Navigation
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-blue-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Arrow keys:</strong> Navigate between cells
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-blue-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Tab:</strong> Move through interactive elements
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-blue-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Enter/Space:</strong> Activate buttons, sort columns
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-blue-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Home/End:</strong> Jump to first/last cell
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-blue-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Page Up/Down:</strong> Scroll through data
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-blue-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Escape:</strong> Cancel edits, close modals
                    </span>
                  </li>
                </ul>
              </div>

              {/* Screen Reader Support */}
              <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faEye} className="text-green-500" />
                  Screen Reader Support
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>ARIA attributes:</strong> role="grid", aria-label, aria-sort
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Row/column counts:</strong> Announce "Row 5 of 100"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Sort state:</strong> "Sorted ascending" announced
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Cell content:</strong> All data readable by screen readers
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Live regions:</strong> Dynamic updates announced
                    </span>
                  </li>
                </ul>
              </div>

              {/* Visual Indicators */}
              <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-6 bg-purple-50 dark:bg-purple-900/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faHandPointer} className="text-purple-500" />
                  Visual & Focus Indicators
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-purple-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Visible focus:</strong> Clear outline on focused cell (3:1 contrast)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-purple-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Color contrast:</strong> 4.5:1 for text, 3:1 for UI components
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-purple-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Touch targets:</strong> Minimum 44×44px for interactive elements
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-purple-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Hover states:</strong> Visual feedback on mouse hover
                    </span>
                  </li>
                </ul>
              </div>

              {/* Mobile & Touch */}
              <div className="border border-orange-200 dark:border-orange-700 rounded-lg p-6 bg-orange-50 dark:bg-orange-900/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faMobileAlt} className="text-orange-500" />
                  Mobile & Touch Support
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-orange-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Touch-friendly:</strong> Large tap targets, swipe gestures
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-orange-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Responsive:</strong> Adapts to small screens gracefully
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-orange-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Zoom support:</strong> Works at 200% zoom without breaking
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-orange-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Screen rotation:</strong> Maintains functionality in
                      portrait/landscape
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section id="comparison">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBalanceScale} className="text-blue-500" />
              Accessibility Comparison: MIT-Licensed React Grids
            </h2>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              We tested each library with VoiceOver (macOS), NVDA (Windows), keyboard-only
              navigation, and automated tools (axe DevTools, Lighthouse). Here's what we found:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                    <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">
                      Feature
                    </th>
                    <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">
                      Simple Table
                    </th>
                    <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">
                      TanStack Table
                    </th>
                    <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">
                      MUI X Data Grid
                    </th>
                    <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">
                      React Data Grid
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Keyboard Navigation */}
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <td colSpan={5} className="p-3 font-semibold text-gray-900 dark:text-gray-100">
                      <FontAwesomeIcon icon={faKeyboard} className="text-blue-500 mr-2" />
                      Keyboard Navigation
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      Arrow key cell navigation
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">
                      ✓ Built-in
                    </td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                      △ You build
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      Tab through interactive elements
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">
                      ✓ Built-in
                    </td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                      △ You build
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Home/End navigation</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">
                      ✓ Built-in
                    </td>
                    <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                      △ Partial
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      Enter/Space to activate
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">
                      ✓ Built-in
                    </td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                      △ You build
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>

                  {/* Screen Reader */}
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <td colSpan={5} className="p-3 font-semibold text-gray-900 dark:text-gray-100">
                      <FontAwesomeIcon icon={faEye} className="text-green-500 mr-2" />
                      Screen Reader Support
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      Semantic ARIA attributes
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">
                      ✓ Complete
                    </td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                      △ You add
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      Row/column announcements
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">
                      ✓ Built-in
                    </td>
                    <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      Sort state announcements
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">
                      ✓ Built-in
                    </td>
                    <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">△</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Live region updates</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">
                      ✓ Built-in
                    </td>
                    <td className="p-3 text-center text-red-600 dark:text-red-400">✗</td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                      △ Partial
                    </td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">△</td>
                  </tr>

                  {/* Visual Indicators */}
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <td colSpan={5} className="p-3 font-semibold text-gray-900 dark:text-gray-100">
                      <FontAwesomeIcon icon={faHandPointer} className="text-purple-500 mr-2" />
                      Visual & Focus Indicators
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Visible focus outline</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">
                      ✓ 3:1 contrast
                    </td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                      △ You style
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">WCAG contrast ratios</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">
                      ✓ AAA
                    </td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                      △ Your styles
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓ AA</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓ AA</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      Touch targets (44×44px min)
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">
                      ✓ 48×48px
                    </td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                      △ You design
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>

                  {/* Mobile & Touch */}
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <td colSpan={5} className="p-3 font-semibold text-gray-900 dark:text-gray-100">
                      <FontAwesomeIcon icon={faMobileAlt} className="text-orange-500 mr-2" />
                      Mobile & Touch Support
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Touch-friendly design</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">
                      ✓ Optimized
                    </td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                      △ You build
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">△</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Mobile responsive</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">
                      ✓ Native
                    </td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                      △ You build
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-700 dark:text-gray-300">Zoom support (200%)</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">
                      ✓ Tested
                    </td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400">
                      △ Your CSS
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400">✓</td>
                  </tr>

                  {/* Overall Score */}
                  <tr className="border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 font-bold">
                    <td className="p-3 text-gray-900 dark:text-gray-100">
                      Overall Accessibility Score
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 text-lg">
                      ★★★★★
                    </td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400 text-lg">
                      ★★☆☆☆
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 text-lg">
                      ★★★★☆
                    </td>
                    <td className="p-3 text-center text-green-600 dark:text-green-400 text-lg">
                      ★★★★☆
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>Legend:</strong>
              </p>
              <ul className="space-y-1">
                <li>
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span> Fully
                  supported out of the box
                </li>
                <li>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">△</span> Requires
                  additional implementation
                </li>
                <li>
                  <span className="text-red-600 dark:text-red-400 font-bold">✗</span> Not supported
                  / difficult to implement
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* TanStack Reality Check */}
        <section id="tanstack-reality">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500" />
              TanStack Table: The Accessibility Trap
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                TanStack Table's "you build everything" philosophy sounds empowering, but it creates
                a serious accessibility problem: <strong>most developers won't</strong> build
                accessible UI from scratch. Read more in our{" "}
                <Link
                  href="/blog/tanstack-table-vs-simple-table-headless-batteries-included"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  headless vs batteries-included comparison
                </Link>
                .
              </p>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  What You Need to Implement Yourself:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>
                    • <strong>ARIA attributes:</strong> role="grid", aria-rowcount, aria-colcount,
                    aria-sort, aria-label on every element
                  </li>
                  <li>
                    • <strong>Keyboard handlers:</strong> Arrow keys, Tab, Enter, Space, Home, End,
                    Page Up/Down
                  </li>
                  <li>
                    • <strong>Focus management:</strong> Track focused cell, handle focus trap,
                    restore focus on interactions
                  </li>
                  <li>
                    • <strong>Screen reader announcements:</strong> Live regions for sort changes,
                    filter updates, row counts
                  </li>
                  <li>
                    • <strong>Visual indicators:</strong> Focus outlines, hover states, high
                    contrast support
                  </li>
                  <li>
                    • <strong>Touch support:</strong> Large targets, swipe gestures, mobile
                    optimization
                  </li>
                </ul>
              </div>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>Reality:</strong> Implementing proper accessibility for TanStack Table takes
                an experienced developer 2-4 weeks of focused work. Most teams skip it or
                half-implement it, creating legal risk and excluding users.
              </p>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faGavel} className="text-red-500" />
                  Legal Risk
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  If you ship a TanStack Table without proper accessibility, you're violating ADA,
                  Section 508, and WCAG standards. This exposes your company to lawsuits. AG Grid
                  gets sued regularly for accessibility issues—don't repeat their mistakes by
                  building it wrong yourself.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Table Deep Dive */}
        <section id="simple-table-deep-dive">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCrown} className="text-green-500" />
              Simple Table: Accessibility Built-In
            </h2>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Simple Table was designed with accessibility as a first-class feature, not an
              afterthought. Here's what you get automatically:
            </p>

            <div className="space-y-6">
              {/* Keyboard Navigation */}
              <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faKeyboard} className="text-blue-500" />
                  Complete Keyboard Navigation (Zero Config)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    <div className="font-semibold mb-2">Navigation:</div>
                    <ul className="space-y-1">
                      <li>• Arrow keys: Move between cells</li>
                      <li>• Home/End: Jump to edges</li>
                      <li>• Page Up/Down: Scroll pages</li>
                      <li>• Ctrl+Home: First cell</li>
                      <li>• Ctrl+End: Last cell</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold mb-2">Interaction:</div>
                    <ul className="space-y-1">
                      <li>• Enter: Sort column / Edit cell</li>
                      <li>• Space: Select row / Toggle checkbox</li>
                      <li>• Escape: Cancel edit / Close modal</li>
                      <li>• Tab: Focus interactive elements</li>
                      <li>• Shift+Tab: Reverse tab order</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Screen Reader */}
              <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faEye} className="text-green-500" />
                  Screen Reader Excellence
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Tested extensively with VoiceOver, NVDA, and JAWS. Here's what screen reader users
                  hear:
                </p>
                <div className="bg-white dark:bg-gray-800 rounded p-4 border border-green-300 dark:border-green-700 text-sm">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Example announcement:</strong>
                  </p>
                  <p className="font-mono text-xs text-gray-600 dark:text-gray-400 italic">
                    "Data table with 100 rows and 5 columns. Row 1 of 100. Name column, sorted
                    ascending. John Smith. Age column, 28. Location column, New York."
                  </p>
                </div>
              </div>

              {/* Visual Design */}
              <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-6 bg-purple-50 dark:bg-purple-900/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faHandPointer} className="text-purple-500" />
                  Visual Design for All Users
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-purple-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>WCAG AAA contrast:</strong> 7:1 for text (exceeds 4.5:1 requirement)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-purple-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Visible focus:</strong> 3px blue outline with 3:1 contrast ratio
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-purple-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Touch targets:</strong> 48×48px minimum (exceeds 44px requirement)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-purple-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>High contrast mode:</strong> Works in Windows High Contrast and macOS
                      Increase Contrast
                    </span>
                  </li>
                </ul>
              </div>

              {/* Mobile */}
              <div className="border border-orange-200 dark:border-orange-700 rounded-lg p-6 bg-orange-50 dark:bg-orange-900/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faMobileAlt} className="text-orange-500" />
                  Mobile-First Accessibility
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-orange-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Touch-optimized:</strong> Large tap targets, swipe to scroll
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-orange-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Responsive:</strong> Adapts to any screen size without horizontal
                      scroll
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-orange-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>Zoom support:</strong> Works perfectly at 200% zoom
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-orange-500 mt-1 flex-shrink-0"
                    />
                    <span>
                      <strong>VoiceOver/TalkBack:</strong> Full mobile screen reader support
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border-2 border-green-300 dark:border-green-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faTrophy} className="text-green-500" />
                Accessibility Testing: Simple Table Scores 100/100
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Simple Table achieves perfect scores in automated accessibility testing:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                <div className="bg-white dark:bg-gray-800 rounded p-4 border border-green-300 dark:border-green-700">
                  <div className="font-bold text-gray-900 dark:text-gray-100 mb-1">Lighthouse</div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">100</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Accessibility score
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded p-4 border border-green-300 dark:border-green-700">
                  <div className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                    axe DevTools
                  </div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">0</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Violations found</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded p-4 border border-green-300 dark:border-green-700">
                  <div className="font-bold text-gray-900 dark:text-gray-100 mb-1">WAVE</div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">✓</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">WCAG 2.1 AAA</div>
                </div>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Try it yourself with{" "}
                <Link
                  href="/docs/cell-highlighting"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  keyboard navigation
                </Link>{" "}
                or explore{" "}
                <Link
                  href="/blog/mobile-compatibility-react-tables"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  mobile accessibility features
                </Link>
                .
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-purple-500" />
              The Verdict: Accessibility Should Be Default, Not Optional
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                When it comes to accessibility, the choice is clear: libraries that build it in from
                the start will always be more accessible than those that leave it to developers.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-red-200 dark:border-red-700 rounded-lg p-6 bg-red-50 dark:bg-red-900/20">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
                    The Accessibility Problem with TanStack
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    TanStack Table is a fantastic library for logic, but accessibility requires
                    expertise that most teams don't have. Unless you have a dedicated accessibility
                    specialist, you'll ship an inaccessible table and create legal risk.
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    Why Simple Table Gets It Right
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Simple Table makes accessibility automatic. You install it, and you're already
                    compliant with WCAG 2.1 AA (and mostly AAA). No expertise required. No legal
                    risk. No excluded users.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border-2 border-green-300 dark:border-green-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Bottom Line: Choose Accessible by Default
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you care about accessibility (and you should—legally and morally), choose a
                  library that builds it in. Simple Table, MUI X Data Grid, and React Data Grid all
                  provide good baseline accessibility. TanStack requires you to build it yourself,
                  which few teams do well.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>For most teams:</strong> Simple Table offers the best combination of
                  accessibility, performance, and ease of use. It's accessible by default, MIT
                  licensed, and requires zero accessibility expertise to use correctly.
                </p>
                <div className="flex gap-3 flex-wrap text-sm">
                  <Link
                    href="/comparisons/simple-table-vs-tanstack"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    → Compare with TanStack Table
                  </Link>
                  <Link
                    href="/blog/react-data-grid-bundle-size-comparison"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    → Bundle size comparison
                  </Link>
                  <Link
                    href="/docs/themes"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    → Accessible themes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Ship accessible tables without the accessibility expertise."
        description="Simple Table is built with WCAG 2.1 AAA compliance, keyboard navigation, screen reader support, and mobile optimization—all built-in. FREE tier includes all accessibility features. Optional PRO plan ($85/mo) for priority support. Zero configuration. Zero accessibility debt."
        primaryButton={{
          text: "Start Free",
          href: "/docs/installation",
        }}
        secondaryButton={{
          text: "Test Keyboard Navigation Live",
          href: "/examples/crm",
        }}
      />
    </BlogLayout>
  );
}
