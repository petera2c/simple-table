import { SEO_STRINGS } from "@/constants/strings/seo";
import { Metadata } from "next";
import AnalyticsExampleWrapper from "@/examples/analytics/AnalyticsExampleWrapper";

export const metadata: Metadata = {
  title: SEO_STRINGS.examples.analytics.title,
  description: SEO_STRINGS.examples.analytics.description,
  keywords: SEO_STRINGS.examples.analytics.keywords,
  openGraph: {
    title: SEO_STRINGS.examples.analytics.title,
    description: SEO_STRINGS.examples.analytics.description,
    type: "website",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.examples.analytics.title,
    description: SEO_STRINGS.examples.analytics.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/examples/analytics",
  },
};

export default function AnalyticsPage() {
  return <AnalyticsExampleWrapper enablePagination={false} />;
}
