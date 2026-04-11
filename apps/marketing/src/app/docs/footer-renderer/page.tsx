import { Metadata } from "next";
import FooterRendererContent from "@/components/pages/docs-pages/FooterRendererContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.footerRenderer.title,
  description: SEO_STRINGS.footerRenderer.description,
  keywords: SEO_STRINGS.footerRenderer.keywords,
  openGraph: {
    title: SEO_STRINGS.footerRenderer.title,
    description: SEO_STRINGS.footerRenderer.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.footerRenderer.title,
    description: SEO_STRINGS.footerRenderer.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/footer-renderer",
  },
};

const FooterRendererPage = () => {
  return <FooterRendererContent />;
};

export default FooterRendererPage;
