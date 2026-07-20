import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { CASE_STUDIES } from "@/constants/caseStudies";
import PageWrapper from "@/components/PageWrapper";

export const metadata: Metadata = {
  title: SEO_STRINGS.caseStudies.index.title,
  description: SEO_STRINGS.caseStudies.index.description,
  keywords: SEO_STRINGS.caseStudies.index.keywords,
  openGraph: {
    title: SEO_STRINGS.caseStudies.index.title,
    description: SEO_STRINGS.caseStudies.index.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.caseStudies.index.title,
    description: SEO_STRINGS.caseStudies.index.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/case-studies",
  },
};

export default function CaseStudiesIndexPage() {
  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Case Studies
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            How real teams evaluate Simple Table against AG Grid and other data grids.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          {CASE_STUDIES.map((study) => (
            <Link
              key={study.slug}
              href={study.href}
              className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-2">
                Customer story
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {study.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{study.summary}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {study.highlightStat}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {study.highlightLabel}
                </span>
              </div>
              <span className="inline-block mt-4 text-blue-600 dark:text-blue-400 font-medium text-sm">
                Read case study →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
