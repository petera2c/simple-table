import ColumnPinningContent from "@/components/pages/docs-pages/ColumnPinningContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SEO_STRINGS.columnPinning.title,
  description: SEO_STRINGS.columnPinning.description,
  keywords: SEO_STRINGS.columnPinning.keywords,
  openGraph: {
    title: SEO_STRINGS.columnPinning.title,
    description: SEO_STRINGS.columnPinning.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.columnPinning.title,
    description: SEO_STRINGS.columnPinning.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/column-pinning",
  },
};

const ColumnPinningPage = () => {
  return <ColumnPinningContent />;
};

export default ColumnPinningPage;
