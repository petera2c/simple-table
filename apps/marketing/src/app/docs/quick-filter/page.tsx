import QuickFilterContent from "@/components/pages/docs-pages/QuickFilterContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SEO_STRINGS.quickFilter.title,
  description: SEO_STRINGS.quickFilter.description,
  keywords: SEO_STRINGS.quickFilter.keywords,
  openGraph: {
    title: SEO_STRINGS.quickFilter.title,
    description: SEO_STRINGS.quickFilter.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.quickFilter.title,
    description: SEO_STRINGS.quickFilter.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/quick-filter",
  },
};

const QuickFilterPage = () => {
  return <QuickFilterContent />;
};

export default QuickFilterPage;
