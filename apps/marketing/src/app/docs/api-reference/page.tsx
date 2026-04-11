import { Metadata } from "next";
import ApiReferenceContent from "@/components/pages/docs-pages/ApiReferenceContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.apiReference.title,
  description: SEO_STRINGS.apiReference.description,
  keywords: SEO_STRINGS.apiReference.keywords,
  openGraph: {
    title: SEO_STRINGS.apiReference.title,
    description: SEO_STRINGS.apiReference.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.apiReference.title,
    description: SEO_STRINGS.apiReference.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/api-reference",
  },
};

const ApiReferencePage = () => {
  return <ApiReferenceContent />;
};

export default ApiReferencePage;
