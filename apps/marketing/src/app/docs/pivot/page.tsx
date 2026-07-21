import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import PivotContent from "@/components/pages/docs-pages/PivotContent";
import DocsDemoCode from "@/components/DocsDemoCode";

export const metadata: Metadata = {
  title: SEO_STRINGS.pivot.title,
  description: SEO_STRINGS.pivot.description,
  keywords: SEO_STRINGS.pivot.keywords,
  openGraph: {
    title: SEO_STRINGS.pivot.title,
    description: SEO_STRINGS.pivot.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.pivot.title,
    description: SEO_STRINGS.pivot.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/pivot",
  },
};

const PivotPage = () => {
  return (
    <DocsDemoCode slug="pivot">
      <PivotContent />
    </DocsDemoCode>
  );
};

export default PivotPage;
