import CustomIconsContent from "@/components/pages/docs-pages/CustomIconsContent";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.customIcons.title,
  description: SEO_STRINGS.customIcons.description,
  keywords: SEO_STRINGS.customIcons.keywords,
  openGraph: {
    title: SEO_STRINGS.customIcons.title,
    description: SEO_STRINGS.customIcons.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.customIcons.title,
    description: SEO_STRINGS.customIcons.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/custom-icons",
  },
};
const CustomIconsPage = () => {
  return <CustomIconsContent />;
};

export default CustomIconsPage;
