import { Metadata } from "next";
import CellEditingContent from "@/components/pages/docs-pages/CellEditingContent";
import { SEO_STRINGS } from "@/constants/strings/seo";
import DocsDemoCode from "@/components/DocsDemoCode";

export const metadata: Metadata = {
  title: SEO_STRINGS.cellEditing.title,
  description: SEO_STRINGS.cellEditing.description,
  keywords: SEO_STRINGS.cellEditing.keywords,
  openGraph: {
    title: SEO_STRINGS.cellEditing.title,
    description: SEO_STRINGS.cellEditing.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.cellEditing.title,
    description: SEO_STRINGS.cellEditing.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/cell-editing",
  },
};

const CellEditingPage = () => {
  return (
    <DocsDemoCode slug="cell-editing">
      <CellEditingContent />
    </DocsDemoCode>
  );
};

export default CellEditingPage;
