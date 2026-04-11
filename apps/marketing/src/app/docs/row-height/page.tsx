import RowHeightContent from "@/components/pages/docs-pages/RowHeightContent";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.rowHeight.title,
  description: SEO_STRINGS.rowHeight.description,
  keywords: SEO_STRINGS.rowHeight.keywords,
  openGraph: {
    title: SEO_STRINGS.rowHeight.title,
    description: SEO_STRINGS.rowHeight.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.rowHeight.title,
    description: SEO_STRINGS.rowHeight.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/row-height",
  },
};

export default function RowHeightPage() {
  return <RowHeightContent />;
}
