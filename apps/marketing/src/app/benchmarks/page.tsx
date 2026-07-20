import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { BUNDLE_BENCHMARK_ROWS, BENCHMARK_METHODOLOGY } from "@/constants/benchmarks";
import { SIMPLE_TABLE_INFO } from "@/constants/packageInfo";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "antd";

export const metadata: Metadata = {
  title: SEO_STRINGS.benchmarks.title,
  description: SEO_STRINGS.benchmarks.description,
  keywords: SEO_STRINGS.benchmarks.keywords,
  openGraph: {
    title: SEO_STRINGS.benchmarks.title,
    description: SEO_STRINGS.benchmarks.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.benchmarks.title,
    description: SEO_STRINGS.benchmarks.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/benchmarks",
  },
};

export default function BenchmarksPage() {
  const maxKB = Math.max(...BUNDLE_BENCHMARK_ROWS.map((row) => row.sizeKB));

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-12">
          <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Reproducible benchmarks
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Data Grid Bundle Size & Performance
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4">
            Simple Table ships a full grid in {SIMPLE_TABLE_INFO.bundleSizeMinGzip}. Compare that to
            AG Grid, TanStack Table, and Handsontable — with methodology you can re-run.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last reviewed {BENCHMARK_METHODOLOGY.lastReviewed}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Bundle size (minified + gzipped)
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {BENCHMARK_METHODOLOGY.bundleSource}
          </p>

          <div className="space-y-4 mb-8">
            {BUNDLE_BENCHMARK_ROWS.map((row) => (
              <div
                key={row.library}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{row.library}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{row.packageName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {row.sizeLabel}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{row.pricingNote}</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.max(4, (row.sizeKB / maxKB) * 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{row.notes}</p>
                <a
                  href={row.bundlePhobiaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Verify on Bundlephobia →
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Large-row scroll guidance
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {BENCHMARK_METHODOLOGY.scrollGuidance}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li>
              Read the walkthrough:{" "}
              <Link
                href="/blog/handling-one-million-rows"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Handling one million rows
              </Link>
            </li>
            <li>
              Compare features:{" "}
              <Link
                href="/comparisons/simple-table-vs-ag-grid"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Simple Table vs AG Grid
              </Link>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How to reproduce
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            {BENCHMARK_METHODOLOGY.reproduceSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Prefer a smaller grid bill and bundle?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Install Simple Table free for pre-revenue use, or see Pro pricing when your product
            earns revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/docs/installation">
              <Button type="primary" size="large">
                Install from docs
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="large">View pricing</Button>
            </Link>
            <Link href="/case-studies">
              <Button size="large">Case studies</Button>
            </Link>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
