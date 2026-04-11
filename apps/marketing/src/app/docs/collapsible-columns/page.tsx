import { Metadata } from "next";
import CollapsibleColumnsContent from "@/components/pages/docs-pages/CollapsibleColumnsContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.collapsibleColumns.title,
  description: SEO_STRINGS.collapsibleColumns.description,
  keywords: SEO_STRINGS.collapsibleColumns.keywords,
  openGraph: {
    title: SEO_STRINGS.collapsibleColumns.title,
    description: SEO_STRINGS.collapsibleColumns.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.collapsibleColumns.title,
    description: SEO_STRINGS.collapsibleColumns.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/collapsible-columns",
  },
};

const CollapsibleColumnsPage = () => {
  return <CollapsibleColumnsContent />;
};

export default CollapsibleColumnsPage;
