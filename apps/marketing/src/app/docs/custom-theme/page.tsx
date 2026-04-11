import CustomThemeContent from "@/components/pages/docs-pages/CustomThemeContent";
import { Metadata } from "next";
import { SEO_STRINGS } from "@/constants/strings/seo";

export const metadata: Metadata = {
  title: SEO_STRINGS.customTheme.title,
  description: SEO_STRINGS.customTheme.description,
  keywords: SEO_STRINGS.customTheme.keywords,
  openGraph: {
    title: SEO_STRINGS.customTheme.title,
    description: SEO_STRINGS.customTheme.description,
    type: "article",
    images: [SEO_STRINGS.site.ogImage],
    siteName: SEO_STRINGS.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STRINGS.customTheme.title,
    description: SEO_STRINGS.customTheme.description,
    creator: SEO_STRINGS.site.creator,
    images: SEO_STRINGS.site.ogImage.url,
  },
  alternates: {
    canonical: "/docs/custom-theme",
  },
};

const CustomThemePage = () => {
  return <CustomThemeContent />;
};

export default CustomThemePage;
