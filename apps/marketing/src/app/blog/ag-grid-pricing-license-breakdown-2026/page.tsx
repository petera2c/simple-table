import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { SEO_STRINGS } from "@/constants/strings/seo";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";
import { TECHNICAL_STRINGS } from "@/constants/strings/technical";

export const metadata: Metadata = {
  title: SEO_STRINGS.blogPosts.agGridPricing2026.title,
  description: SEO_STRINGS.blogPosts.agGridPricing2026.description,
  keywords: SEO_STRINGS.blogPosts.agGridPricing2026.keywords,
  openGraph: {
    title: SEO_STRINGS.blogPosts.agGridPricing2026.title,
    description: SEO_STRINGS.blogPosts.agGridPricing2026.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.blogPosts.agGridPricing2026.title,
    description: SEO_STRINGS.blogPosts.agGridPricing2026.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/ag-grid-pricing-license-breakdown-2026",
  },
};

const LAST_CHECKED = "October 29, 2026";

const summaryRows: { label: string; community: string; enterprise: string; bundle: string }[] = [
  { label: "License", community: "MIT (open source)", enterprise: "Commercial EULA", bundle: "Commercial EULA" },
  { label: "List price", community: "Free", enterprise: "$999 USD per developer", bundle: "$1,498 USD per developer" },
  { label: "Billing model", community: "None", enterprise: "Perpetual licence, 1 year of support and updates included", bundle: "Perpetual licence, 1 year of support and updates included" },
  { label: "Production use", community: "Yes, free", enterprise: "Yes, with a licence", bundle: "Yes, with a licence" },
  { label: "Buy online", community: "Not needed", enterprise: "1 to 10 developers, internal apps only", bundle: "1 to 10 developers, internal apps only" },
  { label: "Customer-facing apps or 10+ developers", community: "Free", enterprise: "Contact AG Grid sales", bundle: "Contact AG Grid sales" },
  { label: "Support", community: "GitHub community", enterprise: "Zendesk support", bundle: "Zendesk support" },
  { label: "Integrated Charts", community: "No", enterprise: "No", bundle: "Yes" },
];

const featureRows: { feature: string; community: boolean; simpleTable: boolean }[] = [
  { feature: "Sorting, text/number/date filters, pagination", community: true, simpleTable: true },
  { feature: "Column pinning, resizing, reordering", community: true, simpleTable: true },
  { feature: "Cell editing", community: true, simpleTable: true },
  { feature: "CSV export", community: true, simpleTable: true },
  { feature: "Row grouping", community: false, simpleTable: true },
  { feature: "Aggregation", community: false, simpleTable: true },
  { feature: "Pivoting", community: false, simpleTable: true },
  { feature: "Tree data", community: false, simpleTable: true },
  { feature: "Excel export", community: false, simpleTable: false },
  { feature: "Set filter, Advanced filter", community: false, simpleTable: false },
  { feature: "Context menu, column menu, tool panels", community: false, simpleTable: false },
];

const th = "border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold";
const td = "border border-gray-300 dark:border-gray-600 p-3 align-top";

export default function AgGridPricingPage() {
  return (
    <BlogLayout>
      <section className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl p-4 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          AG Grid License &amp; Pricing 2026: Community vs Enterprise
        </h1>
        <p className="text-lg max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          AG Grid Community is free under MIT. AG Grid Enterprise lists at $999 per developer as a
          perpetual licence with one year of support and updates. Here is what each tier includes,
          who needs a licence, and what a team actually pays.
        </p>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-3">
          Prices checked against ag-grid.com on {LAST_CHECKED}. Always confirm on the{" "}
          <a
            href="https://www.ag-grid.com/license-pricing/"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            official AG Grid pricing page
          </a>{" "}
          before you buy.
        </p>
      </section>

      <article className="space-y-8 text-gray-700 dark:text-gray-300">
        <section id="summary">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            AG Grid pricing at a glance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className={th}></th>
                  <th className={th}>Community</th>
                  <th className={th}>Enterprise</th>
                  <th className={th}>Enterprise Bundle (Grid + Charts)</th>
                </tr>
              </thead>
              <tbody>
                {summaryRows.map((row) => (
                  <tr key={row.label}>
                    <td className={`${td} font-semibold`}>{row.label}</td>
                    <td className={td}>{row.community}</td>
                    <td className={td}>{row.enterprise}</td>
                    <td className={td}>{row.bundle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="how-licensing-works">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            How the AG Grid license works
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Community is MIT.</strong> You can use it in production for free, including in
              commercial products.
            </li>
            <li>
              <strong>Enterprise is perpetual, not a yearly subscription.</strong> You keep using the
              version you licensed. The first year of support and updates is included. Renewing is
              optional, but you need it to get new releases and continued support. AG Grid does not
              publish renewal prices.
            </li>
            <li>
              <strong>Every front-end developer on the project needs a licence</strong>, according to
              AG Grid, including developers who never touch the grid directly.
            </li>
            <li>
              <strong>Licences are per developer and per deployment.</strong> Online checkout covers
              1 to 10 developers building internal applications. Customer-facing applications and
              larger teams go through AG Grid sales, so there is no public list price for those.
            </li>
            <li>
              <strong>Enterprise is free to try locally</strong>, and AG Grid offers a 30-day trial
              for production testing.
            </li>
          </ul>
        </section>

        <section id="team-cost">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            What a team pays at list price
          </h2>
          <p className="mb-4">
            For internal apps bought online, the upfront cost is the number of front-end developers
            times the list price. Renewals for later years are extra and quoted by AG Grid.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className={th}>Front-end developers</th>
                  <th className={th}>Enterprise (upfront)</th>
                  <th className={th}>Enterprise Bundle (upfront)</th>
                </tr>
              </thead>
              <tbody>
                {[1, 3, 5, 10].map((n) => (
                  <tr key={n}>
                    <td className={td}>{n}</td>
                    <td className={td}>${(n * 999).toLocaleString("en-US")}</td>
                    <td className={td}>${(n * 1498).toLocaleString("en-US")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="community-vs-enterprise">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Which features need Enterprise?
          </h2>
          <p className="mb-4">
            AG Grid Community covers the basics well. The features most teams end up paying for are
            grouping, aggregation, pivoting, tree data, master/detail, Excel export, clipboard
            operations, range selection, and the menus and tool panels. Here is how Community
            compares with Simple Table, which is also MIT licensed.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className={th}>Feature</th>
                  <th className={th}>AG Grid Community (free)</th>
                  <th className={th}>Simple Table (free, MIT)</th>
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row) => (
                  <tr key={row.feature}>
                    <td className={td}>{row.feature}</td>
                    <td className={td}>{row.community ? "Yes" : "Enterprise only"}</td>
                    <td className={td}>{row.simpleTable ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm">
            If you rely on Excel export, set filters, or AG Grid&apos;s tool panels, Enterprise is the
            honest answer. If what you need is grouping, aggregation, pivoting, or tree data,
            Simple Table gives you those under MIT.
          </p>
        </section>

        <section id="is-it-worth-it">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Is AG Grid Enterprise worth it?
          </h2>
          <p className="mb-4">
            For a large app built around spreadsheet-style workflows, often yes. AG Grid is mature,
            well documented, and the licence is perpetual. It is harder to justify when you only need
            one or two Enterprise features, when your app is customer-facing and the price is not
            published, or when every front-end developer has to be licensed.
          </p>
          <p>
            Compare options in{" "}
            <Link href="/blog/ag-grid-alternatives-free-react-data-grids" className="text-blue-600 dark:text-blue-400 hover:underline">
              free AG Grid alternatives for React
            </Link>
            ,{" "}
            <Link href="/blog/best-angular-data-grids-2026" className="text-blue-600 dark:text-blue-400 hover:underline">
              the best Angular data grids
            </Link>
            , the{" "}
            <Link href="/comparisons/simple-table-vs-ag-grid" className="text-blue-600 dark:text-blue-400 hover:underline">
              Simple Table vs AG Grid comparison
            </Link>
            , or the{" "}
            <Link href="/blog/best-free-react-data-grid-2026" className="text-blue-600 dark:text-blue-400 hover:underline">
              best free React data grids
            </Link>
            .
          </p>
        </section>

        <section id="faq">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">FAQ</h2>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Is AG Grid free for commercial use?</h3>
          <p className="mb-4">Yes, AG Grid Community is MIT licensed and free in production. Enterprise features need a paid licence.</p>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">How much is an AG Grid Enterprise license?</h3>
          <p className="mb-4">$999 USD per developer at list price, perpetual, with one year of support and updates. The Grid + Charts bundle is $1,498 per developer.</p>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Is AG Grid Enterprise a yearly subscription?</h3>
          <p className="mb-4">No. The licence is perpetual. Renewal is optional and buys another period of updates and support.</p>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Do I need a licence for every developer?</h3>
          <p>AG Grid says all front-end developers on the project need one, even those who do not work on the grid.</p>
        </section>
      </article>

      <CallToActionCard
        location="blog_ag_grid_pricing"
        title="Need grouping, pivoting, or tree data without a licence?"
        description="Simple Table is free under the MIT license with every feature included. Pro is optional support and bug fixes. It never unlocks features."
        primaryButton={{ text: "Get started", href: "/docs/installation" }}
        secondaryButton={{ text: "Book a free call", href: TECHNICAL_STRINGS.links.calendly, external: true }}
      />
    </BlogLayout>
  );
}
