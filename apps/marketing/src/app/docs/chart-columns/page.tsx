import React from "react";
import { Metadata } from "next";
import ChartColumnsContent from "@/components/pages/docs-pages/ChartColumnsContent";
import DocsDemoCode from "@/components/DocsDemoCode";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.chartColumns.title,
  description: SEO_STRINGS.chartColumns.description,
  keywords: SEO_STRINGS.chartColumns.keywords,
  openGraph: {
    title: SEO_STRINGS.chartColumns.title,
    description: SEO_STRINGS.chartColumns.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.chartColumns.title,
    description: SEO_STRINGS.chartColumns.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/chart-columns",
  },
};

export default function ChartColumnsPage() {
  return (
    <DocsDemoCode slug="chart-columns">
      <ChartColumnsContent />
    </DocsDemoCode>
  );
}
