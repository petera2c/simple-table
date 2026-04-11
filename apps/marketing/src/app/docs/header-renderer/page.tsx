import { Metadata } from "next";
import HeaderRendererContent from "@/components/pages/docs-pages/HeaderRendererContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.headerRenderer.title,
  description: SEO_STRINGS.headerRenderer.description,
  keywords: SEO_STRINGS.headerRenderer.keywords,
  openGraph: {
    title: SEO_STRINGS.headerRenderer.title,
    description: SEO_STRINGS.headerRenderer.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.headerRenderer.title,
    description: SEO_STRINGS.headerRenderer.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/header-renderer",
  },
};

const HeaderRendererPage = () => {
  return <HeaderRendererContent />;
};

export default HeaderRendererPage;
