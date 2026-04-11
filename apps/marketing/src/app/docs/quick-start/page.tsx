import { Metadata } from "next";
import QuickStartContent from "@/components/pages/docs-pages/QuickStartContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.quickStart.title,
  description: SEO_STRINGS.quickStart.description,
  keywords: SEO_STRINGS.quickStart.keywords,
  openGraph: {
    title: SEO_STRINGS.quickStart.title,
    description: SEO_STRINGS.quickStart.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.quickStart.title,
    description: SEO_STRINGS.quickStart.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/quick-start",
  },
};

const QuickStartPage = () => {
  return <QuickStartContent />;
};

export default QuickStartPage;
