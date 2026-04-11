import { Metadata } from "next";
import InstallationContent from "@/components/pages/docs-pages/InstallationContent";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.installation.title,
  description: SEO_STRINGS.installation.description,
  keywords: SEO_STRINGS.installation.keywords,
  openGraph: {
    title: SEO_STRINGS.installation.title,
    description: SEO_STRINGS.installation.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.installation.title,
    description: SEO_STRINGS.installation.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/installation",
  },
};

const InstallationPage = () => {
  return <InstallationContent />;
};

export default InstallationPage;
