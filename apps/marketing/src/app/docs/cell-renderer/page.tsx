import { Metadata } from "next";
import CellRendererContent from "@/components/pages/docs-pages/CellRendererContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.cellRenderer.title,
  description: SEO_STRINGS.cellRenderer.description,
  keywords: SEO_STRINGS.cellRenderer.keywords,
  openGraph: {
    title: SEO_STRINGS.cellRenderer.title,
    description: SEO_STRINGS.cellRenderer.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.cellRenderer.title,
    description: SEO_STRINGS.cellRenderer.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/cell-renderer",
  },
};

const CellRendererPage = () => {
  return <CellRendererContent />;
};

export default CellRendererPage;
