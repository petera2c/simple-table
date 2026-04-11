import { Metadata } from "next";
import EmptyStateContent from "@/components/pages/docs-pages/EmptyStateContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.emptyState.title,
  description: SEO_STRINGS.emptyState.description,
  keywords: SEO_STRINGS.emptyState.keywords,
  openGraph: {
    title: SEO_STRINGS.emptyState.title,
    description: SEO_STRINGS.emptyState.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.emptyState.title,
    description: SEO_STRINGS.emptyState.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/empty-state",
  },
};

const EmptyStatePage = () => {
  return <EmptyStateContent />;
};

export default EmptyStatePage;
