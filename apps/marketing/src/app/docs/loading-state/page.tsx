import { Metadata } from "next";
import LoadingStateContent from "@/components/pages/docs-pages/LoadingStateContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.loadingState.title,
  description: SEO_STRINGS.loadingState.description,
  keywords: SEO_STRINGS.loadingState.keywords,
  openGraph: {
    title: SEO_STRINGS.loadingState.title,
    description: SEO_STRINGS.loadingState.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.loadingState.title,
    description: SEO_STRINGS.loadingState.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/loading-state",
  },
};

const LoadingStatePage = () => {
  return <LoadingStateContent />;
};

export default LoadingStatePage;
