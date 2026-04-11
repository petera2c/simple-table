import { Metadata } from "next";
import CellHighlightingContent from "@/components/pages/docs-pages/CellHighlightingContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.cellHighlighting.title,
  description: SEO_STRINGS.cellHighlighting.description,
  keywords: SEO_STRINGS.cellHighlighting.keywords,
  openGraph: {
    title: SEO_STRINGS.cellHighlighting.title,
    description: SEO_STRINGS.cellHighlighting.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.cellHighlighting.title,
    description: SEO_STRINGS.cellHighlighting.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/cell-highlighting",
  },
};

const CellHighlightingPage = () => {
  return <CellHighlightingContent />;
};

export default CellHighlightingPage;
