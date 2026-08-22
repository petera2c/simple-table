import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import TdgpContent from "@/components/pages/docs-pages/TdgpContent";
import DocsDemoCode from "@/components/DocsDemoCode";

export const metadata: Metadata = {
  title: SEO_STRINGS.tdgp.title,
  description: SEO_STRINGS.tdgp.description,
  keywords: SEO_STRINGS.tdgp.keywords,
  openGraph: {
    title: SEO_STRINGS.tdgp.title,
    description: SEO_STRINGS.tdgp.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.tdgp.title,
    description: SEO_STRINGS.tdgp.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/tdgp",
  },
};

const TdgpPage = () => {
  return (
    <DocsDemoCode slug="tdgp">
      <TdgpContent />
    </DocsDemoCode>
  );
};

export default TdgpPage;
