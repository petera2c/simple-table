import NestedHeadersContent from "@/components/pages/docs-pages/NestedHeadersContent";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";
import DocsDemoCode from "@/components/DocsDemoCode";

export const metadata: Metadata = {
  title: SEO_STRINGS.nestedHeaders.title,
  description: SEO_STRINGS.nestedHeaders.description,
  keywords: SEO_STRINGS.nestedHeaders.keywords,
  openGraph: {
    title: SEO_STRINGS.nestedHeaders.title,
    description: SEO_STRINGS.nestedHeaders.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.nestedHeaders.title,
    description: SEO_STRINGS.nestedHeaders.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/nested-headers",
  },
};

const NestedHeadersPage = () => {
  return (
    <DocsDemoCode slug="nested-headers">
      <NestedHeadersContent />
    </DocsDemoCode>
  );
};

export default NestedHeadersPage;
