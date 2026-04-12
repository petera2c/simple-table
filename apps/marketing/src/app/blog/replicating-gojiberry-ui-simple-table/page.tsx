import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPalette,
  faMagic,
  faCheckCircle,
  faRocket,
  faCode,
  faLightbulb,
  faBolt,
  faLayerGroup,
  faEye,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import CodeBlock from "@/components/CodeBlock";
import ExampleLink from "@/components/ExampleLink";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.replicatingGojiberryUI.title,
  description: SEO_STRINGS.blogPosts.replicatingGojiberryUI.description,
  keywords: SEO_STRINGS.blogPosts.replicatingGojiberryUI.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.replicatingGojiberryUI.title,
    description: SEO_STRINGS.blogPosts.replicatingGojiberryUI.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.replicatingGojiberryUI.title,
    description: SEO_STRINGS.blogPosts.replicatingGojiberryUI.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/replicating-gojiberry-ui-simple-table",
  },
};

export default function ReplicatingGojiberryUIPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Replicating Gojiberry's Beautiful UI with Simple Table: The Ultimate Customization
          Showcase
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faPalette} />
            Customization
          </span>
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faMagic} />
            UI Replication
          </span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faRocket} />
            Design System
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Can a data grid library truly handle any design? We put Simple Table to the test by
          replicating Gojiberry's stunning CRM interface—pixel-perfect avatars, custom renderers,
          interactive components, and all. Spoiler: It worked beautifully.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8">
        {/* Introduction Section */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                If you've seen <strong>Gojiberry</strong>, you know why it stands out. Their CRM
                tool doesn't just organize leads—it makes data management feel delightful. The
                interface is polished, modern, and thoughtfully designed. At the heart of it? A
                beautifully customized table that displays contacts with rich visual elements:
                circular avatars with gradients, LinkedIn badges, interactive email enrichment
                buttons, custom pagination, and so much more.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                When most developers see a design like this, they assume they'll need to build
                everything from scratch or hack together multiple libraries. But what if you didn't
                have to?
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                We took on a challenge: <strong>replicate Gojiberry's table UI exactly</strong>{" "}
                using Simple Table. No workarounds, no "close enough"—pixel-perfect recreation. The
                result? A complete, production-ready implementation that showcases just how flexible
                Simple Table truly is.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Try it yourself:</strong> Check out our{" "}
                  <ExampleLink
                    href="/examples/crm"
                    className="text-blue-600 dark:text-blue-400 underline font-medium"
                  >
                    live CRM example
                  </ExampleLink>{" "}
                  to see the Gojiberry-inspired table in action, complete with all interactive
                  features.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Gojiberry's UI Special */}
        <section id="what-makes-it-special">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faEye} className="text-orange-500" />
              What Makes Gojiberry's UI Special
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Gojiberry's table isn't your typical boring data grid. It's packed with custom UI
                elements that make it feel like a premium application:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-orange-200 dark:border-orange-700 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-orange-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Rich Contact Cards
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Each row displays a contact with a gradient avatar, name (clickable link), job
                    title, company name, and LinkedIn integration badge—all in a compact, visually
                    appealing layout.
                  </p>
                </div>

                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Interactive Elements
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Email enrichment buttons that trigger loading states, "Fit" toggle buttons with
                    three states, clickable list tags, and "Contact Now" CTAs—all inline with the
                    data.
                  </p>
                </div>

                <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-purple-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      AI Scoring System
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    A creative visual representation of AI scores using fire emojis (🔥) that
                    instantly communicates lead quality at a glance.
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Custom Pagination
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    A fully custom footer with elegant page navigation, row counters, and a "rows
                    per page" selector—all styled to match the brand perfectly.
                  </p>
                </div>
              </div>

              <p className="mt-6 text-gray-700 dark:text-gray-300">
                These aren't just nice-to-haves—they're what make the interface feel alive and
                purposeful. And replicating them requires a table library with serious customization
                power.
              </p>
            </div>
          </div>
        </section>

        {/* The Challenge Section */}
        <section id="the-challenge">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faMagic} className="text-purple-500" />
              The Challenge: Can Simple Table Handle This?
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Most table libraries fall into one of two categories:
              </p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Category 1: Feature-Rich but Rigid
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Some libraries provide tons of features but lock you into their design system.
                  Want a custom cell with a gradient avatar and three lines of text? Good luck
                  fighting with their cell renderers and CSS overrides. Custom pagination footer?
                  You'll be deep in their API docs trying to piece together configuration flags.
                </p>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    <strong>Verdict:</strong> These libraries would require extensive workarounds
                    and CSS hacks. The result? Code that's brittle and hard to maintain.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Category 2: Headless "Build Everything" Libraries
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  TanStack Table gives you complete control, but at what cost? You'd need to build
                  the entire table structure, manage layouts, implement column resizing, handle
                  virtualization, create the pagination logic, and more. For a UI like Gojiberry's,
                  you're looking at hundreds of lines just to get the basics working before you even
                  start customizing.
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-amber-700 dark:text-amber-300 text-sm">
                    <strong>Verdict:</strong> While technically possible, you'd spend days building
                    table infrastructure instead of focusing on your UI.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Enter Simple Table
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Simple Table sits in the sweet spot: it provides all the essential table
                  functionality out of the box (sorting, filtering, resizing, pagination, row
                  selection), but exposes powerful customization points through render props. You
                  get the structure and logic handled for you, but{" "}
                  <strong>complete visual control</strong> where it matters.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Built It Section */}
        <section id="how-we-built-it">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-blue-500" />
              How We Built It: Breaking Down the Implementation
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Let's walk through the key parts of replicating Gojiberry's UI with Simple Table:
              </p>

              {/* Custom Contact Cell */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FontAwesomeIcon icon={faPalette} className="text-orange-500" />
                  1. Rich Contact Cards with Avatars
                </h3>

                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  The contact cell is the star of the show. It includes a gradient avatar, clickable
                  name, LinkedIn badge, job title, and company. Here's how we did it with Simple
                  Table's{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                    cellRenderer
                  </code>
                  :
                </p>

                <CodeBlock
                  className="mb-4"
                  code={`{
  accessor: "name",
  label: "CONTACT",
  width: 290,
  cellRenderer: ({ row }) => {
    const initials = row.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Gradient Avatar */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(to right, #ff6b6b, #ee5a6f)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {initials}
        </div>
        
        {/* Contact Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#0077b5" }}>
              {row.name}
            </span>
            {row.linkedin && <LinkedInIcon />}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            {row.title}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            @ {row.company}
          </div>
        </div>
      </div>
    );
  },
}`}
                />

                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Key insight:</strong> Simple Table's{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                      cellRenderer
                    </code>{" "}
                    gives you complete control. It's just React—no special syntax, no limitations.
                    Style it however you want.
                  </p>
                </div>
              </div>

              {/* Interactive Email Button */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBolt} className="text-blue-500" />
                  2. Interactive Email Enrichment
                </h3>

                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  The email column has three states: "Enrich" (clickable), "Enriching..." (loading),
                  and the enriched email. This required state management within the cell renderer:
                </p>

                <CodeBlock
                  className="mb-4"
                  code={`const EmailEnrich = ({ rowId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(null);

  const handleClick = () => {
    if (isLoading || email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setEmail(generateRandomEmail());
      setIsLoading(false);
    }, 2000);
  };

  if (email) {
    return <span className="email-badge">{email}</span>;
  }

  if (isLoading) {
    return (
      <span className="email-badge">
        <Spinner />
        Enriching...
      </span>
    );
  }

  return (
    <span onClick={handleClick} className="enrich-button">
      Enrich
    </span>
  );
};

// In the column definition
{
  accessor: "emailStatus",
  label: "EMAIL",
  cellRenderer: ({ row }) => <EmailEnrich rowId={row.id} />
}`}
                />

                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>The power:</strong> Each cell can be a fully interactive React component
                    with its own state, effects, and logic. Simple Table doesn't constrain you—it
                    just provides the row data and gets out of your way.
                  </p>
                </div>
              </div>

              {/* Fit Buttons */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FontAwesomeIcon icon={faLayerGroup} className="text-purple-500" />
                  3. Multi-State Toggle Buttons
                </h3>

                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  The "Fit" column has three connected buttons (✓, ?, X) where clicking one toggles
                  its active state:
                </p>

                <CodeBlock
                  className="mb-4"
                  code={`const FitButtons = ({ rowId }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <button
        onClick={() => setSelected(selected === "fit" ? null : "fit")}
        style={{
          backgroundColor: selected === "fit" ? "#86efac" : "#e5e7eb",
          borderRadius: "6px 0 0 6px",
          // ... other styles
        }}
      >
        ✓
      </button>
      <button
        onClick={() => setSelected(selected === "partial" ? null : "partial")}
        style={{
          backgroundColor: selected === "partial" ? "#cbd5e1" : "#f3f4f6",
          // ... other styles
        }}
      >
        ?
      </button>
      <button
        onClick={() => setSelected(selected === "no" ? null : "no")}
        style={{
          backgroundColor: selected === "no" ? "#fca5a5" : "#fee2e2",
          borderRadius: "0 6px 6px 0",
          // ... other styles
        }}
      >
        X
      </button>
    </div>
  );
};`}
                />
              </div>

              {/* Custom Footer */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCopy} className="text-green-500" />
                  4. Custom Pagination Footer
                </h3>

                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  The footer is where Simple Table's{" "}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                    footerRenderer
                  </code>{" "}
                  really shines. Gojiberry's pagination has page buttons, row counters, and a "rows
                  per page" dropdown—all custom styled:
                </p>

                <CodeBlock
                  className="mb-4"
                  code={`<SimpleTable
  // ... other props
  footerRenderer={({
    currentPage,
    totalPages,
    startRow,
    endRow,
    totalRows,
    onPrevPage,
    onNextPage,
    onPageChange,
    hasPrevPage,
    hasNextPage,
  }) => (
    <div className="custom-footer">
      {/* Row info */}
      <p>
        Showing <span>{startRow}</span> to <span>{endRow}</span> of{" "}
        <span>{totalRows}</span> results
      </p>

      {/* Controls */}
      <div className="footer-controls">
        {/* Rows per page selector */}
        <select onChange={handleRowsPerPageChange}>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>

        {/* Page buttons */}
        <nav className="pagination">
          <button onClick={onPrevPage} disabled={!hasPrevPage}>
            ‹
          </button>
          
          {visiblePages.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </button>
          ))}
          
          <button onClick={onNextPage} disabled={!hasNextPage}>
            ›
          </button>
        </nav>
      </div>
    </div>
  )}
/>`}
                />

                <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-400 dark:border-purple-700 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>The magic:</strong> Simple Table handles all the pagination
                    logic—calculating pages, slicing data, managing state. You just render the UI.
                    No rebuilding the wheel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Result Section */}
        <section id="the-result">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              The Result: Pixel-Perfect Replication
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                The final implementation isn't just close—it's <strong>exactly</strong> what we
                wanted. Every detail from Gojiberry's design is there:
              </p>

              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Rich visual components:</strong> Gradient avatars, badges, icons—all
                    rendering perfectly
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Full interactivity:</strong> Loading states, toggle buttons, clickable
                    elements—everything works
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Custom pagination:</strong> Styled footer with all the controls we
                    needed
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>All table features intact:</strong> Column resizing, reordering, row
                    selection, sorting—everything still works
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  <span>
                    <strong>Dark mode support:</strong> The entire theme adapts beautifully to light
                    and dark modes
                  </span>
                </li>
              </ul>

              <div className="bg-linear-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  See It Live
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Don't take our word for it. Experience the Gojiberry-inspired table yourself.
                  Resize columns, enrich emails, toggle buttons, navigate pages—it all works.
                </p>
                <ExampleLink
                  href="/examples/crm"
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  View Live CRM Example
                </ExampleLink>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Matters Section */}
        <section id="why-this-matters">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-blue-500" />
              Why This Matters for Your Projects
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                This isn't just about replicating one specific UI. It's about what it demonstrates:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <FontAwesomeIcon icon={faPalette} className="text-blue-500 text-lg" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                      Design Freedom
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    If Simple Table can replicate Gojiberry's intricate UI, it can handle{" "}
                    <strong>your</strong> design system. Whether you're matching a Figma mockup,
                    following Material Design, or building something completely custom—Simple Table
                    won't hold you back.
                  </p>
                </div>

                <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <FontAwesomeIcon icon={faBolt} className="text-green-500 text-lg" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                      Speed & Efficiency
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    We built this entire implementation in a fraction of the time it would take with
                    other approaches. No fighting with CSS. No rebuilding core functionality. Just
                    focused customization where it counts.
                  </p>
                </div>

                <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <FontAwesomeIcon icon={faCode} className="text-purple-500 text-lg" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                      Maintainable Code
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    The code is clean, readable, and organized. Custom components are just React
                    components. Styling is straightforward. No magic, no hacks—just good patterns
                    that scale.
                  </p>
                </div>

                <div className="border border-orange-200 dark:border-orange-700 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <FontAwesomeIcon icon={faRocket} className="text-orange-500 text-lg" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                      Production Ready
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    This isn't a proof of concept. It's a production-quality implementation with
                    proper state management, error handling, accessibility considerations, and
                    responsive design.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section id="getting-started">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-green-500" />
              Build Your Own Custom Table
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Ready to create your own beautifully customized table? Here's how to get started:
              </p>

              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                1. Install Simple Table
              </h3>

              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Follow the{" "}
                <Link
                  href="/docs/installation"
                  className="text-blue-600 dark:text-blue-400 underline font-medium"
                >
                  installation guide
                </Link>{" "}
                to add Simple Table to your project.
              </p>

              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                2. Start with Custom Cell Renderers
              </h3>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                The key to beautiful customization is the{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">
                  cellRenderer
                </code>{" "}
                prop. Create a component that renders your cell exactly how you want:
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable } from "@simple-table/react";

const headers = [
  {
    accessor: "user",
    label: "User",
    cellRenderer: ({ row }) => (
      <div className="flex items-center gap-3">
        <img src={row.avatar} className="w-10 h-10 rounded-full" />
        <div>
          <div className="font-semibold">{row.name}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      </div>
    ),
  },
  // ... more columns
];

<SimpleTable 
  defaultHeaders={headers}
  rows={data}
  
/>`}
              />

              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                3. Add Custom Footer (Optional)
              </h3>

              <CodeBlock
                className="mb-6"
                code={`<SimpleTable
  defaultHeaders={headers}
  rows={data}
  
  shouldPaginate={true}
  footerRenderer={(props) => <MyCustomFooter {...props} />}
/>`}
              />

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Pro tip:</strong> Check out our{" "}
                  <ExampleLink
                    href="/examples/crm"
                    className="text-blue-600 dark:text-blue-400 underline font-medium"
                  >
                    complete CRM example source code
                  </ExampleLink>{" "}
                  to see how we built the Gojiberry-style table. Feel free to use it as a starting
                  point for your own custom designs!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion Section */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faMagic} className="text-purple-500" />
              The Bottom Line
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Gojiberry's table isn't just beautiful—it's functional, intuitive, and purpose-built
                for their use case. Replicating it wasn't about copying their design; it was about
                proving that <strong>Simple Table can handle any design</strong>.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Whether you're building a CRM, an analytics dashboard, an e-commerce admin panel, or
                anything in between—your table can look and feel exactly how you want it to. No
                compromises. No workarounds. Just powerful customization built on solid foundations.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Ready to build your own custom table?"
        description="Simple Table gives you the flexibility to replicate any design—from Gojiberry's elegant CRM to your own unique vision. Start building beautiful, functional tables today."
        primaryButton={{
          text: "View CRM Example",
          href: "/examples/crm",
        }}
        secondaryButton={{
          text: "Get Started",
          href: "/docs/quick-start",
        }}
      />
    </BlogLayout>
  );
}
