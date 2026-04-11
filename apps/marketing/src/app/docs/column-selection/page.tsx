import { Metadata } from "next";
import ColumnSelectionContent from "@/components/pages/docs-pages/ColumnSelectionContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.columnSelection.title,
  description: SEO_STRINGS.columnSelection.description,
  keywords: SEO_STRINGS.columnSelection.keywords,
  openGraph: {
    title: SEO_STRINGS.columnSelection.title,
    description: SEO_STRINGS.columnSelection.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.columnSelection.title,
    description: SEO_STRINGS.columnSelection.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/column-selection",
  },
};

const ColumnSelectionPage = () => {
  return <ColumnSelectionContent />;
};

export default ColumnSelectionPage;
