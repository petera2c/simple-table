import { Metadata } from "next";
import Link from "next/link";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { simpleTableMitLicensePost } from "@/constants/blogPosts";
import BlogLayout from "@/components/BlogLayout";
import CallToActionCard from "@/components/CallToActionCard";

export const metadata: Metadata = {
  title: simpleTableMitLicensePost.title,
  description: simpleTableMitLicensePost.description,
  keywords:
    "simple table license, simple-table mit, is simple table free, simple table community license, free data grid mit, mit licensed data grid, ag grid license alternative",
  openGraph: {
    title: simpleTableMitLicensePost.title,
    description: simpleTableMitLicensePost.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: simpleTableMitLicensePost.title,
    description: simpleTableMitLicensePost.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/blog/simple-table-is-mit-licensed",
  },
};

const linkClass = "text-blue-600 dark:text-blue-400 hover:underline font-medium";

export default function SimpleTableMitLicensePage() {
  return (
    <BlogLayout>
      <article className="space-y-8 text-gray-700 dark:text-gray-300">
        <header className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Published October 28, 2026
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {simpleTableMitLicensePost.title}
          </h1>
          <p className="text-lg">
            Starting with version 4.3.2 (released October 4, 2026), every Simple Table package is MIT licensed. That covers{" "}
            <code>simple-table-core</code> and the React, Vue, Angular, Svelte, and Solid adapters.
            You can use them in any project, including commercial products, for free.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">What changed</h2>
          <p>
            Before 4.3.2, the free plan used the Simple Table Community License. It was free for
            individuals and for companies that were not making money yet. Once a company earned
            revenue, it needed a paid plan to keep using the library.
          </p>
          <p>
            That rule is gone. The{" "}
            <Link href="/legal/license" className={linkClass}>
              MIT License
            </Link>{" "}
            applies to everyone, whatever the size of your team or company.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            What this means for you
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Every feature is free: virtualization, pinning, grouping, pivots, editing, and themes.</li>
            <li>No license key, no sign-up, and no per-developer or per-product fees.</li>
            <li>You can read, change, and redistribute the code under the MIT terms.</li>
            <li>
              If you were on Pro only to get a commercial license, you no longer need it for that.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            What paid plans are for now
          </h2>
          <p>
            Paid plans are for help, not for permission. Pro is support and bug fixes. Enterprise is
            custom help from the people who build Simple Table. Neither one unlocks features. See{" "}
            <Link href="/pricing" className={linkClass}>
              pricing
            </Link>{" "}
            for details.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">How to upgrade</h2>
          <p>
            Install or update to 4.3.2 or later. Nothing in your code needs to change. The{" "}
            <Link href="/changelog" className={linkClass}>
              changelog
            </Link>{" "}
            lists every release, and the{" "}
            <Link href="/docs/quick-start" className={linkClass}>
              Quick Start
            </Link>{" "}
            gets a table on screen in about a minute.
          </p>
          <p>
            Comparing options? See how Simple Table stacks up against{" "}
            <Link href="/comparisons/simple-table-vs-ag-grid" className={linkClass}>
              AG Grid
            </Link>
            , read the{" "}
            <Link href="/blog/ag-grid-pricing-license-breakdown-2026" className={linkClass}>
              AG Grid license breakdown
            </Link>
            , or browse the{" "}
            <Link href="/blog/best-free-react-data-grid-2026" className={linkClass}>
              best free React data grids
            </Link>
            .
          </p>
        </section>

        <CallToActionCard
          location="blog_mit_license"
          title="Try Simple Table, free under MIT"
          description="Install it with npm and render your first table in about a minute."
          primaryButton={{
            text: "Quick Start",
            href: "/docs/quick-start",
          }}
          secondaryButton={{
            text: "View pricing",
            href: "/pricing",
          }}
        />
      </article>
    </BlogLayout>
  );
}
