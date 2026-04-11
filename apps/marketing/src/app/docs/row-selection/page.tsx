import { Metadata } from "next";
import RowSelectionContent from "@/components/pages/docs-pages/RowSelectionContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.rowSelection.title,
  description: SEO_STRINGS.rowSelection.description,
  keywords: SEO_STRINGS.rowSelection.keywords,
  openGraph: {
    title: SEO_STRINGS.rowSelection.title,
    description: SEO_STRINGS.rowSelection.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.rowSelection.title,
    description: SEO_STRINGS.rowSelection.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/row-selection",
  },
};

const RowSelectionPage = () => {
  return <RowSelectionContent />;
};

export default RowSelectionPage;
