import { Metadata } from "next";
import CellClickingContent from "@/components/pages/docs-pages/CellClickingContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.cellClicking.title,
  description: SEO_STRINGS.cellClicking.description,
  keywords: SEO_STRINGS.cellClicking.keywords,
  openGraph: {
    title: SEO_STRINGS.cellClicking.title,
    description: SEO_STRINGS.cellClicking.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.cellClicking.title,
    description: SEO_STRINGS.cellClicking.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/cell-clicking",
  },
};

const CellClickingPage = () => {
  return <CellClickingContent />;
};

export default CellClickingPage;
