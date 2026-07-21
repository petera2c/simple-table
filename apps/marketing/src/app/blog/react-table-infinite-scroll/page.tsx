import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfinity,
  faCheckCircle,
  faLightbulb,
  faCode,
  faServer,
  faRocket,
  faBolt,
  faGaugeHigh,
  faArrowsUpDown,
  faTriangleExclamation,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import CodeBlock from "@/components/CodeBlock";
import InfiniteScrollDemoWrapper from "@/components/blog/InfiniteScrollDemoWrapper";
import Link from "next/link";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.reactTableInfiniteScroll.title,
  description: SEO_STRINGS.blogPosts.reactTableInfiniteScroll.description,
  keywords: SEO_STRINGS.blogPosts.reactTableInfiniteScroll.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.reactTableInfiniteScroll.title,
    description: SEO_STRINGS.blogPosts.reactTableInfiniteScroll.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.reactTableInfiniteScroll.title,
    description: SEO_STRINGS.blogPosts.reactTableInfiniteScroll.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/react-table-infinite-scroll",
  },
};

export default function ReactTableInfiniteScrollPage() {
  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-purple-50 to-indigo-50 dark:from-purple-900 dark:to-indigo-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          React Table Infinite Scroll & Lazy Loading: Complete Guide
        </h1>

        <div className="flex justify-center mb-4 gap-2 flex-wrap">
          <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faInfinity} />
            Infinite Scroll
          </span>
          <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faGaugeHigh} />
            Performance
          </span>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCode} />
            Tutorial
          </span>
        </div>

        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Loading 50,000 rows at once kills performance and overwhelms users. Learn how to load data
          progressively in React data grids—infinite scroll with <code>onLoadMore</code>, window vs
          container scrolling, row virtualization, and server-side pagination—with production-ready
          code.
        </p>
      </section>

      {/* Main Content */}
      <article className="space-y-8 mb-8">
        {/* Introduction */}
        <section id="introduction">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                You have 100,000 orders to display. Fetch them all up front and you ship a
                multi-megabyte payload, freeze the main thread parsing JSON, and render tens of
                thousands of DOM nodes the user will never scroll to. The page feels broken before it
                even finishes loading.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                <strong>The fix is to load data progressively.</strong> Instead of everything at
                once, you fetch a first slice, then load more as the user scrolls toward the bottom.
                Combined with row virtualization, the browser only ever holds a manageable number of
                rows in the DOM—so the grid stays smooth whether you have 200 rows or 2 million.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                In this guide we cover three distinct patterns and exactly when to reach for each:
                client-side infinite scroll (append rows on scroll), server-side pagination
                (page-by-page), and lazy-loaded grouped children. Every example uses{" "}
                <Link
                  href="/docs/infinite-scroll"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Simple Table
                </Link>
                , a free, source-available React data grid with these features built in.
              </p>
            </div>
          </div>
        </section>

        {/* Live Demo */}
        <section id="live-demo">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faInfinity} className="text-purple-500" />
              See It In Action
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                Scroll to the bottom of the table below. As you approach the end, the grid calls{" "}
                <code>onLoadMore</code>, fetches the next batch, and appends it seamlessly—until
                there is no more data to load.
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <InfiniteScrollDemoWrapper height="400px" />
            </div>
          </div>
        </section>

        {/* Choosing the right pattern */}
        <section id="which-pattern">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-500" />
              Infinite Scroll vs Server-Side Pagination
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Both patterns avoid loading everything up front, but they create very different user
                experiences. Pick based on how your users work with the data.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-6 bg-purple-50 dark:bg-purple-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faInfinity} className="text-purple-500" />
                    Infinite Scroll
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Append more rows as the user scrolls. One continuous list.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faThumbsUp} />
                      Best for
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>
                        • <strong>Browsing / exploration:</strong> feeds, logs, activity streams
                      </li>
                      <li>
                        • <strong>Continuous scanning:</strong> users skim downward
                      </li>
                      <li>
                        • <strong>Mobile-friendly UX:</strong> no tiny page controls to tap
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faThumbsDown} />
                      Watch out
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>
                        • <strong>No stable "page 7":</strong> harder to deep-link a position
                      </li>
                      <li>
                        • <strong>Memory grows:</strong> rows accumulate in state over time
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faServer} className="text-blue-500" />
                    Server-Side Pagination
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Fetch one page at a time. The server owns slicing and the total count.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faThumbsUp} />
                      Best for
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>
                        • <strong>Record management:</strong> admin tables, dashboards
                      </li>
                      <li>
                        • <strong>Shareable position:</strong> "page 7" is a real URL
                      </li>
                      <li>
                        • <strong>Bounded memory:</strong> only the current page is held
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faThumbsDown} />
                      Watch out
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>
                        • <strong>More clicks:</strong> users page through manually
                      </li>
                      <li>
                        • <strong>Needs a total count:</strong> server must return it
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Rule of thumb:</strong> use infinite scroll when users <em>browse</em>{" "}
                  (feeds, logs, search results) and server-side pagination when users{" "}
                  <em>manage records</em> (CRMs, admin panels). Both rely on row virtualization under
                  the hood so the DOM stays small.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Client-side infinite scroll */}
        <section id="client-side-infinite-scroll">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faCode} className="text-blue-500" />
              Infinite Scroll with onLoadMore
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Simple Table fires <code>onLoadMore</code> when the user scrolls within{" "}
                <code>infiniteScrollThreshold</code> pixels of the bottom (200px by default). The
                table doesn't fetch or store data for you—you own that. Your job is three steps:
              </p>

              <ol className="list-decimal pl-5 mb-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>Give the table a scroll container</strong> via{" "}
                  <code>height</code> (or <code>maxHeight</code>), which also enables virtualization.
                </li>
                <li>
                  <strong>Implement <code>onLoadMore</code></strong> to fetch the next batch.
                </li>
                <li>
                  <strong>Append the new rows</strong> to your existing array in state.
                </li>
              </ol>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable, ColumnDef } from "@simple-table/react";
import { useState, useRef, useCallback } from "react";
import "@simple-table/react/styles.css";

const headers: ColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: "1fr", type: "string" },
  { accessor: "email", label: "Email", width: "1fr", type: "string" },
  { accessor: "status", label: "Status", width: 120, type: "string" },
];

export default function OrdersTable() {
  const [rows, setRows] = useState(() => fetchPage(0));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Synchronous re-entry guard. The \`loading\` state alone can't block
  // back-to-back calls: between setLoading(true) and React's next commit,
  // the callback the table holds still sees loading=false in its closure,
  // so multiple scroll ticks would slip through.
  const loadingRef = useRef(false);

  const handleLoadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const next = await fetchPageFromApi(/* offset */ undefined);
      if (next.length === 0) {
        setHasMore(false);
        return;
      }
      // Append to the live previous value so concurrent ticks can't duplicate.
      setRows((prev) => [...prev, ...next]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [hasMore]);

  return (
    <div>
      <SimpleTable
        columns={headers}
        rows={rows}
        height="600px"            // scroll container + virtualization
        onLoadMore={handleLoadMore}
        infiniteScrollThreshold={300} // pre-fetch a little earlier
      />

      {loading && <div className="py-2 text-center text-sm">Loading more…</div>}
      {!hasMore && <div className="py-2 text-center text-sm">All rows loaded</div>}
    </div>
  );
}`}
              />

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-700 p-4 rounded-lg mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>The two bugs everyone hits:</strong> (1) a stale closure lets multiple
                  scroll ticks fire <code>onLoadMore</code> before your <code>loading</code> state
                  commits—use a synchronous <code>useRef</code> guard. (2) Computing the next batch
                  from a stale variable instead of the <code>prev</code> value inside{" "}
                  <code>setRows</code> produces duplicate rows. Both are solved above.
                </p>
              </div>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Notice the loading spinner and the "all rows loaded" message live{" "}
                <em>outside</em> <code>&lt;SimpleTable&gt;</code>. The grid intentionally doesn't
                render this UI for you, so you keep full control over copy, placement, and skeletons.
              </p>
            </div>
          </div>
        </section>

        {/* Scroll modes */}
        <section id="scroll-modes">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faArrowsUpDown} className="text-indigo-500" />
              Container Scroll vs Window Scroll
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                There are two ways to give the table a scroll context. They are mutually
                exclusive—and one of them is the most common real-app layout.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                1. Inner (container) scroll with <code>height</code>
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Set <code>height</code> or <code>maxHeight</code> and the table's own body scrolls
                inside that fixed box. This is what the example above uses. Best when the table sits
                in a panel or modal with a defined size.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                2. Page scroll with <code>scrollParent="window"</code>
              </h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Want the table to grow to its natural height and let the page scroll—like a normal
                article section? Drop <code>height</code>/<code>maxHeight</code> and pass{" "}
                <code>scrollParent</code>. The window's scroll position then drives both
                virtualization and <code>onLoadMore</code>.
              </p>

              <CodeBlock
                className="mb-6"
                code={`// Page-level scroll (most common in real apps)
<SimpleTable
  columns={headers}
  rows={rows}
  scrollParent="window"
  onLoadMore={handleLoadMore}
/>

// Or a custom overflow container (e.g. a side panel)
<SimpleTable
  columns={headers}
  rows={rows}
  scrollParent={() => containerRef.current}
  onLoadMore={handleLoadMore}
/>`}
              />

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                In window/external scroll mode the table also:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li>
                  <strong>Virtualizes against the parent</strong>—only rows in the parent's viewport
                  render, even with tens of thousands of rows.
                </li>
                <li>
                  <strong>Pins the header automatically</strong> with{" "}
                  <code>position: sticky</code> so it stays visible as you scroll.
                </li>
                <li>
                  <strong>Suppresses overscroll bounce</strong> on the scroll parent so the sticky
                  header doesn't visually shift (restored on unmount).
                </li>
                <li>
                  Honors <code>enableStickyParents</code> for grouped rows, and reads the parent's{" "}
                  <code>padding-top</code> to pin the header flush.
                </li>
              </ul>

              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-700 p-4 rounded-lg mb-2">
                <p className="text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500" />
                  <strong>Precedence & the no-virtualization trap</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li>
                    <code>height</code>/<code>maxHeight</code> always win. If either is set,{" "}
                    <code>scrollParent</code> is ignored.
                  </li>
                  <li>
                    With <strong>no</strong> <code>height</code>/<code>maxHeight</code> and{" "}
                    <strong>no</strong> <code>scrollParent</code>, the table renders every row—no
                    virtualization and <code>onLoadMore</code> never fires.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Server-side pagination */}
        <section id="server-side-pagination">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faServer} className="text-purple-500" />
              Server-Side Pagination (Lazy Loading by Page)
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                When users need stable pages instead of an endless list, use server-side pagination.
                Set <code>serverSidePagination</code> so the table stops slicing rows internally—you
                supply exactly one page of <code>rows</code>, and the table renders the footer
                controls and tells you when the page changes via <code>onPageChange</code>. Provide{" "}
                <code>totalRowCount</code> so it can compute the number of pages.
              </p>

              <CodeBlock
                className="mb-6"
                code={`import { SimpleTable, ColumnDef } from "@simple-table/react";
import { useState, useEffect } from "react";
import "@simple-table/react/styles.css";

const PAGE_SIZE = 50;

export default function ServerPaginatedTable() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(\`/api/orders?page=\${page}&limit=\${PAGE_SIZE}\`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setRows(data.rows);
        setTotal(data.total);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <SimpleTable
      columns={headers}
      rows={rows}
      height="600px"
      enablePagination
      serverSidePagination          // don't slice rows internally
      rowsPerPage={PAGE_SIZE}
      totalRowCount={total}         // lets the footer compute page count
      isLoading={loading}           // built-in skeleton during fetches
      onPageChange={(nextPage) => setPage(nextPage)}
    />
  );
}`}
              />

              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-700 p-4 rounded-lg mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Key props:</strong> <code>serverSidePagination</code> disables internal
                  slicing, <code>onPageChange</code> fires on navigation (it can return a promise),{" "}
                  <code>totalRowCount</code> drives the page count, and <code>isLoading</code> shows
                  the built-in skeleton state while each page loads.
                </p>
              </div>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Want fully custom footer UI instead of the built-in controls? See the{" "}
                <Link
                  href="/docs/pagination"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  pagination docs
                </Link>{" "}
                for the <code>footerRenderer</code> escape hatch.
              </p>
            </div>
          </div>
        </section>

        {/* Why virtualization matters */}
        <section id="virtualization">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faBolt} className="text-amber-500" />
              Why Virtualization Makes This Scale
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Infinite scroll alone isn't enough. If you append 50,000 rows and render every one,
                the DOM still grinds to a halt. The reason Simple Table stays smooth is{" "}
                <strong>row virtualization</strong>: only the rows visible in the scroll viewport
                (plus a small buffer) are mounted. Scroll down and rows are recycled, so the DOM node
                count stays roughly constant no matter how much data you load.
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Virtualization turns on automatically the moment you give the table a scroll
                context—<code>height</code>, <code>maxHeight</code>, or <code>scrollParent</code>.
                That's the same prop that enables infinite scroll, so you get both together. To see
                how far this scales, read{" "}
                <Link
                  href="/blog/handling-one-million-rows"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Handling 1,000,000 Rows with Simple Table
                </Link>
                .
              </p>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Need a refresher on sizing the scroll container? The{" "}
                <Link
                  href="/docs/row-height"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  table height docs
                </Link>{" "}
                cover fixed vs adaptive heights.
              </p>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100 text-2xl font-semibold">
              <FontAwesomeIcon icon={faRocket} className="text-green-500" />
              Key Takeaways
            </h2>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 shrink-0" />
                  <span>
                    <strong>Infinite scroll:</strong> implement <code>onLoadMore</code>, append to{" "}
                    <code>rows</code>, and tune <code>infiniteScrollThreshold</code> for earlier
                    pre-fetching.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 shrink-0" />
                  <span>
                    <strong>Guard against duplicates:</strong> use a synchronous{" "}
                    <code>useRef</code> re-entry guard and append from the <code>prev</code> value.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 shrink-0" />
                  <span>
                    <strong>Pick a scroll mode:</strong> <code>height</code> for container scroll or{" "}
                    <code>scrollParent="window"</code> for page scroll—never expect infinite scroll
                    without one of them.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 shrink-0" />
                  <span>
                    <strong>Server-side pagination</strong> via <code>serverSidePagination</code>,{" "}
                    <code>onPageChange</code>, <code>totalRowCount</code>, and <code>isLoading</code>{" "}
                    when users need stable pages.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1 shrink-0" />
                  <span>
                    <strong>Virtualization</strong> is automatic with any scroll context and is what
                    keeps the grid fast as data grows.
                  </span>
                </li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300">
                Whether you're building activity feeds, log viewers, or admin dashboards, Simple
                Table gives you progressive loading and virtualization for free—no enterprise
                license required.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Call to Action */}
      <CallToActionCard
        title="Ready to load massive datasets without the lag?"
        description="Simple Table ships infinite scroll, server-side pagination, and row virtualization out of the box. Start building fast, progressively-loaded React tables in minutes."
        primaryButton={{
          text: "View Infinite Scroll Docs",
          href: "/docs/infinite-scroll",
        }}
        secondaryButton={{
          text: "Explore Pagination",
          href: "/docs/pagination",
        }}
      />
    </BlogLayout>
  );
}
